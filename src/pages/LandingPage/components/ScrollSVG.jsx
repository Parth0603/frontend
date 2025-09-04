import React, { useEffect, useRef, useState } from 'react';

const ScrollSVG = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef(null);
  const mainLineRef = useRef(null);
  const particlesRef = useRef([]);
  const waveRef = useRef(null);
  const pulseRef = useRef(null);
  const trailPoints = useRef([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const containerHeight = container.offsetHeight;
    const pathLength = containerHeight;

    // Initialize all elements
    const mainLine = mainLineRef.current;
    const wave = waveRef.current;
    const pulse = pulseRef.current;

    if (mainLine) {
      mainLine.style.strokeDasharray = `${pathLength}`;
      mainLine.style.strokeDashoffset = `${pathLength}`;
    }

    if (wave) {
      const waveLength = wave.getTotalLength();
      wave.style.strokeDasharray = `${waveLength}`;
      wave.style.strokeDashoffset = `${waveLength}`;
    }

    const handleScroll = () => {
      const scrollY = window.pageYOffset;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(Math.max(scrollY / maxScroll, 0), 1);
      
      setScrollProgress(progress);

      // Add current progress to trail
      trailPoints.current.push({ progress, time: Date.now() });
      
      // Keep only recent trail points (last 2 seconds)
      const now = Date.now();
      trailPoints.current = trailPoints.current.filter(point => 
        now - point.time < 2000
      );

      // Main line animation
      if (mainLine) {
        const offset = pathLength - (pathLength * progress);
        mainLine.style.strokeDashoffset = `${offset}`;
      }

      // Wave animation with slight delay
      if (wave) {
        const waveLength = wave.getTotalLength();
        const waveProgress = Math.max(0, progress - 0.05);
        const waveOffset = waveLength - (waveLength * waveProgress);
        wave.style.strokeDashoffset = `${waveOffset}`;
      }

      // Pulse position
      if (pulse) {
        const pulseY = progress * (containerHeight - 20);
        pulse.setAttribute('cy', pulseY + 10);
      }

      // Particles animation
      particlesRef.current.forEach((particle, index) => {
        if (particle) {
          const particleProgress = Math.max(0, progress - (index * 0.08));
          const opacity = particleProgress > 0 ? Math.min(1, particleProgress * 3) : 0;
          const scale = 0.3 + (particleProgress * 0.7);
          
          particle.style.opacity = opacity;
          particle.style.transform = `scale(${scale})`;
          
          // Move particles along the path
          const particleY = (index * 80) + (particleProgress * 50);
          particle.setAttribute('cy', Math.min(particleY, containerHeight - 10));
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (typeof window !== 'undefined' && window.innerWidth <= 768) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        right: '12px',
        top: '80px',
        width: '30px',
        height: 'calc(100vh - 160px)',
        zIndex: 100,
        pointerEvents: 'none'
      }}
    >
      <svg width="30" height="100%" viewBox="0 0 30 100%" preserveAspectRatio="none">
        <defs>
          {/* Enhanced gradients */}
          <linearGradient id="mainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6366f1">
              <animate attributeName="stop-color" values="#6366f1;#8b5cf6;#06b6d4;#10b981;#6366f1" dur="8s" repeatCount="indefinite" />
            </stop>
            <stop offset="50%" stopColor="#8b5cf6">
              <animate attributeName="stop-color" values="#8b5cf6;#06b6d4;#10b981;#f59e0b;#8b5cf6" dur="8s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#06b6d4">
              <animate attributeName="stop-color" values="#06b6d4;#10b981;#f59e0b;#6366f1;#06b6d4" dur="8s" repeatCount="indefinite" />
            </stop>
          </linearGradient>

          <radialGradient id="pulseGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="1" />
            <stop offset="70%" stopColor="#8b5cf6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.3" />
          </linearGradient>

          {/* Advanced filters */}
          <filter id="advancedGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feOffset in="coloredBlur" dx="0" dy="0" result="offsetBlur"/>
            <feFlood floodColor="#6366f1" floodOpacity="0.3"/>
            <feComposite in2="offsetBlur" operator="in"/>
            <feMerge> 
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          <filter id="particleGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Background constellation */}
        {[...Array(8)].map((_, i) => (
          <circle
            key={`bg-${i}`}
            cx={5 + (i % 3) * 10}
            cy={i * 12 + '%'}
            r="0.5"
            fill="#6366f1"
            opacity="0.2"
          >
            <animate attributeName="opacity" values="0.2;0.6;0.2" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
          </circle>
        ))}

        {/* Background track with subtle pattern */}
        <line x1="15" y1="0" x2="15" y2="100%" stroke="rgba(99,102,241,0.08)" strokeWidth="1" />
        <line x1="15" y1="0" x2="15" y2="100%" stroke="rgba(99,102,241,0.15)" strokeWidth="6" opacity="0.3" />

        {/* Flowing wave path */}
        <path
          ref={waveRef}
          d="M 12 0 Q 18 8% 12 16% Q 6 24% 12 32% Q 18 40% 12 48% Q 6 56% 12 64% Q 18 72% 12 80% Q 6 88% 12 96% L 12 100%"
          stroke="url(#waveGradient)"
          strokeWidth="3"
          fill="none"
          filter="url(#advancedGlow)"
          style={{ transition: 'stroke-dashoffset 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
        
        {/* Trail effect */}
        {trailPoints.current.length > 1 && (
          <g opacity="0.4">
            {trailPoints.current.map((point, index) => {
              if (index === 0) return null;
              const prevPoint = trailPoints.current[index - 1];
              const opacity = (index / trailPoints.current.length) * 0.6;
              const y1 = prevPoint.progress * 100;
              const y2 = point.progress * 100;
              
              return (
                <line
                  key={`trail-${index}`}
                  x1="15"
                  y1={`${y1}%`}
                  x2="15"
                  y2={`${y2}%`}
                  stroke="url(#mainGradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  opacity={opacity}
                  filter="url(#advancedGlow)"
                />
              );
            })}
          </g>
        )}

        {/* Main progress line */}
        <line
          ref={mainLineRef}
          x1="15"
          y1="0"
          x2="15"
          y2="100%"
          stroke="url(#mainGradient)"
          strokeWidth="5"
          strokeLinecap="round"
          filter="url(#advancedGlow)"
          style={{ transition: 'stroke-dashoffset 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
        
        {/* Dynamic particles */}
        {[...Array(12)].map((_, i) => (
          <g key={`particle-${i}`}>
            <circle
              ref={el => particlesRef.current[i] = el}
              cx="15"
              cy={i * 8 + '%'}
              r={2 + (i % 3)}
              fill="url(#pulseGradient)"
              opacity="0"
              filter="url(#particleGlow)"
              style={{ 
                transition: 'opacity 0.4s ease, transform 0.4s ease',
                transformOrigin: 'center'
              }}
            >
              <animate
                attributeName="r"
                values={`${2 + (i % 3)};${4 + (i % 3)};${2 + (i % 3)}`}
                dur={`${1.5 + (i % 4) * 0.5}s`}
                repeatCount="indefinite"
              />
            </circle>
            
            {/* Particle trails */}
            <circle
              cx="15"
              cy={i * 8 + '%'}
              r="1"
              fill="#6366f1"
              opacity="0.3"
            >
              <animate attributeName="opacity" values="0.3;0;0.3" dur={`${2 + i * 0.2}s`} repeatCount="indefinite" />
              <animate attributeName="r" values="1;3;1" dur={`${2 + i * 0.2}s`} repeatCount="indefinite" />
            </circle>
          </g>
        ))}
        
        {/* Dynamic pulse indicator */}
        <circle
          ref={pulseRef}
          cx="15"
          cy="0"
          r="6"
          fill="url(#pulseGradient)"
          filter="url(#advancedGlow)"
          style={{ transition: 'cy 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
        >
          <animate attributeName="r" values="6;10;6" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;0.4;0.8" dur="2s" repeatCount="indefinite" />
        </circle>

        {/* Progress percentage text */}
        <text
          x="25"
          y="15"
          fill="#6366f1"
          fontSize="8"
          fontWeight="bold"
          opacity="0.7"
        >
          {Math.round(scrollProgress * 100)}%
        </text>

        {/* Sparkle effects */}
        {[...Array(6)].map((_, i) => (
          <g key={`sparkle-${i}`} opacity={scrollProgress > i * 0.15 ? '1' : '0'} style={{ transition: 'opacity 0.5s ease' }}>
            <polygon
              points={`${20 + (i % 2) * 8},${i * 15 + 10} ${22 + (i % 2) * 8},${i * 15 + 12} ${20 + (i % 2) * 8},${i * 15 + 14} ${18 + (i % 2) * 8},${i * 15 + 12}`}
              fill="#f59e0b"
              opacity="0.8"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                values={`0 ${20 + (i % 2) * 8} ${i * 15 + 12};360 ${20 + (i % 2) * 8} ${i * 15 + 12}`}
                dur={`${3 + i * 0.5}s`}
                repeatCount="indefinite"
              />
              <animate attributeName="opacity" values="0.8;0.3;0.8" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
            </polygon>
          </g>
        ))}
      </svg>
    </div>
  );
};

export default ScrollSVG;
