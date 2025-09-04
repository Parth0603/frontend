import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import Whiteboard from '../components/Whiteboard.jsx';
import WebRTCManager from '../components/WebRTCManager.jsx';
import '../styles/teaching.css';
import '../styles/whiteboard-overlay.css';
import '../styles/modal-fixes.css';
import '../styles/tabbed-interface.css';
import '../styles/screen-share-fix.css';
import '../styles/webrtc-video.css';
import '../styles/webrtc-enhanced.css';
import '../styles/popup-notifications.css';
import '../styles/student-fullscreen.css';

function StudentView({ navigate, user, meetingId: initialMeetingId }) {
  const [socket, setSocket] = useState(null);
  const [meetingId, setMeetingId] = useState(initialMeetingId || '');
  const [joinMeetingId, setJoinMeetingId] = useState('');
  const [sessionActive, setSessionActive] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [notes, setNotes] = useState([]);
  const [currentTest, setCurrentTest] = useState(null);
  const [testAnswers, setTestAnswers] = useState({});
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [handRaised, setHandRaised] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [sessionTime, setSessionTime] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState({ rating: 5, comment: '' });
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const [whiteboardOpened, setWhiteboardOpened] = useState(false);
  
  // WebRTC refs and states
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const webRTCManagerRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [peerConnection, setPeerConnection] = useState(null);
  const [teacherSocketId, setTeacherSocketId] = useState(null);

  // Socket connection
  useEffect(() => {
    console.log('Initializing socket connection...');
    const newSocket = io('http://localhost:5000', {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });
    setSocket(newSocket);
    
    newSocket.on('connect', () => {
      console.log('Student connected:', newSocket.id);
    });
    
    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      console.log('Make sure backend server is running on port 5000');
    });
    
    newSocket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });
    
    newSocket.on('reconnect', (attemptNumber) => {
      console.log('Socket reconnected after', attemptNumber, 'attempts');
    });
    
    newSocket.on('reconnect_error', (error) => {
      console.error('Socket reconnection failed:', error);
    });
    
    newSocket.on('message', (message) => {
      console.log('Received message:', message);
      setMessages(prev => [...prev, message]);
    });
    
    newSocket.on('join-pending', (data) => {
      console.log('Join request pending approval:', data);
      setJoinStatus('pending');
    });
    
    newSocket.on('join-approved', (data) => {
      console.log('Join request approved:', data);
      setTeacherSocketId(data.hostId);
      const studentData = {
        id: user?.id || uuidv4(),
        name: user?.name || 'Student',
        email: user?.email || '',
        avatar: (user?.name || 'Student').substring(0, 2).toUpperCase(),
        status: 'online',
        handRaised: false,
        muted: false,
        videoOff: false
      };
      newSocket.emit('confirm-join', { roomId: data.roomId, student: studentData });
      setJoinStatus('approved');
    });
    
    newSocket.on('join-rejected', (data) => {
      console.log('Join request rejected:', data);
      setJoinStatus('rejected');
      setJoinMeetingId('');
      setIsJoining(false);
    });
    
    newSocket.on('room-joined', (data) => {
      console.log('Room joined successfully:', data);
      setSessionActive(true);
      setParticipants(data.students || []);
      setTeacherSocketId(data.hostId);
      createPeerConnection(data.hostId, newSocket);
      setJoinStatus('joined');
      setIsJoining(false);
    });
    
    newSocket.on('room-not-found', (data) => {
      const roomId = data?.roomId || joinMeetingId;
      console.log('Room not found:', roomId);
      setJoinStatus('not-found');
      setJoinMeetingId('');
      setIsJoining(false);
    });
    
    newSocket.on('student-joined', (student) => {
      console.log('Another student joined:', student);
      setParticipants(prev => {
        if (!prev.find(p => p.id === student.id)) {
          return [...prev, student];
        }
        return prev;
      });
    });
    
    newSocket.on('student-left', (studentId) => {
      console.log('Student left:', studentId);
      setParticipants(prev => prev.filter(s => s.id !== studentId));
    });
    
    newSocket.on('participants-update', (allStudents) => {
      console.log('Participants updated:', allStudents);
      setParticipants(allStudents.filter(s => s.id !== user?.id));
    });
    
    newSocket.on('test-started', (test) => {
      setCurrentTest(test);
      setActiveTab('test');
    });
    
    newSocket.on('notes-shared', (note) => {
      setNotes(prev => [...prev, note]);
    });
    
    newSocket.on('leaderboard-updated', (results) => {
      setTestResults(results);
      setShowLeaderboard(true);
    });
    
    newSocket.on('screen-share-started', (data) => {
      console.log('Teacher started screen sharing:', data);
      setIsScreenSharing(true);
    });
    
    newSocket.on('screen-share-stopped', () => {
      console.log('Teacher stopped screen sharing');
      setIsScreenSharing(false);
    });
    
    // WebRTC signaling
    newSocket.on('webrtc-offer', async (data) => {
      const { offer, fromUserId } = data || {};
      console.log('Received WebRTC offer from teacher:', fromUserId);
      if (peerConnection && offer) {
        try {
          await peerConnection.setRemoteDescription(offer);
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);
          newSocket.emit('webrtc-answer', {
            answer,
            targetUserId: fromUserId,
            roomId: meetingId
          });
        } catch (error) {
          console.error('Error handling WebRTC offer:', error);
        }
      }
    });
    
    newSocket.on('webrtc-answer', async (data) => {
      const { answer, fromUserId } = data || {};
      console.log('Received WebRTC answer from teacher:', fromUserId);
      if (peerConnection && answer) {
        try {
          await peerConnection.setRemoteDescription(answer);
        } catch (error) {
          console.error('Error handling WebRTC answer:', error);
        }
      }
    });
    
    newSocket.on('webrtc-ice-candidate', (data) => {
      const { candidate, fromUserId } = data || {};
      console.log('Received ICE candidate from teacher:', fromUserId);
      if (peerConnection && candidate) {
        try {
          peerConnection.addIceCandidate(candidate);
        } catch (error) {
          console.error('Error adding ICE candidate:', error);
        }
      }
    });
    
    newSocket.on('teacher-video-stream', (data) => {
      console.log('Received teacher video stream:', data);
      // Handle teacher video stream
    });
    
    newSocket.on('participants-update', (allStudents) => {
      console.log('Participants updated in student view:', allStudents);
      setParticipants(allStudents.filter(s => s.id !== user?.id) || []);
    });
    
    newSocket.on('mute-all', () => {
      console.log('Teacher muted all students');
      setIsAudioEnabled(false);
      if (localStream) {
        const audioTrack = localStream.getAudioTracks()[0];
        if (audioTrack) {
          audioTrack.enabled = false;
        }
      }
    });
    
    newSocket.on('hand-raised', (studentId) => {
      if (studentId === user?.id) {
        setHandRaised(true);
      }
    });
    
    newSocket.on('hand-lowered', (studentId) => {
      if (studentId === user?.id) {
        setHandRaised(false);
      }
    });
    
    newSocket.on('whiteboard-opened', () => {
      console.log('Whiteboard opened by teacher');
      setShowWhiteboard(true);
      setWhiteboardOpened(true);
    });
    
    newSocket.on('whiteboard-closed', () => {
      console.log('Whiteboard closed by teacher');
      setShowWhiteboard(false);
    });

    return () => {
      if (peerConnection) {
        peerConnection.close();
      }
      newSocket.close();
    };
  }, [meetingId]);

  // Session timer
  useEffect(() => {
    let timer;
    if (sessionActive) {
      timer = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [sessionActive]);

  // Add local stream to peer connection when available
  useEffect(() => {
    if (localStream && peerConnection) {
      console.log('Adding local stream to existing peer connection');
      localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
      });
    }
  }, [localStream, peerConnection]);

  const createPeerConnection = (teacherId, socketInstance) => {
    console.log('Creating peer connection to teacher:', teacherId);
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });
    
    // Handle incoming stream from teacher
    pc.ontrack = (event) => {
      console.log('Received remote stream from teacher');
      const [stream] = event.streams;
      setRemoteStream(stream);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
        console.log('Set teacher video stream to video element');
      }
    };
    
    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('Sending ICE candidate to teacher');
        socketInstance.emit('webrtc-ice-candidate', {
          candidate: event.candidate,
          targetUserId: teacherId,
          roomId: meetingId
        });
      }
    };
    
    // Handle connection state changes
    pc.onconnectionstatechange = () => {
      console.log('Connection state with teacher:', pc.connectionState);
    };
    
    // We'll add the local stream after it's available
    // The teacher doesn't need to see student video initially
    
    setPeerConnection(pc);
    
    // Create offer to teacher
    pc.createOffer().then(offer => {
      pc.setLocalDescription(offer);
      console.log('Sending WebRTC offer to teacher');
      socketInstance.emit('webrtc-offer', {
        offer,
        targetUserId: teacherId,
        roomId: meetingId
      });
    }).catch(error => {
      console.error('Error creating WebRTC offer:', error);
    });
    
    return pc;
  };

  const [isJoining, setIsJoining] = useState(false);
  
  const joinSession = async () => {
    if (!joinMeetingId.trim()) {
      return;
    }
    
    if (isJoining) {
      return;
    }
    
    console.log('Attempting to join session:', joinMeetingId);
    console.log('Socket status:', socket?.connected ? 'Connected' : 'Disconnected');
    
    if (!socket || !socket.connected) {
      return;
    }
    
    setIsJoining(true);
    setMeetingId(joinMeetingId);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      console.log('Local stream obtained successfully');
    } catch (error) {
      console.error('Failed to access media:', error);
    }
    
    const studentData = {
      id: user?.id || uuidv4(),
      name: user?.name || 'Student',
      email: user?.email || '',
      avatar: (user?.name || 'Student').substring(0, 2).toUpperCase(),
      status: 'online',
      handRaised: false,
      muted: false,
      videoOff: false
    };
    
    console.log('Sending join-room request:', { roomId: joinMeetingId, student: studentData });
    socket.emit('join-room', { roomId: joinMeetingId, student: studentData });
    
    setTimeout(() => setIsJoining(false), 3000);
  };
  
  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };
  
  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleHandRaise = () => {
    const newHandRaised = !handRaised;
    setHandRaised(newHandRaised);
    if (socket && socket.connected) {
      if (newHandRaised) {
        console.log('Raising hand for student:', user?.id);
        socket.emit('raise-hand', { roomId: meetingId, studentId: user?.id });
      } else {
        console.log('Lowering hand for student:', user?.id);
        socket.emit('lower-hand', { roomId: meetingId, studentId: user?.id });
      }
    }
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: uuidv4(),
        sender: user?.name || 'Student',
        message: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isHost: false
      };
      
      console.log('Sending message:', message, 'to room:', meetingId);
      if (socket && socket.connected) {
        socket.emit('send-message', { roomId: meetingId, message });
      } else {
        console.log('Socket not connected, adding message locally');
        setMessages(prev => [...prev, message]);
      }
      setNewMessage('');
    }
  };

  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [joinStatus, setJoinStatus] = useState('');

  const markAttendance = () => {
    if (attendanceMarked) {
      return;
    }
    
    if (socket && socket.connected) {
      const studentData = {
        id: user?.id || uuidv4(),
        name: user?.name || 'Student',
        email: user?.email || ''
      };
      socket.emit('mark-attendance', { roomId: meetingId, student: studentData });
      setAttendanceMarked(true);
    }
  };

  const submitTest = () => {
    if (currentTest && socket && socket.connected) {
      let score = 0;
      currentTest.questions.forEach(q => {
        if (testAnswers[q.id] === q.correct) {
          score++;
        }
      });
      
      const percentage = Math.round((score / currentTest.questions.length) * 100);
      const result = {
        studentId: user?.id,
        studentName: user?.name || 'Student',
        score: percentage,
        answers: testAnswers
      };
      
      socket.emit('submit-test', { roomId: meetingId, result });
      setCurrentTest(null);
    }
  };

  const submitFeedback = () => {
    const feedbackData = {
      studentId: user?.id,
      studentName: user?.name || 'Student',
      rating: feedback.rating,
      comment: feedback.comment,
      date: new Date().toLocaleDateString()
    };
    if (socket && socket.connected) {
      socket.emit('submit-feedback', { roomId: meetingId, feedback: feedbackData });
    }
    setShowFeedback(false);
    setSessionActive(false);
    navigate('teaching');
  };

  const endSession = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    if (peerConnection) {
      peerConnection.close();
      setPeerConnection(null);
    }
    setRemoteStream(null);
    setShowFeedback(true);
  };
  
  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (webRTCManagerRef.current) {
        webRTCManagerRef.current.cleanup();
      }
    };
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!sessionActive) {
    return (
      <>
        <nav className="navbar zone-nav">
          <div className="nav-container">
            <div className="nav-logo" onClick={() => navigate('dashboard')}>
              <h2>SYNTRA</h2>
            </div>
            <div className="nav-breadcrumb">
              <i className="fas fa-user-graduate"></i>
              <span>Join Teaching Session</span>
            </div>
            <button className="nav-back-btn" onClick={() => navigate('teaching')}>
              <i className="fas fa-arrow-left"></i>
            </button>
          </div>
        </nav>

        <div className="zone-container">
          <div className="join-session">
            <div className="join-header">
              <h1>Join Teaching Session</h1>
              <p>Enter the meeting ID provided by your teacher</p>
            </div>
            
            <div className="join-form">
              <div className="connection-status-display">
                <div className={`status-indicator ${socket?.connected ? 'connected' : 'disconnected'}`}>
                  <i className={`fas fa-circle ${socket?.connected ? 'text-green' : 'text-red'}`}></i>
                  <span>{socket?.connected ? 'Connected to Server' : 'Server Disconnected'}</span>
                </div>
                {!socket?.connected && (
                  <button 
                    className="reconnect-btn"
                    onClick={() => window.location.reload()}
                  >
                    <i className="fas fa-refresh"></i>
                    Refresh Page
                  </button>
                )}
              </div>
              <div className="input-group">
                <input 
                  type="text" 
                  placeholder="Enter meeting ID (e.g., TCH-ABC123XYZ)" 
                  className="meeting-input"
                  value={joinMeetingId}
                  onChange={(e) => setJoinMeetingId(e.target.value)}
                />
                <button 
                  className="join-btn" 
                  onClick={joinSession}
                  disabled={!socket?.connected || isJoining}
                >
                  <i className={`fas fa-${isJoining ? 'spinner fa-spin' : 'sign-in-alt'}`}></i>
                  {isJoining ? 'Joining...' : 'Join Session'}
                </button>
              </div>
              
              {joinStatus && (
                <div className={`join-status ${joinStatus}`}>
                  {joinStatus === 'pending' && (
                    <>
                      <i className="fas fa-clock"></i>
                      <span>Waiting for teacher approval...</span>
                    </>
                  )}
                  {joinStatus === 'rejected' && (
                    <>
                      <i className="fas fa-times-circle"></i>
                      <span>Teacher declined your request</span>
                    </>
                  )}
                  {joinStatus === 'not-found' && (
                    <>
                      <i className="fas fa-exclamation-circle"></i>
                      <span>Meeting not found. Check ID and ensure teacher started session.</span>
                    </>
                  )}
                </div>
              )}
            </div>
            
            <div className="student-features">
              <div className="feature-item">
                <i className="fas fa-hand-paper"></i>
                <span>Raise hand to ask questions</span>
              </div>
              <div className="feature-item">
                <i className="fas fa-clipboard-check"></i>
                <span>Mark attendance automatically</span>
              </div>
              <div className="feature-item">
                <i className="fas fa-download"></i>
                <span>Download shared notes</span>
              </div>
              <div className="feature-item">
                <i className="fas fa-comments"></i>
                <span>Chat with teacher and classmates</span>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <nav className="navbar zone-nav teaching student">
        <div className="nav-container">
          <div className="nav-logo" onClick={() => navigate('dashboard')}>
            <h2>SYNTRA</h2>
          </div>
          <div className="nav-info">
            <div className="session-info">
              <span className="session-id">ID: {meetingId}</span>
              <span className="session-time">{formatTime(sessionTime)}</span>
            </div>
            <div className="live-indicator">
              <span className="pulse"></span>
              <span>LIVE</span>
            </div>
          </div>
          <div className="nav-actions">
            <button 
              className={`attendance-btn ${handRaised ? 'hand-raised-nav' : ''} ${attendanceMarked ? 'marked' : ''}`} 
              onClick={markAttendance}
              disabled={attendanceMarked}
            >
              <i className={`fas fa-${attendanceMarked ? 'check' : 'clipboard-check'}`}></i>
              {attendanceMarked ? 'Attendance Marked' : 'Mark Attendance'}
            </button>
            {handRaised && (
              <div className="hand-raised-indicator-nav">
                <i className="fas fa-hand-paper"></i>
                <span>Hand Raised</span>
              </div>
            )}
            <button className="nav-back-btn" onClick={endSession}>
              <i className="fas fa-sign-out-alt"></i>
            </button>
          </div>
        </div>
      </nav>

      <div className="teaching-container student-layout">
        <div className="fullscreen-video">
          <div className={`screen-content ${isScreenSharing ? 'screen-sharing-active' : ''}`}>
            {isScreenSharing ? (
              <div className="screen-share-display">
                <video 
                  ref={remoteVideoRef}
                  autoPlay 
                  playsInline
                  className="remote-video screen-share"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
                {!remoteStream && (
                  <div className="screen-share-content">
                    <div className="screen-placeholder">
                      <i className="fas fa-desktop"></i>
                      <span>Teacher is sharing screen</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <video 
                  ref={remoteVideoRef}
                  autoPlay 
                  playsInline
                  className="remote-video teacher-video"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {!remoteStream && (
                  <div className="video-placeholder">
                    <i className="fas fa-chalkboard-teacher"></i>
                    <span>Teacher's Camera</span>
                  </div>
                )}
              </>
            )}
          </div>
          
          <div className="student-video-overlay">
            <video 
              ref={localVideoRef}
              autoPlay 
              muted 
              playsInline
              className="local-video-preview"
            />
            {!localStream && (
              <div className="preview-placeholder">
                <i className="fas fa-user"></i>
                <span>You</span>
              </div>
            )}
          </div>
          
          <div className="video-controls-overlay">
            <button 
              className={`control-btn ${isAudioEnabled ? 'active' : 'muted'}`}
              onClick={toggleAudio}
            >
              <i className={`fas fa-microphone${isAudioEnabled ? '' : '-slash'}`}></i>
            </button>
            <button 
              className={`control-btn ${isVideoEnabled ? 'active' : 'off'}`}
              onClick={toggleVideo}
            >
              <i className={`fas fa-video${isVideoEnabled ? '' : '-slash'}`}></i>
            </button>
            <button 
              className={`control-btn ${handRaised ? 'active hand-raised' : ''}`}
              onClick={toggleHandRaise}
            >
              <i className="fas fa-hand-paper"></i>
            </button>
            <button className="control-btn end" onClick={endSession}>
              <i className="fas fa-sign-out-alt"></i>
            </button>
          </div>
        </div>

        <div className="tabbed-sidebar">
          <div className="sidebar-tabs">
            <button 
              className={`sidebar-tab ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => setActiveTab('chat')}
            >
              <i className="fas fa-comments"></i>
              <span>Chat</span>
            </button>
            <button 
              className={`sidebar-tab ${activeTab === 'participants' ? 'active' : ''}`}
              onClick={() => setActiveTab('participants')}
            >
              <i className="fas fa-users"></i>
              <span>People</span>
            </button>
            <button 
              className={`sidebar-tab ${activeTab === 'notes' ? 'active' : ''}`}
              onClick={() => setActiveTab('notes')}
            >
              <i className="fas fa-file-alt"></i>
              <span>Notes</span>
            </button>
            <button 
              className={`sidebar-tab ${activeTab === 'test' ? 'active' : ''}`}
              onClick={() => setActiveTab('test')}
            >
              <i className="fas fa-clipboard-list"></i>
              <span>Test</span>
            </button>
          </div>
          
          <div className="tab-content">
            {activeTab === 'chat' && (
              <div className="chat-content">
                <div className="chat-messages">
                  {messages.map(msg => (
                    <div key={msg.id} className={`message ${msg.isHost ? 'host' : 'student'}`}>
                      <div className="message-header">
                        <span className="sender">{msg.sender}</span>
                        <span className="time">{msg.time}</span>
                      </div>
                      <div className="message-content">{msg.message}</div>
                    </div>
                  ))}
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
            )}
            
            {activeTab === 'participants' && (
              <div className="participants-content">
                <h3>Participants ({participants.filter(p => p.id !== user?.id).length + 2})</h3>
                <div className="participants-list">
                  <div className="participant-item teacher">
                    <div className="participant-avatar">
                      <span>T</span>
                    </div>
                    <div className="participant-info">
                      <div className="participant-name">Teacher</div>
                      <div className="participant-status">Host</div>
                    </div>
                  </div>
                  <div className="participant-item student-self">
                    <div className="participant-avatar">
                      <span>{(user?.name || 'Student').substring(0, 2).toUpperCase()}</span>
                      {handRaised && (
                        <div className="hand-raised-badge">
                          <i className="fas fa-hand-paper"></i>
                        </div>
                      )}
                    </div>
                    <div className="participant-info">
                      <div className="participant-name">You ({user?.name || 'Student'})</div>
                      <div className="participant-status">
                        {handRaised ? 'Hand Raised' : 'Student'}
                      </div>
                    </div>
                  </div>
                  {participants.filter(p => p.id !== user?.id).map(participant => (
                    <div key={participant.id} className={`participant-item ${participant.handRaised ? 'hand-raised-student' : ''}`}>
                      <div className="participant-avatar">
                        <span>{participant.avatar}</span>
                        {participant.handRaised && (
                          <div className="hand-raised-badge">
                            <i className="fas fa-hand-paper"></i>
                          </div>
                        )}
                      </div>
                      <div className="participant-info">
                        <div className="participant-name">{participant.name}</div>
                        <div className="participant-status">
                          {participant.handRaised ? 'Hand Raised' : participant.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'notes' && (
              <div className="notes-content">
                <h3>Shared Notes</h3>
                <div className="notes-list">
                  {notes.map(note => (
                    <div key={note.id} className="note-item">
                      <i className="fas fa-file-pdf"></i>
                      <div className="note-info">
                        <div className="note-name">{note.name}</div>
                        <div className="note-time">{note.uploadTime}</div>
                      </div>
                      <a href={note.downloadUrl} download className="download-btn">
                        <i className="fas fa-download"></i>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'test' && (
              <div className="test-content">
                {currentTest ? (
                  <>
                    <h3>{currentTest.title}</h3>
                    <div className="test-questions">
                      {currentTest.questions.map((q, index) => (
                        <div key={q.id} className="question">
                          <h4>Q{index + 1}. {q.question}</h4>
                          <div className="options">
                            {q.options.map((option, optIndex) => (
                              <label key={optIndex} className="option">
                                <input 
                                  type="radio" 
                                  name={`q${q.id}`} 
                                  value={optIndex}
                                  onChange={() => setTestAnswers(prev => ({...prev, [q.id]: optIndex}))}
                                />
                                <span>{option}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <button className="tool-btn primary" onClick={submitTest}>
                      <i className="fas fa-check"></i>
                      Submit Test
                    </button>
                  </>
                ) : (
                  <div className="empty-content">
                    <i className="fas fa-clipboard-list"></i>
                    <span>No active test</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {showWhiteboard && (
        <div className="whiteboard-overlay">
          <div className="whiteboard-header">
            <h3><i className="fas fa-chalkboard"></i> Interactive Whiteboard</h3>
          </div>
          <div className="whiteboard-content">
            <Whiteboard isHost={false} socket={socket} roomId={meetingId} />
          </div>
        </div>
      )}
      
      {showFeedback && (
        <div className="feedback-modal">
          <div className="modal-content">
            <h3>Session Feedback</h3>
            <p>How was your learning experience?</p>
            
            <div className="rating-section">
              <label>Rating:</label>
              <div className="stars">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    className={`star ${feedback.rating >= star ? 'active' : ''}`}
                    onClick={() => setFeedback(prev => ({...prev, rating: star}))}
                  >
                    <i className="fas fa-star"></i>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="comment-section">
              <label>Comments:</label>
              <textarea
                placeholder="Share your thoughts about the session..."
                value={feedback.comment}
                onChange={(e) => setFeedback(prev => ({...prev, comment: e.target.value}))}
              />
            </div>
            
            <div className="modal-actions">
              <button className="submit-feedback-btn" onClick={submitFeedback}>
                Submit Feedback
              </button>
              <button className="skip-btn" onClick={() => setShowFeedback(false)}>
                Skip
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default StudentView;