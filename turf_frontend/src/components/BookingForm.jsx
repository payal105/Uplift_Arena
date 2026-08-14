import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axios';

const FIXED_SLOTS = [
  { label: '6:00 - 7:00 AM', startTime: '06:00', endTime: '07:00' },
  { label: '7:00 - 8:00 AM', startTime: '07:00', endTime: '08:00' },
  { label: '8:00 - 9:00 AM', startTime: '08:00', endTime: '09:00' },
  { label: '9:00 - 10:00 AM', startTime: '09:00', endTime: '10:00' },
  { label: '6:00 - 7:00 PM', startTime: '18:00', endTime: '19:00' },
  { label: '7:00 - 8:00 PM', startTime: '19:00', endTime: '20:00' },
  { label: '8:00 - 9:00 PM', startTime: '20:00', endTime: '21:00' },
  { label: '9:00 - 10:00 PM', startTime: '21:00', endTime: '22:00' },
];

// Maps frontend turf alias → exact turf name stored in MongoDB
const TURF_NAME_MAP = {
  'futsal-turf':       'Futsal Turf',
  'cricket-turf':      'Cricket Turf',
  'pickleball-court2': 'Pickleball (Court 2)',
  'pickleball-court3': 'Pickleball (Court 3)',
  'badminton-court1':  'Badminton(Court 1)',
  'badminton-court4':  'Badminton(Court 4)',
  'tennis-court1':     'Tennis (Court 1)',
  'tennis-court2':     'Tennis (Court 2)',
};

const PRICING = {
  TENNIS: { rate: 1200, description: 'Hourly · max 4 pax' },
  BADMINTON: { rate: 1200, description: 'Hourly · max 4 pax' },
  PICKLEBALL: { rate: 1200, description: 'Hourly · max 4 pax' },
  FUTSAL: { rate: 1200, description: 'Per hour · max 10 pax' },
  CRICKET: { rate: 2000, description: 'Per hour · max 20 pax · min 2 hrs' },
  BIG_TURF: { rate: 2000, description: 'Per hour · max 20 pax · min 2 hrs' },
};

const STADIUM_SVG = (
  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round">
    {/* Outer boundary */}
    <rect x="4" y="8" width="56" height="48" rx="2" />
    {/* Center line */}
    <line x1="32" y1="8" x2="32" y2="56" />
    {/* Center circle */}
    <circle cx="32" cy="32" r="8" />
    {/* Center spot */}
    <circle cx="32" cy="32" r="1.5" fill="currentColor" stroke="none" />
    {/* Left penalty box */}
    <rect x="4" y="20" width="14" height="24" />
    {/* Right penalty box */}
    <rect x="46" y="20" width="14" height="24" />
    {/* Left goal */}
    <rect x="4" y="26" width="5" height="12" />
    {/* Right goal */}
    <rect x="55" y="26" width="5" height="12" />
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

  // Returns an error string if Cricket slot selection is invalid, otherwise null
  const getCricketSlotError = (turfId, selectedSlots) => {
    if (turfId !== 'cricket-turf' || selectedSlots.length === 0) return null;
    const sorted = [...selectedSlots].sort();
    // Check continuity: each slot's endTime must equal the next slot's startTime
    for (let i = 0; i < sorted.length - 1; i++) {
      const current = FIXED_SLOTS.find(s => s.startTime === sorted[i]);
      const next = FIXED_SLOTS.find(s => s.startTime === sorted[i + 1]);
      if (!current || !next || current.endTime !== next.startTime) {
        return 'Cricket requires a continuous booking of minimum 2 hours (no gaps between slots).';
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
      return 'Cricket requires a continuous booking of minimum 2 hours.';
    }
    return null;
  };

  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('userToken'));
  const [memberInfo, setMemberInfo] = useState({ isMember: 0, activityChoice: null });
  const [turfMongoIds, setTurfMongoIds] = useState({});           // alias → MongoDB _id
  const [unavailableSlots, setUnavailableSlots] = useState(new Set()); // BLOCKED or BOOKED startTimes
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Maps membership activityChoice text → booking game ID
  const activityToGameId = {
    'Badminton': 'BADMINTON',
    'Tennis': 'TENNIS',
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

  // Fetch all turfs once on mount and build alias → MongoDB _id mapping
  useEffect(() => {
    api.get('/api/turfs').then(({ data }) => {
      const list = Array.isArray(data) ? data : (data.turfs || []);
      const mapping = {};
      list.forEach(turf => {
        const alias = Object.entries(TURF_NAME_MAP).find(([, name]) => name === turf.name)?.[0];
        if (alias) mapping[alias] = turf._id;
      });
      setTurfMongoIds(mapping);
    }).catch(() => {}); // silently fail — slots just show as all available
  }, []);


  const [activeGame, setActiveGame] = useState('FUTSAL');
  const formSectionRef = useRef(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentSummary, setPaymentSummary] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  // When a member has a specific activity, auto-select that game
  useEffect(() => {
    if (memberInfo.isMember === 1 && memberInfo.activityChoice) {
      const allowed = activityToGameId[memberInfo.activityChoice];
      if (allowed) setActiveGame(allowed);
    }
  }, [memberInfo]);

  // All games are accessible to everyone; membership only controls free vs. paid access.
  const isGameDisabled = (_gameId) => false;

  // Returns true if the current game is covered for free by the user's membership
  const isMemberSportFree = (
    memberInfo.isMember === 1 &&
    (
      !memberInfo.activityChoice || // all-activities club plan → everything free
      activityToGameId[memberInfo.activityChoice] === activeGame // specific sport matches
    )
  );
  const [formData, setFormData] = useState({
    date: getTodayDate(),
    turfId: '',
    selectedSlots: [],
    bringGuests: false,
    guestCount: ''
  });

  // Re-fetch slot statuses from DB whenever turf or date changes
  useEffect(() => {
    const mongoId = turfMongoIds[formData.turfId];
    if (!mongoId || !formData.date) {
      setUnavailableSlots(new Set());
      return;
    }
    setLoadingSlots(true);
    api.get('/api/slots', { params: { turfId: mongoId, date: formData.date } })
      .then(({ data }) => {
        const unavailable = new Set(
          (data.slots || [])
            .filter(s => s.status === 'BLOCKED' || s.status === 'BOOKED')
            .map(s => s.startTime)
        );
        setUnavailableSlots(unavailable);
      })
      .catch(() => setUnavailableSlots(new Set()))
      .finally(() => setLoadingSlots(false));
  }, [formData.turfId, formData.date, turfMongoIds]);

  const games = [
    { id: 'FUTSAL', name: 'Futsal', icon: '/assets/images/g1.png' },
    { id: 'CRICKET', name: 'Cricket', icon: '/assets/images/g2.png' },
    { id: 'PICKLEBALL', name: 'Pickleball', icon: '/assets/images/g5.png' },
    { id: 'BADMINTON', name: 'Badminton', icon: '/assets/images/g6.png' },
    { id: 'TENNIS', name: 'Tennis', icon: '/assets/images/g3.png' }
  ];

  const turfOptionsByGame = {
    FUTSAL: [{ value: 'futsal-turf', label: 'Futsal Turf' }],
    CRICKET: [{ value: 'cricket-turf', label: 'Cricket Turf' }],
    PICKLEBALL: [{ value: 'pickleball-court2', label: 'Pickleball (Court 2)' }, { value: 'pickleball-court3', label: 'Pickleball (Court 3)' }],
    BADMINTON: [{ value: 'badminton-court1', label: 'Badminton (Court 1)' }, { value: 'badminton-court4', label: 'Badminton (Court 4)' }],
    TENNIS: [{ value: 'tennis-court1', label: 'Tennis (Court 1)' }, { value: 'tennis-court2', label: 'Tennis (Court 2)' }],
  };

  // Reset turf selection when game changes
  useEffect(() => {
    const options = turfOptionsByGame[activeGame] || [];
    // Auto-select if only one option
    const autoTurf = options.length === 1 ? options[0].value : '';
    setFormData(prev => ({ ...prev, turfId: autoTurf, selectedSlots: [] }));
  }, [activeGame]);

  // Auto-deselect any selected slots that become blocked/booked
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      selectedSlots: prev.selectedSlots.filter(s => !unavailableSlots.has(s))
    }));
  }, [unavailableSlots]);

  // Check if a slot has passed (either past date or past time on today's date)
  const isSlotPassed = (slotStartTime) => {
    const today = getTodayDate();
    const selectedDate = formData.date;

    // If selected date is in the past, disable all slots
    if (selectedDate < today) return true;

    // If selected date is in the future, enable all slots
    if (selectedDate > today) return false;

    // If selected date is today, check if slot time has passed
    // Get current time in HH:mm format
    const now = new Date();
    const currentHrs = String(now.getHours()).padStart(2, '0');
    const currentMins = String(now.getMinutes()).padStart(2, '0');
    const currentTime = `${currentHrs}:${currentMins}`;

    // Compare: if slot start time is <= current time, it has passed
    return slotStartTime <= currentTime;
  };

  // Max slots a user can select: 2 for Cricket, 1 for everything else
  const maxSlots = formData.turfId === 'cricket-turf' ? 2 : 1;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.error('You must login first to book a court.');
      return;
    }
    if (formData.selectedSlots.length === 0) {
      toast.error('Please select at least one time slot');
      return;
    }
    // Enforce per-day per-sport hour limit
    if (formData.turfId !== 'cricket-turf' && formData.selectedSlots.length > 1) {
      toast.error('You can only book 1 hour per day for this sport.');
      return;
    }
    if (formData.turfId === 'cricket-turf' && formData.selectedSlots.length > 2) {
      toast.error('Cricket can be booked for a maximum of 2 hours per day.');
      return;
    }
    // Cricket: slots must be continuous and total >= 2 hours
    const cricketErr = getCricketSlotError(formData.turfId, formData.selectedSlots);
    if (cricketErr) {
      toast.error(cricketErr);
      return;
    }

    // Build shared data
    const slotObjects = formData.selectedSlots
      .slice()
      .sort()
      .map(startTime => {
        const slot = FIXED_SLOTS.find(s => s.startTime === startTime);
        return { startTime: slot.startTime, endTime: slot.endTime };
      });
    const [yyyy, mm, dd] = formData.date.split('-');
    const formattedDate = `${dd}-${mm}-${yyyy}`;
    const formatTime = (time24) => {
      const [h, m] = time24.split(':').map(Number);
      const period = h < 12 ? 'AM' : 'PM';
      const hour = h % 12 === 0 ? 12 : h % 12;
      return `${hour}:${String(m).padStart(2, '0')} ${period}`;
    };
    const sortedSlots = formData.selectedSlots.slice().sort();
    const firstSlot = FIXED_SLOTS.find(s => s.startTime === sortedSlots[0]);
    const lastSlot = FIXED_SLOTS.find(s => s.startTime === sortedSlots[sortedSlots.length - 1]);
    const timeRange = firstSlot && lastSlot
      ? `${formatTime(firstSlot.startTime)} - ${formatTime(lastSlot.endTime)}`
      : '';

    // Non-member, or member booking a sport not covered by their plan: show payment modal
    if (!isMemberSportFree) {
      const pricing = PRICING[activeGame] || { rate: 1200, description: 'per hour' };
      const hours = formData.selectedSlots.length;
      const courtTotal = pricing.rate * hours;
      const guestCount = formData.bringGuests ? Math.max(1, parseInt(formData.guestCount) || 0) : 0;
      const guestCharges = guestCount * 500;
      const turfLabel = (turfOptionsByGame[activeGame] || []).find(o => o.value === formData.turfId)?.label || formData.turfId;
      setPaymentSummary({
        sport: activeGame,
        turfId: formData.turfId,
        turfLabel,
        date: formData.date,
        formattedDate,
        slots: slotObjects,
        timeRange,
        ratePerHour: pricing.rate,
        pricingDescription: pricing.description,
        hours,
        courtTotal,
        guestCount: formData.bringGuests ? parseInt(formData.guestCount) || 0 : 0,
        guestCharges,
        totalAmount: courtTotal + guestCharges,
        bringGuests: formData.bringGuests,
        gameName: games.find(g => g.id === activeGame)?.name || activeGame,
      });
      setShowPaymentModal(true);
      return;
    }

    // Member: direct booking
    setBookingLoading(true);
    try {
      await api.post('/api/form-bookings', {
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
      let errMsg = err.response?.data?.message || 'Booking failed. Please try again.';
      errMsg = errMsg.replace(/(\d{2}:\d{2})[–-](\d{2}:\d{2})/g, (_, t1, t2) => `${formatTime(t1)} - ${formatTime(t2)}`);
      errMsg = errMsg.replace(/(\d{4})-(\d{2})-(\d{2})/g, (_, y, mo, d) => `${d}-${mo}-${y}`);
      toast.error(errMsg);
    } finally {
      setBookingLoading(false);
    }
  };

  const handleProceedPayment = async () => {
    if (!paymentSummary) return;
    setPaymentLoading(true);
    try {
      const res = await api.post('/api/payments/payu/initiate-booking', {
        sport: paymentSummary.sport,
        turfId: paymentSummary.turfId,
        bookingDate: paymentSummary.date,
        slots: paymentSummary.slots,
        bringGuests: paymentSummary.bringGuests,
        guestCount: paymentSummary.guestCount,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` },
      });

      const { payuParams } = res.data;

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
      form.submit();
      // Page will navigate away — no need to reset loading state
    } catch (err) {
      const formatTime = (time24) => {
        const [h, m] = time24.split(':').map(Number);
        const period = h < 12 ? 'AM' : 'PM';
        const hour = h % 12 === 0 ? 12 : h % 12;
        return `${hour}:${String(m).padStart(2, '0')} ${period}`;
      };
      let errMsg = err.response?.data?.message || 'Failed to initiate payment. Please try again.';
      errMsg = errMsg.replace(/(\d{2}:\d{2})[–-](\d{2}:\d{2})/g, (_, t1, t2) => `${formatTime(t1)} - ${formatTime(t2)}`);
      errMsg = errMsg.replace(/(\d{4})-(\d{2})-(\d{2})/g, (_, y, mo, d) => `${d}-${mo}-${y}`);
      toast.error(errMsg);
      setPaymentLoading(false);
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
              {games.map((game) => {
                const isFreeForMember =
                  memberInfo.isMember === 1 &&
                  (
                    !memberInfo.activityChoice ||
                    activityToGameId[memberInfo.activityChoice] === game.id
                  );
                return (
                  <div className="col-4" key={game.id}>
                    <span
                      title=''
                      style={{ display: 'block', cursor: 'default' }}
                    >
                      <button
                        type="button"
                        onClick={() => {
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
                          cursor: 'pointer',
                          opacity: 1,
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
                );
              })}
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
                          min={getTodayDate()}
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
                        <label className="form-label">
                          Select Time Slot(s)
                          {loadingSlots && <span className="ms-2 text-muted" style={{ fontSize: '0.75rem' }}>Checking availability...</span>}
                        </label>
                        <div className="d-flex flex-nowrap gap-2 mt-2" style={{ overflowX: 'auto', paddingBottom: '4px' }}>
                          {FIXED_SLOTS.map((slot) => {
                            const isSelected = formData.selectedSlots.includes(slot.startTime);
                            const slotPassed = isSlotPassed(slot.startTime);
                            const isDbBlocked = unavailableSlots.has(slot.startTime);
                            const limitReached = !isSelected && formData.selectedSlots.length >= maxSlots;
                            const isDisabled = limitReached || slotPassed || isDbBlocked;
                            const today = getTodayDate();
                            const getDisabledMessage = () => {
                              if (isDbBlocked) return 'This slot is not available';
                              if (slotPassed && formData.date === today) return 'This time slot has already passed';
                              if (limitReached) return formData.turfId === 'cricket-turf' ? 'Maximum 2 hours allowed per day' : 'Maximum 1 hour allowed per day';
                              return '';
                            };
                            return (
                              <span
                                key={slot.label}
                                title={getDisabledMessage()}
                                style={{ display: 'inline-block', cursor: isDisabled ? 'not-allowed' : 'default' }}
                              >
                                <button
                                  type="button"
                                  className="btn btn-sm"
                                  disabled={isDisabled}
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
                                    opacity: isDisabled ? 0.4 : 1,
                                    pointerEvents: isDisabled ? 'none' : 'auto'
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
                        {getCricketSlotError(formData.turfId, formData.selectedSlots) && (
                          <div className="text-danger small mt-2 fw-semibold">
                            ⚠ {getCricketSlotError(formData.turfId, formData.selectedSlots)}
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
              <button
                type="submit"
                className="btn btn-secondary"
                disabled={bookingLoading}
              >
                {bookingLoading ? 'Booking...' : 'Book Now'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Payment Summary Modal for Non-Members */}
      {showPaymentModal && paymentSummary && (
        <>
          <div
            className="modal fade show"
            style={{ display: 'block', zIndex: 1055 }}
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
          >
            <div className="modal-dialog modal-dialog-centered" role="document" style={{ maxWidth: '480px' }}>
              <div className="modal-content" style={{ borderRadius: '12px', overflow: 'hidden', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.25)' }}>

                {/* Header */}
                <div className="modal-header" style={{ background: '#08295E', color: '#fff', borderBottom: 'none', padding: '18px 24px' }}>
                  <div>
                    <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.65, marginBottom: '3px' }}>Pay &amp; Play</div>
                    <h5 className="modal-title mb-0" style={{ fontWeight: 700, fontSize: '1.15rem' }}>Order Summary</h5>
                  </div>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setShowPaymentModal(false)}
                    aria-label="Close"
                  />
                </div>

                {/* Body */}
                <div className="modal-body" style={{ padding: '24px' }}>

                  {/* Booking details grid */}
                  <div style={{ background: '#f4f6f9', borderRadius: '8px', padding: '16px', marginBottom: '20px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                      <div>
                        <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Sport</div>
                        <div style={{ fontWeight: 600, color: '#08295E', marginTop: '3px' }}>{paymentSummary.gameName}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Court</div>
                        <div style={{ fontWeight: 600, color: '#08295E', marginTop: '3px' }}>{paymentSummary.turfLabel}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date</div>
                        <div style={{ fontWeight: 600, color: '#08295E', marginTop: '3px' }}>{paymentSummary.formattedDate}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Time</div>
                        <div style={{ fontWeight: 600, color: '#08295E', marginTop: '3px' }}>{paymentSummary.timeRange || '—'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Pricing breakdown */}
                  <div style={{ borderTop: '1px solid #e9ecef', paddingTop: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                      <div>
                        <span style={{ fontSize: '14px', color: '#444' }}>Court charges</span>
                        <div style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>
                          ₹{paymentSummary.ratePerHour.toLocaleString()} × {paymentSummary.hours} hr{paymentSummary.hours > 1 ? 's' : ''} · {paymentSummary.pricingDescription}
                        </div>
                      </div>
                      <span style={{ fontWeight: 600, fontSize: '15px', color: '#333' }}>₹{paymentSummary.courtTotal.toLocaleString()}</span>
                    </div>

                    {paymentSummary.guestCount > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '12px', marginBottom: '4px' }}>
                        <div>
                          <span style={{ fontSize: '14px', color: '#444' }}>Guest charges</span>
                          <div style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>
                            ₹500 × {paymentSummary.guestCount} guest{paymentSummary.guestCount > 1 ? 's' : ''}
                          </div>
                        </div>
                        <span style={{ fontWeight: 600, fontSize: '15px', color: '#333' }}>₹{paymentSummary.guestCharges.toLocaleString()}</span>
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid #08295E', paddingTop: '14px', marginTop: '14px' }}>
                      <span style={{ fontWeight: 700, fontSize: '16px', color: '#08295E' }}>Total Amount</span>
                      <span style={{ fontWeight: 700, fontSize: '20px', color: '#08295E' }}>₹{paymentSummary.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="modal-footer" style={{ borderTop: '1px solid #e9ecef', padding: '14px 24px', justifyContent: 'center' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleProceedPayment}
                    disabled={paymentLoading}
                    style={{ minWidth: '180px' }}
                  >
                    {paymentLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                        Processing...
                      </>
                    ) : (
                      'Pay Now'
                    )}
                  </button>
                </div>

              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" style={{ zIndex: 1054 }} />
        </>
      )}

    </section>
  );
};

export default BookingForm;
