import ActivityLog from '../models/ActivityLog.js'

/**
 * Log activity asynchronously without breaking the main API request
 *
 * @param {Object} options
 * @param {Object} options.req - Express request object
 * @param {Object} options.user - Current user from req.user or manual override
 * @param {string} options.action - Action type (LOGIN, CREATE, UPDATE, DELETE, etc.)
 * @param {string} options.module - Module name (AUTH, QUOTES, CUSTOMERS, ADMINS, etc.)
 * @param {string} options.description - Human-readable description
 * @param {string|ObjectId} [options.entityId] - ID of the affected entity
 * @param {string} [options.entityType] - Type of entity (Quote, Customer, Admin, etc.)
 * @param {Object} [options.metadata] - Additional metadata
 */
export const logActivity = async (options) => {
  try {
    const {
      req,
      user,
      action,
      module,
      description,
      entityId = null,
      entityType = null,
      metadata = {},
    } = options

    // Get user info from req.user or manual override
    const adminUser = user || req?.user

    if (!adminUser) {
      console.warn('logActivity: User information not available')
      return
    }

    // Extract IP address
    const ipAddress =
      req?.headers?.['x-forwarded-for']?.split(',')[0].trim() ||
      req?.connection?.remoteAddress ||
      req?.socket?.remoteAddress ||
      null

    // Extract user agent
    const userAgent = req?.headers?.['user-agent'] || null

    // Create activity log entry
    const activityLog = new ActivityLog({
      userId: adminUser.id || adminUser._id,
      userName: adminUser.name || 'Unknown',
      userEmail: adminUser.email || 'unknown@example.com',
      action,
      module,
      entityId,
      entityType,
      description,
      metadata,
      ipAddress,
      userAgent,
    })

    // Save asynchronously without awaiting to not block the response
    activityLog
      .save()
      .catch((err) => {
        console.error('Failed to save activity log:', err.message)
      })
  } catch (error) {
    // Never throw error that breaks the main API request
    console.error('logActivity error:', error.message)
  }
}
