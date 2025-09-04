import React, { useState, useEffect } from 'react';

const OnboardingTour = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const steps = [
    {
      title: "Welcome to SYNTRA! 🎉",
      content: "Your all-in-one collaboration platform with multiple specialized zones.",
      target: null
    },
    {
      title: "Teaching Zone 📚",
      content: "Host interactive classes with video, screen sharing, and whiteboards.",
      target: null
    },
    {
      title: "Gaming Zone 🎮",
      content: "Play games and have fun with your team during breaks.",
      target: null
    },
    {
      title: "Workspace Zone 💼",
      content: "Collaborate on projects with shared documents and tools.",
      target: null
    },
    {
      title: "You're all set! ✨",
      content: "Explore SYNTRA and discover the power of seamless collaboration.",
      target: null
    }
  ];

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('syntra-tour-completed');
    if (!hasSeenTour) {
      setIsVisible(true);
    }
  }, []);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  };

  const skipTour = () => {
    completeTour();
  };

  const completeTour = () => {
    localStorage.setItem('syntra-tour-completed', 'true');
    setIsVisible(false);
    onComplete?.();
  };

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: '16px',
        padding: '2rem',
        maxWidth: '400px',
        width: '100%',
        border: '1px solid var(--border-color)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ color: 'var(--text-primary)', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
            {steps[currentStep].title}
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            {steps[currentStep].content}
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          {steps.map((_, index) => (
            <div
              key={index}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: index === currentStep ? 'var(--primary-color)' : 'var(--border-color)',
                margin: '0 4px',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={skipTour}
            style={{
              flex: 1,
              padding: '0.75rem',
              backgroundColor: 'transparent',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            Skip
          </button>
          <button
            onClick={nextStep}
            style={{
              flex: 1,
              padding: '0.75rem',
              backgroundColor: 'var(--primary-color)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
          >
            {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingTour;