import apiClient from './apiClient.js'

const base = '/process-steps'

const getProcessSteps = () => apiClient.get(base)
const createProcessStep = (data) => apiClient.post(base, data)
const updateProcessStep = (id, data) => apiClient.put(`${base}/${id}`, data)
const deleteProcessStep = (id) => apiClient.delete(`${base}/${id}`)

export default {
  getProcessSteps,
  createProcessStep,
  updateProcessStep,
  deleteProcessStep,
}
