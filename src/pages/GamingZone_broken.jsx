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
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [debugMessages, setDebugMessages] = useState([]);

  const addDebugMessage = (message) => {
    setDebugMessages(prev => [...prev.slice(-4), `${new Date().toLocaleTimeString()}: ${message}`]);
  };
  
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
    console.log('🔌 GAMING ZONE: Initializing socket connection');
    socketRef.current = io('http://localhost:5000');
    
    socketRef.current.on('user-connected', userId => {
      console.log('🎮 GAMING ZONE: User connected event received:', userId);
      addDebugMessage(`User connected: ${userId.substring(0, 5)}`);
      setConnectionStatus('Peer Connecting');
      
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
          console.log('🎮 GAMING ZONE: Added new participant. Total now:', newParticipants.length);
          addDebugMessage(`Participants: ${newParticipants.length}`);
          return newParticipants;
        }
        return prev;
      });
      
      setTimeout(() => {
        console.log('🎮 GAMING ZONE: Calling connectToNewUser for:', userId);
        addDebugMessage(`Creating peer connection...`);
        connectToNewUser(userId, localStreamRef.current);
      }, 1000);
    });

    socketRef.current.on('user-disconnected', userId => {
      console.log('🎮 GAMING ZONE: User disconnected:', userId);
      if (peersRef.current[userId]) {
        peersRef.current[userId].close();
        delete peersRef.current[userId];
        console.log('🎮 GAMING ZONE: Closed peer connection for:', userId);
      }
      setParticipants(prev => {
        const filtered = prev.filter(p => p.id !== userId);
        console.log('🎮 GAMING ZONE: Participants after removal:', filtered.length);
        return filtered;
      });
      const videoToRemove = document.getElementById(`video-${userId}`);
      if (videoToRemove) {
        videoToRemove.remove();
        console.log('🎮 GAMING ZONE: Removed video element for:', userId);
      }
    });

    socketRef.current.on('offer', (userId, offer) => {
      console.log('🎮 GAMING ZONE: Received offer from:', userId);
      const peer = createPeerConnection(userId);
      peer.setRemoteDescription(new RTCSessionDescription(offer));
      
      const streamToUse = isScreenSharing ? screenStreamRef.current : localStreamRef.current;
      if (streamToUse) {
        console.log('🎮 GAMING ZONE: Adding tracks to peer for offer response');
        streamToUse.getTracks().forEach(track => peer.addTrack(track, streamToUse));
      }

      peer.createAnswer().then(answer => {
        peer.setLocalDescription(answer);
        console.log('🎮 GAMING ZONE: Sending answer to:', userId);
        socketRef.current.emit('answer', userId, answer);
      });
    });

    socketRef.current.on('answer', (userId, answer) => {
      console.log('🎮 GAMING ZONE: Received answer from:', userId);
      if (peersRef.current[userId]) {
        peersRef.current[userId].setRemoteDescription(new RTCSessionDescription(answer));
        console.log('🎮 GAMING ZONE: Set remote description for:', userId);
      }
    });

    socketRef.current.on('ice-candidate', (userId, candidate) => {
      console.log('🎮 GAMING ZONE: Received ICE candidate from:', userId);
      if (peersRef.current[userId]) {
        peersRef.current[userId].addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    socketRef.current.on('message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    socketRef.current.on('connect', () => {
      console.log('🎮 GAMING ZONE: Socket connected with ID:', socketRef.current.id);
      setConnectionStatus('Connected');
      addDebugMessage(`Connected! ID: ${socketRef.current.id.substring(0, 8)}`);
    });

    socketRef.current.on('room-joined', (data) => {
      console.log('🎮 GAMING ZONE: Room joined confirmation:', data);
      addDebugMessage('Room joined successfully!');
    });

    socketRef.current.on('room-not-found', (data) => {
      console.log('🎮 GAMING ZONE: Room not found:', data);
      addDebugMessage('Room not found!');
      alert('Room not found! Check the room ID.');
    });
  };

  function connectToNewUser(userId, stream) {
    console.log('🎮 GAMING ZONE: connectToNewUser called for:', userId);
    console.log('🎮 GAMING ZONE: Stream available:', !!stream);
    
    const peer = createPeerConnection(userId);
    if (stream) {
      console.log('🎮 GAMING ZONE: Adding tracks to peer connection');
      stream.getTracks().forEach(track => {
        console.log('🎮 GAMING ZONE: Adding track:', track.kind);
        peer.addTrack(track, stream);
      });
    }
    
    peer.createOffer().then(offer => {
      console.log('🎮 GAMING ZONE: Created offer, setting local description');
      peer.setLocalDescription(offer);
      console.log('🎮 GAMING ZONE: Emitting offer to:', userId);
      socketRef.current.emit('offer', userId, offer);
    }).catch(err => {
      console.error('🎮 GAMING ZONE: Error creating offer:', err);
    });
  }

  function createPeerConnection(userId) {
    console.log('🎮 GAMING ZONE: Creating peer connection for:', userId);
    
    const peer = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });
    peersRef.current[userId] = peer;
    
    console.log('🎮 GAMING ZONE: Total peer connections:', Object.keys(peersRef.current).length);

    peer.ontrack = event => {
      console.log('🎮 GAMING ZONE: 🎥 REMOTE STREAM RECEIVED from:', userId);
      addDebugMessage(`Remote video received!`);
      setConnectionStatus('Connected');
      
      const videoContainer = document.getElementById(`video-${userId}`);
      if (!videoContainer) {
        console.log('🎮 GAMING ZONE: Adding remote video for:', userId);
        addRemoteVideo(event.streams[0], userId);
      }
    };
    
    peer.onicecandidate = event => {
      if (event.candidate) {
        console.log('🎮 GAMING ZONE: Sending ICE candidate to:', userId);
        socketRef.current.emit('ice-candidate', userId, event.candidate);
      }
    };
    
    peer.onconnectionstatechange = () => {
      console.log('🎮 GAMING ZONE: Connection state changed for', userId, ':', peer.connectionState);
      addDebugMessage(`Peer ${userId.substring(0, 5)}: ${peer.connectionState}`);
      if (peer.connectionState === 'connected') {
        setConnectionStatus('Peer Connected');
      }
    };
    
    return peer;
  }

  const addRemoteVideo = (stream, userId) => {
    console.log('🎮 GAMING ZONE: 🎥 Adding remote video for user:', userId);
    
    const videoGrid = document.querySelector('.video-grid');
    if (!videoGrid) {
      console.error('🎮 GAMING ZONE: ❌ Video grid not found!');
      alert('❌ Error: Video grid not found!');
      return;
    }
    
    console.log('🎮 GAMING ZONE: Video grid found, creating video element');
    
    const videoContainer = document.createElement('div');
    videoContainer.className = 'participant-video';
    videoContainer.id = `video-${userId}`;
    
    const video = document.createElement('video');
    video.id = `remote-video-${userId}`;
    video.srcObject = stream;
    video.autoplay = true;
    video.playsInline = true;
    video.muted = false;
    video.className = 'video-element';
    
    const videoStream = document.createElement('div');
    videoStream.className = 'video-stream';
    videoStream.appendChild(video);
    
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
    
    videoContainer.appendChild(videoStream);
    videoContainer.appendChild(videoName);
    videoContainer.appendChild(controls);
    videoGrid.appendChild(videoContainer);
    
    video.play().then(() => {
      console.log('🎮 GAMING ZONE: ✅ Remote video playing successfully for:', userId);
    }).catch(e => {
      console.error('🎮 GAMING ZONE: ❌ Video play error:', e);
    });
    
    console.log('🎮 GAMING ZONE: ✅ Remote video element added to DOM for:', userId);
  };

  const getMediaStream = async () => {
    console.log('🎮 GAMING ZONE: Requesting media stream...');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      console.log('🎮 GAMING ZONE: ✅ Media stream obtained');
      console.log('🎮 GAMING ZONE: Video tracks:', stream.getVideoTracks().length);
      console.log('🎮 GAMING ZONE: Audio tracks:', stream.getAudioTracks().length);
      
      localStreamRef.current = stream;
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.play().then(() => {
          console.log('🎮 GAMING ZONE: ✅ Local video playing');
        }).catch(e => {
          console.error('🎮 GAMING ZONE: ❌ Local video play error:', e);
        });
      }
      
      return stream;
    } catch (error) {
      console.error('🎮 GAMING ZONE: ❌ Error accessing media devices:', error);
      alert('❌ Could not access camera/microphone. Please check permissions.');
      return null;
    }
  };

  const startSession = async () => {
    const roomId = 'GAME-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    console.log('🎮 GAMING ZONE: HOST - Starting session with room ID:', roomId);
    
    setMeetingId(roomId);
    setSessionActive(true);
    setSessionTime(0);
    
    console.log('🎮 GAMING ZONE: HOST - Initializing socket...');
    initializeSocket();
    
    console.log('🎮 GAMING ZONE: HOST - Getting media stream...');
    await getMediaStream();
    
    socketRef.current.on('connect', () => {
      console.log('🎮 GAMING ZONE: HOST - Socket connected, joining room');
      
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const hostData = {
        name: currentUser.name || 'Host',
        email: currentUser.email || '',
        id: socketRef.current.id
      };
      
      console.log('🎮 GAMING ZONE: HOST - Emitting join-room event');
      socketRef.current.emit('join-room', roomId);
      addDebugMessage(`Joining room: ${roomId}`);
      
      setParticipants([{
        id: socketRef.current.id,
        name: hostData.name,
        avatar: hostData.name.substring(0, 2).toUpperCase(),
        isHost: true,
        audio: true,
        video: true
      }]);
      
      console.log('🎮 GAMING ZONE: HOST - Room setup complete. Waiting for users...');
      alert(`🎮 HOST: Room ${roomId} created! Share this ID with others.`);
    });
  };

  const joinSession = async () => {
    if (!joinRoomId.trim() || !userName.trim()) {
      alert('Please enter both room ID and your name');
      return;
    }
    
    console.log('🎮 GAMING ZONE: USER - Joining room:', joinRoomId, 'as:', userName);
    
    setMeetingId(joinRoomId);
    setSessionActive(true);
    
    console.log('🎮 GAMING ZONE: USER - Initializing socket...');
    initializeSocket();
    
    console.log('🎮 GAMING ZONE: USER - Getting media stream...');
    await getMediaStream();
    
    socketRef.current.on('connect', () => {
      console.log('🎮 GAMING ZONE: USER - Socket connected, joining room');
      
      const userData = {
        name: userName,
        avatar: userName.substring(0, 2).toUpperCase(),
        id: socketRef.current.id
      };
      
      console.log('🎮 GAMING ZONE: USER - Emitting join-room event');
      socketRef.current.emit('join-room', joinRoomId);
      addDebugMessage(`Joining room: ${joinRoomId}`);
      
      setParticipants([{
        id: socketRef.current.id,
        name: userName,
        avatar: userName.substring(0, 2).toUpperCase(),
        isHost: false,
        audio: true,
        video: true
      }]);
      
      console.log('🎮 GAMING ZONE: USER - Join complete. Should connect to host...');
      alert(`🎮 USER: Joined room ${joinRoomId}! Looking for other participants...`);
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
      
      Object.values(peersRef.current).forEach(peer => {
        const sender = peer.getSenders().find(s => s.track && s.track.kind === 'video');
        if (sender) sender.replaceTrack(screenTrack);
      });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = screenStream;
        localVideoRef.current.classList.add('screen-share');
      }

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

      Object.values(peersRef.current).forEach(peer => {
        const sender = peer.getSenders().find(s => s.track && s.track.kind === 'video');
        if (sender) sender.replaceTrack(cameraTrack);
      });
    }

    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => track.stop());
      screenStreamRef.current = null;
    }

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
              <div className="debug-panel" style={{backgroundColor: '#1a1a1a', padding: '10px', marginBottom: '10px', borderRadius: '5px', color: '#fff'}}>
                <h4 style={{color: '#00ff00', fontSize: '12px'}}>🔧 DEBUG STATUS</h4>
                <div style={{fontSize: '11px'}}>
                  <span>Status: <span style={{color: connectionStatus === 'Connected' ? '#00ff00' : '#ff0000'}}>{connectionStatus}</span></span> | 
                  <span>Socket: {socketRef.current?.id || 'None'}</span> | 
                  <span>Participants: {participants.length}</span> | 
                  <span>Peers: {Object.keys(peersRef.current).length}</span>
                </div>
                <div style={{fontSize: '10px', color: '#ccc', marginTop: '5px'}}>
                  {debugMessages.slice(-2).map((msg, i) => <div key={i}>{msg}</div>)}
                </div>
              </div>
              
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
                    <h3><i className="fas fa-users"></i> Participants ({participants.length})</h3>
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
                    <h3><i className="fas fa-users"></i> Participants ({participants.length})</h3>
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