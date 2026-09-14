import apiClient from './apiClient.js'

const base = '/why-choose'

const getWhyChooseItems = () => apiClient.get(base)
const createWhyChooseItem = (data) => apiClient.post(base, data)
const updateWhyChooseItem = (id, data) => apiClient.put(`${base}/${id}`, data)
const deleteWhyChooseItem = (id) => apiClient.delete(`${base}/${id}`)

export default {
  getWhyChooseItems,
  createWhyChooseItem,
  updateWhyChooseItem,
  deleteWhyChooseItem,
}
