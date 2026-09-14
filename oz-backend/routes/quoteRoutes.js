import express from 'express'
import {
  listQuotes,
  getQuote,
  createQuote,
  updateQuote,
  updateQuoteStatus,
  addInternalNote,
  updatePricing,
  convertQuote,
  archiveQuote,
} from '../controllers/quoteController.js'
import { verifyAdmin } from '../middleware/auth.js'

const router = express.Router()

// Public endpoints for website & location pages
router.post('/public', createQuote)
router.post('/', createQuote)

// Admin endpoints (protected)
router.get('/', verifyAdmin, listQuotes)
router.get('/:id', verifyAdmin, getQuote)
router.put('/:id', verifyAdmin, updateQuote)
router.patch('/:id/status', verifyAdmin, updateQuoteStatus)
router.patch('/:id/notes', verifyAdmin, addInternalNote)
router.patch('/:id/pricing', verifyAdmin, updatePricing)
router.post('/:id/convert', verifyAdmin, convertQuote)
router.delete('/:id', verifyAdmin, archiveQuote)

export default router
