import React from 'react';

const Stats = () => {
  return (
    <section style={{backgroundColor: '#0b1120', padding: 'clamp(60px, 10vw, 100px) 0', position: 'relative', overflow: 'hidden'}}>
      {/* Floating background elements */}
      <div style={{position: 'absolute', top: '20%', left: '5%', width: 'clamp(100px, 20vw, 200px)', height: 'clamp(100px, 20vw, 200px)', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(40px)'}}></div>
      <div style={{position: 'absolute', bottom: '20%', right: '5%', width: 'clamp(80px, 15vw, 150px)', height: 'clamp(80px, 15vw, 150px)', background: 'radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(30px)'}}></div>
      
      <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', position: 'relative'}}>
        <div style={{textAlign: 'center', marginBottom: 'clamp(2rem, 5vw, 4rem)'}}>
          <h2 style={{fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: '800', color: '#f8fafc', marginBottom: '1rem', lineHeight: '1.2'}}>Trusted by Teams Worldwide</h2>
          <p style={{fontSize: 'clamp(1rem, 2.5vw, 1.1rem)', color: '#94a3b8'}}>Real results from real teams using SYNTRA</p>
        </div>
        
        <div style={{display: 'grid', gridTemplateColumns: window.innerWidth <= 768 ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(min(250px, 100%), 1fr))', gap: 'clamp(1rem, 3vw, 2rem)'}}>
          <div style={{background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: '20px', padding: 'clamp(1.5rem, 4vw, 2rem)', textAlign: 'center', backdropFilter: 'blur(10px)', transform: 'translateY(-10px)', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'}}>
            <div style={{fontSize: 'clamp(2.5rem, 8vw, 3.5rem)', fontWeight: '900', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem'}}>99.9%</div>
            <p style={{fontSize: 'clamp(0.9rem, 2vw, 1rem)', color: '#94a3b8', fontWeight: '500'}}>Uptime across collaboration sessions</p>
          </div>
          
          <div style={{background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(99, 102, 241, 0.05) 100%)', border: '1px solid rgba(6, 182, 212, 0.2)', borderRadius: '20px', padding: 'clamp(1.5rem, 4vw, 2rem)', textAlign: 'center', backdropFilter: 'blur(10px)', transform: 'translateY(10px)', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'}}>
            <div style={{fontSize: 'clamp(2.5rem, 8vw, 3.5rem)', fontWeight: '900', background: 'linear-gradient(135deg, #06b6d4, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem'}}>50%+</div>
            <p style={{fontSize: 'clamp(0.9rem, 2vw, 1rem)', color: '#94a3b8', fontWeight: '500'}}>Higher engagement in interactive zones</p>
          </div>
          
          <div style={{background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%)', border: '1px solid rgba(139, 92, 246, 0.2)', borderRadius: '20px', padding: 'clamp(1.5rem, 4vw, 2rem)', textAlign: 'center', backdropFilter: 'blur(10px)', transform: 'translateY(-5px)', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)', display: window.innerWidth <= 768 ? 'none' : 'block'}}>
            <div style={{fontSize: 'clamp(2.5rem, 8vw, 3.5rem)', fontWeight: '900', background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem'}}>10 min</div>
            <p style={{fontSize: 'clamp(0.9rem, 2vw, 1rem)', color: '#94a3b8', fontWeight: '500'}}>Setup to first collaboration</p>
          </div>
          
          <div style={{background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: '20px', padding: 'clamp(1.5rem, 4vw, 2rem)', textAlign: 'center', backdropFilter: 'blur(10px)', transform: 'translateY(15px)', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)', display: window.innerWidth <= 768 ? 'none' : 'block'}}>
            <div style={{fontSize: 'clamp(2.5rem, 8vw, 3.5rem)', fontWeight: '900', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem'}}>5+</div>
            <p style={{fontSize: 'clamp(0.9rem, 2vw, 1rem)', color: '#94a3b8', fontWeight: '500'}}>Purpose-built collaboration zones</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
