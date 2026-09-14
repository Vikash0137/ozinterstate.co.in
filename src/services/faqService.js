import apiClient from './apiClient.js'

const base = '/faqs'

const getFAQs = () => apiClient.get(base)
const getFAQById = (id) => apiClient.get(`${base}/${id}`)
const createFAQ = (data) => apiClient.post(base, data)
const updateFAQ = (id, data) => apiClient.put(`${base}/${id}`, data)
const deleteFAQ = (id) => apiClient.delete(`${base}/${id}`)

export default {
  getFAQs,
  getFAQById,
  createFAQ,
  updateFAQ,
  deleteFAQ,
}
