import TeamMember from '../models/TeamMember.js'
import mongoose from 'mongoose'
import { sendSuccess, sendError } from '../utils/response.js'
import { logActivity } from '../utils/activityLogger.js'

export const getPublicTeamMembers = async (req, res) => {
  try {
    const members = await TeamMember.find({ status: 'active', isDeleted: false }).sort({ sortOrder: 1 })
    return sendSuccess(res, 'Team members retrieved successfully', members)
  } catch (error) {
    return sendError(res, 'Failed to fetch team members', 500)
  }
}

export const getTeamMembers = async (req, res) => {
  try {
    const members = await TeamMember.find({ isDeleted: false }).sort({ sortOrder: 1 })
    return sendSuccess(res, 'Team members retrieved successfully', members)
  } catch (error) {
    return sendError(res, 'Failed to fetch team members', 500)
  }
}

export const getTeamMemberById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return sendError(res, 'Invalid team member ID.', 400)
    }

    const member = await TeamMember.findOne({ _id: req.params.id, isDeleted: false })
    if (!member) return sendError(res, 'Team member not found', 404)
    return sendSuccess(res, 'Team member retrieved successfully', member)
  } catch (error) {
    return sendError(res, 'Failed to fetch team member', 500)
  }
}

export const createTeamMember = async (req, res) => {
  try {
    const member = new TeamMember(req.body)
    await member.save()
    logActivity({ req, action: 'CREATE', module: 'CMS_TEAM', entityId: member._id, entityType: 'TeamMember', description: `Created team member: ${member.name}` })
    return sendSuccess(res, 'Team member created successfully', member, 201)
  } catch (error) {
    return sendError(res, error.message || 'Failed to create team member', 400)
  }
}

export const updateTeamMember = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return sendError(res, 'Invalid team member ID.', 400)
    }

    const member = await TeamMember.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, req.body, { new: true, runValidators: true })
    if (!member) return sendError(res, 'Team member not found', 404)
    logActivity({ req, action: 'UPDATE', module: 'CMS_TEAM', entityId: member._id, entityType: 'TeamMember', description: `Updated team member: ${member.name}` })
    return sendSuccess(res, 'Team member updated successfully', member)
  } catch (error) {
    return sendError(res, error.message || 'Failed to update team member', 400)
  }
}

export const deleteTeamMember = async (req, res) => {
  try {
    const member = await TeamMember.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, { isDeleted: true, deletedAt: new Date(), status: 'inactive' }, { new: true })
    if (!member) return sendError(res, 'Team member not found', 404)
    logActivity({ req, action: 'DELETE', module: 'CMS_TEAM', entityId: member._id, entityType: 'TeamMember', description: `Deleted team member: ${member.name}` })
    return sendSuccess(res, 'Team member deleted successfully')
  } catch (error) {
    return sendError(res, 'Failed to delete team member', 500)
  }
}
