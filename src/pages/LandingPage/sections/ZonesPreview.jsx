import React from 'react';
import LiveDemo from '../../../components/LiveDemo.jsx';

const ZonesPreview = ({ navigate }) => {
  return (
    <section id="zones" style={{backgroundColor: '#172136', padding: 'clamp(60px, 10vw, 120px) 0', position: 'relative'}}>
      <div style={{maxWidth: '1400px', margin: '0 auto', padding: '0 1rem'}}>
        <div style={{textAlign: 'center', marginBottom: 'clamp(3rem, 8vw, 5rem)'}}>
          <h2 style={{fontSize: 'clamp(2rem, 6vw, 3rem)', fontWeight: '800', color: '#f8fafc', marginBottom: '1rem', lineHeight: '1.2'}}>Collaboration Zones</h2>
          <p style={{fontSize: 'clamp(1rem, 3vw, 1.3rem)', color: '#94a3b8', maxWidth: '600px', margin: '0 auto'}}>Each zone is crafted for specific collaboration needs. Discover where your team thrives.</p>
        </div>

        {/* Featured Zone - Responsive Layout */}
        <div style={{marginBottom: 'clamp(3rem, 6vw, 4rem)'}}>
          <div style={{background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%)', border: '2px solid rgba(99, 102, 241, 0.3)', borderRadius: '24px', padding: 'clamp(2rem, 5vw, 3rem)', position: 'relative', overflow: 'hidden'}}>
            <div style={{position: 'absolute', top: '1rem', right: '1rem', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: 'clamp(0.7rem, 2vw, 0.8rem)', fontWeight: '600'}}>FEATURED</div>
            
            <div style={{display: 'grid', gridTemplateColumns: window.innerWidth > 768 ? '1fr 1fr' : '1fr', gap: 'clamp(2rem, 5vw, 3rem)', alignItems: 'center'}}>
              <div>
                <div style={{width: 'clamp(60px, 15vw, 80px)', height: 'clamp(60px, 15vw, 80px)', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'clamp(1.5rem, 4vw, 2rem)', marginBottom: '2rem', boxShadow: '0 10px 30px rgba(99, 102, 241, 0.3)'}}>
                  🏢
                </div>
                <h3 style={{fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: '700', color: '#f8fafc', marginBottom: '1rem', lineHeight: '1.2'}}>Workspace Zone</h3>
                <p style={{fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', color: '#94a3b8', marginBottom: '2rem', lineHeight: '1.6'}}>Your team's digital office with custom 3D layouts, spontaneous interactions, and zone-based collaboration that feels natural.</p>
                
                <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem'}}>
                  <span style={{padding: '0.5rem 1rem', background: 'rgba(99, 102, 241, 0.2)', color: '#6366f1', borderRadius: '20px', fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', fontWeight: '500'}}>3D Office</span>
                  <span style={{padding: '0.5rem 1rem', background: 'rgba(99, 102, 241, 0.2)', color: '#6366f1', borderRadius: '20px', fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', fontWeight: '500'}}>Custom Avatars</span>
                  <span style={{padding: '0.5rem 1rem', background: 'rgba(99, 102, 241, 0.2)', color: '#6366f1', borderRadius: '20px', fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', fontWeight: '500'}}>Room Creation</span>
                </div>
                
                <button onClick={() => navigate('login')} style={{padding: 'clamp(0.8rem, 2vw, 1rem) clamp(1.5rem, 4vw, 2rem)', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', border: 'none', borderRadius: '12px', fontSize: 'clamp(0.9rem, 2vw, 1rem)', fontWeight: '600', cursor: 'pointer', width: window.innerWidth <= 768 ? '100%' : 'auto'}}>
                  Try Workspace Zone
                </button>
              </div>
              
              <div style={{position: 'relative', display: window.innerWidth <= 768 ? 'none' : 'block'}}>
                <div style={{background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(6, 182, 212, 0.1))', borderRadius: '20px', padding: '2rem', border: '1px solid rgba(99, 102, 241, 0.2)'}}>
                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1rem'}}>
                    <div style={{width: '40px', height: '40px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '50%'}}></div>
                    <div style={{width: '40px', height: '40px', background: 'linear-gradient(135deg, #06b6d4, #6366f1)', borderRadius: '50%'}}></div>
                    <div style={{width: '40px', height: '40px', background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', borderRadius: '50%'}}></div>
                  </div>
                  <div style={{height: '100px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(6, 182, 212, 0.05))', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.1)'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Other Zones - Mobile-First Grid */}
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: 'clamp(1rem, 3vw, 2rem)'}}>
          <div style={{background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '20px', padding: 'clamp(1.5rem, 4vw, 2rem)', transition: 'transform 0.3s ease'}} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{width: 'clamp(50px, 12vw, 60px)', height: 'clamp(50px, 12vw, 60px)', background: 'linear-gradient(135deg, #10b981, #059669)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', marginBottom: '1.5rem'}}>
              👨🏫
            </div>
            <h3 style={{fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', fontWeight: '700', color: '#f8fafc', marginBottom: '1rem'}}>Teaching Zone</h3>
            <p style={{color: '#94a3b8', marginBottom: '1.5rem', fontSize: 'clamp(0.85rem, 2vw, 0.95rem)', lineHeight: '1.5'}}>Interactive whiteboards, quizzes, and engagement tools for modern education.</p>
            <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
              <span style={{padding: '0.3rem 0.8rem', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', borderRadius: '15px', fontSize: 'clamp(0.7rem, 1.8vw, 0.8rem)'}}>Whiteboards</span>
              <span style={{padding: '0.3rem 0.8rem', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', borderRadius: '15px', fontSize: 'clamp(0.7rem, 1.8vw, 0.8rem)'}}>Quizzes</span>
            </div>
          </div>

          <div style={{background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '20px', padding: 'clamp(1.5rem, 4vw, 2rem)', transition: 'transform 0.3s ease'}} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{width: 'clamp(50px, 12vw, 60px)', height: 'clamp(50px, 12vw, 60px)', background: 'linear-gradient(135deg, #f59e0b, #d97706)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', marginBottom: '1.5rem'}}>
              📅
            </div>
            <h3 style={{fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', fontWeight: '700', color: '#f8fafc', marginBottom: '1rem'}}>Events Zone</h3>
            <p style={{color: '#94a3b8', marginBottom: '1.5rem', fontSize: 'clamp(0.85rem, 2vw, 0.95rem)', lineHeight: '1.5'}}>Host engaging presentations with polls, Q&A, and interactive participation.</p>
            <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
              <span style={{padding: '0.3rem 0.8rem', background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', borderRadius: '15px', fontSize: 'clamp(0.7rem, 1.8vw, 0.8rem)'}}>Polls</span>
              <span style={{padding: '0.3rem 0.8rem', background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', borderRadius: '15px', fontSize: 'clamp(0.7rem, 1.8vw, 0.8rem)'}}>Q&A</span>
            </div>
          </div>

          <div style={{background: 'rgba(139, 92, 246, 0.05)', border: '1px solid rgba(139, 92, 246, 0.2)', borderRadius: '20px', padding: 'clamp(1.5rem, 4vw, 2rem)', transition: 'transform 0.3s ease'}} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{width: 'clamp(50px, 12vw, 60px)', height: 'clamp(50px, 12vw, 60px)', background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', marginBottom: '1.5rem'}}>
              🎮
            </div>
            <h3 style={{fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', fontWeight: '700', color: '#f8fafc', marginBottom: '1rem'}}>Gaming Zone</h3>
            <p style={{color: '#94a3b8', marginBottom: '1.5rem', fontSize: 'clamp(0.85rem, 2vw, 0.95rem)', lineHeight: '1.5'}}>Connect through play with screen sharing and community gaming experiences.</p>
            <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
              <span style={{padding: '0.3rem 0.8rem', background: 'rgba(139, 92, 246, 0.2)', color: '#8b5cf6', borderRadius: '15px', fontSize: 'clamp(0.7rem, 1.8vw, 0.8rem)'}}>Screen Share</span>
              <span style={{padding: '0.3rem 0.8rem', background: 'rgba(139, 92, 246, 0.2)', color: '#8b5cf6', borderRadius: '15px', fontSize: 'clamp(0.7rem, 1.8vw, 0.8rem)'}}>Gaming</span>
            </div>
          </div>
        </div>

        {/* Live Demo Section */}
        <div style={{marginTop: 'clamp(3rem, 6vw, 4rem)', marginBottom: 'clamp(2rem, 4vw, 3rem)', display: 'flex', justifyContent: 'center'}}>
          <div style={{maxWidth: '500px', width: '100%'}}>
            <LiveDemo />
          </div>
        </div>

        <div style={{textAlign: 'center', marginTop: 'clamp(3rem, 6vw, 4rem)'}}>
          <button onClick={() => navigate('login')} style={{padding: 'clamp(1rem, 2.5vw, 1.25rem) clamp(2rem, 5vw, 3rem)', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', border: 'none', borderRadius: '16px', fontSize: 'clamp(1rem, 2.5vw, 1.1rem)', fontWeight: '600', cursor: 'pointer', boxShadow: '0 10px 30px rgba(99, 102, 241, 0.3)', width: window.innerWidth <= 480 ? '100%' : 'auto'}}>
            Explore All Zones
          </button>
        </div>
      </div>
    </section>
  );
};

export default ZonesPreview;
