import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
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
