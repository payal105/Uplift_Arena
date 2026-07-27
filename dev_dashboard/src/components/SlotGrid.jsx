import api from '../api/axios'

const STATUS_COLOR = {
  AVAILABLE: '#43e97b',
  BLOCKED: '#f5576c',
  BOOKED: '#fda085',
}

const STATUS_ICON = {
  AVAILABLE: '✓',
  BLOCKED: '✕',
  BOOKED: '🔒',
}

export default function SlotGrid({ slots, loading, onToggle, togglingId }) {
  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner" />
        <span>Loading slots…</span>
      </div>
    )
  }

  if (!slots || slots.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🗓️</div>
        <div className="empty-state-text">No slots found for this selection.</div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Slots are auto-generated for active turfs. Select a different date or turf.
        </div>
      </div>
    )
  }

  const available = slots.filter(s => s.status === 'AVAILABLE').length
  const blocked = slots.filter(s => s.status === 'BLOCKED').length
  const booked = slots.filter(s => s.status === 'BOOKED').length

  return (
    <div>
      {/* Summary row */}
      <div className="slot-summary">
        <div className="slot-stat" style={{ '--c': '#43e97b' }}>
          <span className="slot-stat-dot" />
          <span className="slot-stat-label">Available</span>
          <span className="slot-stat-val">{available}</span>
        </div>
        <div className="slot-stat" style={{ '--c': '#f5576c' }}>
          <span className="slot-stat-dot" />
          <span className="slot-stat-label">Blocked</span>
          <span className="slot-stat-val">{blocked}</span>
        </div>
        <div className="slot-stat" style={{ '--c': '#fda085' }}>
          <span className="slot-stat-dot" />
          <span className="slot-stat-label">Booked</span>
          <span className="slot-stat-val">{booked}</span>
        </div>
        <div className="slot-stat" style={{ '--c': '#667eea' }}>
          <span className="slot-stat-dot" />
          <span className="slot-stat-label">Total</span>
          <span className="slot-stat-val">{slots.length}</span>
        </div>
      </div>

      {/* Grid */}
      <div className="slot-grid">
        {slots.map(slot => {
          const isToggling = togglingId === slot._id
          const canToggle = slot.status !== 'BOOKED'
          const color = STATUS_COLOR[slot.status]

          return (
            <button
              key={slot._id}
              className={`slot-chip status-${slot.status.toLowerCase()}${isToggling ? ' toggling' : ''}${!canToggle ? ' locked' : ''}`}
              onClick={() => canToggle && onToggle(slot)}
              disabled={isToggling || !canToggle}
              title={canToggle ? `Click to ${slot.status === 'AVAILABLE' ? 'block' : 'unblock'}` : 'Slot is booked — cannot change'}
            >
              <span className="slot-chip-time">
                {slot.startTime} – {slot.endTime}
              </span>
              <span className="slot-chip-status">
                {isToggling ? '⟳' : STATUS_ICON[slot.status]} {slot.status}
              </span>
            </button>
          )
        })}
      </div>

      <style>{`
        .slot-summary {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .slot-stat {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.9rem;
          background: var(--bg-glass);
          border: 1px solid var(--border);
          border-radius: 999px;
          font-size: 0.8rem;
        }

        .slot-stat-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: var(--c);
        }

        .slot-stat-label { color: var(--text-secondary); }
        .slot-stat-val { font-weight: 700; color: var(--c); }

        .slot-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 0.75rem;
        }

        .slot-chip {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.35rem;
          padding: 0.85rem 1rem;
          border-radius: var(--radius-md);
          border: 1px solid transparent;
          cursor: pointer;
          font-family: var(--font);
          transition: var(--transition);
          text-align: left;
        }

        .slot-chip:not(:disabled):hover { transform: translateY(-2px); }

        .slot-chip.status-available {
          background: rgba(67, 233, 123, 0.08);
          border-color: rgba(67, 233, 123, 0.25);
        }
        .slot-chip.status-available:hover:not(:disabled) {
          background: rgba(67, 233, 123, 0.15);
          border-color: rgba(67, 233, 123, 0.4);
          box-shadow: 0 4px 16px rgba(67, 233, 123, 0.15);
        }

        .slot-chip.status-blocked {
          background: rgba(245, 87, 108, 0.08);
          border-color: rgba(245, 87, 108, 0.25);
        }
        .slot-chip.status-blocked:hover:not(:disabled) {
          background: rgba(245, 87, 108, 0.15);
          border-color: rgba(245, 87, 108, 0.4);
          box-shadow: 0 4px 16px rgba(245, 87, 108, 0.15);
        }

        .slot-chip.status-booked {
          background: rgba(253, 160, 133, 0.06);
          border-color: rgba(253, 160, 133, 0.15);
          cursor: not-allowed;
          opacity: 0.8;
        }

        .slot-chip.toggling {
          opacity: 0.6;
          animation: pulse 0.8s ease-in-out infinite;
        }

        .slot-chip-time {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .slot-chip-status {
          font-size: 0.72rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .slot-chip.status-available .slot-chip-status { color: #43e97b; }
        .slot-chip.status-blocked .slot-chip-status { color: #f5576c; }
        .slot-chip.status-booked .slot-chip-status { color: #fda085; }

        @media (max-width: 480px) {
          .slot-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </div>
  )
}
