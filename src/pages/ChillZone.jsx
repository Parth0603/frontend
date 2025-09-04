import React, { useState, useEffect } from 'react';

function ChillZone({ navigate }) {
  const [userRole, setUserRole] = useState('select');
  const [roomActive, setRoomActive] = useState(false);
  const [meetingId, setMeetingId] = useState('');
  const [sessionTime, setSessionTime] = useState(0);
  const [currentTrack, setCurrentTrack] = useState({
    title: 'Lofi Hip Hop Mix',
    artist: 'Chill Beats Radio',
    playing: true
  });
  const [participants] = useState([
    { id: 1, name: 'Alex Johnson', avatar: '😎', mood: '🎵', status: 'vibing' },
    { id: 2, name: 'Jordan Smith', avatar: '🎧', mood: '😌', status: 'relaxing' },
    { id: 3, name: 'Casey Brown', avatar: '🎬', mood: '🍿', status: 'watching' },
    { id: 4, name: 'Sam Wilson', avatar: '🎮', mood: '🎯', status: 'gaming' }
  ]);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Alex', message: 'This music is perfect! 🎵', time: '3:30 PM' },
    { id: 2, sender: 'Jordan', message: 'Anyone up for some trivia?', time: '3:31 PM' },
    { id: 3, sender: 'Casey', message: 'Let\'s watch a movie next! 🎬', time: '3:32 PM' }
  ]);

  useEffect(() => {
    let timer;
    if (roomActive) {
      timer = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [roomActive]);

  const startRoom = () => {
    setRoomActive(true);
    setMeetingId(`CHILL-${Math.random().toString(36).substr(2, 9).toUpperCase()}`);
    setSessionTime(0);
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
              <i className="fas fa-music"></i>
              <span>Chill Zone</span>
            </div>
            <button className="nav-back-btn" onClick={() => navigate('dashboard')}>
              <i className="fas fa-arrow-left"></i>
            </button>
          </div>
        </nav>

        <div className="zone-container chill-zone">
          <div className="zone-hero">
            <div className="hero-content">
              <h1>Chill Zone</h1>
              <p>Relax, listen to music, watch videos, and hang out with friends</p>
              <div className="zone-stats">
                <div className="stat">
                  <span className="number">3.2K+</span>
                  <span className="label">Chill Sessions</span>
                </div>
                <div className="stat">
                  <span className="number">15K+</span>
                  <span className="label">Songs Played</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="role-selection modern">
            <div className="role-card host" onClick={() => setUserRole('host')}>
              <div className="role-icon">
                <i className="fas fa-plus-circle"></i>
              </div>
              <div className="role-content">
                <h3>Create Chill Room</h3>
                <p>Start a relaxing space for you and your friends</p>
                <div className="role-features">
                  <span><i className="fas fa-music"></i> Music Sync</span>
                  <span><i className="fas fa-video"></i> Watch Together</span>
                  <span><i className="fas fa-gamepad"></i> Mini Games</span>
                  <span><i className="fas fa-palette"></i> Mood Board</span>
                </div>
              </div>
              <div className="role-action">
                <span>Create Room</span>
                <i className="fas fa-arrow-right"></i>
              </div>
            </div>
            
            <div className="role-card member" onClick={() => setUserRole('member')}>
              <div className="role-icon">
                <i className="fas fa-sign-in-alt"></i>
              </div>
              <div className="role-content">
                <h3>Join Chill Room</h3>
                <p>Enter a room and start chilling with others</p>
                <div className="role-features">
                  <span><i className="fas fa-headphones"></i> Listen Together</span>
                  <span><i className="fas fa-comments"></i> Casual Chat</span>
                  <span><i className="fas fa-smile"></i> Share Moods</span>
                  <span><i className="fas fa-dice"></i> Play Games</span>
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
        <nav className="navbar zone-nav chill">
          <div className="nav-container">
            <div className="nav-logo" onClick={() => navigate('dashboard')}>
              <h2>SYNTRA</h2>
            </div>
            <div className="nav-info">
              {roomActive && (
                <>
                  <div className="session-info">
                    <span className="session-id">ID: {meetingId}</span>
                    <span className="session-time">{formatTime(sessionTime)}</span>
                  </div>
                  <div className="live-indicator chill">
                    <span className="pulse"></span>
                    <span>CHILL</span>
                  </div>
                </>
              )}
            </div>
            <div className="nav-actions">
              {roomActive && (
                <button className="share-btn" onClick={() => navigator.clipboard.writeText(meetingId)}>
                  <i className="fas fa-share"></i>
                  Share
                </button>
              )}
              <button className="nav-back-btn" onClick={() => setUserRole('select')}>
                <i className="fas fa-arrow-left"></i>
              </button>
            </div>
          </div>
        </nav>

        <div className="chill-container">
          {!roomActive ? (
            <div className="pre-session">
              <div className="session-setup">
                <div className="setup-header">
                  <h1>Ready to Chill?</h1>
                  <p>Set up your chill room and invite friends to relax</p>
                </div>
                
                <div className="setup-card">
                  <div className="setup-preview">
                    <div className="preview-video">
                      <i className="fas fa-music"></i>
                      <span>Chill Vibes</span>
                    </div>
                    <div className="preview-controls">
                      <button className="control-btn active">
                        <i className="fas fa-volume-up"></i>
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
                        <span>Enable music sync</span>
                      </label>
                      <label>
                        <input type="checkbox" defaultChecked />
                        <span>Allow video sharing</span>
                      </label>
                      <label>
                        <input type="checkbox" defaultChecked />
                        <span>Enable mini games</span>
                      </label>
                      <label>
                        <input type="checkbox" defaultChecked />
                        <span>Mood reactions</span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <button className="start-session-btn" onClick={startRoom}>
                  <i className="fas fa-play"></i>
                  <span>Start Chill Session</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="chill-interface">
              <div className="main-area">
                <div className="media-section">
                  <div className="media-tabs">
                    <button className="tab-btn active">
                      <i className="fas fa-music"></i>
                      Music
                    </button>
                    <button className="tab-btn">
                      <i className="fas fa-video"></i>
                      Videos
                    </button>
                    <button className="tab-btn">
                      <i className="fas fa-gamepad"></i>
                      Games
                    </button>
                  </div>

                  <div className="media-player">
                    <div className="now-playing">
                      <div className="media-display">
                        <div className="music-visualizer">
                          <div className="bar"></div>
                          <div className="bar"></div>
                          <div className="bar"></div>
                          <div className="bar"></div>
                          <div className="bar"></div>
                        </div>
                        <div className="track-info">
                          <h3>{currentTrack.title}</h3>
                          <p>{currentTrack.artist}</p>
                        </div>
                      </div>
                      
                      <div className="media-controls">
                        <button className="control-btn">
                          <i className="fas fa-step-backward"></i>
                        </button>
                        <button className="control-btn play-btn" onClick={() => setCurrentTrack({...currentTrack, playing: !currentTrack.playing})}>
                          <i className={`fas ${currentTrack.playing ? 'fa-pause' : 'fa-play'}`}></i>
                        </button>
                        <button className="control-btn">
                          <i className="fas fa-step-forward"></i>
                        </button>
                        <div className="volume-control">
                          <i className="fas fa-volume-up"></i>
                          <input type="range" className="volume-slider" defaultValue="70" />
                        </div>
                      </div>
                    </div>

                    <div className="media-queue">
                      <h4><i className="fas fa-list"></i> Queue</h4>
                      <div className="queue-list">
                        <div className="queue-item">
                          <div className="queue-info">
                            <span className="track-name">Midnight City - M83</span>
                            <small>Added by Alex</small>
                          </div>
                          <button className="queue-action"><i className="fas fa-times"></i></button>
                        </div>
                        <div className="queue-item">
                          <div className="queue-info">
                            <span className="track-name">Weightless - Marconi Union</span>
                            <small>Added by Jordan</small>
                          </div>
                          <button className="queue-action"><i className="fas fa-times"></i></button>
                        </div>
                      </div>
                      
                      <div className="add-media">
                        <input type="text" placeholder="Add music/video URL..." />
                        <button className="add-btn">
                          <i className="fas fa-plus"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="activities-section">
                  <h3><i className="fas fa-gamepad"></i> Activities</h3>
                  <div className="activity-grid">
                    <div className="activity-card">
                      <i className="fas fa-dice"></i>
                      <span>Roll Dice</span>
                    </div>
                    <div className="activity-card">
                      <i className="fas fa-question-circle"></i>
                      <span>Trivia</span>
                    </div>
                    <div className="activity-card">
                      <i className="fas fa-palette"></i>
                      <span>Draw Together</span>
                    </div>
                    <div className="activity-card">
                      <i className="fas fa-poll"></i>
                      <span>Quick Poll</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="sidebar">
                <div className="participants-panel">
                  <div className="panel-header">
                    <h3><i className="fas fa-users"></i> Chilling ({participants.length})</h3>
                  </div>
                  <div className="participants-grid">
                    {participants.map(participant => (
                      <div key={participant.id} className="participant-card">
                        <div className="participant-avatar">{participant.avatar}</div>
                        <div className="participant-info">
                          <span className="name">{participant.name}</span>
                          <span className="status">{participant.status}</span>
                        </div>
                        <div className="participant-mood">{participant.mood}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mood-board">
                  <div className="panel-header">
                    <h3><i className="fas fa-smile"></i> Mood Board</h3>
                  </div>
                  <div className="mood-reactions">
                    <button className="mood-btn">😴</button>
                    <button className="mood-btn">🎵</button>
                    <button className="mood-btn">😂</button>
                    <button className="mood-btn">🔥</button>
                    <button className="mood-btn">❤️</button>
                    <button className="mood-btn">🎉</button>
                    <button className="mood-btn">😌</button>
                    <button className="mood-btn">🍿</button>
                  </div>
                </div>

                <div className="chat-panel">
                  <div className="panel-header">
                    <h3><i className="fas fa-comments"></i> Chill Chat</h3>
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
                  </div>
                  <div className="chat-input">
                    <input type="text" placeholder="Say something chill..." />
                    <button className="send-btn">
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

  if (userRole === 'member') {
    return (
      <>
        <nav className="navbar zone-nav">
          <div className="nav-container">
            <div className="nav-logo" onClick={() => navigate('dashboard')}>
              <h2>SYNTRA</h2>
            </div>
            <div className="nav-breadcrumb">
              <span>Join Chill Room</span>
            </div>
            <button className="nav-back-btn" onClick={() => setUserRole('select')}>
              <i className="fas fa-arrow-left"></i>
            </button>
          </div>
        </nav>

        <div className="zone-container">
          <div className="join-session">
            <div className="join-header">
              <h1>Join Chill Room</h1>
              <p>Enter the room ID to start chilling with friends</p>
            </div>
            
            <div className="join-form">
              <div className="input-group">
                <input 
                  type="text" 
                  placeholder="Enter room ID (e.g., CHILL-ABC123XYZ)" 
                  className="meeting-input"
                />
                <button className="join-btn">
                  <i className="fas fa-sign-in-alt"></i>
                  Join Room
                </button>
              </div>
            </div>
            
            <div className="chill-features">
              <div className="feature-item">
                <i className="fas fa-music"></i>
                <span>Listen to synchronized music</span>
              </div>
              <div className="feature-item">
                <i className="fas fa-video"></i>
                <span>Watch videos together</span>
              </div>
              <div className="feature-item">
                <i className="fas fa-gamepad"></i>
                <span>Play casual mini games</span>
              </div>
              <div className="feature-item">
                <i className="fas fa-smile"></i>
                <span>Share your mood and vibes</span>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default ChillZone;
