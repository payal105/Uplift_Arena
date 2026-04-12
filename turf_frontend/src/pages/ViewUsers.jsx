import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './ViewUsers.css';

const ViewUsers = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

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
    fetchUsers();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/user_data');
      console.log('Users API Response:', response.data);
      
      // Filter out admin users (isAdmin = 1) and only show regular users
      let usersList = [];
      if (Array.isArray(response.data)) {
        usersList = response.data;
      } else if (response.data.users && Array.isArray(response.data.users)) {
        usersList = response.data.users;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        usersList = response.data.data;
      }

      // Filter out admins (isAdmin = 1)
      const nonAdminUsers = usersList.filter(u => u.isAdmin !== 1);
      setUsers(nonAdminUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="view-users-page">
      <div className="users-page-header"></div>

      <div className="container users-page-container">
        <div className="users-header-section mb-5">
          <h2 className="header-title">User Management</h2>
          <p className="header-subtitle">Registered Users ({users.length})</p>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : users.length > 0 ? (
          <div className="users-cards-grid">
            {users.map((user, index) => (
              <div key={index} className="user-card">
                {user.isMember === 1 && (
                  <span className="member-badge">Member</span>
                )}
                <div className="user-card-body">
                  <h5 className="user-name">{user.name || 'N/A'}</h5>
                  <div className="user-details">
                    <p><strong>Email:</strong> {user.email || 'N/A'}</p>
                    <p><strong>Phone:</strong> {user.phone || 'N/A'}</p>
                    <p><strong>Joined:</strong> {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="alert alert-info" role="alert">
            <i className="fa-solid fa-circle-info me-2"></i>
            No users found.
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewUsers;
