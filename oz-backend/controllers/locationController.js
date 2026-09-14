import mongoose from 'mongoose'
import Location from '../models/Location.js'
import Redirect from '../models/Redirect.js'
import LocationRevision from '../models/LocationRevision.js'
import { sendSuccess, sendError } from '../utils/response.js'
import { logActivity } from '../utils/activityLogger.js'
import {
  interpolateTitleTemplate,
  interpolateContent,
  interpolateObject,
  findNearbyLocations,
  calculateSeoHealth,
} from '../utils/seoEngine.js'

const parseIntOr = (value, fallback) => {
  const parsed = parseInt(value, 10)
  return Number.isNaN(parsed) ? fallback : parsed
}

const slugify = (value = '') =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'location'

const sanitizeArray = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean)
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
  }
  return []
}

const normalizeHighlights = (value) => {
  const items = sanitizeArray(value)
  return items.map((item) => {
    if (typeof item === 'string') {
      const separatorIndex = item.indexOf('|')
      if (separatorIndex >= 0) {
        return {
          title: item.slice(0, separatorIndex).trim(),
          desc: item.slice(separatorIndex + 1).trim(),
        }
      }
      return { title: item, desc: '' }
    }
    return {
      title: item?.title || '',
      desc: item?.desc || '',
    }
  })
}

const normalizeFaqs = (value) => {
  const items = sanitizeArray(value)
  return items.map((item) => {
    if (typeof item === 'string') {
      const separatorIndex = item.indexOf('|')
      if (separatorIndex >= 0) {
        return {
          question: item.slice(0, separatorIndex).trim(),
          answer: item.slice(separatorIndex + 1).trim(),
        }
      }
      return { question: item, answer: '' }
    }
    return {
      question: item?.question || '',
      answer: item?.answer || '',
    }
  })
}

const normalizeServices = (value) => {
  const items = sanitizeArray(value)
  return items.map((item) => {
    if (typeof item === 'string') {
      const parts = item.split('|')
      return {
        title: parts[0]?.trim() || '',
        description: parts[1]?.trim() || '',
        icon: parts[2]?.trim() || 'Truck',
        features: parts[3] ? parts[3].split(';').map((s) => s.trim()) : [],
      }
    }
    return {
      title: item?.title || '',
      description: item?.description || '',
      icon: item?.icon || 'Truck',
      features: Array.isArray(item?.features) ? item.features : [],
    }
  })
}

const normalizeProducts = (value) => {
  const items = sanitizeArray(value)
  return items.map((item) => {
    if (typeof item === 'string') {
      const parts = item.split('|')
      return {
        name: parts[0]?.trim() || '',
        description: parts[1]?.trim() || '',
        tag: parts[2]?.trim() || '',
        link: parts[3]?.trim() || '',
      }
    }
    return {
      name: item?.name || '',
      description: item?.description || '',
      tag: item?.tag || '',
      link: item?.link || '',
    }
  })
}

const normalizeTestimonials = (value) => {
  const items = sanitizeArray(value)
  return items.map((item) => {
    if (typeof item === 'string') {
      const parts = item.split('|')
      return {
        name: parts[0]?.trim() || 'Verified Customer',
        role: parts[1]?.trim() || 'Client',
        review: parts[2]?.trim() || '',
        rating: Number(parts[3]) || 5,
        locationTag: parts[4]?.trim() || '',
      }
    }
    return {
      name: item?.name || 'Verified Customer',
      role: item?.role || 'Client',
      review: item?.review || '',
      rating: Number(item?.rating) || 5,
      locationTag: item?.locationTag || '',
      avatar: item?.avatar || '',
    }
  })
}

const normalizeSeoFields = (body = {}) => {
  const seoSource = body.seo || {}
  const city = body.city || body.name || 'Location'
  const primaryKeyword = String(seoSource.primaryKeyword || body.name ? `Interstate Removalists ${body.name}` : '').trim()
  const titleTemplate = String(seoSource.titleTemplate || '{primaryKeyword} in {city} | OZ-INTERSTATE').trim()

  const defaultTitle = interpolateTitleTemplate(titleTemplate, {
    primaryKeyword,
    city,
    name: body.name,
    state: body.state,
    country: body.country || 'Australia',
  })

  return {
    title: String(seoSource.title || body.metaTitle || defaultTitle).trim(),
    metaDescription: String(
      seoSource.metaDescription ||
        body.metaDescription ||
        `Reliable interstate removalists and freight transport services for ${city} homes and businesses across Australia.`
    ).trim(),
    primaryKeyword,
    keywords: Array.isArray(seoSource.keywords)
      ? seoSource.keywords.filter(Boolean)
      : sanitizeArray(seoSource.keywords || `freight ${city}, removalists ${city}, interstate moving ${city}`),
    titleTemplate,
    h1: String(seoSource.h1 || body.heroTitle || `Interstate Removalists & Freight in ${city}`).trim(),
    canonicalUrl: String(seoSource.canonicalUrl || (body.slug ? `/location/${body.slug}` : '')).trim(),
    robots: seoSource.robots || (body.status === 'draft' ? 'noindex,nofollow' : 'index,follow'),
    noIndex: Boolean(seoSource.noIndex || body.status === 'draft' || body.status === 'unpublished'),
    noFollow: Boolean(seoSource.noFollow),
    ogTitle: String(seoSource.ogTitle || seoSource.title || defaultTitle).trim(),
    ogDescription: String(seoSource.ogDescription || seoSource.metaDescription || '').trim(),
    ogImage: String(seoSource.ogImage || body.heroImage || '/oz-logo.png').trim(),
    twitterTitle: String(seoSource.twitterTitle || seoSource.ogTitle || seoSource.title || defaultTitle).trim(),
    twitterDescription: String(seoSource.twitterDescription || seoSource.ogDescription || seoSource.metaDescription || '').trim(),
    twitterImage: String(seoSource.twitterImage || seoSource.ogImage || body.heroImage || '/oz-logo.png').trim(),
    breadcrumbName: String(seoSource.breadcrumbName || body.name || city).trim(),
  }
}

const normalizeSchema = (body = {}) => {
  const source = body.businessSchema || body.schema || {}
  const city = body.city || body.name || ''
  return {
    enabled: source.enabled !== false,
    type: String(source.type || 'MovingCompany').trim(),
    businessName: String(source.businessName || body.name ? `OZ Interstate Movers - ${body.name}` : 'OZ Interstate Movers').trim(),
    businessType: String(source.businessType || 'MovingCompany').trim(),
    priceRange: String(source.priceRange || '$$').trim(),
    address: {
      street: String(source.address?.street || body.address || '').trim(),
      city: String(source.address?.city || city).trim(),
      state: String(source.address?.state || body.state || '').trim(),
      postalCode: String(source.address?.postalCode || '').trim(),
      country: String(source.address?.country || body.country || 'AU').trim(),
    },
    latitude: source.latitude === '' || source.latitude === null || source.latitude === undefined ? null : Number(source.latitude),
    longitude: source.longitude === '' || source.longitude === null || source.longitude === undefined ? null : Number(source.longitude),
    customJsonLd: String(source.customJsonLd || '').trim(),
  }
}

/**
 * Public: Get published locations directory
 */
export const getPublicLocations = async (req, res) => {
  try {
    const { search = '', state = '', country = '', region = '', page, limit } = req.query

    const query = {
      isDeleted: { $ne: true },
      $or: [
        { status: 'published' },
        { status: 'active' },
        { isPublished: true },
      ],
    }

    if (state && state !== 'all') {
      query.state = new RegExp(`^${state.trim()}$`, 'i')
    }
    if (country && country !== 'all') {
      query.country = new RegExp(`^${country.trim()}$`, 'i')
    }
    if (region && region !== 'all') {
      query.region = new RegExp(region.trim(), 'i')
    }

    if (search && search.trim()) {
      const term = search.trim()
      query.$and = query.$and || []
      query.$and.push({
        $or: [
          { name: new RegExp(term, 'i') },
          { city: new RegExp(term, 'i') },
          { state: new RegExp(term, 'i') },
          { region: new RegExp(term, 'i') },
          { shortDescription: new RegExp(term, 'i') },
          { 'seo.keywords': new RegExp(term, 'i') },
        ],
      })
    }

    let queryBuilder = Location.find(query).sort({ name: 1 })

    if (page && limit) {
      const pageNum = parseIntOr(page, 1)
      const limitNum = parseIntOr(limit, 20)
      const skip = (pageNum - 1) * limitNum
      const [locations, total] = await Promise.all([
        queryBuilder.skip(skip).limit(limitNum).lean(),
        Location.countDocuments(query),
      ])
      return sendSuccess(res, 'Locations retrieved', {
        locations,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum) || 1,
        },
      })
    }

    const locations = await queryBuilder.lean()
    return sendSuccess(res, 'Locations retrieved', { locations, total: locations.length })
  } catch (error) {
    console.error('Error getting public locations:', error)
    return sendError(res, 'Failed to retrieve locations.', 500)
  }
}

/**
 * Public: Get single location by slug with template variable interpolation
 */
export const getPublicLocationBySlug = async (req, res) => {
  try {
    const { slug } = req.params
    const isPreview = req.query.preview === 'true'

    if (!slug) return sendError(res, 'Location slug is required', 400)

    const normalizedSlug = String(slug).trim().toLowerCase()

    const query = {
      slug: normalizedSlug,
      isDeleted: { $ne: true },
    }

    if (!isPreview) {
      query.$or = [
        { status: 'published' },
        { status: 'active' },
        { isPublished: true },
      ]
    }

    const location = await Location.findOne(query).populate('relatedLocations', 'name slug city state badge shortDescription').lean()

    if (!location) {
      // Check if a 301 redirect exists for this slug
      const redirect = await Redirect.findOne({
        source: { $in: [`/location/${normalizedSlug}`, `/locations/${normalizedSlug}`, normalizedSlug] },
        isActive: true,
      })

      if (redirect) {
        await Redirect.findByIdAndUpdate(redirect._id, { $inc: { hits: 1 } })
        return res.status(redirect.statusCode || 301).json({
          success: false,
          redirectUrl: redirect.destination,
          statusCode: redirect.statusCode || 301,
          message: 'Location moved',
        })
      }

      return sendError(res, 'Location not found', 404)
    }

    // Increment views count asynchronously
    Location.findByIdAndUpdate(location._id, { $inc: { views: 1 } }).catch(() => {})

    // Template variables
    const vars = {
      city: location.city || location.name || '',
      name: location.name || '',
      location_name: location.name || location.city || '',
      state: location.state || '',
      country: location.country || 'Australia',
      region: location.region || '',
      business_name: 'OZ-INTERSTATE',
      phone: location.phone || '1300 000 000',
    }

    // Apply template interpolation to content fields
    const enrichedLocation = {
      ...location,
      heroTitle: interpolateContent(location.heroTitle || `Interstate Removalists ${location.name}`, vars),
      heroSubtitle: interpolateContent(location.heroSubtitle || `Professional Moving & Transport Services in ${location.name}, ${location.state}`, vars),
      heroDescription: interpolateContent(location.heroDescription || location.shortDescription, vars),
      introTitle: interpolateContent(location.introTitle || `Trusted Removalists in ${location.name}`, vars),
      introContent: interpolateContent(location.introContent || location.introduction || location.description, vars),
      mainTitle: interpolateContent(location.mainTitle || `Seamless Interstate Moving To & From ${location.name}`, vars),
      mainContent: interpolateContent(location.mainContent || location.localBusinessDescription, vars),
      servicesTitle: interpolateContent(location.servicesTitle || `Moving & Freight Services Available in ${location.name}`, vars),
      servicesContent: interpolateContent(location.servicesContent, vars),
      highlightsTitle: interpolateContent(location.highlightsTitle || `Why Choose OZ Removalists in ${location.name}`, vars),
      faqTitle: interpolateContent(location.faqTitle || `${location.name} Moving & Transport FAQs`, vars),
      ctaTitle: interpolateContent(location.ctaTitle || `Book Your ${location.name} Move Today`, vars),
      ctaDescription: interpolateContent(location.ctaDescription || `Contact our ${location.name} moving specialists for a fast, fixed quote.`, vars),
      services: interpolateObject(location.services || [], vars),
      highlights: interpolateObject(location.highlights || [], vars),
      faqs: interpolateObject(location.faqs || [], vars),
      contentBlocks: interpolateObject(location.contentBlocks || [], vars),
      seo: {
        ...location.seo,
        title: interpolateContent(location.seo?.title || `Interstate Removalists ${location.name} | OZ-INTERSTATE`, vars),
        metaDescription: interpolateContent(
          location.seo?.metaDescription || `Reliable interstate removalists and freight services in ${location.name}, ${location.state}. Best rates, fully insured.`,
          vars
        ),
        h1: interpolateContent(location.seo?.h1 || `Interstate Removalists in ${location.name}`, vars),
        canonicalUrl: location.seo?.canonicalUrl || `/location/${location.slug}`,
        robots: isPreview ? 'noindex,nofollow' : location.seo?.robots || 'index,follow',
        ogTitle: interpolateContent(location.seo?.ogTitle || location.seo?.title || `Interstate Removalists ${location.name}`, vars),
        ogDescription: interpolateContent(location.seo?.ogDescription || location.seo?.metaDescription, vars),
        ogImage: location.seo?.ogImage || location.heroImage || '/oz-logo.png',
        breadcrumbName: location.seo?.breadcrumbName || location.name,
      },
    }

    // Attach nearby locations
    let nearby = location.relatedLocations || []
    if (nearby.length === 0) {
      const allPub = await Location.find({
        isDeleted: { $ne: true },
        $or: [{ status: 'published' }, { status: 'active' }, { isPublished: true }],
      }).lean()
      nearby = findNearbyLocations(location, allPub, 6)
    }
    enrichedLocation.nearbyLocations = nearby

    return sendSuccess(res, 'Location retrieved', {
      location: enrichedLocation,
      isPreview,
    })
  } catch (error) {
    console.error('Error getting location by slug:', error)
    return sendError(res, 'Failed to retrieve location.', 500)
  }
}

/**
 * Public: Get nearby locations for a slug
 */
export const getNearbyLocations = async (req, res) => {
  try {
    const { slug } = req.params
    const location = await Location.findOne({ slug, isDeleted: { $ne: true } }).lean()
    if (!location) return sendError(res, 'Location not found', 404)

    const allPub = await Location.find({
      isDeleted: { $ne: true },
      $or: [{ status: 'published' }, { status: 'active' }, { isPublished: true }],
    }).lean()

    const nearby = findNearbyLocations(location, allPub, 6)
    return sendSuccess(res, 'Nearby locations retrieved', { nearby })
  } catch (error) {
    console.error('Error getting nearby locations:', error)
    return sendError(res, 'Failed to retrieve nearby locations.', 500)
  }
}

/**
 * Admin: Get all locations with filters, pagination, and live SEO health scoring
 */
export const getLocations = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = 'all', state = 'all', sort = 'createdAt', order = 'desc' } = req.query

    const pageNum = parseIntOr(page, 1)
    const limitNum = parseIntOr(limit, 10)
    const skip = (pageNum - 1) * limitNum

    const query = { isDeleted: { $ne: true } }

    if (status && status !== 'all') {
      if (status === 'published') {
        query.$or = [{ status: 'published' }, { status: 'active' }, { isPublished: true }]
      } else {
        query.status = status
      }
    }

    if (state && state !== 'all') {
      query.state = new RegExp(`^${state.trim()}$`, 'i')
    }

    if (search && search.trim()) {
      const term = search.trim()
      query.$or = [
        { name: new RegExp(term, 'i') },
        { city: new RegExp(term, 'i') },
        { state: new RegExp(term, 'i') },
        { country: new RegExp(term, 'i') },
        { slug: new RegExp(term, 'i') },
        { shortDescription: new RegExp(term, 'i') },
      ]
    }

    const sortOption = {}
    sortOption[sort] = order === 'asc' ? 1 : -1

    const [locations, total, allForAudit] = await Promise.all([
      Location.find(query).sort(sortOption).skip(skip).limit(limitNum).lean(),
      Location.countDocuments(query),
      Location.find({ isDeleted: { $ne: true } }, 'name slug seo metaTitle').lean(),
    ])

    // Enrich with SEO health audits
    const enrichedLocations = locations.map((loc) => {
      const health = calculateSeoHealth(loc, allForAudit)
      return {
        ...loc,
        seoHealth: health,
        calculatedScore: health.score,
      }
    })

    return sendSuccess(res, 'Locations retrieved', {
      locations: enrichedLocations,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    })
  } catch (error) {
    console.error('Error getting admin locations:', error)
    return sendError(res, 'Failed to retrieve locations.', 500)
  }
}

/**
 * Admin: Get single location by ID with full details and revision history
 */
export const getLocationById = async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) return sendError(res, 'Invalid location id', 400)

    const [location, revisions, allLocations] = await Promise.all([
      Location.findOne({ _id: id, isDeleted: { $ne: true } }).lean(),
      LocationRevision.find({ locationId: id }).sort({ version: -1 }).limit(10).lean(),
      Location.find({ isDeleted: { $ne: true } }, 'name slug seo metaTitle').lean(),
    ])

    if (!location) return sendError(res, 'Location not found', 404)

    const seoHealth = calculateSeoHealth(location, allLocations)

    return sendSuccess(res, 'Location retrieved', {
      location,
      revisions,
      seoHealth,
    })
  } catch (error) {
    console.error('Error fetching location by id:', error)
    return sendError(res, 'Failed to retrieve location.', 500)
  }
}

/**
 * Admin: Create a new Location
 */
export const createLocation = async (req, res) => {
  try {
    const body = req.body || {}
    const name = String(body.name || '').trim()
    const state = String(body.state || '').trim()

    if (!name) return sendError(res, 'Location name is required', 400)
    if (!state) return sendError(res, 'Location state is required', 400)

    const slug = String(body.slug || slugify(name)).trim().toLowerCase()
    const existing = await Location.findOne({ slug, isDeleted: { $ne: true } }).lean()
    if (existing) return sendError(res, `A location with the slug "${slug}" already exists.`, 409)

    const seoNormalized = normalizeSeoFields(body)
    const schemaNormalized = normalizeSchema(body)

    const status = body.status || 'published'
    const isPublished = ['published', 'active'].includes(status)

    const payload = {
      slug,
      name,
      city: String(body.city || name).trim(),
      state,
      country: String(body.country || 'Australia').trim(),
      region: String(body.region || '').trim(),
      address: String(body.address || '').trim(),
      phone: String(body.phone || '').trim(),
      email: String(body.email || '').trim(),
      whatsappNumber: String(body.whatsappNumber || '').trim(),
      badge: String(body.badge || 'Service Available').trim(),
      shortDescription: String(body.shortDescription || '').trim(),
      description: String(body.description || '').trim(),
      introduction: String(body.introduction || '').trim(),
      localBusinessDescription: String(body.localBusinessDescription || '').trim(),

      // Hero
      heroTitle: String(body.heroTitle || `Interstate Removalists ${name}`).trim(),
      heroSubtitle: String(body.heroSubtitle || `Professional Moving & Transport Services in ${name}, ${state}`).trim(),
      heroDescription: String(body.heroDescription || '').trim(),
      heroImage: String(body.heroImage || '').trim(),
      heroCtaText: String(body.heroCtaText || 'Get Free Estimate').trim(),
      heroCtaUrl: String(body.heroCtaUrl || '#quote').trim(),

      // Landing content
      introTitle: String(body.introTitle || '').trim(),
      introContent: String(body.introContent || '').trim(),
      mainTitle: String(body.mainTitle || '').trim(),
      mainContent: String(body.mainContent || '').trim(),
      servicesTitle: String(body.servicesTitle || '').trim(),
      servicesContent: String(body.servicesContent || '').trim(),
      highlightsTitle: String(body.highlightsTitle || '').trim(),
      faqTitle: String(body.faqTitle || '').trim(),

      // Products & Services
      products: normalizeProducts(body.products),
      services: normalizeServices(body.services),
      highlights: normalizeHighlights(body.highlights),
      faqs: normalizeFaqs(body.faqs),
      testimonials: normalizeTestimonials(body.testimonials),
      popularRoutes: sanitizeArray(body.popularRoutes),
      nearbyAreas: sanitizeArray(body.nearbyAreas),
      relatedLocations: Array.isArray(body.relatedLocations) ? body.relatedLocations.filter(mongoose.Types.ObjectId.isValid) : [],
      contentBlocks: Array.isArray(body.contentBlocks) ? body.contentBlocks : [],

      // CTA
      ctaTitle: String(body.ctaTitle || `Book Your ${name} Move Today`).trim(),
      ctaDescription: String(body.ctaDescription || '').trim(),
      ctaButtonText: String(body.ctaButtonText || 'Request a Quote').trim(),
      ctaButtonUrl: String(body.ctaButtonUrl || '/contact').trim(),
      rfqLink: String(body.rfqLink || '#quote').trim(),

      // Coordinates
      coordinates: {
        latitude: body.coordinates?.latitude != null && body.coordinates?.latitude !== '' ? Number(body.coordinates.latitude) : schemaNormalized.latitude,
        longitude: body.coordinates?.longitude != null && body.coordinates?.longitude !== '' ? Number(body.coordinates.longitude) : schemaNormalized.longitude,
      },

      // SEO & Schema
      seo: seoNormalized,
      businessSchema: schemaNormalized,

      status,
      isPublished,
      publishedAt: isPublished ? new Date() : null,
    }

    // Calculate SEO score
    const seoHealth = calculateSeoHealth(payload)
    payload.seoScore = seoHealth.score
    payload.seoWarnings = seoHealth.warnings

    const location = await Location.create(payload)

    // Create Revision v1
    await LocationRevision.create({
      locationId: location._id,
      version: 1,
      changedBy: req.user?.name || req.user?.email || 'Admin',
      summary: 'Initial location creation',
      snapshot: location.toObject(),
    })

    logActivity({
      req,
      user: req.user,
      action: 'LOCATION_CREATE',
      module: 'LOCATIONS',
      description: `Location ${location.name} created (${location.slug})`,
      entityId: location._id,
      entityType: 'Location',
      metadata: { name: location.name, slug: location.slug, status: location.status },
    })

    return sendSuccess(res, 'Location created successfully', { location }, 201)
  } catch (error) {
    console.error('Error creating location:', error)
    return sendError(res, error.message || 'Failed to create location.', 500)
  }
}

/**
 * Admin: Update Location with automatic 301 Redirect creation on slug change
 */
export const updateLocation = async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) return sendError(res, 'Invalid location id', 400)

    const existing = await Location.findOne({ _id: id, isDeleted: { $ne: true } })
    if (!existing) return sendError(res, 'Location not found', 404)

    const body = { ...req.body }
    delete body._id
    delete body.createdAt
    delete body.updatedAt

    const oldSlug = existing.slug
    const newSlug = body.slug ? slugify(body.slug) : slugify(body.name || existing.name)

    // Handle slug change & register 301 redirect
    if (newSlug !== oldSlug) {
      const duplicate = await Location.findOne({
        slug: newSlug,
        _id: { $ne: id },
        isDeleted: { $ne: true },
      }).lean()
      if (duplicate) {
        return sendError(res, `A location with the slug "${newSlug}" already exists.`, 409)
      }

      // If existing location was published, preserve SEO equity with a 301 redirect
      if (existing.isPublished || existing.status === 'published' || existing.status === 'active') {
        const oldPath = `/location/${oldSlug}`
        const newPath = `/location/${newSlug}`

        await Redirect.findOneAndUpdate(
          { source: oldPath },
          {
            source: oldPath,
            destination: newPath,
            statusCode: 301,
            isActive: true,
            notes: `Auto-generated on location slug migration: ${oldSlug} -> ${newSlug}`,
          },
          { upsert: true, new: true }
        )

        // Also add /locations/{oldSlug}
        await Redirect.findOneAndUpdate(
          { source: `/locations/${oldSlug}` },
          {
            source: `/locations/${oldSlug}`,
            destination: `/locations/${newSlug}`,
            statusCode: 301,
            isActive: true,
            notes: `Auto-generated on location slug migration: ${oldSlug} -> ${newSlug}`,
          },
          { upsert: true, new: true }
        )
      }

      body.slug = newSlug
    }

    if (body.services) body.services = normalizeServices(body.services)
    if (body.products) body.products = normalizeProducts(body.products)
    if (body.highlights) body.highlights = normalizeHighlights(body.highlights)
    if (body.faqs) body.faqs = normalizeFaqs(body.faqs)
    if (body.testimonials) body.testimonials = normalizeTestimonials(body.testimonials)
    if (body.popularRoutes) body.popularRoutes = sanitizeArray(body.popularRoutes)
    if (body.nearbyAreas) body.nearbyAreas = sanitizeArray(body.nearbyAreas)
    if (body.seo) body.seo = normalizeSeoFields(body)
    if (body.businessSchema) body.businessSchema = normalizeSchema(body)

    if (body.status) {
      body.isPublished = ['published', 'active'].includes(body.status)
      if (body.isPublished && !existing.publishedAt) {
        body.publishedAt = new Date()
      }
    }

    // Recalculate SEO Health
    const seoHealth = calculateSeoHealth(body)
    body.seoScore = seoHealth.score
    body.seoWarnings = seoHealth.warnings

    const updated = await Location.findByIdAndUpdate(id, body, { new: true }).lean()

    // Save revision history
    const latestRevision = await LocationRevision.findOne({ locationId: id }).sort({ version: -1 })
    const nextVersion = (latestRevision?.version || 1) + 1

    await LocationRevision.create({
      locationId: id,
      version: nextVersion,
      changedBy: req.user?.name || req.user?.email || 'Admin',
      summary: body.revisionSummary || (newSlug !== oldSlug ? `Slug updated to ${newSlug}` : 'Updated location content & SEO'),
      snapshot: updated,
    })

    logActivity({
      req,
      user: req.user,
      action: 'LOCATION_UPDATE',
      module: 'LOCATIONS',
      description: `Location ${updated.name} updated (Version ${nextVersion})`,
      entityId: updated._id,
      entityType: 'Location',
      metadata: { name: updated.name, slug: updated.slug, version: nextVersion },
    })

    return sendSuccess(res, 'Location updated successfully', { location: updated })
  } catch (error) {
    console.error('Error updating location:', error)
    return sendError(res, error.message || 'Failed to update location.', 500)
  }
}

/**
 * Admin: Duplicate location as a new draft
 */
export const duplicateLocation = async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) return sendError(res, 'Invalid location id', 400)

    const source = await Location.findOne({ _id: id, isDeleted: { $ne: true } }).lean()
    if (!source) return sendError(res, 'Source location not found', 404)

    let duplicateSlug = `${source.slug}-copy`
    let count = 1
    while (await Location.findOne({ slug: duplicateSlug, isDeleted: { $ne: true } })) {
      count += 1
      duplicateSlug = `${source.slug}-copy-${count}`
    }

    const payload = {
      ...source,
      _id: new mongoose.Types.ObjectId(),
      name: `${source.name} (Copy)`,
      slug: duplicateSlug,
      status: 'draft',
      isPublished: false,
      publishedAt: null,
      views: 0,
      leadsCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const duplicated = await Location.create(payload)

    await LocationRevision.create({
      locationId: duplicated._id,
      version: 1,
      changedBy: req.user?.name || req.user?.email || 'Admin',
      summary: `Duplicated from ${source.name} (${source.slug})`,
      snapshot: duplicated.toObject(),
    })

    logActivity({
      req,
      user: req.user,
      action: 'LOCATION_DUPLICATE',
      module: 'LOCATIONS',
      description: `Duplicated ${source.name} to ${duplicated.name}`,
      entityId: duplicated._id,
      entityType: 'Location',
    })

    return sendSuccess(res, 'Location duplicated successfully', { location: duplicated }, 201)
  } catch (error) {
    console.error('Error duplicating location:', error)
    return sendError(res, 'Failed to duplicate location.', 500)
  }
}

/**
 * Admin: Toggle publish / status
 */
export const toggleLocationStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body || {}

    if (!mongoose.Types.ObjectId.isValid(id)) return sendError(res, 'Invalid location id', 400)

    const validStatuses = ['published', 'draft', 'unpublished', 'archived', 'active', 'inactive']
    if (!validStatuses.includes(status)) return sendError(res, 'Invalid status', 400)

    const isPublished = ['published', 'active'].includes(status)
    const updateData = {
      status,
      isPublished,
    }
    if (isPublished) updateData.publishedAt = new Date()

    const location = await Location.findByIdAndUpdate(id, updateData, { new: true }).lean()
    if (!location) return sendError(res, 'Location not found', 404)

    logActivity({
      req,
      user: req.user,
      action: 'LOCATION_STATUS_CHANGE',
      module: 'LOCATIONS',
      description: `Location ${location.name} status changed to ${status}`,
      entityId: location._id,
      entityType: 'Location',
      metadata: { status, isPublished },
    })

    return sendSuccess(res, 'Location status updated', { location })
  } catch (error) {
    console.error('Error toggling location status:', error)
    return sendError(res, 'Failed to update location status.', 500)
  }
}

/**
 * Admin: Bulk publish locations
 */
export const bulkPublishLocations = async (req, res) => {
  try {
    const { ids = [] } = req.body
    if (!Array.isArray(ids) || ids.length === 0) return sendError(res, 'No location IDs provided', 400)

    await Location.updateMany(
      { _id: { $in: ids }, isDeleted: { $ne: true } },
      { status: 'published', isPublished: true, publishedAt: new Date() }
    )

    return sendSuccess(res, `Successfully published ${ids.length} locations.`)
  } catch (error) {
    console.error('Error bulk publishing locations:', error)
    return sendError(res, 'Failed to bulk publish locations.', 500)
  }
}

/**
 * Admin: Bulk unpublish locations
 */
export const bulkUnpublishLocations = async (req, res) => {
  try {
    const { ids = [] } = req.body
    if (!Array.isArray(ids) || ids.length === 0) return sendError(res, 'No location IDs provided', 400)

    await Location.updateMany(
      { _id: { $in: ids }, isDeleted: { $ne: true } },
      { status: 'unpublished', isPublished: false }
    )

    return sendSuccess(res, `Successfully unpublished ${ids.length} locations.`)
  } catch (error) {
    console.error('Error bulk unpublishing locations:', error)
    return sendError(res, 'Failed to bulk unpublish locations.', 500)
  }
}

/**
 * Admin: Bulk delete locations (soft delete)
 */
export const bulkDeleteLocations = async (req, res) => {
  try {
    const { ids = [] } = req.body
    if (!Array.isArray(ids) || ids.length === 0) return sendError(res, 'No location IDs provided', 400)

    await Location.updateMany(
      { _id: { $in: ids } },
      { status: 'inactive', isDeleted: true, isPublished: false }
    )

    return sendSuccess(res, `Successfully deleted ${ids.length} locations.`)
  } catch (error) {
    console.error('Error bulk deleting locations:', error)
    return sendError(res, 'Failed to bulk delete locations.', 500)
  }
}

/**
 * Admin: Delete a location (soft delete)
 */
export const deleteLocation = async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) return sendError(res, 'Invalid location id', 400)

    const location = await Location.findByIdAndUpdate(
      id,
      { status: 'inactive', isDeleted: true, isPublished: false },
      { new: true }
    ).lean()

    if (!location) return sendError(res, 'Location not found', 404)

    logActivity({
      req,
      user: req.user,
      action: 'LOCATION_DELETE',
      module: 'LOCATIONS',
      description: `Location ${location.name} soft deleted`,
      entityId: location._id,
      entityType: 'Location',
    })

    return sendSuccess(res, 'Location deleted successfully', { location })
  } catch (error) {
    console.error('Error deleting location:', error)
    return sendError(res, 'Failed to delete location.', 500)
  }
}

/**
 * Admin: Real-time SEO Health Check for a location
 */
export const getSeoHealth = async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) return sendError(res, 'Invalid location id', 400)

    const [location, allLocations] = await Promise.all([
      Location.findOne({ _id: id, isDeleted: { $ne: true } }).lean(),
      Location.find({ isDeleted: { $ne: true } }, 'name slug seo metaTitle').lean(),
    ])

    if (!location) return sendError(res, 'Location not found', 404)

    const seoHealth = calculateSeoHealth(location, allLocations)
    return sendSuccess(res, 'SEO health audit completed', { seoHealth })
  } catch (error) {
    console.error('Error checking SEO health:', error)
    return sendError(res, 'Failed to audit SEO health.', 500)
  }
}

/**
 * Admin: Get revision history for a location
 */
export const getLocationRevisions = async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) return sendError(res, 'Invalid location id', 400)

    const revisions = await LocationRevision.find({ locationId: id }).sort({ version: -1 }).lean()
    return sendSuccess(res, 'Location revisions retrieved', { revisions })
  } catch (error) {
    console.error('Error getting location revisions:', error)
    return sendError(res, 'Failed to retrieve location revisions.', 500)
  }
}

/**
 * Admin: Restore a specific revision version
 */
export const restoreLocationRevision = async (req, res) => {
  try {
    const { id, version } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) return sendError(res, 'Invalid location id', 400)

    const revision = await LocationRevision.findOne({ locationId: id, version: Number(version) }).lean()
    if (!revision || !revision.snapshot) return sendError(res, 'Revision not found', 404)

    const snapshot = { ...revision.snapshot }
    delete snapshot._id
    delete snapshot.createdAt
    delete snapshot.updatedAt

    const restored = await Location.findByIdAndUpdate(id, snapshot, { new: true }).lean()

    const latest = await LocationRevision.findOne({ locationId: id }).sort({ version: -1 })
    const nextVer = (latest?.version || 1) + 1

    await LocationRevision.create({
      locationId: id,
      version: nextVer,
      changedBy: req.user?.name || req.user?.email || 'Admin',
      summary: `Restored from version ${version}`,
      snapshot: restored,
    })

    logActivity({
      req,
      user: req.user,
      action: 'LOCATION_RESTORE_VERSION',
      module: 'LOCATIONS',
      description: `Restored location ${restored.name} from version ${version}`,
      entityId: restored._id,
      entityType: 'Location',
    })

    return sendSuccess(res, `Location successfully restored to version ${version}`, { location: restored })
  } catch (error) {
    console.error('Error restoring location revision:', error)
    return sendError(res, 'Failed to restore revision.', 500)
  }
}

/**
 * Admin: Location Analytics & SEO Overview
 */
export const getLocationsAnalytics = async (req, res) => {
  try {
    const [
      total,
      published,
      draft,
      unpublished,
      archived,
      allLocations,
    ] = await Promise.all([
      Location.countDocuments({ isDeleted: { $ne: true } }),
      Location.countDocuments({ isDeleted: { $ne: true }, $or: [{ status: 'published' }, { status: 'active' }, { isPublished: true }] }),
      Location.countDocuments({ isDeleted: { $ne: true }, status: 'draft' }),
      Location.countDocuments({ isDeleted: { $ne: true }, status: 'unpublished' }),
      Location.countDocuments({ isDeleted: { $ne: true }, status: 'archived' }),
      Location.find({ isDeleted: { $ne: true } }, 'name slug state city seoScore views leadsCount status isPublished').lean(),
    ])

    const totalScore = allLocations.reduce((acc, l) => acc + (l.seoScore || 80), 0)
    const avgSeoScore = total > 0 ? Math.round(totalScore / total) : 100

    const topLocations = [...allLocations].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5)
    const topLeads = [...allLocations].sort((a, b) => (b.leadsCount || 0) - (a.leadsCount || 0)).slice(0, 5)

    return sendSuccess(res, 'Location analytics retrieved', {
      total,
      published,
      draft,
      unpublished,
      archived,
      avgSeoScore,
      topLocations,
      topLeads,
    })
  } catch (error) {
    console.error('Error getting location analytics:', error)
    return sendError(res, 'Failed to retrieve location analytics.', 500)
  }
}
