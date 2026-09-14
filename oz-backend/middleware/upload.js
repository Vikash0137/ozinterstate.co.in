import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const uploadsBaseDir = path.join(__dirname, '..', 'uploads')
const imagesDir = path.join(uploadsBaseDir, 'images')
const videosDir = path.join(uploadsBaseDir, 'videos')
const docsDir = path.join(uploadsBaseDir, 'documents')

;[uploadsBaseDir, imagesDir, videosDir, docsDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
})

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    if (['.mp4', '.webm', '.ogg'].includes(ext) || file.mimetype.startsWith('video/')) {
      cb(null, videosDir)
    } else if (['.pdf', '.doc', '.docx'].includes(ext) || file.mimetype.includes('pdf')) {
      cb(null, docsDir)
    } else {
      cb(null, imagesDir)
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname).toLowerCase()
    const prefix = file.fieldname || 'file'
    cb(null, `${prefix}-${uniqueSuffix}${ext}`)
  },
})

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    // Image MIME types
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/svg+xml',
    // Video MIME types
    'video/mp4',
    'video/webm',
    'video/ogg',
    // Document MIME types
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ]

  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.mp4', '.webm', '.ogg', '.pdf', '.doc', '.docx']
  const ext = path.extname(file.originalname).toLowerCase()

  if (allowedMimeTypes.includes(file.mimetype) || allowedExtensions.includes(ext)) {
    cb(null, true)
  } else {
    cb(
      new Error(
        'Invalid file type. Supported formats are JPG, PNG, WEBP, SVG, MP4, WebM, OGG, and PDF.'
      ),
      false
    )
  }
}

export const uploadMedia = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100 MB max file size
  },
})

export const uploadBannerMedia = uploadMedia
