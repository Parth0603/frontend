import React from 'react';

const UseCases = () => {
  return (
    <section style={{backgroundColor: '#0b1120', padding: '120px 0', minHeight: '400px'}}>
      <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 2rem'}}>
        <div style={{textAlign: 'center', marginBottom: '4rem'}}>
          <h2 style={{fontSize: '2.8rem', fontWeight: '800', color: '#f8fafc', marginBottom: '1rem'}}>Perfect for Every Team</h2>
          <p style={{fontSize: '1.2rem', color: '#94a3b8', maxWidth: '600px', margin: '0 auto'}}>Discover how different teams use SYNTRA to enhance their collaboration.</p>
        </div>

        <div className="use-case-grid">
          <div className="use-case-card">
            <div className="use-case-content">
              <h3>Remote Teams</h3>
              <p>Bridge the gap between remote team members with immersive collaboration experiences.</p>
              <ul>
                <li><i className="fa-solid fa-check"></i>Virtual office spaces</li>
                <li><i className="fa-solid fa-check"></i>Spontaneous interactions</li>
                <li><i className="fa-solid fa-check"></i>Team building activities</li>
              </ul>
            </div>
          </div>

          <div className="use-case-card">
            <div className="use-case-content">
              <h3>Educators</h3>
              <p>Create engaging learning experiences that keep students motivated and involved.</p>
              <ul>
                <li><i className="fa-solid fa-check"></i>Interactive whiteboards</li>
                <li><i className="fa-solid fa-check"></i>Student engagement tracking</li>
                <li><i className="fa-solid fa-check"></i>Virtual field trips</li>
              </ul>
            </div>
          </div>

          <div className="use-case-card">
            <div className="use-case-content">
              <h3>Event Organizers</h3>
              <p>Host memorable virtual events that engage and inspire your audience.</p>
              <ul>
                <li><i className="fa-solid fa-check"></i>Interactive presentations</li>
                <li><i className="fa-solid fa-check"></i>Audience polls and Q&A</li>
                <li><i className="fa-solid fa-check"></i>Networking opportunities</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UseCases;
