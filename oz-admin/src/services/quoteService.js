import apiClient from './apiClient'

const getQuotes = (params) => apiClient.get('/quotes', { params })
const getQuote = (id) => apiClient.get(`/quotes/${id}`)
const createQuote = (data) => apiClient.post('/quotes', data)
const createPublicQuote = (data) => apiClient.post('/quotes/public', data)
const updateQuote = (id, data) => apiClient.put(`/quotes/${id}`, data)
const updateQuoteStatus = (id, status) => apiClient.patch(`/quotes/${id}/status`, { status })
const addQuoteNote = (id, note) => apiClient.patch(`/quotes/${id}/notes`, { note })
const updateQuotePricing = (id, pricing) => apiClient.patch(`/quotes/${id}/pricing`, pricing)
const convertQuote = (id) => apiClient.post(`/quotes/${id}/convert`)
const archiveQuote = (id) => apiClient.delete(`/quotes/${id}`)

export default {
  getQuotes,
  getQuote,
  createQuote,
  createPublicQuote,
  updateQuote,
  updateQuoteStatus,
  addQuoteNote,
  updateQuotePricing,
  convertQuote,
  archiveQuote,
}
