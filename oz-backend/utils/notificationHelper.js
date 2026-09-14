import Notification from '../models/Notification.js'
import Admin from '../models/Admin.js'

/**
 * Create notification for specific admin(s)
 *
 * @param {Object} options
 * @param {string|ObjectId|Array} options.userId - Admin ID or array of admin IDs (or 'super-admin' to notify all super admins)
 * @param {string} options.type - Notification type (QUOTE, CUSTOMER, ADMIN, SYSTEM)
 * @param {string} options.title - Notification title
 * @param {string} options.message - Notification message
 * @param {string|ObjectId} [options.entityId] - ID of related entity
 * @param {string} [options.entityType] - Type of entity (Quote, Customer, Admin)
 */
export const createNotification = async (options) => {
  try {
    const {
      userId,
      type,
      title,
      message,
      entityId = null,
      entityType = null,
    } = options

    // Determine user IDs to notify
    let userIds = []

    if (Array.isArray(userId)) {
      userIds = userId
    } else if (userId === 'super-admin') {
      // Notify all active super admins
      const superAdmins = await Admin.find({
        role: 'Super Admin',
        status: 'active',
      }).select('_id')
      userIds = superAdmins.map((admin) => admin._id)
    } else {
      userIds = [userId]
    }

    // Create notification for each user
    const notifications = userIds.map((uid) => ({
      userId: uid,
      type,
      title,
      message,
      entityId,
      entityType,
      isRead: false,
    }))

    if (notifications.length > 0) {
      await Notification.insertMany(notifications)
    }
  } catch (error) {
    // Never throw error that breaks the main API request
    console.error('createNotification error:', error.message)
  }
}

/**
 * Create notification for all active admins
 */
export const notifyAllAdmins = async (options) => {
  try {
    const { type, title, message, entityId = null, entityType = null } = options

    const activeAdmins = await Admin.find({ status: 'active' }).select('_id')

    if (activeAdmins.length === 0) return

    const notifications = activeAdmins.map((admin) => ({
      userId: admin._id,
      type,
      title,
      message,
      entityId,
      entityType,
      isRead: false,
    }))

    await Notification.insertMany(notifications)
  } catch (error) {
    console.error('notifyAllAdmins error:', error.message)
  }
}
