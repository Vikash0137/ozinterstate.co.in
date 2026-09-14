import express from 'express'
import { getPublicGallery, getGallery, getGalleryById, createGalleryImage, updateGalleryImage, deleteGalleryImage } from '../controllers/galleryController.js'
import { verifyAdmin } from '../middleware/auth.js'

const router = express.Router()

router.get('/public', getPublicGallery)
router.get('/', verifyAdmin, getGallery)
router.get('/:id', verifyAdmin, getGalleryById)
router.post('/', verifyAdmin, createGalleryImage)
router.put('/:id', verifyAdmin, updateGalleryImage)
router.delete('/:id', verifyAdmin, deleteGalleryImage)

export default router
