import db from '../db.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const uploadsDir = path.join(__dirname, '..', 'uploads')

function saveBase64Image(base64Data, type = 'img') {
  try {
    const matches = base64Data.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/)
    if (!matches || matches.length !== 3) return null

    const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1]
    const buffer = Buffer.from(matches[2], 'base64')
    const filename = `banner-${type}-${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`
    const filepath = path.join(uploadsDir, filename)

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
    }

    fs.writeFileSync(filepath, buffer)
    return `/uploads/${filename}`
  } catch (err) {
    console.error('Error saving base64 image:', err)
    return null
  }
}

function removeFile(filePath) {
  if (!filePath || !filePath.startsWith('/uploads/')) return

  const normalizedPath = filePath.replace(/^\/+/, '')
  const fullPath = path.join(__dirname, '..', normalizedPath)

  if (fs.existsSync(fullPath)) {
    try {
      fs.unlinkSync(fullPath)
    } catch (err) {
      console.error('Error removing file:', fullPath, err)
    }
  }
}

function getUploadUrlFromFile(file) {
  if (!file || !file.path) return ''

  const relativePath = path.relative(uploadsDir, file.path).split(path.sep).join('/')
  if (!relativePath) return ''

  return `/uploads/${relativePath}`
}

// GET /api/banners/active - Public API for Frontend Hero Banner
export const getActiveBanner = (req, res) => {
  try {
    const activeBanner = db.getActiveBanner()
    res.json({
      success: true,
      data: activeBanner,
    })
  } catch (error) {
    console.error('Error fetching active banner:', error)
    res.status(500).json({ success: false, message: 'Server error fetching active banner.' })
  }
}

// GET /api/banners - Admin list with search, sorting, pagination, status filter
export const getAllBanners = (req, res) => {
  try {
    const { search = '', status = '', sortBy = 'display_order', sortOrder = 'asc', page = 1, limit = 10 } = req.query

    const result = db.getAllBanners({ search, status, sortBy, sortOrder, page, limit })

    res.json({
      success: true,
      data: result.banners,
      pagination: {
        total: result.total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: result.totalPages,
      },
    })
  } catch (error) {
    console.error('Error fetching all banners:', error)
    res.status(500).json({ success: false, message: 'Server error fetching banners.' })
  }
}

// GET /api/banners/:id
export const getBannerById = (req, res) => {
  try {
    const { id } = req.params
    const banner = db.getBannerById(id)

    if (!banner) {
      return res.status(404).json({ success: false, message: 'Banner not found.' })
    }

    res.json({ success: true, data: banner })
  } catch (error) {
    console.error('Error fetching banner by ID:', error)
    res.status(500).json({ success: false, message: 'Server error fetching banner.' })
  }
}

// POST /api/banners - Create Banner (Image or Video)
export const createBanner = (req, res) => {
  try {
    const {
      media_type = 'image',
      title,
      subtitle = '',
      description = '',
      button_text = 'Our Services',
      button_link = '/services',
      video_url_text = '',
      video_url = '',
      video_thumbnail_text = '',
      video_thumbnail = '',
      autoplay = '1',
      muted = '1',
      loop = '1',
      controls = '0',
      preload = 'auto',
      object_fit = 'cover',
      overlay_opacity = '0.7',
      overlay_color = '#000000',
      font_family = 'Inter',
      title_font_size = '48px',
      title_font_weight = '800',
      title_font_style = 'normal',
      title_color = '#ffffff',
      title_letter_spacing = '0px',
      title_line_height = '1.1',
      title_text_transform = 'none',
      description_font_family = 'Inter',
      description_font_size = '16px',
      description_font_weight = '400',
      description_font_style = 'normal',
      description_color = '#ffffff',
      description_letter_spacing = '0px',
      description_line_height = '1.6',
      description_text_alignment = 'left',
      button_font_family = 'Inter',
      button_font_size = '14px',
      button_font_weight = '700',
      button_text_color = '#ffffff',
      button_background_color = '#0284c7',
      button_hover_color = '#0369a1',
      button_hover_text_color = '#ffffff',
      button_border_radius = '12px',
      button_border_color = 'transparent',
      text_alignment = 'left',
      display_order = 1,
      status = 'active',
      cropped_image = '',
    } = req.body

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Banner title is required.' })
    }

    let imagePath = ''
    let videoPath = video_url_text || video_url
    let videoThumbnailPath = video_thumbnail_text || video_thumbnail

    if (req.files) {
      if (req.files.image && req.files.image[0]) {
        imagePath = getUploadUrlFromFile(req.files.image[0])
      }
      if (req.files.video && req.files.video[0]) {
        videoPath = getUploadUrlFromFile(req.files.video[0])
      }
      if (req.files.video_thumbnail && req.files.video_thumbnail[0]) {
        videoThumbnailPath = getUploadUrlFromFile(req.files.video_thumbnail[0])
      }
    } else if (req.file) {
      imagePath = getUploadUrlFromFile(req.file)
    }

    if (!imagePath && cropped_image) {
      imagePath = saveBase64Image(cropped_image, 'cropped') || ''
    }

    const parseBool = (val) => (val === true || val === 'true' || val === 1 || val === '1' ? 1 : 0)

    const newBanner = db.createBanner({
      media_type,
      title: title.trim(),
      subtitle: subtitle ? subtitle.trim() : '',
      description: description ? description.trim() : '',
      button_text: button_text ? button_text.trim() : '',
      button_link: button_link ? button_link.trim() : '',
      image: imagePath,
      video_url: videoPath,
      video_thumbnail: videoThumbnailPath,
      autoplay: parseBool(autoplay),
      muted: parseBool(muted),
      loop: parseBool(loop),
      controls: parseBool(controls),
      preload: preload || 'auto',
      object_fit: object_fit || 'cover',
      overlay_opacity: overlay_opacity !== undefined ? String(overlay_opacity) : '0.7',
      overlay_color: overlay_color || '#000000',
      font_family,
      title_font_size,
      title_font_weight,
      title_font_style,
      title_color,
      title_letter_spacing,
      title_line_height,
      title_text_transform,
      description_font_family,
      description_font_size,
      description_font_weight,
      description_font_style,
      description_color,
      description_letter_spacing,
      description_line_height,
      description_text_alignment,
      button_font_family,
      button_font_size,
      button_font_weight,
      button_text_color,
      button_background_color,
      button_hover_color,
      button_hover_text_color,
      button_border_radius,
      button_border_color,
      text_alignment,
      display_order: parseInt(display_order) || 1,
      status: status || 'active',
    })

    res.status(201).json({
      success: true,
      message: 'Banner created successfully.',
      data: newBanner,
    })
  } catch (error) {
    console.error('Error creating banner:', error)
    res.status(500).json({ success: false, message: 'Failed to create banner.' })
  }
}

// PUT /api/banners/:id - Update Banner
export const updateBanner = (req, res) => {
  try {
    const { id } = req.params
    const existingBanner = db.getBannerById(id)

    if (!existingBanner) {
      return res.status(404).json({ success: false, message: 'Banner not found.' })
    }

    const {
      media_type,
      title,
      subtitle,
      description,
      button_text,
      button_link,
      video_url_text,
      video_url,
      video_thumbnail_text,
      video_thumbnail,
      autoplay,
      muted,
      loop,
      controls,
      preload,
      object_fit,
      overlay_opacity,
      overlay_color,
      font_family,
      title_font_size,
      title_font_weight,
      title_font_style,
      title_color,
      title_letter_spacing,
      title_line_height,
      title_text_transform,
      description_font_family,
      description_font_size,
      description_font_weight,
      description_font_style,
      description_color,
      description_letter_spacing,
      description_line_height,
      description_text_alignment,
      button_font_family,
      button_font_size,
      button_font_weight,
      button_text_color,
      button_background_color,
      button_hover_color,
      button_hover_text_color,
      button_border_radius,
      button_border_color,
      text_alignment,
      display_order,
      status,
      remove_image = false,
      remove_video = false,
      remove_video_thumbnail = false,
      cropped_image = '',
    } = req.body

    let newImagePath = existingBanner.image
    let newVideoPath = video_url_text || video_url || existingBanner.video_url
    let newVideoThumbnailPath =
      video_thumbnail_text || video_thumbnail || existingBanner.video_thumbnail

    // Handle removals
    if (remove_image === 'true' || remove_image === true) {
      removeFile(existingBanner.image)
      newImagePath = ''
    }
    if (remove_video === 'true' || remove_video === true) {
      removeFile(existingBanner.video_url)
      newVideoPath = ''
    }
    if (remove_video_thumbnail === 'true' || remove_video_thumbnail === true) {
      removeFile(existingBanner.video_thumbnail)
      newVideoThumbnailPath = ''
    }

    // Handle files upload
    if (req.files) {
      if (req.files.image && req.files.image[0]) {
        removeFile(existingBanner.image)
        newImagePath = getUploadUrlFromFile(req.files.image[0])
      }
      if (req.files.video && req.files.video[0]) {
        removeFile(existingBanner.video_url)
        newVideoPath = getUploadUrlFromFile(req.files.video[0])
      }
      if (req.files.video_thumbnail && req.files.video_thumbnail[0]) {
        removeFile(existingBanner.video_thumbnail)
        newVideoThumbnailPath = getUploadUrlFromFile(req.files.video_thumbnail[0])
      }
    } else if (req.file) {
      removeFile(existingBanner.image)
      newImagePath = getUploadUrlFromFile(req.file)
    }

    if (cropped_image) {
      removeFile(existingBanner.image)
      newImagePath = saveBase64Image(cropped_image, 'cropped') || existingBanner.image
    }

    const parseBool = (val, defaultVal) => {
      if (val === undefined) return defaultVal
      return val === true || val === 'true' || val === 1 || val === '1' ? 1 : 0
    }

    const updates = {
      image: newImagePath,
      video_url: newVideoPath,
      video_thumbnail: newVideoThumbnailPath,
    }

    if (media_type !== undefined) updates.media_type = media_type
    if (title !== undefined) updates.title = title.trim()
    if (subtitle !== undefined) updates.subtitle = subtitle.trim()
    if (description !== undefined) updates.description = description.trim()
    if (button_text !== undefined) updates.button_text = button_text.trim()
    if (button_link !== undefined) updates.button_link = button_link.trim()
    if (autoplay !== undefined) updates.autoplay = parseBool(autoplay, existingBanner.autoplay)
    if (muted !== undefined) updates.muted = parseBool(muted, existingBanner.muted)
    if (loop !== undefined) updates.loop = parseBool(loop, existingBanner.loop)
    if (controls !== undefined) updates.controls = parseBool(controls, existingBanner.controls)
    if (preload !== undefined) updates.preload = preload
    if (object_fit !== undefined) updates.object_fit = object_fit
    if (overlay_opacity !== undefined) updates.overlay_opacity = String(overlay_opacity)
    if (overlay_color !== undefined) updates.overlay_color = overlay_color
    if (font_family !== undefined) updates.font_family = font_family
    if (title_font_size !== undefined) updates.title_font_size = title_font_size
    if (title_font_weight !== undefined) updates.title_font_weight = title_font_weight
    if (title_font_style !== undefined) updates.title_font_style = title_font_style
    if (title_color !== undefined) updates.title_color = title_color
    if (title_letter_spacing !== undefined) updates.title_letter_spacing = title_letter_spacing
    if (title_line_height !== undefined) updates.title_line_height = title_line_height
    if (title_text_transform !== undefined) updates.title_text_transform = title_text_transform
    if (description_font_family !== undefined) updates.description_font_family = description_font_family
    if (description_font_size !== undefined) updates.description_font_size = description_font_size
    if (description_font_weight !== undefined) updates.description_font_weight = description_font_weight
    if (description_font_style !== undefined) updates.description_font_style = description_font_style
    if (description_color !== undefined) updates.description_color = description_color
    if (description_letter_spacing !== undefined) updates.description_letter_spacing = description_letter_spacing
    if (description_line_height !== undefined) updates.description_line_height = description_line_height
    if (description_text_alignment !== undefined) updates.description_text_alignment = description_text_alignment
    if (button_font_family !== undefined) updates.button_font_family = button_font_family
    if (button_font_size !== undefined) updates.button_font_size = button_font_size
    if (button_font_weight !== undefined) updates.button_font_weight = button_font_weight
    if (button_text_color !== undefined) updates.button_text_color = button_text_color
    if (button_background_color !== undefined) updates.button_background_color = button_background_color
    if (button_hover_color !== undefined) updates.button_hover_color = button_hover_color
    if (button_hover_text_color !== undefined) updates.button_hover_text_color = button_hover_text_color
    if (button_border_radius !== undefined) updates.button_border_radius = button_border_radius
    if (button_border_color !== undefined) updates.button_border_color = button_border_color
    if (text_alignment !== undefined) updates.text_alignment = text_alignment
    if (display_order !== undefined) updates.display_order = parseInt(display_order)
    if (status !== undefined) updates.status = status

    const updatedBanner = db.updateBanner(id, updates)

    res.json({
      success: true,
      message: 'Banner updated successfully.',
      data: updatedBanner,
    })
  } catch (error) {
    console.error('Error updating banner:', error)
    res.status(500).json({ success: false, message: 'Failed to update banner.' })
  }
}

// PATCH /api/banners/:id/status - Toggle Banner Active/Inactive status
export const toggleBannerStatus = (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const existingBanner = db.getBannerById(id)

    if (!existingBanner) {
      return res.status(404).json({ success: false, message: 'Banner not found.' })
    }

    const newStatus = status ? status : existingBanner.status === 'active' ? 'inactive' : 'active'
    const updatedBanner = db.updateBanner(id, { status: newStatus })

    res.json({
      success: true,
      message: `Banner status set to ${newStatus}.`,
      data: updatedBanner,
    })
  } catch (error) {
    console.error('Error toggling banner status:', error)
    res.status(500).json({ success: false, message: 'Failed to update banner status.' })
  }
}

// DELETE /api/banners/:id - Delete Banner
export const deleteBanner = (req, res) => {
  try {
    const { id } = req.params
    const existingBanner = db.getBannerById(id)

    if (!existingBanner) {
      return res.status(404).json({ success: false, message: 'Banner not found.' })
    }

    removeFile(existingBanner.image)
    removeFile(existingBanner.video_url)
    removeFile(existingBanner.video_thumbnail)
    db.deleteBanner(id)

    res.json({
      success: true,
      message: 'Banner deleted successfully.',
    })
  } catch (error) {
    console.error('Error deleting banner:', error)
    res.status(500).json({ success: false, message: 'Failed to delete banner.' })
  }
}
