import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart3, TrendingUp, MapPin, Eye, Users, Award, AlertTriangle, ArrowRight, Loader2 } from 'lucide-react'
import locationService from '../../services/locationService'

export default function LocationAnalyticsPage() {
  const navigate = useNavigate()
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true)
        const res = await locationService.getLocationsAnalytics()
        if (res.data?.success) {
          setAnalytics(res.data.data)
        }
      } catch (err) {
        console.error('Failed to load location analytics:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  if (loading) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', minHeight: 300, color: '#64748b' }}>
        <Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} />
        <div style={{ marginTop: 12 }}>Loading location SEO analytics...</div>
      </div>
    )
  }

  const data = analytics || {
    total: 0,
    published: 0,
    draft: 0,
    unpublished: 0,
    archived: 0,
    avgSeoScore: 85,
    topLocations: [],
    topLeads: [],
  }

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 30, color: '#183149', display: 'flex', alignItems: 'center', gap: 10 }}>
            <BarChart3 size={28} color="#0284c7" /> Location SEO Analytics & Performance
          </h1>
          <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: 14 }}>
            Monitor dynamic city page indexability, content quality scores, and localized lead generation.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/admin/locations')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: '#fff',
            color: '#183149',
            border: '1px solid #e2e8f0',
            borderRadius: 12,
            padding: '10px 16px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          View All Locations <ArrowRight size={16} />
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div style={cardStyle}>
          <span style={cardLabelStyle}>Total Locations</span>
          <strong style={{ fontSize: 26, color: '#183149', display: 'block', marginTop: 4 }}>{data.total}</strong>
          <span style={{ fontSize: 12, color: '#64748b' }}>{data.published} Indexable & Published</span>
        </div>

        <div style={cardStyle}>
          <span style={cardLabelStyle}>Average SEO Health</span>
          <strong style={{ fontSize: 26, color: data.avgSeoScore >= 80 ? '#10b981' : '#f59e0b', display: 'block', marginTop: 4 }}>
            {data.avgSeoScore} / 100
          </strong>
          <span style={{ fontSize: 12, color: '#64748b' }}>Content & meta completeness</span>
        </div>

        <div style={cardStyle}>
          <span style={cardLabelStyle}>Published vs Drafts</span>
          <div style={{ display: 'flex', gap: 8, marginTop: 6, alignItems: 'center' }}>
            <span style={{ padding: '3px 8px', borderRadius: 6, background: '#dcfce7', color: '#166534', fontWeight: 700, fontSize: 12 }}>
              {data.published} Pub
            </span>
            <span style={{ padding: '3px 8px', borderRadius: 6, background: '#fef3c7', color: '#92400e', fontWeight: 700, fontSize: 12 }}>
              {data.draft} Draft
            </span>
            <span style={{ padding: '3px 8px', borderRadius: 6, background: '#f1f5f9', color: '#475569', fontWeight: 700, fontSize: 12 }}>
              {data.unpublished} Unpub
            </span>
          </div>
        </div>
      </div>

      {/* Tables Grid: Top Viewed & Top Leads */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 20 }}>
        {/* Top Viewed Locations */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: 20 }}>
          <h3 style={{ margin: '0 0 16px', color: '#183149', fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Eye size={18} color="#0284c7" /> Top Viewed Locations
          </h3>

          {data.topLocations.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: 13 }}>No traffic data recorded yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {data.topLocations.map((loc, idx) => (
                <div
                  key={loc._id || idx}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#f8fafc', borderRadius: 10 }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontWeight: 800, color: '#94a3b8', fontSize: 12 }}>#{idx + 1}</span>
                    <div>
                      <div style={{ fontWeight: 700, color: '#183149', fontSize: 14 }}>{loc.name}</div>
                      <code style={{ fontSize: 11, color: '#64748b' }}>/location/{loc.slug}</code>
                    </div>
                  </div>
                  <span style={{ fontWeight: 800, color: '#0284c7', fontSize: 14 }}>
                    {loc.views || 0} views
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Performing Leads */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: 20 }}>
          <h3 style={{ margin: '0 0 16px', color: '#183149', fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Users size={18} color="#10b981" /> Lead Attribution by Location
          </h3>

          {data.topLeads.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: 13 }}>No location leads captured yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {data.topLeads.map((loc, idx) => (
                <div
                  key={loc._id || idx}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#f8fafc', borderRadius: 10 }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontWeight: 800, color: '#94a3b8', fontSize: 12 }}>#{idx + 1}</span>
                    <div>
                      <div style={{ fontWeight: 700, color: '#183149', fontSize: 14 }}>{loc.name}</div>
                      <span style={{ fontSize: 11, color: '#64748b' }}>{loc.state} • Score: {loc.seoScore}/100</span>
                    </div>
                  </div>
                  <span style={{ fontWeight: 800, color: '#10b981', fontSize: 14 }}>
                    {loc.leadsCount || 0} inquiries
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const cardStyle = {
  background: '#fff',
  border: '1px solid #e2e8f0',
  borderRadius: 14,
  padding: '18px 20px',
}

const cardLabelStyle = {
  fontSize: 12,
  fontWeight: 700,
  color: '#64748b',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
}
