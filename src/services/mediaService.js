import apiClient from './apiClient.js'

const base = '/media'

const getMediaLibrary = (params = {}) => apiClient.get(base, { params })
const getMediaById = (id) => apiClient.get(`${base}/${id}`)
const uploadMediaFile = (formData) => apiClient.post(`${base}/upload`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
const updateMediaMetadata = (id, data) => apiClient.put(`${base}/${id}`, data)
const deleteMediaFile = (id) => apiClient.delete(`${base}/${id}`)

export default {
  getMediaLibrary,
  getMediaById,
  uploadMediaFile,
  updateMediaMetadata,
  deleteMediaFile,
}
