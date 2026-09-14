import WhyChooseItem from '../models/WhyChooseItem.js'
import mongoose from 'mongoose'
import { sendSuccess, sendError } from '../utils/response.js'
import { logActivity } from '../utils/activityLogger.js'

export const getPublicWhyChooseItems = async (req, res) => {
  try {
    const items = await WhyChooseItem.find({ status: 'active', isDeleted: false }).sort({ sortOrder: 1 })
    return sendSuccess(res, 'Why choose items retrieved successfully', items)
  } catch (error) {
    return sendError(res, 'Failed to fetch why choose items', 500)
  }
}

export const getWhyChooseItems = async (req, res) => {
  try {
    const items = await WhyChooseItem.find({ isDeleted: false }).sort({ sortOrder: 1 })
    return sendSuccess(res, 'Why choose items retrieved successfully', items)
  } catch (error) {
    return sendError(res, 'Failed to fetch why choose items', 500)
  }
}

export const createWhyChooseItem = async (req, res) => {
  try {
    const item = new WhyChooseItem(req.body)
    await item.save()
    logActivity({ req, action: 'CREATE', module: 'CMS_WHY_CHOOSE', entityId: item._id, entityType: 'WhyChooseItem', description: `Created why choose item: ${item.title}` })
    return sendSuccess(res, 'Why choose item created successfully', item, 201)
  } catch (error) {
    return sendError(res, error.message || 'Failed to create why choose item', 400)
  }
}

export const updateWhyChooseItem = async (req, res) => {
  try {
    const item = await WhyChooseItem.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, req.body, { new: true, runValidators: true })
    if (!item) return sendError(res, 'Why choose item not found', 404)
    logActivity({ req, action: 'UPDATE', module: 'CMS_WHY_CHOOSE', entityId: item._id, entityType: 'WhyChooseItem', description: `Updated why choose item: ${item.title}` })
    return sendSuccess(res, 'Why choose item updated successfully', item)
  } catch (error) {
    return sendError(res, error.message || 'Failed to update why choose item', 400)
  }
}

export const deleteWhyChooseItem = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return sendError(res, 'Invalid why choose item ID.', 400)
    }

    const item = await WhyChooseItem.findOneAndDelete({ _id: req.params.id })
    if (!item) return sendError(res, 'Why choose item not found', 404)
    logActivity({ req, action: 'DELETE', module: 'CMS_WHY_CHOOSE', entityId: item._id, entityType: 'WhyChooseItem', description: `Deleted why choose item: ${item.title}` })
    return sendSuccess(res, 'Why choose item deleted successfully')
  } catch (error) {
    console.error('WHY CHOOSE DELETE ERROR:', error)
    return sendError(res, 'Failed to delete why choose item', 500)
  }
}
