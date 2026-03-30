import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NavBar = ({ onLogout }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const navLinks = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Booking Report', path: '/report' },
  ];

  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>
        <span style={styles.brandIcon}>⚽</span>
        <span style={styles.brandName}>Uplift Sports Arena</span>
      </div>

      <div style={styles.links}>
        {navLinks.map((link) => (
          <button
            key={link.path}
            onClick={() => navigate(link.path)}
            style={{
              ...styles.navBtn,
              ...(pathname === link.path ? styles.navBtnActive : {}),
            }}
          >
            {link.label}
          </button>
        ))}
      </div>

      <button onClick={onLogout} style={styles.logoutBtn}>
        Logout
      </button>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 32px',
    height: '64px',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    minWidth: '200px',
  },
  brandIcon: { fontSize: '22px' },
  brandName: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: '17px',
    letterSpacing: '0.4px',
  },
  links: {
    display: 'flex',
    gap: '8px',
  },
  navBtn: {
    padding: '7px 18px',
    background: 'rgba(255,255,255,0.08)',
    color: 'rgba(255,255,255,0.75)',
    border: '1.5px solid transparent',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  navBtnActive: {
    background: 'rgba(255,255,255,0.2)',
    color: '#ffffff',
    border: '1.5px solid rgba(255,255,255,0.5)',
    fontWeight: '700',
  },
  logoutBtn: {
    padding: '7px 18px',
    background: 'rgba(255,255,255,0.12)',
    color: '#ffffff',
    border: '1.5px solid rgba(255,255,255,0.35)',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    minWidth: '80px',
  },
};

export default NavBar;
