import apiClient from './apiClient.js'

const base = '/locations'

const getLocations = (params = {}) => apiClient.get(base, { params })
const getLocationById = (id) => apiClient.get(`${base}/${id}`)
const createLocation = (data) => apiClient.post(base, data)
const updateLocation = (id, data) => apiClient.put(`${base}/${id}`, data)
const duplicateLocation = (id) => apiClient.post(`${base}/${id}/duplicate`)
const toggleLocationStatus = (id, status) => apiClient.patch(`${base}/${id}/status`, { status })
const deleteLocation = (id) => apiClient.delete(`${base}/${id}`)

// Bulk Actions
const bulkPublish = (ids) => apiClient.post(`${base}/admin/bulk-publish`, { ids })
const bulkUnpublish = (ids) => apiClient.post(`${base}/admin/bulk-unpublish`, { ids })
const bulkDelete = (ids) => apiClient.post(`${base}/admin/bulk-delete`, { ids })

// SEO Health & Revisions
const getSeoHealth = (id) => apiClient.get(`${base}/${id}/seo-health`)
const getLocationRevisions = (id) => apiClient.get(`${base}/${id}/revisions`)
const restoreLocationRevision = (id, version) => apiClient.post(`${base}/${id}/revisions/${version}/restore`)

// Analytics
const getLocationsAnalytics = () => apiClient.get(`${base}/admin/analytics`)

export default {
  getLocations,
  getLocationById,
  createLocation,
  updateLocation,
  duplicateLocation,
  toggleLocationStatus,
  deleteLocation,
  bulkPublish,
  bulkUnpublish,
  bulkDelete,
  getSeoHealth,
  getLocationRevisions,
  restoreLocationRevision,
  getLocationsAnalytics,
}
