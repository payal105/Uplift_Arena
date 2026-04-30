import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const PaymentReturn = () => {
  const navigate = useNavigate();
  const [params, setParams] = useState({});

  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    setParams(Object.fromEntries(search.entries()));

    // Auto-redirect to home after 10 seconds
    const timer = setTimeout(() => navigate('/'), 10000);
    return () => clearTimeout(timer);
  }, [navigate]);

  const isSuccess = params.status === 'success';
  const isBooking = params.type === 'booking';
  const isMembership = params.type === 'membership';

  return (
    <section
      className="section-padding"
      style={{
        minHeight: '100vh',
        background: 'url(/assets/images/banner.jpg) center center / cover no-repeat',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* Dark overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(8,41,94,0.65)' }} />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div
              className="card border-0 shadow text-center"
              style={{ borderRadius: '16px', overflow: 'hidden' }}
            >
              {/* Header strip */}
              <div
                style={{
                  background: isSuccess ? '#08295E' : '#c0392b',
                  padding: '32px 24px 24px',
                  color: '#fff',
                }}
              >
                {isSuccess ? (
                  <>
                    <div
                      style={{
                        width: 72,
                        height: 72,
                        borderRadius: '50%',
                        background: '#AADF6D',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 16px',
                      }}
                    >
                      <i className="fas fa-check fa-2x" style={{ color: '#08295E' }}></i>
                    </div>
                    <h3 className="fw-bold mb-1">Payment Successful!</h3>
                    <p className="mb-0 opacity-75" style={{ fontSize: '0.95rem' }}>
                      {isBooking && 'Your court has been booked. Check your email for the confirmation.'}
                      {isMembership && 'Welcome to Uplift Sports Arena! Your membership is now active.'}
                      {!isBooking && !isMembership && 'Your payment was processed successfully.'}
                    </p>
                  </>
                ) : (
                  <>
                    <div
                      style={{
                        width: 72,
                        height: 72,
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 16px',
                      }}
                    >
                      <i className="fas fa-times fa-2x"></i>
                    </div>
                    <h3 className="fw-bold mb-1">Payment Failed</h3>
                    <p className="mb-0 opacity-75" style={{ fontSize: '0.95rem' }}>
                      {params.reason === 'tampered'
                        ? 'Payment response could not be verified. Please contact support.'
                        : 'Your payment was not completed. No amount has been charged.'}
                    </p>
                  </>
                )}
              </div>

              {/* Body */}
              <div className="card-body p-4">
                {params.txnid && (
                  <div
                    className="mb-3 p-3 rounded"
                    style={{ background: '#f4f6f9', fontSize: '0.85rem' }}
                  >
                    <div className="text-muted mb-1">Transaction ID</div>
                    <div className="fw-semibold" style={{ color: '#08295E', wordBreak: 'break-all' }}>
                      {params.txnid}
                    </div>
                    {params.ref && (
                      <>
                        <div className="text-muted mt-2 mb-1">PayU Reference</div>
                        <div className="fw-semibold" style={{ color: '#08295E' }}>{params.ref}</div>
                      </>
                    )}
                  </div>
                )}

                {isSuccess ? (
                  <div className="d-flex flex-column gap-2 mt-3">
                    {isBooking && (
                      <Link
                        to="/my-bookings"
                        className="btn"
                        style={{
                          background: '#AADF6D',
                          color: '#08295E',
                          fontWeight: 700,
                          border: '2px solid #AADF6D',
                          borderRadius: '8px',
                        }}
                      >
                        <i className="fas fa-calendar-check me-2"></i>View My Bookings
                      </Link>
                    )}
                    {isMembership && (
                      <Link
                        to="/my-membership"
                        className="btn"
                        style={{
                          background: '#AADF6D',
                          color: '#08295E',
                          fontWeight: 700,
                          border: '2px solid #AADF6D',
                          borderRadius: '8px',
                        }}
                      >
                        <i className="fas fa-id-card me-2"></i>View My Membership
                      </Link>
                    )}
                    <Link
                      to="/"
                      className="btn btn-outline-secondary"
                      style={{ borderRadius: '8px' }}
                    >
                      <i className="fas fa-home me-2"></i>Back to Home
                    </Link>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-2 mt-3">
                    {isBooking && (
                      <Link
                        to="/#booking"
                        className="btn"
                        style={{
                          background: '#08295E',
                          color: '#fff',
                          fontWeight: 700,
                          border: '2px solid #08295E',
                          borderRadius: '8px',
                        }}
                      >
                        <i className="fas fa-redo me-2"></i>Try Booking Again
                      </Link>
                    )}
                    {isMembership && (
                      <Link
                        to="/membership"
                        className="btn"
                        style={{
                          background: '#08295E',
                          color: '#fff',
                          fontWeight: 700,
                          border: '2px solid #08295E',
                          borderRadius: '8px',
                        }}
                      >
                        <i className="fas fa-redo me-2"></i>Try Again
                      </Link>
                    )}
                    <Link
                      to="/"
                      className="btn btn-outline-secondary"
                      style={{ borderRadius: '8px' }}
                    >
                      <i className="fas fa-home me-2"></i>Back to Home
                    </Link>
                  </div>
                )}

                <p className="text-muted small mt-4 mb-0">
                  You will be automatically redirected to the home page in 10 seconds.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentReturn;
