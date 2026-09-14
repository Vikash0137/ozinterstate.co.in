import express from 'express'
import Booking from '../models/Booking.js'
import {
  getDashboardStats,
  getRecentQuotes,
  getRecentCustomers,
  getMonthlyAnalytics,
  getCustomerGrowth,
  getTopCustomers,
  getQuoteValueAnalytics,
  getRecentActivity,
} from '../controllers/dashboardController.js'
import { verifyAdmin } from '../middleware/auth.js'

const router = express.Router()

router.get('/stats', verifyAdmin, getDashboardStats)
router.get('/recent-quotes', verifyAdmin, getRecentQuotes)
router.get('/recent-customers', verifyAdmin, getRecentCustomers)
router.get('/monthly', verifyAdmin, getMonthlyAnalytics)
router.get('/customer-growth', verifyAdmin, getCustomerGrowth)
router.get('/top-customers', verifyAdmin, getTopCustomers)
router.get('/quote-value', verifyAdmin, getQuoteValueAnalytics)
router.get('/recent-bookings', verifyAdmin, async (req, res) => {
  try {
    const limit = Number.parseInt(req.query.limit || '10', 10) || 10
    const bookings = await Booking.find({ isDeleted: { $ne: true } }).populate('customerId', 'name').sort({ createdAt: -1 }).limit(limit).lean()
    return res.json({ success: true, data: { bookings, limit } })
  } catch (error) {
    console.error('Error fetching recent bookings:', error)
    return res.status(500).json({ success: false, message: 'Server error fetching recent bookings.' })
  }
})
router.get('/booking-analytics', verifyAdmin, async (req, res) => {
  try {
    const result = await Booking.aggregate([
      { $match: { isDeleted: { $ne: true } } },
      {
        $group: {
          _id: null,
          total_bookings: { $sum: 1 },
          completed_bookings: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
          cancelled_bookings: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } },
          total_value: { $sum: { $ifNull: ['$totalAmount', 0] } },
          completed_value: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, { $ifNull: ['$totalAmount', 0] }, 0] } },
        },
      },
    ])
    const analytics = (result && result[0]) || { total_bookings: 0, completed_bookings: 0, cancelled_bookings: 0, total_value: 0, completed_value: 0, average_booking_value: 0 }
    const average_booking_value = analytics.total_bookings > 0 ? analytics.total_value / analytics.total_bookings : 0
    return res.json({ success: true, data: { ...analytics, average_booking_value } })
  } catch (error) {
    console.error('Error fetching booking analytics:', error)
    return res.status(500).json({ success: false, message: 'Server error fetching booking analytics.' })
  }
})
router.get('/recent-activity', verifyAdmin, getRecentActivity)

export default router
