import TrustBadge from '../models/TrustBadge.js'
import { sendSuccess, sendError } from '../utils/response.js'
import { logActivity } from '../utils/activityLogger.js'

export const getPublicTrustBadges = async (req, res) => {
  try {
    const badges = await TrustBadge.find({ status: 'active', isDeleted: false }).sort({ sortOrder: 1 })
    return sendSuccess(res, 'Trust badges retrieved successfully', badges)
  } catch (error) {
    return sendError(res, 'Failed to fetch trust badges', 500)
  }
}

export const getTrustBadges = async (req, res) => {
  try {
    const badges = await TrustBadge.find({ isDeleted: false }).sort({ sortOrder: 1 })
    return sendSuccess(res, 'Trust badges retrieved successfully', badges)
  } catch (error) {
    return sendError(res, 'Failed to fetch trust badges', 500)
  }
}

export const createTrustBadge = async (req, res) => {
  try {
    const badge = new TrustBadge(req.body)
    await badge.save()
    logActivity({ req, action: 'CREATE', module: 'CMS_TRUST_BADGES', entityId: badge._id, entityType: 'TrustBadge', description: `Created trust badge: ${badge.title}` })
    return sendSuccess(res, 'Trust badge created successfully', badge, 201)
  } catch (error) {
    return sendError(res, error.message || 'Failed to create trust badge', 400)
  }
}

export const updateTrustBadge = async (req, res) => {
  try {
    const badge = await TrustBadge.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, req.body, { new: true, runValidators: true })
    if (!badge) return sendError(res, 'Trust badge not found', 404)
    logActivity({ req, action: 'UPDATE', module: 'CMS_TRUST_BADGES', entityId: badge._id, entityType: 'TrustBadge', description: `Updated trust badge: ${badge.title}` })
    return sendSuccess(res, 'Trust badge updated successfully', badge)
  } catch (error) {
    return sendError(res, error.message || 'Failed to update trust badge', 400)
  }
}

export const deleteTrustBadge = async (req, res) => {
  try {
    const badge = await TrustBadge.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, { isDeleted: true, deletedAt: new Date(), status: 'inactive' }, { new: true })
    if (!badge) return sendError(res, 'Trust badge not found', 404)
    logActivity({ req, action: 'DELETE', module: 'CMS_TRUST_BADGES', entityId: badge._id, entityType: 'TrustBadge', description: `Deleted trust badge: ${badge.title}` })
    return sendSuccess(res, 'Trust badge deleted successfully')
  } catch (error) {
    return sendError(res, 'Failed to delete trust badge', 500)
  }
}
