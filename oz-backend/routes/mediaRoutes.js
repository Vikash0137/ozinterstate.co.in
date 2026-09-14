import express from 'express'
import { uploadMediaFile, getMediaLibrary, getMediaById, updateMediaMetadata, deleteMediaFile } from '../controllers/mediaController.js'
import { verifyAdmin } from '../middleware/auth.js'
import { uploadMedia } from '../middleware/upload.js'

const router = express.Router()

router.get('/', verifyAdmin, getMediaLibrary)
router.get('/:id', verifyAdmin, getMediaById)
router.post('/upload', verifyAdmin, uploadMedia.single('file'), uploadMediaFile)
router.put('/:id', verifyAdmin, updateMediaMetadata)
router.delete('/:id', verifyAdmin, deleteMediaFile)

export default router
