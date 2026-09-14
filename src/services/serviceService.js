import apiClient from './apiClient.js'

const base = '/services'

const getServices = () => apiClient.get(base)
const getServiceById = (id) => apiClient.get(`${base}/${id}`)
const createService = (data) => apiClient.post(base, data)
const updateService = (id, data) => apiClient.put(`${base}/${id}`, data)
const deleteService = (id) => apiClient.delete(`${base}/${id}`)

export default {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
}
