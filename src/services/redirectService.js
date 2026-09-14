import apiClient from './apiClient.js'

const base = '/redirects'

const getRedirects = (params = {}) => apiClient.get(base, { params })
const createRedirect = (data) => apiClient.post(base, data)
const toggleRedirect = (id) => apiClient.patch(`${base}/${id}/toggle`)
const deleteRedirect = (id) => apiClient.delete(`${base}/${id}`)

export default {
  getRedirects,
  createRedirect,
  toggleRedirect,
  deleteRedirect,
}
