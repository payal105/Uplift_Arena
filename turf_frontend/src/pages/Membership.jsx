import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axios';

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
        included: true,
        note: 'Complimentary',
  },
  {
    svg: <TennisIcon />,
    title: 'Tennis',
    description: '2 indoor courts — clay surface courts for an authentic game experience',
    included: true,
    note: 'Complimentary',
  },
  {
    svg: <PickleballIcon />,
    title: 'Pickleball',
    description: '2 indoor courts — 9-layer professional coating for optimal performance',
    included: true,
    note: 'Complimentary',
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
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    membershipType: '',
    activityChoice: '',
    message: '',
  });
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const membershipPlans = [
    { value: 'annual-individual-club', label: 'Annual Individual Club Membership', price: '₹30,000', allActivity: true, note: null },
    { value: 'annual-family-club', label: 'Annual Family Club Membership', price: '₹50,000', allActivity: true, note: 'Couple + upto 3 Kids below 12 years' },
    { value: 'annual-individual-activity', label: 'Annual Individual Activity Membership', price: '₹18,000', allActivity: false, note: null },
    { value: 'monthly-individual-activity', label: 'Monthly Individual Activity Membership', price: '₹3,000', allActivity: false, note: null },
  ];

  const activityOptions = ['Gym', 'Badminton', 'Tennis', 'Pickleball'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'membershipType') {
      const plan = membershipPlans.find(p => p.value === value);
      setFormData((prev) => ({ ...prev, membershipType: value, activityChoice: plan?.allActivity ? '' : prev.activityChoice }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingPayment, setPendingPayment] = useState(null); // { pricing, payuParams }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    // Manual validation
    if (!formData.name.trim()) {
      setSubmitError('Full name is required.');
      return;
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setSubmitError('A valid email address is required.');
      return;
    }
    if (!formData.phone.trim() || !/^[0-9]{10}$/.test(formData.phone.trim())) {
      setSubmitError('A valid 10-digit phone number is required.');
      return;
    }
    if (!formData.membershipType) {
      setSubmitError('Please select a membership type.');
      return;
    }
    const activityRequiredPlans = ['annual-individual-activity', 'monthly-individual-activity'];
    if (activityRequiredPlans.includes(formData.membershipType) && !formData.activityChoice) {
      setSubmitError('Please choose an activity for your membership.');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('userToken');
      if (!token || token === 'null' || token === 'undefined') {
        setSubmitError('You must be logged in to purchase a membership.');
        setSubmitting(false);
        return;
      }

      const res = await api.post(
        '/api/payments/payu/initiate-membership',
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          membershipType: formData.membershipType,
          activityChoice: formData.activityChoice || undefined,
          message: formData.message,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { pricing, payuParams } = res.data;

      // Show confirmation modal with GST breakdown
      setPendingPayment({ pricing, payuParams });
      setShowConfirmModal(true);
      setSubmitting(false);
    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.message || '';
      if (status === 401) {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userInfo');
        window.dispatchEvent(new Event('userAuthChanged'));
        navigate('/login', { state: { from: '/membership', message: msg || 'Your session has expired. Please log in again.' } });
        return;
      }
      setSubmitError(msg || 'Failed to initiate payment. Please try again.');
      setSubmitting(false);
    }
  };

  const handleConfirmPayment = () => {
    if (!pendingPayment) return;
    const { payuParams } = pendingPayment;

    // Build and submit form to PayU (browser redirect)
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = payuParams.payuUrl;
    Object.entries(payuParams).forEach(([key, value]) => {
      if (key === 'payuUrl') return;
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value ?? '';
      form.appendChild(input);
    });
    document.body.appendChild(form);
    setSubmitting(true);
    form.submit();
  };

  const handleCancelPayment = () => {
    setShowConfirmModal(false);
    setPendingPayment(null);
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
            <h2>Rates</h2>
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

          {/* Indoor Courts */}
          <div className="row g-4 justify-content-center mt-0">
            {[
              { title: 'Badminton', subtitle: 'per hour (max 4 pax)', color: 'blue' },
              { title: 'Pickleball', subtitle: 'per hour (max 4 pax)', color: 'green' },
              { title: 'Tennis', subtitle: 'per hour (max 4 pax)', color: 'purple' },
            ].map((sport, index) => (
              <div key={index} className="col-sm-10 col-md-6 col-lg-3">
                <div className={`card h-100 membership-sport-card shadow border-0 sport-${sport.color}`}>
                  <div className="card-body p-4">
                    <div className="mb-3">
                      <h5 className="mb-1 fw-bold" style={{color:'#000'}}>{sport.title}</h5>
                    </div>
                    <hr className="my-3" />
                    <div className="text-center">
                      <div className="price-display">
                        <span className="display-6 fw-bold">₹1,200</span>
                      </div>
                      <p className="text-muted small mt-1 mb-0">{sport.subtitle}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coaching Schedule */}
      <section className="section-padding coaching-section">
        <div className="container">
          <div className="heading-part text-center mb-4">
            <div className="mb-3">
              <i className="fas fa-whistle fa-3x" style={{color:'#08295E'}}></i>
            </div>
            <h2 className="fw-bold" style={{color:'#08295E'}}>Coaching Programme</h2>
            <p className="text-muted">Professional coaching sessions at Uplift Sports Arena</p>
          </div>

          {/* Registration Note */}
          <div className="row justify-content-center mb-4">
            <div className="col-lg-10">
              <div className="p-3 rounded-3" style={{background:'#f0f8e8', border:'1.5px solid #AADF6D'}}>
                <p className="mb-1 fw-semibold small">
                  <i className="fas fa-info-circle me-2" style={{color:'#08295E'}}></i>
                  Registration Charges: <strong>₹6,000/- per annum per trainee</strong>
                </p>
                <p className="mb-0 text-muted small">
                  <i className="fas fa-check-circle me-1" style={{color:'#AADF6D'}}></i>
                  No registration charges for Members / Member's children under 15 years
                </p>
              </div>
            </div>
          </div>

          <div className="row justify-content-center g-4">

            {/* 1. Junior Coaching */}
            <div className="col-lg-10">
              <div className="card border-0 shadow-sm overflow-hidden">
                <div className="card-header py-3 px-4" style={{background:'#08295E'}}>
                  <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <h6 className="mb-0 text-white fw-bold">
                      <i className="fas fa-child me-2"></i>1. Junior Coaching
                    </h6>
                    <div className="d-flex gap-2 flex-wrap">
                      <span className="badge px-3 py-2" style={{background:'#AADF6D', color:'#08295E'}}>60 mins / session</span>
                      <span className="badge px-3 py-2" style={{background:'rgba(255,255,255,0.15)', color:'#fff'}}>Fee per quarter</span>
                    </div>
                  </div>
                </div>
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead style={{background:'#f4f7fb'}}>
                      <tr>
                        <th className="ps-4">Frequency</th>
                        <th>Days</th>
                        <th>Timing</th>
                        <th className="text-center">Tennis</th>
                        <th className="text-center">Pickleball</th>
                        <th className="text-center">Football</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="ps-4"><span className="badge px-3 py-2" style={{background:'#08295E', color:'#fff'}}>2 days/week</span></td>
                        <td className="small text-muted">Tues/Thurs or Wed/Fri</td>
                        <td className="small text-muted">3:30pm–4:30pm / 4:30pm–5:30pm</td>
                        <td className="text-center fw-bold" style={{color:'#08295E'}}>₹8,000</td>
                        <td className="text-center fw-bold" style={{color:'#08295E'}}>₹6,000</td>
                        <td className="text-center fw-bold" style={{color:'#08295E'}}>₹6,000</td>
                      </tr>
                      <tr>
                        <td className="ps-4"><span className="badge px-3 py-2" style={{background:'#08295E', color:'#fff'}}>3 days/week</span></td>
                        <td className="small text-muted">Tues/Thurs/Sat or Wed/Fri/Sun</td>
                        <td className="small text-muted">3:30pm–4:30pm / 4:30pm–5:30pm</td>
                        <td className="text-center fw-bold" style={{color:'#08295E'}}>₹10,500</td>
                        <td className="text-center fw-bold" style={{color:'#08295E'}}>₹8,000</td>
                        <td className="text-center fw-bold" style={{color:'#08295E'}}>₹8,000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* 2. Adult Coaching */}
            <div className="col-lg-10">
              <div className="card border-0 shadow-sm overflow-hidden">
                <div className="card-header py-3 px-4" style={{background:'#08295E'}}>
                  <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <h6 className="mb-0 text-white fw-bold">
                      <i className="fas fa-user me-2"></i>2. Adult Coaching
                      <small className="fw-normal ms-2 opacity-75">(Members only)</small>
                    </h6>
                    <div className="d-flex gap-2 flex-wrap">
                      <span className="badge px-3 py-2" style={{background:'#AADF6D', color:'#08295E'}}>6am–10am / 6pm–9pm</span>
                      <span className="badge px-3 py-2" style={{background:'rgba(255,255,255,0.15)', color:'#fff'}}>Fee per month</span>
                    </div>
                  </div>
                </div>
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead style={{background:'#f4f7fb'}}>
                      <tr>
                        <th className="ps-4">Frequency</th>
                        <th>Days</th>
                        <th className="text-center">Tennis</th>
                        <th className="text-center">Pickleball</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="ps-4"><span className="badge px-3 py-2" style={{background:'#08295E', color:'#fff'}}>2 days/week</span></td>
                        <td className="text-muted">Any 2 days a week</td>
                        <td className="text-center fw-bold" style={{color:'#08295E'}}>₹3,000</td>
                        <td className="text-center fw-bold" style={{color:'#08295E'}}>₹3,000</td>
                      </tr>
                      <tr>
                        <td className="ps-4"><span className="badge px-3 py-2" style={{background:'#08295E', color:'#fff'}}>3 days/week</span></td>
                        <td className="text-muted">Any 3 days a week</td>
                        <td className="text-center fw-bold" style={{color:'#08295E'}}>₹4,000</td>
                        <td className="text-center fw-bold" style={{color:'#08295E'}}>₹4,000</td>
                      </tr>
                      <tr>
                        <td className="ps-4"><span className="badge px-3 py-2" style={{background:'#08295E', color:'#fff'}}>4 days/week</span></td>
                        <td className="text-muted">Any 4 days a week</td>
                        <td className="text-center fw-bold" style={{color:'#08295E'}}>₹5,000</td>
                        <td className="text-center fw-bold" style={{color:'#08295E'}}>₹5,000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* 3. Weekend Coaching + 4. Family Coaching side by side */}
            <div className="col-lg-5">
              <div className="card border-0 shadow-sm overflow-hidden h-100">
                <div className="card-header py-3 px-4" style={{background:'#08295E'}}>
                  <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <h6 className="mb-0 text-white fw-bold">
                      <i className="fas fa-calendar-week me-2"></i>3. Weekend Coaching
                      <small className="fw-normal ms-2 opacity-75">(Juniors only)</small>
                    </h6>
                    <span className="badge px-3 py-2" style={{background:'rgba(255,255,255,0.15)', color:'#fff'}}>Fee per month</span>
                  </div>
                </div>
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead style={{background:'#f4f7fb'}}>
                      <tr>
                        <th className="ps-4">Days</th>
                        <th>Timing</th>
                        <th className="text-center">Tennis</th>
                        <th className="text-center">Pickleball</th>
                        <th className="text-center">Football</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="ps-4">
                          <span className="badge px-3 py-2" style={{background:'#08295E', color:'#fff'}}>Sat &amp; Sun</span>
                          <div className="small text-muted mt-1">2 days/week</div>
                        </td>
                        <td className="small text-muted">10am–12 noon / 3pm–5pm</td>
                        <td className="text-center fw-bold" style={{color:'#08295E'}}>₹6,000</td>
                        <td className="text-center fw-bold" style={{color:'#08295E'}}>₹5,000</td>
                        <td className="text-center fw-bold" style={{color:'#08295E'}}>₹5,000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="card border-0 shadow-sm overflow-hidden h-100">
                <div className="card-header py-3 px-4" style={{background:'#08295E'}}>
                  <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <h6 className="mb-0 text-white fw-bold">
                      <i className="fas fa-users me-2"></i>4. Pickleball Family Coaching
                      <small className="fw-normal ms-2 opacity-75">(upto 5 members)</small>
                    </h6>
                    <span className="badge px-3 py-2" style={{background:'rgba(255,255,255,0.15)', color:'#fff'}}>Fee per month</span>
                  </div>
                </div>
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead style={{background:'#f4f7fb'}}>
                      <tr>
                        <th className="ps-4">Days</th>
                        <th>Timing</th>
                        <th className="text-center">Pickleball</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="ps-4">
                          <span className="badge px-3 py-2" style={{background:'#08295E', color:'#fff'}}>Sat &amp; Sun</span>
                          <div className="small text-muted mt-1">2 days/week</div>
                        </td>
                        <td className="small text-muted">10am–11am / 11am–12pm / 3pm–4pm / 4pm–5pm</td>
                        <td className="text-center fw-bold" style={{color:'#08295E'}}>₹5,000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>

          {/* Purchase Coaching CTA */}
          <div className="text-center mt-5">
            <a
              href="#membership-form"
              style={{
                display: 'inline-block',
                background: '#AADF6D',
                border: '2px solid #AADF6D',
                color: '#08295E',
                borderRadius: '10px',
                fontWeight: '700',
                fontSize: '16px',
                letterSpacing: '0.5px',
                padding: '14px 48px',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#08295E'; e.currentTarget.style.borderColor = '#08295E'; e.currentTarget.style.color = '#AADF6D'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#AADF6D'; e.currentTarget.style.borderColor = '#AADF6D'; e.currentTarget.style.color = '#08295E'; }}
            >
              <i className="fas fa-arrow-right me-2"></i>Purchase Coaching
            </a>
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
                  <form onSubmit={handleSubmit} noValidate>
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
                          placeholder="Enter your 10-digit phone number"
                        />
                      </div>

                      {/* Membership Type */}
                      <div className="col-12">
                        <label className="form-label fw-semibold">
                          Membership Type <span className="text-danger">*</span>
                        </label>
                        <div className="row g-3 mt-1">
                          {membershipPlans.map((plan) => (
                            <div key={plan.value} className="col-md-6 d-flex">
                              <label
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  justifyContent: 'space-between',
                                  width: '100%',
                                  padding: '14px 16px',
                                  borderRadius: '10px',
                                  border: `2px solid ${formData.membershipType === plan.value ? '#08295E' : '#dee2e6'}`,
                                  cursor: 'pointer',
                                  background: formData.membershipType === plan.value ? '#f0f4fa' : '#fff',
                                  transition: 'all 0.2s ease',
                                }}
                              >
                                <input
                                  type="radio"
                                  name="membershipType"
                                  value={plan.value}
                                  checked={formData.membershipType === plan.value}
                                  onChange={handleChange}
                                  style={{ display: 'none' }}
                                />
                                <div className="d-flex justify-content-between align-items-start">
                                  <div className="flex-grow-1 me-2">
                                    <div className="fw-bold" style={{ color: '#08295E', fontSize: '13.5px' }}>{plan.label}</div>
                                    {plan.note && <div className="text-muted mt-1" style={{ fontSize: '11.5px' }}>{plan.note}</div>}
                                  </div>
                                  <div className="fw-bold" style={{ color: '#08295E', fontSize: '15px', whiteSpace: 'nowrap' }}>{plan.price}</div>
                                </div>
                                <div className="mt-2">
                                  {plan.allActivity && (
                                    <span className="badge px-2 py-1" style={{ background: '#AADF6D', color: '#08295E', fontSize: '11px' }}>
                                      <i className="fas fa-check me-1"></i>ALL ACTIVITY INCLUDED
                                    </span>
                                  )}
                                </div>
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Activity Choice */}
                      {(formData.membershipType === 'annual-individual-activity' || formData.membershipType === 'monthly-individual-activity') && (
                        <div className="col-12">
                          <label className="form-label fw-semibold">
                            Choose Activity <span className="text-danger">*</span>
                          </label>
                          <div className="row g-2 mt-1">
                            {activityOptions.map((activity) => (
                              <div key={activity} className="col-6 col-md-3">
                                <label
                                  style={{
                                    display: 'block',
                                    padding: '12px',
                                    textAlign: 'center',
                                    borderRadius: '10px',
                                    border: `2px solid ${formData.activityChoice === activity ? '#08295E' : '#dee2e6'}`,
                                    cursor: 'pointer',
                                    background: formData.activityChoice === activity ? '#08295E' : '#fff',
                                    color: formData.activityChoice === activity ? '#fff' : '#333',
                                    transition: 'all 0.2s ease',
                                  }}
                                >
                                  <input
                                    type="radio"
                                    name="activityChoice"
                                    value={activity}
                                    checked={formData.activityChoice === activity}
                                    onChange={handleChange}
                                    style={{ display: 'none' }}
                                  />
                                  <div className="fw-semibold small">{activity}</div>
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

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

                      {/* Error message */}
                      {submitError && (
                        <div className="col-12">
                          <div className="alert alert-danger py-2 mb-0" role="alert">
                            <i className="fas fa-exclamation-circle me-2"></i>{submitError}
                          </div>
                        </div>
                      )}

                      {/* Submit */}
                      <div className="col-12 text-center mt-2">
                        <button
                          type="submit"
                          disabled={submitting}
                          style={{
                            background: submitting ? '#ccc' : '#AADF6D',
                            backgroundImage: 'none',
                            border: `2px solid ${submitting ? '#ccc' : '#AADF6D'}`,
                            color: '#08295E',
                            borderRadius: '10px',
                            fontWeight: '700',
                            fontSize: '16px',
                            letterSpacing: '0.5px',
                            padding: '14px 48px',
                            cursor: submitting ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s ease',
                          }}
                          onMouseEnter={e => { if (!submitting) { e.currentTarget.style.background = '#08295E'; e.currentTarget.style.borderColor = '#08295E'; e.currentTarget.style.color = '#AADF6D'; }}}
                          onMouseLeave={e => { if (!submitting) { e.currentTarget.style.background = '#AADF6D'; e.currentTarget.style.borderColor = '#AADF6D'; e.currentTarget.style.color = '#08295E'; }}}
                        >
                          {submitting
                            ? <><i className="fas fa-spinner fa-spin me-2"></i>Redirecting to Payment...</>
                            : <><i className="fas fa-arrow-right me-2"></i>Purchase Membership</>
                          }
                        </button>
                      </div>
                    </div>
                  </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GST Confirmation Modal */}
      {showConfirmModal && pendingPayment && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
          }}
          onClick={handleCancelPayment}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: '16px',
              maxWidth: '440px',
              width: '100%',
              padding: '32px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              animation: 'fadeInUp 0.3s ease',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-4">
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: '#f0f4fa',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '12px',
                }}
              >
                <i className="fas fa-receipt fa-lg" style={{ color: '#08295E' }}></i>
              </div>
              <h5 className="fw-bold mb-1" style={{ color: '#08295E' }}>Payment Summary</h5>
              <p className="text-muted small mb-0">Review the pricing details before proceeding</p>
            </div>

            <div
              style={{
                background: '#f8f9fb',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '24px',
              }}
            >
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted">Membership Price</span>
                <span className="fw-semibold">₹{pendingPayment.pricing.basePrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted">GST ({pendingPayment.pricing.gstRate}%)</span>
                <span className="fw-semibold">₹{pendingPayment.pricing.gstAmount.toLocaleString('en-IN')}</span>
              </div>
              <hr style={{ margin: '12px 0', borderColor: '#dee2e6' }} />
              <div className="d-flex justify-content-between align-items-center">
                <span className="fw-bold" style={{ color: '#08295E', fontSize: '16px' }}>Total Payable</span>
                <span className="fw-bold" style={{ color: '#08295E', fontSize: '20px' }}>
                  ₹{pendingPayment.pricing.totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="d-flex gap-3">
              <button
                onClick={handleCancelPayment}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '10px',
                  border: '2px solid #dee2e6',
                  background: '#fff',
                  color: '#666',
                  fontWeight: '600',
                  fontSize: '15px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPayment}
                disabled={submitting}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '10px',
                  border: '2px solid #AADF6D',
                  background: submitting ? '#ccc' : '#AADF6D',
                  color: '#08295E',
                  fontWeight: '700',
                  fontSize: '15px',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {submitting
                  ? <><i className="fas fa-spinner fa-spin me-2"></i>Redirecting...</>
                  : <><i className="fas fa-lock me-2"></i>Pay Now</>
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Membership;
