import SeoSettings from '../models/SeoSettings.js'
import { sendSuccess, sendError } from '../utils/response.js'
import { logActivity } from '../utils/activityLogger.js'

export const getPublicSeoSettings = async (req, res) => {
  try {
    let settings = await SeoSettings.findOne({ isActive: true }).select('-__v -createdAt -updatedAt -_id')
    if (!settings) {
      settings = {}
    }
    return sendSuccess(res, 'SEO settings retrieved successfully', settings)
  } catch (error) {
    return sendError(res, 'Failed to fetch SEO settings', 500)
  }
}

export const getSeoSettings = async (req, res) => {
  try {
    let settings = await SeoSettings.findOne({ isActive: true })
    if (!settings) {
      settings = await SeoSettings.create({})
    }
    return sendSuccess(res, 'SEO settings retrieved successfully', settings)
  } catch (error) {
    return sendError(res, 'Failed to fetch SEO settings', 500)
  }
}

export const updateSeoSettings = async (req, res) => {
  try {
    const settings = await SeoSettings.findOneAndUpdate(
      { isActive: true },
      req.body,
      { new: true, upsert: true, runValidators: true }
    )
    
    logActivity({
      req,
      action: 'UPDATE',
      module: 'CMS_SEO',
      entityId: settings._id,
      entityType: 'SeoSettings',
      description: 'Updated global SEO settings',
    })

    return sendSuccess(res, 'SEO settings updated successfully', settings)
  } catch (error) {
    return sendError(res, error.message || 'Failed to update SEO settings', 400)
  }
}
