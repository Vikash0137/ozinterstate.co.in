import express from 'express'
import { verifyAdmin } from '../middleware/auth.js'
import {
  listActivityLogs,
  getActivityLog,
} from '../controllers/activityLogController.js'

const router = express.Router()

// All routes protected by verifyAdmin
router.use(verifyAdmin)

// GET /api/activity-logs
router.get('/', listActivityLogs)

// GET /api/activity-logs/:id
router.get('/:id', getActivityLog)

export default router
