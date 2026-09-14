import dotenv from 'dotenv'
dotenv.config()

export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'oz-interstate-super-secret-jwt-key-2026',
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
}
