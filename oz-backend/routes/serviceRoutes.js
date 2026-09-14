import express from 'express'
import { getPublicServices, getPublicServiceBySlug, getServices, getServiceById, createService, updateService, deleteService } from '../controllers/serviceController.js'
import { verifyAdmin } from '../middleware/auth.js'

const router = express.Router()

router.get('/public', getPublicServices)
router.get('/public/:slug', getPublicServiceBySlug)
router.get('/', verifyAdmin, getServices)
router.get('/:id', verifyAdmin, getServiceById)
router.post('/', verifyAdmin, createService)
router.put('/:id', verifyAdmin, updateService)
router.delete('/:id', verifyAdmin, deleteService)

export default router
