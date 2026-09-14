import Stat from '../models/Stat.js'
import { sendSuccess, sendError } from '../utils/response.js'
import { logActivity } from '../utils/activityLogger.js'

// Get all public active stats
export const getPublicStats = async (req, res) => {
  try {
    const stats = await Stat.find({ status: 'active', isDeleted: false }).sort({ sortOrder: 1 })
    return sendSuccess(res, 'Stats retrieved successfully', stats)
  } catch (error) {
    return sendError(res, 'Failed to fetch stats', 500)
  }
}

// Get all stats (Admin)
export const getStats = async (req, res) => {
  try {
    const stats = await Stat.find({ isDeleted: false }).sort({ sortOrder: 1 })
    return sendSuccess(res, 'Stats retrieved successfully', stats)
  } catch (error) {
    return sendError(res, 'Failed to fetch stats', 500)
  }
}

// Create new stat
export const createStat = async (req, res) => {
  try {
    const stat = new Stat(req.body)
    await stat.save()
    
    logActivity({
      req,
      action: 'CREATE',
      module: 'CMS_STATS',
      entityId: stat._id,
      entityType: 'Stat',
      description: `Created stat: ${stat.label}`,
    })
    
    return sendSuccess(res, 'Stat created successfully', stat, 201)
  } catch (error) {
    return sendError(res, error.message || 'Failed to create stat', 400)
  }
}

// Update stat
export const updateStat = async (req, res) => {
  try {
    const stat = await Stat.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      req.body,
      { new: true, runValidators: true }
    )
    if (!stat) return sendError(res, 'Stat not found', 404)

    logActivity({
      req,
      action: 'UPDATE',
      module: 'CMS_STATS',
      entityId: stat._id,
      entityType: 'Stat',
      description: `Updated stat: ${stat.label}`,
    })

    return sendSuccess(res, 'Stat updated successfully', stat)
  } catch (error) {
    return sendError(res, error.message || 'Failed to update stat', 400)
  }
}

// Delete (Soft) stat
export const deleteStat = async (req, res) => {
  try {
    const stat = await Stat.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true, deletedAt: new Date(), status: 'inactive' },
      { new: true }
    )
    if (!stat) return sendError(res, 'Stat not found', 404)

    logActivity({
      req,
      action: 'DELETE',
      module: 'CMS_STATS',
      entityId: stat._id,
      entityType: 'Stat',
      description: `Deleted stat: ${stat.label}`,
    })

    return sendSuccess(res, 'Stat deleted successfully')
  } catch (error) {
    return sendError(res, 'Failed to delete stat', 500)
  }
}
