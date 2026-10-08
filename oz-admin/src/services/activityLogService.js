import apiClient from './apiClient.js'

/**
 * Get activity logs with filters
 */
export const getActivityLogs = (params) => {
  return apiClient.get('/activity-logs', { params })
}

/**
 * Get single activity log
 */
export const getActivityLog = (id) => {
  return apiClient.get(`/activity-logs/${id}`)
}
