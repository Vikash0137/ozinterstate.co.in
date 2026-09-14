import apiClient from './apiClient'

const getDashboardStats = (params) => apiClient.get('/dashboard/stats', { params })
const getRecentQuotes = (limit = 10) => apiClient.get('/dashboard/recent-quotes', { params: { limit } })
const getRecentCustomers = (limit = 10) => apiClient.get('/dashboard/recent-customers', { params: { limit } })
const getMonthlyAnalytics = (months = 12) => apiClient.get('/dashboard/monthly', { params: { months } })
const getCustomerGrowth = (months = 12) => apiClient.get('/dashboard/customer-growth', { params: { months } })
const getTopCustomers = (limit = 10) => apiClient.get('/dashboard/top-customers', { params: { limit } })
const getQuoteValueAnalytics = () => apiClient.get('/dashboard/quote-value')

export default {
  getDashboardStats,
  getRecentQuotes,
  getRecentCustomers,
  getMonthlyAnalytics,
  getCustomerGrowth,
  getTopCustomers,
  getQuoteValueAnalytics,
}
