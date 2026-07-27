export default function UserTable({ users, onEdit, loading }) {
  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner" />
        <span>Loading users…</span>
      </div>
    )
  }

  if (!users || users.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">👥</div>
        <div className="empty-state-text">No users found</div>
      </div>
    )
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>City</th>
            <th>Member</th>
            <th>Status</th>
            <th>Joined</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, i) => (
            <tr key={user._id}>
              <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{i + 1}</td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div className="user-avatar">
                    {user.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{user.name}</span>
                </div>
              </td>
              <td style={{ color: 'var(--accent-primary)', fontSize: '0.85rem' }}>{user.email}</td>
              <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{user.phone || '—'}</td>
              <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{user.city || '—'}</td>
              <td>
                <span className={`badge ${user.isMember === 1 ? 'badge-member' : 'badge-inactive'}`}>
                  {user.isMember === 1 ? 'Member' : 'Non-Member'}
                </span>
              </td>
              <td>
                <span className={`badge ${user.isActive ? 'badge-active' : 'badge-inactive'}`}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'short', year: 'numeric'
                }) : '—'}
              </td>
              <td>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => onEdit(user)}
                  id={`edit-user-${user._id}`}
                >
                  ✏️ Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <style>{`
        .user-avatar {
          width: 32px; height: 32px;
          min-width: 32px;
          background: var(--grad-primary);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.8rem; font-weight: 800; color: white;
        }
      `}</style>
    </div>
  )
}
