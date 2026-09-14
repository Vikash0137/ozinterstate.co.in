import express from 'express'
import { getPublicStats, getStats, createStat, updateStat, deleteStat } from '../controllers/statController.js'
import { verifyAdmin } from '../middleware/auth.js'

const router = express.Router()

router.get('/public', getPublicStats)
router.get('/', verifyAdmin, getStats)
router.post('/', verifyAdmin, createStat)
router.put('/:id', verifyAdmin, updateStat)
router.delete('/:id', verifyAdmin, deleteStat)

export default router
