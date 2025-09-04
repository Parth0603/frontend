import React, { useEffect } from 'react';

function AuthSuccess({ navigate, onLogin }) {
  useEffect(() => {
    console.log('AuthSuccess - Full URL:', window.location.href);
    console.log('AuthSuccess - Search params:', window.location.search);
    
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const name = urlParams.get('name');
    const email = urlParams.get('email');
    const id = urlParams.get('id');

    console.log('AuthSuccess params:', { 
      token: token ? 'EXISTS' : 'MISSING', 
      name: name || 'MISSING', 
      email: email || 'MISSING', 
      id: id || 'MISSING' 
    });

    if (token && name) {
      const userId = id || (Date.now().toString() + Math.random().toString(36).substr(2, 9));
      
      // Use sessionStorage for tab-specific data
      sessionStorage.setItem('userToken', token);
      sessionStorage.setItem('userName', decodeURIComponent(name));
      sessionStorage.setItem('userEmail', decodeURIComponent(email || ''));
      sessionStorage.setItem('userId', userId);
      
      // Also keep in localStorage as backup
      localStorage.setItem('userToken', token);
      localStorage.setItem('userName', decodeURIComponent(name));
      localStorage.setItem('userEmail', decodeURIComponent(email || ''));
      localStorage.setItem('userId', userId);
      
      const userData = { 
        id: userId, 
        name: decodeURIComponent(name), 
        email: decodeURIComponent(email || '') 
      };
      
      console.log('Stored user data, calling onLogin with:', userData);
      
      // Call onLogin and force navigation
      onLogin(userData);
      
      // Force navigation as backup
      setTimeout(() => {
        console.log('Force navigating to dashboard');
        window.location.href = '/dashboard';
      }, 1000);
    } else {
      console.log('Missing required params - token:', !!token, 'name:', !!name);
      setTimeout(() => navigate('login'), 2000);
    }
  }, [navigate, onLogin]);

  return (
    <div style={{minHeight: '100vh', backgroundColor: '#0b1120', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem'}}>
      <div style={{color: '#f8fafc', fontSize: '1.2rem'}}>
        Processing Google login...
      </div>
      <div style={{color: '#64748b', fontSize: '0.9rem', textAlign: 'center', maxWidth: '400px'}}>
        URL: {window.location.href}
      </div>
      <div style={{color: '#64748b', fontSize: '0.8rem'}}>
        Check console for details
      </div>
    </div>
  );
}

export default AuthSuccess;