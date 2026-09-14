import express from 'express'
import { getPublicBlogs, getPublicBlogBySlug, getBlogs, getBlogById, createBlog, updateBlog, deleteBlog } from '../controllers/blogController.js'
import { verifyAdmin } from '../middleware/auth.js'

const router = express.Router()

router.get('/public', getPublicBlogs)
router.get('/public/:slug', getPublicBlogBySlug)
router.get('/', verifyAdmin, getBlogs)
router.get('/:id', verifyAdmin, getBlogById)
router.post('/', verifyAdmin, createBlog)
router.put('/:id', verifyAdmin, updateBlog)
router.delete('/:id', verifyAdmin, deleteBlog)

export default router
