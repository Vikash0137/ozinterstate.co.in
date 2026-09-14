import mongoose from 'mongoose'
import Redirect from '../models/Redirect.js'
import { sendSuccess, sendError } from '../utils/response.js'

export const getRedirects = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query
    const pageNum = parseInt(page, 10) || 1
    const limitNum = parseInt(limit, 10) || 20
    const skip = (pageNum - 1) * limitNum

    const query = {}
    if (search && search.trim()) {
      const term = search.trim()
      query.$or = [
        { source: new RegExp(term, 'i') },
        { destination: new RegExp(term, 'i') },
        { notes: new RegExp(term, 'i') },
      ]
    }

    const [redirects, total] = await Promise.all([
      Redirect.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
      Redirect.countDocuments(query),
    ])

    return sendSuccess(res, 'Redirects retrieved', {
      redirects,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    })
  } catch (error) {
    console.error('Error fetching redirects:', error)
    return sendError(res, 'Failed to retrieve redirects.', 500)
  }
}

export const createRedirect = async (req, res) => {
  try {
    const { source, destination, statusCode = 301, notes = '' } = req.body || {}
    if (!source || !destination) return sendError(res, 'Source and destination are required', 400)

    const normalizedSource = String(source).trim().toLowerCase()
    const normalizedDest = String(destination).trim()

    if (normalizedSource === normalizedDest.toLowerCase()) {
      return sendError(res, 'Source and destination cannot be identical (prevent redirect loop).', 400)
    }

    const existing = await Redirect.findOne({ source: normalizedSource })
    if (existing) {
      existing.destination = normalizedDest
      existing.statusCode = Number(statusCode) || 301
      existing.notes = notes
      existing.isActive = true
      await existing.save()
      return sendSuccess(res, 'Redirect updated', { redirect: existing })
    }

    const redirect = await Redirect.create({
      source: normalizedSource,
      destination: normalizedDest,
      statusCode: Number(statusCode) || 301,
      notes,
    })

    return sendSuccess(res, 'Redirect created successfully', { redirect }, 201)
  } catch (error) {
    console.error('Error creating redirect:', error)
    return sendError(res, 'Failed to create redirect.', 500)
  }
}

export const toggleRedirectActive = async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) return sendError(res, 'Invalid redirect id', 400)

    const redirect = await Redirect.findById(id)
    if (!redirect) return sendError(res, 'Redirect not found', 404)

    redirect.isActive = !redirect.isActive
    await redirect.save()

    return sendSuccess(res, 'Redirect status updated', { redirect })
  } catch (error) {
    console.error('Error toggling redirect:', error)
    return sendError(res, 'Failed to update redirect status.', 500)
  }
}

export const deleteRedirect = async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) return sendError(res, 'Invalid redirect id', 400)

    await Redirect.findByIdAndDelete(id)
    return sendSuccess(res, 'Redirect deleted successfully')
  } catch (error) {
    console.error('Error deleting redirect:', error)
    return sendError(res, 'Failed to delete redirect.', 500)
  }
}
