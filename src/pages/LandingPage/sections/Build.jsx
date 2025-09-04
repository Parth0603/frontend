import React from 'react';

const Build = () => {
  return (
    <section style={{backgroundColor: '#172136', padding: '120px 0', minHeight: '400px'}}>
      <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 2rem'}}>
        <div style={{textAlign: 'center', marginBottom: '4rem'}}>
          <h2 style={{fontSize: '2.8rem', fontWeight: '800', color: '#f8fafc', marginBottom: '1rem'}}>Built for Modern Teams</h2>
          <p style={{fontSize: '1.2rem', color: '#94a3b8', maxWidth: '600px', margin: '0 auto'}}>Everything you need for effective collaboration, built with modern web technologies.</p>
        </div>

        <div className="build-grid">
          <div className="build-card">
            <i className="fa-solid fa-rocket"></i>
            <h4>Lightning Fast</h4>
            <p>Optimized performance ensures smooth interactions even with large teams.</p>
          </div>

          <div className="build-card">
            <i className="fa-solid fa-shield-alt"></i>
            <h4>Secure & Private</h4>
            <p>End-to-end encryption and enterprise-grade security protect your conversations.</p>
          </div>

          <div className="build-card">
            <i className="fa-solid fa-mobile-alt"></i>
            <h4>Cross-Platform</h4>
            <p>Works seamlessly across desktop, tablet, and mobile devices.</p>
          </div>

          <div className="build-card">
            <i className="fa-solid fa-cloud"></i>
            <h4>Cloud-Native</h4>
            <p>Scalable infrastructure that grows with your team and organization.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Build;
