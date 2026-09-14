import mongoose from 'mongoose'
import Customer from '../models/Customer.js'
import { sendSuccess, sendError } from '../utils/response.js'
import { logActivity } from '../utils/activityLogger.js'

const parseIntOr = (v, d) => {
  const n = parseInt(v, 10)
  return Number.isNaN(n) ? d : n
}

export const getCustomers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status } = req.query

    const q = {}
    if (status) q.status = status

    if (search) {
      const s = search.trim()
      q.$or = [
        { name: new RegExp(s, 'i') },
        { email: new RegExp(s, 'i') },
        { phone: new RegExp(s, 'i') },
        { companyName: new RegExp(s, 'i') },
        { city: new RegExp(s, 'i') },
      ]
    }

    const pageNum = parseIntOr(page, 1)
    const lim = parseIntOr(limit, 10)
    const skip = (pageNum - 1) * lim

    const [customers, total] = await Promise.all([
      Customer.find(q).sort({ createdAt: -1 }).skip(skip).limit(lim).lean(),
      Customer.countDocuments(q),
    ])

    return sendSuccess(res, 'Customers retrieved', {
      customers,
      pagination: { page: pageNum, limit: lim, total, totalPages: Math.ceil(total / lim) || 1 },
    })
  } catch (err) {
    console.error('Error getting customers:', err)
    return sendError(res, 'Failed to retrieve customers.', 500)
  }
}

export const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) return sendError(res, 'Invalid customer id', 400)

    const customer = await Customer.findById(id).lean()
    if (!customer) return sendError(res, 'Customer not found', 404)
    return sendSuccess(res, 'Customer retrieved', { customer })
  } catch (err) {
    console.error('Error fetching customer:', err)
    return sendError(res, 'Failed to fetch customer.', 500)
  }
}

export const createCustomer = async (req, res) => {
  try {
    const body = req.body || {}
    const required = ['name', 'email', 'phone']
    for (const f of required) {
      if (!body[f]) return sendError(res, `${f} is required`, 400)
    }

    const email = String(body.email).trim().toLowerCase()
    const phone = String(body.phone).trim()

    // Check duplicates
    const existingEmail = await Customer.findOne({ email }).lean()
    if (existingEmail) return sendError(res, 'Email already in use', 409)

    const existingPhone = await Customer.findOne({ phone }).lean()
    if (existingPhone) return sendError(res, 'Phone already in use', 409)

    const payload = {
      name: String(body.name).trim(),
      email,
      phone,
      alternatePhone: body.alternatePhone || '',
      companyName: body.companyName || '',
      address: body.address || '',
      city: body.city || '',
      state: body.state || '',
      country: body.country || 'India',
      postalCode: body.postalCode || '',
      notes: body.notes || '',
      status: body.status || 'active',
    }

    const customer = new Customer(payload)
    await customer.save()

    // Log activity
    logActivity({
      req,
      user: req.user,
      action: 'CUSTOMER_CREATE',
      module: 'CUSTOMERS',
      description: `Customer ${payload.name} created`,
      entityId: customer._id,
      entityType: 'Customer',
      metadata: {
        customerName: payload.name,
        customerEmail: payload.email,
        customerPhone: payload.phone,
      },
    })

    return sendSuccess(res, 'Customer created', { customer })
  } catch (err) {
    console.error('Error creating customer:', err)
    return sendError(res, 'Failed to create customer.', 500)
  }
}

export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) return sendError(res, 'Invalid customer id', 400)

    const updates = { ...req.body }
    // Disallow modifying system fields
    delete updates._id
    delete updates.createdAt
    delete updates.updatedAt

    if (updates.email) updates.email = String(updates.email).trim().toLowerCase()
    const customer = await Customer.findByIdAndUpdate(id, updates, { new: true }).lean()
    if (!customer) return sendError(res, 'Customer not found', 404)

    // Log activity
    logActivity({
      req,
      user: req.user,
      action: 'CUSTOMER_UPDATE',
      module: 'CUSTOMERS',
      description: `Customer ${customer.name} updated`,
      entityId: customer._id,
      entityType: 'Customer',
      metadata: {
        customerName: customer.name,
        customerEmail: customer.email,
      },
    })

    return sendSuccess(res, 'Customer updated', { customer })
  } catch (err) {
    console.error('Error updating customer:', err)
    return sendError(res, 'Failed to update customer.', 500)
  }
}

export const updateCustomerStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body
    if (!['active', 'inactive'].includes(status)) return sendError(res, 'Invalid status', 400)
    if (!mongoose.Types.ObjectId.isValid(id)) return sendError(res, 'Invalid customer id', 400)

    const customer = await Customer.findByIdAndUpdate(id, { status }, { new: true }).lean()
    if (!customer) return sendError(res, 'Customer not found', 404)

    // Log activity
    logActivity({
      req,
      user: req.user,
      action: 'CUSTOMER_STATUS_CHANGE',
      module: 'CUSTOMERS',
      description: `Customer ${customer.name} status changed to ${status}`,
      entityId: customer._id,
      entityType: 'Customer',
      metadata: {
        customerName: customer.name,
        newStatus: status,
      },
    })

    return sendSuccess(res, 'Status updated', { customer })
  } catch (err) {
    console.error('Error updating customer status:', err)
    return sendError(res, 'Failed to update status.', 500)
  }
}

export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) return sendError(res, 'Invalid customer id', 400)

    // Soft delete: mark inactive (preserve data)
    const customer = await Customer.findByIdAndUpdate(id, { status: 'inactive' }, { new: true }).lean()
    if (!customer) return sendError(res, 'Customer not found', 404)

    // Log activity
    logActivity({
      req,
      user: req.user,
      action: 'DELETE',
      module: 'CUSTOMERS',
      description: `Customer ${customer.name} deleted (deactivated)`,
      entityId: customer._id,
      entityType: 'Customer',
      metadata: {
        customerName: customer.name,
        customerEmail: customer.email,
      },
    })

    return sendSuccess(res, 'Customer deleted (soft)', { customer })
  } catch (err) {
    console.error('Error deleting customer:', err)
    return sendError(res, 'Failed to delete customer.', 500)
  }
}

export const searchCustomers = async (req, res) => {
  try {
    const { q = '', limit = 10 } = req.query
    if (!q) return sendSuccess(res, 'Search results', { customers: [] })
    const s = q.trim()
    const customers = await Customer.find({
      $or: [
        { name: new RegExp(s, 'i') },
        { email: new RegExp(s, 'i') },
        { phone: new RegExp(s, 'i') },
        { companyName: new RegExp(s, 'i') },
        { city: new RegExp(s, 'i') },
      ],
    })
      .limit(parseInt(limit, 10))
      .lean()

    return sendSuccess(res, 'Search results', { customers })
  } catch (err) {
    console.error('Error searching customers:', err)
    return sendError(res, 'Failed to search customers.', 500)
  }
}
