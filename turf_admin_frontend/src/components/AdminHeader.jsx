import React from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const AdminHeader = ({ title, onLogout }) => {
  const navigate = useNavigate();

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
    <>
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
              <button 
                onClick={() => navigate('/dashboard')}
                className="btn btn-link text-white text-decoration-none p-0 me-3"
              >
                <i className="fas fa-arrow-left me-2"></i>
                Back to Dashboard
              </button>
              <h2 className="mb-0 fw-bold d-inline-block">{title}</h2>
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
      <div style={{ height: '80px' }}></div>
    </>
  );
};

export default AdminHeader;
