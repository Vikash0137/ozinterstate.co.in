import apiClient from './apiClient.js'

const base = '/site-settings'

const getSiteSettings = () => apiClient.get(base)
const updateSiteSettings = (data) => apiClient.put(base, data)

export default {
  getSiteSettings,
  updateSiteSettings,
}
