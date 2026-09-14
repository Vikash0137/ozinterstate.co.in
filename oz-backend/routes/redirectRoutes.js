import express from 'express'
import {
  getRedirects,
  createRedirect,
  toggleRedirectActive,
  deleteRedirect,
} from '../controllers/redirectController.js'
import { verifyAdmin } from '../middleware/auth.js'

const router = express.Router()

router.get('/', verifyAdmin, getRedirects)
router.post('/', verifyAdmin, createRedirect)
router.patch('/:id/toggle', verifyAdmin, toggleRedirectActive)
router.delete('/:id', verifyAdmin, deleteRedirect)

export default router
