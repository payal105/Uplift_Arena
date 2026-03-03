import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const BookingForm = () => {
  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: getTodayDate(),
    turfId: '',
    fromTime: '',
    toTime: '',
    bringGuests: false,
    guestCount: ''
  });

  const games = [
    { id: 'CRICKET', name: 'Cricket', icon: '/assets/images/g2.png' },
    { id: 'FOOTBALL', name: 'Football', icon: '/assets/images/g1.png' },
    { id: 'PICKLEBALL', name: 'Pickleball', icon: '/assets/images/g3.png' },
    { id: 'BADMINTON', name: 'Badminton', icon: '/assets/images/g5.png' },
    { id: 'TENNIS', name: 'Tennis', icon: '/assets/images/g6.png' }
  ];

  // Fetch turfs by sport type on mount and when game changes
  useEffect(() => {
    fetchTurfs(activeGame);
    setFormData(prev => ({ ...prev, turfId: '', fromTime: '', toTime: '' }));
  }, [activeGame]);

  const fetchTurfs = async (sportType) => {
    try {
      setLoading(true);
      const response = await api.get(`/api/turfs?sportType=${sportType}`);
      setTurfs(response.data.turfs || []);
    } catch (error) {
      console.error('Error fetching turfs:', error);
      setTurfs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fromTime || !formData.toTime) {
      setBookingError('Please select From Time and To Time');
      return;
    }
    if (formData.fromTime >= formData.toTime) {
      setBookingError('To Time must be after From Time');
      return;
    }
    if (formData.turfId === 'big-turf') {
      const [fromH, fromM] = formData.fromTime.split(':').map(Number);
      const [toH, toM] = formData.toTime.split(':').map(Number);
      const durationMinutes = (toH * 60 + toM) - (fromH * 60 + fromM);
      if (durationMinutes < 120) {
        setBookingError('Big Turf requires a minimum booking of 2 hours');
        return;
      }
    }
    setBookingLoading(true);
    setBookingError('');
    setBookingSuccess('');
    try {
      await api.post('/api/form-bookings', {
        sport: activeGame,
        turfId: formData.turfId,
        bookingDate: formData.date,
        fromTime: formData.fromTime,
        toTime: formData.toTime,
        bringGuests: formData.bringGuests,
        guestCount: formData.guestCount
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
      });
      setBookingSuccess('Booking confirmed successfully!');
      setFormData(prev => ({ ...prev, turfId: '', fromTime: '', toTime: '', bringGuests: false, guestCount: '' }));
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
            <ul className="nav nav-tabs" id="myTab" role="tablist">
              {games.map((game) => (
                <li className="nav-item" role="presentation" key={game.id}>
                  <button
                    className={`nav-link ${activeGame === game.id ? 'active' : ''}`}
                    onClick={() => setActiveGame(game.id)}
                    type="button"
                    role="tab"
                  >
                    <img src={game.icon} alt={game.name} /> {game.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="tab-content">
              <div className="tab-pane active" role="tabpanel">
                <div className="booking-form-area">
                  <div className="row gx-5 gy-4">
                    <div className="col-lg">
                      <div className="form-group">
                        <label htmlFor="b_date" className="form-label">
                          Select Date
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
                        <label htmlFor="b_from" className="form-label">
                          From Time
                        </label>
                        <input
                          type="time"
                          className="form-control"
                          id="b_from"
                          value={formData.fromTime}
                          onChange={(e) => setFormData({ ...formData, fromTime: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-lg">
                      <div className="form-group">
                        <label htmlFor="b_to" className="form-label">
                          To Time
                        </label>
                        <input
                          type="time"
                          className="form-control"
                          id="b_to"
                          value={formData.toTime}
                          onChange={(e) => setFormData({ ...formData, toTime: e.target.value })}
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
                          onChange={(e) => {
                            setFormData({ ...formData, turfId: e.target.value });
                          }}
                          required
                        >
                          <option value="">Select Turf</option>
                          <option value="badminton-1">Badminton 1</option>
                          <option value="badminton-2">Badminton 2</option>
                          <option value="pickleball-1">Pickleball 1</option>
                          <option value="pickleball-2">Pickleball 2</option>
                          <option value="tennis-1">Tennis 1</option>
                          <option value="tennis-2">Tennis 2</option>
                          <option value="futsal-turf">Futsal Turf</option>
                          <option value="big-turf">Big Turf</option>
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
