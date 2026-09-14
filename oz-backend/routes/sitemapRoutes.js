import express from 'express'
import {
  getMasterSitemap,
  getLocationsSitemap,
  getPagesSitemap,
  getServicesSitemap,
  getBlogsSitemap,
  getRobotsTxt,
} from '../controllers/sitemapController.js'

const router = express.Router()

router.get('/sitemap.xml', getMasterSitemap)
router.get('/sitemap-locations.xml', getLocationsSitemap)
router.get('/sitemap-pages.xml', getPagesSitemap)
router.get('/sitemap-services.xml', getServicesSitemap)
router.get('/sitemap-blogs.xml', getBlogsSitemap)
router.get('/robots.txt', getRobotsTxt)

export default router
