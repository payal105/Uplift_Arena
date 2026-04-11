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
                <div className="col-md-6 col-lg-4 mb-3">
                  <div className="feature-card">
                    <div className="feature-icon">
                      <i className="fa-solid fa-users"></i>
                    </div>
                    <h5>Manage Users</h5>
                    <p>View, edit, and manage user accounts</p>
                    <button className="btn btn-primary btn-sm" disabled>
                      <i className="fa-solid fa-arrow-right me-2"></i>Go
                    </button>
                  </div>
                </div>

                <div className="col-md-6 col-lg-4 mb-3">
                  <div className="feature-card">
                    <div className="feature-icon">
                      <i className="fa-solid fa-calendar"></i>
                    </div>
                    <h5>View Bookings</h5>
                    <p>Track all booking reservations</p>
                    <button className="btn btn-primary btn-sm" onClick={() => navigate('/view-bookings')}>
                      <i className="fa-solid fa-arrow-right me-2"></i>Go
                    </button>
                  </div>
                </div>

                <div className="col-md-6 col-lg-4 mb-3">
                  <div className="feature-card">
                    <div className="feature-icon">
                      <i className="fa-solid fa-money-check-dollar"></i>
                    </div>
                    <h5>Revenue Reports</h5>
                    <p>Analyze revenue and payments</p>
                    <button className="btn btn-primary btn-sm" disabled>
                      <i className="fa-solid fa-arrow-right me-2"></i>Go
                    </button>
                  </div>
                </div>

                <div className="col-md-6 col-lg-4 mb-3">
                  <div className="feature-card">
                    <div className="feature-icon">
                      <i className="fa-solid fa-person-hiking"></i>
                    </div>
                    <h5>Manage Turfs</h5>
                    <p>Configure turf properties and rates</p>
                    <button className="btn btn-primary btn-sm" disabled>
                      <i className="fa-solid fa-arrow-right me-2"></i>Go
                    </button>
                  </div>
                </div>

                <div className="col-md-6 col-lg-4 mb-3">
                  <div className="feature-card">
                    <div className="feature-icon">
                      <i className="fa-solid fa-clock"></i>
                    </div>
                    <h5>Manage Slots</h5>
                    <p>Set available time slots</p>
                    <button className="btn btn-primary btn-sm" disabled>
                      <i className="fa-solid fa-arrow-right me-2"></i>Go
                    </button>
                  </div>
                </div>

                <div className="col-md-6 col-lg-4 mb-3">
                  <div className="feature-card">
                    <div className="feature-icon">
                      <i className="fa-solid fa-cog"></i>
                    </div>
                    <h5>System Settings</h5>
                    <p>Configure system preferences</p>
                    <button className="btn btn-primary btn-sm" disabled>
                      <i className="fa-solid fa-arrow-right me-2"></i>Go
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
