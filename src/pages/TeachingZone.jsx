import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import Whiteboard from '../components/Whiteboard.jsx';
import VideoControls from '../components/VideoControls.jsx';
import TeacherVideo from '../components/TeacherVideo.jsx';
import SessionInfo from '../components/SessionInfo.jsx';
import TeachingDashboard from '../components/TeachingDashboard.jsx';
import '../styles/teaching.css';
import '../styles/whiteboard-overlay.css';
import '../styles/modal-fixes.css';
import '../styles/webrtc-video.css';
import '../styles/modern-teaching.css';
import '../styles/webrtc-enhanced.css';
import '../styles/popup-notifications.css';

function TeachingZone({ navigate, user }) {
  const [userRole, setUserRole] = useState('select');
  const [sessionActive, setSessionActive] = useState(false);
  const [meetingId, setMeetingId] = useState('');
  const [sessionTime, setSessionTime] = useState(0);
  const [socket, setSocket] = useState(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  
  // WebRTC refs and states
  const localVideoRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);
  const [screenStream, setScreenStream] = useState(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [peerConnections, setPeerConnections] = useState(new Map());
  
  // States for all features
  const [students, setStudents] = useState([]);
  const [messages, setMessages] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [notes, setNotes] = useState([]);
  const [handRaisedStudents, setHandRaisedStudents] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const [joinRequests, setJoinRequests] = useState([]);
  const [showJoinRequests, setShowJoinRequests] = useState(false);

  const toggleWhiteboard = () => {
    const newState = !showWhiteboard;
    setShowWhiteboard(newState);
    if (socket) {
      socket.emit(newState ? 'open-whiteboard' : 'close-whiteboard', { roomId: meetingId });
    }
  };

  // Socket connection
  useEffect(() => {
    const newSocket = io('http://localhost:5000', {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true
    });
    setSocket(newSocket);
    
    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      // Recreate room if we have a meeting ID and session is active
      if (meetingId && sessionActive) {
        console.log('Reconnecting to existing room:', meetingId);
        newSocket.emit('create-room', { roomId: meetingId, host: user?.name || 'Teacher' });
      }
    });
    
    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
    
    newSocket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });
    
    newSocket.on('room-created', (data) => {
      console.log('Room creation confirmed:', data);
    });
    
    newSocket.on('student-joined', (student) => {
      console.log('Student joined:', student);
      setStudents(prev => {
        // Remove any existing student with same ID or socketId first
        const filtered = prev.filter(s => s.id !== student.id && s.socketId !== student.socketId);
        return [...filtered, student];
      });
    });
    
    newSocket.on('attendance-marked', (attendanceRecord) => {
      console.log('Student marked attendance:', attendanceRecord);
      setAttendance(prev => {
        const exists = prev.find(a => a.studentId === attendanceRecord.studentId);
        if (!exists) {
          return [...prev, attendanceRecord];
        }
        return prev;
      });
    });
    
    newSocket.on('student-left', (studentId) => {
      console.log('Student left:', studentId);
      setStudents(prev => prev.filter(s => s.id !== studentId && s.socketId !== studentId));
    });
    
    newSocket.on('hand-raised', (studentId) => {
      setHandRaisedStudents(prev => {
        if (!prev.includes(studentId)) {
          return [...prev, studentId];
        }
        return prev;
      });
      setStudents(prev => prev.map(s => s.id === studentId ? {...s, handRaised: true} : s));
    });
    
    newSocket.on('hand-lowered', (studentId) => {
      setHandRaisedStudents(prev => prev.filter(id => id !== studentId));
      setStudents(prev => prev.map(s => s.id === studentId ? {...s, handRaised: false} : s));
    });
    
    newSocket.on('message', (message) => {
      setMessages(prev => [...prev, message]);
    });
    
    newSocket.on('join-request', (request) => {
      console.log('Student join request:', request);
      setJoinRequests(prev => [...prev, request]);
      setShowJoinRequests(true);
    });
    
    // WebRTC signaling
    newSocket.on('webrtc-offer', async ({ offer, fromUserId }) => {
      console.log('Received WebRTC offer from student:', fromUserId);
      let pc = peerConnections.get(fromUserId);
      
      if (!pc) {
        pc = createPeerConnection(fromUserId, newSocket);
      }
      
      try {
        await pc.setRemoteDescription(offer);
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        newSocket.emit('webrtc-answer', {
          answer,
          targetUserId: fromUserId,
          roomId: meetingId
        });
      } catch (error) {
        console.error('Error handling WebRTC offer:', error);
      }
    });
    
    newSocket.on('webrtc-ice-candidate', ({ candidate, fromUserId }) => {
      console.log('Received ICE candidate from student:', fromUserId);
      const pc = peerConnections.get(fromUserId);
      if (pc && candidate) {
        try {
          pc.addIceCandidate(candidate);
        } catch (error) {
          console.error('Error adding ICE candidate:', error);
        }
      }
    });

    return () => {
      // Cleanup peer connections
      peerConnections.forEach(pc => pc.close());
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

  // Update peer connections when local stream changes
  useEffect(() => {
    if (localStream && peerConnections.size > 0) {
      console.log('Updating peer connections with new local stream');
      peerConnections.forEach((pc, studentId) => {
        // Remove old tracks
        pc.getSenders().forEach(sender => {
          if (sender.track) {
            pc.removeTrack(sender);
          }
        });
        
        // Add new tracks
        localStream.getTracks().forEach(track => {
          pc.addTrack(track, localStream);
        });
      });
    }
  }, [localStream, peerConnections]);

  const createPeerConnection = (studentId, socketInstance) => {
    console.log('Creating peer connection for student:', studentId);
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });
    
    // Add local stream to peer connection
    const currentStream = isScreenSharing ? screenStream : localStream;
    if (currentStream) {
      currentStream.getTracks().forEach(track => {
        console.log('Adding track to peer connection:', track.kind);
        pc.addTrack(track, currentStream);
      });
    }
    
    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('Sending ICE candidate to student:', studentId);
        socketInstance.emit('webrtc-ice-candidate', {
          candidate: event.candidate,
          targetUserId: studentId,
          roomId: meetingId
        });
      }
    };
    
    // Handle connection state changes
    pc.onconnectionstatechange = () => {
      console.log('Connection state with student', studentId, ':', pc.connectionState);
    };
    
    setPeerConnections(prev => {
      const newMap = new Map(prev);
      newMap.set(studentId, pc);
      return newMap;
    });
    
    return pc;
  };

  const startSession = async () => {
    console.log('Starting session...');
    const newMeetingId = `TCH-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    setMeetingId(newMeetingId);
    setSessionActive(true);
    setSessionTime(0);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Failed to access media:', error);
    }
    
    if (socket && socket.connected) {
      socket.emit('create-room', { roomId: newMeetingId, host: user?.name || 'Teacher' });
      console.log('Room creation request sent:', newMeetingId);
    } else {
      console.log('Socket not connected');
    }
  };
  
  const endSession = () => {
    // Stop all streams
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    if (screenStream) {
      screenStream.getTracks().forEach(track => track.stop());
      setScreenStream(null);
    }
    
    // Close all peer connections
    peerConnections.forEach(pc => pc.close());
    setPeerConnections(new Map());
    
    setSessionActive(false);
    setMeetingId('');
    setSessionTime(0);
    setStudents([]);
    setMessages([]);
    setIsScreenSharing(false);
    
    if (socket) {
      socket.emit('end-session', meetingId);
    }
  };
  
  const startScreenShare = async () => {
    try {
      if (isScreenSharing) {
        // Stop screen sharing
        if (screenStream) {
          screenStream.getTracks().forEach(track => track.stop());
          setScreenStream(null);
        }
        
        // Switch back to camera
        if (localStream && localVideoRef.current) {
          localVideoRef.current.srcObject = localStream;
        }
        
        // Update peer connections with camera stream
        peerConnections.forEach(async (pc, studentId) => {
          const sender = pc.getSenders().find(s => s.track && s.track.kind === 'video');
          if (sender && localStream) {
            const videoTrack = localStream.getVideoTracks()[0];
            if (videoTrack) {
              try {
                await sender.replaceTrack(videoTrack);
                console.log('Switched to camera for student:', studentId);
              } catch (error) {
                console.error('Error switching to camera:', error);
              }
            }
          }
        });
        
        setIsScreenSharing(false);
        if (socket) {
          socket.emit('stop-screen-share', { roomId: meetingId, teacherId: socket.id });
        }
      } else {
        // Start screen sharing
        const newScreenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });
        
        setScreenStream(newScreenStream);
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = newScreenStream;
        }
        
        // Update peer connections with screen stream
        peerConnections.forEach(async (pc, studentId) => {
          const sender = pc.getSenders().find(s => s.track && s.track.kind === 'video');
          if (sender) {
            const videoTrack = newScreenStream.getVideoTracks()[0];
            if (videoTrack) {
              try {
                await sender.replaceTrack(videoTrack);
                console.log('Switched to screen share for student:', studentId);
              } catch (error) {
                console.error('Error switching to screen share:', error);
              }
            }
          }
        });
        
        setIsScreenSharing(true);
        if (socket) {
          socket.emit('start-screen-share', { 
            roomId: meetingId, 
            teacherId: socket.id,
            streamData: { video: true, audio: true }
          });
        }
        
        // Handle screen share end
        newScreenStream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
          setScreenStream(null);
          if (localStream && localVideoRef.current) {
            localVideoRef.current.srcObject = localStream;
          }
          
          // Switch back to camera in peer connections
          peerConnections.forEach(async (pc, studentId) => {
            const sender = pc.getSenders().find(s => s.track && s.track.kind === 'video');
            if (sender && localStream) {
              const videoTrack = localStream.getVideoTracks()[0];
              if (videoTrack) {
                try {
                  await sender.replaceTrack(videoTrack);
                  console.log('Switched back to camera for student:', studentId);
                } catch (error) {
                  console.error('Error switching back to camera:', error);
                }
              }
            }
          });
          
          if (socket) {
            socket.emit('stop-screen-share', { roomId: meetingId, teacherId: socket.id });
          }
        };
      }
    } catch (error) {
      console.error('Screen sharing error:', error);
    }
  };
  
  const toggleAudio = () => {
    const currentStream = isScreenSharing ? screenStream : localStream;
    if (currentStream) {
      const audioTrack = currentStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };
  
  const toggleVideo = () => {
    const currentStream = isScreenSharing ? screenStream : localStream;
    if (currentStream) {
      const videoTrack = currentStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const uploadNote = (event) => {
    const file = event.target.files[0];
    if (file) {
      const note = {
        id: uuidv4(),
        name: file.name,
        size: file.size,
        uploadTime: new Date().toLocaleString(),
        downloadUrl: URL.createObjectURL(file)
      };
      setNotes(prev => [...prev, note]);
      if (socket) {
        socket.emit('upload-note', { roomId: meetingId, note });
      }
    }
  };
  
  const createTest = () => {
    const test = {
      id: uuidv4(),
      title: 'Quick Quiz',
      questions: [
        {
          id: 1,
          question: 'What is the capital of France?',
          options: ['London', 'Berlin', 'Paris', 'Madrid'],
          correct: 2
        }
      ],
      duration: 300,
      active: true
    };
    if (socket) {
      socket.emit('start-test', { roomId: meetingId, test });
    }
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const [showCopySuccess, setShowCopySuccess] = useState(false);
  
  const copyMeetingLink = () => {
    const link = `${window.location.origin}/teaching?join=${meetingId}`;
    navigator.clipboard.writeText(link);
    setShowCopySuccess(true);
    setTimeout(() => setShowCopySuccess(false), 2000);
    setShowShareModal(false);
  };

  const shareMeeting = async () => {
    const link = `${window.location.origin}/teaching?join=${meetingId}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Teaching Session',
          text: `Join my teaching session with ID: ${meetingId}`,
          url: link
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      copyMeetingLink();
    }
    setShowShareModal(false);
  };

  const approveJoinRequest = (requestId) => {
    const request = joinRequests.find(r => r.id === requestId);
    if (request && socket) {
      socket.emit('approve-join', { requestId, roomId: meetingId });
      setJoinRequests(prev => prev.filter(r => r.id !== requestId));
    }
  };

  const rejectJoinRequest = (requestId) => {
    const request = joinRequests.find(r => r.id === requestId);
    if (request && socket) {
      socket.emit('reject-join', { requestId, roomId: meetingId });
      setJoinRequests(prev => prev.filter(r => r.id !== requestId));
    }
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
              <i className="fas fa-chalkboard-teacher"></i>
              <span>Teaching Zone</span>
            </div>
            <button className="nav-back-btn" onClick={() => navigate('dashboard')}>
              <i className="fas fa-arrow-left"></i>
            </button>
          </div>
        </nav>

        <div className="zone-container teaching-zone">
          <div className="zone-hero">
            <div className="hero-content">
              <h1>Teaching Zone</h1>
              <p>Create interactive learning experiences with advanced teaching tools</p>
              <div className="zone-stats">
                <div className="stat">
                  <span className="number">500+</span>
                  <span className="label">Classes Hosted</span>
                </div>
                <div className="stat">
                  <span className="number">10K+</span>
                  <span className="label">Students Taught</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="role-selection modern">
            <div className="role-card teacher" onClick={() => setUserRole('host')}>
              <div className="role-icon">
                <i className="fas fa-chalkboard-teacher"></i>
              </div>
              <div className="role-content">
                <h3>Start as Teacher</h3>
                <p>Create and manage your virtual classroom</p>
                <div className="role-features">
                  <span><i className="fas fa-video"></i> HD Video & Audio</span>
                  <span><i className="fas fa-draw-polygon"></i> Interactive Whiteboard</span>
                  <span><i className="fas fa-users-cog"></i> Student Management</span>
                  <span><i className="fas fa-chart-line"></i> Real-time Analytics</span>
                </div>
              </div>
              <div className="role-action">
                <span>Create Class</span>
                <i className="fas fa-arrow-right"></i>
              </div>
            </div>
            
            <div className="role-card student" onClick={() => navigate('student')}>
              <div className="role-icon">
                <i className="fas fa-user-graduate"></i>
              </div>
              <div className="role-content">
                <h3>Join as Student</h3>
                <p>Enter a class with your meeting ID or link</p>
                <div className="role-features">
                  <span><i className="fas fa-hand-paper"></i> Raise Hand</span>
                  <span><i className="fas fa-comments"></i> Live Chat</span>
                  <span><i className="fas fa-download"></i> Download Notes</span>
                  <span><i className="fas fa-clipboard-check"></i> Auto Attendance</span>
                </div>
              </div>
              <div className="role-action">
                <span>Join Class</span>
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
        <nav className="navbar zone-nav teaching">
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
                <>
                  <button className="share-btn" onClick={() => setShowShareModal(true)}>
                    <i className="fas fa-share"></i>
                    Share
                  </button>
                  {joinRequests.length > 0 && (
                    <button className="join-requests-btn" onClick={() => setShowJoinRequests(true)}>
                      <i className="fas fa-user-clock"></i>
                      {joinRequests.length} Requests
                    </button>
                  )}
                </>
              )}
              <button className="nav-back-btn" onClick={() => setUserRole('select')}>
                <i className="fas fa-arrow-left"></i>
              </button>
            </div>
          </div>
        </nav>

        <div className="teaching-container">
          {!sessionActive ? (
            <div className="pre-session">
              <div className="session-setup">
                <div className="setup-header">
                  <h1>Ready to Start Teaching?</h1>
                  <p>Set up your virtual classroom and begin your session</p>
                </div>
                
                <div className="setup-card">
                  <div className="setup-preview">
                    <div className="preview-video">
                      <i className="fas fa-video"></i>
                      <span>Camera Preview</span>
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
                    <h3>Session Settings</h3>
                    <div className="option-group">
                      <label>
                        <input type="checkbox" defaultChecked />
                        <span>Enable student cameras</span>
                      </label>
                      <label>
                        <input type="checkbox" defaultChecked />
                        <span>Allow student microphones</span>
                      </label>
                      <label>
                        <input type="checkbox" defaultChecked />
                        <span>Enable chat</span>
                      </label>
                      <label>
                        <input type="checkbox" />
                        <span>Record session</span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <button className="start-session-btn" onClick={startSession}>
                  <i className="fas fa-play"></i>
                  <span>Start Teaching Session</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="modern-teaching-interface">
              <div className="main-content-grid">
                <div className="video-main-section">
                  <TeacherVideo 
                    localVideoRef={localVideoRef}
                    localStream={localStream}
                    isScreenSharing={isScreenSharing}
                    isAudioEnabled={isAudioEnabled}
                    isVideoEnabled={isVideoEnabled}
                    peerConnections={peerConnections}
                    toggleAudio={toggleAudio}
                    toggleVideo={toggleVideo}
                  />
                  
                  <VideoControls 
                    isAudioEnabled={isAudioEnabled}
                    isVideoEnabled={isVideoEnabled}
                    isScreenSharing={isScreenSharing}
                    showWhiteboard={showWhiteboard}
                    toggleAudio={toggleAudio}
                    toggleVideo={toggleVideo}
                    startScreenShare={startScreenShare}
                    toggleWhiteboard={toggleWhiteboard}
                    endSession={endSession}
                  />
                  
                  <SessionInfo 
                    students={students}
                    sessionTime={sessionTime}
                    handRaisedStudents={handRaisedStudents}
                    formatTime={formatTime}
                  />
                </div>
                
                <div className="teaching-content-area">
                  {showWhiteboard ? (
                    <div className="whiteboard-section">
                      <div className="whiteboard-header">
                        <h3><i className="fas fa-chalkboard"></i> Interactive Whiteboard</h3>
                        <button className="minimize-whiteboard" onClick={toggleWhiteboard}>
                          <i className="fas fa-minus"></i>
                        </button>
                      </div>
                      <div className="whiteboard-container">
                        <Whiteboard isHost={true} socket={socket} roomId={meetingId} />
                      </div>
                    </div>
                  ) : (
                    <TeachingDashboard 
                      students={students}
                      attendance={attendance}
                      messages={messages}
                      isRecording={isRecording}
                      setShowAttendanceModal={setShowAttendanceModal}
                      createTest={createTest}
                      uploadNote={uploadNote}
                      setIsRecording={setIsRecording}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {showShareModal && (
          <div className="feedback-modal">
            <div className="modal-content">
              <h3>Share Meeting</h3>
              <p>Share this teaching session with your students</p>
              
              <div className="meeting-details">
                <div className="detail-item">
                  <label>Meeting ID:</label>
                  <div className="meeting-id-display">
                    <span>{meetingId}</span>
                    <button onClick={() => navigator.clipboard.writeText(meetingId)}>
                      <i className="fas fa-copy"></i>
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="modal-actions">
                <button className="submit-feedback-btn" onClick={copyMeetingLink}>
                  <i className="fas fa-link"></i>
                  Copy Link
                </button>
                <button className="submit-feedback-btn" onClick={shareMeeting}>
                  <i className="fas fa-share"></i>
                  Share
                </button>
                <button className="skip-btn" onClick={() => setShowShareModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        
        {showAttendanceModal && (
          <div className="modal-overlay" onClick={() => setShowAttendanceModal(false)}>
            <div className="modal-popup" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Present Students ({students.length})</h3>
                <button className="close-btn" onClick={() => setShowAttendanceModal(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="modal-body">
                {students.length > 0 ? (
                  <div className="student-list">
                    {students.map((student, index) => (
                      <div key={student.id || index} className="student-row">
                        <span className="student-name">{student.name || 'Unknown Student'}</span>
                        <span className="join-time">Online</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <i className="fas fa-users"></i>
                    <span>No students present</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        

        
        {showJoinRequests && (
          <div className="modal-overlay" onClick={() => setShowJoinRequests(false)}>
            <div className="modal-popup" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Join Requests ({joinRequests.length})</h3>
                <button className="close-btn" onClick={() => setShowJoinRequests(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="modal-body">
                {joinRequests.length > 0 ? (
                  <div className="join-requests-list">
                    {joinRequests.map(request => (
                      <div key={request.id} className="join-request-item">
                        <div className="request-info">
                          <div className="student-avatar">
                            <span>{request.student.avatar}</span>
                          </div>
                          <div className="request-details">
                            <div className="student-name">{request.student.name}</div>
                            <div className="request-time">{new Date(request.timestamp).toLocaleTimeString()}</div>
                          </div>
                        </div>
                        <div className="request-actions">
                          <button 
                            className="approve-btn"
                            onClick={() => approveJoinRequest(request.id)}
                          >
                            <i className="fas fa-check"></i>
                            Approve
                          </button>
                          <button 
                            className="reject-btn"
                            onClick={() => rejectJoinRequest(request.id)}
                          >
                            <i className="fas fa-times"></i>
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <i className="fas fa-user-check"></i>
                    <span>No pending requests</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {showCopySuccess && (
          <div className="copy-success-popup">
            <i className="fas fa-check-circle"></i>
            <span>Meeting link copied!</span>
          </div>
        )}
      </>
    );
  }

  return null;
}

export default TeachingZone;