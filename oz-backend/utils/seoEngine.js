/**
 * Advanced SEO Engine & Utilities for Location-Based Pages
 */

const DEFAULT_BUSINESS_NAME = 'OZ-INTERSTATE'

/**
 * Interpolate title templates with variables
 * Supported tokens: {primaryKeyword}, {city}, {location}, {state}, {country}, {businessName}
 */
export const interpolateTitleTemplate = (template = '', vars = {}) => {
  if (!template) {
    const city = vars.city || vars.name || 'Australia'
    const keyword = vars.primaryKeyword || 'Interstate Removalists & Freight'
    const business = vars.businessName || DEFAULT_BUSINESS_NAME
    return `${keyword} in ${city} | ${business}`
  }

  const replacements = {
    '{primaryKeyword}': vars.primaryKeyword || 'Interstate Removalists',
    '{city}': vars.city || vars.name || '',
    '{location}': vars.name || vars.city || '',
    '{state}': vars.state || '',
    '{country}': vars.country || 'Australia',
    '{region}': vars.region || '',
    '{businessName}': vars.businessName || DEFAULT_BUSINESS_NAME,
  }

  let result = template
  for (const [key, val] of Object.entries(replacements)) {
    result = result.replaceAll(key, val)
  }
  return result.trim()
}

/**
 * Replace double-curly variables like {{city}}, {{location_name}}, {{state}}, etc.
 */
export const interpolateContent = (content, vars = {}) => {
  if (!content) return ''
  if (typeof content !== 'string') return content

  const replacements = {
    '{{city}}': vars.city || vars.name || '',
    '{{location_name}}': vars.name || vars.city || '',
    '{{name}}': vars.name || vars.city || '',
    '{{state}}': vars.state || '',
    '{{country}}': vars.country || 'Australia',
    '{{region}}': vars.region || '',
    '{{business_name}}': vars.businessName || DEFAULT_BUSINESS_NAME,
    '{{phone}}': vars.phone || '1300 000 000',
  }

  let result = content
  for (const [key, val] of Object.entries(replacements)) {
    result = result.replaceAll(key, val)
  }
  return result
}

/**
 * Deeply interpolate strings in arrays or nested objects
 */
export const interpolateObject = (data, vars) => {
  if (!data) return data
  if (typeof data === 'string') return interpolateContent(data, vars)
  if (Array.isArray(data)) return data.map((item) => interpolateObject(item, vars))
  if (typeof data === 'object') {
    const output = {}
    for (const key of Object.keys(data)) {
      output[key] = interpolateObject(data[key], vars)
    }
    return output
  }
  return data
}

/**
 * Calculate Haversine distance in kilometers between two geo coordinates
 */
export const calculateHaversineDistance = (lat1, lon1, lat2, lon2) => {
  if (
    lat1 === null ||
    lon1 === null ||
    lat2 === null ||
    lon2 === null ||
    isNaN(lat1) ||
    isNaN(lon1) ||
    isNaN(lat2) ||
    isNaN(lon2)
  ) {
    return null
  }

  const toRad = (value) => (value * Math.PI) / 180
  const R = 6371 // Earth radius in km

  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round(R * c)
}

/**
 * Find nearest locations using coordinates, with fallback to same state
 */
export const findNearbyLocations = (currentLocation, allLocations = [], limit = 6) => {
  if (!currentLocation || !Array.isArray(allLocations) || allLocations.length === 0) {
    return []
  }

  const currentId = String(currentLocation._id || currentLocation.id || '')
  const currentSlug = currentLocation.slug

  const candidates = allLocations.filter((loc) => {
    const locId = String(loc._id || loc.id || '')
    return (
      locId !== currentId &&
      loc.slug !== currentSlug &&
      (loc.status === 'published' || loc.status === 'active' || loc.isPublished === true) &&
      !loc.isDeleted
    )
  })

  const currentLat = currentLocation.coordinates?.latitude || currentLocation.businessSchema?.latitude
  const currentLon = currentLocation.coordinates?.longitude || currentLocation.businessSchema?.longitude

  const withDistances = candidates.map((loc) => {
    const locLat = loc.coordinates?.latitude || loc.businessSchema?.latitude
    const locLon = loc.coordinates?.longitude || loc.businessSchema?.longitude

    let distance = null
    if (currentLat != null && currentLon != null && locLat != null && locLon != null) {
      distance = calculateHaversineDistance(currentLat, currentLon, locLat, locLon)
    }

    const sameState = loc.state && currentLocation.state && loc.state.toLowerCase() === currentLocation.state.toLowerCase()

    return {
      _id: loc._id,
      name: loc.name,
      slug: loc.slug,
      city: loc.city || loc.name,
      state: loc.state,
      country: loc.country || 'Australia',
      badge: loc.badge || 'Service Available',
      shortDescription: loc.shortDescription || '',
      distanceKm: distance,
      sameState,
    }
  })

  // Sort by calculated distance first, then same state, then alphabetical
  withDistances.sort((a, b) => {
    if (a.distanceKm != null && b.distanceKm != null) {
      return a.distanceKm - b.distanceKm
    }
    if (a.distanceKm != null) return -1
    if (b.distanceKm != null) return 1
    if (a.sameState && !b.sameState) return -1
    if (!a.sameState && b.sameState) return 1
    return (a.name || '').localeCompare(b.name || '')
  })

  return withDistances.slice(0, limit)
}

/**
 * Calculate SEO Health Score & perform automated validations
 * Returns score: 0-100, warnings, and check items
 */
export const calculateSeoHealth = (location = {}, otherLocations = []) => {
  const checks = []
  let score = 0
  const warnings = []

  const city = location.city || location.name || ''
  const title = location.seo?.title || location.metaTitle || ''
  const description = location.seo?.metaDescription || location.metaDescription || ''
  const h1 = location.seo?.h1 || location.heroTitle || ''
  const canonical = location.seo?.canonicalUrl || ''
  const ogImage = location.seo?.ogImage || location.featuredImage || ''
  const primaryKeyword = location.seo?.primaryKeyword || ''
  const faqs = Array.isArray(location.faqs) ? location.faqs : []
  const services = Array.isArray(location.services) ? location.services : []
  const coordinates = location.coordinates || location.businessSchema || {}

  // 1. Location Name & Slug (10 pts)
  if (location.name && location.slug && /^[a-z0-9-]+$/.test(location.slug)) {
    score += 10
    checks.push({ id: 'slug', label: 'Valid URL Slug', passed: true, score: 10 })
  } else {
    warnings.push('Missing or invalid URL slug (must contain only lowercase letters, numbers, and hyphens).')
    checks.push({ id: 'slug', label: 'Valid URL Slug', passed: false, score: 0 })
  }

  // 2. Meta Title (15 pts)
  if (title) {
    const len = title.length
    if (len >= 45 && len <= 65) {
      score += 15
      checks.push({ id: 'title', label: `Meta Title Length (${len} chars - Optimal 50-60)`, passed: true, score: 15 })
    } else if (len >= 25 && len <= 75) {
      score += 10
      warnings.push(`Meta title length is ${len} chars. Recommended: 50-60 characters for best Google display.`)
      checks.push({ id: 'title', label: `Meta Title Length (${len} chars - Suboptimal)`, passed: true, score: 10 })
    } else {
      score += 5
      warnings.push(`Meta title is too ${len < 25 ? 'short' : 'long'} (${len} chars). Target 50-60 chars.`)
      checks.push({ id: 'title', label: `Meta Title Length (${len} chars - Too ${len < 25 ? 'Short' : 'Long'})`, passed: false, score: 5 })
    }
  } else {
    warnings.push('Meta title is missing. Google will generate an untailored snippet.')
    checks.push({ id: 'title', label: 'Meta Title Present', passed: false, score: 0 })
  }

  // 3. Meta Description (15 pts)
  if (description) {
    const len = description.length
    if (len >= 130 && len <= 165) {
      score += 15
      checks.push({ id: 'description', label: `Meta Description Length (${len} chars - Optimal 140-160)`, passed: true, score: 15 })
    } else if (len >= 80 && len <= 200) {
      score += 10
      warnings.push(`Meta description length is ${len} chars. Recommended: 140-160 characters.`)
      checks.push({ id: 'description', label: `Meta Description Length (${len} chars - Suboptimal)`, passed: true, score: 10 })
    } else {
      score += 5
      warnings.push(`Meta description is too ${len < 80 ? 'short' : 'long'} (${len} chars). Target 140-160 chars.`)
      checks.push({ id: 'description', label: `Meta Description (${len} chars)`, passed: false, score: 5 })
    }
  } else {
    warnings.push('Meta description is missing.')
    checks.push({ id: 'description', label: 'Meta Description Present', passed: false, score: 0 })
  }

  // 4. H1 Heading (10 pts)
  if (h1 && h1.length >= 10) {
    score += 10
    checks.push({ id: 'h1', label: 'Optimized H1 Heading Present', passed: true, score: 10 })
  } else {
    warnings.push('Missing distinct H1 heading for the location.')
    checks.push({ id: 'h1', label: 'H1 Heading Present', passed: false, score: 0 })
  }

  // 5. Unique Content & Word Count (20 pts)
  const combinedText = [
    location.shortDescription,
    location.description,
    location.introduction,
    location.localBusinessDescription,
    location.introContent,
    location.mainContent,
    location.servicesContent,
    ...(location.contentBlocks || []).map((b) => b.content || ''),
  ].filter(Boolean).join(' ')

  const wordCount = combinedText.trim().split(/\s+/).filter(Boolean).length
  if (wordCount >= 200) {
    score += 20
    checks.push({ id: 'content', label: `Unique Content (${wordCount} words - High Quality)`, passed: true, score: 20 })
  } else if (wordCount >= 80) {
    score += 12
    warnings.push(`Moderate content length (${wordCount} words). Minimum 200 words recommended to prevent thin-content warnings.`)
    checks.push({ id: 'content', label: `Unique Content (${wordCount} words - Moderate)`, passed: true, score: 12 })
  } else {
    warnings.push(`⚠ Thin content alert: Only ${wordCount} words of text. Add unique local market descriptions.`)
    checks.push({ id: 'content', label: `Unique Content (${wordCount} words - Thin Content)`, passed: false, score: 4 })
  }

  // 6. Canonical URL (10 pts)
  if (canonical && (canonical.startsWith('/') || canonical.startsWith('http'))) {
    score += 10
    checks.push({ id: 'canonical', label: 'Canonical URL Configured', passed: true, score: 10 })
  } else {
    warnings.push('Canonical URL not configured.')
    checks.push({ id: 'canonical', label: 'Canonical URL Configured', passed: false, score: 0 })
  }

  // 7. Schema & Rich Snippets (10 pts)
  const schemaEnabled = location.businessSchema?.enabled !== false && location.schema?.enabled !== false
  if (schemaEnabled) {
    score += 10
    checks.push({ id: 'schema', label: 'LocalBusiness / Rich Schema Enabled', passed: true, score: 10 })
  } else {
    warnings.push('Structured data schema is disabled.')
    checks.push({ id: 'schema', label: 'Structured Data Enabled', passed: false, score: 0 })
  }

  // 8. Location FAQs (5 pts)
  if (faqs.length >= 2) {
    score += 5
    checks.push({ id: 'faqs', label: `Local FAQs (${faqs.length} FAQs for FAQ Schema)`, passed: true, score: 5 })
  } else {
    warnings.push('Add at least 2 local FAQs to qualify for Google FAQ rich results.')
    checks.push({ id: 'faqs', label: 'Local FAQs (Need >= 2)', passed: false, score: 0 })
  }

  // 9. OpenGraph & Social Image (5 pts)
  if (ogImage || location.heroImage) {
    score += 5
    checks.push({ id: 'ogImage', label: 'Social Share (OG) Image Configured', passed: true, score: 5 })
  } else {
    warnings.push('No OpenGraph / social share image provided.')
    checks.push({ id: 'ogImage', label: 'Social Share Image', passed: false, score: 0 })
  }

  // Duplicate title check across other locations
  if (title && Array.isArray(otherLocations) && otherLocations.length > 0) {
    const currentId = String(location._id || location.id || '')
    const duplicate = otherLocations.find(
      (other) =>
        String(other._id || other.id || '') !== currentId &&
        ((other.seo?.title && other.seo.title.toLowerCase() === title.toLowerCase()) ||
          (other.metaTitle && other.metaTitle.toLowerCase() === title.toLowerCase()))
    )
    if (duplicate) {
      warnings.push(`⚠ Duplicate Title Alert: "${title}" matches location "${duplicate.name}". Titles should be unique.`)
    }
  }

  // Indexing status check
  const isNoIndex = location.seo?.noIndex === true || location.seo?.robots?.includes('noindex')
  if (isNoIndex) {
    warnings.push('ℹ Notice: This page is configured as "noindex" and will not appear in Google search results.')
  }

  return {
    score: Math.min(100, Math.max(0, score)),
    warnings,
    checks,
    isHealthy: score >= 80,
  }
}
