import React from 'react';

const About = ({ navigate }) => {
  return (
    <div style={{minHeight: '100vh', backgroundColor: '#0b1120', color: '#f8fafc'}}>
      <nav style={{position: 'fixed', top: 0, left: 0, right: 0, backgroundColor: 'rgba(11, 17, 32, 0.9)', backdropFilter: 'blur(10px)', borderBottom: '1px solid #334155', zIndex: 1000, padding: '1rem 0'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h2 style={{color: '#06b6d4', fontWeight: '700', cursor: 'pointer'}} onClick={() => navigate('landing')}>SYNTRA</h2>
          <button onClick={() => navigate('landing')} style={{background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer'}}>← Back to Home</button>
        </div>
      </nav>
      
      <div style={{paddingTop: '100px', padding: '100px 2rem 4rem'}}>
        <div style={{maxWidth: '800px', margin: '0 auto'}}>
          <h1 style={{fontSize: '3rem', fontWeight: '800', marginBottom: '2rem', textAlign: 'center'}}>About SYNTRA</h1>
          
          <div style={{fontSize: '1.2rem', lineHeight: '1.8', color: '#94a3b8', marginBottom: '3rem'}}>
            <p style={{marginBottom: '2rem'}}>
              SYNTRA is revolutionizing online collaboration by creating interactive zones designed specifically for different types of teamwork and communication needs.
            </p>
            
            <p style={{marginBottom: '2rem'}}>
              Founded with the vision of making remote collaboration more human and engaging, we've built a platform that goes beyond traditional video calls to create immersive, purpose-built environments for teams.
            </p>
            
            <h2 style={{color: '#f8fafc', fontSize: '2rem', marginTop: '3rem', marginBottom: '1rem'}}>Our Mission</h2>
            <p style={{marginBottom: '2rem'}}>
              To transform how teams collaborate online by providing interactive, engaging, and productive digital spaces that feel as natural as being in the same room.
            </p>
            
            <h2 style={{color: '#f8fafc', fontSize: '2rem', marginTop: '3rem', marginBottom: '1rem'}}>Our Vision</h2>
            <p>
              A world where distance doesn't limit collaboration, where every team has access to the perfect digital environment for their unique needs, and where online interaction is as rich and meaningful as face-to-face communication.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
