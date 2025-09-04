import React, { useState } from 'react';

const LiveDemo = () => {
  const [activeDemo, setActiveDemo] = useState('teaching');

  const demos = {
    teaching: {
      title: 'Teaching Zone Demo',
      features: ['Interactive Whiteboard', 'Screen Sharing', 'Student Management'],
      preview: (
        <div style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(6, 182, 212, 0.1))',
          borderRadius: '12px',
          padding: '1.5rem',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          height: '200px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{display: 'flex', gap: '0.5rem', marginBottom: '1rem'}}>
            <div style={{width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #059669)'}}></div>
            <div style={{flex: 1}}>
              <div style={{height: '8px', background: 'rgba(16, 185, 129, 0.3)', borderRadius: '4px', marginBottom: '0.5rem'}}></div>
              <div style={{height: '6px', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '3px', width: '60%'}}></div>
            </div>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem'}}>
            <div style={{height: '60px', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '8px'}}></div>
            <div style={{height: '60px', background: 'rgba(6, 182, 212, 0.15)', borderRadius: '8px'}}></div>
          </div>
          <div style={{
            position: 'absolute',
            bottom: '1rem',
            right: '1rem',
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: '#10b981',
            animation: 'pulse 2s infinite'
          }}></div>
        </div>
      )
    },
    gaming: {
      title: 'Gaming Zone Demo',
      features: ['Voice Chat', 'Screen Share', 'Tournament Mode'],
      preview: (
        <div style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(99, 102, 241, 0.1))',
          borderRadius: '12px',
          padding: '1.5rem',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          height: '200px',
          position: 'relative'
        }}>
          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1rem'}}>
            <div style={{fontSize: '2rem'}}>🎮</div>
            <div style={{fontSize: '1.5rem'}}>🏆</div>
          </div>
          <div style={{display: 'flex', gap: '0.5rem', marginBottom: '1rem'}}>
            {[1,2,3,4].map(i => (
              <div key={i} style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, #8b5cf6, #6366f1)`,
                opacity: i <= 2 ? 1 : 0.3
              }}></div>
            ))}
          </div>
          <div style={{
            height: '80px',
            background: 'rgba(139, 92, 246, 0.1)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3rem'
          }}>
            🎯
          </div>
        </div>
      )
    },
    workspace: {
      title: 'Workspace Zone Demo',
      features: ['3D Environment', 'Avatar System', 'Collaboration Tools'],
      preview: (
        <div style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(6, 182, 212, 0.1))',
          borderRadius: '12px',
          padding: '1.5rem',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          height: '200px',
          position: 'relative'
        }}>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '1rem'}}>
            {[1,2,3].map(i => (
              <div key={i} style={{
                height: '40px',
                borderRadius: '20px',
                background: `linear-gradient(135deg, #6366f1, #06b6d4)`,
                opacity: 0.7
              }}></div>
            ))}
          </div>
          <div style={{
            height: '100px',
            background: 'rgba(99, 102, 241, 0.05)',
            borderRadius: '8px',
            border: '2px dashed rgba(99, 102, 241, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem'
          }}>
            🏢
          </div>
        </div>
      )
    }
  };

  return (
    <div style={{
      background: 'rgba(23, 33, 54, 0.8)',
      borderRadius: '16px',
      padding: '2rem',
      border: '1px solid var(--border-color)',
      backdropFilter: 'blur(10px)'
    }}>
      <h3 style={{
        color: 'var(--text-primary)',
        fontSize: '1.5rem',
        marginBottom: '1rem',
        textAlign: 'center'
      }}>
        🚀 Live Preview
      </h3>
      
      <div style={{display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', justifyContent: 'center'}}>
        {Object.keys(demos).map(key => (
          <button
            key={key}
            onClick={() => setActiveDemo(key)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              border: '1px solid var(--border-color)',
              background: activeDemo === key ? 'var(--primary-color)' : 'transparent',
              color: activeDemo === key ? 'white' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: '500',
              transition: 'all 0.3s ease',
              textTransform: 'capitalize'
            }}
          >
            {key}
          </button>
        ))}
      </div>

      <div style={{marginBottom: '1rem'}}>
        <h4 style={{color: 'var(--text-primary)', fontSize: '1.1rem', marginBottom: '0.5rem'}}>
          {demos[activeDemo].title}
        </h4>
        <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
          {demos[activeDemo].features.map(feature => (
            <span key={feature} style={{
              padding: '0.25rem 0.5rem',
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              borderRadius: '12px',
              fontSize: '0.7rem',
              color: 'var(--text-secondary)'
            }}>
              {feature}
            </span>
          ))}
        </div>
      </div>

      {demos[activeDemo].preview}

      <div style={{
        textAlign: 'center',
        marginTop: '1rem',
        padding: '0.75rem',
        background: 'rgba(16, 185, 129, 0.1)',
        borderRadius: '8px',
        border: '1px solid rgba(16, 185, 129, 0.2)'
      }}>
        <span style={{color: '#10b981', fontSize: '0.8rem', fontWeight: '500'}}>
          ✨ Interactive demo - Click to explore!
        </span>
      </div>
    </div>
  );
};

export default LiveDemo;