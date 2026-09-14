import ProcessStep from '../models/ProcessStep.js'
import { sendSuccess, sendError } from '../utils/response.js'
import { logActivity } from '../utils/activityLogger.js'

export const getPublicProcessSteps = async (req, res) => {
  try {
    const steps = await ProcessStep.find({ status: 'active', isDeleted: false }).sort({ sortOrder: 1 })
    return sendSuccess(res, 'Process steps retrieved successfully', steps)
  } catch (error) {
    return sendError(res, 'Failed to fetch process steps', 500)
  }
}

export const getProcessSteps = async (req, res) => {
  try {
    const steps = await ProcessStep.find({ isDeleted: false }).sort({ sortOrder: 1 })
    return sendSuccess(res, 'Process steps retrieved successfully', steps)
  } catch (error) {
    return sendError(res, 'Failed to fetch process steps', 500)
  }
}

export const createProcessStep = async (req, res) => {
  try {
    const step = new ProcessStep(req.body)
    await step.save()
    logActivity({ req, action: 'CREATE', module: 'CMS_PROCESS_STEPS', entityId: step._id, entityType: 'ProcessStep', description: `Created process step: ${step.title}` })
    return sendSuccess(res, 'Process step created successfully', step, 201)
  } catch (error) {
    return sendError(res, error.message || 'Failed to create process step', 400)
  }
}

export const updateProcessStep = async (req, res) => {
  try {
    const step = await ProcessStep.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, req.body, { new: true, runValidators: true })
    if (!step) return sendError(res, 'Process step not found', 404)
    logActivity({ req, action: 'UPDATE', module: 'CMS_PROCESS_STEPS', entityId: step._id, entityType: 'ProcessStep', description: `Updated process step: ${step.title}` })
    return sendSuccess(res, 'Process step updated successfully', step)
  } catch (error) {
    return sendError(res, error.message || 'Failed to update process step', 400)
  }
}

export const deleteProcessStep = async (req, res) => {
  try {
    const step = await ProcessStep.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, { isDeleted: true, deletedAt: new Date(), status: 'inactive' }, { new: true })
    if (!step) return sendError(res, 'Process step not found', 404)
    logActivity({ req, action: 'DELETE', module: 'CMS_PROCESS_STEPS', entityId: step._id, entityType: 'ProcessStep', description: `Deleted process step: ${step.title}` })
    return sendSuccess(res, 'Process step deleted successfully')
  } catch (error) {
    return sendError(res, 'Failed to delete process step', 500)
  }
}
