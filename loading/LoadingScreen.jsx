import React, { useEffect } from 'react';
import '../styles/loading.css';

const LoadingScreen = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3800); // Animation completes in 4 seconds
    
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="loading-screen">
      <div className="loading-content">
        <svg className="logo-svg" viewBox="0 0 350 100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
          
          <path d="M20 80 Q30 70 40 70 Q50 70 50 60 Q50 50 40 50 Q30 50 30 40 Q30 30 40 30 Q50 30 60 20" 
                stroke="url(#gradient)" strokeWidth="4" fill="none" className="letter">
            <animate attributeName="stroke-dasharray" values="0 200;200 0" dur="0.5s" begin="0s" fill="freeze" />
          </path>
          
          <path d="M80 20 L100 50 L120 20 M100 50 L100 80" 
                stroke="url(#gradient)" strokeWidth="4" fill="none" className="letter">
            <animate attributeName="stroke-dasharray" values="0 200;200 0" dur="0.5s" begin="0.5s" fill="freeze" />
          </path>
          
          <path d="M140 20 L140 80 M140 20 L180 80 M180 20 L180 80" 
                stroke="url(#gradient)" strokeWidth="4" fill="none" className="letter">
            <animate attributeName="stroke-dasharray" values="0 200;200 0" dur="0.5s" begin="1s" fill="freeze" />
          </path>
          
          <path d="M200 20 L240 20 M220 20 L220 80" 
                stroke="url(#gradient)" strokeWidth="4" fill="none" className="letter">
            <animate attributeName="stroke-dasharray" values="0 200;200 0" dur="0.5s" begin="1.5s" fill="freeze" />
          </path>
          
          <path d="M260 20 L260 80 M260 20 L280 20 Q290 20 290 30 Q290 40 280 40 L270 40 L290 80" 
                stroke="url(#gradient)" strokeWidth="4" fill="none" className="letter">
            <animate attributeName="stroke-dasharray" values="0 200;200 0" dur="0.5s" begin="2s" fill="freeze" />
          </path>
          
          <path d="M310 80 L310 60 L330 20 L350 60 L350 80" 
                stroke="url(#gradient)" strokeWidth="4" fill="none" className="letter">
            <animate attributeName="stroke-dasharray" values="0 200;200 0" dur="0.5s" begin="2.5s" fill="freeze" />
          </path>
        </svg>
        <div className="by-text">BY HACKIFYY</div>
      </div>
    </div>
  );
};

export default LoadingScreen;
