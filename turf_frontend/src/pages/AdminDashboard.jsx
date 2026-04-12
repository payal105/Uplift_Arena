import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalCities: 0,
    totalVenues: 0,
    totalTurfs: 0,
    totalBookings: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
      navigate('/login');
      return;
    }
    const userData = JSON.parse(userInfo);
    if (userData.isAdmin !== 1) {
      navigate('/');
      return;
    }
    setUser(userData);
    fetchStats();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/stats/dashboard');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Set default stats if API fails
      setStats({
        totalCities: 0,
        totalVenues: 0,
        totalTurfs: 0,
        totalBookings: 0
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="container py-5">
        <div className="row mb-4">
          <div className="col-12">
            <div className="admin-header">
              <div>
                <h1 className="admin-title">Admin Dashboard</h1>
                <p className="admin-subtitle">Welcome, {user?.name}! Manage your turf booking system</p>
              </div>
              <div className="admin-badge">
                <i className="fa-solid fa-shield me-2"></i>Administrator
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="admin-features">
              <h3 className="mb-4">Management Tools</h3>
              <div className="row">
                <div className="col-md-6 col-lg-6 mb-3">
                  <div className="feature-card">
                    <div className="feature-icon">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" style={{color: 'white'}}>
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                    <h5>View Users</h5>
                    <p>View all registered user accounts</p>
                    <button className="btn btn-primary btn-sm" onClick={() => navigate('/view-users')}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: '8px', display: 'inline'}}>
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                      Go
                    </button>
                  </div>
                </div>

                <div className="col-md-6 col-lg-6 mb-3">
                  <div className="feature-card">
                    <div className="feature-icon">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" style={{color: 'white'}}>
                        <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/>
                      </svg>
                    </div>
                    <h5>View Bookings</h5>
                    <p>Track all booking reservations</p>
                    <button className="btn btn-primary btn-sm" onClick={() => navigate('/view-bookings')}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: '8px', display: 'inline'}}>
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                      Go
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
