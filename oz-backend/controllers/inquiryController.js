import db from '../db.js'

// GET /api/inquiries/form - Public API for Frontend Hero Form
export const getPublicForm = (req, res) => {
  try {
    const data = db.getPublicInquiryForm()
    res.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error('Error fetching public form:', error)
    res.status(500).json({ success: false, message: 'Server error fetching form.' })
  }
}

// POST /api/inquiries/submit - Public API for Frontend Form Submission
export const submitInquiry = (req, res) => {
  try {
    const formData = req.body
    if (!formData || Object.keys(formData).length === 0) {
      return res.status(400).json({ success: false, message: 'Submission data is empty.' })
    }

    const savedResponse = db.submitInquiryResponse(formData)
    const formSettings = db.getPublicInquiryForm().form

    res.status(201).json({
      success: true,
      message: formSettings?.success_message || 'Inquiry submitted successfully!',
      data: savedResponse,
      redirect_url: formSettings?.redirect_url || '',
    })
  } catch (error) {
    console.error('Error submitting inquiry:', error)
    res.status(500).json({ success: false, message: 'Server error submitting inquiry.' })
  }
}

// GET /api/inquiries/admin/form - Admin Form & Fields Schema
export const getAdminForm = (req, res) => {
  try {
    const data = db.getAdminInquiryForm()
    res.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error('Error fetching admin form:', error)
    res.status(500).json({ success: false, message: 'Server error fetching form schema.' })
  }
}

// PUT /api/inquiries/admin/settings - Update Form Settings
export const updateFormSettings = (req, res) => {
  try {
    const settings = req.body
    const updatedForm = db.updateInquiryFormSettings(settings)

    res.json({
      success: true,
      message: 'Form settings updated successfully.',
      data: updatedForm,
    })
  } catch (error) {
    console.error('Error updating form settings:', error)
    res.status(500).json({ success: false, message: 'Failed to update form settings.' })
  }
}

// PUT /api/inquiries/admin/fields - Save / Reorder Fields Batch
export const saveFormFields = (req, res) => {
  try {
    const { fields } = req.body
    if (!Array.isArray(fields)) {
      return res.status(400).json({ success: false, message: 'Fields must be an array.' })
    }

    const updatedFields = db.saveInquiryFieldsBatch(fields)

    res.json({
      success: true,
      message: 'Form fields saved successfully.',
      data: updatedFields,
    })
  } catch (error) {
    console.error('Error saving form fields:', error)
    res.status(500).json({ success: false, message: 'Failed to save form fields.' })
  }
}

// GET /api/inquiries/admin/responses - Admin List Submissions
export const getAllResponses = (req, res) => {
  try {
    const { search = '', status = '', sortBy = 'created_at', sortOrder = 'desc', page = 1, limit = 10 } = req.query

    const result = db.getAllInquiryResponses({ search, status, sortBy, sortOrder, page, limit })

    res.json({
      success: true,
      data: result.responses,
      pagination: {
        total: result.total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: result.totalPages,
      },
    })
  } catch (error) {
    console.error('Error fetching responses:', error)
    res.status(500).json({ success: false, message: 'Server error fetching inquiries.' })
  }
}

// PATCH /api/inquiries/admin/responses/:id/status
export const updateResponseStatus = (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const updated = db.updateInquiryResponseStatus(id, status)
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Inquiry not found.' })
    }

    res.json({
      success: true,
      message: `Inquiry status updated to ${status}.`,
      data: updated,
    })
  } catch (error) {
    console.error('Error updating status:', error)
    res.status(500).json({ success: false, message: 'Failed to update status.' })
  }
}

// DELETE /api/inquiries/admin/responses/:id
export const deleteResponse = (req, res) => {
  try {
    const { id } = req.params
    const deleted = db.deleteInquiryResponse(id)

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Inquiry not found.' })
    }

    res.json({
      success: true,
      message: 'Inquiry deleted successfully.',
    })
  } catch (error) {
    console.error('Error deleting inquiry:', error)
    res.status(500).json({ success: false, message: 'Failed to delete inquiry.' })
  }
}

// POST /api/inquiries/admin/responses/bulk-delete
export const bulkDeleteResponses = (req, res) => {
  try {
    const { ids } = req.body
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid or empty IDs array.' })
    }

    db.bulkDeleteInquiryResponses(ids)

    res.json({
      success: true,
      message: `${ids.length} inquiries deleted successfully.`,
    })
  } catch (error) {
    console.error('Error bulk deleting inquiries:', error)
    res.status(500).json({ success: false, message: 'Failed to bulk delete inquiries.' })
  }
}

// GET /api/inquiries/admin/export/csv
export const exportResponsesCsv = (req, res) => {
  try {
    const result = db.getAllInquiryResponses({ limit: 10000 })
    const responses = result.responses

    // Generate CSV Header & Rows
    let csvContent = 'ID,Status,Submitted At,Data\n'
    responses.forEach((r) => {
      const dataStr = JSON.stringify(r.response_data || {}).replace(/"/g, '""')
      csvContent += `${r.id},"${r.status}","${r.created_at}","${dataStr}"\n`
    })

    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', 'attachment; filename="inquiries-export.csv"')
    res.status(200).send(csvContent)
  } catch (error) {
    console.error('Error exporting CSV:', error)
    res.status(500).json({ success: false, message: 'Failed to export CSV.' })
  }
}
