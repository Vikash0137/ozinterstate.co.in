import ActivityLog from '../models/ActivityLog.js'
import { sendSuccess, sendError } from '../utils/response.js'

const parseIntOr = (v, d) => {
  const n = parseInt(v, 10)
  return Number.isNaN(n) ? d : n
}

/**
 * GET /api/activity-logs
 * List activity logs with search, filters, pagination
 */
export const listActivityLogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = '',
      action = '',
      module = '',
      userId = '',
      from = '',
      to = '',
      sort = 'desc',
    } = req.query

    const query = {}

    // Search by userName, userEmail, or description
    if (search) {
      const s = search.trim()
      query.$or = [
        { userName: new RegExp(s, 'i') },
        { userEmail: new RegExp(s, 'i') },
        { description: new RegExp(s, 'i') },
      ]
    }

    // Filter by action
    if (action) {
      query.action = action
    }

    // Filter by module
    if (module) {
      query.module = module
    }

    // Filter by userId
    if (userId) {
      query.userId = userId
    }

    // Filter by date range
    if (from || to) {
      query.createdAt = {}
      if (from) query.createdAt.$gte = new Date(from)
      if (to) query.createdAt.$lte = new Date(to)
    }

    const pageNum = parseIntOr(page, 1)
    const lim = parseIntOr(limit, 20)
    const skip = (pageNum - 1) * lim
    const sortOrder = sort === 'asc' ? 1 : -1

    const total = await ActivityLog.countDocuments(query)
    const logs = await ActivityLog.find(query)
      .lean()
      .sort({ createdAt: sortOrder })
      .skip(skip)
      .limit(lim)

    return sendSuccess(res, 'Activity logs retrieved', {
      logs,
      pagination: {
        page: pageNum,
        limit: lim,
        total,
        pages: Math.ceil(total / lim),
      },
    })
  } catch (err) {
    console.error('Error listing activity logs:', err)
    return sendError(res, 'Failed to retrieve activity logs.', 500)
  }
}

/**
 * GET /api/activity-logs/:id
 * Get single activity log
 */
export const getActivityLog = async (req, res) => {
  try {
    const { id } = req.params

    const log = await ActivityLog.findById(id).lean()
    if (!log) {
      return sendError(res, 'Activity log not found.', 404)
    }

    return sendSuccess(res, 'Activity log retrieved', { log })
  } catch (err) {
    console.error('Error getting activity log:', err)
    return sendError(res, 'Failed to retrieve activity log.', 500)
  }
}
