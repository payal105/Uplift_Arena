import { useState, useEffect } from 'react'
import api from '../api/axios'
import SlotGrid from '../components/SlotGrid'

const SPORT_ICONS = {
  CRICKET: '🏏',
  FOOTBALL: '⚽',
  BADMINTON: '🏸',
  PICKLEBALL: '🏓',
  TENNIS: '🎾'
}

export default function SlotManagerPage({ showToast }) {
  const [turfs, setTurfs] = useState([])
  const [selectedSport, setSelectedSport] = useState('')
  const [selectedTurf, setSelectedTurf] = useState('')
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [slots, setSlots] = useState([])
  const [loadingTurfs, setLoadingTurfs] = useState(true)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [togglingId, setTogglingId] = useState(null)

  // Load turfs on mount
  useEffect(() => {
    api.get('/turfs')
      .then(({ data }) => {
        const list = Array.isArray(data) ? data : (data.turfs || [])
        setTurfs(list)
        if (list.length > 0) {
          const firstSport = list[0].sportType
          setSelectedSport(firstSport)
          const firstTurf = list.find(t => t.sportType === firstSport)
          if (firstTurf) setSelectedTurf(firstTurf._id)
        }
      })
      .catch(() => showToast('Failed to load turfs', 'error'))
      .finally(() => setLoadingTurfs(false))
  }, [])

  // Load slots whenever turf or date changes
  useEffect(() => {
    if (!selectedTurf || !selectedDate) {
      setSlots([])
      return
    }
    setLoadingSlots(true)
    api.get('/slots', { params: { turfId: selectedTurf, date: selectedDate } })
      .then(({ data }) => setSlots(data.slots || []))
      .catch(() => showToast('Failed to load slots', 'error'))
      .finally(() => setLoadingSlots(false))
  }, [selectedTurf, selectedDate])

  const handleToggle = async (slot) => {
    const newStatus = slot.status === 'AVAILABLE' ? 'BLOCKED' : 'AVAILABLE'
    setTogglingId(slot._id)
    try {
      const { data } = await api.put(`/slots/${slot._id}`, {
        status: newStatus,
        blockedBy: newStatus === 'BLOCKED' ? 'ADMIN' : undefined,
      })
      setSlots(prev =>
        prev.map(s => s._id === slot._id ? { ...s, status: newStatus } : s)
      )
      showToast(
        `Slot ${slot.startTime}–${slot.endTime} ${newStatus === 'BLOCKED' ? 'blocked' : 'unblocked'} successfully`,
        newStatus === 'BLOCKED' ? 'error' : 'success'
      )
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update slot', 'error')
    } finally {
      setTogglingId(null)
    }
  }

  const handleSportChange = (sport) => {
    setSelectedSport(sport)
    const matchingTurf = turfs.find(t => t.sportType === sport)
    setSelectedTurf(matchingTurf ? matchingTurf._id : '')
  }

  const sports = Array.from(new Set(turfs.map(t => t.sportType)))
  const filteredTurfs = turfs.filter(t => t.sportType === selectedSport)
  const selectedTurfData = turfs.find(t => t._id === selectedTurf)

  return (
    <div className="slot-manager-container">
      <div className="page-header">
        <h1 className="page-title">Book Your Court</h1>
        <p className="page-subtitle">Select your game, pick a turf, and manage slot availability</p>
      </div>

      {loadingTurfs ? (
        <div className="loading-state">
          <div className="spinner" />
          <span>Loading arenas...</span>
        </div>
      ) : (
        <div className="booking-flow">
          
          {/* Step 1: Select Game */}
          <div className="flow-step">
            <h2 className="step-title">
              <span className="step-number">1</span> Choose your game
            </h2>
            <div className="sport-selector">
              {sports.map(sport => (
                <button
                  key={sport}
                  className={`sport-card ${selectedSport === sport ? 'active' : ''}`}
                  onClick={() => handleSportChange(sport)}
                >
                  <span className="sport-icon">{SPORT_ICONS[sport] || '🏅'}</span>
                  <span className="sport-name">{sport}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Select Turf */}
          {selectedSport && (
            <div className="flow-step">
              <h2 className="step-title">
                <span className="step-number">2</span> Select an Arena
              </h2>
              <div className="turf-selector">
                {filteredTurfs.map(turf => (
                  <button
                    key={turf._id}
                    className={`turf-card ${selectedTurf === turf._id ? 'active' : ''}`}
                    onClick={() => setSelectedTurf(turf._id)}
                  >
                    <div className="turf-card-content">
                      <h3>{turf.name}</h3>
                      <p>{turf.venue?.name || 'Main Venue'}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Select Date & Manage Slots */}
          {selectedTurf && (
            <div className="flow-step">
              <div className="step-header-row">
                <h2 className="step-title" style={{ margin: 0 }}>
                  <span className="step-number">3</span> Manage Slots
                </h2>
                <div className="date-picker-wrapper">
                  <input
                    id="date-select"
                    type="date"
                    className="form-input custom-date-input"
                    value={selectedDate}
                    onChange={e => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              {selectedTurfData && (
                <div className="selected-turf-meta glass-card">
                  <div className="meta-info">
                    <strong>{selectedTurfData.name}</strong> • {selectedTurfData.venue?.name}
                  </div>
                  <div className="meta-badges">
                    <span className="badge" style={{ background: 'rgba(255,255,255,0.1)' }}>
                      {selectedTurfData.slotDurationMinutes || 60} min slots
                    </span>
                  </div>
                </div>
              )}

              <div className="slot-hint">
                <span>💡</span>
                <span>Click any <strong style={{ color: '#43e97b' }}>Available</strong> slot to block it, or click a <strong style={{ color: '#f5576c' }}>Blocked</strong> slot to unblock it.</span>
              </div>

              <div className="glass-card slot-grid-card">
                <SlotGrid
                  slots={slots}
                  loading={loadingSlots}
                  onToggle={handleToggle}
                  togglingId={togglingId}
                />
              </div>
            </div>
          )}

        </div>
      )}

      <style>{`
        .slot-manager-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .booking-flow {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
          margin-top: 2rem;
        }

        .flow-step {
          animation: slideUp 0.4s ease-out forwards;
        }

        .step-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 1.25rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .step-number {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--primary);
          color: white;
          font-size: 0.9rem;
          font-weight: 800;
          box-shadow: 0 4px 10px rgba(102, 126, 234, 0.4);
        }

        /* Sport Selector */
        .sport-selector {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .sport-card {
          background: var(--bg-glass);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 1.25rem 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
          min-width: 140px;
          color: var(--text-secondary);
        }

        .sport-card:hover {
          transform: translateY(-4px);
          border-color: rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.05);
        }

        .sport-card.active {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%);
          border-color: var(--primary);
          color: var(--text-primary);
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.15);
          transform: translateY(-4px);
        }

        .sport-icon {
          font-size: 2rem;
          filter: grayscale(1);
          opacity: 0.7;
          transition: var(--transition);
        }

        .sport-card.active .sport-icon {
          filter: grayscale(0);
          opacity: 1;
          transform: scale(1.1);
        }

        .sport-name {
          font-weight: 600;
          font-size: 0.95rem;
          letter-spacing: 0.5px;
        }

        /* Turf Selector */
        .turf-selector {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1rem;
        }

        .turf-card {
          background: var(--bg-glass);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 1.25rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
          text-align: left;
        }

        .turf-card:hover {
          transform: translateY(-3px);
          border-color: rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.05);
        }

        .turf-card.active {
          border-color: #43e97b;
          background: rgba(67, 233, 123, 0.08);
          box-shadow: 0 8px 24px rgba(67, 233, 123, 0.15);
          transform: translateY(-3px);
        }

        .turf-card-content h3 {
          margin: 0 0 0.35rem 0;
          font-size: 1.05rem;
          color: var(--text-primary);
        }

        .turf-card-content p {
          margin: 0;
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .turf-card-price {
          font-size: 0.85rem;
          color: var(--text-secondary);
          text-align: right;
        }

        .turf-card-price span {
          display: block;
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1;
          margin-bottom: 0.2rem;
        }

        .turf-card.active .turf-card-price span {
          color: #43e97b;
        }

        /* Date & Meta */
        .step-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .custom-date-input {
          min-width: 200px;
          padding: 0.75rem 1rem;
          font-weight: 600;
          background: rgba(0,0,0,0.2);
        }

        .selected-turf-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.25rem;
          margin-bottom: 1.25rem;
          border-left: 4px solid var(--primary);
        }

        .meta-info {
          font-size: 0.95rem;
          color: var(--text-secondary);
        }
        
        .meta-info strong {
          color: var(--text-primary);
          font-size: 1.05rem;
        }

        .meta-badges {
          display: flex;
          gap: 0.5rem;
        }

        .slot-hint {
          display: flex;
          align-items: flex-start;
          gap: 0.6rem;
          padding: 0.85rem 1.25rem;
          background: rgba(102, 126, 234, 0.08);
          border: 1px solid rgba(102, 126, 234, 0.2);
          border-radius: var(--radius-md);
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
          line-height: 1.5;
        }

        .slot-grid-card { padding: 1.5rem; }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          .step-header-row { flex-direction: column; align-items: flex-start; }
          .date-picker-wrapper { width: 100%; }
          .custom-date-input { width: 100%; }
          .selected-turf-meta { flex-direction: column; align-items: flex-start; gap: 0.75rem; }
        }
      `}</style>
    </div>
  )
}
