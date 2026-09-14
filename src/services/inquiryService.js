import apiClient from './apiClient'

const API_RESOURCE = '/inquiries'

export const inquiryService = {
  // Public
  getPublicForm: async () => {
    const response = await apiClient.get(`${API_RESOURCE}/form`)
    return response.data
  },

  submitInquiry: async (data) => {
    const response = await apiClient.post(`${API_RESOURCE}/submit`, data)
    return response.data
  },

  // Admin
  getAdminForm: async () => {
    const response = await apiClient.get(`${API_RESOURCE}/admin/form`)
    return response.data
  },

  updateFormSettings: async (settings) => {
    const response = await apiClient.put(`${API_RESOURCE}/admin/settings`, settings)
    return response.data
  },

  saveFormFields: async (fields) => {
    const response = await apiClient.put(`${API_RESOURCE}/admin/fields`, { fields })
    return response.data
  },

  getAllResponses: async (params = {}) => {
    const response = await apiClient.get(`${API_RESOURCE}/admin/responses`, { params })
    return response.data
  },

  updateResponseStatus: async (id, status) => {
    const response = await apiClient.patch(`${API_RESOURCE}/admin/responses/${id}/status`, { status })
    return response.data
  },

  deleteResponse: async (id) => {
    const response = await apiClient.delete(`${API_RESOURCE}/admin/responses/${id}`)
    return response.data
  },

  bulkDeleteResponses: async (ids) => {
    const response = await apiClient.post(`${API_RESOURCE}/admin/responses/bulk-delete`, { ids })
    return response.data
  },

  getExportCsvUrl: () => {
    const token = localStorage.getItem('ozAdminToken')
    return `${import.meta.env.VITE_API_BASE_URL || '/ozinterstate/api'}${API_RESOURCE}/admin/export/csv?token=${token}`
  },
}

export default inquiryService
