import express from 'express'
import {
  getActiveBanner,
  getAllBanners,
  getBannerById,
  createBanner,
  updateBanner,
  toggleBannerStatus,
  deleteBanner,
} from '../controllers/bannerMongoController.js'
import { verifyAdmin } from '../middleware/auth.js'
import { uploadBannerMedia } from '../middleware/upload.js'

const router = express.Router()

const mediaUploadFields = uploadBannerMedia.fields([
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 },
  { name: 'video_thumbnail', maxCount: 1 },
])

// Public route for Frontend Hero Section
router.get('/active', getActiveBanner)

// Admin protected routes
router.get('/', verifyAdmin, getAllBanners)
router.get('/:id', verifyAdmin, getBannerById)
router.post('/', verifyAdmin, mediaUploadFields, createBanner)
router.put('/:id', verifyAdmin, mediaUploadFields, updateBanner)
router.patch('/:id/status', verifyAdmin, toggleBannerStatus)
router.delete('/:id', verifyAdmin, deleteBanner)

export default router
