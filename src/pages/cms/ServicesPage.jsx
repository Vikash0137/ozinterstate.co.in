import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Edit2, Trash2, SlidersHorizontal, Loader2, ShieldCheck, Eye, Truck, ExternalLink, Globe } from 'lucide-react'
import toast from 'react-hot-toast'
import serviceService from '../../services/serviceService'
import '../banners/Banners.css'

export default function ServicesPage() {
  const navigate = useNavigate()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const fetchServices = async () => {
    try {
      setLoading(true)
      const res = await serviceService.getServices()
      if (res.data && res.data.success) {
        setServices(res.data.data || [])
      } else if (res.data) {
        setServices(res.data || [])
      } else {
        setServices(res || [])
      }
    } catch (err) {
      console.error('Error loading services:', err)
      toast.error('Failed to load services.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServices()
  }, [])

  const handleDelete = async (service) => {
    if (!window.confirm(`Are you sure you want to delete "${service.title}"?`)) return
    if (!service?._id) {
      toast.error('Unable to delete service: invalid service ID.')
      return
    }
    try {
      await serviceService.deleteService(service._id)
      toast.success('Service deleted successfully.')
      setServices((current) => current.filter((s) => s._id !== service._id))
    } catch (err) {
      console.error('Failed to delete service:', err)
      toast.error(err.response?.data?.message || 'Unable to delete service.')
    }
  }

  const filteredServices = services.filter(
    (s) =>
      s.title?.toLowerCase().includes(search.toLowerCase()) ||
      s.slug?.toLowerCase().includes(search.toLowerCase()) ||
      s.short_description?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="banner-page-container" style={{ maxWidth: 1280, margin: '0 auto' }}>
      <div className="banner-page-header">
        <div>
          <h1 className="banner-page-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Truck color="#0284c7" size={28} /> Services & SEO Management
          </h1>
          <p className="banner-page-subtitle">
            Manage dynamic service landing pages, localized H1/H2 headings, images, FAQs, and Schema SEO.
          </p>
        </div>
        <button
          className="banner-add-button"
          onClick={() => navigate('/admin/services/new')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
        >
          <Plus size={18} /> Add Service & SEO
        </button>
      </div>

      <div className="banner-toolbar" style={{ marginBottom: 20 }}>
        <div className="search-box-wrapper" style={{ maxWidth: 420 }}>
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by title, slug, or keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="banner-table-card" style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0' }}>
        {loading ? (
          <div className="banner-loading-state" style={{ padding: 48, textAlign: 'center' }}>
            <Loader2 size={32} className="spinner" style={{ margin: '0 auto 10px' }} />
            <p>Loading services & SEO records...</p>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="banner-empty-state" style={{ padding: 48, textAlign: 'center' }}>
            <SlidersHorizontal size={40} className="empty-icon" style={{ margin: '0 auto 10px', color: '#94a3b8' }} />
            <h3 style={{ fontSize: 18, color: '#1e293b' }}>No services found</h3>
            <p style={{ color: '#64748b', fontSize: 13, marginBottom: 16 }}>
              Try adjusting your search query or create a new service.
            </p>
            <button className="banner-add-button" onClick={() => navigate('/admin/services/new')}>
              <Plus size={16} /> Add Service & SEO
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="banner-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                  <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 700, color: '#475569' }}>Icon</th>
                  <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 700, color: '#475569' }}>Service Title & Details</th>
                  <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 700, color: '#475569' }}>Public URL</th>
                  <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 700, color: '#475569' }}>Status</th>
                  <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 700, color: '#475569' }}>SEO Ready</th>
                  <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 700, color: '#475569', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.map((svc, index) => (
                  <tr key={svc._id || index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <div
                        style={{
                          width: 42,
                          height: 42,
                          background: '#e0f2fe',
                          color: '#0369a1',
                          borderRadius: 10,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: 12,
                        }}
                      >
                        {svc.icon || 'Truck'}
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div>
                        <strong style={{ display: 'block', fontSize: 15, color: '#0f172a' }}>{svc.title}</strong>
                        {svc.short_description && (
                          <span style={{ fontSize: 12, color: '#64748b', display: 'block', marginTop: 2 }}>
                            {svc.short_description.substring(0, 65)}...
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <a
                        href={`http://localhost:5173/service/${svc.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          fontFamily: 'monospace',
                          fontSize: 13,
                          color: '#0284c7',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        /service/{svc.slug}
                        <ExternalLink size={12} />
                      </a>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          padding: '4px 10px',
                          borderRadius: 20,
                          fontSize: 11,
                          fontWeight: 700,
                          background: svc.status === 'active' ? '#dcfce7' : '#f1f5f9',
                          color: svc.status === 'active' ? '#166534' : '#64748b',
                        }}
                      >
                        {svc.status === 'active' ? 'Active / Published' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          fontSize: 12,
                          fontWeight: 700,
                          color: svc.seo?.title || svc.heroTitle ? '#166534' : '#ea580c',
                        }}
                      >
                        <ShieldCheck size={15} />
                        {svc.seo?.title || svc.heroTitle ? 'SEO Configured' : 'Needs SEO'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <button
                          type="button"
                          onClick={() => window.open(`http://localhost:5173/service/${svc.slug}`, '_blank')}
                          title="Preview Public Page"
                          style={{
                            background: '#f8fafc',
                            border: '1px solid #cbd5e1',
                            borderRadius: 8,
                            padding: '6px 10px',
                            cursor: 'pointer',
                            color: '#475569',
                          }}
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => navigate(`/admin/services/edit/${svc._id}`)}
                          title="Edit Service & SEO"
                          style={{
                            background: '#e0f2fe',
                            border: '1px solid #bae6fd',
                            borderRadius: 8,
                            padding: '6px 10px',
                            cursor: 'pointer',
                            color: '#0284c7',
                          }}
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(svc)}
                          title="Delete Service"
                          style={{
                            background: '#fee2e2',
                            border: '1px solid #fecaca',
                            borderRadius: 8,
                            padding: '6px 10px',
                            cursor: 'pointer',
                            color: '#b91c1c',
                          }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
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
