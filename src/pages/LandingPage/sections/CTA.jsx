import React from 'react';

const CTA = ({ navigate }) => {
  return (
    <section style={{backgroundColor: '#0b1120', padding: '120px 0', minHeight: '400px', textAlign: 'center'}}>
      <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 2rem'}}>
        <h2 style={{fontSize: '2.8rem', fontWeight: '800', color: '#f8fafc', marginBottom: '1rem'}}>Ready to Transform Your Collaboration?</h2>
        <p style={{fontSize: '1.2rem', color: '#94a3b8', marginBottom: '3rem'}}>Join thousands of teams already using SYNTRA to work better together.</p>
        <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap'}}>
          <button 
            style={{padding: '1rem 2rem', backgroundColor: '#6366f1', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1.1rem', cursor: 'pointer'}}
            onClick={() => navigate('login')}
          >
            Start Free Trial
          </button>
          <button 
            style={{padding: '1rem 2rem', backgroundColor: '#172136', color: '#f8fafc', border: '1px solid #334155', borderRadius: '12px', fontSize: '1.1rem', cursor: 'pointer'}}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTA;
