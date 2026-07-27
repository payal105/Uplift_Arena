import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.username || !form.password) {
      setError('Please fill in all fields')
      return
    }
    setLoading(true)
    try {
      const { data } = await api.post('/dev/login', { username: form.username, password: form.password })
      login(data.token, data.admin)
      navigate('/slots')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      {/* Animated bg orbs */}
      <div className="login-orb login-orb-1" />
      <div className="login-orb login-orb-2" />
      <div className="login-orb login-orb-3" />

      <div className="login-card glass-card-strong">
        {/* Header */}
        <div className="login-header">
          <div className="login-icon">⚡</div>
          <h1 className="login-title">Developer Dashboard</h1>
          <p className="login-subtitle">Uplift Sports Arena — Restricted Access</p>
        </div>

        {/* Warning badge */}
        <div className="login-warning">
          <span>🔐</span>
          <span>For authorized developers only. Admin credentials required.</span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label" htmlFor="login-username">Username</label>
            <input
              id="login-username"
              type="text"
              name="username"
              className="form-input"
              placeholder="payalDev"
              value={form.username}
              onChange={handleChange}
              autoComplete="username"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              name="password"
              className="form-input"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <div className="login-error">
              <span>⚠️</span> {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
            {loading ? (
              <><span className="mini-spinner" /> Authenticating…</>
            ) : (
              <><span>→</span> Sign In to Dashboard</>
            )}
          </button>
        </form>

        <p className="login-footer-note">
          Only <strong>AdminUser</strong> accounts (SUPER_ADMIN, SCOPED_ADMIN, TURF_MANAGER) can access this dashboard.
          Login with your <strong>username</strong> or email address.
        </p>
      </div>

      <style>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
          position: relative;
          overflow: hidden;
        }

        .login-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          animation: floatOrb 8s ease-in-out infinite;
        }
        .login-orb-1 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(102,126,234,0.25) 0%, transparent 70%);
          top: -200px; left: -200px;
        }
        .login-orb-2 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(118,75,162,0.2) 0%, transparent 70%);
          bottom: -150px; right: -100px;
          animation-delay: -3s;
        }
        .login-orb-3 {
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(67,233,123,0.12) 0%, transparent 70%);
          top: 50%; right: 10%;
          animation-delay: -5s;
        }

        @keyframes floatOrb {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }

        .login-card {
          position: relative;
          width: 100%;
          max-width: 440px;
          padding: 2.5rem;
          z-index: 10;
          animation: slideUp 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .login-header {
          text-align: center;
          margin-bottom: 1.75rem;
        }

        .login-icon {
          width: 64px; height: 64px;
          background: var(--grad-primary);
          border-radius: var(--radius-lg);
          display: flex; align-items: center; justify-content: center;
          font-size: 2rem;
          margin: 0 auto 1rem;
          box-shadow: var(--shadow-btn), 0 0 40px rgba(102,126,234,0.3);
        }

        .login-title {
          font-size: 1.6rem;
          font-weight: 800;
          background: var(--grad-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.4rem;
        }

        .login-subtitle {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .login-warning {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.75rem 1rem;
          background: rgba(246, 211, 101, 0.06);
          border: 1px solid rgba(246, 211, 101, 0.2);
          border-radius: var(--radius-md);
          font-size: 0.8rem;
          color: var(--accent-yellow);
          margin-bottom: 1.75rem;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .login-error {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: rgba(245, 87, 108, 0.1);
          border: 1px solid rgba(245, 87, 108, 0.25);
          border-radius: var(--radius-md);
          color: var(--accent-red);
          font-size: 0.875rem;
          font-weight: 500;
        }

        .mini-spinner {
          display: inline-block;
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        .login-footer-note {
          margin-top: 1.5rem;
          font-size: 0.75rem;
          color: var(--text-muted);
          text-align: center;
          line-height: 1.5;
        }
        .login-footer-note strong { color: var(--text-secondary); }

        @media (max-width: 480px) {
          .login-card { padding: 2rem 1.5rem; }
          .login-title { font-size: 1.35rem; }
        }
      `}</style>
    </div>
  )
}
