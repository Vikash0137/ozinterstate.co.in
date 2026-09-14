import express from 'express'
import {
  listAdmins,
  getAdmin,
  createAdmin,
  updateAdmin,
  updateAdminStatus,
  changeAdminPassword,
  deleteAdmin,
} from '../controllers/adminController.js'
import { verifyAdmin } from '../middleware/auth.js'

const router = express.Router()

// All admin routes protected by verifyAdmin
router.use(verifyAdmin)

// LIST: Get all admins with pagination, search, filters
router.get('/', listAdmins)

// GET: Get single admin
router.get('/:id', getAdmin)

// CREATE: Create new admin (Super Admin only)
router.post('/', createAdmin)

// UPDATE: Update admin details
router.put('/:id', updateAdmin)

// STATUS: Update admin status
router.patch('/:id/status', updateAdminStatus)

// PASSWORD: Change admin password
router.patch('/:id/password', changeAdminPassword)

// DELETE: Soft delete (deactivate) admin
router.delete('/:id', deleteAdmin)

export default router
