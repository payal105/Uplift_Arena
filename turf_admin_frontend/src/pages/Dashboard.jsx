import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../api/axios';

const Dashboard = ({ onLogout }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalCities: 0,
    totalVenues: 0,
    totalTurfs: 0,
    totalBookings: 0
  });
  const [loading, setLoading] = useState(true);

  // Fetch dashboard stats on component mount
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/stats/dashboard');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load dashboard statistics',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  const menuCards = [
    {
      title: 'Cities',
      icon: 'fa-city',
      description: 'Manage cities and locations',
      color: '#667eea',
      path: '/cities'
    },
    {
      title: 'Venues',
      icon: 'fa-building',
      description: 'Manage venue information',
      color: '#764ba2',
      path: '/venues'
    },
    {
      title: 'Turfs',
      icon: 'fa-futbol',
      description: 'Manage turf details',
      color: '#f093fb',
      path: '/turfs'
    },
    {
      title: 'Slots',
      icon: 'fa-clock',
      description: 'Manage time slots',
      color: '#4facfe',
      path: '/slots'
    },
    {
      title: 'Bookings',
      icon: 'fa-calendar-check',
      description: 'View and manage bookings',
      color: '#43e97b',
      path: '/bookings'
    }
  ];

  const handleLogoutClick = async () => {
    const result = await Swal.fire({
      title: 'Logout?',
      text: 'Are you sure you want to logout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#667eea',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      onLogout();
      Swal.fire({
        icon: 'success',
        title: 'Logged Out',
        text: 'You have been logged out successfully',
        timer: 1500,
        showConfirmButton: false
      });
    }
  };

  return (
    <div className="dashboard-page" style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        color: 'white',
        padding: '20px 0',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        zIndex: 9999
      }}>
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-0 fw-bold">Admin Dashboard</h2>
              <p className="mb-0 opacity-75">Turf Management System</p>
            </div>
            <button
              onClick={handleLogoutClick}
              className="btn btn-light"
              style={{ borderRadius: '25px', padding: '10px 30px' }}
            >
              <i className="fas fa-sign-out-alt me-2"></i>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div style={{ height: '80px' }}></div>

      {/* Dashboard Content */}
      <div className="container py-5">
        <div className="row mb-4">
          <div className="col-12">
            <h3 className="fw-bold mb-3">Management Modules</h3>
            <p className="text-muted">Select a module to manage</p>
          </div>
        </div>

        <div className="row g-4">
          {menuCards.map((card, index) => (
            <div key={index} className="col-md-6 col-lg-4">
              <div
                className="card h-100 shadow-sm border-0"
                style={{
                  cursor: 'pointer',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  borderRadius: '15px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                }}
                onClick={() => {
                  if (card.path === '/bookings') {
                    Swal.fire({
                      icon: 'info',
                      title: card.title,
                      text: 'This feature is coming soon!',
                      confirmButtonColor: card.color
                    });
                  } else {
                    navigate(card.path);
                  }
                }}
              >
                <div className="card-body p-4">
                  <div
                    className="d-flex align-items-center justify-content-center mb-3"
                    style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${card.color} 0%, ${card.color}dd 100%)`,
                      color: 'white'
                    }}
                  >
                    <i className={`fas ${card.icon} fa-2x`}></i>
                  </div>
                  <h4 className="card-title fw-bold mb-2">{card.title}</h4>
                  <p className="card-text text-muted mb-0">{card.description}</p>
                </div>
                <div className="card-footer bg-transparent border-0 p-4 pt-0">
                  <span
                    className="text-decoration-none fw-semibold"
                    style={{ color: card.color }}
                  >
                    Manage <i className="fas fa-arrow-right ms-2"></i>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="row mt-5">
          <div className="col-12">
            <h3 className="fw-bold mb-3">Quick Stats</h3>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm" style={{ borderRadius: '15px' }}>
              <div className="card-body text-center p-4">
                {loading ? (
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : (
                  <h2 className="fw-bold mb-2" style={{ color: '#667eea' }}>{stats.totalCities}</h2>
                )}
                <p className="text-muted mb-0">Total Cities</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm" style={{ borderRadius: '15px' }}>
              <div className="card-body text-center p-4">
                {loading ? (
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : (
                  <h2 className="fw-bold mb-2" style={{ color: '#764ba2' }}>{stats.totalVenues}</h2>
                )}
                <p className="text-muted mb-0">Total Venues</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm" style={{ borderRadius: '15px' }}>
              <div className="card-body text-center p-4">
                {loading ? (
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : (
                  <h2 className="fw-bold mb-2" style={{ color: '#f093fb' }}>{stats.totalTurfs}</h2>
                )}
                <p className="text-muted mb-0">Total Turfs</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm" style={{ borderRadius: '15px' }}>
              <div className="card-body text-center p-4">
                {loading ? (
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : (
                  <h2 className="fw-bold mb-2" style={{ color: '#43e97b' }}>{stats.totalBookings}</h2>
                )}
                <p className="text-muted mb-0">Total Bookings</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
