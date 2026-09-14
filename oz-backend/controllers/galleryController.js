import Gallery from '../models/Gallery.js'
import mongoose from 'mongoose'
import { sendSuccess, sendError } from '../utils/response.js'
import { logActivity } from '../utils/activityLogger.js'

export const getPublicGallery = async (req, res) => {
  try {
    const images = await Gallery.find({ status: 'active', isDeleted: false }).sort({ display_order: 1, createdAt: -1 })
    return sendSuccess(res, 'Gallery images retrieved successfully', images)
  } catch (error) {
    return sendError(res, 'Failed to fetch gallery images', 500)
  }
}

export const getGallery = async (req, res) => {
  try {
    const images = await Gallery.find({ isDeleted: false }).sort({ display_order: 1, createdAt: -1 })
    return sendSuccess(res, 'Gallery images retrieved successfully', images)
  } catch (error) {
    return sendError(res, 'Failed to fetch gallery images', 500)
  }
}

export const getGalleryById = async (req, res) => {
  try {
    const image = await Gallery.findOne({ _id: req.params.id, isDeleted: false })
    if (!image) return sendError(res, 'Gallery image not found', 404)
    return sendSuccess(res, 'Gallery image retrieved successfully', image)
  } catch (error) {
    return sendError(res, 'Failed to fetch gallery image', 500)
  }
}

export const createGalleryImage = async (req, res) => {
  try {
    const image = new Gallery(req.body)
    await image.save()
    logActivity({ req, action: 'CREATE', module: 'CMS_GALLERY', entityId: image._id, entityType: 'Gallery', description: `Added image to gallery: ${image.title || 'Untitled'}` })
    return sendSuccess(res, 'Gallery image created successfully', image, 201)
  } catch (error) {
    return sendError(res, error.message || 'Failed to create gallery image', 400)
  }
}

export const updateGalleryImage = async (req, res) => {
  try {
    const image = await Gallery.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, req.body, { new: true, runValidators: true })
    if (!image) return sendError(res, 'Gallery image not found', 404)
    logActivity({ req, action: 'UPDATE', module: 'CMS_GALLERY', entityId: image._id, entityType: 'Gallery', description: `Updated gallery image: ${image.title || 'Untitled'}` })
    return sendSuccess(res, 'Gallery image updated successfully', image)
  } catch (error) {
    return sendError(res, error.message || 'Failed to update gallery image', 400)
  }
}

export const deleteGalleryImage = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return sendError(res, 'Invalid gallery ID.', 400)
    }

    const image = await Gallery.findOneAndDelete({ _id: req.params.id })
    if (!image) return sendError(res, 'Gallery image not found', 404)
    logActivity({ req, action: 'DELETE', module: 'CMS_GALLERY', entityId: image._id, entityType: 'Gallery', description: `Deleted gallery image` })
    return sendSuccess(res, 'Gallery image deleted successfully')
  } catch (error) {
    console.error('GALLERY DELETE ERROR:', error)
    return sendError(res, 'Failed to delete gallery image', 500)
  }
}
