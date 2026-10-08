import apiClient from './apiClient.js'

const base = '/seo-settings'

const getSeoSettings = () => apiClient.get(base)
const updateSeoSettings = (data) => apiClient.put(base, data)

export default {
  getSeoSettings,
  updateSeoSettings,
}
