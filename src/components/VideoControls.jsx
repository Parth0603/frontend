import React from 'react';

function VideoControls({ 
  isAudioEnabled, 
  isVideoEnabled, 
  isScreenSharing, 
  showWhiteboard,
  toggleAudio, 
  toggleVideo, 
  startScreenShare, 
  toggleWhiteboard,
  endSession 
}) {
  return (
    <div className="main-controls-bar">
      <div className="control-group">
        <button 
          className={`main-control-btn ${isAudioEnabled ? 'active' : 'muted'}`}
          onClick={toggleAudio}
        >
          <i className={`fas fa-microphone${isAudioEnabled ? '' : '-slash'}`}></i>
          <span>{isAudioEnabled ? 'Mute' : 'Unmute'}</span>
        </button>
        
        <button 
          className={`main-control-btn ${isVideoEnabled ? 'active' : 'off'}`}
          onClick={toggleVideo}
        >
          <i className={`fas fa-video${isVideoEnabled ? '' : '-slash'}`}></i>
          <span>{isVideoEnabled ? 'Stop Video' : 'Start Video'}</span>
        </button>
        
        <button 
          className={`main-control-btn ${isScreenSharing ? 'sharing' : ''}`}
          onClick={startScreenShare}
        >
          <i className={`fas fa-${isScreenSharing ? 'stop' : 'desktop'}`}></i>
          <span>{isScreenSharing ? 'Stop Share' : 'Share Screen'}</span>
        </button>
        
        <button 
          className={`main-control-btn ${showWhiteboard ? 'active' : ''}`}
          onClick={toggleWhiteboard}
        >
          <i className="fas fa-chalkboard"></i>
          <span>{showWhiteboard ? 'Close Board' : 'Whiteboard'}</span>
        </button>
      </div>
      
      <div className="end-session-group">
        <button className="end-session-btn" onClick={endSession}>
          <i className="fas fa-sign-out-alt"></i>
          <span>End Session</span>
        </button>
      </div>
    </div>
  );
}

export default VideoControls;