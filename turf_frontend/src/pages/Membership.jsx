import React, { useState } from 'react';

const GymIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="32" height="32">
    <path d="M6 4v16M18 4v16M3 8h4M17 8h4M3 16h4M17 16h4M7 12h10"/>
  </svg>
);

const ActivityIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="32" height="32">
    <circle cx="12" cy="4" r="2"/>
    <path d="M6 8l3 3-3 5h4l1-2 1 2h4l-3-5 3-3"/>
    <path d="M9 11l1.5 2.5L12 12l1.5 1.5L15 11"/>
  </svg>
);

const ChangingRoomIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="32" height="32">
    <path d="M4 4h4v16H4zM16 4h4v16h-4"/>
    <path d="M8 9h8M8 15h8"/>
    <circle cx="12" cy="7" r="1.5"/>
    <path d="M10 17v2M14 17v2"/>
  </svg>
);

const CoffeeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="32" height="32">
    <path d="M17 8h1a4 4 0 0 1 0 8h-1"/>
    <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/>
    <line x1="6" y1="2" x2="6" y2="4"/>
    <line x1="10" y1="2" x2="10" y2="4"/>
    <line x1="14" y1="2" x2="14" y2="4"/>
  </svg>
);

const ParkingIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="32" height="32">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <path d="M9 17V7h4a3 3 0 0 1 0 6H9"/>
  </svg>
);

const ToiletIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="32" height="32">
    <circle cx="9" cy="4" r="2"/>
    <circle cx="15" cy="4" r="2"/>
    <path d="M6 9h5v6l-1 4h3l-1-4V9h5"/>
    <line x1="6" y1="9" x2="18" y2="9"/>
  </svg>
);

const BadmintonIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="32" height="32">
    <circle cx="13" cy="6" r="4"/>
    <line x1="10" y1="9" x2="4" y2="20"/>
    <line x1="11" y1="8" x2="5" y2="19"/>
    <line x1="9" y1="10" x2="3.5" y2="20.5"/>
    <path d="M10 9.5C10 9.5 8 11 7 13"/>
    <line x1="13" y1="10" x2="10" y2="20"/>
  </svg>
);

const TennisIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="32" height="32">
    <circle cx="12" cy="12" r="9"/>
    <path d="M3.5 9.5C5 8 7.5 7 10 7.5"/>
    <path d="M20.5 14.5C19 16 16.5 17 14 16.5"/>
    <path d="M5.5 17C7 19 10 20.5 12 20.5"/>
    <path d="M18.5 7C17 5 14 3.5 12 3.5"/>
  </svg>
);

const PickleballIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="32" height="32">
    <rect x="12" y="2" width="6" height="12" rx="3"/>
    <line x1="15" y1="14" x2="10" y2="22"/>
    <circle cx="7" cy="18" r="4"/>
    <circle cx="7" cy="18" r="1.5"/>
    <line x1="3" y1="18" x2="11" y2="18"/>
    <line x1="7" y1="14" x2="7" y2="22"/>
  </svg>
);

const facilities = [
  {
    svg: <GymIcon />,
    title: 'Gymnasium',
    description: '3,000 sqft fully equipped gym with modern & traditional equipment/gears',
    included: true,
  },
  {
    svg: <ActivityIcon />,
    title: 'Activity Room',
    description: 'Indoor activity room available based on availability',
    included: false,
    note: 'As per availability',
  },
  {
    svg: <ChangingRoomIcon />,
    title: 'Changing Rooms',
    description: 'Male & Female changing rooms with lockers, showers, and steam room',
    included: true,
  },
  {
    svg: <CoffeeIcon />,
    title: 'Refreshments',
    description: 'Tea & Coffee with functional and comfortable seating area',
    included: false,
    note: 'Available on demand',
  },
  {
    svg: <ParkingIcon />,
    title: 'Dedicated Parking',
    description: '20–25 dedicated parking spots for member-driven vehicles',
    included: true,
  },
  {
    svg: <ToiletIcon />,
    title: 'Non-Member Facilities',
    description: 'Separate toilets & changing rooms for non-members and turf users',
    included: true,
  },
  {
    svg: <BadmintonIcon />,
    title: 'Badminton',
    description: '2 indoor courts — BWF Approved Yonex mat for professional play',
    included: false,
    note: '₹100 / hr per member',
  },
  {
    svg: <TennisIcon />,
    title: 'Tennis',
    description: '2 indoor courts — clay surface courts for an authentic game experience',
    included: false,
    note: '₹100 / hr per member',
  },
  {
    svg: <PickleballIcon />,
    title: 'Pickleball',
    description: '2 indoor courts — 9-layer professional coating for optimal performance',
    included: false,
    note: '₹100 / hr per member',
  },
];

const sportsRates = [
  {
    title: 'Futsal Turf',
    subtitle: '5,000 sqft – per hour (max 10 pax)',
    rate: '₹1,200',
    unit: 'per hour (max 10 pax)',
    color: 'blue',
  },
  {
    title: 'Big Turf (Cricket / Futsal – 8000 sqft)',
    subtitle: 'Cricket / Futsal – per hour (max 20 pax, min 2 hrs booking)',
    rate: '₹2,000',
    unit: 'per hour (max 20 pax, min 2 hrs booking)',
    color: 'purple',
  },
];

const Membership = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    sports: [],
    membershipType: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const sportsOptions = ['Badminton', 'Pickleball', 'Tennis', 'Futsal', 'Cricket / Big Turf', 'Gym', 'Multiple Sports'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSportsChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      sports: checked
        ? [...prev.sports, value]
        : prev.sports.filter((s) => s !== value),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Reset after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', sports: [], membershipType: '', message: '' });
    }, 4000);
  };

  return (
    <>
      {/* Banner */}
      <div className="inner-banner-section">
        <div className="image-area">
          <img src="/assets/images/bdcm2.jpg" alt="Membership Banner" />
        </div>
        <div className="container content-area">
          <h1>Membership</h1>
          <p>Join Uplift Sports Arena — Unlock World-Class Facilities</p>
        </div>
      </div>

      {/* Facilities Section */}
      <section className="section-padding bg-light">
        <div className="container">
          <div className="heading-part text-center mb-5">
            <h2>Membership Facilities</h2>
            <p className="text-muted">Everything included in your membership at Uplift Sports Arena</p>
          </div>
          <div className="row g-4">
            {facilities.map((f, index) => (
              <div key={index} className="col-sm-6 col-lg-4">
                <div className="card h-100 facility-card shadow-sm border-0">
                  <div className="card-body text-center p-4">
                    <div className="facility-icon mb-3">
                      {f.svg}
                    </div>
                    <h5 className="card-title fw-bold">{f.title}</h5>
                    <p className="card-text text-muted small">{f.description}</p>
                    {f.included ? (
                      <span className="badge px-3 py-2 mt-2" style={{background:'#AADF6D', color:'#08295E'}}>
                        <i className="fas fa-check me-1"></i> Complimentary
                      </span>
                    ) : (
                      <span className="badge px-3 py-2 mt-2" style={{background:'#08295E', color:'#fff'}}>
                        <i className="fas fa-info-circle me-1"></i> {f.note}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sports Pricing Section */}
      <section className="section-padding">
        <div className="container">
          <div className="heading-part text-center mb-5">
            <h2>Rates for Futsal &amp; Big Turf</h2>
            <p className="text-muted">Get access to our premium turf facilities</p>
          </div>
          <div className="row g-4 justify-content-center">
            {sportsRates.map((sport, index) => (
              <div key={index} className="col-sm-10 col-md-6 col-lg-5">
                <div className={`card h-100 membership-sport-card shadow border-0 sport-${sport.color}`}>
                  <div className="card-body p-4">
                    <div className="mb-3">
                      <h5 className="mb-1 fw-bold" style={{color:'#000'}}>{sport.title}</h5>
                      <small className="text-muted">{sport.subtitle}</small>
                    </div>
                    <hr className="my-3" />
                    <div className="text-center">
                      <div className="price-display">
                        <span className="display-6 fw-bold">{sport.rate}</span>
                      </div>
                      <p className="text-muted small mt-1 mb-0">{sport.unit}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coaching Coming Soon */}
      <section className="section-padding coaching-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card border-0 shadow coaching-coming-soon text-center p-5">
                <div className="mb-4">
                  <i className="fas fa-whistle fa-3x" style={{color:'#08295E'}}></i>
                </div>
                <h3 className="fw-bold mb-3" style={{color:'#08295E'}}>Coaching Programme</h3>
                <p className="text-muted mb-4">
                  Professional coaching sessions are coming soon for all sports at Uplift Sports Arena.
                </p>
                <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
                  {['Badminton', 'Tennis', 'Pickleball', 'Football'].map((sport) => (
                    <span key={sport} className="badge px-3 py-2 fs-6" style={{background:'#08295E', color:'#fff'}}>
                      {sport}
                    </span>
                  ))}
                </div>
                <span className="badge px-4 py-2 fs-6 mx-auto" style={{background:'#AADF6D', color:'#08295E'}}>
                  <i className="fas fa-clock me-2"></i>Coming Soon
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Membership Enquiry Form */}
      <section className="section-padding bg-light" id="membership-form">
        <div className="container">
          <div className="heading-part text-center mb-5">
            <h2>Membership Purchase Form</h2>
            <p className="text-muted">Fill in your details and we'll get back to you with membership plans</p>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card border-0 shadow-lg p-4 p-md-5">
                {submitted ? (
                  <div className="text-center py-5">
                    <i className="fas fa-check-circle fa-4x text-success mb-4"></i>
                    <h4 className="fw-bold text-success">Thank You!</h4>
                    <p className="text-muted">Your membership enquiry has been submitted. We'll contact you shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      {/* Full Name */}
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">
                          Full Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Enter your full name"
                          required
                        />
                      </div>

                      {/* Email */}
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">
                          Email Address <span className="text-danger">*</span>
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Enter your email address"
                          required
                        />
                      </div>

                      {/* Phone */}
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">
                          Phone Number <span className="text-danger">*</span>
                        </label>
                        <input
                          type="tel"
                          className="form-control"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Enter your phone number"
                          pattern="[0-9]{10}"
                          required
                        />
                      </div>

                      {/* Membership Type */}
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">
                          Membership Type <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select"
                          name="membershipType"
                          value={formData.membershipType}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select membership type</option>
                          <option value="individual">Individual</option>
                          <option value="family">Family</option>
                        </select>
                      </div>

                      {/* Sports Interested In */}
                      <div className="col-12">
                        <label className="form-label fw-semibold">Sports / Facilities Interested In</label>
                        <div className="row g-2 mt-1">
                          {sportsOptions.map((sport) => (
                            <div key={sport} className="col-sm-6 col-md-4">
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id={`sport-${sport}`}
                                  value={sport}
                                  checked={formData.sports.includes(sport)}
                                  onChange={handleSportsChange}
                                />
                                <label className="form-check-label" htmlFor={`sport-${sport}`}>
                                  {sport}
                                </label>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Message */}
                      <div className="col-12">
                        <label className="form-label fw-semibold">Additional Message</label>
                        <textarea
                          className="form-control"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          rows={4}
                          placeholder="Any specific requirements or questions about membership..."
                        ></textarea>
                      </div>

                      {/* Submit */}
                      <div className="col-12 text-center mt-2">
                        <button
                          type="submit"
                          style={{
                            background: '#AADF6D',
                            backgroundImage: 'none',
                            border: '2px solid #AADF6D',
                            color: '#08295E',
                            borderRadius: '10px',
                            fontWeight: '700',
                            fontSize: '16px',
                            letterSpacing: '0.5px',
                            padding: '14px 48px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = '#08295E'; e.currentTarget.style.borderColor = '#08295E'; e.currentTarget.style.color = '#AADF6D'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = '#AADF6D'; e.currentTarget.style.borderColor = '#AADF6D'; e.currentTarget.style.color = '#08295E'; }}
                        >
                          <i className="fas fa-arrow-right me-2"></i>Purchase Membership
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Membership;
