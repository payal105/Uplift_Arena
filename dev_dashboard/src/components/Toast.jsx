import { useEffect } from 'react'

export default function Toast({ message, type = 'info', id }) {
  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'

  return (
    <div className="toast-container">
      <div key={id} className={`toast toast-${type}`}>
        <span style={{ fontWeight: 700, fontSize: '1rem' }}>{icon}</span>
        <span>{message}</span>
      </div>
    </div>
  )
}
