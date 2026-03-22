import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
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

  // Returns an error string if Big Turf slot selection is invalid, otherwise null
  const getBigTurfSlotError = (turfId, selectedSlots) => {
    if (turfId !== 'big-turf' || selectedSlots.length === 0) return null;
    const sorted = [...selectedSlots].sort();
    // Check continuity: each slot's endTime must equal the next slot's startTime
    for (let i = 0; i < sorted.length - 1; i++) {
      const current = FIXED_SLOTS.find(s => s.startTime === sorted[i]);
      const next = FIXED_SLOTS.find(s => s.startTime === sorted[i + 1]);
      if (!current || !next || current.endTime !== next.startTime) {
        return 'Big Turf requires a continuous booking of minimum 2 hours (no gaps between slots).';
      }
    }
    // Check minimum 2 hours
    const totalMins = sorted.reduce((sum, startTime) => {
      const slot = FIXED_SLOTS.find(s => s.startTime === startTime);
      const [fH, fM] = slot.startTime.split(':').map(Number);
      const [tH, tM] = slot.endTime.split(':').map(Number);
      let diff = (tH * 60 + tM) - (fH * 60 + fM);
      if (diff <= 0) diff += 24 * 60;
      return sum + diff;
    }, 0);
    if (totalMins < 120) {
      return 'Big Turf requires a continuous booking of minimum 2 hours.';
    }
    return null;
  };

  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('userToken'));
  const [memberInfo, setMemberInfo] = useState({ isMember: 0, activityChoice: null });

  // Maps membership activityChoice text → booking game ID
  const activityToGameId = {
    'Badminton':  'BADMINTON',
    'Tennis':     'TENNIS',
    'Pickleball': 'PICKLEBALL',
  };

  useEffect(() => {
    const syncAuth = () => setIsLoggedIn(!!localStorage.getItem('userToken'));
    window.addEventListener('userAuthChanged', syncAuth);
    window.addEventListener('storage', syncAuth);
    return () => {
      window.removeEventListener('userAuthChanged', syncAuth);
      window.removeEventListener('storage', syncAuth);
    };
  }, []);

  // Fetch isMember + activityChoice whenever login state changes
  useEffect(() => {
    const fetchMemberInfo = async () => {
      const token = localStorage.getItem('userToken');
      if (!token) {
        setMemberInfo({ isMember: 0, activityChoice: null });
        return;
      }
      try {
        const profileRes = await api.get('/api/user_data/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const isMember = profileRes.data.user?.isMember ?? 0;
        if (isMember === 1) {
          const membershipRes = await api.get('/api/memberships/my', {
            headers: { Authorization: `Bearer ${token}` }
          });
          const activeMembership = membershipRes.data.memberships?.find(m => m.isActive === 1);
          setMemberInfo({ isMember: 1, activityChoice: activeMembership?.activityChoice ?? null });
        } else {
          setMemberInfo({ isMember: 0, activityChoice: null });
        }
      } catch {
        setMemberInfo({ isMember: 0, activityChoice: null });
      }
    };
    fetchMemberInfo();
  }, [isLoggedIn]);

  const [activeGame, setActiveGame] = useState('CRICKET');
  const formSectionRef = useRef(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  // When a member has a specific activity, auto-select that game
  useEffect(() => {
    if (memberInfo.isMember === 1 && memberInfo.activityChoice) {
      const allowed = activityToGameId[memberInfo.activityChoice];
      if (allowed) setActiveGame(allowed);
    }
  }, [memberInfo]);

  // Returns true if game should be disabled based on membership
  const isGameDisabled = (gameId) => {
    if (memberInfo.isMember !== 1) return false;
    if (!memberInfo.activityChoice) return false; // all-activities plan
    const allowed = activityToGameId[memberInfo.activityChoice];
    return gameId !== allowed;
  };
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
    { id: 'PICKLEBALL',name: 'Pickleball', icon: '/assets/images/g5.png' },
    { id: 'BADMINTON', name: 'Badminton',  icon: '/assets/images/g6.png' },
    { id: 'TENNIS',    name: 'Tennis',     icon: '/assets/images/g3.png' }
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

  // Max slots a user can select: 2 for Big Turf, 1 for everything else
  const maxSlots = formData.turfId === 'big-turf' ? 2 : 1;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.selectedSlots.length === 0) {
      toast.error('Please select at least one time slot');
      return;
    }
    // Enforce per-day per-sport hour limit
    if (formData.turfId !== 'big-turf' && formData.selectedSlots.length > 1) {
      toast.error('You can only book 1 hour per day for this sport.');
      return;
    }
    if (formData.turfId === 'big-turf' && formData.selectedSlots.length > 2) {
      toast.error('Big Turf can be booked for a maximum of 2 hours per day.');
      return;
    }
    // Big Turf: slots must be continuous and total >= 2 hours
    const bigTurfErr = getBigTurfSlotError(formData.turfId, formData.selectedSlots);
    if (bigTurfErr) {
      toast.error(bigTurfErr);
      return;
    }
    setBookingLoading(true);
    try {
      // Build full slot objects { startTime, endTime } for each selected slot
      const slotObjects = formData.selectedSlots
        .slice()
        .sort()
        .map(startTime => {
          const slot = FIXED_SLOTS.find(s => s.startTime === startTime);
          return { startTime: slot.startTime, endTime: slot.endTime };
        });

      // Format date as dd-mm-yyyy
      const [yyyy, mm, dd] = formData.date.split('-');
      const formattedDate = `${dd}-${mm}-${yyyy}`;

      // Format slots as AM/PM
      const formatTime = (time24) => {
        const [h, m] = time24.split(':').map(Number);
        const period = h < 12 ? 'AM' : 'PM';
        const hour = h % 12 === 0 ? 12 : h % 12;
        return `${hour}:${String(m).padStart(2, '0')} ${period}`;
      };
      const sortedSlots = formData.selectedSlots.slice().sort();
      const firstSlot = FIXED_SLOTS.find(s => s.startTime === sortedSlots[0]);
      const lastSlot  = FIXED_SLOTS.find(s => s.startTime === sortedSlots[sortedSlots.length - 1]);
      const timeRange = firstSlot && lastSlot
        ? `${formatTime(firstSlot.startTime)} - ${formatTime(lastSlot.endTime)}`
        : '';

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

      toast.success(`Booking confirmed! Date: ${formattedDate}${timeRange ? `, Time: ${timeRange}` : ''}`);
      const options = turfOptionsByGame[activeGame] || [];
      const autoTurf = options.length === 1 ? options[0].value : '';
      setFormData({ date: getTodayDate(), turfId: autoTurf, selectedSlots: [], bringGuests: false, guestCount: '' });
    } catch (err) {
      const formatTime = (time24) => {
        const [h, m] = time24.split(':').map(Number);
        const period = h < 12 ? 'AM' : 'PM';
        const hour = h % 12 === 0 ? 12 : h % 12;
        return `${hour}:${String(m).padStart(2, '0')} ${period}`;
      };
      let errMsg = err.response?.data?.message || 'Booking failed. Please try again.';
      // Convert HH:MM–HH:MM or HH:MM-HH:MM → AM/PM format
      errMsg = errMsg.replace(/(\d{2}:\d{2})[–-](\d{2}:\d{2})/g, (_, t1, t2) => `${formatTime(t1)} - ${formatTime(t2)}`);
      // Convert YYYY-MM-DD → DD-MM-YYYY format
      errMsg = errMsg.replace(/(\d{4})-(\d{2})-(\d{2})/g, (_, y, mo, d) => `${d}-${mo}-${y}`);
      toast.error(errMsg);
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
                  <span
                    title={isGameDisabled(game.id) ? 'Upgrade your membership to access' : ''}
                    style={{ display: 'block', cursor: isGameDisabled(game.id) ? 'not-allowed' : 'default' }}
                  >
                  <button
                    type="button"
                    disabled={isGameDisabled(game.id)}
                    onClick={() => {
                      if (isGameDisabled(game.id)) return;
                      setActiveGame(game.id);
                      setTimeout(() => {
                        if (formSectionRef.current) {
                          const top = formSectionRef.current.getBoundingClientRect().top + window.scrollY - 90;
                          window.scrollTo({ top, behavior: 'smooth' });
                        }
                      }, 50);
                    }}
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
                      cursor: isGameDisabled(game.id) ? 'not-allowed' : 'pointer',
                      opacity: isGameDisabled(game.id) ? 0.4 : 1,
                    }}
                  >
                    {game.svg
                      ? <span style={{ display: 'flex', color: activeGame === game.id ? '#fff' : '#08295E' }}>{game.svg}</span>
                      : <img src={game.icon} alt={game.name} style={{ filter: activeGame === game.id ? 'brightness(0) invert(1)' : 'none' }} />
                    }
                    {game.name}
                  </button>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="tab-content">
              <div className="tab-pane active" role="tabpanel">
                <div className="booking-form-area" ref={formSectionRef}>
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
                    <div className="col-12">
                      <div className="form-group">
                        <label className="form-label">Select Time Slot(s)</label>
                        <div className="d-flex flex-nowrap gap-2 mt-2" style={{ overflowX: 'auto', paddingBottom: '4px' }}>
                          {FIXED_SLOTS.map((slot) => {
                            const isSelected = formData.selectedSlots.includes(slot.startTime);
                            const limitReached = !isSelected && formData.selectedSlots.length >= maxSlots;
                            return (
                              <span
                                key={slot.label}
                                title={limitReached ? (formData.turfId === 'big-turf' ? 'Maximum 2 hours allowed per day' : 'Maximum 1 hour allowed per day') : ''}
                                style={{ display: 'inline-block', cursor: limitReached ? 'not-allowed' : 'default' }}
                              >
                              <button
                                type="button"
                                className="btn btn-sm"
                                disabled={limitReached}
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
                                  boxShadow: 'none',
                                  opacity: limitReached ? 0.4 : 1,
                                  pointerEvents: limitReached ? 'none' : 'auto'
                                }}
                                onClick={() => {
                                  const already = formData.selectedSlots.includes(slot.startTime);
                                  if (!already && formData.selectedSlots.length >= maxSlots) return;
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
                              </span>
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
                        {getBigTurfSlotError(formData.turfId, formData.selectedSlots) && (
                          <div className="text-danger small mt-2 fw-semibold">
                            ⚠ {getBigTurfSlotError(formData.turfId, formData.selectedSlots)}
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
