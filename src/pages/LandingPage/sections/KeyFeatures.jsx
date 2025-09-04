import React from 'react';

const KeyFeatures = () => {
  return (
    <section id="features" style={{backgroundColor: '#0b1120', padding: 'clamp(60px, 10vw, 120px) 0', position: 'relative'}}>
      <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 1rem'}}>
        <div style={{textAlign: 'center', marginBottom: 'clamp(3rem, 8vw, 5rem)'}}>
          <h2 style={{fontSize: 'clamp(2rem, 6vw, 3rem)', fontWeight: '800', color: '#f8fafc', marginBottom: '1rem', lineHeight: '1.2'}}>Cutting-Edge Technology</h2>
          <p style={{fontSize: 'clamp(1rem, 3vw, 1.3rem)', color: '#94a3b8', maxWidth: '600px', margin: '0 auto'}}>Advanced features that make collaboration seamless and engaging</p>
        </div>

        {/* Main Feature Showcase - Mobile Responsive */}
        <div style={{display: 'grid', gridTemplateColumns: window.innerWidth > 768 ? '1fr 1fr' : '1fr', gap: 'clamp(2rem, 6vw, 4rem)', alignItems: 'center', marginBottom: 'clamp(3rem, 8vw, 5rem)'}}>
          <div>
            <div style={{display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '20px', padding: '0.5rem 1rem', marginBottom: '2rem'}}>
              <span style={{fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', color: '#6366f1', fontWeight: '600'}}>⚡ REAL-TIME COLLABORATION</span>
            </div>
            
            <h3 style={{fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: '800', color: '#f8fafc', marginBottom: '1.5rem', lineHeight: '1.2'}}>Zero-Latency Interactions</h3>
            <p style={{fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', color: '#94a3b8', marginBottom: '2rem', lineHeight: '1.6'}}>Experience seamless collaboration with WebRTC technology. See, hear, and work together as if you're in the same room.</p>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                <div style={{width: 'clamp(20px, 5vw, 24px)', height: 'clamp(20px, 5vw, 24px)', background: 'linear-gradient(135deg, #10b981, #059669)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)', flexShrink: 0}}>✓</div>
                <span style={{color: '#94a3b8', fontSize: 'clamp(0.9rem, 2vw, 1rem)'}}>Zero-latency WebRTC connections</span>
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                <div style={{width: 'clamp(20px, 5vw, 24px)', height: 'clamp(20px, 5vw, 24px)', background: 'linear-gradient(135deg, #10b981, #059669)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)', flexShrink: 0}}>✓</div>
                <span style={{color: '#94a3b8', fontSize: 'clamp(0.9rem, 2vw, 1rem)'}}>Real-time document collaboration</span>
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                <div style={{width: 'clamp(20px, 5vw, 24px)', height: 'clamp(20px, 5vw, 24px)', background: 'linear-gradient(135deg, #10b981, #059669)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)', flexShrink: 0}}>✓</div>
                <span style={{color: '#94a3b8', fontSize: 'clamp(0.9rem, 2vw, 1rem)'}}>HD video and crystal-clear audio</span>
              </div>
            </div>
          </div>
          
          <div style={{position: 'relative', display: window.innerWidth <= 768 ? 'none' : 'block'}}>
            <div style={{background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(6, 182, 212, 0.1))', borderRadius: '24px', padding: '2rem', border: '1px solid rgba(99, 102, 241, 0.2)', position: 'relative', overflow: 'hidden'}}>
              {/* Animated elements */}
              <div style={{display: 'flex', gap: '1rem', marginBottom: '2rem'}}>
                <div style={{width: '50px', height: '50px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '50%'}}></div>
                <div style={{width: '50px', height: '50px', background: 'linear-gradient(135deg, #06b6d4, #6366f1)', borderRadius: '50%'}}></div>
                <div style={{width: '50px', height: '50px', background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', borderRadius: '50%'}}></div>
              </div>
              
              <div style={{height: '120px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(6, 182, 212, 0.05))', borderRadius: '16px', border: '1px solid rgba(99, 102, 241, 0.1)', position: 'relative'}}>
                <div style={{position: 'absolute', top: '1rem', left: '1rem', right: '1rem', height: '8px', background: 'linear-gradient(90deg, #6366f1, #06b6d4)', borderRadius: '4px'}}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Grid - Mobile Responsive */}
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: 'clamp(1.5rem, 4vw, 2rem)'}}>
          <div style={{background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(139, 92, 246, 0.05))', border: '1px solid rgba(99, 102, 241, 0.1)', borderRadius: '20px', padding: 'clamp(2rem, 5vw, 2.5rem)', textAlign: 'center', transition: 'transform 0.3s ease'}} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-10px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{width: 'clamp(60px, 15vw, 80px)', height: 'clamp(60px, 15vw, 80px)', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'clamp(1.5rem, 4vw, 2rem)', margin: '0 auto 2rem', boxShadow: '0 10px 30px rgba(99, 102, 241, 0.3)'}}>
              👥
            </div>
            <h3 style={{fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', fontWeight: '700', color: '#f8fafc', marginBottom: '1rem'}}>Unified Access</h3>
            <p style={{color: '#94a3b8', lineHeight: '1.6', fontSize: 'clamp(0.9rem, 2vw, 1rem)'}}>One login gives you access to all zones. Move seamlessly between different collaboration environments.</p>
          </div>

          <div style={{background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.05), rgba(99, 102, 241, 0.05))', border: '1px solid rgba(6, 182, 212, 0.1)', borderRadius: '20px', padding: 'clamp(2rem, 5vw, 2.5rem)', textAlign: 'center', transition: 'transform 0.3s ease'}} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-10px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{width: 'clamp(60px, 15vw, 80px)', height: 'clamp(60px, 15vw, 80px)', background: 'linear-gradient(135deg, #06b6d4, #6366f1)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'clamp(1.5rem, 4vw, 2rem)', margin: '0 auto 2rem', boxShadow: '0 10px 30px rgba(6, 182, 212, 0.3)'}}>
              🎨
            </div>
            <h3 style={{fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', fontWeight: '700', color: '#f8fafc', marginBottom: '1rem'}}>Customizable</h3>
            <p style={{color: '#94a3b8', lineHeight: '1.6', fontSize: 'clamp(0.9rem, 2vw, 1rem)'}}>Design your perfect collaboration environment with custom layouts, themes, and interactive elements.</p>
          </div>

          <div style={{background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(6, 182, 212, 0.05))', border: '1px solid rgba(139, 92, 246, 0.1)', borderRadius: '20px', padding: 'clamp(2rem, 5vw, 2.5rem)', textAlign: 'center', transition: 'transform 0.3s ease'}} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-10px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{width: 'clamp(60px, 15vw, 80px)', height: 'clamp(60px, 15vw, 80px)', background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'clamp(1.5rem, 4vw, 2rem)', margin: '0 auto 2rem', boxShadow: '0 10px 30px rgba(139, 92, 246, 0.3)'}}>
              📊
            </div>
            <h3 style={{fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', fontWeight: '700', color: '#f8fafc', marginBottom: '1rem'}}>Analytics</h3>
            <p style={{color: '#94a3b8', lineHeight: '1.6', fontSize: 'clamp(0.9rem, 2vw, 1rem)'}}>Track engagement, measure productivity, and gain insights into your team's collaboration patterns.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default KeyFeatures;
