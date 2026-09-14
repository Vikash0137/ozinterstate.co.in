import PageSection from '../models/PageSection.js'
import mongoose from 'mongoose'
import { sendSuccess, sendError } from '../utils/response.js'
import { logActivity } from '../utils/activityLogger.js'

export const getPageSections = async (req, res) => {
  try {
    const { pageId } = req.params
    if (!mongoose.Types.ObjectId.isValid(pageId)) {
      return sendError(res, 'Invalid page ID.', 400)
    }
    const sections = await PageSection.find({ pageId, isDeleted: false }).sort({ sortOrder: 1 })
    return sendSuccess(res, 'Page sections retrieved successfully', sections)
  } catch (error) {
    return sendError(res, 'Failed to fetch page sections', 500)
  }
}

export const getPageSectionById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return sendError(res, 'Invalid page section ID.', 400)
    }
    const section = await PageSection.findOne({ _id: req.params.id, isDeleted: false })
    if (!section) return sendError(res, 'Page section not found', 404)
    return sendSuccess(res, 'Page section retrieved successfully', section)
  } catch (error) {
    return sendError(res, 'Failed to fetch page section', 500)
  }
}

export const createPageSection = async (req, res) => {
  try {
    const section = new PageSection(req.body)
    await section.save()
    logActivity({ req, action: 'CREATE', module: 'CMS_PAGE_SECTIONS', entityId: section._id, entityType: 'PageSection', description: `Created section for page: ${req.body.pageId}` })
    return sendSuccess(res, 'Page section created successfully', section, 201)
  } catch (error) {
    return sendError(res, error.message || 'Failed to create page section', 400)
  }
}

export const updatePageSection = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return sendError(res, 'Invalid page section ID.', 400)
    }
    const section = await PageSection.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, req.body, { new: true, runValidators: true })
    if (!section) return sendError(res, 'Page section not found', 404)
    logActivity({ req, action: 'UPDATE', module: 'CMS_PAGE_SECTIONS', entityId: section._id, entityType: 'PageSection', description: `Updated section: ${section.sectionType}` })
    return sendSuccess(res, 'Page section updated successfully', section)
  } catch (error) {
    return sendError(res, error.message || 'Failed to update page section', 400)
  }
}

export const deletePageSection = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return sendError(res, 'Invalid page section ID.', 400)
    }
    const section = await PageSection.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, { isDeleted: true, deletedAt: new Date(), isVisible: false }, { new: true })
    if (!section) return sendError(res, 'Page section not found', 404)
    logActivity({ req, action: 'DELETE', module: 'CMS_PAGE_SECTIONS', entityId: section._id, entityType: 'PageSection', description: `Deleted section: ${section.sectionType}` })
    return sendSuccess(res, 'Page section deleted successfully')
  } catch (error) {
    return sendError(res, 'Failed to delete page section', 500)
  }
}

export const updatePageSectionsOrder = async (req, res) => {
  try {
    const { sectionIds } = req.body // array of IDs in new order
    if (!Array.isArray(sectionIds)) return sendError(res, 'sectionIds must be an array', 400)
    if (sectionIds.some((id) => !mongoose.Types.ObjectId.isValid(id))) {
      return sendError(res, 'sectionIds must contain valid page section IDs', 400)
    }

    const updates = sectionIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id, isDeleted: false },
        update: { sortOrder: index }
      }
    }))

    if (updates.length > 0) {
      await PageSection.bulkWrite(updates)
    }

    logActivity({ req, action: 'UPDATE', module: 'CMS_PAGE_SECTIONS', description: 'Reordered page sections' })
    return sendSuccess(res, 'Page sections reordered successfully')
  } catch (error) {
    return sendError(res, 'Failed to reorder page sections', 500)
  }
}
