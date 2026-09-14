import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarDays, Edit2, Eye, Loader2, Plus, RefreshCw, Search, Trash2, UserCheck, UserPlus, Users, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import customerService from '../../services/customerService'
import './Customers.css'

const initials = (name = '') => name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'NA'
const dateValue = (customer) => customer.createdAt || customer.created_at
const formatDate = (date) => date ? new Date(date).toLocaleDateString() : '—'

export default function CustomersPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [customers, setCustomers] = useState([])
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [sort, setSort] = useState('newest')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCustomers, setTotalCustomers] = useState(0)
  const [today] = useState(() => new Date())

  const load = async (nextPage = page) => {
    setLoading(true)
    setError('')
    try {
      const res = await customerService.getCustomers({ page: nextPage, limit })
      if (!res?.data?.success) throw new Error('Customer request failed')
      const result = res.data.data
      setCustomers(result.customers || [])
      setPage(result.pagination?.page || nextPage)
      setTotalPages(result.pagination?.totalPages || 1)
      setTotalCustomers(result.pagination?.total || result.customers?.length || 0)
    } catch (err) {
      console.error('Failed to load customers', err)
      setError('Unable to load customer records. Please try again.')
    } finally { setLoading(false) }
  }

  useEffect(() => { const timer = setTimeout(() => load(1), 0); return () => clearTimeout(timer) }, [limit])

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase()
    return [...customers]
      .filter((customer) => !query || [customer.name, customer.email, customer.phone, customer.companyName].some((value) => String(value || '').toLowerCase().includes(query)))
      .filter((customer) => status === 'all' || customer.status === status)
      .filter((customer) => {
        if (dateFilter === 'all') return true
        const date = new Date(dateValue(customer)); const now = new Date()
        return dateFilter === 'month' ? date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear() : date >= new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)
      })
      .sort((a, b) => {
        if (sort === 'nameAsc' || sort === 'nameDesc') return String(a.name || '').localeCompare(String(b.name || '')) * (sort === 'nameAsc' ? 1 : -1)
        return (new Date(dateValue(b) || 0) - new Date(dateValue(a) || 0)) * (sort === 'newest' ? 1 : -1)
      })
  }, [customers, search, status, dateFilter, sort])

  const activeCount = customers.filter((customer) => customer.status === 'active').length
  const newCount = customers.filter((customer) => new Date(dateValue(customer)) >= new Date(today.getTime() - 30 * 86400000)).length
  const monthCount = customers.filter((customer) => { const date = new Date(dateValue(customer)); return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear() }).length

  const handleDelete = async (customer) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return
    try { await customerService.deleteCustomer(customer._id); toast.success('Customer deleted successfully.'); load(page) } catch (err) { console.error('Failed to delete customer', err); toast.error('Unable to delete customer.') }
  }

  return <div className="customer-page">
    <div className="customer-header"><div><h1 className="customer-title">Customers</h1><p className="customer-subtitle">Manage and view all customer records.</p></div><button className="customer-primary" onClick={() => navigate('/customers/new')}><Plus size={18} /> Add New Customer</button></div>
    <div className="customer-stat-grid">
      <div className="customer-stat-card"><Users size={18} color="#0284c7" /><span className="customer-stat-label">Total Customers</span><strong className="customer-stat-value">{totalCustomers}</strong></div>
      <div className="customer-stat-card"><UserCheck size={18} color="#16a34a" /><span className="customer-stat-label">Active Customers</span><strong className="customer-stat-value">{activeCount}</strong></div>
      <div className="customer-stat-card"><UserPlus size={18} color="#d97706" /><span className="customer-stat-label">New Customers</span><strong className="customer-stat-value">{newCount}</strong></div>
      <div className="customer-stat-card"><CalendarDays size={18} color="#7e22ce" /><span className="customer-stat-label">This Month</span><strong className="customer-stat-value">{monthCount}</strong></div>
    </div>
    <div className="customer-toolbar"><div className="customer-search"><Search size={18} /><input className="customer-input" placeholder="Search by name, email, phone or company..." value={search} onChange={(e) => setSearch(e.target.value)} /></div><div className="customer-filter-group"><select className="customer-select" value={status} onChange={(e) => setStatus(e.target.value)}><option value="all">All Statuses</option><option value="active">Active</option><option value="inactive">Inactive</option></select><select className="customer-select" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}><option value="all">All Dates</option><option value="week">Last 7 Days</option><option value="month">This Month</option></select><select className="customer-select" value={sort} onChange={(e) => setSort(e.target.value)}><option value="newest">Newest</option><option value="oldest">Oldest</option><option value="nameAsc">Name A-Z</option><option value="nameDesc">Name Z-A</option></select><button className="customer-secondary" onClick={() => load(page)} title="Refresh customers"><RefreshCw size={16} /></button></div></div>
    <div className="customer-table-card">
      {loading ? <div className="customer-state"><Loader2 className="spinner" size={32} /><p>Loading customer records...</p></div> : error ? <div className="customer-state"><XCircle size={40} /><h3>Customers could not be loaded</h3><p>{error}</p><button className="customer-secondary" onClick={() => load(page)}>Retry</button></div> : filteredCustomers.length === 0 ? <div className="customer-state"><Users size={40} /><h3>No Customers Found</h3><p>There are currently no customer records.</p><button className="customer-primary" onClick={() => navigate('/customers/new')}><Plus size={16} /> Add New Customer</button></div> : <div className="customer-table-wrap"><table className="customer-table"><thead><tr><th>Customer</th><th>Email</th><th>Phone</th><th>Company</th><th>Status</th><th>Created Date</th><th>Actions</th></tr></thead><tbody>{filteredCustomers.map((customer) => <tr key={customer._id}><td><div className="customer-person"><span className="customer-avatar">{initials(customer.name)}</span><strong>{customer.name}</strong></div></td><td>{customer.email}</td><td>{customer.phone}</td><td>{customer.companyName || <span className="customer-muted">—</span>}</td><td><span className={`customer-status ${customer.status}`}>{customer.status}</span></td><td>{formatDate(dateValue(customer))}</td><td><div className="customer-actions"><button className="customer-icon-btn view" title="View customer" onClick={() => navigate(`/customers/${customer._id}`)}><Eye size={16} /></button><button className="customer-icon-btn edit" title="Edit customer" onClick={() => navigate(`/customers/${customer._id}/edit`)}><Edit2 size={16} /></button><button className="customer-icon-btn delete" title="Delete customer" onClick={() => handleDelete(customer)}><Trash2 size={16} /></button></div></td></tr>)}</tbody></table></div>}
      {!loading && !error && customers.length > 0 && <div className="customer-pagination"><span>Rows per page: <select className="customer-select" style={{ width: 78, padding: '6px 8px' }} value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1) }}><option>10</option><option>25</option><option>50</option><option>100</option></select></span><div className="customer-pagination-controls"><button className="customer-page-btn" onClick={() => load(Math.max(1, page - 1))} disabled={page <= 1}>Previous</button><span>Page {page} / {totalPages}</span><button className="customer-page-btn" onClick={() => load(Math.min(totalPages, page + 1))} disabled={page >= totalPages}>Next</button></div></div>}
    </div>
  </div>
}
