import apiClient from './apiClient.js'

const base = '/trust-badges'

const getTrustBadges = () => apiClient.get(base)
const createTrustBadge = (data) => apiClient.post(base, data)
const updateTrustBadge = (id, data) => apiClient.put(`${base}/${id}`, data)
const deleteTrustBadge = (id) => apiClient.delete(`${base}/${id}`)

export default {
  getTrustBadges,
  createTrustBadge,
  updateTrustBadge,
  deleteTrustBadge,
}
