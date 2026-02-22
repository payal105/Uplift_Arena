import React from 'react';

const About = () => {
  const features = [
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      ),
      title: 'Flexible Booking',
      description: 'Book on your terms with our flexible scheduling options'
    },
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      ),
      title: 'Wide Availability',
      description: 'Access our facilities any time that suits you best'
    },
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
      ),
      title: 'Prime Locations',
      description: 'Conveniently located venues across the city'
    },
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"></circle>
          <circle cx="12" cy="12" r="6"></circle>
          <circle cx="12" cy="12" r="2"></circle>
        </svg>
      ),
      title: 'Top Quality',
      description: 'World-class turfs and facilities for the best experience'
    }
  ];

  return (
    <section className="about-section section-padding">
      <div className="container">
        <div className="row text-center heading-part">
          <h2>ABOUT US</h2>
          <h6>Your ultimate destination for sports and entertainment</h6>
          <p>
            Welcome to Sportitude, Kolkata's ultimate hub of adventure, sports, and entertainment! 
            Since opening our doors in 2025, we've been the go-to destination for thrill-seekers, 
            sports enthusiasts, and families looking for the perfect blend of excitement and fun.
          </p>
          <p>
            Here, fun has no limits, excitement knows no bounds, and memories are made at every turn. 
            So step in, gear up, and let the games begin because at Sportitude, the fun never ends!
          </p>
        </div>

        <div className="row g-4">
          {features.map((feature, index) => (
            <div className="col-lg-6" key={index}>
              <div className="about-item">
                <div className="icon-area">
                  {feature.icon}
                </div>
                <h4>{feature.title}</h4>
                <p>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
