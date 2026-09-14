import axios from 'axios'
import { resolveApiBaseUrl } from '../utils/siteSettings'

const API_URL = resolveApiBaseUrl()

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const fetchSiteSettings = () => api.get('/site-settings/public')
export const fetchSeoSettings = () => api.get('/seo-settings/public')
export const fetchPageBySlug = (slug) => api.get(`/pages/public/${slug}`)
export const fetchServices = (params) => api.get('/services/public', { params })
export const fetchServiceBySlug = (slug) => api.get(`/services/public/${slug}`)
export const fetchReviews = (params) => api.get('/reviews/public', { params })
export const fetchFAQs = (params) => api.get('/faqs/public', { params })
export const fetchGallery = (params) => api.get('/gallery/public', { params })
export const fetchBlogs = (params) => api.get('/blogs/public', { params })
export const fetchBlogBySlug = (slug) => api.get(`/blogs/public/${slug}`)
export const fetchTeamMembers = (params) => api.get('/team/public', { params })
export const fetchWhyChooseItems = (params) => api.get('/why-choose/public', { params })
export const fetchStats = (params) => api.get('/stats/public', { params })
export const fetchProcessSteps = (params) => api.get('/process-steps/public', { params })
export const fetchTrustBadges = (params) => api.get('/trust-badges/public', { params })
export const submitInquiry = (data) => api.post('/inquiries/submit', data)
export const fetchActiveBanner = () => api.get('/banners/active')
export const fetchInquiryForm = () => api.get('/inquiries/form')

export default api
