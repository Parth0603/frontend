import React from 'react';

const Contact = ({ navigate }) => {
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
          <h1 style={{fontSize: '3rem', fontWeight: '800', marginBottom: '1rem', textAlign: 'center'}}>Get in Touch</h1>
          <p style={{fontSize: '1.2rem', color: '#94a3b8', textAlign: 'center', marginBottom: '4rem'}}>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
          
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem'}}>
            
            {/* Contact Form */}
            <div style={{backgroundColor: '#172136', border: '1px solid #334155', borderRadius: '20px', padding: '2rem'}}>
              <h2 style={{fontSize: '1.5rem', fontWeight: '700', marginBottom: '2rem'}}>Send us a message</h2>
              
              <form style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  aria-label="Your Name"
                  required
                  style={{padding: '1rem', backgroundColor: '#0b1120', border: '2px solid #334155', borderRadius: '8px', color: '#f8fafc', fontSize: '1rem', transition: 'border-color 0.3s ease'}}
                  onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                  onBlur={(e) => e.target.style.borderColor = '#334155'}
                />
                <input 
                  type="email" 
                  placeholder="Your Email" 
                  aria-label="Your Email"
                  required
                  style={{padding: '1rem', backgroundColor: '#0b1120', border: '2px solid #334155', borderRadius: '8px', color: '#f8fafc', fontSize: '1rem', transition: 'border-color 0.3s ease'}}
                  onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                  onBlur={(e) => e.target.style.borderColor = '#334155'}
                />
                <input 
                  type="text" 
                  placeholder="Subject" 
                  aria-label="Subject"
                  required
                  style={{padding: '1rem', backgroundColor: '#0b1120', border: '2px solid #334155', borderRadius: '8px', color: '#f8fafc', fontSize: '1rem', transition: 'border-color 0.3s ease'}}
                  onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                  onBlur={(e) => e.target.style.borderColor = '#334155'}
                />
                <textarea 
                  placeholder="Your Message" 
                  aria-label="Your Message"
                  required
                  rows="5"
                  style={{padding: '1rem', backgroundColor: '#0b1120', border: '2px solid #334155', borderRadius: '8px', color: '#f8fafc', fontSize: '1rem', resize: 'vertical', transition: 'border-color 0.3s ease'}}
                  onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                  onBlur={(e) => e.target.style.borderColor = '#334155'}
                ></textarea>
                <button 
                  type="submit" 
                  style={{padding: '1rem', backgroundColor: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', fontWeight: '600', transition: 'all 0.3s ease', boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)'}}
                  onMouseOver={(e) => {e.target.style.backgroundColor = '#5855eb'; e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 6px 20px rgba(99, 102, 241, 0.4)'}}
                  onMouseOut={(e) => {e.target.style.backgroundColor = '#6366f1'; e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 15px rgba(99, 102, 241, 0.3)'}}
                >
                  Send Message
                </button>
              </form>
            </div>
            
            {/* Contact Info */}
            <div>
              <h2 style={{fontSize: '1.5rem', fontWeight: '700', marginBottom: '2rem'}}>Contact Information</h2>
              
              <div style={{display: 'flex', flexDirection: 'column', gap: '2rem'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                  <div style={{width: '40px', height: '40px', backgroundColor: '#6366f1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    📧
                  </div>
                  <div>
                    <h3 style={{fontSize: '1rem', fontWeight: '600', marginBottom: '0.25rem'}}>Email</h3>
                    <p style={{color: '#94a3b8', margin: 0}}>hello@SYNTRA.com</p>
                  </div>
                </div>
                
                <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                  <div style={{width: '40px', height: '40px', backgroundColor: '#6366f1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    💬
                  </div>
                  <div>
                    <h3 style={{fontSize: '1rem', fontWeight: '600', marginBottom: '0.25rem'}}>Live Chat</h3>
                    <p style={{color: '#94a3b8', margin: 0}}>Available 24/7 in the app</p>
                  </div>
                </div>
                
                <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                  <div style={{width: '40px', height: '40px', backgroundColor: '#6366f1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    🌍
                  </div>
                  <div>
                    <h3 style={{fontSize: '1rem', fontWeight: '600', marginBottom: '0.25rem'}}>Global</h3>
                    <p style={{color: '#94a3b8', margin: 0}}>Serving teams worldwide</p>
                  </div>
                </div>
              </div>
              
              <div style={{marginTop: '3rem', padding: '2rem', backgroundColor: '#172136', borderRadius: '12px', border: '1px solid #334155'}}>
                <h3 style={{fontSize: '1.2rem', fontWeight: '600', marginBottom: '1rem'}}>Need immediate help?</h3>
                <p style={{color: '#94a3b8', marginBottom: '1rem'}}>Check out our help center for instant answers to common questions.</p>
                <button style={{padding: '0.75rem 1.5rem', backgroundColor: '#334155', color: '#f8fafc', border: 'none', borderRadius: '8px', cursor: 'pointer'}}>
                  Visit Help Center
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
