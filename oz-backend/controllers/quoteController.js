import mongoose from 'mongoose'
import Quote from '../models/Quote.js'
import Customer from '../models/Customer.js'
import Booking from '../models/Booking.js'
import Location from '../models/Location.js'
import { sendSuccess, sendError } from '../utils/response.js'
import { logActivity } from '../utils/activityLogger.js'

const parseIntOr = (v, d) => {
  const n = parseInt(v, 10)
  return Number.isNaN(n) ? d : n
}

export const listQuotes = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status, sortBy = 'createdAt', sortOrder = 'desc', fromDate, toDate, location } = req.query

    const q = {}

    if (status) q.status = status

    if (fromDate || toDate) {
      q.movingDate = {}
      if (fromDate) q.movingDate.$gte = new Date(fromDate)
      if (toDate) q.movingDate.$lte = new Date(toDate)
    }

    if (location) {
      const loc = location.trim()
      q.$or = [
        { 'movingFrom.suburb': new RegExp(loc, 'i') },
        { 'movingFrom.state': new RegExp(loc, 'i') },
        { 'movingTo.suburb': new RegExp(loc, 'i') },
        { 'movingTo.state': new RegExp(loc, 'i') },
      ]
    }

    if (search) {
      const s = search.trim()
      q.$or = q.$or || []
      q.$or.push({ customerName: new RegExp(s, 'i') })
      q.$or.push({ customerEmail: new RegExp(s, 'i') })
      q.$or.push({ customerPhone: new RegExp(s, 'i') })
      q.$or.push({ quoteNumber: new RegExp(s, 'i') })
    }

    // Filter by customerId when provided
    if (req.query.customerId && mongoose.Types.ObjectId.isValid(req.query.customerId)) {
      q.customerId = req.query.customerId
    }

    const pageNum = parseIntOr(page, 1)
    const lim = parseIntOr(limit, 10)
    const skip = (pageNum - 1) * lim

    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 }

    const [quotes, total] = await Promise.all([
      Quote.find(q).populate('customerId', 'name companyName status').sort(sort).skip(skip).limit(lim).lean(),
      Quote.countDocuments(q),
    ])

    return sendSuccess(res, 'Quotes retrieved', {
      quotes,
      pagination: {
        page: pageNum,
        limit: lim,
        total,
        totalPages: Math.ceil(total / lim) || 1,
      },
    })
  } catch (err) {
    console.error('Error listing quotes:', err)
    return sendError(res, 'Failed to list quotes.', 500)
  }
}

export const getQuote = async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) return sendError(res, 'Invalid quote id', 400)

    const quote = await Quote.findById(id).populate('customerId', 'name email phone companyName address city state country status').lean()
    if (!quote) return sendError(res, 'Quote not found', 404)
    return sendSuccess(res, 'Quote retrieved', { quote })
  } catch (err) {
    console.error('Error fetching quote:', err)
    return sendError(res, 'Failed to fetch quote.', 500)
  }
}

export const createQuote = async (req, res) => {
  try {
    const body = req.body || {}
    const required = ['customerName', 'customerEmail', 'customerPhone', 'movingFrom', 'movingTo', 'movingDate', 'propertyType', 'serviceType']
    for (const f of required) {
      if (!body[f]) return sendError(res, `${f} is required`, 400)
    }

    // enforce source
    if (!body.source) body.source = 'website'

    // Link or create customer when possible
    let customerId = body.customerId || null

    // If customerId provided, verify and fetch customer
    if (customerId && mongoose.Types.ObjectId.isValid(customerId)) {
      const cust = await Customer.findById(customerId).lean()
      if (cust) {
        // ensure quote has primary customer fields
        body.customerName = body.customerName || cust.name
        body.customerEmail = body.customerEmail || cust.email
        body.customerPhone = body.customerPhone || cust.phone
        body.companyName = body.companyName || cust.companyName || ''
      } else {
        customerId = null
      }
    }

    // If no customerId, try matching by email or phone
    if (!customerId) {
      const email = body.customerEmail ? String(body.customerEmail).trim().toLowerCase() : ''
      const phone = body.customerPhone ? String(body.customerPhone).trim() : ''
      let existing = null
      if (email) existing = await Customer.findOne({ email }).lean()
      if (!existing && phone) existing = await Customer.findOne({ phone }).lean()
      if (existing) {
        customerId = existing._id
        body.customerName = body.customerName || existing.name
        body.customerEmail = body.customerEmail || existing.email
        body.customerPhone = body.customerPhone || existing.phone
        body.companyName = body.companyName || existing.companyName || ''
      } else if (email || phone) {
        // create customer for public submissions or when email/phone provided
        try {
          const newCust = new Customer({
            name: body.customerName || 'Unknown',
            email: email || '',
            phone: phone || '',
            companyName: body.companyName || '',
            address: body.address || '',
            city: body.city || '',
            state: body.state || '',
            country: body.country || 'India',
          })
          const saved = await newCust.save()
          customerId = saved._id
        } catch (e) {
          console.warn('Could not create customer for quote:', e.message || e)
        }
      }
    }

    if (customerId) body.customerId = customerId

    const quote = new Quote(body)
    await quote.save()

    // Increment lead counter on location if attributed to a location
    if (body.locationId && mongoose.Types.ObjectId.isValid(body.locationId)) {
      Location.findByIdAndUpdate(body.locationId, { $inc: { leadsCount: 1 } }).catch(() => {})
    } else if (body.locationSlug) {
      Location.findOneAndUpdate({ slug: body.locationSlug }, { $inc: { leadsCount: 1 } }).catch(() => {})
    }

    // Log activity
    logActivity({
      req,
      user: req.user,
      action: 'QUOTE_CREATE',
      module: 'QUOTES',
      description: `Quote ${quote.quoteNumber || quote._id} created for ${quote.customerName}`,
      entityId: quote._id,
      entityType: 'Quote',
      metadata: {
        quoteNumber: quote.quoteNumber,
        customerName: quote.customerName,
        customerEmail: quote.customerEmail,
      },
    })

    return sendSuccess(res, 'Quote created', { quote })
  } catch (err) {
    console.error('Error creating quote:', err)
    if (err.code === 11000) return sendError(res, 'Duplicate quote number', 409)
    return sendError(res, 'Failed to create quote.', 500)
  }
}

export const updateQuote = async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) return sendError(res, 'Invalid quote id', 400)
    const updates = { ...req.body }
    // Disallow certain fields
    delete updates._id
    delete updates.quoteNumber
    delete updates.createdAt

    // Handle customerId update: if provided, fetch customer and sync fields
    if (updates.customerId && mongoose.Types.ObjectId.isValid(updates.customerId)) {
      const cust = await Customer.findById(updates.customerId).lean()
      if (cust) {
        updates.customerName = updates.customerName || cust.name
        updates.customerEmail = updates.customerEmail || cust.email
        updates.customerPhone = updates.customerPhone || cust.phone
        updates.companyName = updates.companyName || cust.companyName || ''
      }
    }

    const quote = await Quote.findByIdAndUpdate(id, updates, { new: true }).lean()
    if (!quote) return sendError(res, 'Quote not found', 404)
    return sendSuccess(res, 'Quote updated', { quote })
  } catch (err) {
    console.error('Error updating quote:', err)
    return sendError(res, 'Failed to update quote.', 500)
  }
}

export const updateQuoteStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body
    const allowed = ['NEW', 'CONTACTED', 'QUOTED', 'FOLLOW_UP', 'CONVERTED', 'REJECTED', 'ARCHIVED']
    if (!allowed.includes(status)) return sendError(res, 'Invalid status', 400)
    if (!mongoose.Types.ObjectId.isValid(id)) return sendError(res, 'Invalid quote id', 400)

    const updates = { status }
    const now = new Date()
    if (status === 'CONTACTED') updates.contactedAt = now
    if (status === 'QUOTED') updates.quotedAt = now
    if (status === 'CONVERTED') updates.convertedAt = now
    if (status === 'REJECTED') updates.rejectedAt = now
    if (status === 'ARCHIVED') updates.archivedAt = now

    const quote = await Quote.findByIdAndUpdate(id, updates, { new: true }).lean()
    if (!quote) return sendError(res, 'Quote not found', 404)

    // Log activity
    logActivity({
      req,
      user: req.user,
      action: 'QUOTE_STATUS_CHANGE',
      module: 'QUOTES',
      description: `Quote ${quote.quoteNumber || quote._id} status changed to ${status}`,
      entityId: quote._id,
      entityType: 'Quote',
      metadata: {
        quoteNumber: quote.quoteNumber,
        newStatus: status,
        customerName: quote.customerName,
      },
    })

    return sendSuccess(res, 'Status updated', { quote })
  } catch (err) {
    console.error('Error updating status:', err)
    return sendError(res, 'Failed to update status.', 500)
  }
}

export const addInternalNote = async (req, res) => {
  try {
    const { id } = req.params
    const { note } = req.body
    if (!note) return sendError(res, 'Note is required', 400)
    if (!mongoose.Types.ObjectId.isValid(id)) return sendError(res, 'Invalid quote id', 400)

    const createdBy = req.user?.email || 'system'
    const entry = { note, createdBy, createdAt: new Date() }
    const quote = await Quote.findByIdAndUpdate(id, { $push: { internalNotes: entry } }, { new: true }).lean()
    if (!quote) return sendError(res, 'Quote not found', 404)
    return sendSuccess(res, 'Note added', { quote })
  } catch (err) {
    console.error('Error adding note:', err)
    return sendError(res, 'Failed to add note.', 500)
  }
}

export const updatePricing = async (req, res) => {
  try {
    const { id } = req.params
    const { basePrice = 0, additionalCharges = 0, discount = 0, tax = 0 } = req.body
    if (!mongoose.Types.ObjectId.isValid(id)) return sendError(res, 'Invalid quote id', 400)

    const totalAmount = Number(basePrice) + Number(additionalCharges) - Number(discount) + Number(tax)

    const updates = { basePrice, additionalCharges, discount, tax, totalAmount }
    const quote = await Quote.findByIdAndUpdate(id, updates, { new: true }).lean()
    if (!quote) return sendError(res, 'Quote not found', 404)
    return sendSuccess(res, 'Pricing updated', { quote })
  } catch (err) {
    console.error('Error updating pricing:', err)
    return sendError(res, 'Failed to update pricing.', 500)
  }
}

export const convertQuote = async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) return sendError(res, 'Invalid quote id', 400)

    const quote = await Quote.findById(id)
    if (!quote) return sendError(res, 'Quote not found', 404)
    if (!quote.customerId) return sendError(res, 'Quote is missing a customer reference.', 400)
    if (quote.bookingId) return sendError(res, 'Quote has already been converted to a booking.', 409)
    if (['ARCHIVED', 'REJECTED'].includes(quote.status)) return sendError(res, 'Cannot convert archived or rejected quote', 400)

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

    return sendSuccess(res, 'Quote converted to booking successfully', { booking }, 201)
  } catch (err) {
    console.error('Error converting quote:', err)
    return sendError(res, 'Failed to convert quote.', 500)
  }
}

export const archiveQuote = async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) return sendError(res, 'Invalid quote id', 400)

    const now = new Date()
    const quote = await Quote.findByIdAndUpdate(id, { status: 'ARCHIVED', archivedAt: now }, { new: true }).lean()
    if (!quote) return sendError(res, 'Quote not found', 404)
    return sendSuccess(res, 'Quote archived', { quote })
  } catch (err) {
    console.error('Error archiving quote:', err)
    return sendError(res, 'Failed to archive quote.', 500)
  }
}
