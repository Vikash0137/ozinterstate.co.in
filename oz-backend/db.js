import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dataFilePath = path.join(__dirname, 'banners.json')
const inquiriesFilePath = path.join(__dirname, 'inquiries.json')

let bannersStore = []
let lastId = 0

let inquiriesStore = {
  form: null,
  fields: [],
  responses: [],
  lastFieldId: 0,
  lastResponseId: 0,
}

function loadData() {
  try {
    if (fs.existsSync(dataFilePath)) {
      const fileData = fs.readFileSync(dataFilePath, 'utf8')
      bannersStore = JSON.parse(fileData)
      if (Array.isArray(bannersStore) && bannersStore.length > 0) {
        lastId = Math.max(...bannersStore.map((b) => b.id || 0))
      }
    }
  } catch (err) {
    console.error('Error loading banners data:', err)
    bannersStore = []
  }

  try {
    if (fs.existsSync(inquiriesFilePath)) {
      const fileData = fs.readFileSync(inquiriesFilePath, 'utf8')
      const parsed = JSON.parse(fileData)
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

function saveData() {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(bannersStore, null, 2), 'utf8')
  } catch (err) {
    console.error('Error saving banners data:', err)
  }
}

function saveInquiriesData() {
  try {
    fs.writeFileSync(inquiriesFilePath, JSON.stringify(inquiriesStore, null, 2), 'utf8')
  } catch (err) {
    console.error('Error saving inquiries data:', err)
  }
}

export function initDb() {
  loadData()

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
      font_family: 'Inter',
      title_font_size: '48px',
      title_font_weight: '800',
      title_font_style: 'normal',
      title_color: '#ffffff',
      title_letter_spacing: '0px',
      title_line_height: '1.1',
      title_text_transform: 'none',
      description_font_family: 'Inter',
      description_font_size: '16px',
      description_font_weight: '400',
      description_font_style: 'normal',
      description_color: '#ffffff',
      description_letter_spacing: '0px',
      description_line_height: '1.6',
      description_text_alignment: 'left',
      button_font_family: 'Inter',
      button_font_size: '14px',
      button_font_weight: '700',
      button_text_color: '#ffffff',
      button_background_color: '#0284c7',
      button_hover_color: '#0369a1',
      button_hover_text_color: '#ffffff',
      button_border_radius: '12px',
      button_border_color: 'transparent',
      text_alignment: 'left',
      display_order: 1,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    bannersStore.push(defaultBanner)
    lastId = 1
    saveData()
    console.log('Seed banner initialized successfully.')
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
      {
        id: 1,
        form_id: 1,
        label: 'Full Name',
        placeholder: 'Full Name',
        field_name: 'name',
        field_type: 'text',
        required: 1,
        read_only: 0,
        width: '50%',
        icon: 'User',
        help_text: '',
        default_value: '',
        options: [],
        sort_order: 1,
        status: 'active',
      },
      {
        id: 2,
        form_id: 1,
        label: 'Phone Number',
        placeholder: 'Phone Number',
        field_name: 'phone',
        field_type: 'phone',
        required: 1,
        read_only: 0,
        width: '50%',
        icon: 'Phone',
        help_text: '',
        default_value: '',
        options: [],
        sort_order: 2,
        status: 'active',
      },
      {
        id: 3,
        form_id: 1,
        label: 'Email Address',
        placeholder: 'Email Address',
        field_name: 'email',
        field_type: 'email',
        required: 0,
        read_only: 0,
        width: '100%',
        icon: 'Mail',
        help_text: '',
        default_value: '',
        options: [],
        sort_order: 3,
        status: 'active',
      },
      {
        id: 4,
        form_id: 1,
        label: 'Moving From',
        placeholder: 'Moving From',
        field_name: 'from',
        field_type: 'text',
        required: 1,
        read_only: 0,
        width: '100%',
        icon: 'MapPin',
        help_text: '',
        default_value: '',
        options: [],
        sort_order: 4,
        status: 'active',
      },
      {
        id: 5,
        form_id: 1,
        label: 'Moving To',
        placeholder: 'Moving To',
        field_name: 'to',
        field_type: 'text',
        required: 1,
        read_only: 0,
        width: '100%',
        icon: 'MapPin',
        help_text: '',
        default_value: '',
        options: [],
        sort_order: 5,
        status: 'active',
      },
      {
        id: 6,
        form_id: 1,
        label: 'Moving Date',
        placeholder: '',
        field_name: 'date',
        field_type: 'date',
        required: 0,
        read_only: 0,
        width: '50%',
        icon: 'CalendarDays',
        help_text: '',
        default_value: '',
        options: [],
        sort_order: 6,
        status: 'active',
      },
      {
        id: 7,
        form_id: 1,
        label: 'Property Type',
        placeholder: 'Property Type',
        field_name: 'property',
        field_type: 'select',
        required: 0,
        read_only: 0,
        width: '50%',
        icon: 'Home',
        help_text: '',
        default_value: '',
        options: ['1 Bedroom', '2 Bedroom', '3 Bedroom', '4 Bedroom', 'Office'],
        sort_order: 7,
        status: 'active',
      },
    ]

    inquiriesStore.lastFieldId = 7
    inquiriesStore.lastResponseId = 0
    saveInquiriesData()
    console.log('Seed inquiry form and fields initialized successfully.')
  }
}

export const db = {
  // Banner DB methods
  getActiveBanner: () => {
    loadData()
    const active = bannersStore
      .filter((b) => b.status === 'active')
      .sort((a, b) => (a.display_order || 0) - (b.display_order || 0) || b.id - a.id)
    if (active.length > 0) return active[0]
    return bannersStore.length > 0 ? bannersStore[0] : null
  },

  getAllBanners: ({ search = '', status = '', sortBy = 'display_order', sortOrder = 'asc', page = 1, limit = 10 }) => {
    loadData()
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
    loadData()
    return bannersStore.find((b) => Number(b.id) === Number(id)) || null
  },

  createBanner: (data) => {
    loadData()
    lastId += 1
    const now = new Date().toISOString()
    const newBanner = {
      id: lastId,
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
      font_family: data.font_family || 'Inter',
      title_font_size: data.title_font_size || '48px',
      title_font_weight: data.title_font_weight || '800',
      title_font_style: data.title_font_style || 'normal',
      title_color: data.title_color || '#ffffff',
      title_letter_spacing: data.title_letter_spacing || '0px',
      title_line_height: data.title_line_height || '1.1',
      title_text_transform: data.title_text_transform || 'none',
      description_font_family: data.description_font_family || 'Inter',
      description_font_size: data.description_font_size || '16px',
      description_font_weight: data.description_font_weight || '400',
      description_font_style: data.description_font_style || 'normal',
      description_color: data.description_color || '#ffffff',
      description_letter_spacing: data.description_letter_spacing || '0px',
      description_line_height: data.description_line_height || '1.6',
      description_text_alignment: data.description_text_alignment || 'left',
      button_font_family: data.button_font_family || 'Inter',
      button_font_size: data.button_font_size || '14px',
      button_font_weight: data.button_font_weight || '700',
      button_text_color: data.button_text_color || '#ffffff',
      button_background_color: data.button_background_color || '#0284c7',
      button_hover_color: data.button_hover_color || '#0369a1',
      button_hover_text_color: data.button_hover_text_color || '#ffffff',
      button_border_radius: data.button_border_radius || '12px',
      button_border_color: data.button_border_color || 'transparent',
      text_alignment: data.text_alignment || 'left',
      display_order: parseInt(data.display_order) || 1,
      status: data.status || 'active',
      created_at: now,
      updated_at: now,
    }

    bannersStore.push(newBanner)
    saveData()
    return newBanner
  },

  updateBanner: (id, updates) => {
    loadData()
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
    saveData()
    return updated
  },

  deleteBanner: (id) => {
    loadData()
    const index = bannersStore.findIndex((b) => Number(b.id) === Number(id))
    if (index === -1) return false

    bannersStore.splice(index, 1)
    saveData()
    return true
  },

  // Inquiry Form & Field DB methods
  getPublicInquiryForm: () => {
    loadData()
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
    loadData()
    const allFields = [...(inquiriesStore.fields || [])].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
    return {
      form: inquiriesStore.form,
      fields: allFields,
    }
  },

  updateInquiryFormSettings: (updates) => {
    loadData()
    inquiriesStore.form = {
      ...inquiriesStore.form,
      ...updates,
      updated_at: new Date().toISOString(),
    }
    saveInquiriesData()
    return inquiriesStore.form
  },

  saveInquiryFieldsBatch: (fieldsList) => {
    loadData()
    const updatedFields = fieldsList.map((f, index) => {
      let fieldId = f.id
      if (!fieldId || typeof fieldId === 'string' && fieldId.startsWith('new_')) {
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
        validation: f.validation || '',
        error_message: f.error_message || '',
        css_class: f.css_class || '',
        options: Array.isArray(f.options) ? f.options : typeof f.options === 'string' ? f.options.split('\n').map(s=>s.trim()).filter(Boolean) : [],
        sort_order: index + 1,
        status: f.status || 'active',
        created_at: f.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    })

    inquiriesStore.fields = updatedFields
    saveInquiriesData()
    return inquiriesStore.fields
  },

  // Inquiry Responses DB methods
  submitInquiryResponse: (data) => {
    loadData()
    inquiriesStore.lastResponseId += 1
    const newResponse = {
      id: inquiriesStore.lastResponseId,
      form_id: 1,
      response_data: data,
      status: 'new', // 'new', 'contacted', 'completed', 'spam'
      created_at: new Date().toISOString(),
    }

    inquiriesStore.responses.unshift(newResponse)
    saveInquiriesData()
    return newResponse
  },

  getAllInquiryResponses: ({ search = '', status = '', sortBy = 'created_at', sortOrder = 'desc', page = 1, limit = 10 }) => {
    loadData()
    let list = [...inquiriesStore.responses]

    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter((r) => {
        const jsonStr = JSON.stringify(r.response_data || {}).toLowerCase()
        return jsonStr.includes(q)
      })
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
    loadData()
    const index = inquiriesStore.responses.findIndex((r) => Number(r.id) === Number(id))
    if (index === -1) return null

    inquiriesStore.responses[index].status = status
    saveInquiriesData()
    return inquiriesStore.responses[index]
  },

  deleteInquiryResponse: (id) => {
    loadData()
    const index = inquiriesStore.responses.findIndex((r) => Number(r.id) === Number(id))
    if (index === -1) return false

    inquiriesStore.responses.splice(index, 1)
    saveInquiriesData()
    return true
  },

  bulkDeleteInquiryResponses: (ids) => {
    loadData()
    const numericIds = ids.map((id) => Number(id))
    inquiriesStore.responses = inquiriesStore.responses.filter((r) => !numericIds.includes(Number(r.id)))
    saveInquiriesData()
    return true
  },
}

export default db
