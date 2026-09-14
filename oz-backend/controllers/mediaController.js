import fs from 'fs'
import path from 'path'
import MediaLibrary from '../models/MediaLibrary.js'
import { sendSuccess, sendError } from '../utils/response.js'
import { logActivity } from '../utils/activityLogger.js'

export const uploadMediaFile = async (req, res) => {
  try {
    if (!req.file) {
      return sendError(res, 'No file was uploaded.', 400)
    }

    const file = req.file
    const ext = path.extname(file.originalname).toLowerCase()
    let folder = 'images'
    if (['.mp4', '.webm', '.ogg'].includes(ext)) folder = 'videos'
    else if (['.pdf', '.doc', '.docx'].includes(ext)) folder = 'documents'

    // Get metadata from body if provided
    const { title, alt_text, caption, description, folder: customFolder } = req.body

    const media = new MediaLibrary({
      file_name: file.originalname,
      file_path: `/uploads/${folder}/${file.filename}`,
      file_type: folder,
      file_size: file.size,
      mime_type: file.mimetype,
      title: title || file.originalname,
      alt_text: alt_text || '',
      caption: caption || '',
      description: description || '',
      folder: customFolder || folder,
      createdBy: req.user ? req.user.id : null,
    })

    await media.save()

    logActivity({
      req,
      action: 'CREATE',
      module: 'CMS_MEDIA',
      entityId: media._id,
      entityType: 'MediaLibrary',
      description: `Uploaded file: ${media.file_name}`,
    })

    return sendSuccess(res, 'Media file uploaded successfully.', media, 201)
  } catch (error) {
    console.error('Error uploading media:', error)
    return sendError(res, 'Failed to upload media file.', 500)
  }
}

export const getMediaLibrary = async (req, res) => {
  try {
    const { folder, type, search } = req.query
    const query = { isDeleted: false }
    
    if (folder) query.folder = folder
    if (type) query.file_type = type
    if (search) {
      query.$or = [
        { file_name: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } }
      ]
    }

    const media = await MediaLibrary.find(query).sort({ createdAt: -1 })
    return sendSuccess(res, 'Media library retrieved.', media)
  } catch (error) {
    return sendError(res, 'Failed to fetch media library.', 500)
  }
}

export const getMediaById = async (req, res) => {
  try {
    const media = await MediaLibrary.findOne({ _id: req.params.id, isDeleted: false })
    if (!media) return sendError(res, 'Media not found.', 404)
    return sendSuccess(res, 'Media retrieved successfully.', media)
  } catch (error) {
    return sendError(res, 'Failed to fetch media.', 500)
  }
}

export const updateMediaMetadata = async (req, res) => {
  try {
    const { title, alt_text, caption, description, folder } = req.body
    
    const updateData = {}
    if (title !== undefined) updateData.title = title
    if (alt_text !== undefined) updateData.alt_text = alt_text
    if (caption !== undefined) updateData.caption = caption
    if (description !== undefined) updateData.description = description
    if (folder !== undefined) updateData.folder = folder

    const media = await MediaLibrary.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      updateData,
      { new: true, runValidators: true }
    )

    if (!media) return sendError(res, 'Media not found.', 404)

    logActivity({
      req,
      action: 'UPDATE',
      module: 'CMS_MEDIA',
      entityId: media._id,
      entityType: 'MediaLibrary',
      description: `Updated metadata for: ${media.file_name}`,
    })

    return sendSuccess(res, 'Media metadata updated successfully.', media)
  } catch (error) {
    return sendError(res, 'Failed to update media metadata.', 400)
  }
}

export const deleteMediaFile = async (req, res) => {
  try {
    const media = await MediaLibrary.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true, deletedAt: new Date(), status: 'inactive' },
      { new: true }
    )

    if (!media) return sendError(res, 'Media not found.', 404)

    logActivity({
      req,
      action: 'DELETE',
      module: 'CMS_MEDIA',
      entityId: media._id,
      entityType: 'MediaLibrary',
      description: `Deleted file: ${media.file_name}`,
    })

    return sendSuccess(res, 'Media file soft deleted successfully.')
  } catch (error) {
    return sendError(res, 'Failed to delete media file.', 500)
  }
}
