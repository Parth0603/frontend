import React from 'react';
const Footer = ({ navigate }) => {
  return (
    <footer style={{backgroundColor: '#0b1120', borderTop: '1px solid #334155', padding: '3rem 0 1.5rem'}}>
      <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 2rem'}}>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '2rem'}}>
          
          {/* Brand Section */}
          <div>
            <h3 style={{color: '#06b6d4', fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem'}}>Syntra</h3>
            <p style={{color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1rem'}}>Transforming online collaboration with interactive zones designed for modern teams.</p>
          </div>

          {/* Product Links */}
          <div>
            <h4 style={{color: '#f8fafc', fontSize: '1rem', fontWeight: '600', marginBottom: '1rem'}}>Product</h4>
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
              <button onClick={() => document.getElementById('zones')?.scrollIntoView({behavior: 'smooth'})} style={{background: 'none', border: 'none', color: '#94a3b8', fontSize: '0.9rem', cursor: 'pointer', textAlign: 'left', padding: '0'}} onMouseOver={(e) => e.target.style.color = '#06b6d4'} onMouseOut={(e) => e.target.style.color = '#94a3b8'}>Zones</button>
              <button onClick={() => document.getElementById('features')?.scrollIntoView({behavior: 'smooth'})} style={{background: 'none', border: 'none', color: '#94a3b8', fontSize: '0.9rem', cursor: 'pointer', textAlign: 'left', padding: '0'}} onMouseOver={(e) => e.target.style.color = '#06b6d4'} onMouseOut={(e) => e.target.style.color = '#94a3b8'}>Features</button>
              <button onClick={() => navigate('pricing')} style={{background: 'none', border: 'none', color: '#94a3b8', fontSize: '0.9rem', cursor: 'pointer', textAlign: 'left', padding: '0'}} onMouseOver={(e) => e.target.style.color = '#06b6d4'} onMouseOut={(e) => e.target.style.color = '#94a3b8'}>Pricing</button>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 style={{color: '#f8fafc', fontSize: '1rem', fontWeight: '600', marginBottom: '1rem'}}>Company</h4>
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
              <button onClick={() => navigate('about')} style={{background: 'none', border: 'none', color: '#94a3b8', fontSize: '0.9rem', cursor: 'pointer', textAlign: 'left', padding: '0'}} onMouseOver={(e) => e.target.style.color = '#06b6d4'} onMouseOut={(e) => e.target.style.color = '#94a3b8'}>About</button>
              <a href="#" style={{color: '#94a3b8', fontSize: '0.9rem', textDecoration: 'none'}} onMouseOver={(e) => e.target.style.color = '#06b6d4'} onMouseOut={(e) => e.target.style.color = '#94a3b8'}>Blog</a>
              <a href="#" style={{color: '#94a3b8', fontSize: '0.9rem', textDecoration: 'none'}} onMouseOver={(e) => e.target.style.color = '#06b6d4'} onMouseOut={(e) => e.target.style.color = '#94a3b8'}>Careers</a>
              <button onClick={() => navigate('contact')} style={{background: 'none', border: 'none', color: '#94a3b8', fontSize: '0.9rem', cursor: 'pointer', textAlign: 'left', padding: '0'}} onMouseOver={(e) => e.target.style.color = '#06b6d4'} onMouseOut={(e) => e.target.style.color = '#94a3b8'}>Contact</button>
            </div>
          </div>

          {/* Support Links */}
          <div>
            <h4 style={{color: '#f8fafc', fontSize: '1rem', fontWeight: '600', marginBottom: '1rem'}}>Support</h4>
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
              <a href="#" style={{color: '#94a3b8', fontSize: '0.9rem', textDecoration: 'none'}} onMouseOver={(e) => e.target.style.color = '#06b6d4'} onMouseOut={(e) => e.target.style.color = '#94a3b8'}>Help Center</a>
              <a href="#" style={{color: '#94a3b8', fontSize: '0.9rem', textDecoration: 'none'}} onMouseOver={(e) => e.target.style.color = '#06b6d4'} onMouseOut={(e) => e.target.style.color = '#94a3b8'}>Documentation</a>
              <a href="#" style={{color: '#94a3b8', fontSize: '0.9rem', textDecoration: 'none'}} onMouseOver={(e) => e.target.style.color = '#06b6d4'} onMouseOut={(e) => e.target.style.color = '#94a3b8'}>Privacy Policy</a>
              <a href="#" style={{color: '#94a3b8', fontSize: '0.9rem', textDecoration: 'none'}} onMouseOver={(e) => e.target.style.color = '#06b6d4'} onMouseOut={(e) => e.target.style.color = '#94a3b8'}>Terms of Service</a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div style={{borderTop: '1px solid #334155', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem'}}>
          <p style={{color: '#94a3b8', margin: '0', fontSize: '0.9rem'}}>&copy; 2025 Syntra. All rights reserved.</p>
          
          <div style={{display: 'flex', gap: '1rem'}}>
            <a href="#" style={{width: '36px', height: '36px', backgroundColor: '#172136', border: '1px solid #334155', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', textDecoration: 'none', fontSize: '0.8rem', transition: 'all 0.3s ease'}} onMouseOver={(e) => {e.target.style.backgroundColor = '#6366f1'; e.target.style.color = 'white';}} onMouseOut={(e) => {e.target.style.backgroundColor = '#172136'; e.target.style.color = '#94a3b8';}}>
              𝕏
            </a>
            <a href="#" style={{width: '36px', height: '36px', backgroundColor: '#172136', border: '1px solid #334155', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', textDecoration: 'none', fontSize: '0.8rem', transition: 'all 0.3s ease'}} onMouseOver={(e) => {e.target.style.backgroundColor = '#6366f1'; e.target.style.color = 'white';}} onMouseOut={(e) => {e.target.style.backgroundColor = '#172136'; e.target.style.color = '#94a3b8';}}>
              in
            </a>
            <a href="#" style={{width: '36px', height: '36px', backgroundColor: '#172136', border: '1px solid #334155', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', textDecoration: 'none', fontSize: '0.8rem', transition: 'all 0.3s ease'}} onMouseOver={(e) => {e.target.style.backgroundColor = '#6366f1'; e.target.style.color = 'white';}} onMouseOut={(e) => {e.target.style.backgroundColor = '#172136'; e.target.style.color = '#94a3b8';}}>
              GH
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
