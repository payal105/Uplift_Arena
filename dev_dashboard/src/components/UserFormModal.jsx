import { useState } from 'react'

const EMPTY_FORM = {
  name: '',
  email: '',
  phone: '',
  city: '',
  password: '',
  isActive: true,
  isMember: 0,
}

export default function UserFormModal({ user, onClose, onSave, loading }) {
  const isEdit = !!user?._id
  const [form, setForm] = useState(
    isEdit
      ? {
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          city: user.city || '',
          password: '',
          isActive: user.isActive ?? true,
          isMember: user.isMember ?? 0,
        }
      : { ...EMPTY_FORM }
  )
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(p => ({
      ...p,
      [name]: type === 'checkbox' ? checked : value,
    }))
    setErrors(p => ({ ...p, [name]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.email.trim()) errs.email = 'Email is required'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Enter a valid email'
    }
    if (!isEdit && !form.password) errs.password = 'Password is required for new users'
    return errs
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    const payload = { ...form, isMember: Number(form.isMember) }
    if (!payload.password) delete payload.password  // don't send empty password on edit
    onSave(payload)
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal glass-card-strong">
        <div className="modal-header">
          <h2 className="modal-title">{isEdit ? '✏️ Edit User' : '➕ Add New User'}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="user-form-grid">
              {/* Name */}
              <div className="form-group">
                <label className="form-label" htmlFor="uf-name">Full Name *</label>
                <input
                  id="uf-name"
                  type="text"
                  name="name"
                  className={`form-input${errors.name ? ' input-error' : ''}`}
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                />
                {errors.name && <span className="field-error">{errors.name}</span>}
              </div>

              {/* Email */}
              <div className="form-group">
                <label className="form-label" htmlFor="uf-email">Email Address *</label>
                <input
                  id="uf-email"
                  type="email"
                  name="email"
                  className={`form-input${errors.email ? ' input-error' : ''}`}
                  placeholder="user@example.com"
                  value={form.email}
                  onChange={handleChange}
                />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>

              {/* Phone */}
              <div className="form-group">
                <label className="form-label" htmlFor="uf-phone">Phone</label>
                <input
                  id="uf-phone"
                  type="tel"
                  name="phone"
                  className="form-input"
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>

              {/* City */}
              <div className="form-group">
                <label className="form-label" htmlFor="uf-city">City</label>
                <input
                  id="uf-city"
                  type="text"
                  name="city"
                  className="form-input"
                  placeholder="Kolkata"
                  value={form.city}
                  onChange={handleChange}
                />
              </div>

              {/* Password */}
              <div className="form-group">
                <label className="form-label" htmlFor="uf-password">
                  {isEdit ? 'New Password (leave blank to keep)' : 'Password *'}
                </label>
                <input
                  id="uf-password"
                  type="password"
                  name="password"
                  className={`form-input${errors.password ? ' input-error' : ''}`}
                  placeholder={isEdit ? '••••••••' : 'Min 6 characters'}
                  value={form.password}
                  onChange={handleChange}
                />
                {errors.password && <span className="field-error">{errors.password}</span>}
                {!isEdit && (
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Default: <strong>Uplift@123</strong> if left blank
                  </span>
                )}
              </div>

              {/* isMember */}
              <div className="form-group">
                <label className="form-label" htmlFor="uf-member">Membership Status</label>
                <select id="uf-member" name="isMember" className="form-select" value={form.isMember} onChange={handleChange}>
                  <option value={0}>Non-Member</option>
                  <option value={1}>Member</option>
                </select>
              </div>
            </div>

            {/* isActive toggle */}
            <label className="toggle-row" htmlFor="uf-active">
              <div>
                <div className="toggle-label">Account Active</div>
                <div className="toggle-sub">Inactive users cannot log in</div>
              </div>
              <div className={`toggle-switch${form.isActive ? ' on' : ''}`}>
                <input
                  id="uf-active"
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                  style={{ display: 'none' }}
                />
                <div className="toggle-knob" />
              </div>
            </label>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? '⟳ Saving…' : isEdit ? '✓ Save Changes' : '➕ Create User'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .user-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.1rem;
          margin-bottom: 1.25rem;
        }

        .input-error { border-color: var(--accent-red) !important; }

        .field-error {
          font-size: 0.75rem;
          color: var(--accent-red);
          margin-top: 0.15rem;
        }

        .toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 0.9rem 1rem;
          background: var(--bg-glass);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: var(--transition);
        }
        .toggle-row:hover { background: var(--bg-glass-hover); }
        .toggle-label { font-size: 0.875rem; font-weight: 600; color: var(--text-primary); }
        .toggle-sub { font-size: 0.75rem; color: var(--text-muted); margin-top: 0.15rem; }

        .toggle-switch {
          width: 44px; height: 24px;
          background: rgba(255,255,255,0.12);
          border-radius: 999px;
          position: relative;
          transition: var(--transition);
          flex-shrink: 0;
        }
        .toggle-switch.on { background: var(--accent-green); }
        .toggle-knob {
          position: absolute;
          top: 3px; left: 3px;
          width: 18px; height: 18px;
          background: white;
          border-radius: 50%;
          transition: var(--transition);
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        .toggle-switch.on .toggle-knob { transform: translateX(20px); }

        @media (max-width: 520px) {
          .user-form-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  )
}
