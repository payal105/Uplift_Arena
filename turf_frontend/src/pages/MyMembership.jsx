import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const PLAN_LABELS = {
  'annual-individual-club':     'Annual Individual Club Membership',
  'annual-family-club':         'Annual Family Club Membership',
  'annual-individual-activity': 'Annual Individual Activity Membership',
  'monthly-individual-activity':'Monthly Individual Activity Membership',
};

const PLAN_PRICES = {
  'annual-individual-club':      '₹30,000',
  'annual-family-club':          '₹50,000',
  'annual-individual-activity':  '₹18,000',
  'monthly-individual-activity': '₹3,000',
};

const PLAN_DURATION = {
  'annual-individual-club':      'Annual',
  'annual-family-club':          'Annual',
  'annual-individual-activity':  'Annual',
  'monthly-individual-activity': 'Monthly',
};

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const getDaysLeft = (endDate) => {
  if (!endDate) return null;
  const diff = new Date(endDate) - new Date();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

const MyMembership = () => {
  const navigate = useNavigate();
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [visibleCount, setVisibleCount] = useState(4);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (!token) { navigate('/login'); return; }

    api.get('/api/memberships/my', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => setMemberships(res.data.memberships || []))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load membership details.'))
      .finally(() => setLoading(false));
  }, [navigate]);

  const active   = memberships.find(m => m.isActive === 1);
  const inactive = memberships.filter(m => m.isActive !== 1);

  return (
    <>
      {/* Inner Banner */}
      <div className="inner-banner-section">
        <div className="image-area">
          <img src="/assets/images/bdcm1.jpg" alt="My Membership" />
        </div>
        <div className="container content-area">
          <h1>My Membership Plan</h1>
          <p>View your current and past memberships</p>
        </div>
      </div>

      <section className="section-padding">
        <div className="container" style={{ maxWidth: '780px' }}>

          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border" role="status" style={{ color: '#08295E' }}>
                <span className="visually-hidden">Loading…</span>
              </div>
            </div>
          )}

          {!loading && error && (
            <div className="alert alert-danger">{error}</div>
          )}

          {!loading && !error && !active && (
            <div className="text-center py-5">
              <i className="fa-regular fa-id-card" style={{ fontSize: '3.5rem', color: '#ccc', marginBottom: '16px', display: 'block' }}></i>
              <h5 style={{ color: '#666' }}>No active membership found</h5>
              <p style={{ color: '#999' }}>You don't have an active membership plan yet.</p>
              <Link to="/membership" className="btn btn-primary mt-2">Explore Membership Plans</Link>
            </div>
          )}

          {!loading && !error && active && (() => {
            const daysLeft = getDaysLeft(active.endDate);
            const isAllActivity = !active.activityChoice;

            return (
              <div style={{ marginBottom: '40px' }}>
                {/* Active Plan Card */}
                <div style={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 24px rgba(8,41,94,0.13)',
                  border: '2px solid #A6CE39'
                }}>
                  {/* Card Header */}
                  <div style={{ background: '#08295E', padding: '24px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <div style={{ color: '#A6CE39', fontWeight: '700', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
                        Active Plan
                      </div>
                      <div style={{ color: '#fff', fontWeight: '700', fontSize: '1.25rem', lineHeight: '1.3' }}>
                        {PLAN_LABELS[active.membershipType] || active.membershipType}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: '#A6CE39', fontWeight: '800', fontSize: '1.6rem', lineHeight: '1' }}>
                        {PLAN_PRICES[active.membershipType] || ''}
                      </div>
                      <div style={{ color: '#8fa8cc', fontSize: '0.78rem', marginTop: '4px' }}>
                        {PLAN_DURATION[active.membershipType] || ''}
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div style={{ background: '#fff', padding: '24px 28px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                      <div>
                        <div style={{ color: '#999', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '4px' }}>Member Name</div>
                        <div style={{ color: '#08295E', fontWeight: '600' }}>{active.name}</div>
                      </div>
                      <div>
                        <div style={{ color: '#999', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '4px' }}>Email</div>
                        <div style={{ color: '#333', fontSize: '0.9rem', wordBreak: 'break-all' }}>{active.email}</div>
                      </div>
                      <div>
                        <div style={{ color: '#999', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '4px' }}>Phone</div>
                        <div style={{ color: '#333', fontSize: '0.9rem' }}>{active.phone}</div>
                      </div>
                      <div>
                        <div style={{ color: '#999', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '4px' }}>Start Date</div>
                        <div style={{ color: '#08295E', fontWeight: '600' }}>{formatDate(active.startDate)}</div>
                      </div>
                      <div>
                        <div style={{ color: '#999', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '4px' }}>End Date</div>
                        <div style={{ color: '#08295E', fontWeight: '600' }}>{formatDate(active.endDate)}</div>
                      </div>
                      <div>
                        <div style={{ color: '#999', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '4px' }}>Days Remaining</div>
                        <div style={{ color: (daysLeft !== null && daysLeft <= 30) ? '#c0392b' : '#27ae60', fontWeight: '700', fontSize: '1rem' }}>
                          {daysLeft} day{daysLeft !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>

                    {/* Activity / Access */}
                    <div style={{
                      background: '#f5f8ff',
                      borderRadius: '10px',
                      padding: '16px 20px',
                    }}>
                      <div>
                        <div style={{ color: '#999', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '3px' }}>
                          {isAllActivity ? 'Access Level' : 'Selected Activity'}
                        </div>
                        <div style={{ color: '#08295E', fontWeight: '700', fontSize: '1rem' }}>
                          {isAllActivity ? 'All Activities Included' : active.activityChoice}
                        </div>
                        {isAllActivity && (
                          <div style={{ color: '#666', fontSize: '0.8rem', marginTop: '2px' }}>Gym • Badminton • Tennis • Pickleball</div>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            );
          })()}

          {/* Past Memberships */}
          {!loading && !error && inactive.length > 0 && (
            <div>
              <h5 style={{ color: '#08295E', fontWeight: '700', marginBottom: '16px', borderBottom: '2px solid #e8edf5', paddingBottom: '8px' }}>
                Past Memberships
              </h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {inactive.slice(0, visibleCount).map((m) => (
                  <div key={m._id} style={{
                    background: '#fff',
                    borderRadius: '10px',
                    border: '1px solid #e0e0e0',
                    padding: '16px 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '10px',
                    opacity: 0.75
                  }}>
                    <div>
                      <div style={{ color: '#08295E', fontWeight: '600', fontSize: '0.95rem' }}>
                        {PLAN_LABELS[m.membershipType] || m.membershipType}
                      </div>
                      {m.activityChoice && (
                        <div style={{ color: '#666', fontSize: '0.8rem', marginTop: '2px' }}>{m.activityChoice}</div>
                      )}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: '#999', fontSize: '0.78rem' }}>
                        {formatDate(m.startDate)} — {formatDate(m.endDate)}
                      </div>
                      <span style={{
                        display: 'inline-block',
                        marginTop: '4px',
                        background: '#fbe9e7',
                        color: '#c62828',
                        borderRadius: '20px',
                        padding: '2px 10px',
                        fontSize: '0.72rem',
                        fontWeight: '600'
                      }}>
                        Expired
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              {visibleCount < inactive.length && (
                <div className="text-center mt-3">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setVisibleCount(v => v + 4)}
                  >
                    Load More
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </section>
    </>
  );
};

export default MyMembership;
