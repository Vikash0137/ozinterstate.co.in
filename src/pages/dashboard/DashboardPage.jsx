import React, { useEffect, useState } from 'react'
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  FileText,
  MapPin,
  MessageSquareText,
  Quote,
  Star,
  TrendingUp,
  Truck,
  Users,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LineChart,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useNavigate } from 'react-router-dom'
import apiClient from '../../services/apiClient'
import dashboardService from '../../services/dashboardService'
import './DashboardPage.css'

const activities = [
  {
    icon: Quote,
    title: 'New quote request received',
    description: 'John Smith submitted a Sydney to Melbourne request.',
    time: '5 minutes ago',
  },
  {
    icon: CalendarDays,
    title: 'Booking confirmed',
    description: 'Booking OZ-B204 has been confirmed for 10 August.',
    time: '24 minutes ago',
  },
  {
    icon: MessageSquareText,
    title: 'New contact enquiry',
    description: 'A new contact form message requires a response.',
    time: '42 minutes ago',
  },
  {
    icon: Star,
    title: 'Five-star review received',
    description: 'A new customer review is waiting for approval.',
    time: '1 hour ago',
  },
]

const DashboardPage = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [remoteStats, setRemoteStats] = useState(null)
  const [recentQuotes, setRecentQuotes] = useState([])
  const [recentCustomers, setRecentCustomers] = useState([])
  const [monthlyData, setMonthlyData] = useState([])
  const [customerGrowthData, setCustomerGrowthData] = useState([])
  const [topCustomers, setTopCustomers] = useState([])
  const [quoteValue, setQuoteValue] = useState(null)

  useEffect(() => {
    let mounted = true
    const loadDashboardData = async () => {
      try {
        setLoading(true)
        const [statsRes, recentQuotesRes, recentCustomersRes, monthlyRes, growthRes, topRes, valueRes] = await Promise.all([
          dashboardService.getDashboardStats(),
          dashboardService.getRecentQuotes(10),
          dashboardService.getRecentCustomers(10),
          dashboardService.getMonthlyAnalytics(12),
          dashboardService.getCustomerGrowth(12),
          dashboardService.getTopCustomers(10),
          dashboardService.getQuoteValueAnalytics(),
        ])

        if (mounted) {
          if (statsRes?.data?.success) setRemoteStats(statsRes.data.data)
          if (recentQuotesRes?.data?.success) setRecentQuotes(recentQuotesRes.data.data.quotes || [])
          if (recentCustomersRes?.data?.success) setRecentCustomers(recentCustomersRes.data.data.customers || [])
          if (monthlyRes?.data?.success) setMonthlyData(monthlyRes.data.data.months || [])
          if (growthRes?.data?.success) setCustomerGrowthData(growthRes.data.data.months || [])
          if (topRes?.data?.success) setTopCustomers(topRes.data.data.customers || [])
          if (valueRes?.data?.success) setQuoteValue(valueRes.data.data)
          setLoading(false)
        }
      } catch (err) {
        console.warn('Failed loading dashboard data', err)
        if (mounted) setLoading(false)
      }
    }
    loadDashboardData()
    return () => {
      mounted = false
    }
  }, [])

  const stats = [
    {
      label: 'Total Quotes',
      value: remoteStats ? String(remoteStats.total_quotes || 0) : '—',
      change: '+12.5%',
      trend: 'up',
      icon: Quote,
      description: 'All quotes',
    },
    {
      label: 'Pending Quotes',
      value: remoteStats ? String(remoteStats.pending_quotes || 0) : '—',
      change: '-4.2%',
      trend: 'down',
      icon: Clock3,
      description: 'Requires action',
    },
    {
      label: 'Total Customers',
      value: remoteStats ? String(remoteStats.total_customers || 0) : '—',
      change: '+8.3%',
      trend: 'up',
      icon: Users,
      description: 'Registered customers',
    },
    {
      label: 'Active Customers',
      value: remoteStats ? String(remoteStats.active_customers || 0) : '—',
      change: '+16.1%',
      trend: 'up',
      icon: Star,
      description: 'Currently active',
    },
  ]

  // Prepare chart data - filter out months with zero quotes
  const chartMonthlyData = monthlyData.length > 0
    ? monthlyData.map((m) => ({
        month: m.month,
        quotes: m.quotes || 0,
        approved: m.approved || 0,
        completed: m.completed || 0,
        value: m.value || 0,
      }))
    : []

  const chartGrowthData = customerGrowthData.length > 0
    ? customerGrowthData.map((m) => ({
        month: m.month,
        customers: m.customers || 0,
      }))
    : []

  // Status distribution for pie chart
  const statusData = remoteStats
    ? [
        { name: 'New', value: remoteStats.new_quotes || 0, color: '#2864C7' },
        { name: 'Contacted', value: remoteStats.contacted_quotes || 0, color: '#073B78' },
        { name: 'Quoted', value: remoteStats.quoted_quotes || 0, color: '#C58A22' },
        { name: 'Converted', value: remoteStats.converted_quotes || 0, color: '#087C35' },
      ].filter((s) => s.value > 0)
    : []

  const totalForPie = statusData.reduce((sum, s) => sum + s.value, 0)

  return (
    <div className="dashboard-page">
      <div className="dashboard-welcome">
        <div>
          <p>{new Date().toLocaleDateString()}</p>
          <h2>Welcome back, OZ Admin</h2>
          <span>Here is what is happening with your moving business today.</span>
        </div>

        <button type="button" className="dashboard-primary-button" onClick={() => navigate('/quotes/new')}>
          <FileText size={18} /> Create New Quote
        </button>
      </div>

      <section className="dashboard-stat-grid">
        {stats.map((stat) => {
          const Icon = stat.icon
          const TrendIcon = stat.trend === 'up' ? ArrowUpRight : ArrowDownRight

          return (
            <article className="dashboard-stat-card" key={stat.label}>
              <div className="stat-card-top">
                <div className="stat-card-icon">
                  <Icon size={21} />
                </div>

                <span className={`stat-change ${stat.trend}`}>
                  <TrendIcon size={14} /> {stat.change}
                </span>
              </div>

              <div className="stat-card-content">
                <p>{stat.label}</p>
                <h3>{loading ? '...' : stat.value}</h3>
                <span>{stat.description}</span>
              </div>
            </article>
          )
        })}
      </section>

      <section className="dashboard-chart-grid">
        <article className="dashboard-card quote-chart-card">
          <div className="dashboard-card-heading">
            <div>
              <p>Performance</p>
              <h3>Quote trends (12 months)</h3>
              <span>Monthly quote activity and completion status.</span>
            </div>
          </div>

          <div className="chart-legend">
            <span>
              <i className="legend-quotes" /> Quotes
            </span>

            <span>
              <i className="legend-bookings" /> Approved
            </span>
          </div>

          <div className="bar-chart-wrapper">
            {chartMonthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartMonthlyData} barGap={6}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e9eef3" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#8190a0', fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#8190a0', fontSize: 11 }} />
                  <Tooltip cursor={{ fill: '#f5f7fa' }} />
                  <Bar dataKey="quotes" fill="#073B78" radius={[5, 5, 0, 0]} maxBarSize={25} />
                  <Bar dataKey="approved" fill="#087C35" radius={[5, 5, 0, 0]} maxBarSize={25} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                No data available
              </div>
            )}
          </div>
        </article>

        <article className="dashboard-card status-chart-card">
          <div className="dashboard-card-heading">
            <div>
              <p>Quote Status</p>
              <h3>Current distribution</h3>
              <span>Quote status summary.</span>
            </div>
          </div>

          {statusData.length > 0 ? (
            <>
              <div className="pie-chart-wrapper">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={65} outerRadius={92} paddingAngle={4} stroke="none">
                      {statusData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>

                <div className="pie-center">
                  <strong>{totalForPie}</strong>
                  <span>Total Quotes</span>
                </div>
              </div>

              <div className="status-legend">
                {statusData.map((item) => (
                  <div key={item.name}>
                    <span>
                      <i style={{ background: item.color }} /> {item.name}
                    </span>

                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
              No data available
            </div>
          )}
        </article>
      </section>

      <section className="dashboard-chart-grid">
        <article className="dashboard-card quote-chart-card">
          <div className="dashboard-card-heading">
            <div>
              <p>Growth</p>
              <h3>Customer registrations</h3>
              <span>Monthly new customer signups.</span>
            </div>
          </div>

          <div className="bar-chart-wrapper">
            {chartGrowthData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e9eef3" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#8190a0', fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#8190a0', fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="customers" stroke="#2864C7" strokeWidth={2} dot={{ fill: '#2864C7', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                No data available
              </div>
            )}
          </div>
        </article>

        <article className="dashboard-card status-chart-card">
          <div className="dashboard-card-heading">
            <div>
              <p>Revenue</p>
              <h3>Quote value analytics</h3>
              <span>Quote value totals by status.</span>
            </div>
          </div>

          {quoteValue ? (
            <div className="revenue-stats">
              <div className="revenue-stat-item">
                <p>Total Value</p>
                <h3>${quoteValue.total_value?.toLocaleString('en-AU') || 0}</h3>
              </div>

              <div className="revenue-stat-item">
                <p>Approved Value</p>
                <h3>${quoteValue.approved_value?.toLocaleString('en-AU') || 0}</h3>
              </div>

              <div className="revenue-stat-item">
                <p>Completed Value</p>
                <h3>${quoteValue.completed_value?.toLocaleString('en-AU') || 0}</h3>
              </div>
            </div>
          ) : (
            <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
              No data available
            </div>
          )}
        </article>
      </section>

      <section className="dashboard-bottom-grid">
        <article className="dashboard-card recent-quotes-card">
          <div className="dashboard-card-heading">
            <div>
              <p>Latest Requests</p>
              <h3>Recent quotes</h3>
            </div>

            <button type="button" className="view-all-button" onClick={() => navigate('/quotes')}>
              View all
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="dashboard-table-wrapper">
            {recentQuotes.length > 0 ? (
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Quote ID</th>
                    <th>Customer</th>
                    <th>Service</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {recentQuotes.map((quote) => (
                    <tr key={quote._id || quote.quoteNumber}>
                      <td>
                        <button
                          style={{ background: 'none', border: 'none', color: '#2864C7', cursor: 'pointer', textDecoration: 'underline' }}
                          onClick={() => navigate(`/quotes/${quote._id}`)}
                        >
                          <strong>{quote.quoteNumber || '—'}</strong>
                        </button>
                      </td>

                      <td>
                        <div className="customer-table-cell">
                          <span>{(quote.customerId?.name || quote.customerName || 'N/A').charAt(0).toUpperCase()}</span>
                          {quote.customerId?.name || quote.customerName || 'N/A'}
                        </div>
                      </td>

                      <td>{quote.serviceType || '—'}</td>
                      <td>${(quote.totalAmount || 0).toLocaleString('en-AU')}</td>

                      <td>
                        <span className={`quote-status ${quote.status?.toLowerCase() || 'new'}`}>{quote.status || 'NEW'}</span>
                      </td>

                      <td>{quote.createdAt ? new Date(quote.createdAt).toLocaleDateString() : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>No quotes available</div>
            )}
          </div>
        </article>

        <article className="dashboard-card activity-card">
          <div className="dashboard-card-heading">
            <div>
              <p>Updates</p>
              <h3>Recent activity</h3>
            </div>
          </div>

          <div className="activity-list">
            {activities.map((activity) => {
              const Icon = activity.icon

              return (
                <div className="activity-item" key={activity.title}>
                  <div className="activity-icon">
                    <Icon size={17} />
                  </div>

                  <div>
                    <strong>{activity.title}</strong>
                    <p>{activity.description}</p>
                    <span>{activity.time}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </article>
      </section>

      <section className="dashboard-bottom-grid">
        <article className="dashboard-card recent-customers-card">
          <div className="dashboard-card-heading">
            <div>
              <p>Latest Registrations</p>
              <h3>Recent customers</h3>
            </div>

            <button type="button" className="view-all-button" onClick={() => navigate('/customers')}>
              View all
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="dashboard-table-wrapper">
            {recentCustomers.length > 0 ? (
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Company</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {recentCustomers.map((customer) => (
                    <tr key={customer._id}>
                      <td>
                        <button
                          style={{ background: 'none', border: 'none', color: '#2864C7', cursor: 'pointer', textDecoration: 'underline' }}
                          onClick={() => navigate(`/customers/${customer._id}`)}
                        >
                          <strong>{customer.name || '—'}</strong>
                        </button>
                      </td>

                      <td>{customer.companyName || '—'}</td>
                      <td>{customer.email || '—'}</td>
                      <td>{customer.phone || '—'}</td>

                      <td>
                        <span className={`quote-status ${customer.status?.toLowerCase() || 'active'}`}>{customer.status || 'active'}</span>
                      </td>

                      <td>{customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>No customers available</div>
            )}
          </div>
        </article>

        <article className="dashboard-card top-customers-card">
          <div className="dashboard-card-heading">
            <div>
              <p>Engagement</p>
              <h3>Top customers</h3>
              <span>By quote activity.</span>
            </div>

            <button type="button" className="view-all-button" onClick={() => navigate('/customers')}>
              View all
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="dashboard-table-wrapper">
            {topCustomers.length > 0 ? (
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Company</th>
                    <th>Quotes</th>
                    <th>Total Value</th>
                  </tr>
                </thead>

                <tbody>
                  {topCustomers.map((customer) => (
                    <tr key={customer.customerId}>
                      <td>
                        <button
                          style={{ background: 'none', border: 'none', color: '#2864C7', cursor: 'pointer', textDecoration: 'underline' }}
                          onClick={() => navigate(`/customers/${customer.customerId}`)}
                        >
                          <strong>{customer.name || '—'}</strong>
                        </button>
                      </td>

                      <td>{customer.companyName || '—'}</td>
                      <td>{customer.quoteCount || 0}</td>
                      <td>${(customer.totalValue || 0).toLocaleString('en-AU')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>No customer data available</div>
            )}
          </div>
        </article>
      </section>

      <section className="dashboard-quick-grid">
        <article className="quick-action-card">
          <div className="quick-action-icon">
            <Truck size={21} />
          </div>

          <div>
            <strong>Upcoming Moves</strong>
            <span>18 jobs scheduled this week</span>
          </div>

          <ChevronRight size={18} />
        </article>

        <article className="quick-action-card">
          <div className="quick-action-icon">
            <Users size={21} />
          </div>

          <div>
            <strong>Available Team</strong>
            <span>12 staff members available</span>
          </div>

          <ChevronRight size={18} />
        </article>

        <article className="quick-action-card">
          <div className="quick-action-icon">
            <CircleDollarSign size={21} />
          </div>

          <div>
            <strong>Monthly Revenue</strong>
            <span>{quoteValue ? `$${quoteValue.total_value?.toLocaleString('en-AU') || '0'}` : '—'}</span>
          </div>

          <ChevronRight size={18} />
        </article>

        <article className="quick-action-card">
          <div className="quick-action-icon">
            <TrendingUp size={21} />
          </div>

          <div>
            <strong>Conversion Rate</strong>
            <span>
              {remoteStats ? `${remoteStats.total_quotes > 0 ? Math.round((remoteStats.converted_quotes / remoteStats.total_quotes) * 100) : 0}%` : '—'}
            </span>
          </div>

          <ChevronRight size={18} />
        </article>
      </section>
    </div>
  )
}

export default DashboardPage
