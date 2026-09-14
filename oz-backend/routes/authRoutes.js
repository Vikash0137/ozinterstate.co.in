import express from 'express'
import {
  login,
  logout,
  forgotPassword,
  resetPassword,
  changePassword,
} from '../controllers/authController.js'
import { verifyAdmin } from '../middleware/auth.js'
import { loginValidation } from '../validations/authValidation.js'

const router = express.Router()

router.post('/login', loginValidation, login)
router.post('/logout', verifyAdmin, logout)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)
router.post('/change-password', verifyAdmin, changePassword)

export default router
