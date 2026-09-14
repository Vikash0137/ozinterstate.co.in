import express from 'express'
import { getPublicTrustBadges, getTrustBadges, createTrustBadge, updateTrustBadge, deleteTrustBadge } from '../controllers/trustBadgeController.js'
import { verifyAdmin } from '../middleware/auth.js'

const router = express.Router()

router.get('/public', getPublicTrustBadges)
router.get('/', verifyAdmin, getTrustBadges)
router.post('/', verifyAdmin, createTrustBadge)
router.put('/:id', verifyAdmin, updateTrustBadge)
router.delete('/:id', verifyAdmin, deleteTrustBadge)

export default router
