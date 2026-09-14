import Location from '../models/Location.js'
import Service from '../models/Service.js'
import Blog from '../models/Blog.js'
import SiteSettings from '../models/SiteSettings.js'

const getBaseUrl = async (req) => {
  try {
    const settings = await SiteSettings.findOne().lean()
    if (settings?.general?.site_url) {
      return settings.general.site_url.replace(/\/+$/, '')
    }
  } catch (err) {}

  const host = req.get('host') || 'localhost:5173'
  const protocol = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http'
  return `${protocol}://${host}`
}

const formatDate = (date) => {
  const d = date ? new Date(date) : new Date()
  return d.toISOString().split('T')[0]
}

/**
 * Master XML Sitemap Index
 * Links to sub-sitemaps for modular scalability (locations, services, blogs, pages)
 */
export const getMasterSitemap = async (req, res) => {
  try {
    const baseUrl = await getBaseUrl(req)
    const now = formatDate(new Date())

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap-pages.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-locations.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-services.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-blogs.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
</sitemapindex>`

    res.header('Content-Type', 'application/xml')
    return res.send(xml)
  } catch (error) {
    console.error('Error generating master sitemap:', error)
    return res.status(500).send('Error generating sitemap')
  }
}

/**
 * Dynamic Locations XML Sitemap
 * Lists all published and indexable location pages
 */
export const getLocationsSitemap = async (req, res) => {
  try {
    const baseUrl = await getBaseUrl(req)

    const locations = await Location.find({
      isDeleted: { $ne: true },
      $or: [{ status: 'published' }, { status: 'active' }, { isPublished: true }],
      'seo.noIndex': { $ne: true },
      'seo.robots': { $ne: 'noindex,nofollow' },
    })
      .select('slug updatedAt createdAt')
      .sort({ updatedAt: -1 })
      .lean()

    const urlsXml = locations
      .map((loc) => {
        const url = `${baseUrl}/location/${loc.slug}`
        const lastmod = formatDate(loc.updatedAt || loc.createdAt)
        return `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
      })
      .join('\n')

    // Also include master /locations directory
    const directoryXml = `  <url>
    <loc>${baseUrl}/locations</loc>
    <lastmod>${formatDate(new Date())}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${directoryXml}
${urlsXml}
</urlset>`

    res.header('Content-Type', 'application/xml')
    return res.send(xml)
  } catch (error) {
    console.error('Error generating locations sitemap:', error)
    return res.status(500).send('Error generating locations sitemap')
  }
}

/**
 * Dynamic Static Pages XML Sitemap
 */
export const getPagesSitemap = async (req, res) => {
  try {
    const baseUrl = await getBaseUrl(req)
    const now = formatDate(new Date())

    const staticPages = [
      { path: '/', priority: '1.0', changefreq: 'daily' },
      { path: '/company-profile', priority: '0.8', changefreq: 'monthly' },
      { path: '/services', priority: '0.9', changefreq: 'weekly' },
      { path: '/reviews', priority: '0.7', changefreq: 'weekly' },
      { path: '/blogs', priority: '0.8', changefreq: 'daily' },
      { path: '/locations', priority: '0.9', changefreq: 'daily' },
      { path: '/contact', priority: '0.8', changefreq: 'monthly' },
      { path: '/sitemap', priority: '0.5', changefreq: 'monthly' },
    ]

    const urlsXml = staticPages
      .map(
        (page) => `  <url>
    <loc>${baseUrl}${page.path}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
      )
      .join('\n')

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>`

    res.header('Content-Type', 'application/xml')
    return res.send(xml)
  } catch (error) {
    console.error('Error generating pages sitemap:', error)
    return res.status(500).send('Error generating pages sitemap')
  }
}

/**
 * Dynamic Services XML Sitemap
 */
export const getServicesSitemap = async (req, res) => {
  try {
    const baseUrl = await getBaseUrl(req)
    const services = await Service.find({ is_active: { $ne: false } })
      .select('slug updated_at created_at')
      .lean()
      .catch(() => [])

    const urlsXml = (services || [])
      .map((svc) => {
        const slug = svc.slug || ''
        if (!slug) return ''
        const url = `${baseUrl}/services#${slug}`
        const lastmod = formatDate(svc.updated_at || svc.created_at)
        return `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
      })
      .filter(Boolean)
      .join('\n')

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/services</loc>
    <lastmod>${formatDate(new Date())}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
${urlsXml}
</urlset>`

    res.header('Content-Type', 'application/xml')
    return res.send(xml)
  } catch (error) {
    console.error('Error generating services sitemap:', error)
    return res.status(500).send('Error generating services sitemap')
  }
}

/**
 * Dynamic Blog XML Sitemap
 */
export const getBlogsSitemap = async (req, res) => {
  try {
    const baseUrl = await getBaseUrl(req)
    const blogs = await Blog.find({ status: 'published' })
      .select('slug updated_at created_at')
      .lean()
      .catch(() => [])

    const urlsXml = (blogs || [])
      .map((b) => {
        const slug = b.slug || ''
        if (!slug) return ''
        const url = `${baseUrl}/blogs/${slug}`
        const lastmod = formatDate(b.updated_at || b.created_at)
        return `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
      })
      .filter(Boolean)
      .join('\n')

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/blogs</loc>
    <lastmod>${formatDate(new Date())}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
${urlsXml}
</urlset>`

    res.header('Content-Type', 'application/xml')
    return res.send(xml)
  } catch (error) {
    console.error('Error generating blogs sitemap:', error)
    return res.status(500).send('Error generating blogs sitemap')
  }
}

/**
 * Dynamic Robots.txt
 */
export const getRobotsTxt = async (req, res) => {
  try {
    const baseUrl = await getBaseUrl(req)

    const robots = `User-agent: *
Allow: /
Allow: /location/
Allow: /locations/
Allow: /services
Allow: /company-profile
Allow: /reviews
Allow: /blogs
Allow: /contact

Disallow: /admin/
Disallow: /api/
Disallow: /*?preview=true

Sitemap: ${baseUrl}/sitemap.xml
Sitemap: ${baseUrl}/sitemap-locations.xml
`

    res.header('Content-Type', 'text/plain')
    return res.send(robots)
  } catch (error) {
    console.error('Error generating robots.txt:', error)
    return res.status(500).send('User-agent: *\nAllow: /')
  }
}
