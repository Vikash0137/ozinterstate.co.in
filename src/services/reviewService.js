import apiClient from './apiClient.js'

const base = '/reviews'

const getReviews = () => apiClient.get(base)
const getReviewById = (id) => apiClient.get(`${base}/${id}`)
const createReview = (data) => apiClient.post(base, data)
const updateReview = (id, data) => apiClient.put(`${base}/${id}`, data)
const deleteReview = (id) => apiClient.delete(`${base}/${id}`)

export default {
  getReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
}
