import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Login = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login');

  // --- Login State ---
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // --- Signup State ---
  const [signupData, setSignupData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  });
  const [signupError, setSignupError] = useState('');
  const [signupSuccess, setSignupSuccess] = useState('');
  const [signupLoading, setSignupLoading] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ─── Login Handlers ───────────────────────────────────────────────────────
  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    setLoginError('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      const res = await api.post('/api/users/login', {
        email: loginData.email,
        password: loginData.password,
      });
      localStorage.setItem('userToken', res.data.token);
      localStorage.setItem('userInfo', JSON.stringify(res.data.user));
      window.dispatchEvent(new Event('userAuthChanged'));
      navigate('/');
    } catch (err) {
      setLoginError(
        err.response?.data?.message || 'Login failed. Please try again.'
      );
    } finally {
      setLoginLoading(false);
    }
  };

  // ─── Signup Handlers ──────────────────────────────────────────────────────
  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
    setSignupError('');
    setSignupSuccess('');
  };

  const validateSignup = () => {
    const { fullName, email, mobile, password, confirmPassword } = signupData;
    if (!fullName.trim()) return 'Full name is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Enter a valid email address.';
    if (!/^[6-9]\d{9}$/.test(mobile)) return 'Enter a valid 10-digit mobile number.';
    if (password.length < 6) return 'Password must be at least 6 characters.';
    if (password !== confirmPassword) return 'Passwords do not match.';
    return null;
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    const error = validateSignup();
    if (error) { setSignupError(error); return; }

    setSignupLoading(true);
    setSignupError('');
    setSignupSuccess('');
    try {
      await api.post('/api/users/register', {
        name: signupData.fullName,
        email: signupData.email,
        phone: signupData.mobile,
        password: signupData.password,
      });
      setSignupSuccess('Account created successfully! Please log in.');
      setSignupData({ fullName: '', email: '', mobile: '', password: '', confirmPassword: '' });
      setTimeout(() => setActiveTab('login'), 1500);
    } catch (err) {
      setSignupError(
        err.response?.data?.message || 'Registration failed. Please try again.'
      );
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <>
      {/* Inner Banner */}
      <div className="inner-banner-section">
        <div className="image-area">
          <img src="/assets/images/bdcm1.jpg" alt="Login Banner" />
        </div>
        <div className="container content-area">
          <h1>{activeTab === 'login' ? 'Login' : 'Sign Up'}</h1>
          <p>{activeTab === 'login' ? 'Welcome back!' : 'Create your account'}</p>
        </div>
      </div>

      {/* Auth Section */}
      <section className="auth-section section-padding">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-5 col-md-7">
              <div className="auth-card">

                {/* Tabs */}
                <div className="auth-tabs">
                  <button
                    className={`auth-tab-btn${activeTab === 'login' ? ' active' : ''}`}
                    onClick={() => { setActiveTab('login'); setLoginError(''); }}
                    type="button"
                  >
                    Login
                  </button>
                  <button
                    className={`auth-tab-btn${activeTab === 'signup' ? ' active' : ''}`}
                    onClick={() => { setActiveTab('signup'); setSignupError(''); setSignupSuccess(''); }}
                    type="button"
                  >
                    Sign Up
                  </button>
                </div>

                {/* ── LOGIN FORM ── */}
                {activeTab === 'login' && (
                  <form className="auth-form" onSubmit={handleLoginSubmit} noValidate>
                    <h4 className="form-heading">Welcome Back</h4>
                    <p className="form-subtext">Login to your account to continue</p>

                    {loginError && (
                      <div className="alert alert-danger py-2">{loginError}</div>
                    )}

                    <div className="mb-3">
                      <label htmlFor="loginEmail" className="form-label">
                        Email Address <span className="text-danger">*</span>
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="loginEmail"
                        name="email"
                        placeholder="Enter your email"
                        value={loginData.email}
                        onChange={handleLoginChange}
                        required
                        autoComplete="email"
                      />
                    </div>

                    <div className="mb-4">
                      <label htmlFor="loginPassword" className="form-label">
                        Password <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <input
                          type={showLoginPassword ? 'text' : 'password'}
                          className="form-control"
                          id="loginPassword"
                          name="password"
                          placeholder="Enter your password"
                          value={loginData.password}
                          onChange={handleLoginChange}
                          required
                          autoComplete="current-password"
                        />
                        <button
                          type="button"
                          className="input-group-text password-toggle"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                          tabIndex={-1}
                        >
                          <i className={`fa-solid ${showLoginPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary w-100"
                      disabled={loginLoading}
                    >
                      {loginLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Logging in...
                        </>
                      ) : 'Login'}
                    </button>

                    <p className="switch-text mt-3 text-center">
                      Don't have an account?{' '}
                      <button
                        type="button"
                        className="btn-link-inline"
                        onClick={() => setActiveTab('signup')}
                      >
                        Sign up here
                      </button>
                    </p>
                  </form>
                )}

                {/* ── SIGNUP FORM ── */}
                {activeTab === 'signup' && (
                  <form className="auth-form" onSubmit={handleSignupSubmit} noValidate>
                    <h4 className="form-heading">Create Account</h4>
                    <p className="form-subtext">Fill in the details to get started</p>

                    {signupError && (
                      <div className="alert alert-danger py-2">{signupError}</div>
                    )}
                    {signupSuccess && (
                      <div className="alert alert-success py-2">{signupSuccess}</div>
                    )}

                    <div className="mb-3">
                      <label htmlFor="fullName" className="form-label">
                        Full Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="fullName"
                        name="fullName"
                        placeholder="Enter your full name"
                        value={signupData.fullName}
                        onChange={handleSignupChange}
                        required
                        autoComplete="name"
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="signupEmail" className="form-label">
                        Email Address <span className="text-danger">*</span>
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="signupEmail"
                        name="email"
                        placeholder="Enter your email"
                        value={signupData.email}
                        onChange={handleSignupChange}
                        required
                        autoComplete="email"
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="mobile" className="form-label">
                        Mobile Number <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">+91</span>
                        <input
                          type="tel"
                          className="form-control"
                          id="mobile"
                          name="mobile"
                          placeholder="10-digit mobile number"
                          value={signupData.mobile}
                          onChange={handleSignupChange}
                          maxLength={10}
                          required
                          autoComplete="tel"
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="signupPassword" className="form-label">
                        Password <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <input
                          type={showSignupPassword ? 'text' : 'password'}
                          className="form-control"
                          id="signupPassword"
                          name="password"
                          placeholder="Min. 6 characters"
                          value={signupData.password}
                          onChange={handleSignupChange}
                          required
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          className="input-group-text password-toggle"
                          onClick={() => setShowSignupPassword(!showSignupPassword)}
                          tabIndex={-1}
                        >
                          <i className={`fa-solid ${showSignupPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
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
                          placeholder="Re-enter your password"
                          value={signupData.confirmPassword}
                          onChange={handleSignupChange}
                          required
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          className="input-group-text password-toggle"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          tabIndex={-1}
                        >
                          <i className={`fa-solid ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary w-100"
                      disabled={signupLoading}
                    >
                      {signupLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Creating Account...
                        </>
                      ) : 'Create Account'}
                    </button>

                    <p className="switch-text mt-3 text-center">
                      Already have an account?{' '}
                      <button
                        type="button"
                        className="btn-link-inline"
                        onClick={() => setActiveTab('login')}
                      >
                        Login here
                      </button>
                    </p>
                  </form>
                )}

              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
