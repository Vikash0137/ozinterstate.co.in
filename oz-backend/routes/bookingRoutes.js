import express from 'express'
import {
  listBookings,
  getBooking,
  createBooking,
  updateBooking,
  updateBookingStatus,
  assignBooking,
  deleteBooking,
  createBookingFromQuote,
} from '../controllers/bookingController.js'
import { verifyAdmin } from '../middleware/auth.js'

const router = express.Router()

router.use(verifyAdmin)

router.get('/', listBookings)
router.post('/from-quote/:quoteId', createBookingFromQuote)
router.get('/:id', getBooking)
router.post('/', createBooking)
router.put('/:id', updateBooking)
router.patch('/:id/status', updateBookingStatus)
router.patch('/:id/assign', assignBooking)
router.delete('/:id', deleteBooking)

export default router
