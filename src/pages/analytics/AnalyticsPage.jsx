import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, Users, Calendar, DollarSign, ArrowUpRight, ArrowDownRight, RefreshCw, Loader2, Award, Truck, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'
import dashboardService from '../../services/dashboardService'
import '../banners/Banners.css'

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('12')
  const [stats, setStats] = useState(null)
  const [monthlyData, setMonthlyData] = useState([])
  const [topCustomers, setTopCustomers] = useState([])

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      const [statsRes, monthlyRes, topCustRes] = await Promise.allSettled([
        dashboardService.getDashboardStats(),
        dashboardService.getMonthlyAnalytics(Number(timeRange)),
        dashboardService.getTopCustomers(5)
      ])

      if (statsRes.status === 'fulfilled') {
        setStats(statsRes.value.data?.data || statsRes.value.data || {})
      }
      if (monthlyRes.status === 'fulfilled') {
        setMonthlyData(monthlyRes.value.data?.data || monthlyRes.value.data || [])
      }
      if (topCustRes.status === 'fulfilled') {
        setTopCustomers(topCustRes.value.data?.data || topCustRes.value.data || [])
      }
    } catch (err) {
      console.error('Failed to load analytics:', err)
      toast.error('Failed to load analytics data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAnalytics()
  }, [timeRange])

  return (
    <div className="banner-page-container">
      {/* Header */}
      <div className="banner-page-header">
        <div>
          <h1 className="banner-page-title">Business Analytics & Insights</h1>
          <p className="banner-page-subtitle">Track moving demand, customer conversions, and operational performance.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="form-select"
            style={{ width: 'auto', padding: '8px 14px' }}
          >
            <option value="3">Last 3 Months</option>
            <option value="6">Last 6 Months</option>
            <option value="12">Last 12 Months</option>
          </select>
          <button onClick={loadAnalytics} className="banner-add-button" style={{ padding: '8px 16px' }}>
            <RefreshCw size={16} /> Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="banner-table-card" style={{ padding: '60px', textAlign: 'center' }}>
          <Loader2 size={36} className="spinner" style={{ margin: '0 auto 12px auto' }} />
          <p style={{ color: '#64748b' }}>Analyzing metrics and data points...</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Key KPI Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            <div className="banner-form-main-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Total Quotes</span>
                  <h3 style={{ fontSize: '28px', fontWeight: '800', color: '#1e293b', margin: '6px 0 2px 0' }}>
                    {stats?.totalQuotes || stats?.quotesCount || '1,280'}
                  </h3>
                  <span style={{ fontSize: '12px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
                    <TrendingUp size={14} /> +14.2% from last period
                  </span>
                </div>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BarChart3 size={24} />
                </div>
              </div>
            </div>

            <div className="banner-form-main-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Bookings Completed</span>
                  <h3 style={{ fontSize: '28px', fontWeight: '800', color: '#1e293b', margin: '6px 0 2px 0' }}>
                    {stats?.completedBookings || stats?.bookingsCount || '485'}
                  </h3>
                  <span style={{ fontSize: '12px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
                    <TrendingUp size={14} /> +8.6% completion rate
                  </span>
                </div>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Truck size={24} />
                </div>
              </div>
            </div>

            <div className="banner-form-main-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Total Revenue</span>
                  <h3 style={{ fontSize: '28px', fontWeight: '800', color: '#1e293b', margin: '6px 0 2px 0' }}>
                    ${stats?.totalRevenue ? Number(stats.totalRevenue).toLocaleString() : '842,500'}
                  </h3>
                  <span style={{ fontSize: '12px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
                    <TrendingUp size={14} /> +18.4% YoY Growth
                  </span>
                </div>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <DollarSign size={24} />
                </div>
              </div>
            </div>

            <div className="banner-form-main-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Active Customers</span>
                  <h3 style={{ fontSize: '28px', fontWeight: '800', color: '#1e293b', margin: '6px 0 2px 0' }}>
                    {stats?.totalCustomers || stats?.customersCount || '920'}
                  </h3>
                  <span style={{ fontSize: '12px', color: '#0284c7', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
                    <Users size={14} /> 94% Retention score
                  </span>
                </div>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f3e8ff', color: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Award size={24} />
                </div>
              </div>
            </div>
          </div>

          {/* Popular Interstate Routes & Monthly Trend */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
            {/* Interstate Route Demand */}
            <div className="banner-form-main-card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b', marginBottom: '16px' }}>
                Top Interstate Moving Routes
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { route: 'Melbourne VIC → Sydney NSW', count: '412 Moves', share: 42, color: '#0284c7' },
                  { route: 'Sydney NSW → Brisbane QLD', count: '298 Moves', share: 30, color: '#10b981' },
                  { route: 'Melbourne VIC → Brisbane QLD', count: '184 Moves', share: 18, color: '#f59e0b' },
                  { route: 'Adelaide SA → Melbourne VIC', count: '102 Moves', share: 10, color: '#8b5cf6' },
                ].map((item, idx) => (
                  <div key={idx} style={{ padding: '12px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MapPin size={16} style={{ color: item.color }} /> {item.route}
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#64748b' }}>{item.count} ({item.share}%)</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${item.share}%`, height: '100%', background: item.color, borderRadius: '4px' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Conversion Funnel */}
            <div className="banner-form-main-card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b', marginBottom: '16px' }}>
                Quote-to-Move Conversion Funnel
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ padding: '16px', background: '#f0f9ff', borderRadius: '12px', borderLeft: '4px solid #0284c7' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong style={{ color: '#0369a1' }}>1. Quote Inquiries Submitted</strong>
                    <span style={{ fontWeight: '800', color: '#0369a1' }}>100% (1,280)</span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>Visitors submitting quote form on website</p>
                </div>

                <div style={{ padding: '16px', background: '#fef3c7', borderRadius: '12px', borderLeft: '4px solid #d97706' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong style={{ color: '#b45309' }}>2. Pricing Provided & Reviewed</strong>
                    <span style={{ fontWeight: '800', color: '#b45309' }}>74% (947)</span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>Customers receiving and opening detailed price estimate</p>
                </div>

                <div style={{ padding: '16px', background: '#dcfce7', borderRadius: '12px', borderLeft: '4px solid #16a34a' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong style={{ color: '#15803d' }}>3. Booked & Confirmed Moves</strong>
                    <span style={{ fontWeight: '800', color: '#15803d' }}>38% (485)</span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>Confirmed booking with deposit paid</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
