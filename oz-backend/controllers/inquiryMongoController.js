import mongoose from 'mongoose'
import InquiryForm from '../models/InquiryForm.js'
import InquiryField from '../models/InquiryField.js'
import InquiryResponse from '../models/InquiryResponse.js'

const numericOrObjectIdQuery = (id) => {
  const conditions = [{ numeric_id: Number(id) }]
  if (mongoose.Types.ObjectId.isValid(id)) conditions.push({ _id: id })
  return { $or: conditions }
}

const getForm = async () => InquiryForm.findOne({ status: 'active' }).sort({ numeric_id: 1 })
const getFields = (activeOnly = false) => {
  const query = activeOnly ? { status: 'active' } : {}
  return InquiryField.find(query).sort({ sort_order: 1 })
}

export const getPublicForm = async (req, res) => {
  try {
    return res.json({ success: true, data: { form: await getForm(), fields: await getFields(true) } })
  } catch (error) {
    console.error('Error fetching public form:', error)
    return res.status(500).json({ success: false, message: 'Server error fetching form.' })
  }
}

export const submitInquiry = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) return res.status(400).json({ success: false, message: 'Submission data is empty.' })
    const latest = await InquiryResponse.findOne().sort({ numeric_id: -1 }).select('numeric_id')
    const savedResponse = await InquiryResponse.create({ numeric_id: (latest?.numeric_id || 0) + 1, form_id: 1, response_data: req.body, status: 'new' })
    const form = await getForm()
    return res.status(201).json({ success: true, message: form?.success_message || 'Inquiry submitted successfully!', data: savedResponse, redirect_url: form?.redirect_url || '' })
  } catch (error) {
    console.error('Error submitting inquiry:', error)
    return res.status(500).json({ success: false, message: 'Server error submitting inquiry.' })
  }
}

export const getAdminForm = async (req, res) => {
  try {
    return res.json({ success: true, data: { form: await getForm(), fields: await getFields(false) } })
  } catch (error) {
    console.error('Error fetching admin form:', error)
    return res.status(500).json({ success: false, message: 'Server error fetching form schema.' })
  }
}

export const updateFormSettings = async (req, res) => {
  try {
    const form = await getForm()
    if (!form) return res.status(404).json({ success: false, message: 'Inquiry form not found.' })
    const updated = await InquiryForm.findByIdAndUpdate(form._id, { ...req.body, updated_at: new Date() }, { new: true, runValidators: true })
    return res.json({ success: true, message: 'Form settings updated successfully.', data: updated })
  } catch (error) {
    console.error('Error updating form settings:', error)
    return res.status(400).json({ success: false, message: error.message || 'Failed to update form settings.' })
  }
}

export const saveFormFields = async (req, res) => {
  try {
    if (!Array.isArray(req.body.fields)) return res.status(400).json({ success: false, message: 'Fields must be an array.' })
    const latest = await InquiryField.findOne().sort({ numeric_id: -1 }).select('numeric_id')
    const usedIds = []
    const savedFields = []
    for (const [index, field] of req.body.fields.entries()) {
      const numericId = Number.isFinite(Number(field.id)) ? Number(field.id) : (latest?.numeric_id || 0) + savedFields.length + 1
      const payload = {
        numeric_id: numericId,
        form_id: 1,
        label: field.label || '',
        placeholder: field.placeholder || '',
        field_name: field.field_name || `field_${numericId}`,
        field_type: field.field_type || 'text',
        required: field.required ? 1 : 0,
        read_only: field.read_only ? 1 : 0,
        width: field.width || '100%',
        icon: field.icon || 'FileText',
        help_text: field.help_text || '',
        default_value: field.default_value || '',
        validation: field.validation || '',
        error_message: field.error_message || '',
        css_class: field.css_class || '',
        options: Array.isArray(field.options) ? field.options : typeof field.options === 'string' ? field.options.split('\n').map((item) => item.trim()).filter(Boolean) : [],
        sort_order: index + 1,
        status: field.status || 'active',
        updated_at: new Date(),
      }
      const saved = await InquiryField.findOneAndUpdate({ numeric_id: numericId }, payload, { new: true, upsert: true, runValidators: true })
      usedIds.push(saved._id)
      savedFields.push(saved)
    }
    await InquiryField.deleteMany({ _id: { $nin: usedIds } })
    return res.json({ success: true, message: 'Form fields saved successfully.', data: savedFields })
  } catch (error) {
    console.error('Error saving form fields:', error)
    return res.status(400).json({ success: false, message: error.message || 'Failed to save form fields.' })
  }
}

export const getAllResponses = async (req, res) => {
  try {
    const { search = '', status = '', sortBy = 'created_at', sortOrder = 'desc', page = 1, limit = 10 } = req.query
    const query = {}
    if (status && status !== 'all') query.status = status
    if (search.trim()) query['response_data'] = { $regex: search.trim(), $options: 'i' }
    const pageNumber = parseInt(page, 10)
    const pageLimit = parseInt(limit, 10)
    const [responses, total] = await Promise.all([
      InquiryResponse.find(query).sort({ [sortBy]: sortOrder.toLowerCase() === 'asc' ? 1 : -1 }).skip((pageNumber - 1) * pageLimit).limit(pageLimit),
      InquiryResponse.countDocuments(query),
    ])
    return res.json({ success: true, data: responses, pagination: { total, page: pageNumber, limit: pageLimit, totalPages: Math.ceil(total / pageLimit) || 1 } })
  } catch (error) {
    console.error('Error fetching responses:', error)
    return res.status(500).json({ success: false, message: 'Server error fetching inquiries.' })
  }
}

export const updateResponseStatus = async (req, res) => {
  try {
    const updated = await InquiryResponse.findOneAndUpdate(numericOrObjectIdQuery(req.params.id), { status: req.body.status }, { new: true, runValidators: true })
    if (!updated) return res.status(404).json({ success: false, message: 'Inquiry not found.' })
    return res.json({ success: true, message: `Inquiry status updated to ${req.body.status}.`, data: updated })
  } catch (error) {
    console.error('Error updating status:', error)
    return res.status(400).json({ success: false, message: error.message || 'Failed to update status.' })
  }
}

export const deleteResponse = async (req, res) => {
  try {
    const deleted = await InquiryResponse.findOneAndDelete(numericOrObjectIdQuery(req.params.id))
    if (!deleted) return res.status(404).json({ success: false, message: 'Inquiry not found.' })
    return res.json({ success: true, message: 'Inquiry deleted successfully.' })
  } catch (error) {
    console.error('Error deleting inquiry:', error)
    return res.status(400).json({ success: false, message: error.message || 'Failed to delete inquiry.' })
  }
}

export const bulkDeleteResponses = async (req, res) => {
  try {
    if (!Array.isArray(req.body.ids) || req.body.ids.length === 0) return res.status(400).json({ success: false, message: 'Invalid or empty IDs array.' })
    const ids = req.body.ids.map((id) => numericOrObjectIdQuery(id))
    await InquiryResponse.deleteMany({ $or: ids.map((query) => query.$or).flat() })
    return res.json({ success: true, message: `${req.body.ids.length} inquiries deleted successfully.` })
  } catch (error) {
    console.error('Error bulk deleting inquiries:', error)
    return res.status(400).json({ success: false, message: error.message || 'Failed to bulk delete inquiries.' })
  }
}

export const exportResponsesCsv = async (req, res) => {
  try {
    const responses = await InquiryResponse.find().sort({ created_at: -1 }).limit(10000)
    let csvContent = 'ID,Status,Submitted At,Data\n'
    responses.forEach((response) => {
      const data = JSON.stringify(response.response_data || {}).replace(/"/g, '""')
      csvContent += `${response.id},"${response.status}","${response.created_at}","${data}"\n`
    })
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', 'attachment; filename="inquiries-export.csv"')
    return res.status(200).send(csvContent)
  } catch (error) {
    console.error('Error exporting CSV:', error)
    return res.status(500).json({ success: false, message: 'Failed to export CSV.' })
  }
}
