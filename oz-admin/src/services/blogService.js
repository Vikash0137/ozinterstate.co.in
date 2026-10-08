import apiClient from './apiClient.js'

const base = '/blogs'

const getBlogs = () => apiClient.get(base)
const getBlogById = (id) => apiClient.get(`${base}/${id}`)
const createBlog = (data) => apiClient.post(base, data)
const updateBlog = (id, data) => apiClient.put(`${base}/${id}`, data)
const deleteBlog = (id) => apiClient.delete(`${base}/${id}`)

export default {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
}
