import express from 'express'
import { verifyAdmin } from '../middleware/auth.js'
import {
  listNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} from '../controllers/notificationController.js'

const router = express.Router()

// All routes protected by verifyAdmin
router.use(verifyAdmin)

// GET /api/notifications
router.get('/', listNotifications)

// GET /api/notifications/unread-count
router.get('/unread-count', getUnreadCount)

// PATCH /api/notifications/:id/read
router.patch('/:id/read', markAsRead)

// PATCH /api/notifications/read-all
router.patch('/read-all', markAllAsRead)

export default router
