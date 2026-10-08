import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import bookingService from '../../services/bookingService'

const statusOptions = [
  { label: 'All Bookings', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'In Transit', value: 'in_transit' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
]

const BookingsPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const currentPath = location.pathname.replace(/\/+$/, '')
    if (currentPath.endsWith('/upcoming')) setStatusFilter('confirmed')
    else if (currentPath.endsWith('/completed')) setStatusFilter('completed')
    else setStatusFilter('all')
  }, [location.pathname])

  const fetchBookings = async (nextPage = 1, nextStatus = statusFilter) => {
    try {
      setLoading(true)
      const params = { page: nextPage, limit: 10 }
      if (nextStatus && nextStatus !== 'all') params.status = nextStatus
      if (search.trim()) params.search = search.trim()
      const res = await bookingService.getBookings(params)
      const payload = res?.data?.data || {}
      if (res?.data?.success) {
        setBookings(payload.data || [])
        setPage(payload.page || 1)
        setTotalPages(payload.totalPages || 1)
      }
    } catch (err) {
      console.error('Failed to load bookings:', err)
      toast.error('Unable to load bookings.')
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings(1, statusFilter)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBookings(1, statusFilter)
    }, 250)
    return () => clearTimeout(timer)
  }, [search])

  const visibleRows = useMemo(() => bookings, [bookings])

  const handleDelete = async (id) => {
    if (!window.confirm('Cancel this booking?')) return
    try {
      await bookingService.deleteBooking(id)
      toast.success('Booking cancelled.')
      fetchBookings(page, statusFilter)
    } catch (err) {
      console.error('Failed to cancel booking:', err)
      toast.error('Unable to cancel booking.')
    }
  }

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <p style={{ margin: 0, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 12 }}>Operations</p>
          <h2 style={{ margin: '6px 0 0' }}>Bookings Management</h2>
        </div>
        <button type="button" onClick={() => navigate('/bookings/new')} style={{ padding: '10px 16px', borderRadius: 10, border: 'none', background: '#0f172a', color: '#fff', cursor: 'pointer' }}>
          + New Booking
        </button>
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by booking, customer or location"
          style={{ flex: 1, minWidth: 220, padding: '10px 12px', borderRadius: 10, border: '1px solid #dfe7f1' }}
        />
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          style={{ padding: '10px 12px', borderRadius: 10, border: '1px solid #dfe7f1' }}
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div>Loading bookings...</div>
      ) : visibleRows.length === 0 ? (
        <div style={{ padding: 24, background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0' }}>No bookings found.</div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f8fafc' }}>
              <tr>
                <th style={{ padding: '12px 14px', textAlign: 'left' }}>Booking</th>
                <th style={{ padding: '12px 14px', textAlign: 'left' }}>Customer</th>
                <th style={{ padding: '12px 14px', textAlign: 'left' }}>Route</th>
                <th style={{ padding: '12px 14px', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '12px 14px', textAlign: 'left' }}>Amount</th>
                <th style={{ padding: '12px 14px', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((booking) => (
                <tr key={booking._id} style={{ borderTop: '1px solid #edf2f7' }}>
                  <td style={{ padding: '12px 14px' }}>
                    <strong>{booking.bookingNumber || booking._id}</strong><br />
                    <span style={{ color: '#64748b', fontSize: 12 }}>{booking.serviceType}</span>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    {booking.customerName}<br />
                    <span style={{ color: '#64748b', fontSize: 12 }}>{booking.customerEmail}</span>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    {booking.pickupLocation} → {booking.deliveryLocation}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ background: '#e2e8f0', color: '#0f172a', borderRadius: 999, padding: '4px 8px', fontSize: 12, textTransform: 'capitalize' }}>{booking.status}</span>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    {new Intl.NumberFormat('en-AU', { style: 'currency', currency: booking.currency || 'AUD' }).format(Number(booking.totalAmount || 0))}
                  </td>
                  <td style={{ padding: '12px 14px', display: 'flex', gap: 8 }}>
                    <button type="button" onClick={() => navigate(`/bookings/${booking._id}`)} style={{ cursor: 'pointer', border: '1px solid #dfe7f1', background: '#fff', borderRadius: 8, padding: '6px 10px' }}>View</button>
                    <button type="button" onClick={() => navigate(`/bookings/${booking._id}/edit`)} style={{ cursor: 'pointer', border: '1px solid #dfe7f1', background: '#fff', borderRadius: 8, padding: '6px 10px' }}>Edit</button>
                    <button type="button" onClick={() => handleDelete(booking._id)} style={{ cursor: 'pointer', border: '1px solid #fecaca', background: '#fff1f2', color: '#b91c1c', borderRadius: 8, padding: '6px 10px' }}>Cancel</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
        <button type="button" onClick={() => fetchBookings(Math.max(1, page - 1), statusFilter)} disabled={page <= 1} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #dfe7f1', background: '#fff', cursor: page <= 1 ? 'not-allowed' : 'pointer' }}>
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button type="button" onClick={() => fetchBookings(Math.min(totalPages, page + 1), statusFilter)} disabled={page >= totalPages} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #dfe7f1', background: '#fff', cursor: page >= totalPages ? 'not-allowed' : 'pointer' }}>
          Next
        </button>
      </div>
    </div>
  )
}

export default BookingsPage
