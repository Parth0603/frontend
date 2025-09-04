import React from 'react';

function TeacherVideo({ 
  localVideoRef, 
  localStream, 
  isScreenSharing, 
  isAudioEnabled, 
  isVideoEnabled, 
  peerConnections,
  toggleAudio, 
  toggleVideo 
}) {
  return (
    <div className="teacher-video-container">
      <video 
        ref={localVideoRef}
        autoPlay 
        muted 
        playsInline
        className="teacher-main-video"
      />
      {!localStream && (
        <div className="video-placeholder">
          <i className="fas fa-user-circle"></i>
          <span>Camera Off</span>
        </div>
      )}
      
      {localStream && (
        <div className="connection-status">
          <div className="status-indicator connected">
            <i className="fas fa-circle"></i>
            <span>Connected ({peerConnections.size} students)</span>
          </div>
        </div>
      )}
      
      <div className="video-overlay-info">
        <div className="teacher-badge">
          <i className="fas fa-chalkboard-teacher"></i>
          <span>You (Teacher)</span>
        </div>
        {isScreenSharing && (
          <div className="screen-share-indicator">
            <i className="fas fa-desktop"></i>
            <span>Screen Sharing</span>
          </div>
        )}
        <div className="webrtc-status">
          <i className="fas fa-broadcast-tower"></i>
          <span>{peerConnections.size} Connected</span>
        </div>
      </div>
      
      <div className="quick-controls">
        <button 
          className={`quick-btn ${isAudioEnabled ? 'active' : 'muted'}`}
          onClick={toggleAudio}
        >
          <i className={`fas fa-microphone${isAudioEnabled ? '' : '-slash'}`}></i>
        </button>
        <button 
          className={`quick-btn ${isVideoEnabled ? 'active' : 'off'}`}
          onClick={toggleVideo}
        >
          <i className={`fas fa-video${isVideoEnabled ? '' : '-slash'}`}></i>
        </button>
      </div>
    </div>
  );
}

export default TeacherVideo;