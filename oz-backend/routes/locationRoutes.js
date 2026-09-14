import express from 'express'
import {
  getPublicLocations,
  getPublicLocationBySlug,
  getNearbyLocations,
  getLocations,
  getLocationById,
  createLocation,
  updateLocation,
  duplicateLocation,
  toggleLocationStatus,
  bulkPublishLocations,
  bulkUnpublishLocations,
  bulkDeleteLocations,
  deleteLocation,
  getSeoHealth,
  getLocationRevisions,
  restoreLocationRevision,
  getLocationsAnalytics,
} from '../controllers/locationController.js'
import { verifyAdmin } from '../middleware/auth.js'

const router = express.Router()

// Public endpoints
router.get('/public', getPublicLocations)
router.get('/public/:slug', getPublicLocationBySlug)
router.get('/public/:slug/nearby', getNearbyLocations)

// Admin analytics & SEO audit (must come before /:id)
router.get('/admin/analytics', verifyAdmin, getLocationsAnalytics)
router.post('/admin/bulk-publish', verifyAdmin, bulkPublishLocations)
router.post('/admin/bulk-unpublish', verifyAdmin, bulkUnpublishLocations)
router.post('/admin/bulk-delete', verifyAdmin, bulkDeleteLocations)

// Admin CRUD
router.get('/', verifyAdmin, getLocations)
router.post('/', verifyAdmin, createLocation)
router.get('/:id', verifyAdmin, getLocationById)
router.put('/:id', verifyAdmin, updateLocation)
router.post('/:id/duplicate', verifyAdmin, duplicateLocation)
router.patch('/:id/status', verifyAdmin, toggleLocationStatus)
router.delete('/:id', verifyAdmin, deleteLocation)

// Admin SEO & Revisions
router.get('/:id/seo-health', verifyAdmin, getSeoHealth)
router.get('/:id/revisions', verifyAdmin, getLocationRevisions)
router.post('/:id/revisions/:version/restore', verifyAdmin, restoreLocationRevision)

export default router
