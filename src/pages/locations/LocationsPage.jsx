import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  MapPin,
  Eye,
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCw,
  AlertCircle,
  ExternalLink,
  Copy,
  BarChart3,
  GitFork,
  CheckSquare,
  Square,
  ShieldCheck,
  Globe,
} from 'lucide-react'
import toast from 'react-hot-toast'
import locationService from '../../services/locationService'

export default function LocationsPage() {
  const navigate = useNavigate()
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [stateFilter, setStateFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 })
  const [selectedIds, setSelectedIds] = useState([])
  const [bulkActionLoading, setBulkActionLoading] = useState(false)

  const fetchLocations = async () => {
    try {
      setLoading(true)
      const response = await locationService.getLocations({
        search,
        status: statusFilter,
        state: stateFilter,
        page,
        limit: 12,
      })

      if (response?.data?.success) {
        setLocations(response.data.data.locations || [])
        setPagination(response.data.data.pagination || { total: 0, totalPages: 1 })
        setSelectedIds([])
      }
    } catch (error) {
      console.error('Failed to load locations:', error)
      toast.error('Failed to load locations.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLocations()
  }, [search, statusFilter, stateFilter, page])

  const handleSelectAll = () => {
    if (selectedIds.length === locations.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(locations.map((l) => l._id))
    }
  }

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleBulkPublish = async () => {
    if (selectedIds.length === 0) return
    try {
      setBulkActionLoading(true)
      const res = await locationService.bulkPublish(selectedIds)
      if (res.data?.success) {
        toast.success(`Published ${selectedIds.length} locations.`)
        fetchLocations()
      }
    } catch (err) {
      toast.error('Failed to bulk publish.')
    } finally {
      setBulkActionLoading(false)
    }
  }

  const handleBulkUnpublish = async () => {
    if (selectedIds.length === 0) return
    try {
      setBulkActionLoading(true)
      const res = await locationService.bulkUnpublish(selectedIds)
      if (res.data?.success) {
        toast.success(`Unpublished ${selectedIds.length} locations.`)
        fetchLocations()
      }
    } catch (err) {
      toast.error('Failed to bulk unpublish.')
    } finally {
      setBulkActionLoading(false)
    }
  }

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return
    if (!window.confirm(`Delete ${selectedIds.length} selected locations?`)) return
    try {
      setBulkActionLoading(true)
      const res = await locationService.bulkDelete(selectedIds)
      if (res.data?.success) {
        toast.success(`Deleted ${selectedIds.length} locations.`)
        fetchLocations()
      }
    } catch (err) {
      toast.error('Failed to bulk delete.')
    } finally {
      setBulkActionLoading(false)
    }
  }

  const handleDuplicate = async (location) => {
    try {
      const res = await locationService.duplicateLocation(location._id)
      if (res.data?.success) {
        toast.success(`Duplicated "${location.name}" as draft.`)
        fetchLocations()
      }
    } catch (err) {
      toast.error('Failed to duplicate location.')
    }
  }

  const handleDelete = async (location) => {
    const confirmed = window.confirm(`Delete ${location.name}? This will remove it from search engines and directory.`)
    if (!confirmed) return

    try {
      const response = await locationService.deleteLocation(location._id)
      if (response?.data?.success) {
        toast.success('Location deleted successfully.')
        fetchLocations()
      }
    } catch (error) {
      console.error('Failed to delete location:', error)
      toast.error('Failed to delete location.')
    }
  }

  const handleToggleStatus = async (location) => {
    try {
      const nextStatus = location.status === 'published' || location.status === 'active' ? 'unpublished' : 'published'
      const response = await locationService.toggleLocationStatus(location._id, nextStatus)
      if (response?.data?.success) {
        toast.success(`Location updated to ${nextStatus}.`)
        fetchLocations()
      }
    } catch (error) {
      console.error('Failed to toggle status:', error)
      toast.error('Failed to update location status.')
    }
  }

  const publishedCount = useMemo(() => locations.filter((l) => l.isPublished || l.status === 'published' || l.status === 'active').length, [locations])

  return (
    <div style={{ padding: 24, maxWidth: 1300, margin: '0 auto' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 32, color: '#183149', display: 'flex', alignItems: 'center', gap: 10 }}>
            <MapPin size={30} color="#0284c7" /> Location-Based SEO Engine
          </h1>
          <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: 14 }}>
            Control localized landing pages, SEO meta fallbacks, structured schema, and 301 migrations.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => navigate('/admin/locations/redirects')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: '#fff',
              color: '#183149',
              border: '1px solid #e2e8f0',
              borderRadius: 12,
              padding: '11px 16px',
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            <GitFork size={16} /> 301 Redirects
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/locations/analytics')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: '#fff',
              color: '#183149',
              border: '1px solid #e2e8f0',
              borderRadius: 12,
              padding: '11px 16px',
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            <BarChart3 size={16} /> Analytics
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/locations/new')}
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
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            <Plus size={18} /> Add Location
          </button>
        </div>
      </div>

      {/* KPI Cards Banner */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 20 }}>
        <div style={kpiCardStyle}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Total Locations</span>
          <strong style={{ fontSize: 22, color: '#183149', display: 'block', marginTop: 3 }}>{pagination.total || locations.length}</strong>
        </div>
        <div style={kpiCardStyle}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Indexable (Published)</span>
          <strong style={{ fontSize: 22, color: '#10b981', display: 'block', marginTop: 3 }}>{publishedCount}</strong>
        </div>
        <div style={kpiCardStyle}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>XML Sitemap Sync</span>
          <a href="http://localhost:5000/sitemap-locations.xml" target="_blank" rel="noreferrer" style={{ fontSize: 12, color: '#0284c7', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 5 }}>
            <Globe size={13} /> View Live XML
          </a>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
          <Search size={18} style={{ position: 'absolute', left: 12, top: 11, color: '#64748b' }} />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            placeholder="Search by city, state, region or slug..."
            style={{ width: '100%', padding: '10px 12px 10px 40px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 14 }}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value)
            setPage(1)
          }}
          style={selectStyle}
        >
          <option value="all">All Statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="unpublished">Unpublished</option>
          <option value="archived">Archived</option>
        </select>

        <select
          value={stateFilter}
          onChange={(e) => {
            setStateFilter(e.target.value)
            setPage(1)
          }}
          style={selectStyle}
        >
          <option value="all">All States</option>
          <option value="VIC">VIC</option>
          <option value="NSW">NSW</option>
          <option value="QLD">QLD</option>
          <option value="SA">SA</option>
          <option value="WA">WA</option>
          <option value="ACT">ACT</option>
          <option value="TAS">TAS</option>
        </select>

        <button
          type="button"
          onClick={fetchLocations}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 14px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 13 }}
        >
          <RefreshCw size={15} /> Refresh
        </button>
      </div>

      {/* Bulk Action Bar (when items are selected) */}
      {selectedIds.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#e0f2fe', border: '1px solid #bae6fd', borderRadius: 12, padding: '10px 16px', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#0369a1' }}>
            {selectedIds.length} location(s) selected
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              disabled={bulkActionLoading}
              onClick={handleBulkPublish}
              style={{ ...bulkButtonStyle, background: '#10b981', color: '#fff' }}
            >
              Bulk Publish
            </button>
            <button
              type="button"
              disabled={bulkActionLoading}
              onClick={handleBulkUnpublish}
              style={{ ...bulkButtonStyle, background: '#f59e0b', color: '#fff' }}
            >
              Bulk Unpublish
            </button>
            <button
              type="button"
              disabled={bulkActionLoading}
              onClick={handleBulkDelete}
              style={{ ...bulkButtonStyle, background: '#ef4444', color: '#fff' }}
            >
              Bulk Delete
            </button>
          </div>
        </div>
      )}

      {/* Locations Table */}
      <div style={{ background: '#fff', borderRadius: 18, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ display: 'grid', placeItems: 'center', minHeight: 220, color: '#64748b' }}>
            <Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} />
            <div style={{ marginTop: 12 }}>Loading locations...</div>
          </div>
        ) : locations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 48, color: '#64748b' }}>
            <MapPin size={42} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
            <h3 style={{ margin: '0 0 10px', color: '#183149' }}>No locations found</h3>
            <p style={{ margin: 0 }}>Try adjusting your filters or click "Add Location" to create a new SEO city page.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f8fafc' }}>
                <tr>
                  <th style={{ ...thStyle, width: 40 }}>
                    <input
                      type="checkbox"
                      checked={selectedIds.length === locations.length && locations.length > 0}
                      onChange={handleSelectAll}
                      style={{ cursor: 'pointer' }}
                    />
                  </th>
                  <th style={thStyle}>Location & Region</th>
                  <th style={thStyle}>State</th>
                  <th style={thStyle}>URL Slug</th>
                  <th style={thStyle}>SEO Health</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {locations.map((location) => {
                  const score = location.seoHealth?.score ?? location.calculatedScore ?? location.seoScore ?? 80
                  const isScoreGood = score >= 80
                  const isScoreMed = score >= 60 && score < 80
                  const isChecked = selectedIds.includes(location._id)

                  return (
                    <tr key={location._id} style={{ borderTop: '1px solid #e2e8f0', background: isChecked ? '#f0f9ff' : 'transparent' }}>
                      <td style={tdStyle}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleSelect(location._id)}
                          style={{ cursor: 'pointer' }}
                        />
                      </td>

                      <td style={tdStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 36, height: 36, borderRadius: 10, background: '#e0f2fe', display: 'grid', placeItems: 'center' }}>
                            <MapPin size={18} color="#0284c7" />
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: '#183149', fontSize: 14 }}>{location.name}</div>
                            <div style={{ fontSize: 11, color: '#64748b' }}>{location.region || location.badge || 'Service Available'}</div>
                          </div>
                        </div>
                      </td>

                      <td style={tdStyle}>
                        <span style={{ fontWeight: 700, color: '#334155', fontSize: 13 }}>{location.state}</span>
                      </td>

                      <td style={tdStyle}>
                        <code style={{ background: '#f8fafc', padding: '4px 8px', borderRadius: 6, fontSize: 12, color: '#0f172a' }}>
                          /location/{location.slug}
                        </code>
                      </td>

                      {/* SEO Score Badge */}
                      <td style={tdStyle}>
                        <div
                          title={(location.seoHealth?.warnings || []).join('\n') || 'SEO Health: Optimal'}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            padding: '5px 10px',
                            borderRadius: 999,
                            fontSize: 12,
                            fontWeight: 800,
                            background: isScoreGood ? '#dcfce7' : isScoreMed ? '#fef3c7' : '#fee2e2',
                            color: isScoreGood ? '#166534' : isScoreMed ? '#92400e' : '#991b1b',
                          }}
                        >
                          <ShieldCheck size={13} />
                          {score}/100
                        </div>
                      </td>

                      {/* Status */}
                      <td style={tdStyle}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                            padding: '5px 10px',
                            borderRadius: 999,
                            fontSize: 11,
                            fontWeight: 700,
                            background: location.status === 'published' || location.status === 'active' ? '#dcfce7' : '#f1f5f9',
                            color: location.status === 'published' || location.status === 'active' ? '#166534' : '#475569',
                            textTransform: 'capitalize',
                          }}
                        >
                          {location.status === 'published' || location.status === 'active' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                          {location.status || 'published'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={tdStyle}>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                          <button
                            type="button"
                            onClick={() => window.open(`http://localhost:5173/location/${location.slug}?preview=true`, '_blank')}
                            title="Preview Public Page"
                            style={iconButtonStyle}
                          >
                            <ExternalLink size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => navigate(`/admin/locations/edit/${location._id}`)}
                            title="Edit Location & SEO"
                            style={iconButtonStyle}
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDuplicate(location)}
                            title="Duplicate Location as Draft"
                            style={iconButtonStyle}
                          >
                            <Copy size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(location)}
                            title="Toggle Publish / Unpublish"
                            style={iconButtonStyle}
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(location)}
                            title="Delete Location"
                            style={{ ...iconButtonStyle, color: '#b91c1c', borderColor: '#fecaca', background: '#fff5f5' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && pagination.totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, color: '#475569', fontSize: 13 }}>
          <span>Page {page} of {pagination.totalPages} ({pagination.total} total locations)</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              style={pagerButtonStyle}
            >
              Prev
            </button>
            <button
              type="button"
              disabled={page >= pagination.totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              style={pagerButtonStyle}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const kpiCardStyle = {
  background: '#fff',
  border: '1px solid #e2e8f0',
  borderRadius: 14,
  padding: '14px 18px',
}

const selectStyle = {
  padding: '10px 12px',
  borderRadius: 10,
  border: '1px solid #e2e8f0',
  fontSize: 13,
  background: '#fff',
  cursor: 'pointer',
}

const thStyle = {
  textAlign: 'left',
  padding: '12px 16px',
  fontSize: 11,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: '#475569',
  fontWeight: 700,
}

const tdStyle = {
  padding: '14px 16px',
  color: '#0f172a',
  verticalAlign: 'middle',
}

const iconButtonStyle = {
  width: 30,
  height: 30,
  borderRadius: 8,
  border: '1px solid #e2e8f0',
  background: '#fff',
  color: '#1e293b',
  display: 'grid',
  placeItems: 'center',
  cursor: 'pointer',
}

const bulkButtonStyle = {
  padding: '6px 12px',
  borderRadius: 8,
  border: 'none',
  fontSize: 12,
  fontWeight: 700,
  cursor: 'pointer',
}

const pagerButtonStyle = {
  padding: '7px 14px',
  borderRadius: 10,
  border: '1px solid #e2e8f0',
  background: '#fff',
  cursor: 'pointer',
  color: '#0f172a',
  fontSize: 13,
  fontWeight: 600,
}
