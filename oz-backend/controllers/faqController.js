import FAQ from '../models/FAQ.js'
import mongoose from 'mongoose'
import { sendSuccess, sendError } from '../utils/response.js'
import { logActivity } from '../utils/activityLogger.js'

export const getPublicFAQs = async (req, res) => {
  try {
    const { pageSlug, locationId, serviceId } = req.query
    const query = { status: 'active', isDeleted: false }
    
    if (pageSlug) query.pageSlug = pageSlug
    if (locationId) query.locationId = locationId
    if (serviceId) query.serviceId = serviceId

    const faqs = await FAQ.find(query).sort({ display_order: 1 })
    return sendSuccess(res, 'FAQs retrieved successfully', faqs)
  } catch (error) {
    return sendError(res, 'Failed to fetch FAQs', 500)
  }
}

export const getFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find({ isDeleted: false }).sort({ display_order: 1 })
    return sendSuccess(res, 'FAQs retrieved successfully', faqs)
  } catch (error) {
    return sendError(res, 'Failed to fetch FAQs', 500)
  }
}

export const getFAQById = async (req, res) => {
  try {
    const faq = await FAQ.findOne({ _id: req.params.id, isDeleted: false })
    if (!faq) return sendError(res, 'FAQ not found', 404)
    return sendSuccess(res, 'FAQ retrieved successfully', faq)
  } catch (error) {
    return sendError(res, 'Failed to fetch FAQ', 500)
  }
}

export const createFAQ = async (req, res) => {
  try {
    const faq = new FAQ(req.body)
    await faq.save()
    logActivity({ req, action: 'CREATE', module: 'CMS_FAQS', entityId: faq._id, entityType: 'FAQ', description: `Created FAQ` })
    return sendSuccess(res, 'FAQ created successfully', faq, 201)
  } catch (error) {
    return sendError(res, error.message || 'Failed to create FAQ', 400)
  }
}

export const updateFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, req.body, { new: true, runValidators: true })
    if (!faq) return sendError(res, 'FAQ not found', 404)
    logActivity({ req, action: 'UPDATE', module: 'CMS_FAQS', entityId: faq._id, entityType: 'FAQ', description: `Updated FAQ` })
    return sendSuccess(res, 'FAQ updated successfully', faq)
  } catch (error) {
    return sendError(res, error.message || 'Failed to update FAQ', 400)
  }
}

export const deleteFAQ = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return sendError(res, 'Invalid FAQ ID.', 400)
    }

    const faq = await FAQ.findOneAndDelete({ _id: req.params.id })
    if (!faq) return sendError(res, 'FAQ not found', 404)
    logActivity({ req, action: 'DELETE', module: 'CMS_FAQS', entityId: faq._id, entityType: 'FAQ', description: `Deleted FAQ` })
    return sendSuccess(res, 'FAQ deleted successfully')
  } catch (error) {
    console.error('FAQ DELETE ERROR:', error)
    return sendError(res, 'Failed to delete FAQ', 500)
  }
}
