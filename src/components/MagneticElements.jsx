import React, { useEffect, useRef } from 'react';

const MagneticElements = () => {
  const elementsRef = useRef([]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      elementsRef.current.forEach((element) => {
        if (!element) return;

        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        const maxDistance = 100;
        const strength = Math.max(0, 1 - distance / maxDistance);
        
        if (strength > 0) {
          const moveX = deltaX * strength * 0.3;
          const moveY = deltaY * strength * 0.3;
          
          element.style.transform = `translate(${moveX}px, ${moveY}px) scale(${1 + strength * 0.1})`;
        } else {
          element.style.transform = 'translate(0px, 0px) scale(1)';
        }
      });
    };

    const handleMouseLeave = () => {
      elementsRef.current.forEach((element) => {
        if (element) {
          element.style.transform = 'translate(0px, 0px) scale(1)';
        }
      });
    };

    // Add magnetic effect to buttons and interactive elements
    const addMagneticEffect = () => {
      const magneticElements = document.querySelectorAll('button, .btn-hero, .nav-link, .login-option, a[href]');
      elementsRef.current = Array.from(magneticElements);
      
      elementsRef.current.forEach((element) => {
        element.style.transition = 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)';
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    // Initialize after a short delay to ensure elements are rendered
    setTimeout(addMagneticEffect, 1000);
    
    // Re-initialize when route changes
    const observer = new MutationObserver(addMagneticEffect);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      observer.disconnect();
    };
  }, []);

  return null;
};

export default MagneticElements;
