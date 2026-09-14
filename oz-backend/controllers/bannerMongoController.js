import mongoose from 'mongoose'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import Banner from '../models/Banner.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const uploadsDir = path.join(__dirname, '..', 'uploads')

function saveBase64Image(base64Data, type = 'img') {
  try {
    const matches = base64Data.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/)
    if (!matches || matches.length !== 3) return null
    const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1]
    const filename = `banner-${type}-${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`
    const filepath = path.join(uploadsDir, filename)
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })
    fs.writeFileSync(filepath, Buffer.from(matches[2], 'base64'))
    return `/uploads/${filename}`
  } catch (err) {
    console.error('Error saving base64 image:', err)
    return null
  }
}

function removeFile(filePath) {
  if (!filePath || !filePath.startsWith('/uploads/')) return
  const fullPath = path.join(__dirname, '..', filePath.replace(/^\/+/, ''))
  if (fs.existsSync(fullPath)) {
    try { fs.unlinkSync(fullPath) } catch (err) { console.error('Error removing file:', fullPath, err) }
  }
}

function getUploadUrlFromFile(file) {
  if (!file?.path) return ''
  const relativePath = path.relative(uploadsDir, file.path).split(path.sep).join('/')
  return relativePath ? `/uploads/${relativePath}` : ''
}

function idQuery(id) {
  const conditions = [{ numeric_id: Number(id) }]
  if (mongoose.Types.ObjectId.isValid(id)) conditions.push({ _id: id })
  return { $or: conditions }
}

const parseBool = (value, fallback = 0) => value === undefined
  ? fallback
  : (value === true || value === 'true' || value === 1 || value === '1' ? 1 : 0)

function bannerPayload(body, files, existing = {}) {
  const payload = { ...body }
  const first = (name) => files?.[name]?.[0]
  if (first('image')) payload.image = getUploadUrlFromFile(first('image'))
  if (first('video')) payload.video_url = getUploadUrlFromFile(first('video'))
  if (first('video_thumbnail')) payload.video_thumbnail = getUploadUrlFromFile(first('video_thumbnail'))
  if (body.cropped_image) payload.image = saveBase64Image(body.cropped_image, 'cropped') || existing.image || ''
  if (body.video_url_text !== undefined) payload.video_url = body.video_url_text
  if (body.video_thumbnail_text !== undefined) payload.video_thumbnail = body.video_thumbnail_text
  ;['autoplay', 'muted', 'loop', 'controls'].forEach((field) => {
    if (payload[field] !== undefined) payload[field] = parseBool(payload[field], existing[field])
  })
  if (payload.display_order !== undefined) payload.display_order = parseInt(payload.display_order, 10) || 1
  if (payload.overlay_opacity !== undefined) payload.overlay_opacity = String(payload.overlay_opacity)
  ;['title', 'subtitle', 'description', 'button_text', 'button_link'].forEach((field) => {
    if (payload[field] !== undefined) payload[field] = String(payload[field]).trim()
  })
  delete payload.video_url_text
  delete payload.video_thumbnail_text
  delete payload.cropped_image
  delete payload.remove_image
  delete payload.remove_video
  delete payload.remove_video_thumbnail
  return payload
}

export const getActiveBanner = async (req, res) => {
  try {
    const banner = await Banner.findOne({ status: 'active' }).sort({ display_order: 1, numeric_id: -1 })
    return res.json({ success: true, data: banner })
  } catch (error) {
    console.error('Error fetching active banner:', error)
    return res.status(500).json({ success: false, message: 'Server error fetching active banner.' })
  }
}

export const getAllBanners = async (req, res) => {
  try {
    const { search = '', status = '', sortBy = 'display_order', sortOrder = 'asc', page = 1, limit = 10 } = req.query
    const query = {}
    if (status && status !== 'all') query.status = status
    if (search.trim()) query.$or = [{ title: new RegExp(search.trim(), 'i') }, { subtitle: new RegExp(search.trim(), 'i') }, { description: new RegExp(search.trim(), 'i') }]
    const pageNumber = parseInt(page, 10)
    const pageLimit = parseInt(limit, 10)
    const [banners, total] = await Promise.all([
      Banner.find(query).sort({ [sortBy]: sortOrder.toLowerCase() === 'desc' ? -1 : 1 }).skip((pageNumber - 1) * pageLimit).limit(pageLimit),
      Banner.countDocuments(query),
    ])
    return res.json({ success: true, data: banners, pagination: { total, page: pageNumber, limit: pageLimit, totalPages: Math.ceil(total / pageLimit) || 1 } })
  } catch (error) {
    console.error('Error fetching all banners:', error)
    return res.status(500).json({ success: false, message: 'Server error fetching banners.' })
  }
}

export const getBannerById = async (req, res) => {
  try {
    const banner = await Banner.findOne(idQuery(req.params.id))
    if (!banner) return res.status(404).json({ success: false, message: 'Banner not found.' })
    return res.json({ success: true, data: banner })
  } catch (error) {
    console.error('Error fetching banner by ID:', error)
    return res.status(500).json({ success: false, message: 'Server error fetching banner.' })
  }
}

export const createBanner = async (req, res) => {
  try {
    const payload = bannerPayload(req.body, req.files)
    if (!payload.title?.trim()) return res.status(400).json({ success: false, message: 'Banner title is required.' })
    const latest = await Banner.findOne().sort({ numeric_id: -1 }).select('numeric_id')
    const banner = await Banner.create({ ...payload, numeric_id: (latest?.numeric_id || 0) + 1 })
    return res.status(201).json({ success: true, message: 'Banner created successfully.', data: banner })
  } catch (error) {
    console.error('Error creating banner:', error)
    return res.status(400).json({ success: false, message: error.message || 'Failed to create banner.' })
  }
}

export const updateBanner = async (req, res) => {
  try {
    const existing = await Banner.findOne(idQuery(req.params.id))
    if (!existing) return res.status(404).json({ success: false, message: 'Banner not found.' })
    const payload = bannerPayload(req.body, req.files, existing)
    if (req.body.remove_image === 'true' || req.body.remove_image === true) { removeFile(existing.image); payload.image = '' }
    if (req.body.remove_video === 'true' || req.body.remove_video === true) { removeFile(existing.video_url); payload.video_url = '' }
    if (req.body.remove_video_thumbnail === 'true' || req.body.remove_video_thumbnail === true) { removeFile(existing.video_thumbnail); payload.video_thumbnail = '' }
    if (req.files?.image?.[0]) removeFile(existing.image)
    if (req.files?.video?.[0]) removeFile(existing.video_url)
    if (req.files?.video_thumbnail?.[0]) removeFile(existing.video_thumbnail)
    const updated = await Banner.findOneAndUpdate(idQuery(req.params.id), payload, { new: true, runValidators: true })
    return res.json({ success: true, message: 'Banner updated successfully.', data: updated })
  } catch (error) {
    console.error('Error updating banner:', error)
    return res.status(400).json({ success: false, message: error.message || 'Failed to update banner.' })
  }
}

export const toggleBannerStatus = async (req, res) => {
  try {
    const existing = await Banner.findOne(idQuery(req.params.id))
    if (!existing) return res.status(404).json({ success: false, message: 'Banner not found.' })
    const status = req.body.status || (existing.status === 'active' ? 'inactive' : 'active')
    const updated = await Banner.findOneAndUpdate(idQuery(req.params.id), { status }, { new: true, runValidators: true })
    return res.json({ success: true, message: `Banner status set to ${status}.`, data: updated })
  } catch (error) {
    console.error('Error toggling banner status:', error)
    return res.status(400).json({ success: false, message: error.message || 'Failed to update banner status.' })
  }
}

export const deleteBanner = async (req, res) => {
  try {
    const existing = await Banner.findOne(idQuery(req.params.id))
    if (!existing) return res.status(404).json({ success: false, message: 'Banner not found.' })
    removeFile(existing.image)
    removeFile(existing.video_url)
    removeFile(existing.video_thumbnail)
    await Banner.deleteOne({ _id: existing._id })
    return res.json({ success: true, message: 'Banner deleted successfully.' })
  } catch (error) {
    console.error('Error deleting banner:', error)
    return res.status(500).json({ success: false, message: 'Failed to delete banner.' })
  }
}
