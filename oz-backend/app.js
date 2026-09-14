import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import { fileURLToPath } from 'url'
import { helmetMiddleware, corsMiddleware, apiRateLimiter, sanitizeInputs, mongoSanitizeMiddleware } from './middleware/security.js'
import { morganLogger } from './middleware/logger.js'
import authRoutes from './routes/authRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'
import bannerRoutes from './routes/bannerRoutes.js'
import inquiryRoutes from './routes/inquiryRoutes.js'
import mediaRoutes from './routes/mediaRoutes.js'
import quoteRoutes from './routes/quoteRoutes.js'
import customerRoutes from './routes/customerRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import activityLogRoutes from './routes/activityLogRoutes.js'
import notificationRoutes from './routes/notificationRoutes.js'
import bookingRoutes from './routes/bookingRoutes.js'
import locationRoutes from './routes/locationRoutes.js'
import siteSettingsRoutes from './routes/siteSettingsRoutes.js'
import pageRoutes from './routes/pageRoutes.js'
import pageSectionRoutes from './routes/pageSectionRoutes.js'
import serviceRoutes from './routes/serviceRoutes.js'
import reviewRoutes from './routes/reviewRoutes.js'
import faqRoutes from './routes/faqRoutes.js'
import galleryRoutes from './routes/galleryRoutes.js'
import blogRoutes from './routes/blogRoutes.js'
import teamRoutes from './routes/teamRoutes.js'
import statRoutes from './routes/statRoutes.js'
import trustBadgeRoutes from './routes/trustBadgeRoutes.js'
import processStepRoutes from './routes/processStepRoutes.js'
import whyChooseRoutes from './routes/whyChooseRoutes.js'
import seoSettingsRoutes from './routes/seoSettingsRoutes.js'
import sitemapRoutes from './routes/sitemapRoutes.js'
import redirectRoutes from './routes/redirectRoutes.js'
import { sendSuccess } from './utils/response.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// Trust proxy for Nginx reverse proxy
app.set('trust proxy', 1)

// Security & Logging Middlewares
app.use(helmetMiddleware)
app.use(corsMiddleware)
app.use(morganLogger)
app.use(apiRateLimiter)
app.use(cookieParser())

// Body Parsers & Sanitization
app.use(express.json({ limit: '20mb' }))
app.use(express.urlencoded({ extended: true, limit: '20mb' }))
app.use(mongoSanitizeMiddleware)
app.use(sanitizeInputs)

// Static Uploads & Public Serves
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use('/uploads', express.static(path.join(__dirname, 'uploads', 'images')))
app.use('/uploads', express.static(path.join(__dirname, 'uploads', 'videos')))
app.use('/uploads', express.static(path.join(__dirname, 'uploads', 'documents')))
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')))
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads', 'images')))
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads', 'videos')))
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads', 'documents')))
app.use('/public', express.static(path.join(__dirname, 'public')))

// Mount XML Sitemaps & Robots.txt at Root
app.use('/', sitemapRoutes)

// Mount REST API Routers
app.use('/api/auth', authRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/banners', bannerRoutes)
app.use('/api/inquiries', inquiryRoutes)
app.use('/api/media', mediaRoutes)
app.use('/api/quotes', quoteRoutes)
app.use('/api/customers', customerRoutes)
app.use('/api/admins', adminRoutes)
app.use('/api/activity-logs', activityLogRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/locations', locationRoutes)
app.use('/api/redirects', redirectRoutes)
app.use('/api/sitemap', sitemapRoutes)

// CMS & Website Routes
app.use('/api/site-settings', siteSettingsRoutes)
app.use('/api/pages', pageRoutes)
app.use('/api/page-sections', pageSectionRoutes)
app.use('/api/services', serviceRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/faqs', faqRoutes)
app.use('/api/gallery', galleryRoutes)
app.use('/api/blogs', blogRoutes)
app.use('/api/team', teamRoutes)
app.use('/api/stats', statRoutes)
app.use('/api/trust-badges', trustBadgeRoutes)
app.use('/api/process-steps', processStepRoutes)
app.use('/api/why-choose', whyChooseRoutes)
app.use('/api/seo-settings', seoSettingsRoutes)

// Root endpoint
app.get('/', (req, res) => {
  return sendSuccess(res, 'OZ Interstate Backend API', {
    message: 'Welcome to OZ Interstate Backend API',
    health: '/api/health',
    banners: '/api/banners',
  })
})

// Health check endpoint
app.get('/api/health', (req, res) => {
  return sendSuccess(res, 'OZ Interstate Backend operational', {
    status: 'online',
    timestamp: new Date().toISOString(),
  })
})

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.originalUrl} not found.`,
  })
})

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[UNHANDLED SERVER ERROR]', err)
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  })
})

export default app
