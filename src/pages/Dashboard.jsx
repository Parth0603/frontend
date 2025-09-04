import React, { useState, useEffect } from 'react';
import OnboardingTour from '../components/OnboardingTour.jsx';

function Dashboard({ navigate, user, onLogout }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [recentActivity] = useState([
    { zone: 'Teaching', time: '2 hours ago', action: 'Completed session' },
    { zone: 'Workspace', time: '1 day ago', action: 'Team meeting' },
    { zone: 'Gaming', time: '3 days ago', action: 'Tournament match' }
  ]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const zones = [
    { 
      name: 'Teaching', 
      icon: 'fa-chalkboard-teacher', 
      desc: 'Interactive classrooms with advanced teaching tools', 
      page: 'teaching',
      features: ['Whiteboard', 'Screen Share', 'Attendance'],
      color: 'emerald',
      stats: '12 sessions'
    },
    { 
      name: 'Gaming', 
      icon: 'fa-gamepad', 
      desc: 'Casual gaming environment with voice chat', 
      page: 'gaming',
      features: ['Voice Chat', 'Screen Share', 'Tournaments'],
      color: 'purple',
      stats: '8 matches'
    },
    { 
      name: 'Events', 
      icon: 'fa-calendar-alt', 
      desc: 'Host large events with presentation tools', 
      page: 'events',
      features: ['Live Stream', 'Q&A', 'Recording'],
      color: 'amber',
      stats: '3 events'
    },
    { 
      name: 'Chill', 
      icon: 'fa-music', 
      desc: 'Relaxed environment for socializing', 
      page: 'chill',
      features: ['Music', 'Chat', 'Games'],
      color: 'cyan',
      stats: '24 hangouts'
    },
    { 
      name: 'Workspace', 
      icon: 'fa-building', 
      desc: '3D virtual office with custom avatars', 
      page: 'workspace', 
      featured: true,
      features: ['3D Environment', 'Avatars', 'Collaboration'],
      color: 'indigo',
      stats: '15 meetings'
    },
  ];

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <>
      <OnboardingTour />
      <nav className="navbar dashboard-nav">
        <div className="nav-container">
          <div className="nav-logo">
            <h2>SYNTRA</h2>
          </div>
          <div className="nav-center">
            <div className="nav-time">
              <i className="fas fa-clock"></i>
              <span>{currentTime.toLocaleTimeString()}</span>
            </div>
          </div>
          <div className="nav-user">
            <div className="user-avatar">
              <i className="fas fa-user"></i>
            </div>
            <div className="user-info">
              <span className="greeting">{getGreeting()}</span>
              <span className="username">{user?.name || 'User'}</span>
            </div>
            <button className="logout-btn" onClick={onLogout}>
              <i className="fas fa-sign-out-alt"></i>
            </button>
          </div>
        </div>
      </nav>

      <div className="dashboard-container">
        <div className="dashboard-hero">
          <div className="hero-content">
            <h1>Welcome to Your Digital Universe</h1>
            <p>Choose your collaboration zone and start connecting with others in immersive virtual environments</p>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">42</span>
                <span className="stat-label">Total Sessions</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">156</span>
                <span className="stat-label">Hours Connected</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">23</span>
                <span className="stat-label">Collaborators</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="floating-elements">
              <div className="floating-card card-1">
                <i className="fas fa-users"></i>
                <span>Live Collaboration</span>
              </div>
              <div className="floating-card card-2">
                <i className="fas fa-video"></i>
                <span>HD Video Calls</span>
              </div>
              <div className="floating-card card-3">
                <i className="fas fa-globe"></i>
                <span>Global Access</span>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-main">
          <div className="zones-section">
            <div className="section-header">
              <h2>Collaboration Zones</h2>
              <p>Select the perfect environment for your needs</p>
            </div>
            
            <div className="zones-grid">
              {zones.map(zone => (
                <div 
                  key={zone.name} 
                  className={`zone-card modern ${zone.color} ${zone.featured ? 'featured' : ''}`} 
                  onClick={() => navigate(zone.page)}
                >
                  <div className="zone-header">
                    <div className="zone-icon">
                      <i className={`fas ${zone.icon}`}></i>
                    </div>
                    <div className="zone-stats">
                      <span>{zone.stats}</span>
                    </div>
                  </div>
                  
                  <div className="zone-content">
                    <h3>{zone.name} Zone</h3>
                    <p>{zone.desc}</p>
                    
                    <div className="zone-features">
                      {zone.features.map(feature => (
                        <span key={feature} className="feature-tag">{feature}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="zone-footer">
                    <span className="enter-text">Enter Zone</span>
                    <div className="zone-arrow">
                      <i className="fas fa-arrow-right"></i>
                    </div>
                  </div>
                  
                  {zone.featured && (
                    <div className="featured-badge">
                      <i className="fas fa-star"></i>
                      <span>Popular</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="sidebar">
            <div className="activity-panel">
              <h3>
                <i className="fas fa-history"></i>
                Recent Activity
              </h3>
              <div className="activity-list">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="activity-item">
                    <div className="activity-icon">
                      <i className="fas fa-circle"></i>
                    </div>
                    <div className="activity-content">
                      <span className="activity-zone">{activity.zone}</span>
                      <span className="activity-action">{activity.action}</span>
                      <span className="activity-time">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="quick-actions">
              <h3>
                <i className="fas fa-bolt"></i>
                Quick Actions
              </h3>
              <div className="action-buttons">
                <button className="action-btn" onClick={() => navigate('workspace')}>
                  <i className="fas fa-plus"></i>
                  <span>Start Meeting</span>
                </button>
                <button className="action-btn" onClick={() => navigate('teaching')}>
                  <i className="fas fa-chalkboard"></i>
                  <span>Create Class</span>
                </button>
                <button className="action-btn" onClick={() => navigate('events')}>
                  <i className="fas fa-calendar-plus"></i>
                  <span>Schedule Event</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
