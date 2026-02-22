import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleGalleryClick = (e) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      // Navigate to home page, then scroll to gallery
      navigate('/');
      setTimeout(() => {
        const gallerySection = document.getElementById('gallery');
        if (gallerySection) {
          gallerySection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // Already on home page, just scroll
      const gallerySection = document.getElementById('gallery');
      if (gallerySection) {
        gallerySection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };
  return (
    <header>
      <div className="container">
        <div className="row justify-content-between align-items-center">
          <div className="col-auto">
            <img src="/assets/images/logo.png" alt="Logo" />
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
                      <a 
                        className="nav-link" 
                        href="#gallery"
                        onClick={handleGalleryClick}
                      >
                        Gallery
                      </a>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/coaching">
                        Coaching
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/rates">
                        Rate Card
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/membership">
                        Membership
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>
          </div>

          <div className="col-auto header-btn-col">
            <Link to="/contact" className="btn btn-primary">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
