import React from 'react';

const Solution = () => {
  return (
    <section id="solution" style={{backgroundColor: '#0b1120', padding: '120px 0', minHeight: '400px'}}>
      <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 2rem'}}>
        <div style={{textAlign: 'center', marginBottom: '4rem'}}>
          <h2 style={{fontSize: '2.8rem', fontWeight: '800', color: '#f8fafc', marginBottom: '1rem'}}>Why SYNTRA</h2>
          <p style={{fontSize: '1.2rem', color: '#94a3b8', maxWidth: '600px', margin: '0 auto'}}>From generic calls to tailored, engaging collaboration zones.</p>
        </div>

      <div className="comparison-container">
        <div className="comparison-item before">
          <div className="comparison-header">
            <i>😕</i>
            <h3>Before</h3>
          </div>
          <div className="comparison-content">
            <div className="problem-item"><i>✖</i><span>Generic video calls with low engagement</span></div>
            <div className="problem-item"><i>✖</i><span>No tailored tools for specific tasks</span></div>
            <div className="problem-item"><i>✖</i><span>Context switching fatigue</span></div>
          </div>
        </div>

        <div className="vs-divider">
          <div className="vs-circle">VS</div>
        </div>

        <div className="comparison-item after">
          <div className="comparison-header">
            <i>🚀</i>
            <h3>After</h3>
          </div>
          <div className="comparison-content">
            <div className="solution-item"><i>✔</i><span>Engaging, purpose-built zones</span></div>
            <div className="solution-item"><i>✔</i><span>Integrated tools for each scenario</span></div>
            <div className="solution-item"><i>✔</i><span>Seamless, unified experience</span></div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
};

export default Solution;
