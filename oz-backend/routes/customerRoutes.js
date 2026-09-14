import express from 'express'
import {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  updateCustomerStatus,
  deleteCustomer,
  searchCustomers,
} from '../controllers/customerController.js'
import { verifyAdmin } from '../middleware/auth.js'

const router = express.Router()

router.use(verifyAdmin)

router.get('/', getCustomers)
router.get('/search', searchCustomers)
router.get('/:id', getCustomerById)
router.get('/:id/bookings', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const { default: Booking } = await import('../models/Booking.js')
    const page = parseInt(req.query.page || '1', 10)
    const limit = parseInt(req.query.limit || '10', 10)
    const skip = (page - 1) * limit

    if (!id) return res.status(400).json({ success: false, message: 'Customer id is required' })

    const filter = { customerId: id, isDeleted: { $ne: true } }
    if (req.query.status) filter.status = req.query.status
    if (req.query.search) {
      const s = req.query.search.trim()
      filter.$or = [
        { bookingNumber: new RegExp(s, 'i') },
        { serviceType: new RegExp(s, 'i') },
        { pickupLocation: new RegExp(s, 'i') },
        { deliveryLocation: new RegExp(s, 'i') },
      ]
    }

    const [bookings, total] = await Promise.all([
      Booking.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Booking.countDocuments(filter),
    ])

    return res.json({ success: true, data: { bookings, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 } } })
  } catch (err) {
    console.error('Error fetching customer bookings:', err)
    return res.status(500).json({ success: false, message: 'Failed to fetch customer bookings' })
  }
})
router.get('/:id/quotes', verifyAdmin, async (req, res) => {
  // Lazy require to avoid circular imports at module load
  try {
    const { default: Quote } = await import('../models/Quote.js')
    const { id } = req.params
    const page = parseInt(req.query.page || '1', 10)
    const limit = parseInt(req.query.limit || '10', 10)
    const skip = (page - 1) * limit

    if (!id) return res.status(400).json({ success: false, message: 'Customer id is required' })

    const q = { customerId: id }
    if (req.query.search) {
      const s = req.query.search.trim()
      q.$or = [{ quoteNumber: new RegExp(s, 'i') }, { customerName: new RegExp(s, 'i') }, { customerEmail: new RegExp(s, 'i') }]
    }

    const [quotes, total] = await Promise.all([
      Quote.find(q).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Quote.countDocuments(q),
    ])

    return res.json({ success: true, data: { quotes, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 } } })
  } catch (err) {
    console.error('Error fetching customer quotes:', err)
    return res.status(500).json({ success: false, message: 'Failed to fetch customer quotes' })
  }
})
router.post('/', createCustomer)
router.put('/:id', updateCustomer)
router.patch('/:id/status', updateCustomerStatus)
router.delete('/:id', deleteCustomer)

export default router
