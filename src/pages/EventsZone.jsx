import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

function EventsZone({ navigate }) {
  const [userRole, setUserRole] = useState('select');
  const [eventActive, setEventActive] = useState(false);
  const [eventId, setEventId] = useState('');
  const [sessionTime, setSessionTime] = useState(0);
  const [chatEnabled, setChatEnabled] = useState(true);
  const [attendees, setAttendees] = useState([]);
  const [messages, setMessages] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [polls, setPolls] = useState([]);
  const [activePoll, setActivePoll] = useState(null);
  const [shareLink, setShareLink] = useState('');
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [joinEventId, setJoinEventId] = useState('');
  const [handRaised, setHandRaised] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [whiteboardOpen, setWhiteboardOpen] = useState(false);
  
  const socketRef = useRef(null);
  const localVideoRef = useRef(null);
  const screenShareRef = useRef(null);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingTool, setDrawingTool] = useState('pen');
  const [drawingColor, setDrawingColor] = useState('#000000');

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io('http://localhost:5000');
    
    // Socket event listeners
    socketRef.current.on('room-created', ({ roomId, success }) => {
      if (success) {
        console.log('Event room created:', roomId);
      }
    });
    
    socketRef.current.on('event-not-found', ({ roomId }) => {
      alert('Event not found. Please check the event ID.');
      setEventActive(false);
    });
    
    socketRef.current.on('attendee-joined', (attendee) => {
      console.log('New attendee joined:', attendee);
      setAttendees(prev => {
        const exists = prev.find(a => a.id === attendee.id);
        if (exists) return prev;
        return [...prev, attendee];
      });
    });
    
    socketRef.current.on('event-joined', ({ event, success }) => {
      if (success) {
        setEventTitle(event.title);
        setEventDescription(event.description);
        setAttendees(event.attendees);
        setDocuments(event.documents);
        setChatEnabled(event.settings.chatEnabled);
        setEventActive(true);
      }
    });
    
    socketRef.current.on('event-message', (message) => {
      setMessages(prev => [...prev, message]);
    });
    
    socketRef.current.on('event-hand-raised', ({ attendeeId, handRaised }) => {
      setAttendees(prev => prev.map(a => 
        a.id === attendeeId ? { ...a, handRaised } : a
      ));
    });
    
    socketRef.current.on('event-chat-toggled', ({ enabled }) => {
      setChatEnabled(enabled);
    });
    
    socketRef.current.on('event-poll-started', (poll) => {
      setActivePoll(poll);
      setPolls(prev => [...prev, poll]);
    });
    
    socketRef.current.on('event-document-shared', (document) => {
      setDocuments(prev => [...prev, document]);
    });
    
    socketRef.current.on('event-ended', () => {
      setEventActive(false);
      alert('Event has ended');
    });
    
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);
  
  useEffect(() => {
    let timer;
    if (eventActive) {
      timer = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [eventActive]);

  const createEvent = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await fetch('http://localhost:5000/api/events/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: eventTitle || 'Untitled Event',
          description: eventDescription,
          hostName: user.name || 'Host',
          hostEmail: user.email || ''
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setEventId(data.eventId);
        setShareLink(data.shareLink);
        
        // Join the socket room
        socketRef.current.emit('create-room', {
          roomId: data.eventId,
          host: user.name || 'Host'
        });
        
        setEventActive(true);
        setSessionTime(0);
        setAttendees([]);
        setMessages([]);
        setDocuments([]);
        setPolls([]);
      }
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event');
    }
  };
  
  const joinEvent = () => {
    if (!joinEventId.trim()) {
      alert('Please enter an event ID');
      return;
    }
    
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    socketRef.current.emit('join-room', {
      roomId: joinEventId.trim(),
      student: {
        name: user.name || 'Attendee',
        email: user.email || '',
        avatar: (user.name || 'A').charAt(0).toUpperCase()
      }
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const copyShareLink = () => {
    navigator.clipboard.writeText(shareLink);
    alert('Share link copied to clipboard!');
  };
  
  const downloadDocument = (doc) => {
    const link = document.createElement('a');
    link.href = `http://localhost:5000${doc.downloadUrl}`;
    link.download = doc.name;
    link.click();
  };

  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });
      
      if (screenShareRef.current) {
        screenShareRef.current.srcObject = stream;
      }
      
      setIsScreenSharing(true);
      
      stream.getVideoTracks()[0].onended = () => {
        setIsScreenSharing(false);
      };
    } catch (error) {
      console.error('Error starting screen share:', error);
    }
  };
  
  const stopScreenShare = () => {
    if (screenShareRef.current && screenShareRef.current.srcObject) {
      const tracks = screenShareRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      screenShareRef.current.srcObject = null;
    }
    setIsScreenSharing(false);
  };
  
  const toggleWhiteboard = () => {
    setWhiteboardOpen(!whiteboardOpen);
  };
  
  const uploadDocument = async (file) => {
    const formData = new FormData();
    formData.append('document', file);
    
    try {
      const response = await fetch(`http://localhost:5000/api/events/${eventId}/documents`, {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      if (data.success) {
        socketRef.current.emit('event-share-document', {
          eventId,
          document: data.document
        });
      }
    } catch (error) {
      console.error('Error uploading document:', error);
    }
  };
  
  const createPoll = () => {
    const question = prompt('Enter poll question:');
    if (!question) return;
    
    const optionsStr = prompt('Enter options (comma separated):');
    if (!optionsStr) return;
    
    const options = optionsStr.split(',').map(opt => opt.trim()).filter(opt => opt);
    if (options.length < 2) {
      alert('Please provide at least 2 options');
      return;
    }
    
    const duration = parseInt(prompt('Poll duration in seconds (default 60):') || '60');
    
    const poll = {
      question,
      options,
      duration,
      createdAt: new Date()
    };
    
    socketRef.current.emit('event-start-poll', { eventId, poll });
  };
  
  const toggleChat = () => {
    const newChatState = !chatEnabled;
    setChatEnabled(newChatState);
    socketRef.current.emit('event-toggle-chat', { eventId, enabled: newChatState });
  };
  
  const sendMessage = (messageText) => {
    if (!messageText.trim()) return;
    
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const message = {
      id: Date.now(),
      sender: user.name || 'User',
      message: messageText,
      time: new Date().toLocaleTimeString(),
      timestamp: new Date()
    };
    
    socketRef.current.emit('event-send-message', { eventId, message });
  };
  
  const toggleHandRaise = () => {
    const newHandState = !handRaised;
    setHandRaised(newHandState);
    socketRef.current.emit('event-raise-hand', {
      eventId,
      attendeeId: socketRef.current.id
    });
  };
  
  const endEvent = () => {
    if (confirm('Are you sure you want to end this event?')) {
      socketRef.current.emit('event-end', { eventId });
      setEventActive(false);
    }
  };
  
  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
  };
  
  const draw = (e) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = drawingTool === 'eraser' ? 20 : 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = drawingTool === 'eraser' ? '#ffffff' : drawingColor;
    
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };
  
  const stopDrawing = () => {
    setIsDrawing(false);
  };
  
  const clearWhiteboard = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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
              <i className="fas fa-calendar-alt"></i>
              <span>Events Zone</span>
            </div>
            <button className="nav-back-btn" onClick={() => navigate('dashboard')}>
              <i className="fas fa-arrow-left"></i>
            </button>
          </div>
        </nav>

        <div className="zone-container events-zone">
          <div className="zone-hero">
            <div className="hero-content">
              <h1>Events Zone</h1>
              <p>Host memorable virtual events and presentations</p>
              <div className="zone-stats">
                <div className="stat">
                  <span className="number">1.2K+</span>
                  <span className="label">Events Hosted</span>
                </div>
                <div className="stat">
                  <span className="number">50K+</span>
                  <span className="label">Attendees</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="role-selection modern">
            <div className="role-card host" onClick={() => setUserRole('host')}>
              <div className="role-icon">
                <i className="fas fa-microphone"></i>
              </div>
              <div className="role-content">
                <h3>Host Event</h3>
                <p>Create and manage virtual events with full control</p>
                <div className="role-features">
                  <span><i className="fas fa-broadcast-tower"></i> Live Streaming</span>
                  <span><i className="fas fa-poll"></i> Interactive Polls</span>
                  <span><i className="fas fa-question-circle"></i> Q&A Sessions</span>
                  <span><i className="fas fa-chart-bar"></i> Analytics</span>
                </div>
              </div>
              <div className="role-action">
                <span>Create Event</span>
                <i className="fas fa-arrow-right"></i>
              </div>
            </div>
            
            <div className="role-card attendee" onClick={() => setUserRole('attendee')}>
              <div className="role-icon">
                <i className="fas fa-users"></i>
              </div>
              <div className="role-content">
                <h3>Join Event</h3>
                <p>Participate in presentations and networking</p>
                <div className="role-features">
                  <span><i className="fas fa-eye"></i> Watch Live</span>
                  <span><i className="fas fa-hand-paper"></i> Raise Hand</span>
                  <span><i className="fas fa-comments"></i> Live Chat</span>
                  <span><i className="fas fa-download"></i> Resources</span>
                </div>
              </div>
              <div className="role-action">
                <span>Join Event</span>
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
        <nav className="navbar zone-nav events">
          <div className="nav-container">
            <div className="nav-logo" onClick={() => navigate('dashboard')}>
              <h2>SYNTRA</h2>
            </div>
            <div className="nav-info">
              {eventActive && (
                <>
                  <div className="session-info">
                    <span className="session-id">ID: {eventId}</span>
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
              {eventActive && (
                <button className="share-btn" onClick={copyShareLink}>
                  <i className="fas fa-share"></i>
                  Share Link
                </button>
              )}
              <button className="nav-back-btn" onClick={() => setUserRole('select')}>
                <i className="fas fa-arrow-left"></i>
              </button>
            </div>
          </div>
        </nav>

        <div className="events-container">
          {!eventActive ? (
            <div className="pre-session">
              <div className="session-setup">
                <div className="setup-header">
                  <h1>Ready to Host Your Event?</h1>
                  <p>Set up your virtual event and start broadcasting</p>
                </div>
                
                <div className="setup-card">
                  <div className="setup-form">
                    <div className="form-group">
                      <label>Event Title</label>
                      <input 
                        type="text" 
                        value={eventTitle}
                        onChange={(e) => setEventTitle(e.target.value)}
                        placeholder="Enter event title"
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Event Description</label>
                      <textarea 
                        value={eventDescription}
                        onChange={(e) => setEventDescription(e.target.value)}
                        placeholder="Describe your event"
                        className="form-textarea"
                        rows="3"
                      />
                    </div>
                  </div>
                  
                  <div className="setup-preview">
                    <div className="preview-video">
                      <video ref={localVideoRef} autoPlay muted className="host-video-preview" />
                      <i className="fas fa-broadcast-tower"></i>
                      <span>Host Camera</span>
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
                </div>
                
                <button className="start-session-btn" onClick={createEvent}>
                  <i className="fas fa-broadcast-tower"></i>
                  <span>Create & Start Event</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="events-interface">
              <div className="main-stage">
                <div className="presenter-area">
                  <div className="host-video">
                    <div className="video-stream">
                      {isScreenSharing ? (
                        <video ref={screenShareRef} autoPlay className="screen-share-video" />
                      ) : (
                        <>
                          <video ref={localVideoRef} autoPlay muted className="host-video-stream" />
                          <div className="video-overlay">
                            <span className="presenter-label">Host - {eventTitle}</span>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="presenter-controls">
                      <button className="control-btn active">
                        <i className="fas fa-microphone"></i>
                      </button>
                      <button className="control-btn active">
                        <i className="fas fa-video"></i>
                      </button>
                      <button 
                        className={`control-btn ${isScreenSharing ? 'active' : ''}`}
                        onClick={isScreenSharing ? stopScreenShare : startScreenShare}
                      >
                        <i className="fas fa-desktop"></i>
                      </button>
                      <button 
                        className={`control-btn ${whiteboardOpen ? 'active' : ''}`}
                        onClick={toggleWhiteboard}
                      >
                        <i className="fas fa-chalkboard"></i>
                      </button>
                      <button className="control-btn end-btn" onClick={endEvent}>
                        <i className="fas fa-stop"></i>
                      </button>
                    </div>
                  </div>
                </div>

                {whiteboardOpen && (
                  <div className="presentation-board">
                    <div className="board-header">
                      <div className="board-tools">
                        <button 
                          className={`tool-btn ${drawingTool === 'pen' ? 'active' : ''}`}
                          onClick={() => setDrawingTool('pen')}
                        >
                          <i className="fas fa-pen"></i>
                        </button>
                        <button 
                          className={`tool-btn ${drawingTool === 'eraser' ? 'active' : ''}`}
                          onClick={() => setDrawingTool('eraser')}
                        >
                          <i className="fas fa-eraser"></i>
                        </button>
                        <input 
                          type="color" 
                          value={drawingColor}
                          onChange={(e) => setDrawingColor(e.target.value)}
                          className="color-picker"
                        />
                      </div>
                      <div className="board-actions">
                        <button className="action-btn" onClick={clearWhiteboard}>
                          <i className="fas fa-trash"></i>
                          Clear
                        </button>
                        <button className="action-btn" onClick={toggleWhiteboard}>
                          <i className="fas fa-times"></i>
                          Close
                        </button>
                      </div>
                    </div>
                    <div className="board-canvas">
                      <canvas 
                        ref={canvasRef}
                        width={800}
                        height={600}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        className="whiteboard-canvas"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="sidebar">
                <div className="audience-panel">
                  <div className="panel-header">
                    <h3><i className="fas fa-users"></i> Audience ({attendees.length})</h3>
                  </div>
                  <div className="audience-stats">
                    <div className="stat-item">
                      <span className="number">{attendees.filter(a => a.handRaised).length}</span>
                      <span className="label">Hands Raised</span>
                    </div>
                    <div className="stat-item">
                      <span className="number">{attendees.filter(a => a.status === 'online').length}</span>
                      <span className="label">Online</span>
                    </div>
                  </div>
                  <div className="attendee-list">
                    {attendees.map(attendee => (
                      <div key={attendee.id} className={`attendee-item ${attendee.handRaised ? 'hand-raised' : ''}`}>
                        <div className="attendee-avatar">
                          <span>{attendee.avatar}</span>
                        </div>
                        <div className="attendee-info">
                          <span className="name">{attendee.name}</span>
                          <span className="status">{attendee.status}</span>
                        </div>
                        {attendee.handRaised && <i className="fas fa-hand-paper hand-icon"></i>}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="host-tools">
                  <div className="panel-header">
                    <h3><i className="fas fa-tools"></i> Event Tools</h3>
                  </div>
                  <div className="tools-grid">
                    <button className="tool-btn" onClick={createPoll}>
                      <i className="fas fa-poll"></i>
                      <span>Create Poll</span>
                    </button>
                    <button className="tool-btn" onClick={toggleWhiteboard}>
                      <i className="fas fa-chalkboard"></i>
                      <span>Whiteboard</span>
                    </button>
                    <button className="tool-btn" onClick={() => fileInputRef.current?.click()}>
                      <i className="fas fa-file-upload"></i>
                      <span>Share Files</span>
                    </button>
                    <button className="tool-btn" onClick={toggleChat}>
                      <i className={`fas ${chatEnabled ? 'fa-comment-slash' : 'fa-comment'}`}></i>
                      <span>{chatEnabled ? 'Disable' : 'Enable'} Chat</span>
                    </button>
                    <button className="tool-btn" onClick={copyShareLink}>
                      <i className="fas fa-link"></i>
                      <span>Copy Link</span>
                    </button>
                    <button className="tool-btn danger" onClick={endEvent}>
                      <i className="fas fa-stop"></i>
                      <span>End Event</span>
                    </button>
                  </div>
                  
                  <input 
                    ref={fileInputRef}
                    type="file"
                    style={{ display: 'none' }}
                    onChange={(e) => e.target.files[0] && uploadDocument(e.target.files[0])}
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif"
                  />
                </div>
                
                {documents.length > 0 && (
                  <div className="documents-panel">
                    <div className="panel-header">
                      <h3><i className="fas fa-file"></i> Shared Documents</h3>
                    </div>
                    <div className="documents-list">
                      {documents.map(doc => (
                        <div key={doc.id} className="document-item">
                          <div className="doc-info">
                            <i className="fas fa-file"></i>
                            <span className="doc-name">{doc.name}</span>
                            <span className="doc-size">{(doc.size / 1024).toFixed(1)}KB</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="chat-panel">
                  <div className="panel-header">
                    <h3><i className="fas fa-comments"></i> Event Chat</h3>
                    <span className={`chat-status ${chatEnabled ? 'enabled' : 'disabled'}`}>
                      {chatEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  
                  {chatEnabled ? (
                    <>
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
                      </div>
                      <div className="chat-input">
                        <input 
                          type="text" 
                          placeholder="Message to audience..."
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              sendMessage(e.target.value);
                              e.target.value = '';
                            }
                          }}
                        />
                        <button 
                          className="send-btn"
                          onClick={(e) => {
                            const input = e.target.previousElementSibling;
                            sendMessage(input.value);
                            input.value = '';
                          }}
                        >
                          <i className="fas fa-paper-plane"></i>
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="chat-disabled">
                      <p>Chat is currently disabled</p>
                    </div>
                  )}
                </div>
                
                {activePoll && (
                  <div className="poll-panel">
                    <div className="panel-header">
                      <h3><i className="fas fa-poll"></i> Active Poll</h3>
                    </div>
                    <div className="poll-content">
                      <h4>{activePoll.question}</h4>
                      <div className="poll-options">
                        {activePoll.options.map((option, index) => (
                          <div key={index} className="poll-option">
                            <span>{option}</span>
                            <span className="vote-count">
                              {Object.values(activePoll.votes || {}).filter(v => v === index).length} votes
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </>
    );
  }

  if (userRole === 'attendee') {
    return (
      <>
        <nav className="navbar zone-nav">
          <div className="nav-container">
            <div className="nav-logo" onClick={() => navigate('dashboard')}>
              <h2>SYNTRA</h2>
            </div>
            <div className="nav-breadcrumb">
              <span>Join Event</span>
            </div>
            <button className="nav-back-btn" onClick={() => setUserRole('select')}>
              <i className="fas fa-arrow-left"></i>
            </button>
          </div>
        </nav>

        <div className="zone-container">
          {!eventActive ? (
            <div className="join-session">
              <div className="join-header">
                <h1>Join Virtual Event</h1>
                <p>Enter the event ID shared by the host</p>
              </div>
              
              <div className="join-form">
                <div className="input-group">
                  <input 
                    type="text" 
                    value={joinEventId}
                    onChange={(e) => setJoinEventId(e.target.value)}
                    placeholder="Enter event ID (e.g., EVENT-ABC123XYZ)" 
                    className="meeting-input"
                    onKeyPress={(e) => e.key === 'Enter' && joinEvent()}
                  />
                  <button className="join-btn" onClick={joinEvent}>
                    <i className="fas fa-sign-in-alt"></i>
                    Join Event
                  </button>
                </div>
              </div>
              
              <div className="attendee-features">
                <div className="feature-item">
                  <i className="fas fa-eye"></i>
                  <span>Watch live presentations</span>
                </div>
                <div className="feature-item">
                  <i className="fas fa-hand-paper"></i>
                  <span>Raise hand to ask questions</span>
                </div>
                <div className="feature-item">
                  <i className="fas fa-poll"></i>
                  <span>Participate in polls & Q&A</span>
                </div>
                <div className="feature-item">
                  <i className="fas fa-download"></i>
                  <span>Download shared documents</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="attendee-interface">
              <div className="event-header">
                <h1>{eventTitle}</h1>
                <p>{eventDescription}</p>
                <div className="event-controls">
                  <button 
                    className={`control-btn ${handRaised ? 'active' : ''}`}
                    onClick={toggleHandRaise}
                  >
                    <i className="fas fa-hand-paper"></i>
                    {handRaised ? 'Lower Hand' : 'Raise Hand'}
                  </button>
                </div>
              </div>
              
              <div className="event-content">
                <div className="main-view">
                  <div className="host-stream">
                    <div className="stream-placeholder">
                      <i className="fas fa-broadcast-tower"></i>
                      <span>Host Presentation</span>
                    </div>
                  </div>
                  
                  {whiteboardOpen && (
                    <div className="whiteboard-view">
                      <canvas 
                        ref={canvasRef}
                        width={800}
                        height={400}
                        className="attendee-whiteboard"
                      />
                    </div>
                  )}
                </div>
                
                <div className="attendee-sidebar">
                  {documents.length > 0 && (
                    <div className="documents-section">
                      <h3><i className="fas fa-file"></i> Documents</h3>
                      <div className="documents-list">
                        {documents.map(doc => (
                          <div key={doc.id} className="document-item">
                            <div className="doc-info">
                              <i className="fas fa-file"></i>
                              <span className="doc-name">{doc.name}</span>
                            </div>
                            <button 
                              className="download-btn"
                              onClick={() => downloadDocument(doc)}
                            >
                              <i className="fas fa-download"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {activePoll && (
                    <div className="poll-section">
                      <h3><i className="fas fa-poll"></i> Live Poll</h3>
                      <div className="poll-content">
                        <h4>{activePoll.question}</h4>
                        <div className="poll-options">
                          {activePoll.options.map((option, index) => (
                            <button 
                              key={index} 
                              className="poll-option-btn"
                              onClick={() => {
                                socketRef.current.emit('event-vote-poll', {
                                  pollId: activePoll.id,
                                  optionId: index,
                                  userId: socketRef.current.id
                                });
                              }}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {chatEnabled && (
                    <div className="chat-section">
                      <h3><i className="fas fa-comments"></i> Event Chat</h3>
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
                      </div>
                      <div className="chat-input">
                        <input 
                          type="text" 
                          placeholder="Type your message..."
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              sendMessage(e.target.value);
                              e.target.value = '';
                            }
                          }}
                        />
                        <button 
                          className="send-btn"
                          onClick={(e) => {
                            const input = e.target.previousElementSibling;
                            sendMessage(input.value);
                            input.value = '';
                          }}
                        >
                          <i className="fas fa-paper-plane"></i>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </>
    );
  }
}

export default EventsZone;
