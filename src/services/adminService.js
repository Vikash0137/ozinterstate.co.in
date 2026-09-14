import apiClient from './apiClient.js'

const getAdmins = (params) => apiClient.get('/admins', { params })
const getAdmin = (id) => apiClient.get(`/admins/${id}`)
const createAdmin = (data) => apiClient.post('/admins', data)
const updateAdmin = (id, data) => apiClient.put(`/admins/${id}`, data)
const updateAdminStatus = (id, status) => apiClient.patch(`/admins/${id}/status`, { status })
const changeAdminPassword = (id, data) => apiClient.patch(`/admins/${id}/password`, data)
const deleteAdmin = (id) => apiClient.delete(`/admins/${id}`)

export default {
  getAdmins,
  getAdmin,
  createAdmin,
  updateAdmin,
  updateAdminStatus,
  changeAdminPassword,
  deleteAdmin,
}
