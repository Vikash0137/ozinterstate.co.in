import express from 'express'
import { getPublicReviews, getReviews, getReviewById, createReview, updateReview, deleteReview } from '../controllers/reviewController.js'
import { verifyAdmin } from '../middleware/auth.js'

const router = express.Router()

router.get('/public', getPublicReviews)
router.get('/', verifyAdmin, getReviews)
router.get('/:id', verifyAdmin, getReviewById)
router.post('/', verifyAdmin, createReview)
router.put('/:id', verifyAdmin, updateReview)
router.delete('/:id', verifyAdmin, deleteReview)

export default router
