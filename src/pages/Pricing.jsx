import React from 'react';

const Pricing = ({ navigate }) => {
  return (
    <div style={{minHeight: '100vh', backgroundColor: '#0b1120', color: '#f8fafc'}}>
      <nav style={{position: 'fixed', top: 0, left: 0, right: 0, backgroundColor: 'rgba(11, 17, 32, 0.9)', backdropFilter: 'blur(10px)', borderBottom: '1px solid #334155', zIndex: 1000, padding: '1rem 0'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h2 style={{color: '#06b6d4', fontWeight: '700', cursor: 'pointer'}} onClick={() => navigate('landing')}>SYNTRA</h2>
          <button onClick={() => navigate('landing')} style={{background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer'}}>← Back to Home</button>
        </div>
      </nav>
      
      <div style={{paddingTop: '100px', padding: '100px 2rem 4rem'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto'}}>
          <h1 style={{fontSize: '3rem', fontWeight: '800', marginBottom: '1rem', textAlign: 'center'}}>Simple, Transparent Pricing</h1>
          <p style={{fontSize: '1.2rem', color: '#94a3b8', textAlign: 'center', marginBottom: '4rem'}}>Choose the plan that works best for your team</p>
          
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem'}}>
            
            {/* Free Plan */}
            <div style={{backgroundColor: '#172136', border: '1px solid #334155', borderRadius: '20px', padding: '2rem', textAlign: 'center'}}>
              <h3 style={{fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem'}}>Free</h3>
              <div style={{fontSize: '3rem', fontWeight: '800', color: '#6366f1', marginBottom: '1rem'}}>$0</div>
              <p style={{color: '#94a3b8', marginBottom: '2rem'}}>Perfect for small teams getting started</p>
              <ul style={{listStyle: 'none', padding: 0, marginBottom: '2rem'}}>
                <li style={{padding: '0.5rem 0', color: '#94a3b8'}}>✓ Up to 5 team members</li>
                <li style={{padding: '0.5rem 0', color: '#94a3b8'}}>✓ 3 collaboration zones</li>
                <li style={{padding: '0.5rem 0', color: '#94a3b8'}}>✓ Basic features</li>
                <li style={{padding: '0.5rem 0', color: '#94a3b8'}}>✓ Community support</li>
              </ul>
              <button onClick={() => navigate('login')} style={{width: '100%', padding: '1rem', backgroundColor: '#334155', color: '#f8fafc', border: 'none', borderRadius: '12px', cursor: 'pointer'}}>Get Started</button>
            </div>
            
            {/* Pro Plan */}
            <div style={{backgroundColor: '#172136', border: '2px solid #6366f1', borderRadius: '20px', padding: '2rem', textAlign: 'center', position: 'relative'}}>
              <div style={{position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#6366f1', color: 'white', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600'}}>POPULAR</div>
              <h3 style={{fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem'}}>Pro</h3>
              <div style={{fontSize: '3rem', fontWeight: '800', color: '#6366f1', marginBottom: '1rem'}}>$29</div>
              <p style={{color: '#94a3b8', marginBottom: '2rem'}}>For growing teams that need more</p>
              <ul style={{listStyle: 'none', padding: 0, marginBottom: '2rem'}}>
                <li style={{padding: '0.5rem 0', color: '#94a3b8'}}>✓ Up to 50 team members</li>
                <li style={{padding: '0.5rem 0', color: '#94a3b8'}}>✓ All collaboration zones</li>
                <li style={{padding: '0.5rem 0', color: '#94a3b8'}}>✓ Advanced features</li>
                <li style={{padding: '0.5rem 0', color: '#94a3b8'}}>✓ Priority support</li>
                <li style={{padding: '0.5rem 0', color: '#94a3b8'}}>✓ Analytics & insights</li>
              </ul>
              <button onClick={() => navigate('login')} style={{width: '100%', padding: '1rem', backgroundColor: '#6366f1', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer'}}>Start Free Trial</button>
            </div>
            
            {/* Enterprise Plan */}
            <div style={{backgroundColor: '#172136', border: '1px solid #334155', borderRadius: '20px', padding: '2rem', textAlign: 'center'}}>
              <h3 style={{fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem'}}>Enterprise</h3>
              <div style={{fontSize: '3rem', fontWeight: '800', color: '#6366f1', marginBottom: '1rem'}}>Custom</div>
              <p style={{color: '#94a3b8', marginBottom: '2rem'}}>For large organizations with custom needs</p>
              <ul style={{listStyle: 'none', padding: 0, marginBottom: '2rem'}}>
                <li style={{padding: '0.5rem 0', color: '#94a3b8'}}>✓ Unlimited team members</li>
                <li style={{padding: '0.5rem 0', color: '#94a3b8'}}>✓ Custom zones</li>
                <li style={{padding: '0.5rem 0', color: '#94a3b8'}}>✓ Enterprise security</li>
                <li style={{padding: '0.5rem 0', color: '#94a3b8'}}>✓ Dedicated support</li>
                <li style={{padding: '0.5rem 0', color: '#94a3b8'}}>✓ Custom integrations</li>
              </ul>
              <button style={{width: '100%', padding: '1rem', backgroundColor: '#334155', color: '#f8fafc', border: 'none', borderRadius: '12px', cursor: 'pointer'}}>Contact Sales</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
