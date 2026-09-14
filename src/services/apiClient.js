import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/ozinterstate/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

const getHttpErrorMessage = (error) => {
  const status = error.response?.status
  const serverMessage = typeof error.response?.data?.message === 'string'
    ? error.response.data.message.trim()
    : ''

  if (serverMessage) return serverMessage
  if (status === 400) return 'Invalid request. Please check the entered fields.'
  if (status === 401) return 'Your session has expired. Please sign in again.'
  if (status === 403) return 'You do not have permission to perform this action.'
  if (status === 404) return 'Requested data was not found.'
  if (status === 413) return 'File is too large. Please upload a smaller file.'
  if (status === 422) return 'The submitted data is invalid. Please check the fields.'
  if (status >= 500) return 'Server error. Please try again shortly.'
  if (!error.response) return 'Unable to reach the server. Check your internet connection.'
  return `Request failed with status ${status}.`
}

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('ozAdminToken')
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = getHttpErrorMessage(error)
    error.userMessage = message
    if (!error.response) {
      error.response = { data: { message } }
    } else if (!error.response.data || typeof error.response.data !== 'object') {
      error.response.data = { message }
    } else if (!error.response.data.message) {
      error.response.data.message = message
    }

    const isLoginRequest = error.config?.url?.includes('/auth/login')
    if (error.response?.status === 401 && !isLoginRequest) {
      localStorage.removeItem('ozAdminToken')
      localStorage.removeItem('ozAdminUser')
      if (!window.location.pathname.endsWith('/admin/login')) {
        window.location.href = '/ozinterstate/admin/login'
      }
    }
    return Promise.reject(error)
  }
)

export default apiClient
