import axios from 'axios'
import { resolveApiBaseUrl } from '../utils/siteSettings'

const API_BASE_URL = resolveApiBaseUrl()

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

const locationService = {
  // Get all public locations directory
  getPublicLocations: async (params = {}) => {
    try {
      const response = await apiClient.get('/locations/public', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching public locations:', error)
      throw error
    }
  },

  // Get single location by slug (with optional ?preview=true)
  getPublicLocation: async (slug, isPreview = false) => {
    try {
      if (!slug) throw new Error('Slug is required')
      const response = await apiClient.get(`/locations/public/${slug}`, {
        params: isPreview ? { preview: 'true' } : {},
      })
      return response.data
    } catch (error) {
      console.error(`Error fetching location ${slug}:`, error)
      throw error
    }
  },

  // Get nearby locations
  getNearbyLocations: async (slug) => {
    try {
      if (!slug) throw new Error('Slug is required')
      const response = await apiClient.get(`/locations/public/${slug}/nearby`)
      return response.data
    } catch (error) {
      console.error(`Error fetching nearby for ${slug}:`, error)
      throw error
    }
  },
}

export default locationService
