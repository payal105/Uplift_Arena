import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  const [y, m, d] = dateStr.split('-');
  return `${d}-${m}-${y}`;
};

const formatTime = (time24) => {
  if (!time24) return '-';
  const [h, m] = time24.split(':').map(Number);
  const period = h < 12 ? 'AM' : 'PM';
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, '0')} ${period}`;
};

const SPORT_LABELS = {
  CRICKET: 'Cricket',
  FUTSAL: 'Futsal',
  BIG_TURF: 'Big Turf',
  PICKLEBALL: 'Pickleball',
  BADMINTON: 'Badminton',
  TENNIS: 'Tennis',
};

const STATUS_STYLES = {
  confirmed:  { bg: '#e8f5e9', color: '#2e7d32', label: 'Confirmed' },
  cancelled:  { bg: '#ffebee', color: '#c62828', label: 'Cancelled' },
  completed:  { bg: '#e3f2fd', color: '#1565c0', label: 'Completed' },
};

const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      navigate('/login');
      return;
    }
    api.get('/api/form-bookings/my', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => setBookings(res.data.bookings || []))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load bookings.'))
      .finally(() => setLoading(false));
  }, [navigate]);

  return (
    <>
      <div className="inner-banner-section">
        <div className="image-area">
          <img src="/assets/images/bdcm1.jpg" alt="My Bookings" />
        </div>
        <div className="container content-area">
          <h1>My Bookings</h1>
          <p>View all your court booking history</p>
        </div>
      </div>

      <section className="section-padding">
        <div className="container">
          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border" role="status" style={{ color: '#08295E' }}>
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}

          {!loading && error && (
            <div className="alert alert-danger">{error}</div>
          )}

          {!loading && !error && bookings.length === 0 && (
            <div className="text-center py-5">
              <i className="fa-regular fa-calendar-xmark" style={{ fontSize: '3rem', color: '#ccc', marginBottom: '16px', display: 'block' }}></i>
              <h5 style={{ color: '#666' }}>No bookings found</h5>
              <p style={{ color: '#999' }}>You haven't made any bookings yet.</p>
              <button className="btn btn-primary mt-2" onClick={() => navigate('/#booking')}>
                Book Now
              </button>
            </div>
          )}

          {!loading && !error && bookings.length > 0 && (
            <div className="row g-4">
              {bookings.map((b) => {
                const status = STATUS_STYLES[b.status] || STATUS_STYLES.confirmed;
                const sortedSlots = (b.slots || []).slice().sort((a, b) => a.startTime.localeCompare(b.startTime));
                const timeRange = sortedSlots.length > 0
                  ? `${formatTime(sortedSlots[0].startTime)} – ${formatTime(sortedSlots[sortedSlots.length - 1].endTime)}`
                  : `${formatTime(b.fromTime)} – ${formatTime(b.toTime)}`;

                return (
                  <div className="col-md-6 col-lg-4" key={b._id}>
                    <div style={{
                      background: '#fff',
                      borderRadius: '12px',
                      boxShadow: '0 2px 12px rgba(8,41,94,0.10)',
                      overflow: 'hidden',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column'
                    }}>
                      {/* Card Header */}
                      <div style={{ background: '#08295E', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ color: '#A6CE39', fontWeight: '700', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            {SPORT_LABELS[b.sport] || b.sport}
                          </div>
                          <div style={{ color: '#fff', fontWeight: '600', fontSize: '1rem', marginTop: '2px' }}>
                            {b.turfName}
                          </div>
                        </div>
                        <span style={{
                          background: status.bg,
                          color: status.color,
                          borderRadius: '20px',
                          padding: '4px 12px',
                          fontSize: '0.75rem',
                          fontWeight: '600'
                        }}>
                          {status.label}
                        </span>
                      </div>

                      {/* Card Body */}
                      <div style={{ padding: '18px 20px', flex: 1 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                          <div>
                            <div style={{ color: '#999', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '3px' }}>Date</div>
                            <div style={{ color: '#08295E', fontWeight: '600', fontSize: '0.9rem' }}>{formatDate(b.bookingDate)}</div>
                          </div>
                          <div>
                            <div style={{ color: '#999', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '3px' }}>Time</div>
                            <div style={{ color: '#08295E', fontWeight: '600', fontSize: '0.9rem' }}>{timeRange}</div>
                          </div>
                          <div>
                            <div style={{ color: '#999', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '3px' }}>Slots</div>
                            <div style={{ color: '#333', fontSize: '0.85rem' }}>{sortedSlots.length} slot{sortedSlots.length !== 1 ? 's' : ''}</div>
                          </div>
                          {b.bringGuests && b.guestCount > 0 && (
                            <div>
                              <div style={{ color: '#999', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '3px' }}>Guests</div>
                              <div style={{ color: '#333', fontSize: '0.85rem' }}>{b.guestCount}</div>
                            </div>
                          )}
                        </div>

                        {/* Slot pills */}
                        {sortedSlots.length > 0 && (
                          <div style={{ marginTop: '14px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {sortedSlots.map((slot, i) => (
                              <span key={i} style={{
                                background: '#f0f4ff',
                                color: '#08295E',
                                borderRadius: '20px',
                                padding: '3px 10px',
                                fontSize: '0.73rem',
                                fontWeight: '500',
                                border: '1px solid #c8d6f0'
                              }}>
                                {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Card Footer */}
                      <div style={{ padding: '10px 20px', borderTop: '1px solid #f0f0f0', color: '#aaa', fontSize: '0.75rem' }}>
                        Booked on {new Date(b.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default MyBookings;
