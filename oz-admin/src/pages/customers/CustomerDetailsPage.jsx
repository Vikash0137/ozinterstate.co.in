import { useEffect, useState } from 'react'
import { ArrowLeft, Edit2, Loader2, Trash2 } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import customerService from '../../services/customerService'
import bookingService from '../../services/bookingService'
import './Customers.css'

const initials = (name = '') => name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'NA'
const items = [['email', 'Email'], ['phone', 'Phone'], ['companyName', 'Company'], ['address', 'Address'], ['city', 'City'], ['state', 'State'], ['postalCode', 'Postcode'], ['country', 'Country'], ['customerType', 'Customer Type'], ['status', 'Status'], ['createdAt', 'Created Date'], ['updatedAt', 'Updated Date'], ['notes', 'Notes']]

export default function CustomerDetailsPage() {
  const { id } = useParams(); const navigate = useNavigate(); const [loading, setLoading] = useState(true); const [customer, setCustomer] = useState(null); const [bookings, setBookings] = useState([])
  const load = async () => { try { const [res, bookingsRes] = await Promise.all([customerService.getCustomer(id), bookingService.getCustomerBookings(id, { page: 1, limit: 5 })]); if (res?.data?.success) setCustomer(res.data.data.customer); if (bookingsRes?.data?.success) setBookings(bookingsRes.data.data.bookings || []) } catch (err) { console.error('Failed to load customer', err); toast.error('Unable to load customer details.') } finally { setLoading(false) } }
  useEffect(() => { const timer = setTimeout(load, 0); return () => clearTimeout(timer) }, [id])
  const remove = async () => { if (!window.confirm('Are you sure you want to delete this customer?')) return; try { await customerService.deleteCustomer(id); toast.success('Customer deleted successfully.'); navigate('/customers') } catch (err) { console.error('Failed to delete customer', err); toast.error('Unable to delete customer.') } }
  if (loading) return <div className="customer-page"><div className="customer-state"><Loader2 className="spinner" size={32} /><p>Loading customer...</p></div></div>
  if (!customer) return <div className="customer-page"><div className="customer-state"><h3>Customer not found</h3><button className="customer-secondary" onClick={() => navigate('/customers')}><ArrowLeft size={16} /> Back to Customers</button></div></div>
  return <div className="customer-page"><div className="customer-detail-header"><div><button className="customer-secondary" onClick={() => navigate('/customers')}><ArrowLeft size={16} /> Back to Customers</button><h1 className="customer-title" style={{ marginTop: 18 }}>Customer Details</h1><p className="customer-subtitle">View customer profile and account information.</p></div><div className="customer-detail-actions"><button className="customer-primary" onClick={() => navigate(`/customers/${id}/edit`)}><Edit2 size={16} /> Edit Customer</button><button className="customer-danger" onClick={remove}><Trash2 size={16} /> Delete Customer</button></div></div><div className="customer-profile-card"><div className="customer-profile-heading"><span className="customer-avatar">{initials(customer.name)}</span><div><h2>{customer.name}</h2><p>{customer.email}</p></div></div><div className="customer-detail-grid">{items.map(([key, label]) => <div className="customer-detail-item" key={key}><label>{label}</label><p>{key === 'status' ? <span className={`customer-status ${customer[key]}`}>{customer[key]}</span> : key.includes('At') ? (customer[key] ? new Date(customer[key]).toLocaleString() : '—') : customer[key] || '—'}</p></div>)}</div>{bookings.length > 0 && <div className="customer-bookings"><h3>Recent Bookings</h3>{bookings.map((booking) => <p key={booking._id}><a href={`/bookings/${booking._id}`}>{booking.bookingNumber || booking._id} · {booking.serviceType || 'Booking'} · {booking.status}</a></p>)}</div>}</div></div>
}
