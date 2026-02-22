import React from 'react';

const Coaching = () => {
  const coaches = [
    {
      id: 1,
      name: 'Mr. Suprotim Chatterjee',
      title: 'Cricket Coach',
      sport: 'Cricket',
      sportIcon: '/assets/images/fc1.png',
      image: '/assets/images/co1.jpg',
      ageGroup: '4 - 20 years',
      schedule: 'Monday & Friday',
      timing: '5pm - 7pm'
    },
    {
      id: 2,
      name: 'Mr. Suprotim Chatterjee',
      title: 'Cricket Coach',
      sport: 'Cricket',
      sportIcon: '/assets/images/fc1.png',
      image: '/assets/images/co1.jpg',
      ageGroup: '4 - 20 years',
      schedule: 'Monday & Friday',
      timing: '5pm - 7pm'
    },
    {
      id: 3,
      name: 'Mr. Suprotim Chatterjee',
      title: 'Cricket Coach',
      sport: 'Cricket',
      sportIcon: '/assets/images/fc1.png',
      image: '/assets/images/co1.jpg',
      ageGroup: '4 - 20 years',
      schedule: 'Monday & Friday',
      timing: '5pm - 7pm'
    },
    {
      id: 4,
      name: 'Mr. Suprotim Chatterjee',
      title: 'Cricket Coach',
      sport: 'Cricket',
      sportIcon: '/assets/images/fc1.png',
      image: '/assets/images/co1.jpg',
      ageGroup: '4 - 20 years',
      schedule: 'Monday & Friday',
      timing: '5pm - 7pm'
    }
  ];

  return (
    <>
      <div className="inner-banner-section">
        <div className="image-area">
          <img src="/assets/images/bdcm1.jpg" alt="Coaching Banner" />
        </div>
        <div className="container content-area">
          <h1>Coaching</h1>
          <p>Our Academy provides top quality cricket and football coaching for kids</p>
        </div>
      </div>

      <section className="rev-section section-padding">
        <div className="container">
          <h2>Revolutionizing Sports Education</h2>
          <p>
            Unlock your potential as a leader in the sports industry. Our curriculum is specifically 
            designed to bridge the gap between passion and professional mastery for PE teachers and 
            coaches. We don't just teach sports—we cultivate the professional expertise required to 
            launch a high-impact career and elevate the standards of national coaching
          </p>
          <a href="#booking" className="btn btn-secondary">Book Now</a>
        </div>
      </section>

      <section className="coach-section section-padding">
        <div className="container">
          <div className="heading-part text-center">
            <h2>Our Coaches</h2>
          </div>

          <div className="row g-4">
            {coaches.map((coach) => (
              <div key={coach.id} className="col-md-6 col-lg-4 col-xl-3">
                <div className="coach-box">
                  <div className="head">
                    <img src={coach.sportIcon} alt={coach.sport} /> 
                    <span>{coach.sport}</span>
                  </div>
                  <div className="image-area">
                    <img src={coach.image} alt={coach.name} />
                  </div>
                  <h4>{coach.name}</h4>
                  <h6>{coach.title}</h6>
                  <ul className="info-list">
                    <li>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display: 'inline-block', verticalAlign: 'middle', marginRight: '8px'}}>
                        <circle cx="12" cy="8" r="7"></circle>
                        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                      </svg> {coach.ageGroup}
                    </li>
                    <li>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display: 'inline-block', verticalAlign: 'middle', marginRight: '8px'}}>
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg> {coach.schedule}
                    </li>
                    <li>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display: 'inline-block', verticalAlign: 'middle', marginRight: '8px'}}>
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg> {coach.timing}
                    </li>
                  </ul>
                  <a href="#booking" className="btn btn-secondary">Book Now</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Coaching;
