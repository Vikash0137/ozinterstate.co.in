import mongoose from 'mongoose'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

// Load environment variables
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.join(__dirname, '../.env') })

// Import Models
import SiteSettings from '../models/SiteSettings.js'
import SeoSettings from '../models/SeoSettings.js'
import Page from '../models/Page.js'
import PageSection from '../models/PageSection.js'
import Service from '../models/Service.js'
import Stat from '../models/Stat.js'
import TrustBadge from '../models/TrustBadge.js'
import ProcessStep from '../models/ProcessStep.js'
import WhyChooseItem from '../models/WhyChooseItem.js'
import Testimonial from '../models/Testimonial.js'
import FAQ from '../models/FAQ.js'
import Blog from '../models/Blog.js'
import Gallery from '../models/Gallery.js'
import TeamMember from '../models/TeamMember.js'

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/oz_interstate')
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`)
    process.exit(1)
  }
}

// Data from siteData.js (Hardcoded here for migration)
const COMPANY = {
  name: 'MoveLink',
  fullName: 'MoveLink Interstate Removalists',
  tagline: "Australia's Trusted Interstate Removalists",
  phone: '1300 668 254',
  phoneHref: 'tel:1300668254',
  emergency: '0411 555 880',
  emergencyHref: 'tel:0411555880',
  email: 'hello@movelink.com.au',
  emailHref: 'mailto:hello@movelink.com.au',
  address: '24 Logistics Way, Port Melbourne, VIC 3207, Australia',
  abn: 'ABN 84 622 119 037',
}

const NAV_LINKS = [
  { label: 'Home', url: '/', sortOrder: 1 },
  { label: 'Company Profile', url: '/company-profile', sortOrder: 2 },
  { label: 'Our Services', url: '/services', sortOrder: 3 },
  { label: 'Reviews', url: '/reviews', sortOrder: 4 },
  { label: 'Our Blogs', url: '/blogs', sortOrder: 5 },
  { label: 'Sitemap', url: '/sitemap', sortOrder: 6 },
]

const PROPERTY_SIZES = [
  'Studio / 1 Bedroom',
  '2 Bedroom',
  '3 Bedroom',
  '4+ Bedroom',
  'Office / Commercial',
  'Few Items Only',
]

const SERVICES = [
  { icon: 'Home', title: 'House Removalists', slug: 'house-removalists', short_description: 'End-to-end home moves with careful handling, protective wrapping and a dedicated move coordinator.', sortOrder: 1 },
  { icon: 'Building2', title: 'Office Relocation', slug: 'office-relocation', short_description: 'Minimise downtime with after-hours corporate relocations, IT handling and workstation reassembly.', sortOrder: 2 },
  { icon: 'Truck', title: 'Interstate Moving', slug: 'interstate-moving', short_description: 'Reliable backloading and dedicated trucks connecting every capital city across Australia.', sortOrder: 3 },
  { icon: 'Sofa', title: 'Furniture Moving', slug: 'furniture-moving', short_description: 'Single items to full households — disassembly, padding and damage-free transport guaranteed.', sortOrder: 4 },
  { icon: 'PackageOpen', title: 'Packing Services', slug: 'packing-services', short_description: 'Premium materials and trained packers to secure your fragile, valuable and bulky belongings.', sortOrder: 5 },
  { icon: 'Warehouse', title: 'Storage Solutions', slug: 'storage-solutions', short_description: 'Secure, climate-controlled short and long-term storage with flexible access when you need it.', sortOrder: 6 },
]

const STATS = [
  { value: 5000, suffix: '+', label: 'Moves Completed', sortOrder: 1 },
  { value: 4.9, suffix: '★', label: 'Google Rating', decimals: 1, sortOrder: 2 },
  { value: 10, suffix: '+', label: 'Years Experience', sortOrder: 3 },
  { value: 24, suffix: '/7', label: 'Customer Support', sortOrder: 4 },
]

const TRUST_BADGES = [
  { icon: 'ShieldCheck', title: 'Fully Insured', sortOrder: 1 },
  { icon: 'Users', title: 'Professional Movers', sortOrder: 2 },
  { icon: 'Route', title: 'Interstate Specialists', sortOrder: 3 },
  { icon: 'Clock', title: 'Same Day Service', sortOrder: 4 },
  { icon: 'BadgeDollarSign', title: 'Transparent Pricing', sortOrder: 5 },
]

const WHY_CHOOSE = [
  { icon: 'Users', title: 'Experienced Team', description: 'Background-checked, trained removalists with 10+ years on Australian roads.', sortOrder: 1 },
  { icon: 'BadgeDollarSign', title: 'Affordable Pricing', description: 'Transparent, fixed quotes with no hidden fees or surprise charges.', sortOrder: 2 },
  { icon: 'Truck', title: 'Safe Transportation', description: 'GPS-tracked, padded trucks engineered for long-haul interstate moves.', sortOrder: 3 },
  { icon: 'Clock', title: 'On-Time Delivery', description: 'Guaranteed delivery windows so you can plan your move with confidence.', sortOrder: 4 },
  { icon: 'HeartHandshake', title: 'Satisfaction Guarantee', description: '4.9★ rated service backed by our promise to make it right, every time.', sortOrder: 5 },
]

const PROCESS_STEPS = [
  { stepNumber: 1, title: 'Request Quote', description: 'Share your move details and receive a transparent, fixed-price quote in minutes.', sortOrder: 1 },
  { stepNumber: 2, title: 'Plan Your Move', description: 'A dedicated coordinator builds your custom moving plan and timeline.', sortOrder: 2 },
  { stepNumber: 3, title: 'Professional Packing', description: 'Our trained team wraps, boxes and labels every item with premium materials.', sortOrder: 3 },
  { stepNumber: 4, title: 'Safe Transportation', description: 'GPS-tracked trucks transport your belongings securely across state lines.', sortOrder: 4 },
  { stepNumber: 5, title: 'Successful Delivery', description: 'We unload, reassemble and place everything exactly where you want it.', sortOrder: 5 },
]

const REVIEWS = [
  { name: 'Sarah Thompson', role: 'Melbourne → Sydney', rating: 5, avatar: 'https://i.pravatar.cc/150?img=47', content: 'Absolutely seamless interstate move. The team wrapped everything beautifully and delivered a day early. Not a single scratch on our furniture!', sortOrder: 1 },
  { name: 'James Mitchell', role: 'Office Relocation, Brisbane', rating: 5, avatar: 'https://i.pravatar.cc/150?img=12', content: 'They relocated our 40-person office over a weekend with zero downtime. Professional, punctual and incredibly well organised.', sortOrder: 2 },
  { name: 'Priya Nair', role: 'Adelaide → Perth', rating: 5, avatar: 'https://i.pravatar.cc/150?img=32', content: 'The fixed quote was exactly what we paid — no surprises. GPS tracking gave us total peace of mind across the Nullarbor.', sortOrder: 3 },
  { name: 'Daniel O’Connor', role: 'House Move, Canberra', rating: 5, avatar: 'https://i.pravatar.cc/150?img=15', content: 'From packing to reassembly, the crew was friendly and efficient. Best removalist experience we have ever had, hands down.', sortOrder: 4 },
  { name: 'Emily Chen', role: 'Sydney → Gold Coast', rating: 5, avatar: 'https://i.pravatar.cc/150?img=45', content: 'Booked a same-day move and they delivered. Careful with our piano and artwork. Highly recommend MoveLink to anyone.', sortOrder: 5 },
]

const FAQS = [
  { question: 'How much does interstate moving cost?', answer: 'Interstate moving costs depend on distance, volume, access and timing. A typical 2-bedroom move between capital cities ranges from $1,200–$3,500. Request a free quote and we will provide a transparent, fixed price with no hidden fees.', display_order: 1 },
  { question: 'Are my items insured?', answer: 'Yes. Every move includes comprehensive transit insurance covering your belongings from pickup to delivery. We also offer optional full-replacement cover for high-value items for complete peace of mind.', display_order: 2 },
  { question: 'Do you offer packing services?', answer: 'Absolutely. Our trained packers use premium materials to wrap, box and label everything. You can choose full packing, partial packing, or fragile-only packing to suit your budget and needs.', display_order: 3 },
  { question: 'Can I book same-day moving?', answer: 'Yes, subject to availability. We keep capacity reserved for urgent and same-day moves. Call our team on 1300 668 254 and we will do our best to accommodate your timeline.', display_order: 4 },
  { question: 'Which cities do you cover?', answer: 'We service every Australian capital and major regional centre, including Melbourne, Sydney, Brisbane, Adelaide, Perth and Canberra, with regular interstate routes between them all.', display_order: 5 },
]

const BLOGS = [
  { title: '10 Essential Tips for a Stress-Free Interstate Move', slug: 'stress-free-interstate-move', category: 'Moving Tips', publishedAt: new Date('2026-06-12'), readTime: '6 min read', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80', excerpt: 'Planning a move across state lines? These expert-backed tips will keep your relocation smooth, safe and on schedule.', sortOrder: 1 },
  { title: 'How to Pack Fragile Items Like a Professional', slug: 'pack-fragile-items', category: 'Packing Guides', publishedAt: new Date('2026-05-28'), readTime: '5 min read', image: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=900&q=80', excerpt: 'Glassware, artwork and electronics deserve special care. Learn the techniques our packers use to keep fragile items safe.', sortOrder: 2 },
  { title: 'The True Cost of Moving Interstate in 2026', slug: 'cost-of-moving-interstate-2026', category: 'Cost & Budgeting', publishedAt: new Date('2026-05-10'), readTime: '7 min read', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=900&q=80', excerpt: 'Understand what really drives the price of an interstate move and how to budget smartly without compromising on quality.', sortOrder: 3 },
  { title: 'Office Relocation Checklist for Australian Businesses', slug: 'office-relocation-checklist', category: 'Business Moves', publishedAt: new Date('2026-04-22'), readTime: '8 min read', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80', excerpt: 'Minimise downtime and protect your assets with our step-by-step checklist for a seamless corporate relocation.', sortOrder: 4 },
  { title: 'Storage Solutions: Short-Term vs Long-Term', slug: 'storage-short-vs-long-term', category: 'Storage', publishedAt: new Date('2026-04-05'), readTime: '4 min read', image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=900&q=80', excerpt: 'Not sure which storage option fits your move? We break down the pros, cons and costs of each to help you decide.', sortOrder: 5 },
  { title: 'Moving With Pets: A Complete Guide', slug: 'moving-with-pets', category: 'Moving Tips', publishedAt: new Date('2026-03-18'), readTime: '5 min read', image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=900&q=80', excerpt: 'Relocating with furry family members? Keep your pets calm, safe and comfortable throughout your interstate journey.', sortOrder: 6 },
]

const GALLERY = [
  { image_url: 'https://images.unsplash.com/photo-1600518464441-9154a4dea21b?auto=format&fit=crop&w=900&q=80', altText: 'Moving truck loaded with boxes', span: 'row-span-2', display_order: 1 },
  { image_url: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=900&q=80', altText: 'Packing team wrapping furniture', display_order: 2 },
  { image_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80', altText: 'Office relocation in progress', display_order: 3 },
  { image_url: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=900&q=80', altText: 'Movers carrying boxes into a home', span: 'row-span-2', display_order: 4 },
  { image_url: 'https://images.unsplash.com/photo-1607512795097-a17b4960b2c9?auto=format&fit=crop&w=900&q=80', altText: 'Furniture being moved carefully', display_order: 5 },
  { image_url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80', altText: 'Interstate transport truck on highway', display_order: 6 },
]

const TEAM_MEMBERS = [
  { name: 'Michael Harrison', designation: 'Operations Director', bio: '15 years managing complex logistics and leading national moving teams.', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=500&q=80', sortOrder: 1 },
  { name: 'David Chen', designation: 'Fleet Manager', bio: 'Ensures our 50+ vehicles are maintained, safe, and on schedule.', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=500&q=80', sortOrder: 2 },
  { name: 'Sarah Jenkins', designation: 'Customer Success', bio: 'Dedicated to making every move completely stress-free for our clients.', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&q=80', sortOrder: 3 },
  { name: 'Marcus Rossi', designation: 'Head Removalist', bio: 'Expert in handling antiques, pianos, and delicate items with precision.', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=500&q=80', sortOrder: 4 },
]

const PAGES = [
  { title: 'Home', slug: 'home', route: '/', pageType: 'home' },
  { title: 'Company Profile', slug: 'company-profile', route: '/company-profile', pageType: 'company', banner: { enabled: true, title: 'Company Profile', subtitle: 'About Us', description: 'Australia’s most trusted interstate moving network.', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80' } },
  { title: 'Our Services', slug: 'services', route: '/services', pageType: 'services', banner: { enabled: true, title: 'Our Services', subtitle: 'What We Do', description: 'Comprehensive moving solutions for homes and businesses.', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1920&q=80' } },
  { title: 'Customer Reviews', slug: 'reviews', route: '/reviews', pageType: 'reviews', banner: { enabled: true, title: 'Customer Reviews', subtitle: 'Testimonials', description: 'See what our happy clients have to say.', image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32b7?auto=format&fit=crop&w=1920&q=80' } },
  { title: 'Our Blogs', slug: 'blogs', route: '/blogs', pageType: 'blogs', banner: { enabled: true, title: 'Our Blogs', subtitle: 'Latest News & Tips', description: 'Expert advice for a stress-free move.', image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=1920&q=80' } },
  { title: 'Service Locations', slug: 'locations', route: '/locations', pageType: 'locations', banner: { enabled: true, title: 'Service Locations', subtitle: 'Where We Move', description: 'Connecting every capital city and major regional center across Australia.', image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1920&q=80' } },
  { title: 'Contact Us', slug: 'contact', route: '/contact', pageType: 'contact', banner: { enabled: true, title: 'Contact Us', subtitle: 'Get In Touch', description: 'Our team is ready to help plan your next move.', image: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=1920&q=80' } },
]

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seed...')

    // 1. Seed Site Settings
    const existingSettings = await SiteSettings.findOne({ isActive: true })
    if (!existingSettings) {
      await SiteSettings.create({
        siteName: COMPANY.name,
        fullName: COMPANY.fullName,
        tagline: COMPANY.tagline,
        phone: COMPANY.phone,
        phoneHref: COMPANY.phoneHref,
        emergencyPhone: COMPANY.emergency,
        emergencyPhoneHref: COMPANY.emergencyHref,
        email: COMPANY.email,
        emailHref: COMPANY.emailHref,
        address: COMPANY.address,
        abn: COMPANY.abn,
        navigationItems: NAV_LINKS,
        propertySizes: PROPERTY_SIZES,
        isActive: true,
      })
      console.log('✅ Site Settings seeded')
    } else {
      console.log('⏩ Site Settings already exist, skipping...')
    }

    // 2. Seed SEO Settings
    const existingSeo = await SeoSettings.findOne({ isActive: true })
    if (!existingSeo) {
      await SeoSettings.create({ isActive: true })
      console.log('✅ SEO Settings seeded')
    }

    // Seed Data Function
    const seedModel = async (Model, data, identifierField, name) => {
      let count = 0
      for (const item of data) {
        const query = { [identifierField]: item[identifierField] }
        const exists = await Model.findOne(query)
        if (!exists) {
          await Model.create(item)
          count++
        }
      }
      console.log(`✅ ${name} seeded: added ${count} new items`)
    }

    // 3. Seed Collections
    await seedModel(Service, SERVICES, 'slug', 'Services')
    await seedModel(Stat, STATS, 'label', 'Stats')
    await seedModel(TrustBadge, TRUST_BADGES, 'title', 'Trust Badges')
    await seedModel(WhyChooseItem, WHY_CHOOSE, 'title', 'Why Choose Items')
    await seedModel(ProcessStep, PROCESS_STEPS, 'title', 'Process Steps')
    await seedModel(Testimonial, REVIEWS, 'name', 'Reviews')
    await seedModel(FAQ, FAQS, 'question', 'FAQs')
    await seedModel(Blog, BLOGS, 'slug', 'Blogs')
    await seedModel(Gallery, GALLERY, 'image_url', 'Gallery Images')
    await seedModel(TeamMember, TEAM_MEMBERS, 'name', 'Team Members')

    // 4. Seed Pages
    let newPages = 0
    for (const pageData of PAGES) {
      const exists = await Page.findOne({ slug: pageData.slug })
      if (!exists) {
        const page = await Page.create(pageData)
        
        // Add default sections to the Home page
        if (page.slug === 'home') {
          await PageSection.create([
            { pageId: page._id, sectionType: 'hero', sortOrder: 1 },
            { pageId: page._id, sectionType: 'trust_strip', sortOrder: 2 },
            { pageId: page._id, sectionType: 'stats', sortOrder: 3 },
            { pageId: page._id, sectionType: 'services_grid', sortOrder: 4 },
            { pageId: page._id, sectionType: 'why_choose_us', sortOrder: 5 },
            { pageId: page._id, sectionType: 'moving_process', sortOrder: 6 },
            { pageId: page._id, sectionType: 'locations_grid', sortOrder: 7 },
            { pageId: page._id, sectionType: 'reviews', sortOrder: 8 },
            { pageId: page._id, sectionType: 'gallery', sortOrder: 9 },
            { pageId: page._id, sectionType: 'faq', sortOrder: 10 },
            { pageId: page._id, sectionType: 'contact', sortOrder: 11 },
          ])
        } else if (page.slug === 'company-profile') {
           await PageSection.create([
            { pageId: page._id, sectionType: 'team', sortOrder: 1 },
            { pageId: page._id, sectionType: 'why_choose_us', sortOrder: 2 },
          ])
        }
        newPages++
      }
    }
    console.log(`✅ Pages seeded: added ${newPages} new pages with default sections`)

    console.log('🎉 Seeding completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error(`❌ Seeding failed: ${error.message}`)
    process.exit(1)
  }
}

connectDB().then(seedDatabase)
