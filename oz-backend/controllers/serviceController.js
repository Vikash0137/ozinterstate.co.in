import Service from '../models/Service.js'
import mongoose from 'mongoose'
import { sendSuccess, sendError } from '../utils/response.js'
import { logActivity } from '../utils/activityLogger.js'

export const getPublicServices = async (req, res) => {
  try {
    const services = await Service.find({ status: 'active', isDeleted: false }).sort({ sortOrder: 1 })
    return sendSuccess(res, 'Services retrieved successfully', services)
  } catch (error) {
    return sendError(res, 'Failed to fetch services', 500)
  }
}

export const getPublicServiceBySlug = async (req, res) => {
  try {
    const service = await Service.findOne({ slug: req.params.slug, status: 'active', isDeleted: false })
    if (!service) return sendError(res, 'Service not found', 404)
    return sendSuccess(res, 'Service retrieved successfully', service)
  } catch (error) {
    return sendError(res, 'Failed to fetch service', 500)
  }
}

export const getServices = async (req, res) => {
  try {
    const services = await Service.find({ isDeleted: false }).sort({ sortOrder: 1 })
    return sendSuccess(res, 'Services retrieved successfully', services)
  } catch (error) {
    return sendError(res, 'Failed to fetch services', 500)
  }
}

export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findOne({ _id: req.params.id, isDeleted: false })
    if (!service) return sendError(res, 'Service not found', 404)
    return sendSuccess(res, 'Service retrieved successfully', service)
  } catch (error) {
    return sendError(res, 'Failed to fetch service', 500)
  }
}

export const createService = async (req, res) => {
  try {
    const existingService = await Service.findOne({ slug: req.body.slug, isDeleted: false })
    if (existingService) {
      return res.status(409).json({
        success: false,
        message: 'A service with this URL slug already exists. Opening the existing service for editing.',
        data: { _id: existingService._id, slug: existingService.slug },
      })
    }

    const service = new Service(req.body)
    await service.save()
    logActivity({ req, action: 'CREATE', module: 'CMS_SERVICES', entityId: service._id, entityType: 'Service', description: `Created service: ${service.title}` })
    return sendSuccess(res, 'Service created successfully', service, 201)
  } catch (error) {
    if (error?.code === 11000) {
      return sendError(res, 'A service with this URL slug already exists. Please edit the existing service or choose a different slug.', 409)
    }
    return sendError(res, error.message || 'Failed to create service', 400)
  }
}

export const updateService = async (req, res) => {
  try {
    const service = await Service.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, req.body, { new: true, runValidators: true })
    if (!service) return sendError(res, 'Service not found', 404)
    logActivity({ req, action: 'UPDATE', module: 'CMS_SERVICES', entityId: service._id, entityType: 'Service', description: `Updated service: ${service.title}` })
    return sendSuccess(res, 'Service updated successfully', service)
  } catch (error) {
    if (error?.code === 11000) {
      return sendError(res, 'A service with this URL slug already exists. Please choose a different slug.', 409)
    }
    return sendError(res, error.message || 'Failed to update service', 400)
  }
}

export const deleteService = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return sendError(res, 'Invalid service ID.', 400)
    }

    const service = await Service.findOneAndDelete({ _id: req.params.id })
    if (!service) return sendError(res, 'Service not found', 404)
    logActivity({ req, action: 'DELETE', module: 'CMS_SERVICES', entityId: service._id, entityType: 'Service', description: `Deleted service: ${service.title}` })
    return sendSuccess(res, 'Service deleted successfully')
  } catch (error) {
    console.error('SERVICE DELETE ERROR:', error)
    return sendError(res, 'Failed to delete service', 500)
  }
}
