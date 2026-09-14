import db from '../db.js'
import { sendSuccess, sendError } from '../utils/response.js'
import Quote from '../models/Quote.js'
import Customer from '../models/Customer.js'
import Admin from '../models/Admin.js'
import Booking from '../models/Booking.js'
import ActivityLog from '../models/ActivityLog.js'

export const getDashboardStats = async (req, res) => {
  try {
    const banners = db.getAllBanners({ limit: 1000 })
    const inquiries = db.getAllInquiryResponses({ limit: 1000 })

    // Try to get quote stats from MongoDB
    let quoteStats = {
      total_quotes: 0,
      pending_quotes: 0,
      approved_quotes: 0,
      completed_quotes: 0,
      cancelled_quotes: 0,
      new_quotes: 0,
      contacted_quotes: 0,
      quoted_quotes: 0,
      followup_quotes: 0,
      converted_quotes: 0,
      rejected_quotes: 0,
      archived_quotes: 0,
    }

    try {
      const total = await Quote.countDocuments({}).catch(() => 0)
      const newCount = await Quote.countDocuments({ status: 'NEW' }).catch(() => 0)
      const contacted = await Quote.countDocuments({ status: 'CONTACTED' }).catch(() => 0)
      const quoted = await Quote.countDocuments({ status: 'QUOTED' }).catch(() => 0)
      const followup = await Quote.countDocuments({ status: 'FOLLOW_UP' }).catch(() => 0)
      const converted = await Quote.countDocuments({ status: 'CONVERTED' }).catch(() => 0)
      const rejected = await Quote.countDocuments({ status: 'REJECTED' }).catch(() => 0)
      const archived = await Quote.countDocuments({ status: 'ARCHIVED' }).catch(() => 0)

      quoteStats = {
        total_quotes: total || 0,
        new_quotes: newCount || 0,
        contacted_quotes: contacted || 0,
        quoted_quotes: quoted || 0,
        followup_quotes: followup || 0,
        converted_quotes: converted || 0,
        rejected_quotes: rejected || 0,
        archived_quotes: archived || 0,
        // Alias for STEP 6 compatibility
        pending_quotes: newCount || 0,
        approved_quotes: quoted || 0,
        completed_quotes: converted || 0,
        cancelled_quotes: rejected || 0,
      }
    } catch (err) {
      console.warn('Quote stats not available:', err.message || err)
    }

    const bookingStats = await Booking.aggregate([
      { $match: { isDeleted: { $ne: true } } },
      {
        $group: {
          _id: null,
          total_bookings: { $sum: 1 },
          pending_bookings: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          confirmed_bookings: { $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] } },
          in_transit_bookings: { $sum: { $cond: [{ $eq: ['$status', 'in_transit'] }, 1, 0] } },
          delivered_bookings: { $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] } },
          completed_bookings: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
          cancelled_bookings: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } },
          total_value: { $sum: { $ifNull: ['$totalAmount', 0] } },
        },
      },
    ]).catch(() => [])

    const bookingAggregate = (bookingStats || [])[0] || {
      total_bookings: 0,
      pending_bookings: 0,
      confirmed_bookings: 0,
      in_transit_bookings: 0,
      delivered_bookings: 0,
      completed_bookings: 0,
      cancelled_bookings: 0,
      total_value: 0,
    }

    const stats = {
      total_banners: banners.total || 0,
      active_banners: (banners.banners || []).filter((b) => b.status === 'active').length,
      total_inquiries: inquiries.total || 0,
      new_inquiries: (inquiries.responses || []).filter((r) => r.status === 'new').length,
      contacted_inquiries: (inquiries.responses || []).filter((r) => r.status === 'contacted').length,
      completed_jobs: 148,
      upcoming_jobs: 32,
      total_revenue: '$184,500',
      ...quoteStats,
      total_customers: 0,
      active_customers: 0,
      inactive_customers: 0,
      total_admins: 0,
      active_admins: 0,
      inactive_admins: 0,
      total_bookings: bookingAggregate.total_bookings || 0,
      pending_bookings: bookingAggregate.pending_bookings || 0,
      confirmed_bookings: bookingAggregate.confirmed_bookings || 0,
      in_transit_bookings: bookingAggregate.in_transit_bookings || 0,
      delivered_bookings: bookingAggregate.delivered_bookings || 0,
      completed_bookings: bookingAggregate.completed_bookings || 0,
      cancelled_bookings: bookingAggregate.cancelled_bookings || 0,
    }

    try {
      const totalCustomers = await Customer.countDocuments({}).catch(() => 0)
      const activeCustomers = await Customer.countDocuments({ status: 'active' }).catch(() => 0)
      const inactiveCustomers = await Customer.countDocuments({ status: 'inactive' }).catch(() => 0)
      stats.total_customers = totalCustomers || 0
      stats.active_customers = activeCustomers || 0
      stats.inactive_customers = inactiveCustomers || 0
    } catch (err) {
      console.warn('Customer stats not available:', err.message || err)
    }

    try {
      const totalAdmins = await Admin.countDocuments({}).catch(() => 0)
      const activeAdmins = await Admin.countDocuments({ status: 'active' }).catch(() => 0)
      const inactiveAdmins = await Admin.countDocuments({ status: 'inactive' }).catch(() => 0)
      stats.total_admins = totalAdmins || 0
      stats.active_admins = activeAdmins || 0
      stats.inactive_admins = inactiveAdmins || 0
    } catch (err) {
      console.warn('Admin stats not available:', err.message || err)
    }

    return sendSuccess(res, 'Dashboard metrics retrieved successfully.', stats)
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return sendError(res, 'Server error fetching dashboard stats.', 500)
  }
}

export const getRecentQuotes = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10
    const quotes = await Quote.find({})
      .populate('customerId', 'name email phone companyName')
      .select('quoteNumber customerName status totalAmount serviceType createdAt customerId')
      .sort({ createdAt: -1 })
      .limit(limit)
      .catch(() => [])

    return sendSuccess(res, 'Recent quotes retrieved successfully.', {
      quotes: quotes || [],
      limit,
    })
  } catch (error) {
    console.error('Error fetching recent quotes:', error)
    return sendError(res, 'Server error fetching recent quotes.', 500)
  }
}

export const getRecentCustomers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10
    const customers = await Customer.find({})
      .select('name email phone companyName status createdAt')
      .sort({ createdAt: -1 })
      .limit(limit)
      .catch(() => [])

    return sendSuccess(res, 'Recent customers retrieved successfully.', {
      customers: customers || [],
      limit,
    })
  } catch (error) {
    console.error('Error fetching recent customers:', error)
    return sendError(res, 'Server error fetching recent customers.', 500)
  }
}

export const getMonthlyAnalytics = async (req, res) => {
  try {
    const months = parseInt(req.query.months) || 12
    const endDate = new Date()
    const startDate = new Date(endDate.getFullYear(), endDate.getMonth() - months + 1, 1)

    const result = await Quote.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          total: { $sum: 1 },
          approved: {
            $sum: {
              $cond: [{ $eq: ['$status', 'QUOTED'] }, 1, 0],
            },
          },
          completed: {
            $sum: {
              $cond: [{ $eq: ['$status', 'CONVERTED'] }, 1, 0],
            },
          },
          value: { $sum: { $ifNull: ['$totalAmount', 0] } },
        },
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
        },
      },
    ]).catch(() => [])

    const months_data = (result || []).map((item) => ({
      month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
      quotes: item.total,
      approved: item.approved,
      completed: item.completed,
      value: item.value,
    }))

    return sendSuccess(res, 'Monthly analytics retrieved successfully.', {
      months: months_data,
    })
  } catch (error) {
    console.error('Error fetching monthly analytics:', error)
    return sendError(res, 'Server error fetching monthly analytics.', 500)
  }
}

export const getCustomerGrowth = async (req, res) => {
  try {
    const months = parseInt(req.query.months) || 12
    const endDate = new Date()
    const startDate = new Date(endDate.getFullYear(), endDate.getMonth() - months + 1, 1)

    const result = await Customer.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          customers: { $sum: 1 },
        },
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
        },
      },
    ]).catch(() => [])

    const months_data = (result || []).map((item) => ({
      month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
      customers: item.customers,
    }))

    return sendSuccess(res, 'Customer growth retrieved successfully.', {
      months: months_data,
    })
  } catch (error) {
    console.error('Error fetching customer growth:', error)
    return sendError(res, 'Server error fetching customer growth.', 500)
  }
}

export const getTopCustomers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10

    const result = await Quote.aggregate([
      {
        $match: {
          customerId: { $ne: null },
        },
      },
      {
        $group: {
          _id: '$customerId',
          quoteCount: { $sum: 1 },
          totalValue: { $sum: { $ifNull: ['$totalAmount', 0] } },
          customerName: { $first: '$customerName' },
        },
      },
      {
        $lookup: {
          from: 'customers',
          localField: '_id',
          foreignField: '_id',
          as: 'customerInfo',
        },
      },
      {
        $unwind: {
          path: '$customerInfo',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          customerId: '$_id',
          name: { $ifNull: ['$customerInfo.name', '$customerName'] },
          companyName: { $ifNull: ['$customerInfo.companyName', ''] },
          quoteCount: 1,
          totalValue: 1,
        },
      },
      {
        $sort: { quoteCount: -1 },
      },
      {
        $limit: limit,
      },
    ]).catch(() => [])

    return sendSuccess(res, 'Top customers retrieved successfully.', {
      customers: result || [],
      limit,
    })
  } catch (error) {
    console.error('Error fetching top customers:', error)
    return sendError(res, 'Server error fetching top customers.', 500)
  }
}

export const getQuoteValueAnalytics = async (req, res) => {
  try {
    const result = await Quote.aggregate([
      {
        $group: {
          _id: null,
          totalValue: { $sum: { $ifNull: ['$totalAmount', 0] } },
          approvedValue: {
            $sum: {
              $cond: [
                { $eq: ['$status', 'QUOTED'] },
                { $ifNull: ['$totalAmount', 0] },
                0,
              ],
            },
          },
          completedValue: {
            $sum: {
              $cond: [
                { $eq: ['$status', 'CONVERTED'] },
                { $ifNull: ['$totalAmount', 0] },
                0,
              ],
            },
          },
        },
      },
    ]).catch(() => [])

    const data = result && result.length > 0 ? result[0] : { totalValue: 0, approvedValue: 0, completedValue: 0 }

    return sendSuccess(res, 'Quote value analytics retrieved successfully.', {
      total_value: data.totalValue || 0,
      approved_value: data.approvedValue || 0,
      completed_value: data.completedValue || 0,
    })
  } catch (error) {
    console.error('Error fetching quote value analytics:', error)
    return sendError(res, 'Server error fetching quote value analytics.', 500)
  }
}

/**
 * GET /api/dashboard/recent-activity
 * Get recent activity logs (latest 5)
 */
export const getRecentActivity = async (req, res) => {
  try {
    const recentActivity = await ActivityLog.find()
      .lean()
      .sort({ createdAt: -1 })
      .limit(5)

    return sendSuccess(res, 'Recent activity retrieved successfully.', {
      activity: recentActivity || [],
    })
  } catch (error) {
    console.error('Error fetching recent activity:', error)
    return sendError(res, 'Server error fetching recent activity.', 500)
  }
}
