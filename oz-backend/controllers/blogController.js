import Blog from '../models/Blog.js'
import mongoose from 'mongoose'
import { sendSuccess, sendError } from '../utils/response.js'
import { logActivity } from '../utils/activityLogger.js'

export const getPublicBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ status: 'published', isDeleted: false })
      .sort({ publishedAt: -1, createdAt: -1 })
    return sendSuccess(res, 'Blogs retrieved successfully', blogs)
  } catch (error) {
    return sendError(res, 'Failed to fetch blogs', 500)
  }
}

export const getPublicBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, status: 'published', isDeleted: false })
    if (!blog) return sendError(res, 'Blog not found', 404)
    return sendSuccess(res, 'Blog retrieved successfully', blog)
  } catch (error) {
    return sendError(res, 'Failed to fetch blog', 500)
  }
}

export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isDeleted: false }).sort({ createdAt: -1 })
    return sendSuccess(res, 'Blogs retrieved successfully', blogs)
  } catch (error) {
    return sendError(res, 'Failed to fetch blogs', 500)
  }
}

export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findOne({ _id: req.params.id, isDeleted: false })
    if (!blog) return sendError(res, 'Blog not found', 404)
    return sendSuccess(res, 'Blog retrieved successfully', blog)
  } catch (error) {
    return sendError(res, 'Failed to fetch blog', 500)
  }
}

export const createBlog = async (req, res) => {
  try {
    const blog = new Blog(req.body)
    if (blog.status === 'published' && !blog.publishedAt) {
      blog.publishedAt = new Date()
    }
    await blog.save()
    logActivity({ req, action: 'CREATE', module: 'CMS_BLOGS', entityId: blog._id, entityType: 'Blog', description: `Created blog post: ${blog.title}` })
    return sendSuccess(res, 'Blog created successfully', blog, 201)
  } catch (error) {
    return sendError(res, error.message || 'Failed to create blog', 400)
  }
}

export const updateBlog = async (req, res) => {
  try {
    const updateData = { ...req.body }
    if (updateData.status === 'published' && !updateData.publishedAt) {
      updateData.publishedAt = new Date()
    }
    const blog = await Blog.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, updateData, { new: true, runValidators: true })
    if (!blog) return sendError(res, 'Blog not found', 404)
    logActivity({ req, action: 'UPDATE', module: 'CMS_BLOGS', entityId: blog._id, entityType: 'Blog', description: `Updated blog post: ${blog.title}` })
    return sendSuccess(res, 'Blog updated successfully', blog)
  } catch (error) {
    return sendError(res, error.message || 'Failed to update blog', 400)
  }
}

export const deleteBlog = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return sendError(res, 'Invalid blog ID.', 400)
    }

    const blog = await Blog.findOneAndDelete({ _id: req.params.id })
    if (!blog) return sendError(res, 'Blog not found', 404)
    logActivity({ req, action: 'DELETE', module: 'CMS_BLOGS', entityId: blog._id, entityType: 'Blog', description: `Deleted blog post: ${blog.title}` })
    return sendSuccess(res, 'Blog deleted successfully')
  } catch (error) {
    console.error('BLOG DELETE ERROR:', error)
    return sendError(res, 'Failed to delete blog', 500)
  }
}
