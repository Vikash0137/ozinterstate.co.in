import apiClient from './apiClient'

const base = '/customers'

const getCustomers = (params) => apiClient.get(base, { params })
const getCustomer = (id) => apiClient.get(`${base}/${id}`)
const createCustomer = (data) => apiClient.post(base, data)
const updateCustomer = (id, data) => apiClient.put(`${base}/${id}`, data)
const updateCustomerStatus = (id, status) => apiClient.patch(`${base}/${id}/status`, { status })
const deleteCustomer = (id) => apiClient.delete(`${base}/${id}`)
const searchCustomers = (q, limit = 10) => apiClient.get(`${base}/search`, { params: { q, limit } })

export default {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  updateCustomerStatus,
  deleteCustomer,
  searchCustomers,
}
