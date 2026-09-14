import Page from '../models/Page.js'
import PageSection from '../models/PageSection.js'
import { sendSuccess, sendError } from '../utils/response.js'
import { logActivity } from '../utils/activityLogger.js'

export const getPublicPageBySlug = async (req, res) => {
  try {
    const page = await Page.findOne({ slug: req.params.slug, status: 'published', isDeleted: false }).lean()
    if (!page) return sendError(res, 'Page not found', 404)

    const sections = await PageSection.find({ pageId: page._id, isVisible: true, isDeleted: false })
      .sort({ sortOrder: 1 })
      .lean()

    return sendSuccess(res, 'Page retrieved successfully', { ...page, sections })
  } catch (error) {
    return sendError(res, 'Failed to fetch page', 500)
  }
}

export const getPages = async (req, res) => {
  try {
    const pages = await Page.find({ isDeleted: false }).sort({ sortOrder: 1 })
    return sendSuccess(res, 'Pages retrieved successfully', pages)
  } catch (error) {
    return sendError(res, 'Failed to fetch pages', 500)
  }
}

export const getPageById = async (req, res) => {
  try {
    const page = await Page.findOne({ _id: req.params.id, isDeleted: false })
    if (!page) return sendError(res, 'Page not found', 404)
    return sendSuccess(res, 'Page retrieved successfully', page)
  } catch (error) {
    return sendError(res, 'Failed to fetch page', 500)
  }
}

export const createPage = async (req, res) => {
  try {
    const page = new Page(req.body)
    await page.save()
    logActivity({ req, action: 'CREATE', module: 'CMS_PAGES', entityId: page._id, entityType: 'Page', description: `Created page: ${page.title}` })
    return sendSuccess(res, 'Page created successfully', page, 201)
  } catch (error) {
    return sendError(res, error.message || 'Failed to create page', 400)
  }
}

export const updatePage = async (req, res) => {
  try {
    const page = await Page.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, req.body, { new: true, runValidators: true })
    if (!page) return sendError(res, 'Page not found', 404)
    logActivity({ req, action: 'UPDATE', module: 'CMS_PAGES', entityId: page._id, entityType: 'Page', description: `Updated page: ${page.title}` })
    return sendSuccess(res, 'Page updated successfully', page)
  } catch (error) {
    return sendError(res, error.message || 'Failed to update page', 400)
  }
}

export const deletePage = async (req, res) => {
  try {
    const page = await Page.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, { isDeleted: true, deletedAt: new Date(), status: 'inactive' }, { new: true })
    if (!page) return sendError(res, 'Page not found', 404)
    logActivity({ req, action: 'DELETE', module: 'CMS_PAGES', entityId: page._id, entityType: 'Page', description: `Deleted page: ${page.title}` })
    return sendSuccess(res, 'Page deleted successfully')
  } catch (error) {
    return sendError(res, 'Failed to delete page', 500)
  }
}
