import apiClient from './apiClient.js'

const base = '/gallery'

const getGallery = () => apiClient.get(base)
const getGalleryById = (id) => apiClient.get(`${base}/${id}`)
const createGalleryImage = (data) => apiClient.post(base, data)
const updateGalleryImage = (id, data) => apiClient.put(`${base}/${id}`, data)
const deleteGalleryImage = (id) => apiClient.delete(`${base}/${id}`)

export default {
  getGallery,
  getGalleryById,
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
}
