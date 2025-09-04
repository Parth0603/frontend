import React, { useState, useEffect } from "react";
import { authAPI } from "./services/api.js";

import LandingPage from "./pages/LandingPage/LandingPage.jsx";


import MagneticElements from "./components/MagneticElements.jsx";
import LoadingScreen from "./components/LoadingScreen.jsx";
import FeedbackWidget from "./components/FeedbackWidget.jsx"; 

import Login from "./pages/Login.jsx";
import AuthSuccess from "./pages/AuthSuccess.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import About from "./pages/About.jsx";
import Pricing from "./pages/Pricing.jsx";
import Contact from "./pages/Contact.jsx";
import TeachingZone from "./pages/TeachingZone.jsx";
import StudentView from "./pages/StudentView.jsx";
import GamingZone from "./pages/GamingZone.jsx";
import EventsZone from "./pages/EventsZone.jsx";
import ChillZone from "./pages/ChillZone.jsx";
import WorkspaceZone from "./pages/WorkspaceZone.jsx";

// This component acts as the main router for your application.
function App() {
  const [page, setPage] = useState("landing");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Checks for a logged-in user when the app first loads.
  useEffect(() => {
    const checkAuth = async () => {
      // Check for Google OAuth callback
      const currentPath = window.location.pathname;
      console.log('Current path:', currentPath);
      if (currentPath === '/auth/success') {
        console.log('Setting page to auth-success');
        setPage('auth-success');
        return;
      }
      
      const token = sessionStorage.getItem("userToken") || localStorage.getItem("userToken");
      const userName = sessionStorage.getItem("userName") || localStorage.getItem("userName");
      const userEmail = sessionStorage.getItem("userEmail") || localStorage.getItem("userEmail");
      const userId = sessionStorage.getItem("userId") || localStorage.getItem("userId");
      
      if (token && userName) {
        setUser({ id: userId || Date.now().toString(), name: userName, email: userEmail });
        
        // Set page based on current URL
        const path = window.location.pathname;
        const pageMap = {
          '/': 'landing',
          '/dashboard': 'dashboard',
          '/teaching': 'teaching',
          '/student': 'student',
          '/gaming': 'gaming',
          '/events': 'events',
          '/chill': 'chill',
          '/workspace': 'workspace',
          '/about': 'about',
          '/pricing': 'pricing',
          '/contact': 'contact',
          '/login': 'login',
          '/auth/success': 'auth-success'
        };
        
        setPage(pageMap[path] || 'dashboard');
      }
    };
    checkAuth();
    
    // Handle browser back/forward buttons
    const handlePopState = () => {
      const path = window.location.pathname;
      const pageMap = {
        '/': 'landing',
        '/dashboard': 'dashboard',
        '/teaching': 'teaching',
        '/student': 'student',
        '/gaming': 'gaming',
        '/events': 'events',
        '/chill': 'chill',
        '/workspace': 'workspace',
        '/about': 'about',
        '/pricing': 'pricing',
        '/contact': 'contact',
        '/login': 'login',
        '/auth/success': 'auth-success'
      };
      
      setPage(pageMap[path] || 'landing');
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleLoadingComplete = () => {
    setLoading(false);
  };

  // Function to navigate between different pages.
  const navigate = (targetPage) => {
    console.log('Navigating to:', targetPage);
    setPage(targetPage);
    window.scrollTo(0, 0);
    
    // Update URL for all pages
    const urlMap = {
      'landing': '/',
      'dashboard': '/dashboard',
      'teaching': '/teaching',
      'student': '/student',
      'gaming': '/gaming',
      'events': '/events',
      'chill': '/chill',
      'workspace': '/workspace',
      'about': '/about',
      'pricing': '/pricing',
      'contact': '/contact',
      'login': '/login'
    };
    
    const url = urlMap[targetPage] || '/';
    window.history.pushState({}, '', url);
  };

  // Functions to handle user login and logout.
  const handleLogin = (userData) => {
    console.log('handleLogin called with:', userData);
    setUser(userData);
    console.log('User state set, navigating to dashboard');
    navigate("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userId");
    setUser(null);
    navigate("landing");
  };

  // Renders the correct page based on the current state.
  const renderPage = () => {
    console.log('Current page state:', page);
    console.log('Current URL:', window.location.pathname);
    console.log('User:', user);
    
    switch (page) {
      case "login":
        return <Login navigate={navigate} onLogin={handleLogin} />;
      case "auth-success":
        return <AuthSuccess navigate={navigate} onLogin={handleLogin} />;
      case "dashboard":
        return <Dashboard navigate={navigate} user={user} onLogout={handleLogout} />;
      case "teaching":
        return <TeachingZone navigate={navigate} user={user} />;
      case "student":
        return <StudentView navigate={navigate} user={user} />;
      case "gaming":
        return <GamingZone navigate={navigate} user={user} />;
      case "events":
        return <EventsZone navigate={navigate} />;
      case "chill":
        return <ChillZone navigate={navigate} />;
      case "workspace":
        return <WorkspaceZone navigate={navigate} />;
      case "about":
        return <About navigate={navigate} />;
      case "pricing":
        return <Pricing navigate={navigate} />;
      case "contact":
        return <Contact navigate={navigate} />;
      case "landing":
      default:
        return <LandingPage navigate={navigate} />;
    }
  };

  if (loading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
    <>
      <MagneticElements />
      {renderPage()}
      <FeedbackWidget />
    </>
  );
}

export default App;
