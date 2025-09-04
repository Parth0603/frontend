import React from 'react';

function SessionInfo({ 
  students, 
  sessionTime, 
  handRaisedStudents, 
  formatTime 
}) {
  return (
    <div className="session-info-bar">
      <div className="info-item">
        <i className="fas fa-users"></i>
        <span>{students.length} Students</span>
      </div>
      <div className="info-item">
        <i className="fas fa-clock"></i>
        <span>{formatTime(sessionTime)}</span>
      </div>
      {handRaisedStudents.length > 0 && (
        <div className="info-item raised-hands">
          <i className="fas fa-hand-paper"></i>
          <span>{handRaisedStudents.length} Raised</span>
        </div>
      )}
    </div>
  );
}

export default SessionInfo;