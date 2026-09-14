import apiClient from './apiClient.js'

const base = '/stats'

const getStats = () => apiClient.get(base)
const createStat = (data) => apiClient.post(base, data)
const updateStat = (id, data) => apiClient.put(`${base}/${id}`, data)
const deleteStat = (id) => apiClient.delete(`${base}/${id}`)

export default {
  getStats,
  createStat,
  updateStat,
  deleteStat,
}
