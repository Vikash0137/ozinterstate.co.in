import express from 'express'
import { getPublicSiteSettings, getSiteSettings, updateSiteSettings } from '../controllers/siteSettingsController.js'
import { verifyAdmin } from '../middleware/auth.js'

const router = express.Router()

router.get('/public', getPublicSiteSettings)
router.get('/', verifyAdmin, getSiteSettings)
router.put('/', verifyAdmin, updateSiteSettings)

export default router
