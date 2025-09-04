import React from 'react';

const Testimonials = () => {
  return (
    <section style={{backgroundColor: '#0b1120', padding: '120px 0', minHeight: '400px'}}>
      <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 2rem'}}>
        <div style={{textAlign: 'center', marginBottom: '4rem'}}>
          <h2 style={{fontSize: '2.8rem', fontWeight: '800', color: '#f8fafc', marginBottom: '1rem'}}>What Our Users Say</h2>
          <p style={{fontSize: '1.2rem', color: '#94a3b8', maxWidth: '600px', margin: '0 auto'}}>See what early adopters are saying about their SYNTRA experience.</p>
        </div>

        <div className="testimonials-grid">
          <div className="testimonial-card highlighted">
            <div className="testimonial-content">
              <div className="quote-mark">"</div>
              <p>SYNTRA completely transformed how our remote team collaborates. The workspace zone feels like having a real office in the digital world.</p>
              <div className="testimonial-rating">
                <div className="stars">★★★★★</div>
              </div>
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">
                <div className="avatar-placeholder">S</div>
              </div>
              <div className="author-info">
                <strong>Sarah Chen</strong>
                <span>Product Manager, TechCorp</span>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-content">
              <div className="quote-mark">"</div>
              <p>My students are more engaged than ever. The teaching zone's interactive features make online classes feel alive.</p>
              <div className="testimonial-rating">
                <div className="stars">★★★★★</div>
              </div>
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">
                <div className="avatar-placeholder">M</div>
              </div>
              <div className="author-info">
                <strong>Dr. Michael Rodriguez</strong>
                <span>Professor, State University</span>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-content">
              <div className="quote-mark">"</div>
              <p>We hosted our entire conference on SYNTRA. The engagement levels were higher than our in-person events!</p>
              <div className="testimonial-rating">
                <div className="stars">★★★★★</div>
              </div>
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">
                <div className="avatar-placeholder">E</div>
              </div>
              <div className="author-info">
                <strong>Emily Johnson</strong>
                <span>Event Director, Global Events Inc.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Testimonials;
