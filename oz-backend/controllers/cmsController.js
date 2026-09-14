import { sendSuccess, sendError } from '../utils/response.js'

// Generic Mock CMS Storage for extended modules
const cmsStore = {
  categories: [
    { id: 1, name: 'Interstate Moving', slug: 'interstate-moving', description: 'Long distance moving across states', status: 'active' },
    { id: 2, name: 'Office Relocation', slug: 'office-relocation', description: 'Commercial office and business moves', status: 'active' },
  ],
  services: [
    { id: 1, title: 'House Removalists', slug: 'house-removalists', short_description: 'Complete home packing & interstate transport', price: 450, status: 'active' },
    { id: 2, title: 'Office Relocation', slug: 'office-relocation', short_description: 'Fast, secure corporate relocation', price: 850, status: 'active' },
  ],
  blogs: [
    { id: 1, title: 'Top 10 Packing Tips for Interstate Moving', slug: 'packing-tips-interstate', summary: 'Save time and protect your goods with these expert packing tips.', status: 'published' },
  ],
  gallery: [
    { id: 1, title: 'Sydney to Melbourne Move', category: 'interstate', image_url: '/uploads/images/gallery-1.jpg', status: 'active' },
  ],
  testimonials: [
    { id: 1, name: 'Sarah Jenkins', role: 'Home Owner', content: 'Fantastic moving service! Everything arrived on time without any damage.', rating: 5, status: 'active' },
  ],
  faqs: [
    { id: 1, question: 'How much does interstate moving cost?', answer: 'Costs depend on distance and volume. Contact us for a free quote!', display_order: 1, status: 'active' },
  ],
  about: {
    title: 'Australia’s Trusted Interstate Removalists',
    subtitle: 'Over 10 Years of Reliable Transport',
    description: 'We specialize in stress-free interstate moving services across Australia.',
    experience_years: 10,
    completed_moves: 5000,
  },
  seo: [
    { id: 1, page_name: 'Home', meta_title: 'OZ Interstate Movers - Professional Interstate Removalists Australia', meta_description: 'Safe, fast interstate removalist services.' },
  ],
  settings: {
    site_name: 'OZ Interstate Movers',
    site_email: 'info@ozinterstate.com',
    site_phone: '1300 000 000',
    currency: 'AUD ($)',
  },
  users: [
    { id: 1, name: 'OZ Admin', email: 'admin@ozinterstate.com', role: 'Super Admin', status: 'active' },
  ],
}

// Categories Handlers
export const getCategories = (req, res) => sendSuccess(res, 'Categories retrieved.', cmsStore.categories)
export const createCategory = (req, res) => {
  const newCat = { id: Date.now(), ...req.body, status: 'active' }
  cmsStore.categories.push(newCat)
  return sendSuccess(res, 'Category created.', newCat, 201)
}

// Services Handlers
export const getServices = (req, res) => sendSuccess(res, 'Services retrieved.', cmsStore.services)
export const createService = (req, res) => {
  const newServ = { id: Date.now(), ...req.body, status: 'active' }
  cmsStore.services.push(newServ)
  return sendSuccess(res, 'Service created.', newServ, 201)
}

// Blogs Handlers
export const getBlogs = (req, res) => sendSuccess(res, 'Blogs retrieved.', cmsStore.blogs)

// Gallery Handlers
export const getGallery = (req, res) => sendSuccess(res, 'Gallery retrieved.', cmsStore.gallery)

// Testimonials Handlers
export const getTestimonials = (req, res) => sendSuccess(res, 'Testimonials retrieved.', cmsStore.testimonials)

// FAQs Handlers
export const getFaqs = (req, res) => sendSuccess(res, 'FAQs retrieved.', cmsStore.faqs)

// About Handlers
export const getAbout = (req, res) => sendSuccess(res, 'About page details retrieved.', cmsStore.about)
export const updateAbout = (req, res) => {
  cmsStore.about = { ...cmsStore.about, ...req.body }
  return sendSuccess(res, 'About page details updated.', cmsStore.about)
}

// SEO Handlers
export const getSeo = (req, res) => sendSuccess(res, 'SEO settings retrieved.', cmsStore.seo)

// Settings Handlers
export const getSettings = (req, res) => sendSuccess(res, 'Website settings retrieved.', cmsStore.settings)
export const updateSettings = (req, res) => {
  cmsStore.settings = { ...cmsStore.settings, ...req.body }
  return sendSuccess(res, 'Website settings updated.', cmsStore.settings)
}

// Users Handlers
export const getUsers = (req, res) => sendSuccess(res, 'Users retrieved.', cmsStore.users)
