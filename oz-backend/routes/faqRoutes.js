import express from 'express'
import { getPublicFAQs, getFAQs, getFAQById, createFAQ, updateFAQ, deleteFAQ } from '../controllers/faqController.js'
import { verifyAdmin } from '../middleware/auth.js'

const router = express.Router()

router.get('/public', getPublicFAQs)
router.get('/', verifyAdmin, getFAQs)
router.get('/:id', verifyAdmin, getFAQById)
router.post('/', verifyAdmin, createFAQ)
router.put('/:id', verifyAdmin, updateFAQ)
router.delete('/:id', verifyAdmin, deleteFAQ)

export default router
