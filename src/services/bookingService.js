import apiClient from './apiClient'

const getBookings = (params) => apiClient.get('/bookings', { params })
const getBooking = (id) => apiClient.get(`/bookings/${id}`)
const createBooking = (data) => apiClient.post('/bookings', data)
const updateBooking = (id, data) => apiClient.put(`/bookings/${id}`, data)
const updateBookingStatus = (id, status) => apiClient.patch(`/bookings/${id}/status`, { status })
const assignBooking = (id, adminId) => apiClient.patch(`/bookings/${id}/assign`, { adminId })
const deleteBooking = (id) => apiClient.delete(`/bookings/${id}`)
const createBookingFromQuote = (quoteId) => apiClient.post(`/bookings/from-quote/${quoteId}`)
const getCustomerBookings = (customerId, params) => apiClient.get(`/customers/${customerId}/bookings`, { params })

export default {
  getBookings,
  getBooking,
  createBooking,
  updateBooking,
  updateBookingStatus,
  assignBooking,
  deleteBooking,
  createBookingFromQuote,
  getCustomerBookings,
}
