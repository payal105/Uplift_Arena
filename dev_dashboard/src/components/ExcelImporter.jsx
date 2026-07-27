import { useState } from 'react'
import * as XLSX from 'xlsx'

export default function ExcelImporter({ onImport, loading }) {
  const [fileName, setFileName] = useState(null)
  const [preview, setPreview] = useState([])
  const [parseError, setParseError] = useState('')

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setFileName(file.name)
    setParseError('')
    setPreview([])

    const reader = new FileReader()
    reader.onload = (evt) => {
      try {
        const wb = XLSX.read(evt.target.result, { type: 'binary' })
        const ws = wb.Sheets[wb.SheetNames[0]]
        const data = XLSX.utils.sheet_to_json(ws, { defval: '' })

        // Normalize columns
        const normalized = data.map(row => {
          const r = {}
          Object.entries(row).forEach(([k, v]) => {
            r[k.toLowerCase().trim()] = String(v).trim()
          })
          return {
            name: r['name'] || r['full name'] || r['fullname'] || '',
            email: r['email'] || r['email address'] || '',
            phone: r['phone'] || r['mobile'] || r['contact'] || '',
            city: r['city'] || r['location'] || '',
            isMember: r['ismember'] || r['member'] || '0',
            isActive: r['isactive'] || r['active'] || 'true',
          }
        }).filter(r => r.name || r.email)

        if (normalized.length === 0) {
          setParseError('No valid rows found. Ensure the sheet has at least Name and Email columns.')
          return
        }

        setPreview(normalized)
      } catch (err) {
        setParseError('Failed to parse file. Please use a valid .xlsx or .csv file.')
      }
    }
    reader.readAsBinaryString(file)
  }

  const handleImport = () => {
    if (preview.length === 0) return
    onImport(preview)
  }

  const handleClear = () => {
    setPreview([])
    setFileName(null)
    setParseError('')
  }

  return (
    <div className="excel-importer">
      <div className="excel-drop-zone">
        <input
          id="excel-file-input"
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFile}
          style={{ display: 'none' }}
        />
        <label htmlFor="excel-file-input" className="excel-drop-label">
          <span className="excel-drop-icon">📊</span>
          <span className="excel-drop-title">
            {fileName ? fileName : 'Choose Excel / CSV file'}
          </span>
          <span className="excel-drop-hint">
            Supported columns: Name, Email, Phone, City, isMember (0/1), isActive (true/false)
          </span>
        </label>
      </div>

      {parseError && (
        <div className="excel-error">⚠️ {parseError}</div>
      )}

      {preview.length > 0 && (
        <>
          <div className="excel-preview-header">
            <span className="excel-preview-count">
              📋 {preview.length} user{preview.length !== 1 ? 's' : ''} ready to import
            </span>
            <button className="btn btn-ghost btn-sm" onClick={handleClear}>Clear</button>
          </div>

          <div className="table-wrapper excel-preview-table">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>City</th>
                  <th>Member</th>
                </tr>
              </thead>
              <tbody>
                {preview.slice(0, 8).map((u, i) => (
                  <tr key={i}>
                    <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                    <td>{u.name || '—'}</td>
                    <td style={{ color: 'var(--accent-primary)' }}>{u.email || '—'}</td>
                    <td>{u.phone || '—'}</td>
                    <td>{u.city || '—'}</td>
                    <td>
                      <span className={`badge ${u.isMember === '1' || u.isMember === 'true' ? 'badge-member' : 'badge-inactive'}`}>
                        {u.isMember === '1' || u.isMember === 'true' ? 'Yes' : 'No'}
                      </span>
                    </td>
                  </tr>
                ))}
                {preview.length > 8 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      …and {preview.length - 8} more
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button className="btn btn-ghost btn-sm" onClick={handleClear}>Cancel</button>
            <button
              className="btn btn-success"
              onClick={handleImport}
              disabled={loading}
            >
              {loading ? '⟳ Importing…' : `⬆ Import ${preview.length} Users`}
            </button>
          </div>
        </>
      )}

      <style>{`
        .excel-importer { display: flex; flex-direction: column; gap: 1rem; }

        .excel-drop-zone {
          border: 2px dashed var(--border-accent);
          border-radius: var(--radius-lg);
          transition: var(--transition);
        }
        .excel-drop-zone:hover { border-color: var(--accent-primary); background: var(--bg-glass-hover); }

        .excel-drop-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 2rem;
          cursor: pointer;
          text-align: center;
        }

        .excel-drop-icon { font-size: 2rem; }
        .excel-drop-title { font-size: 0.95rem; font-weight: 600; color: var(--text-primary); }
        .excel-drop-hint { font-size: 0.78rem; color: var(--text-muted); max-width: 400px; line-height: 1.4; }

        .excel-error {
          padding: 0.75rem 1rem;
          background: rgba(245, 87, 108, 0.1);
          border: 1px solid rgba(245, 87, 108, 0.25);
          border-radius: var(--radius-md);
          color: var(--accent-red);
          font-size: 0.85rem;
        }

        .excel-preview-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .excel-preview-count {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--accent-green);
        }

        .excel-preview-table { max-height: 280px; overflow-y: auto; border-radius: var(--radius-md); border: 1px solid var(--border); }
      `}</style>
    </div>
  )
}
