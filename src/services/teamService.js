import apiClient from './apiClient.js'

const base = '/team'

const getTeamMembers = () => apiClient.get(base)
const getTeamMemberById = (id) => apiClient.get(`${base}/${id}`)
const createTeamMember = (data) => apiClient.post(base, data)
const updateTeamMember = (id, data) => apiClient.put(`${base}/${id}`, data)
const deleteTeamMember = (id) => apiClient.delete(`${base}/${id}`)

export default {
  getTeamMembers,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
}
