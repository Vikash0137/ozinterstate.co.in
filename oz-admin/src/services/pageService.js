import apiClient from './apiClient.js'

const base = '/pages'

const getPages = () => apiClient.get(base)
const getPageById = (id) => apiClient.get(`${base}/${id}`)
const createPage = (data) => apiClient.post(base, data)
const updatePage = (id, data) => apiClient.put(`${base}/${id}`, data)
const deletePage = (id) => apiClient.delete(`${base}/${id}`)

export default {
  getPages,
  getPageById,
  createPage,
  updatePage,
  deletePage,
}
