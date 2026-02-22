import React from 'react';

const Banner = () => {
  return (
    <section className="banner-section">
      <div className="container">
        <div className="banner-area">
          <h1>Reserve your perfect play space</h1>
          <p>
            Book world-class turfs for football, cricket, and more a space where athletes train, 
            teams compete, and champions are made.
          </p>
          <ul>
            <li>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display: 'inline-block', verticalAlign: 'middle', marginRight: '8px'}}>
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg> Wide Availability
            </li>
            <li>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display: 'inline-block', verticalAlign: 'middle', marginRight: '8px'}}>
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg> Easy Booking
            </li>
          </ul>
          <a href="#booking" className="btn btn-primary">
            Book Now
          </a>
        </div>
      </div>
    </section>
  );
};

export default Banner;
