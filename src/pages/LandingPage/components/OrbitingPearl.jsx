import React, { useEffect, useRef } from 'react';

const OrbitingPearl = () => {
  const pearlRef = useRef(null);
  const trailRef = useRef(null);
  const trailPoints = useRef([]);

  useEffect(() => {
    const pearl = pearlRef.current;
    const trail = trailRef.current;
    if (!pearl || !trail) return;

    const handleScroll = () => {
      const scrollY = window.pageYOffset;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = Math.min(scrollY / maxScroll, 1);
      
      // Calculate orbital position based on scroll progress
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const radiusX = Math.min(window.innerWidth * 0.4, 400);
      const radiusY = Math.min(window.innerHeight * 0.3, 300);
      
      // Complete orbit based on scroll progress (0 to 2π)
      const angle = scrollProgress * Math.PI * 2;
      const x = centerX + Math.cos(angle) * radiusX;
      const y = centerY + Math.sin(angle) * radiusY;
      
      // Update pearl position
      pearl.style.left = `${x}px`;
      pearl.style.top = `${y}px`;
      
      // Add current position to trail
      trailPoints.current.push({ x, y, progress: scrollProgress });
      
      // Keep only recent trail points (last 20% of scroll progress)
      trailPoints.current = trailPoints.current.filter(point => 
        scrollProgress - point.progress < 0.2
      );
      
      // Update trail path
      if (trailPoints.current.length > 1) {
        const pathData = trailPoints.current.reduce((path, point, index) => {
          const command = index === 0 ? 'M' : 'L';
          return `${path} ${command} ${point.x} ${point.y}`;
        }, '');
        
        trail.setAttribute('d', pathData);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial position

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      {/* Trail SVG */}
      <svg
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 999
        }}
      >
        <defs>
          <linearGradient id="trailGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0)" />
            <stop offset="50%" stopColor="rgba(99, 102, 241, 0.4)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.8)" />
          </linearGradient>
          
          <filter id="trailGlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <path
          ref={trailRef}
          stroke="url(#trailGradient)"
          strokeWidth="3"
          fill="none"
          filter="url(#trailGlow)"
          strokeLinecap="round"
          opacity="0.7"
        />
      </svg>

      {/* 3D Pearl */}
      <div
        ref={pearlRef}
        style={{
          position: 'fixed',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          background: `
            radial-gradient(circle at 30% 30%, 
              rgba(255, 255, 255, 0.9) 0%,
              rgba(255, 255, 255, 0.7) 20%,
              rgba(99, 102, 241, 0.8) 40%,
              rgba(139, 92, 246, 0.9) 60%,
              rgba(6, 182, 212, 0.7) 80%,
              rgba(0, 0, 0, 0.3) 100%
            )
          `,
          boxShadow: `
            0 0 20px rgba(99, 102, 241, 0.6),
            0 0 40px rgba(139, 92, 246, 0.4),
            0 0 60px rgba(6, 182, 212, 0.3),
            inset -5px -5px 10px rgba(0, 0, 0, 0.2),
            inset 3px 3px 6px rgba(255, 255, 255, 0.3)
          `,
          transform: 'translate(-50%, -50%)',
          zIndex: 1000,
          pointerEvents: 'none',
          transition: 'left 0.1s ease-out, top 0.1s ease-out',
          animation: 'pearlSpin 3s linear infinite, pearlPulse 2s ease-in-out infinite alternate'
        }}
      />

      <style jsx>{`
        @keyframes pearlSpin {
          from { 
            filter: hue-rotate(0deg) brightness(1);
          }
          to { 
            filter: hue-rotate(360deg) brightness(1.2);
          }
        }

        @keyframes pearlPulse {
          from { 
            transform: translate(-50%, -50%) scale(1);
            box-shadow: 
              0 0 20px rgba(99, 102, 241, 0.6),
              0 0 40px rgba(139, 92, 246, 0.4),
              0 0 60px rgba(6, 182, 212, 0.3),
              inset -5px -5px 10px rgba(0, 0, 0, 0.2),
              inset 3px 3px 6px rgba(255, 255, 255, 0.3);
          }
          to { 
            transform: translate(-50%, -50%) scale(1.1);
            box-shadow: 
              0 0 30px rgba(99, 102, 241, 0.8),
              0 0 60px rgba(139, 92, 246, 0.6),
              0 0 90px rgba(6, 182, 212, 0.4),
              inset -5px -5px 10px rgba(0, 0, 0, 0.2),
              inset 3px 3px 6px rgba(255, 255, 255, 0.3);
          }
        }

        @media (max-width: 768px) {
          div[ref] {
            width: 15px !important;
            height: 15px !important;
          }
        }
      `}</style>
    </>
  );
};

export default OrbitingPearl;
