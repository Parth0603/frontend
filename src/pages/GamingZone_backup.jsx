import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import '../styles/gaming.css';

function GamingZone({ navigate }) {
  const [userRole, setUserRole] = useState('select');
  const [sessionActive, setSessionActive] = useState(false);
  const [meetingId, setMeetingId] = useState('');
  const [sessionTime, setSessionTime] = useState(0);
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [joinRoomId, setJoinRoomId] = useState('');
  const [userName, setUserName] = useState('');
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  
  const localVideoRef = useRef();
  const socketRef = useRef();
  const messagesEndRef = useRef();
  const peersRef = useRef({});
  const localStreamRef = useRef(null);
  const screenStreamRef = useRef(null);

  useEffect(() => {
    let timer;
    if (sessionActive) {
      timer = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [sessionActive]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      Object.values(peersRef.current).forEach(pc => pc.close());
    };
  }, []);

  const initializeSocket = () => {
    console.log('=== INITIALIZING SOCKET ===');
    socketRef.current = io('http://localhost:5000');
    
    socketRef.current.on('user-joined', (data) => {
      console.log('=== USER JOINED EVENT ===', data);
      setParticipants(prev => {
        // Check if user already exists
        const exists = prev.find(p => p.id === data.userId);
        if (exists) {
          console.log('=== USER ALREADY IN PARTICIPANTS ===', data.userId);
          return prev;
        }
        
        const newParticipants = [...prev, {
          id: data.userId,
          name: data.userName || `User ${data.userId.substring(0, 5)}`,
          avatar: data.userName?.substring(0, 2).toUpperCase() || 'U',
          audio: true,
          video: true
        }];
        console.log('=== UPDATED PARTICIPANTS ===', newParticipants.length);
        return newParticipants;
      });
      
      // Create peer connection with delay to ensure media is ready
      setTimeout(() => {
        createPeerConnection(data.userId);
      }, 500);
    });

    socketRef.current.on('room-users', (users) => {
      console.log('=== EXISTING USERS IN ROOM ===', users);
      users.forEach(userId => {
        setParticipants(prev => {
          const exists = prev.find(p => p.id === userId);
          if (!exists) {
            const newParticipants = [...prev, {
              id: userId,
              name: `User ${userId.substring(0, 5)}`,
              avatar: 'U',
              audio: true,
              video: true
            }];
            console.log('=== ADDED EXISTING USER ===', userId);
            return newParticipants;
          }
          return prev;
        });
        
        // Create peer connection with delay
        setTimeout(() => {
          createPeerConnection(userId);
        }, 1000);
      });
    });

    socketRef.current.on('user-left', (data) => {
      console.log('=== USER LEFT ===', data.userId);
      if (peersRef.current[data.userId]) {
        peersRef.current[data.userId].close();
        delete peersRef.current[data.userId];
      }
      setParticipants(prev => prev.filter(p => p.id !== data.userId));
      const videoContainer = document.getElementById(`video-container-${data.userId}`);
      if (videoContainer) videoContainer.remove();
      console.log('=== CLEANED UP USER ===', data.userId);
    });

    socketRef.current.on('webrtc-signal', async (data) => {
      console.log('=== RECEIVED WEBRTC SIGNAL ===', data.from, 'Type:', data.signal.type || 'ice-candidate');
      await handleWebRTCSignal(data.signal, data.from);
    });

    socketRef.current.on('message', (message) => {
      console.log('Received message:', message);
      setMessages(prev => [...prev, message]);
    });



    socketRef.current.on('user-disconnected', (userId) => {
      if (peersRef.current[userId]) {
        peersRef.current[userId].close();
        delete peersRef.current[userId];
      }
      setParticipants(prev => prev.filter(p => p.id !== userId));
      const videoToRemove = document.getElementById(`video-${userId}`);
      if (videoToRemove) videoToRemove.remove();
    });

    socketRef.current.on('connect', () => {
      console.log('=== SOCKET CONNECTED ===', socketRef.current.id);
    });

    socketRef.current.on('test-response', (data) => {
      console.log('=== TEST RESPONSE FROM BACKEND ===', data);
    });

    socketRef.current.on('room-created', (data) => {
      console.log('=== ROOM CREATED SUCCESSFULLY ===', data);
    });

    socketRef.current.on('room-joined', (data) => {
      console.log('=== ROOM JOINED SUCCESSFULLY ===', data);
    });

    socketRef.current.on('room-not-found', (data) => {
      console.log('=== ROOM NOT FOUND ===', data);
      alert('Gaming room not found. Please check the room ID.');
      setSessionActive(false);
    });
  };





  const handleWebRTCSignal = async (signal, from) => {
    let peer = peersRef.current[from];
    
    // Create peer connection if it doesn't exist (for incoming offers)
    if (!peer && signal.type === 'offer') {
      console.log('=== CREATING PEER FOR INCOMING OFFER ===', from);
      peer = await createPeerConnectionForIncoming(from);
    }
    
    if (!peer) {
      console.log('=== NO PEER CONNECTION FOR SIGNAL ===', from);
      return;
    }

    try {
      if (signal.type === 'offer') {
        console.log('=== HANDLING OFFER ===', from);
        await peer.setRemoteDescription(new RTCSessionDescription(signal));
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        console.log('=== SENDING ANSWER ===', from);
        socketRef.current.emit('webrtc-signal', {
          signal: answer,
          to: from
        });
      } else if (signal.type === 'answer') {
        console.log('=== HANDLING ANSWER ===', from);
        await peer.setRemoteDescription(new RTCSessionDescription(signal));
      } else if (signal.candidate) {
        console.log('=== HANDLING ICE CANDIDATE ===', from);
        await peer.addIceCandidate(new RTCIceCandidate(signal));
      }
    } catch (error) {
      console.error('=== ERROR HANDLING WEBRTC SIGNAL ===', error);
    }
  };
  
  const createPeerConnectionForIncoming = async (userId) => {
    console.log('=== CREATING PEER FOR INCOMING ===', userId);
    const peer = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });
    
    peersRef.current[userId] = peer;

    // Add local stream tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        console.log('=== ADDING LOCAL TRACK TO INCOMING PEER ===', track.kind);
        peer.addTrack(track, localStreamRef.current);
      });
    }

    // Handle remote stream
    peer.ontrack = (event) => {
      console.log('=== REMOTE STREAM FROM INCOMING PEER ===', userId);
      addRemoteVideo(event.streams[0], userId);
    };
    
    // Handle ICE candidates
    peer.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('=== SENDING ICE FROM INCOMING PEER ===', userId);
        socketRef.current.emit('webrtc-signal', {
          signal: event.candidate,
          to: userId
        });
      }
    };

    return peer;
  };

  const createPeerConnection = async (userId) => {
    if (peersRef.current[userId]) {
      console.log('=== PEER CONNECTION EXISTS ===', userId);
      return peersRef.current[userId];
    }

    console.log('=== CREATING PEER CONNECTION ===', userId);
    const peer = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });
    
    peersRef.current[userId] = peer;

    // Add local stream tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        console.log('=== ADDING LOCAL TRACK ===', track.kind, 'to peer:', userId);
        peer.addTrack(track, localStreamRef.current);
      });
    }

    // Handle remote stream
    peer.ontrack = (event) => {
      console.log('=== REMOTE STREAM RECEIVED ===', userId);
      addRemoteVideo(event.streams[0], userId);
    };
    
    // Handle ICE candidates
    peer.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('=== SENDING ICE CANDIDATE ===', userId);
        socketRef.current.emit('webrtc-signal', {
          signal: event.candidate,
          to: userId
        });
      }
    };

    // Connection state monitoring
    peer.onconnectionstatechange = () => {
      console.log('=== PEER CONNECTION STATE ===', userId, peer.connectionState);
    };

    // Create offer immediately
    try {
      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);
      console.log('=== SENDING OFFER ===', userId);
      socketRef.current.emit('webrtc-signal', {
        signal: offer,
        to: userId
      });
    } catch (error) {
      console.error('=== ERROR CREATING OFFER ===', error);
    }
    
    console.log('=== ACTIVE PEER CONNECTIONS ===', Object.keys(peersRef.current));
    return peer;
  };

  const addRemoteVideo = (stream, userId) => {
    console.log('Adding remote video for user:', userId);
    
    // Remove existing video if present
    const existingVideo = document.getElementById(`remote-video-${userId}`);
    if (existingVideo) {
      existingVideo.remove();
    }
    
    // Find video grid
    const videoGrid = document.querySelector('.video-grid');
    if (!videoGrid) {
      console.error('Video grid not found');
      return;
    }
    
    // Create video container
    const videoContainer = document.createElement('div');
    videoContainer.className = 'participant-video';
    videoContainer.id = `video-container-${userId}`;
    
    // Create video element
    const video = document.createElement('video');
    video.id = `remote-video-${userId}`;
    video.srcObject = stream;
    video.autoplay = true;
    video.playsInline = true;
    video.muted = false;
    video.className = 'video-element';
    
    // Create video stream wrapper
    const videoStream = document.createElement('div');
    videoStream.className = 'video-stream';
    videoStream.appendChild(video);
    
    // Create name label
    const videoName = document.createElement('div');
    videoName.className = 'video-name';
    videoName.innerHTML = `<span class="participant-name">User ${userId.substring(0, 5)}</span>`;
    
    // Create controls
    const controls = document.createElement('div');
    controls.className = 'participant-controls';
    controls.innerHTML = `
      <span class="control-indicator active">
        <i class="fas fa-microphone"></i>
      </span>
      <span class="control-indicator active">
        <i class="fas fa-video"></i>
      </span>
    `;
    
    // Assemble container
    videoContainer.appendChild(videoStream);
    videoContainer.appendChild(videoName);
    videoContainer.appendChild(controls);
    
    // Add to grid
    videoGrid.appendChild(videoContainer);
    
    // Play video
    video.play().catch(e => console.log('Video play error:', e));
    
    console.log('Remote video added for:', userId);
  };

  const addVideoStream = (stream, userId) => {
    const videoGrid = document.querySelector('.video-grid');
    if (!videoGrid) return;
    
    const videoContainer = document.createElement('div');
    videoContainer.className = 'participant-video';
    videoContainer.id = `video-${userId}`;
    
    const videoStream = document.createElement('div');
    videoStream.className = 'video-stream';
    
    const video = document.createElement('video');
    video.srcObject = stream;
    video.autoplay = true;
    video.playsInline = true;
    video.className = 'video-element';
    video.setAttribute('data-user-id', userId);
    
    const videoName = document.createElement('div');
    videoName.className = 'video-name';
    videoName.innerHTML = `<span class="participant-name">User ${userId.substring(0, 5)}</span>`;
    
    const controls = document.createElement('div');
    controls.className = 'participant-controls';
    controls.innerHTML = `
      <span class="control-indicator active">
        <i class="fas fa-microphone"></i>
      </span>
      <span class="control-indicator active">
        <i class="fas fa-video"></i>
      </span>
    `;
    
    videoStream.appendChild(video);
    videoContainer.appendChild(videoStream);
    videoContainer.appendChild(videoName);
    videoContainer.appendChild(controls);
    videoGrid.appendChild(videoContainer);
    
    video.play().catch(e => console.log('Video play error:', e));
  };

  const getMediaStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      localStreamRef.current = stream;
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.play().catch(e => console.log('Local video play error:', e));
      }
      
      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      alert('Could not access camera/microphone. Please check permissions.');
      return null;
    }
  };

  const startSession = async () => {
    const roomId = 'GAME-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    setMeetingId(roomId);
    setSessionActive(true);
    setSessionTime(0);
    
    initializeSocket();
    await getMediaStream();
    
    socketRef.current.on('connect', () => {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const hostData = {
        name: currentUser.name || 'Host',
        email: currentUser.email || '',
        id: socketRef.current.id
      };
      
      console.log('=== HOST CREATING ROOM ===', roomId);
      socketRef.current.emit('create-room', { roomId, host: hostData });
      
      // Wait a bit then join the room
      setTimeout(() => {
        console.log('=== HOST JOINING ROOM ===', roomId);
        socketRef.current.emit('join-room', roomId, hostData);
      }, 100);
      
      setParticipants([{
        id: socketRef.current.id,
        name: hostData.name,
        avatar: hostData.name.substring(0, 2).toUpperCase(),
        isHost: true,
        audio: true,
        video: true
      }]);
    });
  };

  const joinSession = async () => {
    if (!joinRoomId.trim() || !userName.trim()) {
      alert('Please enter both room ID and your name');
      return;
    }
    
    setMeetingId(joinRoomId);
    setSessionActive(true);
    
    initializeSocket();
    await getMediaStream();
    
    socketRef.current.on('connect', () => {
      const userData = {
        name: userName,
        avatar: userName.substring(0, 2).toUpperCase(),
        id: socketRef.current.id
      };
      
      console.log('=== USER JOINING ROOM ===', joinRoomId);
      socketRef.current.emit('join-room', joinRoomId, userData);
      
      setParticipants([{
        id: socketRef.current.id,
        name: userName,
        avatar: userName.substring(0, 2).toUpperCase(),
        isHost: false,
        audio: true,
        video: true
      }]);
    });
  };

  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const startScreenShare = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      setIsScreenSharing(true);
      screenStreamRef.current = screenStream;
      const screenTrack = screenStream.getVideoTracks()[0];
      
      // Replace video track for all connected peers
      Object.values(peersRef.current).forEach(peer => {
        const sender = peer.getSenders().find(s => s.track && s.track.kind === 'video');
        if (sender) sender.replaceTrack(screenTrack);
      });

      // Update local video element to show the screen share
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = screenStream;
        localVideoRef.current.classList.add('screen-share');
      }

      // Listen for when the user stops sharing via the browser's UI
      screenTrack.onended = () => stopScreenShare();
    } catch (err) {
      console.error('Screen share error:', err);
    }
  };

  const stopScreenShare = () => {
    if (!isScreenSharing) return;
    setIsScreenSharing(false);
    
    if (localStreamRef.current) {
      const cameraTrack = localStreamRef.current.getVideoTracks()[0];

      // Replace the screen track with the camera track for all peers
      Object.values(peersRef.current).forEach(peer => {
        const sender = peer.getSenders().find(s => s.track && s.track.kind === 'video');
        if (sender) sender.replaceTrack(cameraTrack);
      });
    }

    // Stop the screen share stream
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => track.stop());
      screenStreamRef.current = null;
    }

    // Update local video back to the camera
    if (localVideoRef.current && localStreamRef.current) {
      localVideoRef.current.srcObject = localStreamRef.current;
      localVideoRef.current.classList.remove('screen-share');
    }
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const currentParticipant = participants.find(p => p.id === socketRef.current?.id);
      const message = {
        id: Date.now(),
        sender: currentParticipant?.name || userName || 'User',
        message: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      socketRef.current.emit('send-message', {
        roomId: meetingId,
        message
      });
      
      setNewMessage('');
    }
  };

  const copyMeetingLink = () => {
    navigator.clipboard.writeText(meetingId);
    setShowCopySuccess(true);
    setTimeout(() => setShowCopySuccess(false), 2000);
  };

  const endSession = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => track.stop());
    }
    Object.values(peersRef.current).forEach(pc => pc.close());
    
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    
    setSessionActive(false);
    setMeetingId('');
    setParticipants([]);
    setMessages([]);
    peersRef.current = {};
  };



  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };



  if (userRole === 'select') {
    return (
      <>
        <nav className="navbar zone-nav">
          <div className="nav-container">
            <div className="nav-logo" onClick={() => navigate('dashboard')}>
              <h2>SYNTRA</h2>
            </div>
            <div className="nav-breadcrumb">
              <i className="fas fa-gamepad"></i>
              <span>Gaming Zone</span>
            </div>
            <button className="nav-back-btn" onClick={() => navigate('dashboard')}>
              <i className="fas fa-arrow-left"></i>
            </button>
          </div>
        </nav>

        <div className="zone-container gaming-zone">
          <div className="zone-hero">
            <div className="hero-content">
              <h1>Gaming Zone</h1>
              <p>Casual gaming environment with voice chat and screen sharing</p>
              <div className="zone-stats">
                <div className="stat">
                  <span className="number">2.5K+</span>
                  <span className="label">Games Played</span>
                </div>
                <div className="stat">
                  <span className="number">850+</span>
                  <span className="label">Tournaments</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="role-selection modern">
            <div className="role-card host" onClick={() => setUserRole('host')}>
              <div className="role-icon">
                <i className="fas fa-crown"></i>
              </div>
              <div className="role-content">
                <h3>Create Gaming Room</h3>
                <p>Start a gaming session and invite friends</p>
                <div className="role-features">
                  <span><i className="fas fa-microphone"></i> Voice Chat</span>
                  <span><i className="fas fa-desktop"></i> Screen Share</span>
                  <span><i className="fas fa-trophy"></i> Tournaments</span>
                  <span><i className="fas fa-users"></i> Group Play</span>
                </div>
              </div>
              <div className="role-action">
                <span>Create Room</span>
                <i className="fas fa-arrow-right"></i>
              </div>
            </div>
            
            <div className="role-card player" onClick={() => setUserRole('user')}>
              <div className="role-icon">
                <i className="fas fa-gamepad"></i>
              </div>
              <div className="role-content">
                <h3>Join Gaming Room</h3>
                <p>Join a gaming session with room ID</p>
                <div className="role-features">
                  <span><i className="fas fa-headset"></i> Audio Chat</span>
                  <span><i className="fas fa-video"></i> Video Call</span>
                  <span><i className="fas fa-share"></i> Share Screen</span>
                  <span><i className="fas fa-comments"></i> Group Chat</span>
                </div>
              </div>
              <div className="role-action">
                <span>Join Room</span>
                <i className="fas fa-arrow-right"></i>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (userRole === 'host') {
    return (
      <>
        <nav className="navbar zone-nav gaming">
          <div className="nav-container">
            <div className="nav-logo" onClick={() => navigate('dashboard')}>
              <h2>SYNTRA</h2>
            </div>
            <div className="nav-info">
              {sessionActive && (
                <>
                  <div className="session-info">
                    <span className="session-id">ID: {meetingId}</span>
                    <span className="session-time">{formatTime(sessionTime)}</span>
                  </div>
                  <div className="live-indicator">
                    <span className="pulse"></span>
                    <span>LIVE</span>
                  </div>
                </>
              )}
            </div>
            <div className="nav-actions">
              {sessionActive && (
                <button className="share-btn" onClick={copyMeetingLink}>
                  <i className="fas fa-copy"></i>
                  Copy ID
                </button>
              )}
              <button className="nav-back-btn" onClick={() => setUserRole('select')}>
                <i className="fas fa-arrow-left"></i>
              </button>
            </div>
          </div>
        </nav>

        <div className="gaming-container">
          {!sessionActive ? (
            <div className="pre-session">
              <div className="session-setup">
                <div className="setup-header">
                  <h1>Ready to Game?</h1>
                  <p>Set up your gaming room and invite friends</p>
                </div>
                
                <div className="setup-card">
                  <div className="setup-preview">
                    <div className="preview-video">
                      <i className="fas fa-gamepad"></i>
                      <span>Gaming Setup</span>
                    </div>
                    <div className="preview-controls">
                      <button className="control-btn active">
                        <i className="fas fa-microphone"></i>
                      </button>
                      <button className="control-btn active">
                        <i className="fas fa-video"></i>
                      </button>
                    </div>
                  </div>
                  
                  <div className="setup-options">
                    <h3>Room Settings</h3>
                    <div className="option-group">
                      <label>
                        <input type="checkbox" defaultChecked />
                        <span>Enable voice chat</span>
                      </label>
                      <label>
                        <input type="checkbox" defaultChecked />
                        <span>Allow screen sharing</span>
                      </label>
                      <label>
                        <input type="checkbox" defaultChecked />
                        <span>Enable group chat</span>
                      </label>
                      <label>
                        <input type="checkbox" />
                        <span>Tournament mode</span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <button className="start-session-btn" onClick={startSession}>
                  <i className="fas fa-play"></i>
                  <span>Start Gaming Session</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="gaming-interface">
              <div className="main-area">
                <div className="video-grid">
                  {/* Local Video */}
                  <div className="participant-video local">
                    <div className="video-stream">
                      <video 
                        ref={localVideoRef}
                        autoPlay 
                        muted 
                        playsInline
                        className="video-element"
                      />
                      {isScreenSharing && (
                        <div className="screen-badge"><i className="fas fa-desktop"></i></div>
                      )}
                    </div>
                    <div className="video-name">
                      <span className="participant-name">You (Host)</span>
                    </div>
                    <div className="participant-controls">
                      <span className={`control-indicator ${isAudioEnabled ? 'active' : 'muted'}`}>
                        <i className={`fas ${isAudioEnabled ? 'fa-microphone' : 'fa-microphone-slash'}`}></i>
                      </span>
                      <span className={`control-indicator ${isVideoEnabled ? 'active' : 'muted'}`}>
                        <i className={`fas ${isVideoEnabled ? 'fa-video' : 'fa-video-slash'}`}></i>
                      </span>
                    </div>
                  </div>
                  
                  {/* Remote Videos */}
                  {participants.filter(p => p.id !== socketRef.current?.id).map(participant => (
                    <div key={participant.id} className="participant-video">
                      <div className="video-stream">
                        <div className="video-placeholder">
                          <div className="participant-avatar">
                            <span>{participant.avatar}</span>
                          </div>
                          <div className="connecting-text">Connecting...</div>
                        </div>
                      </div>
                      <div className="video-name">
                        <span className="participant-name">{participant.name}</span>
                      </div>
                      <div className="participant-controls">
                        <span className="control-indicator active">
                          <i className="fas fa-microphone"></i>
                        </span>
                        <span className="control-indicator active">
                          <i className="fas fa-video"></i>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="gaming-controls">
                  <button 
                    className={`control-btn ${isAudioEnabled ? 'active' : 'muted'}`}
                    onClick={toggleAudio}
                  >
                    <i className={`fas ${isAudioEnabled ? 'fa-microphone' : 'fa-microphone-slash'}`}></i>
                    <span>Mic</span>
                  </button>
                  <button 
                    className={`control-btn ${isVideoEnabled ? 'active' : 'muted'}`}
                    onClick={toggleVideo}
                  >
                    <i className={`fas ${isVideoEnabled ? 'fa-video' : 'fa-video-slash'}`}></i>
                    <span>Camera</span>
                  </button>
                  <button 
                    className={`control-btn ${isScreenSharing ? 'active' : ''}`}
                    onClick={isScreenSharing ? stopScreenShare : startScreenShare}
                  >
                    <i className="fas fa-desktop"></i>
                    <span>{isScreenSharing ? 'Stop Share' : 'Share'}</span>
                  </button>
                  <button className="control-btn" onClick={copyMeetingLink}>
                    <i className="fas fa-copy"></i>
                    <span>Copy ID</span>
                  </button>
                  <button className="control-btn end-btn" onClick={endSession}>
                    <i className="fas fa-phone-slash"></i>
                    <span>Leave</span>
                  </button>
                </div>
              </div>

              <div className="sidebar">
                <div className="participants-panel">
                  <div className="panel-header">
                    <h3><i className="fas fa-users"></i> Participants ({participants.filter(p => p.id !== socketRef.current?.id).length})</h3>
                  </div>
                  <div className="participants-list">
                    {participants.map((participant) => (
                      <div key={participant.id} className="participant-item">
                        <div className="participant-avatar">
                          <span>{participant.avatar}</span>
                        </div>
                        <div className="participant-info">
                          <span className="name">{participant.name}</span>
                          {participant.isHost && <span className="host-label">Host</span>}
                        </div>
                        <div className="participant-status">
                          <span className={`status-indicator ${participant.audio ? 'active' : 'muted'}`}>
                            <i className={`fas ${participant.audio ? 'fa-microphone' : 'fa-microphone-slash'}`}></i>
                          </span>
                          <span className={`status-indicator ${participant.video ? 'active' : 'muted'}`}>
                            <i className={`fas ${participant.video ? 'fa-video' : 'fa-video-slash'}`}></i>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="chat-panel">
                  <div className="panel-header">
                    <h3><i className="fas fa-comments"></i> Game Chat</h3>
                  </div>
                  <div className="chat-messages">
                    {messages.map(msg => (
                      <div key={msg.id} className="message">
                        <div className="message-header">
                          <span className="sender">{msg.sender}</span>
                          <span className="time">{msg.time}</span>
                        </div>
                        <div className="message-content">{msg.message}</div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                  <div className="chat-input">
                    <input 
                      type="text" 
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <button className="send-btn" onClick={sendMessage}>
                      <i className="fas fa-paper-plane"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </>
    );
  }

  if (userRole === 'user') {
    return (
      <>
        <nav className="navbar zone-nav">
          <div className="nav-container">
            <div className="nav-logo" onClick={() => navigate('dashboard')}>
              <h2>SYNTRA</h2>
            </div>
            <div className="nav-breadcrumb">
              <span>Join Gaming Room</span>
            </div>
            <button className="nav-back-btn" onClick={() => setUserRole('select')}>
              <i className="fas fa-arrow-left"></i>
            </button>
          </div>
        </nav>

        <div className="gaming-container">
          {!sessionActive ? (
            <div className="zone-container">
              <div className="join-session">
                <div className="join-header">
                  <h1>Join Gaming Room</h1>
                  <p>Enter the room ID shared by the host</p>
                </div>
                
                <div className="join-form">
                  <div className="input-group">
                    <input 
                      type="text" 
                      placeholder="Your name" 
                      className="meeting-input"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                    />
                    <input 
                      type="text" 
                      placeholder="Enter room ID (e.g., GAME-ABC123XYZ)" 
                      className="meeting-input"
                      value={joinRoomId}
                      onChange={(e) => setJoinRoomId(e.target.value)}
                    />
                    <button className="join-btn" onClick={joinSession}>
                      <i className="fas fa-sign-in-alt"></i>
                      Join Room
                    </button>
                  </div>
                </div>
                
                <div className="gaming-features">
                  <div className="feature-item">
                    <i className="fas fa-microphone"></i>
                    <span>Voice chat with all players</span>
                  </div>
                  <div className="feature-item">
                    <i className="fas fa-video"></i>
                    <span>Video chat and face cam</span>
                  </div>
                  <div className="feature-item">
                    <i className="fas fa-desktop"></i>
                    <span>Share your screen anytime</span>
                  </div>
                  <div className="feature-item">
                    <i className="fas fa-trophy"></i>
                    <span>Compete in tournaments</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="gaming-interface">
              <div className="main-area">
                <div className="video-grid">
                  <div className="participant-video local">
                    <div className="video-stream">
                      <video 
                        ref={localVideoRef}
                        autoPlay 
                        muted 
                        playsInline
                        className="video-element"
                      />
                      {isScreenSharing && (
                        <div className="screen-badge"><i className="fas fa-desktop"></i></div>
                      )}
                    </div>
                    <div className="video-name">
                      <span className="participant-name">You</span>
                    </div>
                    <div className="participant-controls">
                      <span className={`control-indicator ${isAudioEnabled ? 'active' : 'muted'}`}>
                        <i className={`fas ${isAudioEnabled ? 'fa-microphone' : 'fa-microphone-slash'}`}></i>
                      </span>
                      <span className={`control-indicator ${isVideoEnabled ? 'active' : 'muted'}`}>
                        <i className={`fas ${isVideoEnabled ? 'fa-video' : 'fa-video-slash'}`}></i>
                      </span>
                    </div>
                  </div>
                  
                  {/* Remote Videos */}
                  {participants.filter(p => p.id !== socketRef.current?.id).map(participant => (
                    <div key={participant.id} className="participant-video">
                      <div className="video-stream">
                        <div className="video-placeholder">
                          <div className="participant-avatar">
                            <span>{participant.avatar}</span>
                          </div>
                          <div className="connecting-text">Connecting...</div>
                        </div>
                      </div>
                      <div className="video-name">
                        <span className="participant-name">{participant.name}</span>
                      </div>
                      <div className="participant-controls">
                        <span className="control-indicator active">
                          <i className="fas fa-microphone"></i>
                        </span>
                        <span className="control-indicator active">
                          <i className="fas fa-video"></i>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="gaming-controls">
                  <button 
                    className={`control-btn ${isAudioEnabled ? 'active' : 'muted'}`}
                    onClick={toggleAudio}
                  >
                    <i className={`fas ${isAudioEnabled ? 'fa-microphone' : 'fa-microphone-slash'}`}></i>
                    <span>Mic</span>
                  </button>
                  <button 
                    className={`control-btn ${isVideoEnabled ? 'active' : 'muted'}`}
                    onClick={toggleVideo}
                  >
                    <i className={`fas ${isVideoEnabled ? 'fa-video' : 'fa-video-slash'}`}></i>
                    <span>Camera</span>
                  </button>
                  <button 
                    className={`control-btn ${isScreenSharing ? 'active' : ''}`}
                    onClick={isScreenSharing ? stopScreenShare : startScreenShare}
                  >
                    <i className="fas fa-desktop"></i>
                    <span>{isScreenSharing ? 'Stop Share' : 'Share'}</span>
                  </button>
                  <button className="control-btn end-btn" onClick={endSession}>
                    <i className="fas fa-phone-slash"></i>
                    <span>Leave</span>
                  </button>
                </div>
              </div>

              <div className="sidebar">
                <div className="participants-panel">
                  <div className="panel-header">
                    <h3><i className="fas fa-users"></i> Participants ({participants.filter(p => p.id !== socketRef.current?.id).length})</h3>
                  </div>
                  <div className="participants-list">
                    {participants.map((participant) => (
                      <div key={participant.id} className="participant-item">
                        <div className="participant-avatar">
                          <span>{participant.avatar}</span>
                        </div>
                        <div className="participant-info">
                          <span className="name">{participant.name}</span>
                          {participant.isHost && <span className="host-label">Host</span>}
                        </div>
                        <div className="participant-status">
                          <span className={`status-indicator ${participant.audio ? 'active' : 'muted'}`}>
                            <i className={`fas ${participant.audio ? 'fa-microphone' : 'fa-microphone-slash'}`}></i>
                          </span>
                          <span className={`status-indicator ${participant.video ? 'active' : 'muted'}`}>
                            <i className={`fas ${participant.video ? 'fa-video' : 'fa-video-slash'}`}></i>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="chat-panel">
                  <div className="panel-header">
                    <h3><i className="fas fa-comments"></i> Game Chat</h3>
                  </div>
                  <div className="chat-messages">
                    {messages.map(msg => (
                      <div key={msg.id} className="message">
                        <div className="message-header">
                          <span className="sender">{msg.sender}</span>
                          <span className="time">{msg.time}</span>
                        </div>
                        <div className="message-content">{msg.message}</div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                  <div className="chat-input">
                    <input 
                      type="text" 
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <button className="send-btn" onClick={sendMessage}>
                      <i className="fas fa-paper-plane"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {showCopySuccess && (
          <div className="copy-success-popup">
            <i className="fas fa-check-circle"></i>
            <span>Room ID copied!</span>
          </div>
        )}
      </>
    );
  }
}

export default GamingZone;
