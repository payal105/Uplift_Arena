import React from 'react';

const RateCard = () => {
  const pricingCards = [
    {
      id: 1,
      sport: 'Football',
      fullTurf: {
        name: 'Full Turf',
        dimensions: '(120 ft * 65 ft)',
        weekdayPrice: '₹2500/hr',
        weekendPrice: '₹3000/hr'
      },
      halfTurf: {
        name: 'Half Turf',
        dimensions: '(120 ft * 130 ft)',
        details: '8/10 A side',
        weekdayPrice: '₹2500/hr',
        weekendPrice: '₹3000/hr'
      },
      amenities: [
        'Professional turf',
        'Changing rooms',
        'Floodlights',
        'Goal posts'
      ]
    },
    {
      id: 2,
      sport: 'Football',
      fullTurf: {
        name: 'Full Turf',
        dimensions: '(120 ft * 65 ft)',
        weekdayPrice: '₹2500/hr',
        weekendPrice: '₹3000/hr'
      },
      halfTurf: {
        name: 'Half Turf',
        dimensions: '(120 ft * 130 ft)',
        details: '8/10 A side',
        weekdayPrice: '₹2500/hr',
        weekendPrice: '₹3000/hr'
      },
      amenities: [
        'Professional turf',
        'Changing rooms',
        'Floodlights',
        'Goal posts'
      ]
    },
    {
      id: 3,
      sport: 'Football',
      fullTurf: {
        name: 'Full Turf',
        dimensions: '(120 ft * 65 ft)',
        weekdayPrice: '₹2500/hr',
        weekendPrice: '₹3000/hr'
      },
      halfTurf: {
        name: 'Half Turf',
        dimensions: '(120 ft * 130 ft)',
        details: '8/10 A side',
        weekdayPrice: '₹2500/hr',
        weekendPrice: '₹3000/hr'
      },
      amenities: [
        'Professional turf',
        'Changing rooms',
        'Floodlights',
        'Goal posts'
      ]
    }
  ];

  return (
    <>
      <div className="inner-banner-section">
        <div className="image-area">
          <img src="/assets/images/bdcm2.jpg" alt="Rate Card Banner" />
        </div>
        <div className="container content-area">
          <h1>Rate Card</h1>
          <p>Competitive rates for all sports and facilities</p>
        </div>
      </div>

      <section className="pricing-section section-padding">
        <div className="container">
          <div className="heading-part text-center">
            <h2>Our Pricing</h2>
          </div>

          <div className="row g-4 justify-content-center">
            {pricingCards.map((card) => (
              <div key={card.id} className="col-md-6 col-lg-4 col-xxl-3">
                <div className="card rate-card">
                  <div className="card-header">
                    <h5>{card.sport}</h5>
                    <h6>{card.fullTurf.name}</h6>
                    <p>{card.fullTurf.dimensions}</p>
                  </div>
                  
                  <div className="card-body">
                    <h5>
                      <span>Weekdays</span> 
                      <span>{card.fullTurf.weekdayPrice}</span>
                    </h5>
                    <h5>
                      <span>Weekend</span> 
                      <span>{card.fullTurf.weekendPrice}</span>
                    </h5>

                    <hr />

                    <div className="text-center">
                      <h6>{card.halfTurf.name}</h6>
                      <p>
                        {card.halfTurf.dimensions}<br/>
                        {card.halfTurf.details}
                      </p>
                    </div>
                    <h5>
                      <span>Weekdays</span> 
                      <span>{card.halfTurf.weekdayPrice}</span>
                    </h5>
                    <h5>
                      <span>Weekend</span> 
                      <span>{card.halfTurf.weekendPrice}</span>
                    </h5>

                    <hr />

                    <ul>
                      {card.amenities.map((amenity, index) => (
                        <li key={index}>{amenity}</li>
                      ))}
                    </ul>
                    <a href="#booking" className="btn btn-secondary">Book Now</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default RateCard;
