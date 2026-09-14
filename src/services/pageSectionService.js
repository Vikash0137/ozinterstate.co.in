import apiClient from './apiClient.js'

const base = '/page-sections'

const getPageSections = (pageId) => apiClient.get(`${base}/page/${pageId}`)
const getPageSectionById = (id) => apiClient.get(`${base}/${id}`)
const createPageSection = (data) => apiClient.post(base, data)
const updatePageSection = (id, data) => apiClient.put(`${base}/${id}`, data)
const deletePageSection = (id) => apiClient.delete(`${base}/${id}`)
const updatePageSectionsOrder = (sectionIds) => apiClient.put(`${base}/reorder`, { sectionIds })

export default {
  getPageSections,
  getPageSectionById,
  createPageSection,
  updatePageSection,
  deletePageSection,
  updatePageSectionsOrder,
}
