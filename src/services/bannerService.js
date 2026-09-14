import apiClient from './apiClient'

const API_RESOURCE = '/banners'

export const bannerService = {
  getAllBanners: async (params = {}) => {
    const response = await apiClient.get(API_RESOURCE, { params })
    return response.data
  },

  getBannerById: async (id) => {
    const response = await apiClient.get(`${API_RESOURCE}/${id}`)
    return response.data
  },

  getActiveBanner: async () => {
    const response = await apiClient.get(`${API_RESOURCE}/active`)
    return response.data
  },

  createBanner: async (bannerData) => {
    let payload = bannerData
    let isFormData = false

    if (bannerData instanceof FormData) {
      isFormData = true
    } else if (
      bannerData.imageFile instanceof File ||
      bannerData.videoFile instanceof File ||
      bannerData.videoThumbnailFile instanceof File
    ) {
      isFormData = true
      payload = new FormData()
      Object.keys(bannerData).forEach((key) => {
        if (key === 'imageFile') {
          payload.append('image', bannerData.imageFile)
        } else if (key === 'videoFile') {
          payload.append('video', bannerData.videoFile)
        } else if (key === 'videoThumbnailFile') {
          payload.append('video_thumbnail', bannerData.videoThumbnailFile)
        } else if (bannerData[key] !== null && bannerData[key] !== undefined) {
          payload.append(key, bannerData[key])
        }
      })
    }

    const response = await apiClient.post(API_RESOURCE, payload, {
      headers: {
        'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
      },
    })
    return response.data
  },

  updateBanner: async (id, bannerData) => {
    let payload = bannerData
    let isFormData = false

    if (bannerData instanceof FormData) {
      isFormData = true
    } else if (
      bannerData.imageFile instanceof File ||
      bannerData.videoFile instanceof File ||
      bannerData.videoThumbnailFile instanceof File
    ) {
      isFormData = true
      payload = new FormData()
      Object.keys(bannerData).forEach((key) => {
        if (key === 'imageFile') {
          payload.append('image', bannerData.imageFile)
        } else if (key === 'videoFile') {
          payload.append('video', bannerData.videoFile)
        } else if (key === 'videoThumbnailFile') {
          payload.append('video_thumbnail', bannerData.videoThumbnailFile)
        } else if (bannerData[key] !== null && bannerData[key] !== undefined) {
          payload.append(key, bannerData[key])
        }
      })
    }

    const response = await apiClient.put(`${API_RESOURCE}/${id}`, payload, {
      headers: {
        'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
      },
    })
    return response.data
  },

  toggleBannerStatus: async (id, status) => {
    const response = await apiClient.patch(`${API_RESOURCE}/${id}/status`, { status })
    return response.data
  },

  deleteBanner: async (id) => {
    const response = await apiClient.delete(`${API_RESOURCE}/${id}`)
    return response.data
  },
}

export default bannerService
