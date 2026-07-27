import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

const NAV = [
  { to: '/slots', icon: '🗓️', label: 'Slot Manager' },
  { to: '/users', icon: '👥', label: 'User Manager' },
]

export default function Sidebar({ collapsed, onToggle }) {
  const { admin, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      {/* Mobile hamburger */}
      <button className="sidebar-hamburger" onClick={() => setMobileOpen(p => !p)} aria-label="Toggle menu">
        <span>{mobileOpen ? '✕' : '☰'}</span>
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="sidebar-mobile-overlay" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">⚡</div>
          {!collapsed && (
            <div className="sidebar-logo-text">
              <span className="sidebar-logo-title">Dev Dashboard</span>
              <span className="sidebar-logo-sub">Uplift Sports Arena</span>
            </div>
          )}
        </div>

        {/* Collapse toggle (desktop) */}
        <button className="sidebar-collapse-btn" onClick={onToggle} aria-label="Collapse sidebar">
          {collapsed ? '›' : '‹'}
        </button>

        {/* Nav */}
        <nav className="sidebar-nav">
          {NAV.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `sidebar-nav-item${isActive ? ' active' : ''}`}
              onClick={() => setMobileOpen(false)}
              title={collapsed ? label : undefined}
            >
              <span className="sidebar-nav-icon">{icon}</span>
              {!collapsed && <span className="sidebar-nav-label">{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Bottom admin info + logout */}
        <div className="sidebar-footer">
          {!collapsed && (
            <div className="sidebar-admin">
              <div className="sidebar-admin-avatar">
                {admin?.name?.[0]?.toUpperCase() || 'D'}
              </div>
              <div className="sidebar-admin-info">
                <span className="sidebar-admin-name">{admin?.name || 'Developer'}</span>
                <span className="sidebar-admin-role">{admin?.role || 'ADMIN'}</span>
              </div>
            </div>
          )}
          <button className="sidebar-logout" onClick={handleLogout} title="Logout">
            <span>🚪</span>
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <style>{`
        /* ── Sidebar ───────────────────────────────── */
        .sidebar {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          width: var(--sidebar-w);
          background: rgba(15, 22, 41, 0.95);
          backdrop-filter: blur(20px);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          z-index: 200;
          transition: width var(--transition-slow);
          overflow: hidden;
        }

        .sidebar.collapsed { width: var(--sidebar-collapsed); }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1.5rem 1.25rem;
          border-bottom: 1px solid var(--border);
          min-height: 72px;
        }

        .sidebar-logo-icon {
          width: 38px;
          height: 38px;
          min-width: 38px;
          background: var(--grad-primary);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          box-shadow: var(--shadow-btn);
        }

        .sidebar-logo-text { display: flex; flex-direction: column; overflow: hidden; }
        .sidebar-logo-title {
          font-size: 0.95rem;
          font-weight: 800;
          color: var(--text-primary);
          white-space: nowrap;
        }
        .sidebar-logo-sub {
          font-size: 0.7rem;
          color: var(--text-secondary);
          white-space: nowrap;
        }

        .sidebar-collapse-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: 1px solid var(--border);
          color: var(--text-secondary);
          cursor: pointer;
          font-size: 1.2rem;
          padding: 0.5rem;
          margin: 0.75rem 1rem;
          border-radius: var(--radius-sm);
          transition: var(--transition);
          align-self: flex-end;
          line-height: 1;
        }
        .sidebar-collapse-btn:hover {
          color: var(--text-primary);
          background: var(--bg-glass-hover);
          border-color: var(--border-accent);
        }

        .sidebar-nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          padding: 0.75rem 0.75rem;
          overflow-y: auto;
        }

        .sidebar-nav-item {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: 0.75rem 0.9rem;
          border-radius: var(--radius-md);
          text-decoration: none;
          color: var(--text-secondary);
          font-size: 0.9rem;
          font-weight: 500;
          transition: var(--transition);
          white-space: nowrap;
        }

        .sidebar-nav-item:hover {
          background: var(--bg-glass-hover);
          color: var(--text-primary);
        }

        .sidebar-nav-item.active {
          background: rgba(102, 126, 234, 0.15);
          color: var(--accent-primary);
          border: 1px solid rgba(102, 126, 234, 0.25);
          font-weight: 600;
        }

        .sidebar-nav-icon { font-size: 1.15rem; min-width: 22px; text-align: center; }
        .sidebar-nav-label { overflow: hidden; text-overflow: ellipsis; }

        .sidebar-footer {
          border-top: 1px solid var(--border);
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .sidebar-admin {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.6rem 0.5rem;
        }

        .sidebar-admin-avatar {
          width: 36px;
          height: 36px;
          min-width: 36px;
          background: var(--grad-primary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 0.9rem;
          color: white;
        }

        .sidebar-admin-info { display: flex; flex-direction: column; overflow: hidden; }
        .sidebar-admin-name {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .sidebar-admin-role {
          font-size: 0.7rem;
          color: var(--accent-primary);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .sidebar-logout {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.65rem 0.9rem;
          background: rgba(245, 87, 108, 0.08);
          border: 1px solid rgba(245, 87, 108, 0.2);
          border-radius: var(--radius-md);
          color: var(--accent-red);
          cursor: pointer;
          font-family: var(--font);
          font-size: 0.85rem;
          font-weight: 600;
          transition: var(--transition);
          white-space: nowrap;
        }
        .sidebar-logout:hover { background: rgba(245, 87, 108, 0.15); }

        /* ── Hamburger (mobile) ─────────────────────── */
        .sidebar-hamburger {
          display: none;
          position: fixed;
          top: 1rem;
          left: 1rem;
          z-index: 300;
          width: 42px;
          height: 42px;
          background: var(--bg-glass-strong);
          backdrop-filter: blur(12px);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          color: var(--text-primary);
          font-size: 1.2rem;
          cursor: pointer;
          align-items: center;
          justify-content: center;
        }

        .sidebar-mobile-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6);
          z-index: 150;
        }

        @media (max-width: 768px) {
          .sidebar {
            transform: translateX(-100%);
            width: var(--sidebar-w) !important;
            transition: transform var(--transition-slow);
          }
          .sidebar.mobile-open { transform: translateX(0); }
          .sidebar-hamburger { display: flex; }
          .sidebar-mobile-overlay { display: block; }
          .sidebar-collapse-btn { display: none; }
        }
      `}</style>
    </>
  )
}
