import bcrypt from 'bcryptjs'
import Admin from '../models/Admin.js'
import { sendSuccess, sendError } from '../utils/response.js'
import { logActivity } from '../utils/activityLogger.js'

// Utility to parse pagination params
const parseIntOr = (v, d) => {
  const n = parseInt(v, 10)
  return Number.isNaN(n) ? d : n
}

/**
 * GET /api/admins
 * List all admins with search, filters, pagination
 */
export const listAdmins = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      role = '',
      status = '',
      sortBy = 'created_at',
      sortOrder = 'desc',
    } = req.query

    const query = {}

    // Search by name or email
    if (search) {
      const s = search.trim()
      query.$or = [
        { name: new RegExp(s, 'i') },
        { email: new RegExp(s, 'i') },
      ]
    }

    // Filter by role
    if (role) {
      query.role = role
    }

    // Filter by status
    if (status) {
      query.status = status
    }

    const pageNum = parseIntOr(page, 1)
    const lim = parseIntOr(limit, 10)
    const skip = (pageNum - 1) * lim

    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 }

    const [admins, total] = await Promise.all([
      Admin.find(query)
        .select('-password')
        .sort(sort)
        .skip(skip)
        .limit(lim)
        .lean(),
      Admin.countDocuments(query),
    ])

    return sendSuccess(res, 'Admins retrieved', {
      admins,
      pagination: {
        page: pageNum,
        limit: lim,
        total,
        totalPages: Math.ceil(total / lim) || 1,
      },
    })
  } catch (err) {
    console.error('Error listing admins:', err)
    return sendError(res, 'Failed to list admins.', 500)
  }
}

/**
 * GET /api/admins/:id
 * Get single admin
 */
export const getAdmin = async (req, res) => {
  try {
    const { id } = req.params

    const admin = await Admin.findById(id).select('-password').lean()

    if (!admin) {
      return sendError(res, 'Admin not found', 404)
    }

    return sendSuccess(res, 'Admin retrieved', { admin })
  } catch (err) {
    console.error('Error fetching admin:', err)
    return sendError(res, 'Failed to fetch admin.', 500)
  }
}

/**
 * POST /api/admins
 * Create new admin
 */
export const createAdmin = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, role, status } = req.body

    // Validate required fields
    if (!name || !name.trim()) {
      return sendError(res, 'Admin name is required.', 400)
    }

    if (!email || !email.trim()) {
      return sendError(res, 'Admin email is required.', 400)
    }

    if (!password || password.length < 6) {
      return sendError(res, 'Password must be at least 6 characters.', 400)
    }

    if (password !== confirmPassword) {
      return sendError(res, 'Passwords do not match.', 400)
    }

    // Normalize email
    const normalizedEmail = email.trim().toLowerCase()

    // Check for duplicate email
    const existing = await Admin.findOne({ email: normalizedEmail })
    if (existing) {
      return sendError(res, 'An admin with this email already exists.', 400)
    }

    // Validate role
    const validRoles = ['Super Admin', 'Admin']
    const adminRole = role && validRoles.includes(role) ? role : 'Admin'

    // Validate status
    const adminStatus = status && ['active', 'inactive'].includes(status) ? status : 'active'

    // Create new admin
    const admin = new Admin({
      name: name.trim(),
      email: normalizedEmail,
      password, // Will be hashed by pre-save middleware
      role: adminRole,
      status: adminStatus,
    })

    await admin.save()

    // Return without password
    const adminData = admin.toJSON()

    // Log activity
    logActivity({
      req,
      user: req.user,
      action: 'ADMIN_CREATE',
      module: 'ADMINS',
      description: `New admin ${name} created`,
      entityId: admin._id,
      entityType: 'Admin',
      metadata: {
        adminName: name,
        adminEmail: normalizedEmail,
        adminRole: adminRole,
      },
    })

    return sendSuccess(res, 'Admin created successfully.', { admin: adminData }, 201)
  } catch (err) {
    console.error('Error creating admin:', err)
    return sendError(res, 'Failed to create admin.', 500)
  }
}

/**
 * PUT /api/admins/:id
 * Update admin details (name, email, role, status)
 */
export const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params
    const { name, email, role, status } = req.body

    const admin = await Admin.findById(id)
    if (!admin) {
      return sendError(res, 'Admin not found.', 404)
    }

    // Update name
    if (name && name.trim()) {
      admin.name = name.trim()
    }

    // Update email (check for duplicates)
    if (email && email.trim()) {
      const normalizedEmail = email.trim().toLowerCase()
      if (normalizedEmail !== admin.email) {
        const existing = await Admin.findOne({ email: normalizedEmail })
        if (existing) {
          return sendError(res, 'An admin with this email already exists.', 400)
        }
        admin.email = normalizedEmail
      }
    }

    // Update role
    if (role) {
      const validRoles = ['Super Admin', 'Admin']
      if (validRoles.includes(role)) {
        admin.role = role
      } else {
        return sendError(res, 'Invalid role.', 400)
      }
    }

    // Update status
    if (status) {
      if (['active', 'inactive'].includes(status)) {
        admin.status = status
      } else {
        return sendError(res, 'Invalid status.', 400)
      }
    }

    await admin.save()
    const adminData = admin.toJSON()

    // Log activity
    logActivity({
      req,
      user: req.user,
      action: 'ADMIN_UPDATE',
      module: 'ADMINS',
      description: `Admin ${admin.name} updated`,
      entityId: admin._id,
      entityType: 'Admin',
      metadata: {
        adminName: admin.name,
        adminEmail: admin.email,
      },
    })

    return sendSuccess(res, 'Admin updated successfully.', { admin: adminData })
  } catch (err) {
    console.error('Error updating admin:', err)
    return sendError(res, 'Failed to update admin.', 500)
  }
}

/**
 * PATCH /api/admins/:id/status
 * Update admin status (active/inactive)
 */
export const updateAdminStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body
    const currentUserId = req.user?.id

    if (!status || !['active', 'inactive'].includes(status)) {
      return sendError(res, 'Invalid status. Must be "active" or "inactive".', 400)
    }

    const admin = await Admin.findById(id)
    if (!admin) {
      return sendError(res, 'Admin not found.', 404)
    }

    // Prevent deactivating the only active Super Admin
    if (status === 'inactive' && admin.role === 'Super Admin') {
      const activeSuperAdmins = await Admin.countDocuments({
        role: 'Super Admin',
        status: 'active',
      })
      if (activeSuperAdmins <= 1) {
        return sendError(
          res,
          'Cannot deactivate the last active Super Admin.',
          400
        )
      }
    }

    // Prevent self-deactivation
    if (status === 'inactive' && admin._id.toString() === currentUserId) {
      return sendError(res, 'You cannot deactivate your own account.', 400)
    }

    admin.status = status
    await admin.save()
    const adminData = admin.toJSON()

    // Log activity
    logActivity({
      req,
      user: req.user,
      action: 'ADMIN_STATUS_CHANGE',
      module: 'ADMINS',
      description: `Admin ${admin.name} status changed to ${status}`,
      entityId: admin._id,
      entityType: 'Admin',
      metadata: {
        adminName: admin.name,
        newStatus: status,
      },
    })

    return sendSuccess(res, 'Admin status updated successfully.', {
      admin: adminData,
    })
  } catch (err) {
    console.error('Error updating admin status:', err)
    return sendError(res, 'Failed to update admin status.', 500)
  }
}

/**
 * PATCH /api/admins/:id/password
 * Change admin password
 */
export const changeAdminPassword = async (req, res) => {
  try {
    const { id } = req.params
    const { newPassword, confirmPassword } = req.body
    const currentUserId = req.user?.id

    if (!newPassword || newPassword.length < 6) {
      return sendError(res, 'Password must be at least 6 characters.', 400)
    }

    if (newPassword !== confirmPassword) {
      return sendError(res, 'Passwords do not match.', 400)
    }

    const admin = await Admin.findById(id)
    if (!admin) {
      return sendError(res, 'Admin not found.', 404)
    }

    // Only allow users to change their own password or Super Admin to change others
    const isSuperAdmin = req.user?.role === 'Super Admin'
    const isOwnPassword = admin._id.toString() === currentUserId

    if (!isOwnPassword && !isSuperAdmin) {
      return sendError(res, 'You can only change your own password.', 403)
    }

    // Hash and update password
    const salt = await bcrypt.genSalt(10)
    admin.password = await bcrypt.hash(newPassword, salt)
    await admin.save()

    const adminData = admin.toJSON()

    // Log activity (NEVER log the actual password)
    logActivity({
      req,
      user: req.user,
      action: 'PASSWORD_CHANGE',
      module: 'ADMINS',
      description: `Admin password changed`,
      entityId: admin._id,
      entityType: 'Admin',
      metadata: {
        adminName: admin.name,
        adminEmail: admin.email,
      },
    })

    return sendSuccess(res, 'Password changed successfully.', {
      admin: adminData,
    })
  } catch (err) {
    console.error('Error changing password:', err)
    return sendError(res, 'Failed to change password.', 500)
  }
}

/**
 * DELETE /api/admins/:id
 * Soft delete admin (deactivate)
 */
export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params
    const currentUserId = req.user?.id

    const admin = await Admin.findById(id)
    if (!admin) {
      return sendError(res, 'Admin not found.', 404)
    }

    // Prevent self-deletion
    if (admin._id.toString() === currentUserId) {
      return sendError(res, 'You cannot delete your own account.', 400)
    }

    // Prevent deleting the only active Super Admin
    if (admin.role === 'Super Admin' && admin.status === 'active') {
      const activeSuperAdmins = await Admin.countDocuments({
        role: 'Super Admin',
        status: 'active',
      })
      if (activeSuperAdmins <= 1) {
        return sendError(res, 'Cannot delete the last active Super Admin.', 400)
      }
    }

    // Soft delete (deactivate)
    admin.status = 'inactive'
    await admin.save()
    const adminData = admin.toJSON()

    // Log activity
    logActivity({
      req,
      user: req.user,
      action: 'ADMIN_DEACTIVATE',
      module: 'ADMINS',
      description: `Admin ${admin.name} deactivated`,
      entityId: admin._id,
      entityType: 'Admin',
      metadata: {
        adminName: admin.name,
        adminEmail: admin.email,
      },
    })

    return sendSuccess(res, 'Admin deleted successfully.', { admin: adminData })
  } catch (err) {
    console.error('Error deleting admin:', err)
    return sendError(res, 'Failed to delete admin.', 500)
  }
}
