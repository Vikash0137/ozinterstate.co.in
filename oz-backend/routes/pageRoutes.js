import express from 'express'
import { getPublicPageBySlug, getPages, getPageById, createPage, updatePage, deletePage } from '../controllers/pageController.js'
import { verifyAdmin } from '../middleware/auth.js'

const router = express.Router()

router.get('/public/:slug', getPublicPageBySlug)
router.get('/', verifyAdmin, getPages)
router.get('/:id', verifyAdmin, getPageById)
router.post('/', verifyAdmin, createPage)
router.put('/:id', verifyAdmin, updatePage)
router.delete('/:id', verifyAdmin, deletePage)

export default router
