// User Gaming Interface Component
const UserGamingInterface = ({ 
  participants, 
  remoteStreams, 
  localVideoRef, 
  isAudioEnabled, 
  isVideoEnabled, 
  isScreenSharing,
  toggleAudio,
  toggleVideo,
  startScreenShare,
  stopScreenShare,
  endSession,
  messages,
  newMessage,
  setNewMessage,
  sendMessage,
  messagesEndRef
}) => {
  return (
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
          {participants.filter(p => p.id !== 'user').map(participant => (
            <div key={participant.id} className="participant-video">
              <div className="video-stream">
                {remoteStreams[participant.id] ? (
                  <video 
                    autoPlay 
                    playsInline
                    className="video-element"
                    ref={(video) => {
                      if (video && remoteStreams[participant.id]) {
                        video.srcObject = remoteStreams[participant.id];
                      }
                    }}
                  />
                ) : (
                  <div className="video-placeholder">
                    <div className="participant-avatar">
                      <span>{participant.avatar}</span>
                    </div>
                  </div>
                )}
                {participant.screenshare && (
                  <div className="screen-badge"><i className="fas fa-desktop"></i></div>
                )}
              </div>
              <div className="video-name">
                <span className="participant-name">{participant.name} {participant.isHost && '(Host)'}</span>
              </div>
              <div className="participant-controls">
                <span className={`control-indicator ${participant.audio ? 'active' : 'muted'}`}>
                  <i className={`fas ${participant.audio ? 'fa-microphone' : 'fa-microphone-slash'}`}></i>
                </span>
                <span className={`control-indicator ${participant.video ? 'active' : 'muted'}`}>
                  <i className={`fas ${participant.video ? 'fa-video' : 'fa-video-slash'}`}></i>
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
  );
};

export default UserGamingInterface;