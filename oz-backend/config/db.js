import mongoose from 'mongoose'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/oz_interstate'

const bannersFilePath = path.join(__dirname, '..', 'banners.json')
const inquiriesFilePath = path.join(__dirname, '..', 'inquiries.json')

let isMongoConnected = false

let bannersStore = []
let lastBannerId = 0

let inquiriesStore = {
  form: null,
  fields: [],
  responses: [],
  lastFieldId: 0,
  lastResponseId: 0,
}

function loadLocalJsonData() {
  try {
    if (fs.existsSync(bannersFilePath)) {
      const data = fs.readFileSync(bannersFilePath, 'utf8')
      bannersStore = JSON.parse(data)
      if (Array.isArray(bannersStore) && bannersStore.length > 0) {
        lastBannerId = Math.max(...bannersStore.map((b) => b.id || 0))
      }
    }
  } catch (err) {
    bannersStore = []
  }

  try {
    if (fs.existsSync(inquiriesFilePath)) {
      const data = fs.readFileSync(inquiriesFilePath, 'utf8')
      const parsed = JSON.parse(data)
      inquiriesStore = {
        form: parsed.form || null,
        fields: parsed.fields || [],
        responses: parsed.responses || [],
        lastFieldId: parsed.lastFieldId || (parsed.fields?.length ? Math.max(...parsed.fields.map(f => f.id || 0)) : 0),
        lastResponseId: parsed.lastResponseId || (parsed.responses?.length ? Math.max(...parsed.responses.map(r => r.id || 0)) : 0),
      }
    }
  } catch (err) {
    console.error('Error loading inquiries data:', err)
  }
}

function saveLocalJsonData() {
  try {
    fs.writeFileSync(bannersFilePath, JSON.stringify(bannersStore, null, 2), 'utf8')
  } catch (err) {}

  try {
    fs.writeFileSync(inquiriesFilePath, JSON.stringify(inquiriesStore, null, 2), 'utf8')
  } catch (err) {}
}

export async function connectMongo() {
  try {
    mongoose.set('strictQuery', false)

    mongoose.connection.on('connected', () => {
      isMongoConnected = true
      console.log('✅ MongoDB connection established successfully.')
    })

    mongoose.connection.on('error', (err) => {
      isMongoConnected = false
      console.error('⚠️ MongoDB connection error:', err.message)
    })

    mongoose.connection.on('disconnected', () => {
      isMongoConnected = false
      console.log('ℹ️ MongoDB disconnected.')
    })

    // Attempt Mongoose connection with timeout
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 30000,
    })
    isMongoConnected = true
    return true
  } catch (err) {
    isMongoConnected = false
    console.error('❌ MongoDB connection failed:', err.message)
    return false
  }
}

export function initDb() {
  loadLocalJsonData()

  if (bannersStore.length === 0) {
    const defaultBanner = {
      id: 1,
      media_type: 'image',
      title: 'Logistics Excellence: Beyond Boundaries',
      subtitle: 'Logistic Transportation',
      description:
        'Streamlining your move with professional interstate removalist solutions, timely service, and safe transportation across Australia.',
      button_text: 'Our Services',
      button_link: '/services',
      image: '',
      video_url: '',
      video_thumbnail: '',
      autoplay: 1,
      muted: 1,
      loop: 1,
      controls: 0,
      preload: 'auto',
      object_fit: 'cover',
      overlay_opacity: '0.7',
      overlay_color: '#000000',
      display_order: 1,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    bannersStore.push(defaultBanner)
    lastBannerId = 1
    saveLocalJsonData()
  }

  if (!inquiriesStore.form) {
    const now = new Date().toISOString()
    inquiriesStore.form = {
      id: 1,
      title: 'Get Your Moving Quote',
      subtitle: 'FREE ESTIMATE',
      description: 'Fill the form and our team will contact you shortly.',
      button_text: 'Submit Quote Request',
      success_message: 'Thank you! Your quote request has been submitted successfully. Our team will contact you shortly.',
      error_message: 'Oops! Unable to submit quote. Please check your details and try again.',
      email_notification: 1,
      admin_email: 'admin@ozinterstate.com',
      auto_reply: 1,
      auto_reply_message: 'Thank you for requesting a quote with OZ Interstate Movers. We have received your request and will call you shortly.',
      redirect_url: '',
      status: 'active',
      created_at: now,
      updated_at: now,
    }

    inquiriesStore.fields = [
      { id: 1, form_id: 1, label: 'Full Name', placeholder: 'Full Name', field_name: 'name', field_type: 'text', required: 1, width: '50%', icon: 'User', sort_order: 1, status: 'active' },
      { id: 2, form_id: 1, label: 'Phone Number', placeholder: 'Phone Number', field_name: 'phone', field_type: 'phone', required: 1, width: '50%', icon: 'Phone', sort_order: 2, status: 'active' },
      { id: 3, form_id: 1, label: 'Email Address', placeholder: 'Email Address', field_name: 'email', field_type: 'email', required: 0, width: '100%', icon: 'Mail', sort_order: 3, status: 'active' },
      { id: 4, form_id: 1, label: 'Moving From', placeholder: 'Moving From', field_name: 'from', field_type: 'text', required: 1, width: '100%', icon: 'MapPin', sort_order: 4, status: 'active' },
      { id: 5, form_id: 1, label: 'Moving To', placeholder: 'Moving To', field_name: 'to', field_type: 'text', required: 1, width: '100%', icon: 'MapPin', sort_order: 5, status: 'active' },
      { id: 6, form_id: 1, label: 'Moving Date', placeholder: '', field_name: 'date', field_type: 'date', required: 0, width: '50%', icon: 'CalendarDays', sort_order: 6, status: 'active' },
      { id: 7, form_id: 1, label: 'Property Type', placeholder: 'Property Type', field_name: 'property', field_type: 'select', required: 0, width: '50%', icon: 'Home', options: ['1 Bedroom', '2 Bedroom', '3 Bedroom', '4 Bedroom', 'Office'], sort_order: 7, status: 'active' },
    ]

    inquiriesStore.lastFieldId = 7
    inquiriesStore.lastResponseId = 0
    saveLocalJsonData()
  }

  // Attempt async Mongo connection
  connectMongo()
}

// Graceful Shutdown helper
process.on('SIGINT', async () => {
  if (isMongoConnected) {
    await mongoose.connection.close()
    console.log('MongoDB connection closed due to app termination.')
  }
  process.exit(0)
})

export const db = {
  getActiveBanner: () => {
    loadLocalJsonData()
    const active = bannersStore
      .filter((b) => b.status === 'active')
      .sort((a, b) => (a.display_order || 0) - (b.display_order || 0) || b.id - a.id)
    return active.length > 0 ? active[0] : bannersStore[0] || null
  },

  getAllBanners: ({ search = '', status = '', sortBy = 'display_order', sortOrder = 'asc', page = 1, limit = 10 }) => {
    loadLocalJsonData()
    let list = [...bannersStore]

    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(
        (b) =>
          (b.title && b.title.toLowerCase().includes(q)) ||
          (b.subtitle && b.subtitle.toLowerCase().includes(q)) ||
          (b.description && b.description.toLowerCase().includes(q))
      )
    }

    if (status && status !== 'all') {
      list = list.filter((b) => b.status === status)
    }

    const orderMult = sortOrder.toLowerCase() === 'desc' ? -1 : 1
    list.sort((a, b) => {
      let valA = a[sortBy]
      let valB = b[sortBy]
      if (typeof valA === 'string') valA = valA.toLowerCase()
      if (typeof valB === 'string') valB = valB.toLowerCase()
      if (valA < valB) return -1 * orderMult
      if (valA > valB) return 1 * orderMult
      return 0
    })

    const total = list.length
    const offset = (parseInt(page) - 1) * parseInt(limit)
    const paginated = list.slice(offset, offset + parseInt(limit))

    return {
      banners: paginated,
      total,
      totalPages: Math.ceil(total / parseInt(limit)) || 1,
    }
  },

  getBannerById: (id) => {
    loadLocalJsonData()
    return bannersStore.find((b) => Number(b.id) === Number(id)) || null
  },

  createBanner: (data) => {
    loadLocalJsonData()
    lastBannerId += 1
    const now = new Date().toISOString()
    const newBanner = {
      id: lastBannerId,
      media_type: data.media_type || 'image',
      title: data.title || '',
      subtitle: data.subtitle || '',
      description: data.description || '',
      button_text: data.button_text || 'Our Services',
      button_link: data.button_link || '/services',
      image: data.image || '',
      video_url: data.video_url || '',
      video_thumbnail: data.video_thumbnail || '',
      autoplay: data.autoplay !== undefined ? (data.autoplay ? 1 : 0) : 1,
      muted: data.muted !== undefined ? (data.muted ? 1 : 0) : 1,
      loop: data.loop !== undefined ? (data.loop ? 1 : 0) : 1,
      controls: data.controls !== undefined ? (data.controls ? 1 : 0) : 0,
      preload: data.preload || 'auto',
      object_fit: data.object_fit || 'cover',
      overlay_opacity: data.overlay_opacity !== undefined ? String(data.overlay_opacity) : '0.7',
      overlay_color: data.overlay_color || '#000000',
      display_order: parseInt(data.display_order) || 1,
      status: data.status || 'active',
      created_at: now,
      updated_at: now,
    }

    bannersStore.push(newBanner)
    saveLocalJsonData()
    return newBanner
  },

  updateBanner: (id, updates) => {
    loadLocalJsonData()
    const index = bannersStore.findIndex((b) => Number(b.id) === Number(id))
    if (index === -1) return null

    const existing = bannersStore[index]
    const updated = {
      ...existing,
      ...updates,
      id: existing.id,
      display_order: updates.display_order !== undefined ? parseInt(updates.display_order) : existing.display_order,
      updated_at: new Date().toISOString(),
    }

    bannersStore[index] = updated
    saveLocalJsonData()
    return updated
  },

  deleteBanner: (id) => {
    loadLocalJsonData()
    const index = bannersStore.findIndex((b) => Number(b.id) === Number(id))
    if (index === -1) return false

    bannersStore.splice(index, 1)
    saveLocalJsonData()
    return true
  },

  getPublicInquiryForm: () => {
    loadLocalJsonData()
    const form = inquiriesStore.form
    const activeFields = (inquiriesStore.fields || [])
      .filter((f) => f.status === 'active')
      .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))

    return {
      form,
      fields: activeFields,
    }
  },

  getAdminInquiryForm: () => {
    loadLocalJsonData()
    const allFields = [...(inquiriesStore.fields || [])].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
    return {
      form: inquiriesStore.form,
      fields: allFields,
    }
  },

  updateInquiryFormSettings: (updates) => {
    loadLocalJsonData()
    inquiriesStore.form = {
      ...inquiriesStore.form,
      ...updates,
      updated_at: new Date().toISOString(),
    }
    saveLocalJsonData()
    return inquiriesStore.form
  },

  saveInquiryFieldsBatch: (fieldsList) => {
    loadLocalJsonData()
    const updatedFields = fieldsList.map((f, index) => {
      let fieldId = f.id
      if (!fieldId || (typeof fieldId === 'string' && fieldId.startsWith('new_'))) {
        inquiriesStore.lastFieldId += 1
        fieldId = inquiriesStore.lastFieldId
      }
      return {
        id: fieldId,
        form_id: 1,
        label: f.label || '',
        placeholder: f.placeholder || '',
        field_name: f.field_name || `field_${fieldId}`,
        field_type: f.field_type || 'text',
        required: f.required ? 1 : 0,
        read_only: f.read_only ? 1 : 0,
        width: f.width || '100%',
        icon: f.icon || 'FileText',
        help_text: f.help_text || '',
        default_value: f.default_value || '',
        options: Array.isArray(f.options) ? f.options : typeof f.options === 'string' ? f.options.split('\n').map(s=>s.trim()).filter(Boolean) : [],
        sort_order: index + 1,
        status: f.status || 'active',
        created_at: f.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    })

    inquiriesStore.fields = updatedFields
    saveLocalJsonData()
    return inquiriesStore.fields
  },

  submitInquiryResponse: (data) => {
    loadLocalJsonData()
    inquiriesStore.lastResponseId += 1
    const newResponse = {
      id: inquiriesStore.lastResponseId,
      form_id: 1,
      response_data: data,
      status: 'new',
      created_at: new Date().toISOString(),
    }

    inquiriesStore.responses.unshift(newResponse)
    saveLocalJsonData()
    return newResponse
  },

  getAllInquiryResponses: ({ search = '', status = '', sortBy = 'created_at', sortOrder = 'desc', page = 1, limit = 10 }) => {
    loadLocalJsonData()
    let list = [...inquiriesStore.responses]

    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter((r) => JSON.stringify(r.response_data || {}).toLowerCase().includes(q))
    }

    if (status && status !== 'all') {
      list = list.filter((r) => r.status === status)
    }

    const orderMult = sortOrder.toLowerCase() === 'asc' ? 1 : -1
    list.sort((a, b) => {
      let valA = a[sortBy] || a.created_at
      let valB = b[sortBy] || b.created_at
      if (valA < valB) return -1 * orderMult
      if (valA > valB) return 1 * orderMult
      return 0
    })

    const total = list.length
    const offset = (parseInt(page) - 1) * parseInt(limit)
    const paginated = list.slice(offset, offset + parseInt(limit))

    return {
      responses: paginated,
      total,
      totalPages: Math.ceil(total / parseInt(limit)) || 1,
    }
  },

  updateInquiryResponseStatus: (id, status) => {
    loadLocalJsonData()
    const index = inquiriesStore.responses.findIndex((r) => Number(r.id) === Number(id))
    if (index === -1) return null

    inquiriesStore.responses[index].status = status
    saveLocalJsonData()
    return inquiriesStore.responses[index]
  },

  deleteInquiryResponse: (id) => {
    loadLocalJsonData()
    const index = inquiriesStore.responses.findIndex((r) => Number(r.id) === Number(id))
    if (index === -1) return false

    inquiriesStore.responses.splice(index, 1)
    saveLocalJsonData()
    return true
  },

  bulkDeleteInquiryResponses: (ids) => {
    loadLocalJsonData()
    const numericIds = ids.map((id) => Number(id))
    inquiriesStore.responses = inquiriesStore.responses.filter((r) => !numericIds.includes(Number(r.id)))
    saveLocalJsonData()
    return true
  },
}

export default db
