import express from 'express'
import {
  getPublicForm,
  submitInquiry,
  getAdminForm,
  updateFormSettings,
  saveFormFields,
  getAllResponses,
  updateResponseStatus,
  deleteResponse,
  bulkDeleteResponses,
  exportResponsesCsv,
} from '../controllers/inquiryMongoController.js'
import { verifyAdmin } from '../middleware/auth.js'

const router = express.Router()

// Public endpoints for Frontend
router.get('/form', getPublicForm)
router.post('/submit', submitInquiry)

// Admin protected endpoints
router.get('/admin/form', verifyAdmin, getAdminForm)
router.put('/admin/settings', verifyAdmin, updateFormSettings)
router.put('/admin/fields', verifyAdmin, saveFormFields)
router.get('/admin/responses', verifyAdmin, getAllResponses)
router.patch('/admin/responses/:id/status', verifyAdmin, updateResponseStatus)
router.delete('/admin/responses/:id', verifyAdmin, deleteResponse)
router.post('/admin/responses/bulk-delete', verifyAdmin, bulkDeleteResponses)
router.get('/admin/export/csv', verifyAdmin, exportResponsesCsv)

export default router
