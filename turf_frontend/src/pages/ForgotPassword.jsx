import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axios';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/api/user_data/forgot-password', { email });
      toast.success(response.data.message || 'If an account exists with this email, you will receive a password reset link');
      setEmail('');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to process request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Inner Banner */}
      <div className="inner-banner-section">
        <div className="image-area">
          <img src="/assets/images/bdcm1.jpg" alt="Forgot Password Banner" />
        </div>
        <div className="container content-area">
          <h1>Forgot Password</h1>
          <p>Reset your password to regain access</p>
        </div>
      </div>

      {/* Forgot Password Section */}
      <section className="auth-section section-padding">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-5 col-md-7">
              <div className="auth-card">
                <div style={{ padding: '40px' }}>
                  <h4 className="form-heading" style={{ marginBottom: '10px', color: '#08295E' }}>
                    Password Recovery
                  </h4>
                  <p className="form-subtext" style={{ marginBottom: '24px' }}>
                    Enter your email address and we'll send you a link to reset your password
                  </p>

                  <form onSubmit={handleSubmit} noValidate>
                    <div className="mb-4">
                      <label htmlFor="email" className="form-label">
                        Email Address <span className="text-danger">*</span>
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        placeholder="Enter your registered email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                        }}
                        required
                        autoComplete="email"
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary w-100"
                      disabled={loading || !email}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Sending...
                        </>
                      ) : (
                        'Send Reset Link'
                      )}
                    </button>

                    <div
                      style={{
                        marginTop: '20px',
                        textAlign: 'center',
                        display: 'flex',
                        gap: '8px',
                        justifyContent: 'center',
                        flexWrap: 'wrap'
                      }}
                    >
                      <span style={{ color: '#666', fontSize: '14px' }}>Remember your password?</span>
                      <Link
                        to="/login"
                        style={{
                          color: '#08295E',
                          fontWeight: '600',
                          textDecoration: 'none',
                          fontSize: '14px'
                        }}
                      >
                        Back to Login
                      </Link>
                    </div>
                  </form>

                  <div
                    style={{
                      marginTop: '28px',
                      padding: '16px',
                      backgroundColor: '#f0f8ff',
                      borderRadius: '6px',
                      borderLeft: '4px solid #08295E'
                    }}
                  >
                    <p style={{ fontSize: '13px', color: '#555', margin: '0 0 8px' }}>
                      <strong>💡 Tip:</strong>
                    </p>
                    <p style={{ fontSize: '13px', color: '#666', margin: '0' }}>
                      Password reset links are valid for 1 hour. Check your spam folder if you don't receive the email within a few minutes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ForgotPassword;
