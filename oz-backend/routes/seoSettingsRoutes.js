import express from 'express'
import { getPublicSeoSettings, getSeoSettings, updateSeoSettings } from '../controllers/seoSettingsController.js'
import { verifyAdmin } from '../middleware/auth.js'

const router = express.Router()

router.get('/public', getPublicSeoSettings)
router.get('/', verifyAdmin, getSeoSettings)
router.put('/', verifyAdmin, updateSeoSettings)

export default router
