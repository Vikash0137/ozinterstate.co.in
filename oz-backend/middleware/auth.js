import jwt from 'jsonwebtoken'
import { jwtConfig } from '../config/jwt.js'
import { sendError } from '../utils/response.js'

export const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return sendError(res, 'Access denied. Authorization token is required.', 401)
  }

  const token = authHeader.startsWith('Bearer ')
    ? authHeader.substring(7)
    : authHeader

  if (!token || token === 'undefined' || token === 'null') {
    return sendError(res, 'Invalid or missing authentication token.', 401)
  }

  try {
    const decoded = jwt.verify(token, jwtConfig.secret)
    req.user = decoded
    next()
  } catch (err) {
    return sendError(res, 'Invalid or expired authorization token.', 401)
  }
}

export const checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    // Role & permission validation
    if (req.user && (req.user.role === 'Super Admin' || req.user.role === 'admin')) {
      return next()
    }
    return sendError(res, 'Forbidden: Insufficient permissions for this action.', 403)
  }
}
