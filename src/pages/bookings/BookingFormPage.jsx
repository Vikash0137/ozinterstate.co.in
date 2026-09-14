import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import bookingService from '../../services/bookingService'

const BookingFormPage = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    customerId: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    serviceType: 'Interstate Moving',
    pickupLocation: '',
    deliveryLocation: '',
    pickupDate: '',
    deliveryDate: '',
    totalAmount: 0,
    currency: 'AUD',
    status: 'pending',
    notes: '',
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      await bookingService.createBooking({
        ...form,
        totalAmount: Number(form.totalAmount || 0),
      })
      toast.success('Booking created successfully.')
      navigate('/bookings')
    } catch (err) {
      console.error('Failed to create booking:', err)
      toast.error('Unable to create booking.')
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Create Booking</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 760, background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          <label>Customer ID<input name="customerId" value={form.customerId} onChange={handleChange} style={inputStyle} /></label>
          <label>Customer Name<input name="customerName" value={form.customerName} onChange={handleChange} style={inputStyle} /></label>
          <label>Email<input name="customerEmail" type="email" value={form.customerEmail} onChange={handleChange} style={inputStyle} /></label>
          <label>Phone<input name="customerPhone" value={form.customerPhone} onChange={handleChange} style={inputStyle} /></label>
          <label>Service Type<select name="serviceType" value={form.serviceType} onChange={handleChange} style={inputStyle}><option>Interstate Moving</option><option>Residential Moving</option><option>Commercial Moving</option><option>Packing</option><option>Storage</option></select></label>
          <label>Pickup Location<input name="pickupLocation" value={form.pickupLocation} onChange={handleChange} style={inputStyle} /></label>
          <label>Delivery Location<input name="deliveryLocation" value={form.deliveryLocation} onChange={handleChange} style={inputStyle} /></label>
          <label>Pickup Date<input name="pickupDate" type="date" value={form.pickupDate} onChange={handleChange} style={inputStyle} /></label>
          <label>Delivery Date<input name="deliveryDate" type="date" value={form.deliveryDate} onChange={handleChange} style={inputStyle} /></label>
          <label>Total Amount<input name="totalAmount" type="number" value={form.totalAmount} onChange={handleChange} style={inputStyle} /></label>
          <label>Status<select name="status" value={form.status} onChange={handleChange} style={inputStyle}><option value="pending">pending</option><option value="confirmed">confirmed</option><option value="in_transit">in_transit</option><option value="delivered">delivered</option><option value="completed">completed</option><option value="cancelled">cancelled</option></select></label>
          <label>Currency<select name="currency" value={form.currency} onChange={handleChange} style={inputStyle}><option>AUD</option><option>USD</option></select></label>
        </div>
        <label style={{ display: 'block', marginTop: 16 }}>Notes<textarea name="notes" value={form.notes} onChange={handleChange} rows={5} style={{ ...inputStyle, minHeight: 120 }} /></label>

        <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
          <button type="submit" style={{ padding: '10px 16px', borderRadius: 10, background: '#0f172a', color: '#fff', border: 'none', cursor: 'pointer' }}>Save Booking</button>
          <button type="button" onClick={() => navigate('/bookings')} style={{ padding: '10px 16px', borderRadius: 10, background: '#fff', border: '1px solid #dfe7f1', cursor: 'pointer' }}>Cancel</button>
        </div>
      </form>
    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 10,
  border: '1px solid #dfe7f1',
  marginTop: 6,
  boxSizing: 'border-box',
}

export default BookingFormPage
