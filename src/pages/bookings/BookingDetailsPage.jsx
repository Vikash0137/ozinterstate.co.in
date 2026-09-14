import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import bookingService from '../../services/bookingService'

const BookingDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await bookingService.getBooking(id)
        const payload = res?.data?.data || {}
        setBooking(payload.booking || null)
      } catch (err) {
        console.error('Failed to load booking:', err)
        toast.error('Unable to load booking details.')
      } finally {
        setLoading(false)
      }
    }

    if (id) load()
  }, [id])

  if (loading) return <div style={{ padding: 24 }}>Loading booking...</div>
  if (!booking) return <div style={{ padding: 24 }}>Booking not found.</div>

  return (
    <div style={{ padding: 24 }}>
      <button type="button" onClick={() => navigate('/bookings')} style={{ marginBottom: 16, background: 'transparent', border: '1px solid #dfe7f1', borderRadius: 8, padding: '8px 12px', cursor: 'pointer' }}>
        ← Back to bookings
      </button>

      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <p style={{ margin: 0, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 12 }}>Booking</p>
            <h2 style={{ margin: '6px 0 0' }}>{booking.bookingNumber}</h2>
          </div>
          <span style={{ background: '#e2e8f0', color: '#0f172a', borderRadius: 999, padding: '6px 12px', textTransform: 'capitalize' }}>{booking.status}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18, marginTop: 24 }}>
          <div><strong>Customer</strong><div>{booking.customerName}</div></div>
          <div><strong>Email</strong><div>{booking.customerEmail}</div></div>
          <div><strong>Phone</strong><div>{booking.customerPhone}</div></div>
          <div><strong>Service</strong><div>{booking.serviceType}</div></div>
          <div><strong>Pickup</strong><div>{booking.pickupLocation}</div></div>
          <div><strong>Delivery</strong><div>{booking.deliveryLocation}</div></div>
          <div><strong>Pickup Date</strong><div>{new Date(booking.pickupDate).toLocaleString()}</div></div>
          <div><strong>Delivery Date</strong><div>{new Date(booking.deliveryDate).toLocaleString()}</div></div>
          <div><strong>Amount</strong><div>{new Intl.NumberFormat('en-AU', { style: 'currency', currency: booking.currency || 'AUD' }).format(Number(booking.totalAmount || 0))}</div></div>
          <div><strong>Assigned To</strong><div>{booking.assignedTo?.name || 'Unassigned'}</div></div>
        </div>

        <div style={{ marginTop: 24 }}>
          <h3>Notes</h3>
          <p style={{ whiteSpace: 'pre-wrap', color: '#334155' }}>{booking.notes || 'No notes recorded.'}</p>
        </div>
      </div>
    </div>
  )
}

export default BookingDetailsPage
