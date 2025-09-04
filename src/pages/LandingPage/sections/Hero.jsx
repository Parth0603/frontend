import React from 'react';

const Hero = ({ navigate }) => {
  return (
    <section className="hero">
      {/* The hero-background now contains all visual background elements */}
      <div className="hero-background">
        <div className="hero-grid"></div>
        <div className="hero-glow"></div>
        
        {/* Floating orbs */}
        <div className="hero-orb hero-orb-1"></div>
        <div className="hero-orb hero-orb-2"></div>
        <div className="hero-orb hero-orb-3"></div>
        
        {/* Geometric shapes */}
        <div className="hero-shape hero-triangle"></div>
        <div className="hero-shape hero-square"></div>
        <div className="hero-shape hero-circle"></div>
      </div>

      <div className="hero-content">
        {/* A subtle badge to announce the platform, adding a modern touch */}
        <div className="hero-badge">
          <span className="badge-text">✨ Revolutionary Collaboration Platform</span>
        </div>
        
        {/* The main headline, designed to be bold and impactful */}
        <h1 className="hero-title">
          Beyond the Screen.
          <br />
          <span className="gradient-text">Into the Experience.</span>
        </h1>
        
        {/* A clear and concise description of the product's value */}
        <p className="hero-description">
          SYNTRA isn't just another collaboration tool. It's a universe of interactive zones designed to make online interaction more human, engaging, and productive.
        </p>
        
        {/* Primary and secondary call-to-action buttons */}
        <div className="hero-actions">
          <button onClick={() => navigate('login')} className="btn-primary btn-hero">
            <span>Enter SYNTRA</span>
            <i className="fas fa-arrow-right"></i>
          </button>
          <button className="btn-secondary btn-hero">
            <i className="fas fa-play"></i>
            <span>Watch Demo</span>
          </button>
        </div>

        {/* Social proof or key stats to build trust */}
        <div className="hero-stats">
          <div className="stat">
            <strong>1000+</strong>
            <span>Active Users</span>
          </div>
          <div className="stat">
            <strong>5+</strong>
            <span>Zone Types</span>
          </div>
          <div className="stat">
            <strong>24/7</strong>
            <span>Available</span>
          </div>
        </div>
      </div>

      {/* A subtle indicator to encourage users to scroll down */}
      <div className="scroll-indicator">
        <div className="scroll-mouse">
          <div className="scroll-wheel"></div>
        </div>
        <span>Explore</span>
      </div>
    </section>
  );
};

export default Hero;
