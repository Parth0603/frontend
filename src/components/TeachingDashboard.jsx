import React from 'react';

function TeachingDashboard({ 
  students, 
  attendance, 
  messages, 
  isRecording,
  setShowAttendanceModal,
  createTest,
  uploadNote,
  setIsRecording 
}) {
  return (
    <div className="content-dashboard">
      <div className="dashboard-header">
        <h3>Teaching Dashboard</h3>
        <p>Manage your class and interact with students</p>
      </div>
      
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-header">
            <i className="fas fa-users"></i>
            <h4>Students ({students.length})</h4>
          </div>
          <div className="card-content">
            {students.length > 0 ? (
              <div className="student-grid">
                {students.slice(0, 4).map(student => (
                  <div key={student.id} className="student-mini">
                    <div className="student-avatar">
                      <span>{student.avatar}</span>
                      {student.handRaised && <i className="fas fa-hand-paper hand-icon"></i>}
                    </div>
                    <span className="student-name">{student.name}</span>
                  </div>
                ))}
                {students.length > 4 && (
                  <div className="more-students">+{students.length - 4} more</div>
                )}
              </div>
            ) : (
              <div className="empty-state">
                <i className="fas fa-user-plus"></i>
                <span>No students joined yet</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="dashboard-card">
          <div className="card-header">
            <i className="fas fa-clipboard-check"></i>
            <h4>Attendance</h4>
          </div>
          <div className="card-content">
            <div className="attendance-stats">
              <div className="stat">
                <span className="number">{students.length}</span>
                <span className="label">Present</span>
              </div>
              <button 
                className="view-details-btn"
                onClick={() => setShowAttendanceModal(true)}
              >
                View Details
              </button>
            </div>
          </div>
        </div>
        
        <div className="dashboard-card">
          <div className="card-header">
            <i className="fas fa-comments"></i>
            <h4>Recent Messages</h4>
          </div>
          <div className="card-content">
            {messages.length > 0 ? (
              <div className="recent-messages">
                {messages.slice(-2).map(msg => (
                  <div key={msg.id} className="message-preview">
                    <strong>{msg.sender}:</strong>
                    <span>{msg.message.substring(0, 30)}...</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <i className="fas fa-comment-slash"></i>
                <span>No messages yet</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="dashboard-card">
          <div className="card-header">
            <i className="fas fa-tools"></i>
            <h4>Quick Actions</h4>
          </div>
          <div className="card-content">
            <div className="quick-actions">
              <button className="action-btn" onClick={createTest}>
                <i className="fas fa-clipboard-list"></i>
                <span>Start Quiz</span>
              </button>
              <label htmlFor="note-upload" className="action-btn">
                <i className="fas fa-upload"></i>
                <span>Upload Notes</span>
              </label>
              <input 
                type="file" 
                id="note-upload" 
                onChange={uploadNote}
                style={{ display: 'none' }}
                accept=".pdf,.doc,.docx,.ppt,.pptx"
              />
              <button 
                className={`action-btn ${isRecording ? 'recording' : ''}`}
                onClick={() => setIsRecording(!isRecording)}
              >
                <i className={`fas fa-${isRecording ? 'stop' : 'record-vinyl'}`}></i>
                <span>{isRecording ? 'Stop Rec' : 'Record'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeachingDashboard;