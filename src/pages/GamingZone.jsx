import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import '../styles/gaming.css';

function GamingZone({ navigate, user }) {
  const [userRole, setUserRole] = useState('select');
  const [sessionActive, setSessionActive] = useState(false);
  const [meetingId, setMeetingId] = useState('');
  const [sessionTime, setSessionTime] = useState(0);
  const [participants, setParticipants] = useState([]);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [joinRoomId, setJoinRoomId] = useState('');
  const [userName, setUserName] = useState(user?.name || 'User');
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

  const initializeSocket = (roomId) => {
    socketRef.current = io('http://localhost:5000');
    
    socketRef.current.on('connect', () => {
      console.log('🎮 Socket connected:', socketRef.current.id);
      socketRef.current.emit('join-room', roomId);
    });

    socketRef.current.on('user-connected', userId => {
      console.log('🎮 User connected:', userId);
      
      setParticipants(prev => {
        if (!prev.find(p => p.id === userId)) {
          const isConnectedUserHost = userRole === 'user';
          const newParticipants = [...prev, { 
            id: userId, 
            name: isConnectedUserHost ? 'Host' : 'Connecting...',
            avatar: isConnectedUserHost ? 'H' : 'U',
            isHost: isConnectedUserHost,
            audio: true,
            video: true
          }];
          setTotalParticipants(newParticipants.length);
          
          if (userRole === 'host') {
            socketRef.current.emit('sync-participants', {
              roomId: meetingId,
              participants: newParticipants,
              total: newParticipants.length
            });
          }
          
          return newParticipants;
        }
        return prev;
      });
      
      setTimeout(() => connectToNewUser(userId, localStreamRef.current), 1000);
      
      // Share current user info with the new user
      setTimeout(() => {
        if (socketRef.current) {
          const actualName = user?.name || (userRole === 'host' ? 'Host' : 'User');
          socketRef.current.emit('share-user-info', {
            roomId: meetingId || joinRoomId,
            userId: socketRef.current.id,
            name: actualName,
            isHost: userRole === 'host'
          });
        }
      }, 1500);
    });

    socketRef.current.on('user-disconnected', userId => {
      console.log('🎮 User disconnected:', userId);
      if (peersRef.current[userId]) {
        peersRef.current[userId].close();
        delete peersRef.current[userId];
      }
      setParticipants(prev => {
        const filtered = prev.filter(p => p.id !== userId);
        setTotalParticipants(filtered.length);
        
        if (userRole === 'host') {
          socketRef.current.emit('sync-participants', {
            roomId: meetingId,
            participants: filtered,
            total: filtered.length
          });
        }
        
        return filtered;
      });
      const videoToRemove = document.getElementById(`video-container-${userId}`);
      if (videoToRemove) videoToRemove.remove();
    });

    socketRef.current.on('offer', (userId, offer) => {
      const peer = createPeerConnection(userId);
      peer.setRemoteDescription(new RTCSessionDescription(offer));
      
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => peer.addTrack(track, localStreamRef.current));
      }

      peer.createAnswer().then(answer => {
        peer.setLocalDescription(answer);
        socketRef.current.emit('answer', userId, answer);
      });
    });

    socketRef.current.on('answer', (userId, answer) => {
      if (peersRef.current[userId]) {
        peersRef.current[userId].setRemoteDescription(new RTCSessionDescription(answer));
      }
    });

    socketRef.current.on('ice-candidate', (userId, candidate) => {
      if (peersRef.current[userId]) {
        peersRef.current[userId].addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    socketRef.current.on('message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    socketRef.current.on('host-ended-meeting', () => {
      alert('Host has ended the meeting');
      endSession();
    });

    socketRef.current.on('participants-update', (data) => {
      setParticipants(data.participants);
      setTotalParticipants(data.total);
    });

    socketRef.current.on('user-info-shared', (data) => {
      const { userId, name, isHost } = data;
      setParticipants(prev => {
        const updated = prev.map(p => {
          if (p.id === userId) {
            return { ...p, name: isHost ? 'Host' : name };
          }
          return p;
        });
        return updated;
      });
      
      // Update the video name if video container exists
      // Update the video name with multiple attempts
      const updateVideoName = () => {
        const videoContainer = document.getElementById(`video-container-${userId}`);
        if (videoContainer) {
          const nameElement = videoContainer.querySelector('.participant-name');
          if (nameElement) {
            nameElement.textContent = name;
            console.log(`Updated video name for ${userId} to: ${name}`);
          }
        }
      };
      
      updateVideoName();
      setTimeout(updateVideoName, 50);
      setTimeout(updateVideoName, 200);
      setTimeout(updateVideoName, 1000);
    });
  };

  function connectToNewUser(userId, stream) {
    const peer = createPeerConnection(userId);
    if (stream) {
      stream.getTracks().forEach(track => peer.addTrack(track, stream));
    }
    peer.createOffer().then(offer => {
      peer.setLocalDescription(offer);
      socketRef.current.emit('offer', userId, offer);
    });
  }

  function createPeerConnection(userId) {
    const peer = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });
    peersRef.current[userId] = peer;

    let hasAddedVideo = false;
    peer.ontrack = event => {
      if (!hasAddedVideo && event.streams[0]) {
        console.log('🎥 Remote stream received from:', userId);
        addRemoteVideo(event.streams[0], userId);
        hasAddedVideo = true;
      }
    };
    
    peer.onicecandidate = event => {
      if (event.candidate) {
        socketRef.current.emit('ice-candidate', userId, event.candidate);
      }
    };
    
    return peer;
  }

  const addRemoteVideo = (stream, userId) => {
    const videoGrid = document.querySelector('.video-grid');
    if (!videoGrid) return;
    
    if (document.getElementById(`video-container-${userId}`)) {
      return;
    }
    
    const videoContainer = document.createElement('div');
    videoContainer.className = 'participant-video';
    videoContainer.id = `video-container-${userId}`;
    
    const videoStream = document.createElement('div');
    videoStream.className = 'video-stream';
    
    const video = document.createElement('video');
    video.srcObject = stream;
    video.autoplay = true;
    video.playsInline = true;
    video.className = 'video-element';
    
    const videoName = document.createElement('div');
    videoName.className = 'video-name';
    
    // Initial name - will be updated when user info is received
    let participantName = userRole === 'user' ? 'Host' : 'Connecting...';
    videoName.innerHTML = `<span class="participant-name">${participantName}</span>`;
    
    videoStream.appendChild(video);
    videoContainer.appendChild(videoStream);
    videoContainer.appendChild(videoName);
    videoGrid.appendChild(videoContainer);
    
    video.play().catch(e => console.log('Video play error:', e));
  };

  const getMediaStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = stream;
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.play().catch(e => console.log('Local video play error:', e));
      }
      
      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      return null;
    }
  };

  const startSession = async () => {
    const roomId = 'GAME-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    setMeetingId(roomId);
    setSessionActive(true);
    setSessionTime(0);
    
    await getMediaStream();
    initializeSocket(roomId);
    
    setTimeout(() => {
      const hostParticipant = { 
        id: socketRef.current?.id || 'host', 
        name: 'You (Host)',
        avatar: 'H',
        isHost: true,
        audio: true,
        video: true
      };
      setParticipants([hostParticipant]);
      setTotalParticipants(1);
      
      // Share host info with other participants
      if (socketRef.current) {
        const actualName = user?.name || 'Host';
        socketRef.current.emit('share-user-info', {
          roomId,
          userId: socketRef.current.id,
          name: actualName,
          isHost: true
        });
      }
    }, 500);
  };

  const joinSession = async () => {
    if (!joinRoomId.trim()) {
      alert('Please enter room ID');
      return;
    }
    
    setMeetingId(joinRoomId);
    setSessionActive(true);
    
    await getMediaStream();
    initializeSocket(joinRoomId);
    
    setTimeout(() => {
      const userParticipant = { 
        id: socketRef.current?.id || 'user', 
        name: 'You',
        avatar: userName.substring(0, 2).toUpperCase(),
        isHost: false,
        audio: true,
        video: true
      };
      setParticipants([userParticipant]);
      setTotalParticipants(1);
      
      // Share user info with other participants
      if (socketRef.current) {
        const actualName = user?.name || 'User';
        socketRef.current.emit('share-user-info', {
          roomId: joinRoomId,
          userId: socketRef.current.id,
          name: actualName,
          isHost: false
        });
      }
    }, 500);
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
      const senderName = userRole === 'host' ? 'Host' : userName || 'User';
      const message = {
        id: Date.now(),
        sender: senderName,
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
    if (userRole === 'host' && socketRef.current) {
      socketRef.current.emit('end-meeting', { roomId: meetingId });
    }
    
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
                      <span className="participant-name">{userName} (Host)</span>
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
                    <h3><i className="fas fa-users"></i> Participants ({totalParticipants})</h3>
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
                    <div className="user-info">
                      <span>Joining as: <strong>{userName}</strong></span>
                    </div>
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
                      <span className="participant-name">{userName}</span>
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