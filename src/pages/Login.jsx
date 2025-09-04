import React, { useState } from 'react';
import { authAPI } from '../services/api.js';
import '../styles/login-animations.css';

function Login({ navigate, onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Check for OAuth error in URL
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const oauthError = urlParams.get('error');
    if (oauthError === 'oauth_failed') {
      setError('Google authentication failed. Please try again.');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = isLogin 
        ? await authAPI.login({ email: formData.email, password: formData.password })
        : await authAPI.register(formData);
      
      const { token, name, email } = response.data;
      const userId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('userToken', token);
      localStorage.setItem('userName', name);
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userId', userId);
      
      onLogin({ id: userId, name, email });
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div style={{minHeight: '100vh', backgroundColor: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative', overflow: 'hidden'}}>
      {/* Animated Background */}
      <div style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(6, 182, 212, 0.15) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)', pointerEvents: 'none'}}></div>
      
      {/* Floating Orbs */}
      <div style={{position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%)', top: '10%', left: '-10%', filter: 'blur(40px)', animation: 'float 6s ease-in-out infinite', pointerEvents: 'none'}}></div>
      <div style={{position: 'absolute', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%)', top: '60%', right: '-5%', filter: 'blur(40px)', animation: 'float 6s ease-in-out infinite 2s', pointerEvents: 'none'}}></div>
      
      {/* Grid Pattern */}
      <div style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: 'linear-gradient(rgba(99, 102, 241, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.05) 1px, transparent 1px)', backgroundSize: '50px 50px', animation: 'gridMove 20s linear infinite', pointerEvents: 'none'}}></div>
      
      <button 
        onClick={() => navigate('landing')} 
        style={{position: 'absolute', top: '2rem', left: '2rem', background: 'rgba(30, 41, 59, 0.8)', backdropFilter: 'blur(20px)', border: '1px solid rgba(148, 163, 184, 0.2)', color: 'var(--text-secondary)', padding: '0.75rem 1.5rem', borderRadius: '50px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.3s ease', fontSize: '0.9rem', zIndex: 10}}
        onMouseOver={(e) => {e.target.style.backgroundColor = 'rgba(51, 65, 85, 0.9)'; e.target.style.color = 'var(--text-primary)'; e.target.style.transform = 'translateY(-2px) scale(1.05)';}}
        onMouseOut={(e) => {e.target.style.backgroundColor = 'rgba(30, 41, 59, 0.8)'; e.target.style.color = 'var(--text-secondary)'; e.target.style.transform = 'translateY(0) scale(1)';}}
      >
        ← Back to Home
      </button>
      
      <div style={{backgroundColor: 'rgba(30, 41, 59, 0.95)', backdropFilter: 'blur(30px)', borderRadius: '24px', padding: '2rem', maxWidth: '400px', width: '100%', border: '1px solid rgba(148, 163, 184, 0.15)', boxShadow: '0 32px 64px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)', position: 'relative', overflow: 'hidden'}}>
        <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.8), transparent)'}}></div>
        
        <div style={{textAlign: 'center', marginBottom: '1.5rem'}}>
          <div style={{width: '60px', height: '60px', background: 'rgba(255, 255, 255, 0.95)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', boxShadow: '0 20px 40px rgba(99, 102, 241, 0.3)', animation: 'glow 3s ease-in-out infinite', position: 'relative', overflow: 'hidden'}}>
            <img src="/src/assets/logo.png" alt="SYNTRA" style={{width: '95%', height: '95%', objectFit: 'cover'}} />
            <div style={{position: 'absolute', inset: '-2px', background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color), var(--accent-color))', borderRadius: '20px', zIndex: -1, filter: 'blur(8px)', opacity: 0.7}}></div>
          </div>
          <h2 style={{fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.5rem', letterSpacing: '-0.025em'}}>Welcome to <span style={{background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color), var(--accent-color))', backgroundSize: '200% 200%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: 'gradientShift 4s ease-in-out infinite'}}>SYNTRA</span></h2>
          <p style={{color: 'var(--text-secondary)', fontSize: '0.9rem'}}>Step into the future of collaboration</p>
        </div>

        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              style={{width: '100%', padding: '0.875rem', backgroundColor: 'rgba(15, 23, 42, 0.8)', border: '2px solid rgba(148, 163, 184, 0.15)', borderRadius: '12px', color: 'var(--text-primary)', fontSize: '0.95rem', transition: 'all 0.3s ease', outline: 'none', backdropFilter: 'blur(10px)'}}
              onFocus={(e) => {e.target.style.borderColor = 'var(--primary-color)'; e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';}}
              onBlur={(e) => {e.target.style.borderColor = 'rgba(148, 163, 184, 0.15)'; e.target.style.boxShadow = 'none';}}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            style={{width: '100%', padding: '0.875rem', backgroundColor: 'rgba(15, 23, 42, 0.8)', border: '2px solid rgba(148, 163, 184, 0.15)', borderRadius: '12px', color: 'var(--text-primary)', fontSize: '0.95rem', transition: 'all 0.3s ease', outline: 'none', backdropFilter: 'blur(10px)'}}
            onFocus={(e) => {e.target.style.borderColor = 'var(--primary-color)'; e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';}}
            onBlur={(e) => {e.target.style.borderColor = 'rgba(148, 163, 184, 0.15)'; e.target.style.boxShadow = 'none';}}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            style={{width: '100%', padding: '0.875rem', backgroundColor: 'rgba(15, 23, 42, 0.8)', border: '2px solid rgba(148, 163, 184, 0.15)', borderRadius: '12px', color: 'var(--text-primary)', fontSize: '0.95rem', transition: 'all 0.3s ease', outline: 'none', backdropFilter: 'blur(10px)'}}
            onFocus={(e) => {e.target.style.borderColor = 'var(--primary-color)'; e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';}}
            onBlur={(e) => {e.target.style.borderColor = 'rgba(148, 163, 184, 0.15)'; e.target.style.boxShadow = 'none';}}
            required
          />
          
          {error && <div style={{color: '#ef4444', fontSize: '0.9rem', textAlign: 'center'}}>{error}</div>}
          
          <button 
            type="submit" 
            disabled={loading}
            style={{width: '100%', padding: '0.875rem', background: loading ? 'var(--primary-color)' : 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))', border: 'none', borderRadius: '12px', color: 'white', fontSize: '1rem', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.3s ease', boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)', marginTop: '0.5rem'}}
            onMouseOver={(e) => !loading && (e.target.style.transform = 'translateY(-2px)', e.target.style.boxShadow = '0 8px 32px rgba(99, 102, 241, 0.6)')}
            onMouseOut={(e) => !loading && (e.target.style.transform = 'translateY(0)', e.target.style.boxShadow = '0 4px 20px rgba(99, 102, 241, 0.4)')}
          >
            {loading ? 'Please wait...' : `${isLogin ? 'Enter SYNTRA' : 'Join SYNTRA'}`}
          </button>
          
          <div style={{display: 'flex', alignItems: 'center', margin: '1rem 0'}}>
            <div style={{flex: 1, height: '1px', background: 'rgba(148, 163, 184, 0.2)'}}></div>
            <span style={{color: 'var(--text-secondary)', margin: '0 1rem', fontSize: '0.8rem'}}>or</span>
            <div style={{flex: 1, height: '1px', background: 'rgba(148, 163, 184, 0.2)'}}></div>
          </div>
          
          <button 
            type="button"
            onClick={() => {
              console.log('Google OAuth button clicked');
              const backendUrl = 'https://backendserver-imeb.onrender.com';
              const googleAuthUrl = `${backendUrl}/api/auth/google`;
              console.log('Redirecting to:', googleAuthUrl);
              window.location.href = googleAuthUrl;
            }}
            style={{width: '100%', padding: '0.875rem', background: 'rgba(255, 255, 255, 0.95)', border: '1px solid rgba(148, 163, 184, 0.2)', borderRadius: '12px', color: '#1f2937', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: '500', fontSize: '0.95rem', transition: 'all 0.3s ease'}}
            onMouseOver={(e) => (e.target.style.transform = 'translateY(-1px)', e.target.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)')}
            onMouseOut={(e) => (e.target.style.transform = 'translateY(0)', e.target.style.boxShadow = 'none')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Continue with Google</span>
          </button>
          
          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            style={{background: 'none', border: 'none', color: 'var(--accent-color)', cursor: 'pointer', fontSize: '0.9rem', padding: '0.5rem', transition: 'all 0.3s ease', fontWeight: '400', marginTop: '0.5rem', width: '100%'}}
            onMouseOver={(e) => (e.target.style.color = 'var(--primary-color)')}
            onMouseOut={(e) => (e.target.style.color = 'var(--accent-color)')}
          >
            {isLogin ? 'New to SYNTRA? Create account' : 'Already have an account? Sign in'}
          </button>
          

        </form>
      </div>
    </div>
  );
}

export default Login;
