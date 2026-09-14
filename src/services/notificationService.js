import apiClient from './apiClient.js'

/**
 * Get notifications for current user
 */
export const getNotifications = (params) => {
  return apiClient.get('/notifications', { params })
}

/**
 * Get unread notification count
 */
export const getUnreadCount = () => {
  return apiClient.get('/notifications/unread-count')
}

/**
 * Mark notification as read
 */
export const markAsRead = (id) => {
  return apiClient.patch(`/notifications/${id}/read`)
}

/**
 * Mark all notifications as read
 */
export const markAllAsRead = () => {
  return apiClient.patch('/notifications/read-all')
}
