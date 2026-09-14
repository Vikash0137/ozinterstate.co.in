import mongoose from 'mongoose'
import Booking from '../models/Booking.js'
import Quote from '../models/Quote.js'
import Customer from '../models/Customer.js'
import Admin from '../models/Admin.js'
import { sendSuccess, sendError } from '../utils/response.js'
import { logActivity } from '../utils/activityLogger.js'
import { createNotification } from '../utils/notificationHelper.js'

const BOOKING_STATUS = ['pending', 'confirmed', 'in_transit', 'delivered', 'completed', 'cancelled']
const VALID_TRANSITIONS = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['in_transit', 'cancelled'],
  in_transit: ['delivered', 'cancelled'],
  delivered: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
}

const parseIntOr = (value, fallback) => {
  const parsed = Number.parseInt(value, 10)
  return Number.isNaN(parsed) ? fallback : parsed
}

const validateStatusTransition = (fromStatus, toStatus) => {
  if (!fromStatus || !toStatus) return false
  if (fromStatus === toStatus) return true
  const validNext = VALID_TRANSITIONS[fromStatus] || []
  return validNext.includes(toStatus)
}

const normalizeBookingFilters = (req) => {
  const { page = 1, limit = 10, search = '', status, customerId, serviceType, fromDate, toDate, sort = 'newest' } = req.query

  const filter = { isDeleted: { $ne: true } }

  if (status) filter.status = status
  if (customerId && mongoose.Types.ObjectId.isValid(customerId)) filter.customerId = customerId
  if (serviceType) filter.serviceType = serviceType

  if (fromDate || toDate) {
    filter.pickupDate = {}
    if (fromDate) filter.pickupDate.$gte = new Date(fromDate)
    if (toDate) filter.pickupDate.$lte = new Date(toDate)
  }

  if (search) {
    const value = String(search).trim()
    filter.$or = [
      { bookingNumber: new RegExp(value, 'i') },
      { customerName: new RegExp(value, 'i') },
      { customerEmail: new RegExp(value, 'i') },
      { customerPhone: new RegExp(value, 'i') },
      { pickupLocation: new RegExp(value, 'i') },
      { deliveryLocation: new RegExp(value, 'i') },
    ]
  }

  const pageNum = Math.max(1, parseIntOr(page, 1))
  const limitNum = Math.max(1, parseIntOr(limit, 10))
  const sortMap = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    pickup_asc: { pickupDate: 1 },
    pickup_desc: { pickupDate: -1 },
    amount_desc: { totalAmount: -1 },
    amount_asc: { totalAmount: 1 },
  }

  return { filter, pageNum, limitNum, sort: sortMap[sort] || sortMap.newest }
}

export const listBookings = async (req, res) => {
  try {
    const { filter, pageNum, limitNum, sort } = normalizeBookingFilters(req)
    const skip = (pageNum - 1) * limitNum

    const [bookings, total] = await Promise.all([
      Booking.find(filter)
        .populate('customerId', 'name email phone companyName status')
        .populate('quoteId', 'quoteNumber totalAmount status customerName')
        .populate('assignedTo', 'name email role status')
        .populate('createdBy', 'name email role status')
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Booking.countDocuments(filter),
    ])

    return sendSuccess(res, 'Bookings retrieved', {
      data: bookings,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum) || 1,
    })
  } catch (error) {
    console.error('Error listing bookings:', error)
    return sendError(res, 'Failed to retrieve bookings.', 500)
  }
}

export const getBooking = async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) return sendError(res, 'Invalid booking id', 400)

    const booking = await Booking.findById(id)
      .populate('customerId', 'name email phone companyName status')
      .populate('quoteId', 'quoteNumber totalAmount status customerName')
      .populate('assignedTo', 'name email role status')
      .populate('createdBy', 'name email role status')
      .lean()

    if (!booking) return sendError(res, 'Booking not found', 404)

    return sendSuccess(res, 'Booking retrieved', { booking })
  } catch (error) {
    console.error('Error fetching booking:', error)
    return sendError(res, 'Failed to fetch booking.', 500)
  }
}

export const createBooking = async (req, res) => {
  try {
    const body = { ...req.body }
    const required = ['customerId', 'serviceType', 'pickupLocation', 'deliveryLocation', 'totalAmount', 'status', 'pickupDate', 'deliveryDate']

    for (const field of required) {
      if (field === 'customerId' && (!body.customerId || !mongoose.Types.ObjectId.isValid(body.customerId))) {
        return sendError(res, 'Valid customer is required.', 400)
      }
      if ((field !== 'customerId' && !body[field]) || Number.isNaN(Number(body.totalAmount))) {
        return sendError(res, `${field} is required`, 400)
      }
    }

    const customer = await Customer.findById(body.customerId)
    if (!customer) return sendError(res, 'Customer not found', 404)

    if (!BOOKING_STATUS.includes(body.status)) return sendError(res, 'Invalid booking status.', 400)

    const bookingData = {
      quoteId: body.quoteId || null,
      customerId: customer._id,
      customerName: body.customerName || customer.name,
      customerEmail: body.customerEmail || customer.email,
      customerPhone: body.customerPhone || customer.phone,
      serviceType: body.serviceType,
      pickupLocation: body.pickupLocation,
      deliveryLocation: body.deliveryLocation,
      pickupDate: new Date(body.pickupDate),
      deliveryDate: new Date(body.deliveryDate),
      vehicleType: body.vehicleType || '',
      description: body.description || '',
      quantity: body.quantity || 1,
      totalAmount: Number(body.totalAmount),
      currency: body.currency || 'AUD',
      status: body.status,
      assignedTo: body.assignedTo || null,
      notes: body.notes || '',
      createdBy: req.user?._id || req.user?.id || body.createdBy || null,
      isDeleted: false,
    }

    if (bookingData.assignedTo && !mongoose.Types.ObjectId.isValid(bookingData.assignedTo)) {
      return sendError(res, 'Invalid assigned admin id.', 400)
    }

    const booking = new Booking(bookingData)
    await booking.save()

    if (bookingData.quoteId && mongoose.Types.ObjectId.isValid(bookingData.quoteId)) {
      await Quote.findByIdAndUpdate(bookingData.quoteId, { bookingId: booking._id, status: 'CONVERTED' })
    }

    logActivity({
      req,
      user: req.user,
      action: 'BOOKING_CREATE',
      module: 'BOOKINGS',
      description: `Booking ${booking.bookingNumber} created for ${customer.name}`,
      entityId: booking._id,
      entityType: 'Booking',
      metadata: {
        bookingNumber: booking.bookingNumber,
        customerName: customer.name,
        status: booking.status,
      },
    })

    await createNotification({
      userId: req.user?._id || req.user?.id || 'super-admin',
      type: 'SYSTEM',
      title: 'New Booking Created',
      message: `Booking ${booking.bookingNumber} has been created.`,
      entityId: booking._id,
      entityType: 'Booking',
    })

    return sendSuccess(res, 'Booking created successfully', { booking }, 201)
  } catch (error) {
    console.error('Error creating booking:', error)
    if (error.code === 11000) return sendError(res, 'Booking number already exists.', 409)
    return sendError(res, 'Failed to create booking.', 500)
  }
}

export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) return sendError(res, 'Invalid booking id', 400)

    const booking = await Booking.findById(id)
    if (!booking) return sendError(res, 'Booking not found', 404)

    const updates = { ...req.body }
    delete updates._id
    delete updates.bookingNumber
    delete updates.createdAt
    delete updates.updatedAt
    delete updates.isDeleted
    delete updates.deletedAt

    if (updates.customerId) {
      const customer = await Customer.findById(updates.customerId)
      if (!customer) return sendError(res, 'Customer not found', 404)
      updates.customerName = updates.customerName || customer.name
      updates.customerEmail = updates.customerEmail || customer.email
      updates.customerPhone = updates.customerPhone || customer.phone
    }

    if (updates.assignedTo && !mongoose.Types.ObjectId.isValid(updates.assignedTo)) {
      return sendError(res, 'Invalid assigned admin id.', 400)
    }

    const allowedFields = [
      'customerId', 'customerName', 'customerEmail', 'customerPhone', 'serviceType', 'pickupLocation',
      'deliveryLocation', 'pickupDate', 'deliveryDate', 'vehicleType', 'quantity', 'totalAmount',
      'currency', 'description', 'notes', 'assignedTo',
    ]

    Object.keys(updates).forEach((key) => {
      if (allowedFields.includes(key)) booking[key] = updates[key]
    })

    await booking.save()

    logActivity({
      req,
      user: req.user,
      action: 'BOOKING_UPDATE',
      module: 'BOOKINGS',
      description: `Booking ${booking.bookingNumber} updated`,
      entityId: booking._id,
      entityType: 'Booking',
      metadata: { bookingNumber: booking.bookingNumber, customerName: booking.customerName },
    })

    return sendSuccess(res, 'Booking updated successfully', { booking })
  } catch (error) {
    console.error('Error updating booking:', error)
    return sendError(res, 'Failed to update booking.', 500)
  }
}

export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!mongoose.Types.ObjectId.isValid(id)) return sendError(res, 'Invalid booking id', 400)
    if (!status || !BOOKING_STATUS.includes(status)) return sendError(res, 'Invalid booking status.', 400)

    const booking = await Booking.findById(id)
    if (!booking) return sendError(res, 'Booking not found', 404)

    const previousStatus = booking.status
    if (!validateStatusTransition(previousStatus, status)) {
      return sendError(res, `Invalid status transition from ${previousStatus} to ${status}.`, 400)
    }

    booking.status = status
    await booking.save()

    logActivity({
      req,
      user: req.user,
      action: 'BOOKING_STATUS_CHANGE',
      module: 'BOOKINGS',
      description: `Booking ${booking.bookingNumber} status changed from ${previousStatus} to ${status}`,
      entityId: booking._id,
      entityType: 'Booking',
      metadata: {
        bookingNumber: booking.bookingNumber,
        customerName: booking.customerName,
        previousStatus,
        newStatus: status,
      },
    })

    if (status === 'completed') {
      await createNotification({
        userId: booking.assignedTo || req.user?._id || 'super-admin',
        type: 'SYSTEM',
        title: 'Booking Completed',
        message: `Booking ${booking.bookingNumber} has been completed.`,
        entityId: booking._id,
        entityType: 'Booking',
      })
    }

    if (status === 'cancelled') {
      await createNotification({
        userId: booking.assignedTo || req.user?._id || 'super-admin',
        type: 'SYSTEM',
        title: 'Booking Cancelled',
        message: `Booking ${booking.bookingNumber} has been cancelled.`,
        entityId: booking._id,
        entityType: 'Booking',
      })
    }

    return sendSuccess(res, 'Booking status updated successfully', {
      booking,
      previousStatus,
      newStatus: status,
    })
  } catch (error) {
    console.error('Error updating booking status:', error)
    return sendError(res, 'Failed to update booking status.', 500)
  }
}

export const assignBooking = async (req, res) => {
  try {
    const { id } = req.params
    const { adminId } = req.body

    if (!mongoose.Types.ObjectId.isValid(id)) return sendError(res, 'Invalid booking id', 400)
    if (!adminId || !mongoose.Types.ObjectId.isValid(adminId)) return sendError(res, 'Valid admin id is required.', 400)

    const booking = await Booking.findById(id)
    if (!booking) return sendError(res, 'Booking not found', 404)

    const admin = await Admin.findById(adminId)
    if (!admin) return sendError(res, 'Admin not found', 404)
    if (admin.status !== 'active') return sendError(res, 'Only active admins can be assigned to bookings.', 400)

    const previousAssigned = booking.assignedTo
    booking.assignedTo = admin._id
    await booking.save()

    logActivity({
      req,
      user: req.user,
      action: 'BOOKING_ASSIGN',
      module: 'BOOKINGS',
      description: `Booking ${booking.bookingNumber} assigned to ${admin.name}`,
      entityId: booking._id,
      entityType: 'Booking',
      metadata: {
        bookingNumber: booking.bookingNumber,
        customerName: booking.customerName,
        assignedTo: admin._id,
        previousAssigned,
      },
    })

    await createNotification({
      userId: admin._id,
      type: 'SYSTEM',
      title: 'Booking Assigned',
      message: `Booking ${booking.bookingNumber} has been assigned to you.`,
      entityId: booking._id,
      entityType: 'Booking',
    })

    return sendSuccess(res, 'Booking assigned successfully', { booking })
  } catch (error) {
    console.error('Error assigning booking:', error)
    return sendError(res, 'Failed to assign booking.', 500)
  }
}

export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) return sendError(res, 'Invalid booking id', 400)

    const booking = await Booking.findById(id)
    if (!booking) return sendError(res, 'Booking not found', 404)

    booking.isDeleted = true
    booking.deletedAt = new Date()
    booking.status = 'cancelled'
    await booking.save()

    logActivity({
      req,
      user: req.user,
      action: 'BOOKING_CANCEL',
      module: 'BOOKINGS',
      description: `Booking ${booking.bookingNumber} was cancelled and soft deleted`,
      entityId: booking._id,
      entityType: 'Booking',
      metadata: {
        bookingNumber: booking.bookingNumber,
        customerName: booking.customerName,
        status: 'cancelled',
      },
    })

    await createNotification({
      userId: booking.assignedTo || req.user?._id || 'super-admin',
      type: 'SYSTEM',
      title: 'Booking Cancelled',
      message: `Booking ${booking.bookingNumber} has been cancelled.`,
      entityId: booking._id,
      entityType: 'Booking',
    })

    return sendSuccess(res, 'Booking deleted successfully', { booking })
  } catch (error) {
    console.error('Error deleting booking:', error)
    return sendError(res, 'Failed to delete booking.', 500)
  }
}

export const createBookingFromQuote = async (req, res) => {
  try {
    const { quoteId } = req.params
    if (!mongoose.Types.ObjectId.isValid(quoteId)) return sendError(res, 'Invalid quote id', 400)

    const quote = await Quote.findById(quoteId)
    if (!quote) return sendError(res, 'Quote not found', 404)
    if (!quote.customerId) return sendError(res, 'Quote is missing a customer reference.', 400)
    if (quote.bookingId) return sendError(res, 'Quote has already been converted to a booking.', 409)

    const customer = await Customer.findById(quote.customerId)
    if (!customer) return sendError(res, 'Customer not found', 404)

    const booking = await Booking.create({
      quoteId: quote._id,
      customerId: customer._id,
      customerName: quote.customerName || customer.name,
      customerEmail: quote.customerEmail || customer.email,
      customerPhone: quote.customerPhone || customer.phone,
      serviceType: quote.serviceType,
      pickupLocation: quote.movingFrom?.suburb || quote.movingFrom?.address || 'Not provided',
      deliveryLocation: quote.movingTo?.suburb || quote.movingTo?.address || 'Not provided',
      pickupDate: quote.movingDate || new Date(),
      deliveryDate: quote.movingDate || new Date(Date.now() + 86400000),
      vehicleType: quote.vehicleType || '',
      description: quote.customerMessage || '',
      quantity: 1,
      totalAmount: Number(quote.totalAmount || 0),
      currency: quote.currency || 'AUD',
      status: 'pending',
      createdBy: req.user?._id || req.user?.id || null,
      isDeleted: false,
    })

    quote.bookingId = booking._id
    if (quote.status === 'QUOTED' || quote.status === 'CONVERTED') {
      quote.status = 'CONVERTED'
    }
    quote.convertedAt = new Date()
    await quote.save()

    logActivity({
      req,
      user: req.user,
      action: 'BOOKING_FROM_QUOTE',
      module: 'BOOKINGS',
      description: `Booking ${booking.bookingNumber} created from quote ${quote.quoteNumber || quote._id}`,
      entityId: booking._id,
      entityType: 'Booking',
      metadata: {
        bookingNumber: booking.bookingNumber,
        quoteId: quote._id,
        customerName: booking.customerName,
        previousStatus: 'pending',
        newStatus: booking.status,
      },
    })

    await createNotification({
      userId: req.user?._id || 'super-admin',
      type: 'SYSTEM',
      title: 'New Booking Created',
      message: `Booking ${booking.bookingNumber} has been created.`,
      entityId: booking._id,
      entityType: 'Booking',
    })

    return sendSuccess(res, 'Booking created from quote successfully', { booking }, 201)
  } catch (error) {
    console.error('Error creating booking from quote:', error)
    return sendError(res, 'Failed to create booking from quote.', 500)
  }
}

export const getCustomerBookings = async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) return sendError(res, 'Invalid customer id', 400)

    const page = parseIntOr(req.query.page, 1)
    const limit = parseIntOr(req.query.limit, 10)
    const search = String(req.query.search || '').trim()
    const status = req.query.status || ''
    const sort = req.query.sort || 'newest'
    const skip = (page - 1) * limit

    const filter = {
      customerId: id,
      isDeleted: { $ne: true },
    }

    if (status) filter.status = status
    if (search) {
      filter.$or = [
        { bookingNumber: new RegExp(search, 'i') },
        { serviceType: new RegExp(search, 'i') },
        { pickupLocation: new RegExp(search, 'i') },
        { deliveryLocation: new RegExp(search, 'i') },
      ]
    }

    const sortMap = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      pickup_desc: { pickupDate: -1 },
      pickup_asc: { pickupDate: 1 },
    }

    const [bookings, total] = await Promise.all([
      Booking.find(filter).sort(sortMap[sort] || sortMap.newest).skip(skip).limit(limit).lean(),
      Booking.countDocuments(filter),
    ])

    return sendSuccess(res, 'Customer bookings retrieved', {
      data: bookings,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    })
  } catch (error) {
    console.error('Error fetching customer bookings:', error)
    return sendError(res, 'Failed to fetch customer bookings.', 500)
  }
}
