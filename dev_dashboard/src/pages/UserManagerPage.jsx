import { useState, useEffect, useMemo } from 'react'
import api from '../api/axios'
import UserTable from '../components/UserTable'
import UserFormModal from '../components/UserFormModal'
import ExcelImporter from '../components/ExcelImporter'

const PAGE_SIZE = 15

export default function UserManagerPage({ showToast }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [importing, setImporting] = useState(false)
  const [modal, setModal] = useState(null)   // null | 'add' | { ...user }
  const [showImport, setShowImport] = useState(false)
  const [search, setSearch] = useState('')
  const [filterMember, setFilterMember] = useState('all')
  const [filterActive, setFilterActive] = useState('all')
  const [page, setPage] = useState(1)

  const loadUsers = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/user_data')
      setUsers(data.users || [])
    } catch {
      showToast('Failed to load users', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadUsers() }, [])

  // Filter + search
  const filtered = useMemo(() => {
    let list = users
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(u =>
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.phone?.includes(q) ||
        u.city?.toLowerCase().includes(q)
      )
    }
    if (filterMember !== 'all') list = list.filter(u => String(u.isMember) === filterMember)
    if (filterActive !== 'all') list = list.filter(u => String(u.isActive) === filterActive)
    return list
  }, [users, search, filterMember, filterActive])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // Reset page on filter change
  useEffect(() => setPage(1), [search, filterMember, filterActive])

  const handleSave = async (formData) => {
    setSaving(true)
    try {
      if (modal?._id) {
        // Edit
        const { data } = await api.put(`/user_data/admin/${modal._id}`, formData)
        setUsers(prev => prev.map(u => u._id === modal._id ? { ...u, ...data.user } : u))
        showToast('User updated successfully', 'success')
      } else {
        // Create
        const { data } = await api.post('/user_data/admin/create', formData)
        setUsers(prev => [{ ...data.user, _id: data.user?.id || data.user?._id, ...formData }, ...prev])
        showToast('User created successfully', 'success')
      }
      setModal(null)
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save user', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleBulkImport = async (rows) => {
    setImporting(true)
    try {
      const { data } = await api.post('/user_data/admin/bulk-import', { users: rows })
      showToast(data.message, 'success')
      if (data.errors?.length > 0) {
        showToast(`${data.errors.length} row(s) had errors — check console`, 'error')
        console.warn('Import errors:', data.errors)
      }
      setShowImport(false)
      loadUsers() // Refresh list
    } catch (err) {
      showToast(err.response?.data?.message || 'Bulk import failed', 'error')
    } finally {
      setImporting(false)
    }
  }

  // Stats
  const totalMembers = users.filter(u => u.isMember === 1).length
  const totalActive = users.filter(u => u.isActive).length

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">User Manager</h1>
        <p className="page-subtitle">Add, edit, and manage UserData accounts</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card glass-card">
          <span className="stat-label">Total Users</span>
          <span className="stat-value" style={{ background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{users.length}</span>
        </div>
        <div className="stat-card glass-card">
          <span className="stat-label">Active</span>
          <span className="stat-value" style={{ color: 'var(--accent-green)' }}>{totalActive}</span>
        </div>
        <div className="stat-card glass-card">
          <span className="stat-label">Members</span>
          <span className="stat-value" style={{ color: 'var(--accent-primary)' }}>{totalMembers}</span>
        </div>
        <div className="stat-card glass-card">
          <span className="stat-label">Showing</span>
          <span className="stat-value" style={{ color: 'var(--accent-teal)' }}>{filtered.length}</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="user-toolbar glass-card">
        <div className="user-toolbar-left">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              id="user-search"
              type="text"
              className="search-input"
              placeholder="Search name, email, phone, city…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className="search-clear" onClick={() => setSearch('')}>✕</button>
            )}
          </div>

          <select
            id="filter-member"
            className="form-select filter-select"
            value={filterMember}
            onChange={e => setFilterMember(e.target.value)}
          >
            <option value="all">All Members</option>
            <option value="1">Members</option>
            <option value="0">Non-Members</option>
          </select>

          <select
            id="filter-active"
            className="form-select filter-select"
            value={filterActive}
            onChange={e => setFilterActive(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        <div className="user-toolbar-right">
          <button
            id="btn-import-excel"
            className="btn btn-ghost"
            onClick={() => setShowImport(p => !p)}
          >
            📊 {showImport ? 'Hide Import' : 'Import Excel'}
          </button>
          <button
            id="btn-add-user"
            className="btn btn-primary"
            onClick={() => setModal('add')}
          >
            ➕ Add User
          </button>
        </div>
      </div>

      {/* Excel importer */}
      {showImport && (
        <div className="glass-card import-panel">
          <div className="import-panel-header">
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>📊 Import Users from Excel</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Existing users (matched by email) will be updated. New emails will be created with default password <strong>Uplift@123</strong>.
            </p>
          </div>
          <ExcelImporter onImport={handleBulkImport} loading={importing} />
        </div>
      )}

      {/* Table */}
      <div className="glass-card user-table-card">
        <UserTable users={paginated} onEdit={(u) => setModal(u)} loading={loading} />

        {/* Pagination */}
        {!loading && filtered.length > 0 && (
          <div className="pagination">
            <span className="pagination-info">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </span>
            <div className="pagination-btns">
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >← Prev</button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pg = page <= 3 ? i + 1 : page - 2 + i
                if (pg > totalPages) return null
                return (
                  <button
                    key={pg}
                    className={`btn btn-sm ${pg === page ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => setPage(pg)}
                  >{pg}</button>
                )
              })}
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >Next →</button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <UserFormModal
          user={modal === 'add' ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
          loading={saving}
        />
      )}

      <style>{`
        .user-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
          padding: 1rem 1.25rem;
          margin-bottom: 1rem;
        }

        .user-toolbar-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
          flex: 1;
        }

        .user-toolbar-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-shrink: 0;
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--bg-glass);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 0.5rem 0.9rem;
          min-width: 240px;
          transition: var(--transition);
        }
        .search-box:focus-within {
          border-color: var(--accent-primary);
          box-shadow: 0 0 0 3px rgba(102,126,234,0.12);
        }
        .search-icon { color: var(--text-muted); font-size: 0.9rem; }
        .search-input {
          background: none;
          border: none;
          outline: none;
          color: var(--text-primary);
          font-family: var(--font);
          font-size: 0.875rem;
          flex: 1;
          width: 100%;
        }
        .search-input::placeholder { color: var(--text-muted); }
        .search-clear {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          font-size: 0.8rem;
          padding: 0 0.2rem;
        }
        .search-clear:hover { color: var(--text-primary); }

        .filter-select { width: auto; padding: 0.5rem 0.75rem; font-size: 0.85rem; }

        .import-panel {
          padding: 1.5rem;
          margin-bottom: 1rem;
          border: 1px solid var(--border-accent);
        }
        .import-panel-header { margin-bottom: 1.25rem; }

        .user-table-card { overflow: hidden; }

        .pagination {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.75rem;
          padding: 1rem 1.25rem;
          border-top: 1px solid var(--border);
        }
        .pagination-info { font-size: 0.8rem; color: var(--text-secondary); }
        .pagination-btns { display: flex; align-items: center; gap: 0.35rem; flex-wrap: wrap; }

        @media (max-width: 768px) {
          .user-toolbar { flex-direction: column; align-items: stretch; }
          .user-toolbar-left { flex-direction: column; }
          .search-box { min-width: 0; width: 100%; }
          .filter-select { width: 100%; }
          .user-toolbar-right { justify-content: flex-end; }
        }

        @media (max-width: 480px) {
          .user-toolbar-right { flex-direction: column; }
          .user-toolbar-right .btn { width: 100%; }
        }
      `}</style>
    </div>
  )
}
