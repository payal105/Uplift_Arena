import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import api from '../api/axios';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success', 'error', or 'info'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    // Validation
    if (!password || !confirmPassword) {
      setMessageType('error');
      setMessage('Both password fields are required');
      return;
    }

    if (password.length < 6) {
      setMessageType('error');
      setMessage('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setMessageType('error');
      setMessage('Passwords do not match');
      return;
    }

    if (!token) {
      setMessageType('error');
      setMessage('Invalid reset link. Please request a new one.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/api/user_data/reset-password', {
        token,
        password
      });

      setMessageType('success');
      setMessage(response.data.message || 'Password reset successfully! Redirecting to login...');
      setPassword('');
      setConfirmPassword('');

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setMessageType('error');
      setMessage(err.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <>
        <div className="inner-banner-section">
          <div className="image-area">
            <img src="/assets/images/bdcm1.jpg" alt="Reset Password Banner" />
          </div>
          <div className="container content-area">
            <h1>Reset Password</h1>
            <p>Create a new password for your account</p>
          </div>
        </div>

        <section className="auth-section section-padding">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-5 col-md-7">
                <div className="auth-card">
                  <div style={{ padding: '40px', textAlign: 'center' }}>
                    <div
                      className="alert alert-danger"
                      style={{ padding: '16px', marginBottom: '20px' }}
                    >
                      <i className="fa-solid fa-exclamation-circle me-2"></i>
                      Invalid reset link. Please
                      <Link
                        to="/forgot-password"
                        style={{ marginLeft: '4px', fontWeight: '600' }}
                      >
                        request a new one
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      {/* Inner Banner */}
      <div className="inner-banner-section">
        <div className="image-area">
          <img src="/assets/images/bdcm1.jpg" alt="Reset Password Banner" />
        </div>
        <div className="container content-area">
          <h1>Reset Password</h1>
          <p>Create a new password for your account</p>
        </div>
      </div>

      {/* Reset Password Section */}
      <section className="auth-section section-padding">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-5 col-md-7">
              <div className="auth-card">
                <div style={{ padding: '40px' }}>
                  <h4 className="form-heading" style={{ marginBottom: '10px', color: '#08295E' }}>
                    Create New Password
                  </h4>
                  <p className="form-subtext" style={{ marginBottom: '24px' }}>
                    Enter a strong password to secure your account
                  </p>

                  {message && (
                    <div
                      className={`alert ${
                        messageType === 'success'
                          ? 'alert-success'
                          : messageType === 'error'
                          ? 'alert-danger'
                          : 'alert-info'
                      }`}
                      style={{ marginBottom: '20px', padding: '12px 16px' }}
                    >
                      {message}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} noValidate>
                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">
                        New Password <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          className="form-control"
                          id="password"
                          name="password"
                          placeholder="Enter new password (min 6 characters)"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            setMessage('');
                          }}
                          required
                          disabled={loading}
                        />
                        <button
                          type="button"
                          className="input-group-text password-toggle"
                          onClick={() => setShowPassword(!showPassword)}
                          tabIndex={-1}
                          disabled={loading}
                        >
                          <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </button>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label htmlFor="confirmPassword" className="form-label">
                        Confirm Password <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          className="form-control"
                          id="confirmPassword"
                          name="confirmPassword"
                          placeholder="Confirm your password"
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setMessage('');
                          }}
                          required
                          disabled={loading}
                        />
                        <button
                          type="button"
                          className="input-group-text password-toggle"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          tabIndex={-1}
                          disabled={loading}
                        >
                          <i className={`fa-solid ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary w-100"
                      disabled={loading || !password || !confirmPassword}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Resetting...
                        </>
                      ) : (
                        'Reset Password'
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
                      <span style={{ color: '#666', fontSize: '14px' }}>Back to login?</span>
                      <Link
                        to="/login"
                        style={{
                          color: '#08295E',
                          fontWeight: '600',
                          textDecoration: 'none',
                          fontSize: '14px'
                        }}
                      >
                        Login here
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
                      <strong>🔐 Password Tips:</strong>
                    </p>
                    <ul style={{ fontSize: '13px', color: '#666', margin: '0', paddingLeft: '18px' }}>
                      <li>Use at least 6 characters</li>
                      <li>Mix uppercase, lowercase, and numbers</li>
                      <li>Never share your password with anyone</li>
                    </ul>
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

export default ResetPassword;
