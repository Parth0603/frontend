import React, { useEffect } from 'react';
import '../styles/loading.css';

const LoadingScreen = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 4000); // Animation completes in 4 seconds
    
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="loading-screen">
      <div className="loading-content">
        <svg className="logo-svg" viewBox="0 0 400 100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
          
          <path d="M20 70 Q20 80 30 80 L50 80 Q60 80 60 70 Q60 60 50 60 L30 60 Q20 60 20 50 Q20 40 30 40 L50 40 Q60 40 60 30" 
                stroke="url(#gradient)" strokeWidth="4" fill="none" className="letter">
            <animate attributeName="stroke-dasharray" values="0 300;300 0" dur="0.6s" begin="0s" fill="freeze" />
          </path>
          
          <path d="M80 30 L100 50 L120 30 M100 50 L100 80" 
                stroke="url(#gradient)" strokeWidth="4" fill="none" className="letter">
            <animate attributeName="stroke-dasharray" values="0 200;200 0" dur="0.6s" begin="0.6s" fill="freeze" />
          </path>
          
          <path d="M140 30 L140 80 M140 30 L180 80 M180 30 L180 80" 
                stroke="url(#gradient)" strokeWidth="4" fill="none" className="letter">
            <animate attributeName="stroke-dasharray" values="0 250;250 0" dur="0.6s" begin="1.2s" fill="freeze" />
          </path>
          
          <path d="M200 30 L240 30 M220 30 L220 80" 
                stroke="url(#gradient)" strokeWidth="4" fill="none" className="letter">
            <animate attributeName="stroke-dasharray" values="0 150;150 0" dur="0.6s" begin="1.8s" fill="freeze" />
          </path>
          
          <path d="M260 30 L260 80 M260 30 L280 30 Q290 30 290 45 Q290 55 280 55 L260 55 M275 55 L290 80" 
                stroke="url(#gradient)" strokeWidth="4" fill="none" className="letter">
            <animate attributeName="stroke-dasharray" values="0 250;250 0" dur="0.6s" begin="2.4s" fill="freeze" />
          </path>
          
          <path d="M310 80 L330 30 L350 80" 
                stroke="url(#gradient)" strokeWidth="4" fill="none" className="letter">
            <animate attributeName="stroke-dasharray" values="0 150;150 0" dur="0.6s" begin="3s" fill="freeze" />
          </path>
          <path d="M320 60 L340 60" 
                stroke="url(#gradient)" strokeWidth="4" fill="none" className="letter">
            <animate attributeName="stroke-dasharray" values="0 20;20 0" dur="0.3s" begin="3.3s" fill="freeze" />
          </path>
        </svg>
        <div className="by-text">BY HACKIFYY</div>
      </div>
    </div>
  );
};

export default LoadingScreen;
