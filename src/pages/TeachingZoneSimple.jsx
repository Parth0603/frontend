import React from 'react';

function TeachingZoneSimple({ navigate, user }) {
  console.log('TeachingZoneSimple rendered with user:', user);
  
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
          <div className="role-card teacher">
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
          
          <div className="role-card student">
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

export default TeachingZoneSimple;