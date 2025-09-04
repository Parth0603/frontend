import React, { useEffect, useRef } from 'react';

const CursorFollower = () => {
  const trailRef = useRef(null);

  useEffect(() => {
    const trail = trailRef.current;
    if (!trail) return;

    const handleMouseMove = (e) => {
      trail.style.left = e.clientX + 'px';
      trail.style.top = e.clientY + 'px';
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
    return null;
  }

  return (
    <div
      ref={trailRef}
      style={{
        position: 'fixed',
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        background: 'rgba(99, 102, 241, 0.3)',
        pointerEvents: 'none',
        zIndex: 9999,
        transform: 'translate(-50%, -50%)',
        transition: 'all 0.05s ease-out'
      }}
    />
  );
};

export default CursorFollower;
