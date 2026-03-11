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
          <h6>Your Destination for Sports, Fitness & Community</h6>
          <p>
           Welcome to Uplift Sports Arena, Siliguri’s premier destination for sports, fitness, and recreation. Established in 2025, Uplift Sports Arena was built with a simple vision — to create a modern space where athletes, sports enthusiasts, and families can come together to play, train, and stay active.
          </p>
          <p>
            Our facility offers well-maintained courts, professional sports infrastructure, and a vibrant environment designed for both beginners and competitive players. Whether you want to sharpen your skills, stay fit, or simply enjoy a game with friends, Uplift Sports Arena provides the perfect setting.
          </p>
          <p>
            At Uplift Sports Arena, we believe sports go beyond just playing a game — they build discipline, promote teamwork, and bring people together. Every match played, every training session completed, and every moment spent here contributes to a growing community that shares a passion for sports and fitness.
          </p>
          <p>
            Step in, gear up, and experience a place where sport, energy, and community come together.
          </p>
        </div>

        <div className="row g-4 align-items-stretch">
          {features.map((feature, index) => (
            <div className="col-lg-4" key={index}>
              <div className="about-item h-100">
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
