import express from 'express'
import { getPublicWhyChooseItems, getWhyChooseItems, createWhyChooseItem, updateWhyChooseItem, deleteWhyChooseItem } from '../controllers/whyChooseController.js'
import { verifyAdmin } from '../middleware/auth.js'

const router = express.Router()

router.get('/public', getPublicWhyChooseItems)
router.get('/', verifyAdmin, getWhyChooseItems)
router.post('/', verifyAdmin, createWhyChooseItem)
router.put('/:id', verifyAdmin, updateWhyChooseItem)
router.delete('/:id', verifyAdmin, deleteWhyChooseItem)

export default router
