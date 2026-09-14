import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { jwtConfig } from '../config/jwt.js'
import { sendSuccess, sendError } from '../utils/response.js'
import { logActivity } from '../utils/activityLogger.js'
import Admin from '../models/Admin.js'

/**
 * POST /api/auth/login
 * Admin Login
 */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        // -----------------------------------
        // 1. Validate request
        // -----------------------------------
        if (!email || !password) {
            return sendError(
                res,
                'Email address and password are required.',
                400
            )
        }

        const normalizedEmail = String(email).trim().toLowerCase()

        // -----------------------------------
        // 2. Check JWT configuration
        // -----------------------------------
        if (!jwtConfig?.secret) {
            console.error('LOGIN ERROR: JWT_SECRET is missing.')

            return sendError(
                res,
                'Authentication configuration error.',
                500
            )
        }

        // -----------------------------------
        // 3. Find admin in MongoDB
        // -----------------------------------
        const user = await Admin
            .findOne({
                email: normalizedEmail
            })
            .select('+password')

        if (!user) {
            return sendError(
                res,
                'Invalid email address or password.',
                401
            )
        }

        // -----------------------------------
        // 4. Check account status
        // -----------------------------------
        if (user.status !== 'active') {
            return sendError(
                res,
                'User account is inactive. Please contact the administrator.',
                403
            )
        }

        // -----------------------------------
        // 5. Check password
        // -----------------------------------
        if (!user.password) {
            console.error(
                `LOGIN ERROR: Password missing for admin ${normalizedEmail}`
            )

            return sendError(
                res,
                'Invalid email address or password.',
                401
            )
        }

        const isMatch = await bcrypt.compare(
            String(password),
            user.password
        )

        if (!isMatch) {
            return sendError(
                res,
                'Invalid email address or password.',
                401
            )
        }

        // -----------------------------------
        // 6. Generate JWT
        // -----------------------------------
        const userId = user._id?.toString()

        const tokenPayload = {
            id: userId,
            email: user.email,
            role: user.role
        }

        const token = jwt.sign(
            tokenPayload,
            jwtConfig.secret,
            {
                expiresIn: jwtConfig.expiresIn || '7d'
            }
        )

        // -----------------------------------
        // 7. Safe user response
        // Never return password
        // -----------------------------------
        const safeUser = {
            id: userId,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status
        }

        // -----------------------------------
        // 8. Success
        // -----------------------------------
        
        // Log login activity asynchronously
        logActivity({
            req,
            user: {
                id: userId,
                name: user.name,
                email: user.email,
            },
            action: 'LOGIN',
            module: 'AUTH',
            description: 'Admin logged in successfully',
            metadata: {
                email: user.email,
            },
        })

        return sendSuccess(
            res,
            'Login successful',
            {
                user: safeUser,
                token
            }
        )

    } catch (error) {

        // -----------------------------------
        // Detailed server-side error logging
        // -----------------------------------
        console.error('')
        console.error('========================================')
        console.error('           LOGIN SERVER ERROR           ')
        console.error('========================================')
        console.error('Name:', error?.name)
        console.error('Message:', error?.message)
        console.error('Stack:', error?.stack)
        console.error('========================================')
        console.error('')

        // Don't expose stack trace to production users
        const message =
            process.env.NODE_ENV === 'production'
                ? 'Login failed due to a server error.'
                : `Login failed: ${error?.message || 'Unknown error'}`

        return sendError(
            res,
            message,
            500
        )
    }
}


/**
 * POST /api/auth/logout
 */
export const logout = async (req, res) => {
    try {
        // Log logout activity asynchronously
        logActivity({
            req,
            user: req.user,
            action: 'LOGOUT',
            module: 'AUTH',
            description: 'Admin logged out',
        })

        return sendSuccess(
            res,
            'Logout successful.'
        )
    } catch (error) {
        console.error('Logout error:', error)

        return sendError(
            res,
            'Logout failed.',
            500
        )
    }
}


/**
 * POST /api/auth/forgot-password
 *
 * NOTE:
 * Actual email reset functionality is still pending.
 */
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body

        if (!email) {
            return sendError(
                res,
                'Email address is required.',
                400
            )
        }

        const normalizedEmail = String(email)
            .trim()
            .toLowerCase()

        const user = await Admin.findOne({
            email: normalizedEmail
        })

        // Don't expose whether an email exists
        if (!user) {
            return sendSuccess(
                res,
                'If an account exists for this email, password reset instructions have been sent.'
            )
        }

        /*
         * TODO:
         * 1. Generate reset token
         * 2. Store hashed reset token
         * 3. Set expiration
         * 4. Send email
         */

        return sendSuccess(
            res,
            'If an account exists for this email, password reset instructions have been sent.'
        )

    } catch (error) {
        console.error('Forgot password error:', error)

        return sendError(
            res,
            'Failed to process forgot password request.',
            500
        )
    }
}


/**
 * POST /api/auth/reset-password
 *
 * NOTE:
 * Actual reset-token verification is still pending.
 */
export const resetPassword = async (req, res) => {
    try {
        const {
            token,
            newPassword
        } = req.body

        if (!token || !newPassword) {
            return sendError(
                res,
                'Token and new password are required.',
                400
            )
        }

        if (String(newPassword).length < 8) {
            return sendError(
                res,
                'New password must be at least 8 characters long.',
                400
            )
        }

        /*
         * TODO:
         * 1. Verify reset token
         * 2. Find admin
         * 3. Hash new password
         * 4. Save password
         * 5. Clear reset token
         */

        return sendSuccess(
            res,
            'Password reset successful. You can now login with your new password.'
        )

    } catch (error) {
        console.error('Reset password error:', error)

        return sendError(
            res,
            'Failed to reset password.',
            500
        )
    }
}


/**
 * POST /api/auth/change-password
 *
 * Requires authenticated admin.
 */
export const changePassword = async (req, res) => {
    try {
        const {
            currentPassword,
            newPassword
        } = req.body

        if (!currentPassword || !newPassword) {
            return sendError(
                res,
                'Current password and new password are required.',
                400
            )
        }

        if (String(newPassword).length < 8) {
            return sendError(
                res,
                'New password must be at least 8 characters long.',
                400
            )
        }

        // -----------------------------------
        // Get logged-in admin
        // -----------------------------------
        const adminId =
            req.user?.id ||
            req.user?._id

        if (!adminId) {
            return sendError(
                res,
                'Authentication required.',
                401
            )
        }

        const user = await Admin
            .findById(adminId)
            .select('+password')

        if (!user) {
            return sendError(
                res,
                'Admin account not found.',
                404
            )
        }

        // -----------------------------------
        // Verify current password
        // -----------------------------------
        const currentPasswordMatch =
            await bcrypt.compare(
                String(currentPassword),
                user.password
            )

        if (!currentPasswordMatch) {
            return sendError(
                res,
                'Current password is incorrect.',
                401
            )
        }

        // -----------------------------------
        // Prevent same password
        // -----------------------------------
        const samePassword =
            await bcrypt.compare(
                String(newPassword),
                user.password
            )

        if (samePassword) {
            return sendError(
                res,
                'New password must be different from the current password.',
                400
            )
        }

        // -----------------------------------
        // Admin model pre-save hook will hash
        // the password.
        // -----------------------------------
        user.password = String(newPassword)

        await user.save()

        return sendSuccess(
            res,
            'Password changed successfully.'
        )

    } catch (error) {
        console.error('Change password error:', error)

        return sendError(
            res,
            'Failed to change password.',
            500
        )
    }
}