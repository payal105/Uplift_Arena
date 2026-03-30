import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';

const Dashboard = ({ onLogout }) => {
  const navigate = useNavigate();
  return (
    <div style={styles.page}>
      <NavBar onLogout={onLogout} />

      {/* Main Content */}
      <main style={styles.main}>
        <div style={styles.welcomeCard}>
          <div style={styles.welcomeIcon}>🏆</div>
          <h1 style={styles.welcomeHeading}>Welcome to Admin Portal</h1>
          <p style={styles.welcomeSubtext}>
            You are successfully logged in. Manage your sports arena from here.
          </p>
          <button onClick={() => navigate('/report')} style={styles.reportBtn}>
            📊 View Booking Report
          </button>
        </div>

        {/* Stats Row */}
        <div style={styles.statsGrid}>
          {stats.map((stat) => (
            <div key={stat.label} style={styles.statCard}>
              <div style={styles.statIcon}>{stat.icon}</div>
              <div>
                <p style={styles.statLabel}>{stat.label}</p>
                <p style={styles.statValue}>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

const stats = [
  { icon: '🏟️', label: 'Total Venues', value: '--' },
  { icon: '🌿', label: 'Total Turfs', value: '--' },
  { icon: '📅', label: 'Bookings Today', value: '--' },
  { icon: '🏙️', label: 'Cities', value: '--' },
];

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f0f2f5',
    display: 'flex',
    flexDirection: 'column',
  },
  main: {
    flex: 1,
    padding: '40px 32px',
    maxWidth: '1100px',
    margin: '0 auto',
    width: '100%',
  },
  welcomeCard: {
    background: '#ffffff',
    borderRadius: '16px',
    padding: '48px 40px',
    textAlign: 'center',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    marginBottom: '32px',
  },
  welcomeIcon: {
    fontSize: '56px',
    marginBottom: '16px',
  },
  welcomeHeading: {
    fontSize: '32px',
    fontWeight: '800',
    color: '#1a1a2e',
    marginBottom: '12px',
  },
  welcomeSubtext: {
    fontSize: '16px',
    color: '#6c757d',
    maxWidth: '480px',
    margin: '0 auto',
    lineHeight: '1.6',
  },
  reportBtn: {
    marginTop: '24px',
    padding: '12px 30px',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
    gap: '20px',
  },
  statCard: {
    background: '#ffffff',
    borderRadius: '12px',
    padding: '24px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
  },
  statIcon: {
    fontSize: '36px',
  },
  statLabel: {
    fontSize: '13px',
    color: '#6c757d',
    marginBottom: '4px',
  },
  statValue: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#1a1a2e',
  },
};

export default Dashboard;
