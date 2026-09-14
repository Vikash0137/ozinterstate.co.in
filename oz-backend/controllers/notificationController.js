import Notification from '../models/Notification.js'
import { sendSuccess, sendError } from '../utils/response.js'

const parseIntOr = (v, d) => {
  const n = parseInt(v, 10)
  return Number.isNaN(n) ? d : n
}

/**
 * GET /api/notifications
 * List notifications for current admin
 */
export const listNotifications = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      unread = '',
      sort = 'desc',
    } = req.query

    const userId = req.user?.id
    if (!userId) {
      return sendError(res, 'User not found.', 401)
    }

    const query = { userId }

    // Filter by unread status
    if (unread === 'true') {
      query.isRead = false
    } else if (unread === 'false') {
      query.isRead = true
    }

    const pageNum = parseIntOr(page, 1)
    const lim = parseIntOr(limit, 20)
    const skip = (pageNum - 1) * lim
    const sortOrder = sort === 'asc' ? 1 : -1

    const total = await Notification.countDocuments(query)
    const notifications = await Notification.find(query)
      .lean()
      .sort({ createdAt: sortOrder })
      .skip(skip)
      .limit(lim)

    return sendSuccess(res, 'Notifications retrieved', {
      notifications,
      pagination: {
        page: pageNum,
        limit: lim,
        total,
        pages: Math.ceil(total / lim),
      },
    })
  } catch (err) {
    console.error('Error listing notifications:', err)
    return sendError(res, 'Failed to retrieve notifications.', 500)
  }
}

/**
 * GET /api/notifications/unread-count
 * Get unread notification count for current admin
 */
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user?.id
    if (!userId) {
      return sendError(res, 'User not found.', 401)
    }

    const unread = await Notification.countDocuments({
      userId,
      isRead: false,
    })

    return sendSuccess(res, 'Unread count retrieved', { unread })
  } catch (err) {
    console.error('Error getting unread count:', err)
    return sendError(res, 'Failed to get unread count.', 500)
  }
}

/**
 * PATCH /api/notifications/:id/read
 * Mark notification as read
 */
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user?.id

    const notification = await Notification.findById(id)
    if (!notification) {
      return sendError(res, 'Notification not found.', 404)
    }

    // Check ownership
    if (notification.userId.toString() !== userId) {
      return sendError(res, 'Unauthorized.', 403)
    }

    notification.isRead = true
    await notification.save()

    return sendSuccess(res, 'Notification marked as read', {
      notification: notification.toJSON(),
    })
  } catch (err) {
    console.error('Error marking notification as read:', err)
    return sendError(res, 'Failed to mark notification as read.', 500)
  }
}

/**
 * PATCH /api/notifications/read-all
 * Mark all notifications as read for current admin
 */
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user?.id
    if (!userId) {
      return sendError(res, 'User not found.', 401)
    }

    const result = await Notification.updateMany(
      { userId, isRead: false },
      { isRead: true }
    )

    return sendSuccess(res, 'All notifications marked as read', {
      updated: result.modifiedCount,
    })
  } catch (err) {
    console.error('Error marking all notifications as read:', err)
    return sendError(res, 'Failed to mark notifications as read.', 500)
  }
}
