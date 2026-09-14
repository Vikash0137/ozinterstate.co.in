import SiteSettings from '../models/SiteSettings.js'
import { sendSuccess, sendError } from '../utils/response.js'
import { logActivity } from '../utils/activityLogger.js'

export const getPublicSiteSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne({ isActive: true }).select('-__v -createdAt -updatedAt -_id')
    if (!settings) {
      // Fallback empty object if seed hasn't run
      settings = {}
    }
    return sendSuccess(res, 'Site settings retrieved successfully', settings)
  } catch (error) {
    return sendError(res, 'Failed to fetch site settings', 500)
  }
}

export const getSiteSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne({ isActive: true })
    if (!settings) {
      settings = await SiteSettings.create({})
    }
    return sendSuccess(res, 'Site settings retrieved successfully', settings)
  } catch (error) {
    return sendError(res, 'Failed to fetch site settings', 500)
  }
}

export const updateSiteSettings = async (req, res) => {
  try {
    const settings = await SiteSettings.findOneAndUpdate(
      { isActive: true },
      req.body,
      { new: true, upsert: true, runValidators: true }
    )
    
    logActivity({
      req,
      action: 'UPDATE',
      module: 'CMS_SETTINGS',
      entityId: settings._id,
      entityType: 'SiteSettings',
      description: 'Updated global site settings',
    })

    return sendSuccess(res, 'Site settings updated successfully', settings)
  } catch (error) {
    return sendError(res, error.message || 'Failed to update site settings', 400)
  }
}
