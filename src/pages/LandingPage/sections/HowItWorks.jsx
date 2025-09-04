import React from 'react';

const HowItWorks = () => {
  return (
    <section style={{backgroundColor: '#172136', padding: '120px 0', minHeight: '400px'}}>
      <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 2rem'}}>
        <div style={{textAlign: 'center', marginBottom: '4rem'}}>
          <h2 style={{fontSize: '2.8rem', fontWeight: '800', color: '#f8fafc', marginBottom: '1rem'}}>How It Works</h2>
          <p style={{fontSize: '1.2rem', color: '#94a3b8', maxWidth: '600px', margin: '0 auto'}}>Simple setup, powerful results. Your team will be collaborating like never before.</p>
        </div>

        <div className="steps-container">
          <div className="step-item">
            <div className="step-visual">
              <div className="step-icon">
                <i className="fa-solid fa-user-plus"></i>
              </div>
              <div className="step-number">1</div>
            </div>
            <div className="step-content">
              <h3>Sign Up</h3>
              <p>Sign up in seconds and get instant access to all collaboration zones.</p>
            </div>
          </div>

          <div className="step-connector"></div>

          <div className="step-item">
            <div className="step-visual">
              <div className="step-icon">
                <i className="fa-solid fa-th-large"></i>
              </div>
              <div className="step-number">2</div>
            </div>
            <div className="step-content">
              <h3>Choose Zone</h3>
              <p>Select the perfect environment for your team's collaboration needs.</p>
            </div>
          </div>

          <div className="step-connector"></div>

          <div className="step-item">
            <div className="step-visual">
              <div className="step-icon">
                <i className="fa-solid fa-users"></i>
              </div>
              <div className="step-number">3</div>
            </div>
            <div className="step-content">
              <h3>Collaborate</h3>
              <p>Share a simple link to bring your team into an engaging collaborative experience.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
