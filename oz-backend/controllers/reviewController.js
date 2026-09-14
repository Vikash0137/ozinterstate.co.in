import Testimonial from '../models/Testimonial.js'
import mongoose from 'mongoose'
import { sendSuccess, sendError } from '../utils/response.js'
import { logActivity } from '../utils/activityLogger.js'

export const getPublicReviews = async (req, res) => {
  try {
    const reviews = await Testimonial.find({ status: 'active', isDeleted: false }).sort({ sortOrder: 1, createdAt: -1 })
    return sendSuccess(res, 'Reviews retrieved successfully', reviews)
  } catch (error) {
    return sendError(res, 'Failed to fetch reviews', 500)
  }
}

export const getReviews = async (req, res) => {
  try {
    const reviews = await Testimonial.find({ isDeleted: false }).sort({ sortOrder: 1, createdAt: -1 })
    return sendSuccess(res, 'Reviews retrieved successfully', reviews)
  } catch (error) {
    return sendError(res, 'Failed to fetch reviews', 500)
  }
}

export const getReviewById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return sendError(res, 'Invalid review ID.', 400)
    }

    const review = await Testimonial.findOne({ _id: req.params.id, isDeleted: false })
    if (!review) return sendError(res, 'Review not found', 404)
    return sendSuccess(res, 'Review retrieved successfully', review)
  } catch (error) {
    return sendError(res, 'Failed to fetch review', 500)
  }
}

export const createReview = async (req, res) => {
  try {
    const review = new Testimonial(req.body)
    await review.save()
    logActivity({ req, action: 'CREATE', module: 'CMS_REVIEWS', entityId: review._id, entityType: 'Testimonial', description: `Created review by: ${review.name}` })
    return sendSuccess(res, 'Review created successfully', review, 201)
  } catch (error) {
    return sendError(res, error.message || 'Failed to create review', 400)
  }
}

export const updateReview = async (req, res) => {
  try {
    const review = await Testimonial.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, req.body, { new: true, runValidators: true })
    if (!review) return sendError(res, 'Review not found', 404)
    logActivity({ req, action: 'UPDATE', module: 'CMS_REVIEWS', entityId: review._id, entityType: 'Testimonial', description: `Updated review by: ${review.name}` })
    return sendSuccess(res, 'Review updated successfully', review)
  } catch (error) {
    return sendError(res, error.message || 'Failed to update review', 400)
  }
}

export const deleteReview = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return sendError(res, 'Invalid review ID.', 400)
    }

    const review = await Testimonial.findOneAndDelete({ _id: req.params.id })
    if (!review) return sendError(res, 'Review not found', 404)
    logActivity({ req, action: 'DELETE', module: 'CMS_REVIEWS', entityId: review._id, entityType: 'Testimonial', description: `Deleted review by: ${review.name}` })
    return sendSuccess(res, 'Review deleted successfully')
  } catch (error) {
    console.error('REVIEW DELETE ERROR:', error)
    return sendError(res, 'Failed to delete review', 500)
  }
}
