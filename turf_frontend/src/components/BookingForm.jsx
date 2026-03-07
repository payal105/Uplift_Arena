import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const FIXED_SLOTS = [
  { label: '6:00 - 7:00 AM',   startTime: '06:00', endTime: '07:00' },
  { label: '7:00 - 8:00 AM',   startTime: '07:00', endTime: '08:00' },
  { label: '8:00 - 9:00 AM',   startTime: '08:00', endTime: '09:00' },
  { label: '9:00 - 10:00 AM',  startTime: '09:00', endTime: '10:00' },
  { label: '5:30 - 6:30 PM',   startTime: '17:30', endTime: '18:30' },
  { label: '6:30 - 7:30 PM',   startTime: '18:30', endTime: '19:30' },
  { label: '7:30 - 8:30 PM',   startTime: '19:30', endTime: '20:30' },
  { label: '8:30 - 9:30 PM',   startTime: '20:30', endTime: '21:30' },
];

const STADIUM_SVG = (
  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round">
    {/* Outer boundary */}
    <rect x="4" y="8" width="56" height="48" rx="2"/>
    {/* Center line */}
    <line x1="32" y1="8" x2="32" y2="56"/>
    {/* Center circle */}
    <circle cx="32" cy="32" r="8"/>
    {/* Center spot */}
    <circle cx="32" cy="32" r="1.5" fill="currentColor" stroke="none"/>
    {/* Left penalty box */}
    <rect x="4" y="20" width="14" height="24"/>
    {/* Right penalty box */}
    <rect x="46" y="20" width="14" height="24"/>
    {/* Left goal */}
    <rect x="4" y="26" width="5" height="12"/>
    {/* Right goal */}
    <rect x="55" y="26" width="5" height="12"/>
  </svg>
);

const BookingForm = () => {
  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Compute toDate: if toTime <= fromTime, booking crosses midnight → next day
  const computeToDate = (date, fromTime, toTime) => {
    if (!date || !fromTime || !toTime) return date || '';
    if (toTime <= fromTime) {
      const [y, m, d] = date.split('-').map(Number);
      const nextDay = new Date(y, m - 1, d + 1);
      return `${nextDay.getFullYear()}-${String(nextDay.getMonth() + 1).padStart(2, '0')}-${String(nextDay.getDate()).padStart(2, '0')}`;
    }
    return date;
  };

  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('userToken'));

  useEffect(() => {
    const syncAuth = () => setIsLoggedIn(!!localStorage.getItem('userToken'));
    window.addEventListener('userAuthChanged', syncAuth);
    window.addEventListener('storage', syncAuth);
    return () => {
      window.removeEventListener('userAuthChanged', syncAuth);
      window.removeEventListener('storage', syncAuth);
    };
  }, []);

  const [activeGame, setActiveGame] = useState('CRICKET');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [formData, setFormData] = useState({
    date: getTodayDate(),
    turfId: '',
    selectedSlots: [],
    bringGuests: false,
    guestCount: ''
  });

  const games = [
    { id: 'CRICKET',    name: 'Cricket',    icon: '/assets/images/g2.png' },
    { id: 'FUTSAL',     name: 'Futsal',     icon: '/assets/images/g1.png' },
    { id: 'BIG_TURF',  name: 'Big Turf',   icon: null, svg: STADIUM_SVG },
    { id: 'PICKLEBALL',name: 'Pickleball', icon: '/assets/images/g3.png' },
    { id: 'BADMINTON', name: 'Badminton',  icon: '/assets/images/g5.png' },
    { id: 'TENNIS',    name: 'Tennis',     icon: '/assets/images/g6.png' }
  ];

  const turfOptionsByGame = {
    CRICKET:    [{ value: 'futsal-turf', label: 'Futsal Turf' }],
    FUTSAL:     [{ value: 'futsal-turf', label: 'Futsal Turf' }],
    BIG_TURF:   [{ value: 'big-turf',   label: 'Big Turf' }],
    PICKLEBALL: [{ value: 'pickleball-court2', label: 'Pickleball (Court 2)' }, { value: 'pickleball-court3', label: 'Pickleball (Court 3)' }],
    BADMINTON:  [{ value: 'badminton-court1', label: 'Badminton (Court 1)' }, { value: 'badminton-court4', label: 'Badminton (Court 4)' }],
    TENNIS:     [{ value: 'tennis-court1', label: 'Tennis (Court 1)' }, { value: 'tennis-court2', label: 'Tennis (Court 2)' }],
  };

  // Reset turf selection when game changes
  useEffect(() => {
    const options = turfOptionsByGame[activeGame] || [];
    // Auto-select if only one option
    const autoTurf = options.length === 1 ? options[0].value : '';
    setFormData(prev => ({ ...prev, turfId: autoTurf, selectedSlots: [] }));
  }, [activeGame]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.selectedSlots.length === 0) {
      setBookingError('Please select at least one time slot');
      return;
    }
    // Big Turf: total duration across all selected slots must be >= 2 hours
    if (formData.turfId === 'big-turf') {
      const totalMins = formData.selectedSlots.reduce((sum, startTime) => {
        const slot = FIXED_SLOTS.find(s => s.startTime === startTime);
        const [fH, fM] = slot.startTime.split(':').map(Number);
        const [tH, tM] = slot.endTime.split(':').map(Number);
        let diff = (tH * 60 + tM) - (fH * 60 + fM);
        if (diff <= 0) diff += 24 * 60;
        return sum + diff;
      }, 0);
      if (totalMins < 120) {
        setBookingError('Big Turf requires a minimum booking of 2 hours');
        return;
      }
    }
    setBookingLoading(true);
    setBookingError('');
    setBookingSuccess('');
    try {
      // Build full slot objects { startTime, endTime } for each selected slot
      const slotObjects = formData.selectedSlots
        .slice()
        .sort()
        .map(startTime => {
          const slot = FIXED_SLOTS.find(s => s.startTime === startTime);
          return { startTime: slot.startTime, endTime: slot.endTime };
        });

      const response = await api.post('/api/form-bookings', {
        sport: activeGame,
        turfId: formData.turfId,
        bookingDate: formData.date,
        slots: slotObjects,
        bringGuests: formData.bringGuests,
        guestCount: formData.guestCount
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
      });
      setBookingSuccess('Booking confirmed successfully!');
      setFormData(prev => ({ ...prev, turfId: '', selectedSlots: [], bringGuests: false, guestCount: '' }));
    } catch (err) {
      setBookingError(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <section className="book-court-section section-padding" id="booking">
      <div className="container">
        <div className="heading-part text-center">
          <h2>Book Your Court</h2>
          <p>Select your preferred game, date, and time slot to book your court</p>
        </div>

        <div className="court-form-area">
          <div className="nav-area">
            <h3>Choose Your Game</h3>
            <div className="row g-3">
              {games.map((game) => (
                <div className="col-4" key={game.id}>
                  <button
                    type="button"
                    onClick={() => setActiveGame(game.id)}
                    style={{
                      width: '100%',
                      minHeight: '110px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      borderRadius: '8px',
                      padding: '20px',
                      background: activeGame === game.id ? '#08295E' : '#AADF6D',
                      boxShadow: '4px 4px 0px 2px #08295E',
                      border: '0',
                      fontSize: '16px',
                      fontWeight: '600',
                      color: activeGame === game.id ? '#fff' : '#08295E',
                      cursor: 'pointer'
                    }}
                  >
                    {game.svg
                      ? <span style={{ display: 'flex', color: activeGame === game.id ? '#fff' : '#08295E' }}>{game.svg}</span>
                      : <img src={game.icon} alt={game.name} style={{ filter: activeGame === game.id ? 'brightness(0) invert(1)' : 'none' }} />
                    }
                    {game.name}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="tab-content">
              <div className="tab-pane active" role="tabpanel">
                <div className="booking-form-area">
                  <div className="row gx-5 gy-4">
                    <div className="col-lg">
                      <div className="form-group">
                        <label htmlFor="b_date" className="form-label">
                          Date
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          id="b_date"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-group">
                        <label className="form-label">Select Time Slot(s)</label>
                        <div className="d-flex flex-nowrap gap-2 mt-2" style={{ overflowX: 'auto', paddingBottom: '4px' }}>
                          {FIXED_SLOTS.map((slot) => {
                            const isSelected = formData.selectedSlots.includes(slot.startTime);
                            return (
                              <button
                                key={slot.label}
                                type="button"
                                className="btn btn-sm"
                                style={{
                                  borderRadius: '20px',
                                  whiteSpace: 'nowrap',
                                  fontSize: '0.78rem',
                                  padding: '4px 12px',
                                  flexShrink: 0,
                                  fontWeight: isSelected ? '600' : '400',
                                  backgroundColor: isSelected ? '#A6CE39' : 'transparent',
                                  color: '#08295E',
                                  border: '1.5px solid #08295E',
                                  outline: 'none',
                                  boxShadow: 'none'
                                }}
                                onClick={() => {
                                  const already = formData.selectedSlots.includes(slot.startTime);
                                  setFormData({
                                    ...formData,
                                    selectedSlots: already
                                      ? formData.selectedSlots.filter(s => s !== slot.startTime)
                                      : [...formData.selectedSlots, slot.startTime]
                                  });
                                }}
                              >
                                {slot.label}
                              </button>
                            );
                          })}
                        </div>
                        {formData.selectedSlots.length === 0 && (
                          <div className="text-muted small mt-1">Please select one or more time slots above</div>
                        )}
                        {formData.selectedSlots.length > 0 && (
                          <div className="text-success small mt-1 fw-semibold">
                            Selected ({formData.selectedSlots.length}): {formData.selectedSlots.slice().sort().map(s => FIXED_SLOTS.find(f => f.startTime === s)?.label).join(', ')}
                          </div>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'none' }}>
                      <input
                        type="date"
                        id="b_todate"
                        value={(() => {
                          if (formData.selectedSlots.length === 0) return formData.date;
                          const sorted = [...formData.selectedSlots].sort();
                          const last = FIXED_SLOTS.find(s => s.startTime === sorted[sorted.length - 1]);
                          return computeToDate(formData.date, sorted[0], last?.endTime || sorted[0]);
                        })()}
                        readOnly
                      />
                    </div>
                    <div className="col-lg">
                      <div className="form-group">
                        <label htmlFor="b_turf" className="form-label">
                          Select Turf
                        </label>
                        <select
                          className="form-select form-control"
                          value={formData.turfId}
                          onChange={(e) => setFormData({ ...formData, turfId: e.target.value })}
                          required
                        >
                          <option value="">Select Turf</option>
                          {(turfOptionsByGame[activeGame] || []).map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="bringGuests"
                        checked={formData.bringGuests}
                        onChange={(e) => setFormData({ ...formData, bringGuests: e.target.checked, guestCount: e.target.checked ? 1 : '' })}
                      />
                      <label className="form-check-label" htmlFor="bringGuests">
                        Do you want to bring guests?
                      </label>
                    </div>
                    {formData.bringGuests && (
                      <div className="d-flex gap-3 mt-3 align-items-end flex-wrap">
                        <div className="form-group" style={{ maxWidth: '180px' }}>
                          <label htmlFor="guestCount" className="form-label">Number of Guests</label>
                          <input
                            type="number"
                            className="form-control"
                            id="guestCount"
                            min="1"
                            value={formData.guestCount}
                            onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                            placeholder="e.g. 5"
                            required
                          />
                        </div>
                        <div className="form-group" style={{ maxWidth: '180px' }}>
                          <label className="form-label">Guest Charges</label>
                          <input
                            type="text"
                            className="form-control"
                            value={formData.guestCount > 0 ? `₹${formData.guestCount * 500}` : '₹0'}
                            disabled
                          />
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            </div>

            <div className="w-100 text-center mt-5">
              {bookingSuccess && <div className="alert alert-success mb-3">{bookingSuccess}</div>}
              {bookingError && <div className="alert alert-danger mb-3">{bookingError}</div>}
              <span
                title={!isLoggedIn ? 'Please login to access' : ''}
                style={{ display: 'inline-block', cursor: !isLoggedIn ? 'not-allowed' : 'default' }}
              >
                <button
                  type="submit"
                  className="btn btn-secondary"
                  disabled={!isLoggedIn || bookingLoading}
                  style={{ pointerEvents: !isLoggedIn ? 'none' : 'auto' }}
                >
                  {bookingLoading ? 'Booking...' : 'Book Now'}
                </button>
              </span>
            </div>
          </form>
        </div>
      </div>

    </section>
  );
};

export default BookingForm;
