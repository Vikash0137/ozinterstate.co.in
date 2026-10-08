import { useEffect, useState } from 'react'
import { Plus, Search, Trash2, ArrowRight, RefreshCw, CheckCircle2, XCircle, Loader2, GitFork } from 'lucide-react'
import toast from 'react-hot-toast'
import redirectService from '../../services/redirectService'

export default function RedirectsPage() {
  const [redirects, setRedirects] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [form, setForm] = useState({
    source: '',
    destination: '',
    statusCode: 301,
    notes: '',
  })
  const [saving, setSaving] = useState(false)

  const fetchRedirects = async () => {
    try {
      setLoading(true)
      const res = await redirectService.getRedirects({ search })
      if (res.data?.success) {
        setRedirects(res.data.data?.redirects || [])
      }
    } catch (err) {
      console.error('Failed to load redirects:', err)
      toast.error('Failed to load redirects.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRedirects()
  }, [search])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!form.source.trim() || !form.destination.trim()) {
      toast.error('Please specify both source and destination.')
      return
    }

    try {
      setSaving(true)
      const res = await redirectService.createRedirect(form)
      if (res.data?.success) {
        toast.success('Redirect rule saved!')
        setForm({ source: '', destination: '', statusCode: 301, notes: '' })
        setShowAddForm(false)
        fetchRedirects()
      }
    } catch (err) {
      console.error('Error creating redirect:', err)
      toast.error(err.response?.data?.message || 'Failed to create redirect.')
    } finally {
      setSaving(false)
    }
  }

  const handleToggle = async (item) => {
    try {
      const res = await redirectService.toggleRedirect(item._id)
      if (res.data?.success) {
        toast.success(`Redirect status updated.`)
        fetchRedirects()
      }
    } catch (err) {
      toast.error('Failed to update status.')
    }
  }

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete redirect from "${item.source}"?`)) return
    try {
      const res = await redirectService.deleteRedirect(item._id)
      if (res.data?.success) {
        toast.success('Redirect deleted.')
        fetchRedirects()
      }
    } catch (err) {
      toast.error('Failed to delete redirect.')
    }
  }

  const totalHits = redirects.reduce((acc, r) => acc + (r.hits || 0), 0)
  const activeCount = redirects.filter((r) => r.isActive).length

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 30, color: '#183149', display: 'flex', alignItems: 'center', gap: 10 }}>
            <GitFork size={28} color="#0284c7" /> 301 & 302 Redirect Manager
          </h1>
          <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: 14 }}>
            Safeguard SEO equity and prevent 404 errors when location URLs and slugs change.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: '#0284c7',
            color: '#fff',
            border: 'none',
            borderRadius: 12,
            padding: '11px 18px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          <Plus size={18} /> {showAddForm ? 'Cancel' : 'Add Redirect'}
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div style={kpiCardStyle}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Total Rules</span>
          <strong style={{ fontSize: 24, color: '#183149', marginTop: 4, display: 'block' }}>{redirects.length}</strong>
        </div>
        <div style={kpiCardStyle}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Active Rules</span>
          <strong style={{ fontSize: 24, color: '#10b981', marginTop: 4, display: 'block' }}>{activeCount}</strong>
        </div>
        <div style={kpiCardStyle}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Total Redirect Hits</span>
          <strong style={{ fontSize: 24, color: '#0284c7', marginTop: 4, display: 'block' }}>{totalHits}</strong>
        </div>
      </div>

      {/* Add Redirect Form */}
      {showAddForm && (
        <form onSubmit={handleCreate} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: 20, marginBottom: 24 }}>
          <h3 style={{ margin: '0 0 16px', color: '#183149', fontSize: 16 }}>Create New Redirect Rule</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            <div>
              <label style={labelStyle}>Source Path (Old URL) *</label>
              <input
                required
                placeholder="/location/old-city-slug"
                value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value })}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Destination Path (New URL) *</label>
              <input
                required
                placeholder="/location/new-city-slug"
                value={form.destination}
                onChange={(e) => setForm({ ...form, destination: e.target.value })}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Status Code</label>
              <select
                value={form.statusCode}
                onChange={(e) => setForm({ ...form, statusCode: Number(e.target.value) })}
                style={inputStyle}
              >
                <option value={301}>301 Permanent Redirect (Recommended)</option>
                <option value={302}>302 Temporary Redirect</option>
                <option value={307}>307 Temporary</option>
                <option value={308}>308 Permanent</option>
              </select>
            </div>
          </div>
          <div style={{ marginTop: 14 }}>
            <label style={labelStyle}>Notes / Reason (Optional)</label>
            <input
              placeholder="e.g. Migration from old city name"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              style={inputStyle}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              style={{ padding: '9px 16px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              style={{ padding: '9px 20px', borderRadius: 10, border: 'none', background: '#0284c7', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
            >
              {saving ? 'Saving...' : 'Save Redirect'}
            </button>
          </div>
        </form>
      )}

      {/* Filter / Search Bar */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: 12, top: 11, color: '#64748b' }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search source path, destination or notes..."
            style={{ width: '100%', padding: '10px 12px 10px 40px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 14 }}
          />
        </div>
        <button
          type="button"
          onClick={fetchRedirects}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer' }}
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ display: 'grid', placeItems: 'center', minHeight: 180, color: '#64748b' }}>
            <Loader2 size={28} style={{ animation: 'spin 1s linear infinite' }} />
            <div style={{ marginTop: 10 }}>Loading redirects...</div>
          </div>
        ) : redirects.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 48, color: '#64748b' }}>
            <GitFork size={36} style={{ margin: '0 auto 10px', opacity: 0.4 }} />
            <h3 style={{ margin: '0 0 6px', color: '#183149' }}>No Redirects Configured</h3>
            <p style={{ margin: 0, fontSize: 13 }}>Redirects will automatically be generated whenever an existing published location's slug is updated.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f8fafc' }}>
                <tr>
                  <th style={thStyle}>Source URL</th>
                  <th style={thStyle}>Target Destination</th>
                  <th style={thStyle}>Code</th>
                  <th style={thStyle}>Hits</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {redirects.map((item) => (
                  <tr key={item._id} style={{ borderTop: '1px solid #e2e8f0' }}>
                    <td style={tdStyle}>
                      <code style={{ background: '#fef2f2', color: '#991b1b', padding: '4px 8px', borderRadius: 6, fontSize: 12, fontWeight: 700 }}>
                        {item.source}
                      </code>
                      {item.notes && <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>{item.notes}</div>}
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <ArrowRight size={14} color="#0284c7" />
                        <code style={{ background: '#f0fdf4', color: '#166534', padding: '4px 8px', borderRadius: 6, fontSize: 12, fontWeight: 700 }}>
                          {item.destination}
                        </code>
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <span style={{ fontWeight: 700, fontSize: 12, color: '#1e293b' }}>
                        {item.statusCode || 301}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#0284c7' }}>
                        {item.hits || 0}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <button
                        type="button"
                        onClick={() => handleToggle(item)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 5,
                          padding: '4px 9px',
                          borderRadius: 999,
                          fontSize: 11,
                          fontWeight: 700,
                          border: 'none',
                          cursor: 'pointer',
                          background: item.isActive ? '#dcfce7' : '#f1f5f9',
                          color: item.isActive ? '#166534' : '#64748b',
                        }}
                      >
                        {item.isActive ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                        {item.isActive ? 'Active' : 'Disabled'}
                      </button>
                    </td>
                    <td style={tdStyle}>
                      <button
                        type="button"
                        onClick={() => handleDelete(item)}
                        title="Delete redirect"
                        style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid #fee2e2', background: '#fff5f5', color: '#b91c1c', display: 'grid', placeItems: 'center', cursor: 'pointer' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

const kpiCardStyle = {
  background: '#fff',
  border: '1px solid #e2e8f0',
  borderRadius: 14,
  padding: '16px 20px',
}

const labelStyle = {
  display: 'block',
  fontSize: 12,
  fontWeight: 700,
  color: '#475569',
  marginBottom: 6,
}

const inputStyle = {
  width: '100%',
  border: '1px solid #e2e8f0',
  borderRadius: 8,
  padding: '9px 12px',
  fontSize: 13,
  color: '#0f172a',
}

const thStyle = {
  textAlign: 'left',
  padding: '12px 16px',
  fontSize: 11,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: '#64748b',
  fontWeight: 700,
}

const tdStyle = {
  padding: '14px 16px',
  color: '#0f172a',
  verticalAlign: 'middle',
}
