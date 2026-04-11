import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  // Close the mobile menu automatically upon navigation
  useEffect(() => {
    const navbarCollapse = document.getElementById('navbarText');
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
      const toggler = document.querySelector('.navbar-toggler');
      if (toggler) toggler.click();
    }
  }, [location]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const loadUser = () => {
    const info = localStorage.getItem('userInfo');
    setUser(info ? JSON.parse(info) : null);
  };

  useEffect(() => {
    loadUser();
    window.addEventListener('userAuthChanged', loadUser);
    return () => window.removeEventListener('userAuthChanged', loadUser);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userInfo');
    setUser(null);
    setDropdownOpen(false);
    window.dispatchEvent(new Event('userAuthChanged'));
    navigate('/');
  };

  return (
    <header>
      <div className="container">
        <div className="row justify-content-between align-items-center">
          <div className="col-auto">
            <img src="/assets/images/logo.jpg" alt="Logo" />
          </div>

          <div className="col-auto header-nav">
            <nav className="navbar navbar-expand-lg">
              <div className="container-fluid">
                <button
                  className="navbar-toggler"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#navbarText"
                  aria-controls="navbarText"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarText">
                  <ul className="navbar-nav me-auto mb-lg-0">
                    <li className="nav-item">
                      <Link className="nav-link" to="/">
                        Home
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/membership">
                        Membership
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/contact">
                        Contact Us
                      </Link>
                    </li>
                    {user && user.isAdmin === 1 && (
                      <li className="nav-item">
                        <Link className="nav-link" to="/admin-dashboard" style={{ color: '#FF6B6B', fontWeight: 600 }}>
                          <i className="fa-solid fa-gauge me-1"></i>Admin Dashboard
                        </Link>
                      </li>
                    )}
                    {/* Mobile Authentication Menu */}
                    <li className="nav-item d-lg-none" style={{ borderBottom: 'none' }}>
                      {user ? (
                        <div className="d-flex flex-column">
                          <div className="px-3 py-3 text-primary" style={{ fontWeight: 700, backgroundColor: '#f8f9fa', borderBottom: '1px solid rgb(226, 226, 226)' }}>
                            <i className="fa-solid fa-circle-user me-2"></i>
                            {user.name}
                          </div>
                          {user && user.isAdmin === 1 ? (
                            <Link className="nav-link w-100 m-0" to="/admin-dashboard" style={{ borderBottom: '1px solid rgb(226, 226, 226)', color: '#FF6B6B', fontWeight: 600 }}>
                              <i className="fa-solid fa-gauge me-2"></i>Admin Dashboard
                            </Link>
                          ) : (
                            <>
                              <Link className="nav-link w-100 m-0" to="/my-bookings" style={{ borderBottom: '1px solid rgb(226, 226, 226)' }}>
                                <i className="fa-solid fa-calendar-check me-2"></i>My Bookings
                              </Link>
                              <Link className="nav-link w-100 m-0" to="/my-membership" style={{ borderBottom: '1px solid rgb(226, 226, 226)' }}>
                                <i className="fa-solid fa-id-card me-2"></i>My Membership Plan
                              </Link>
                            </>
                          )}
                          <button 
                            className="nav-link w-100 border-0 bg-transparent text-danger m-0" 
                            style={{ fontWeight: 600, padding: '15px' }}
                            onClick={handleLogout}
                          >
                            <i className="fa-solid fa-right-from-bracket me-2"></i>Logout
                          </button>
                        </div>
                      ) : (
                        <Link className="nav-link w-100 m-0" to="/login" style={{ fontWeight: 700, color: '#08295E' }}>
                          Login / Signup
                        </Link>
                      )}
                    </li>
                  </ul>
                </div>
              </div>
            </nav>
          </div>

          <div className="col-auto header-btn-col">
            {user ? (
              <div className="user-dropdown" ref={dropdownRef}>
                <button
                  className="btn btn-primary user-btn"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  type="button"
                >
                  <i className="fa-solid fa-circle-user me-2"></i>
                  {user.name}
                  <i className={`fa-solid fa-chevron-down ms-2 dropdown-chevron${dropdownOpen ? ' open' : ''}`}></i>
                </button>
                {dropdownOpen && (
                  <div className="user-dropdown-menu">
                    <div className="user-dropdown-header">
                      <i className="fa-solid fa-circle-user"></i>
                      <div>
                        <div className="user-dropdown-name">{user.name}</div>
                        <div className="user-dropdown-email">{user.email}</div>
                      </div>
                    </div>
                    <div className="user-dropdown-divider"></div>
                    {user && user.isAdmin === 1 ? (
                      <Link to="/admin-dashboard" className="user-dropdown-item" onClick={() => setDropdownOpen(false)} style={{ color: '#FF6B6B', fontWeight: 600 }}>
                        <i className="fa-solid fa-gauge me-2"></i>
                        Admin Dashboard
                      </Link>
                    ) : (
                      <>
                        <Link to="/my-bookings" className="user-dropdown-item" onClick={() => setDropdownOpen(false)}>
                          <i className="fa-solid fa-calendar-check me-2"></i>
                          My Bookings
                        </Link>
                        <Link to="/my-membership" className="user-dropdown-item" onClick={() => setDropdownOpen(false)}>
                          <i className="fa-solid fa-id-card me-2"></i>
                          My Membership Plan
                        </Link>
                      </>
                    )}
                    <div className="user-dropdown-divider"></div>
                    <button className="user-dropdown-item logout" onClick={handleLogout}>
                      <i className="fa-solid fa-right-from-bracket me-2"></i>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary">
                Login / Signup
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
