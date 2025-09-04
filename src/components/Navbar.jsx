import React, { useState } from 'react';

function Navbar({ navigate }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <h2 onClick={() => navigate('landing')}>SYNTRA</h2>
        </div>
        
        {/* Desktop menu */}
        <div className="nav-menu desktop-menu">
          <button className="nav-link" onClick={() => document.getElementById('features')?.scrollIntoView({behavior: 'smooth'})}>Features</button>
          <button className="nav-link" onClick={() => document.getElementById('zones')?.scrollIntoView({behavior: 'smooth'})}>Zones</button>
          <button className="nav-link" onClick={() => navigate('contact')}>Contact Us</button>
          <button className="nav-link login-btn" onClick={() => navigate('login')}>Enter App</button>
        </div>
        
        {/* Mobile menu button */}
        <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <div className={`hamburger ${isMenuOpen ? 'active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="mobile-menu">
            <button onClick={() => {document.getElementById('zones')?.scrollIntoView({behavior: 'smooth'}); setIsMenuOpen(false);}}>Zones</button>
            <button onClick={() => {navigate('contact'); setIsMenuOpen(false);}}>Contact Us</button>
            <button onClick={() => {navigate('login'); setIsMenuOpen(false);}}>Enter App</button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
