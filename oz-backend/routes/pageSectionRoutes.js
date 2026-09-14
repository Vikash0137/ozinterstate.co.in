import express from 'express'
import { getPageSections, getPageSectionById, createPageSection, updatePageSection, deletePageSection, updatePageSectionsOrder } from '../controllers/pageSectionController.js'
import { verifyAdmin } from '../middleware/auth.js'

const router = express.Router()

router.get('/page/:pageId', verifyAdmin, getPageSections)
router.get('/:id', verifyAdmin, getPageSectionById)
router.post('/', verifyAdmin, createPageSection)
router.put('/reorder', verifyAdmin, updatePageSectionsOrder)
router.put('/:id', verifyAdmin, updatePageSection)
router.delete('/:id', verifyAdmin, deletePageSection)

export default router
