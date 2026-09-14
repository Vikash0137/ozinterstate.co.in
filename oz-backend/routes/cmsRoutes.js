import express from 'express'
import {
  getCategories,
  createCategory,
  getServices,
  createService,
  getBlogs,
  getGallery,
  getTestimonials,
  getFaqs,
  getAbout,
  updateAbout,
  getSeo,
  getSettings,
  updateSettings,
  getUsers,
} from '../controllers/cmsController.js'
import { verifyAdmin } from '../middleware/auth.js'

const router = express.Router()

router.get('/categories', getCategories)
router.post('/categories', verifyAdmin, createCategory)

router.get('/services', getServices)
router.post('/services', verifyAdmin, createService)

router.get('/blogs', getBlogs)
router.get('/gallery', getGallery)
router.get('/testimonials', getTestimonials)
router.get('/faqs', getFaqs)

router.get('/about', getAbout)
router.put('/about', verifyAdmin, updateAbout)

router.get('/seo', getSeo)

router.get('/settings', getSettings)
router.put('/settings', verifyAdmin, updateSettings)

router.get('/users', verifyAdmin, getUsers)

export default router
