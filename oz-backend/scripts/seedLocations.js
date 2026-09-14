import mongoose from 'mongoose'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import Location from '../models/Location.js'
import LocationRevision from '../models/LocationRevision.js'
import { calculateSeoHealth } from '../utils/seoEngine.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.join(__dirname, '../.env') })

const sampleLocations = [
  {
    name: 'Melbourne',
    slug: 'melbourne',
    city: 'Melbourne',
    state: 'VIC',
    country: 'Australia',
    region: 'Victoria Metro',
    address: '24 Logistics Way, Port Melbourne, VIC 3207',
    phone: '1300 668 254',
    email: 'melbourne@oz-interstate.com.au',
    whatsappNumber: '+61411555880',
    badge: 'State Hub & Depot',
    shortDescription: 'Comprehensive interstate removalist and freight services connecting Melbourne to all Australian capitals with weekly departures.',
    description: 'OZ Interstate Movers Melbourne provides reliable, professional moving and freight solutions. With our Port Melbourne distribution depot, we coordinate regular linehaul services to Sydney, Brisbane, Adelaide, Perth, and regional hubs.',
    introduction: 'Welcome to OZ Interstate Movers Melbourne. Whether you are relocating your family residence to Brisbane, moving corporate offices to Sydney, or dispatching commercial freight across Australia, our dedicated Victoria logistics team delivers on-time, damage-free transit backed by full transit insurance.',
    localBusinessDescription: 'Our Melbourne operations encompass residential packing, specialist heavy furniture transit, climate-controlled storage in Port Melbourne, and daily scheduled interstate departures across the Hume and Western Highways.',
    heroTitle: 'Interstate Removalists & Freight in Melbourne',
    heroSubtitle: 'Direct, reliable interstate moving services from Melbourne to Sydney, Brisbane, Perth & all Australian capitals.',
    heroDescription: 'Fixed pricing, comprehensive transit insurance, and GPS-tracked modern vehicle fleet.',
    heroImage: 'https://images.unsplash.com/photo-1514395462725-fb4566210144?auto=format&fit=crop&w=2000&q=80',
    heroCtaText: 'Get Free Melbourne Quote',
    heroCtaUrl: '#quote',
    coordinates: {
      latitude: -37.8136,
      longitude: 144.9631,
    },
    popularRoutes: [
      'Melbourne ➔ Sydney (Next-Day Linehaul)',
      'Melbourne ➔ Brisbane (2-3 Business Days)',
      'Melbourne ➔ Adelaide (Daily Transit)',
      'Melbourne ➔ Perth (Direct Container)',
    ],
    nearbyAreas: ['Port Melbourne', 'Geelong', 'Ballarat', 'Bendigo', 'Frankston', 'Dandenong'],
    services: [
      {
        title: 'Full House Relocation',
        description: 'End-to-end interstate residential moves with furniture wrapping, disassembly, and room placement.',
        icon: 'Home',
        features: ['Full Packing Service', 'Protective Blankets', 'Fragile Item Crating'],
      },
      {
        title: 'Commercial & Office Relocations',
        description: 'Scheduled after-hours and weekend corporate moves to minimize business downtime.',
        icon: 'Building2',
        features: ['IT Server Relocation', 'Workstation Reassembly', 'Archive Transport'],
      },
      {
        title: 'Express Interstate Linehaul',
        description: 'Scheduled weekly departures connecting Melbourne directly to Sydney, Brisbane, and Adelaide.',
        icon: 'Truck',
        features: ['GPS Real-Time Tracking', 'Direct Depot Delivery', 'Backload Discounts'],
      },
      {
        title: 'Short & Long-Term Storage',
        description: 'Secure, CCTV-monitored warehouse storage located minutes from Melbourne CBD.',
        icon: 'Warehouse',
        features: ['24/7 Security Monitoring', 'Palletized Storage', 'Flexible Access'],
      },
    ],
    products: [
      { name: 'Standard Moving Box Kit', description: 'Heavy-duty double-walled cardboard cartons with packing paper and tape.', tag: 'Packing Supply', link: '/contact' },
      { name: 'Heavy Furniture Crating', description: 'Custom timber crating for antiques, marble tables, and artwork.', tag: 'Specialist Packaging', link: '/contact' },
    ],
    highlights: [
      { title: 'Weekly Scheduled Departures', desc: 'Guaranteed dispatch slots on all major interstate corridors.' },
      { title: 'Full Transit Insurance Cover', desc: 'Complete peace of mind against accidental damage during long-haul transport.' },
      { title: 'Port Melbourne Logistics Hub', desc: 'Local depot access for drop-offs, consolidations, and container holding.' },
      { title: 'Transparent Fixed Quotes', desc: 'No hidden call-out fees, fuel surcharges, or stairs penalties.' },
    ],
    faqs: [
      {
        question: 'How long does a move from Melbourne to Sydney take?',
        answer: 'Direct dedicated moves typically arrive within 24 to 48 hours. Consolidated backloading shipments take approximately 2 to 4 business days.',
      },
      {
        question: 'Do you provide packing and unpacking in Melbourne?',
        answer: 'Yes, we provide full packing materials and professional packers who can safely pack your entire residence or office before transit.',
      },
      {
        question: 'Where is your Melbourne depot located?',
        answer: 'Our main depot and storage warehouse is situated at 24 Logistics Way, Port Melbourne, VIC 3207.',
      },
      {
        question: 'How do I get an exact fixed estimate for my move?',
        answer: 'You can submit an inventory list through our online instant quote calculator or contact our Melbourne team on 1300 668 254.',
      },
    ],
    testimonials: [
      { name: 'David H.', role: 'South Yarra Resident', review: 'Moved our 4-bedroom house from Melbourne to Brisbane. The team was punctual, handled our pianos with care, and arrived exactly on time.', rating: 5, locationTag: 'Melbourne ➔ Brisbane' },
      { name: 'Sarah K.', role: 'Operations Director', review: 'Seamless office relocation from Docklands to Sydney CBD over a single weekend. Highly recommended for commercial moves.', rating: 5, locationTag: 'Commercial Relocation' },
    ],
    ctaTitle: 'Ready to Plan Your Melbourne Move?',
    ctaDescription: 'Speak with our Victorian moving coordinator or generate an instant fixed estimate online today.',
    ctaButtonText: 'Request Melbourne Quote',
    ctaButtonUrl: '#quote',
    status: 'published',
    isPublished: true,
    publishedAt: new Date(),
    seo: {
      title: 'Interstate Removalists Melbourne | Fast & Reliable | OZ-INTERSTATE',
      metaDescription: 'Trusted Melbourne interstate removalists and freight specialists. Regular linehaul routes to Sydney, Brisbane, Perth & Adelaide. Get a free fixed quote today.',
      primaryKeyword: 'Interstate Removalists Melbourne',
      keywords: ['interstate removalists melbourne', 'melbourne freight services', 'melbourne to sydney movers', 'backloading melbourne'],
      h1: 'Interstate Removalists & Freight in Melbourne',
      canonicalUrl: '/location/melbourne',
      robots: 'index,follow',
      noIndex: false,
      noFollow: false,
      ogTitle: 'Interstate Removalists Melbourne | OZ-INTERSTATE',
      ogDescription: 'Professional interstate removalists in Melbourne. Punctual, fully insured, and transparent pricing.',
      ogImage: 'https://images.unsplash.com/photo-1514395462725-fb4566210144?auto=format&fit=crop&w=1200&q=80',
      breadcrumbName: 'Melbourne',
    },
    businessSchema: {
      enabled: true,
      type: 'MovingCompany',
      businessName: 'OZ Interstate Movers Melbourne',
      businessType: 'MovingCompany',
      priceRange: '$$',
      address: {
        street: '24 Logistics Way',
        city: 'Port Melbourne',
        state: 'VIC',
        postalCode: '3207',
        country: 'AU',
      },
      latitude: -37.8136,
      longitude: 144.9631,
    },
  },
  {
    name: 'Sydney',
    slug: 'sydney',
    city: 'Sydney',
    state: 'NSW',
    country: 'Australia',
    region: 'Greater Sydney',
    address: '15 Commercial Ave, Alexandria, NSW 2015',
    phone: '1300 668 254',
    email: 'sydney@oz-interstate.com.au',
    whatsappNumber: '+61411555880',
    badge: 'Capital Hub',
    shortDescription: 'Premier interstate removalist services connecting Sydney to Melbourne, Brisbane, Canberra, and national destinations.',
    description: 'OZ Interstate Movers Sydney is the trusted choice for household removals, commercial relocations, and backloading freight across New South Wales and interstate corridors.',
    introduction: 'Welcome to OZ Interstate Movers Sydney. We offer daily departures connecting the Greater Sydney region and regional NSW with Melbourne, Brisbane, Adelaide, and beyond.',
    localBusinessDescription: 'Our Sydney operations provide full turnkey packing, high-security storage, and specialized long-haul transit with modern air-ride suspension trucks.',
    heroTitle: 'Interstate Removalists & Transport in Sydney',
    heroSubtitle: 'Reliable moving solutions from Sydney to Melbourne, Brisbane, Adelaide, and nationwide.',
    heroDescription: 'Fully insured, punctual removals with transparent pricing and direct depot facilities.',
    heroImage: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=2000&q=80',
    heroCtaText: 'Get Free Sydney Quote',
    heroCtaUrl: '#quote',
    coordinates: {
      latitude: -33.8688,
      longitude: 151.2093,
    },
    popularRoutes: [
      'Sydney ➔ Melbourne (Daily Scheduled)',
      'Sydney ➔ Brisbane (Next-Day Linehaul)',
      'Sydney ➔ Canberra (Express Same-Day)',
      'Sydney ➔ Perth (Weekly Rail/Road)',
    ],
    nearbyAreas: ['Alexandria', 'Parramatta', 'Penrith', 'Wollongong', 'Newcastle', 'Central Coast'],
    services: [
      {
        title: 'Interstate Residential Moving',
        description: 'Complete household moves between Sydney and all major interstate cities.',
        icon: 'Home',
        features: ['Professional Packing', 'Furniture Blanketing', 'Inventory Auditing'],
      },
      {
        title: 'Office & Commercial Relocations',
        description: 'Tailored business relocations designed for zero operational disruption.',
        icon: 'Building2',
        features: ['Crate Hire', 'IT Disconnect/Reconnect', 'Security Sealed Loads'],
      },
      {
        title: 'Backload Transport Services',
        description: 'Cost-effective shared load transport for partial loads and budget-conscious moves.',
        icon: 'Truck',
        features: ['Discounted Rates', 'Flexible Pickup Windows', 'Full Transit Cover'],
      },
    ],
    products: [
      { name: 'Eco Moving Crates', description: 'Heavy-duty reusable plastic crates delivered to your Sydney address.', tag: 'Rental Supply', link: '/contact' },
    ],
    highlights: [
      { title: 'Daily NSW Departures', desc: 'Frequent linehaul schedules to Melbourne, Brisbane and Canberra.' },
      { title: 'Alexandria Storage Depot', desc: 'Centrally located staging facility for flexible delivery scheduling.' },
      { title: 'Damage-Free Guarantee', desc: 'Trained movers utilizing hydraulic tail lifts and air-ride trucks.' },
    ],
    faqs: [
      {
        question: 'Do you service regional NSW as well as Sydney metro?',
        answer: 'Yes, we service Wollongong, Newcastle, Central Coast, Dubbo, Wagga Wagga, and all regional NSW corridors.',
      },
      {
        question: 'Can you transport cars and pets along with furniture?',
        answer: 'Yes, we can coordinate vehicle transport and specialized pet transit alongside your household goods.',
      },
    ],
    testimonials: [
      { name: 'Michael T.', role: 'Surry Hills', review: 'Fantastic service moving from Sydney to Melbourne. Everything was delivered on time without a scratch.', rating: 5, locationTag: 'Sydney ➔ Melbourne' },
    ],
    ctaTitle: 'Plan Your Sydney Move with Confidence',
    ctaDescription: 'Get a fast, transparent quote from Australia’s leading interstate removalists.',
    ctaButtonText: 'Get Sydney Quote',
    ctaButtonUrl: '#quote',
    status: 'published',
    isPublished: true,
    publishedAt: new Date(),
    seo: {
      title: 'Interstate Removalists Sydney | Fast & Reliable Movers | OZ-INTERSTATE',
      metaDescription: 'Trusted Sydney interstate removalists for hassle-free moves to Melbourne, Brisbane, Perth & Adelaide. Fixed prices & full transit insurance. Request a quote!',
      primaryKeyword: 'Interstate Removalists Sydney',
      keywords: ['interstate removalists sydney', 'sydney to melbourne movers', 'sydney freight transport', 'removalists nsw'],
      h1: 'Interstate Removalists & Transport in Sydney',
      canonicalUrl: '/location/sydney',
      robots: 'index,follow',
      noIndex: false,
      noFollow: false,
      ogTitle: 'Interstate Removalists Sydney | OZ-INTERSTATE',
      ogDescription: 'Trusted Sydney interstate removalists for moves across Australia.',
      ogImage: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1200&q=80',
      breadcrumbName: 'Sydney',
    },
    businessSchema: {
      enabled: true,
      type: 'MovingCompany',
      businessName: 'OZ Interstate Movers Sydney',
      businessType: 'MovingCompany',
      priceRange: '$$',
      address: {
        street: '15 Commercial Ave',
        city: 'Alexandria',
        state: 'NSW',
        postalCode: '2015',
        country: 'AU',
      },
      latitude: -33.8688,
      longitude: 151.2093,
    },
  },
  {
    name: 'Brisbane',
    slug: 'brisbane',
    city: 'Brisbane',
    state: 'QLD',
    country: 'Australia',
    region: 'South East Queensland',
    address: '88 Logistics Drive, Eagle Farm, QLD 4009',
    phone: '1300 668 254',
    email: 'brisbane@oz-interstate.com.au',
    whatsappNumber: '+61411555880',
    badge: 'Sunshine State Hub',
    shortDescription: 'Direct interstate removalist routes connecting Brisbane, Gold Coast, and Sunshine Coast to Southern states.',
    description: 'OZ Interstate Movers Brisbane delivers expert residential and commercial moving services across Queensland and nationwide.',
    introduction: 'Welcome to OZ Interstate Movers Brisbane. We specialize in moves between South East Queensland and Sydney, Melbourne, Adelaide, and Cairns.',
    localBusinessDescription: 'Our Eagle Farm depot supports linehaul logistics, palletized freight, and comprehensive containerized moves.',
    heroTitle: 'Interstate Removalists & Moving Services in Brisbane',
    heroSubtitle: 'Punctual, fully insured interstate transport connecting Brisbane with Sydney, Melbourne, and all capitals.',
    heroDescription: 'Transparent quotes, experienced removal crews, and weekly scheduled arrivals.',
    heroImage: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=2000&q=80',
    heroCtaText: 'Get Free Brisbane Quote',
    heroCtaUrl: '#quote',
    coordinates: {
      latitude: -27.4698,
      longitude: 153.0251,
    },
    popularRoutes: [
      'Brisbane ➔ Sydney (2-Day Linehaul)',
      'Brisbane ➔ Melbourne (Direct Corridors)',
      'Brisbane ➔ Gold Coast (Daily Transit)',
      'Brisbane ➔ Cairns (Far North QLD Express)',
    ],
    nearbyAreas: ['Eagle Farm', 'Gold Coast', 'Sunshine Coast', 'Ipswich', 'Toowoomba', 'Logan'],
    services: [
      {
        title: 'QLD to Southern States Moves',
        description: 'Fast, secure interstate removals connecting Brisbane directly to Sydney and Melbourne.',
        icon: 'Truck',
        features: ['GPS Tracking', 'Direct Linehaul', 'Fixed Rates'],
      },
      {
        title: 'Full Household Packing',
        description: 'Professional packing service using heavy-duty boxes, port-a-robes, and bubble wrap.',
        icon: 'Package',
        features: ['Port-a-robe Boxes', 'Mattress Covers', 'Custom Crating'],
      },
    ],
    products: [],
    highlights: [
      { title: 'Eagle Farm Freight Hub', desc: 'Secure warehouse for short-term and long-term staging.' },
      { title: 'Door-to-Door Service', desc: 'Full loading and unloading at both origin and destination addresses.' },
    ],
    faqs: [
      {
        question: 'Do you also service Gold Coast and Sunshine Coast?',
        answer: 'Yes, we service the entire South East Queensland region including Gold Coast, Sunshine Coast, Ipswich, and Toowoomba.',
      },
    ],
    testimonials: [
      { name: 'Emma L.', role: 'Newstead', review: 'Very professional team. They took care of our high-value artwork and delivered everything right on schedule.', rating: 5, locationTag: 'Brisbane ➔ Sydney' },
    ],
    ctaTitle: 'Get Your Fixed Brisbane Moving Quote',
    ctaDescription: 'Request an obligation-free quote online or speak with our Queensland moving coordinators.',
    ctaButtonText: 'Calculate Brisbane Quote',
    ctaButtonUrl: '#quote',
    status: 'published',
    isPublished: true,
    publishedAt: new Date(),
    seo: {
      title: 'Interstate Removalists Brisbane | Reliable Moving | OZ-INTERSTATE',
      metaDescription: 'Top-rated Brisbane interstate removalists. Fast linehaul routes to Sydney, Melbourne, and national capitals. Fully insured & fixed pricing. Book today!',
      primaryKeyword: 'Interstate Removalists Brisbane',
      keywords: ['interstate removalists brisbane', 'brisbane to sydney movers', 'removalists qld', 'brisbane freight'],
      h1: 'Interstate Removalists & Moving Services in Brisbane',
      canonicalUrl: '/location/brisbane',
      robots: 'index,follow',
      noIndex: false,
      noFollow: false,
      ogTitle: 'Interstate Removalists Brisbane | OZ-INTERSTATE',
      ogDescription: 'Reliable Brisbane interstate removalists and moving services.',
      ogImage: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
      breadcrumbName: 'Brisbane',
    },
    businessSchema: {
      enabled: true,
      type: 'MovingCompany',
      businessName: 'OZ Interstate Movers Brisbane',
      businessType: 'MovingCompany',
      priceRange: '$$',
      address: {
        street: '88 Logistics Drive',
        city: 'Eagle Farm',
        state: 'QLD',
        postalCode: '4009',
        country: 'AU',
      },
      latitude: -27.4698,
      longitude: 153.0251,
    },
  },
  {
    name: 'Adelaide',
    slug: 'adelaide',
    city: 'Adelaide',
    state: 'SA',
    country: 'Australia',
    region: 'South Australia',
    address: '42 Freight Way, Regency Park, SA 5010',
    phone: '1300 668 254',
    email: 'adelaide@oz-interstate.com.au',
    whatsappNumber: '+61411555880',
    badge: 'SA Gateway',
    shortDescription: 'Connecting Adelaide and South Australia with regular linehaul freight and residential moves across the country.',
    description: 'OZ Interstate Movers Adelaide offers dependable moving and freight solutions with scheduled services to Melbourne, Sydney, and Perth.',
    introduction: 'Welcome to OZ Interstate Movers Adelaide. We provide dedicated and shared-load interstate removals for homes and corporations across South Australia.',
    localBusinessDescription: 'Our Regency Park terminal handles long-haul linehaul, freight consolidation, and container staging for interstate relocations.',
    heroTitle: 'Interstate Removalists & Freight in Adelaide',
    heroSubtitle: 'Direct moving services connecting Adelaide with Melbourne, Sydney, Perth, and regional Australia.',
    heroDescription: 'Fixed rates, GPS-tracked vehicles, and full transit insurance cover.',
    heroImage: 'https://images.unsplash.com/photo-1549488344-cbb6c34cf08b?auto=format&fit=crop&w=2000&q=80',
    heroCtaText: 'Get Free Adelaide Quote',
    heroCtaUrl: '#quote',
    coordinates: {
      latitude: -34.9285,
      longitude: 138.6007,
    },
    popularRoutes: [
      'Adelaide ➔ Melbourne (Overnight Transit)',
      'Adelaide ➔ Sydney (2 Business Days)',
      'Adelaide ➔ Perth (Direct Highway Transit)',
    ],
    nearbyAreas: ['Regency Park', 'Glenelg', 'Port Adelaide', 'Adelaide Hills', 'Mount Barker'],
    services: [
      {
        title: 'Interstate Home Moving',
        description: 'Complete household removals connecting SA to Melbourne, Sydney, and Perth.',
        icon: 'Home',
        features: ['Full Wrapping', 'Disassembly/Reassembly', 'Transit Cover'],
      },
    ],
    products: [],
    highlights: [
      { title: 'Daily Victoria Links', desc: 'Overnight transit connection to Melbourne distribution hubs.' },
    ],
    faqs: [
      {
        question: 'How often do trucks depart Adelaide for Melbourne?',
        answer: 'We operate multiple scheduled departures every week between Adelaide and Melbourne.',
      },
    ],
    testimonials: [
      { name: 'Robert P.', role: 'North Adelaide', review: 'Very seamless moving experience from Adelaide to Melbourne. Everything was wrapped securely and arrived on time.', rating: 5, locationTag: 'Adelaide ➔ Melbourne' },
    ],
    ctaTitle: 'Book Your Adelaide Interstate Move',
    ctaDescription: 'Speak with our South Australian team for a free, customized relocation plan.',
    ctaButtonText: 'Request Quote',
    ctaButtonUrl: '#quote',
    status: 'published',
    isPublished: true,
    publishedAt: new Date(),
    seo: {
      title: 'Interstate Removalists Adelaide | Professional Movers | OZ-INTERSTATE',
      metaDescription: 'Trusted Adelaide interstate removalists with frequent routes to Melbourne, Sydney & Perth. Transparent fixed pricing & transit insurance. Get your quote!',
      primaryKeyword: 'Interstate Removalists Adelaide',
      keywords: ['interstate removalists adelaide', 'adelaide to melbourne movers', 'sa freight transport'],
      h1: 'Interstate Removalists & Freight in Adelaide',
      canonicalUrl: '/location/adelaide',
      robots: 'index,follow',
      noIndex: false,
      noFollow: false,
      ogTitle: 'Interstate Removalists Adelaide | OZ-INTERSTATE',
      ogDescription: 'Reliable Adelaide interstate removalists and moving services.',
      ogImage: 'https://images.unsplash.com/photo-1549488344-cbb6c34cf08b?auto=format&fit=crop&w=1200&q=80',
      breadcrumbName: 'Adelaide',
    },
    businessSchema: {
      enabled: true,
      type: 'MovingCompany',
      businessName: 'OZ Interstate Movers Adelaide',
      businessType: 'MovingCompany',
      priceRange: '$$',
      address: {
        street: '42 Freight Way',
        city: 'Regency Park',
        state: 'SA',
        postalCode: '5010',
        country: 'AU',
      },
      latitude: -34.9285,
      longitude: 138.6007,
    },
  },
  {
    name: 'Perth',
    slug: 'perth',
    city: 'Perth',
    state: 'WA',
    country: 'Australia',
    region: 'Western Australia',
    address: '102 Transport Ave, Kewdale, WA 6105',
    phone: '1300 668 254',
    email: 'perth@oz-interstate.com.au',
    whatsappNumber: '+61411555880',
    badge: 'WA Hub',
    shortDescription: 'Specialist cross-country interstate removals connecting Western Australia to the Eastern States.',
    description: 'OZ Interstate Movers Perth provides dedicated and containerized moving services across the Nullarbor connecting WA with Melbourne, Sydney, Brisbane, and Adelaide.',
    introduction: 'Welcome to OZ Interstate Movers Perth. We are the premier cross-continent relocation specialists for families, businesses, and government transfers.',
    localBusinessDescription: 'Our Kewdale depot offers full container loading, vehicle transit staging, and long-term secure warehouse holding.',
    heroTitle: 'Interstate Removalists Perth & WA Transport',
    heroSubtitle: 'Specialist cross-continent moves connecting Perth with Melbourne, Sydney, Brisbane, and Adelaide.',
    heroDescription: 'Direct container services, vehicle transport, and comprehensive transit insurance.',
    heroImage: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=2000&q=80',
    heroCtaText: 'Get Free Perth Quote',
    heroCtaUrl: '#quote',
    coordinates: {
      latitude: -31.9505,
      longitude: 115.8605,
    },
    popularRoutes: [
      'Perth ➔ Melbourne (Direct Rail & Road)',
      'Perth ➔ Sydney (Cross-Country Express)',
      'Perth ➔ Brisbane (Containerized Moves)',
    ],
    nearbyAreas: ['Kewdale', 'Fremantle', 'Joondalup', 'Mandurah', 'Rockingham'],
    services: [
      {
        title: 'Cross-Country Container Moves',
        description: 'Dedicated 20ft and 40ft container relocations between WA and Eastern States.',
        icon: 'Truck',
        features: ['Container Self-Pack or Full Service', 'GPS Tracking', 'Direct Rail Option'],
      },
    ],
    products: [],
    highlights: [
      { title: 'Cross-Continent Specialists', desc: 'Decades of experience navigating cross-country transit safely.' },
    ],
    faqs: [
      {
        question: 'How long does a move from Perth to Melbourne or Sydney take?',
        answer: 'Cross-country moves typically take 5 to 10 business days depending on road/rail scheduling and freight mode.',
      },
    ],
    testimonials: [
      { name: 'Anthony B.', role: 'Fremantle', review: 'Outstanding service moving our family home from Perth to Melbourne. Containers were delivered right on time.', rating: 5, locationTag: 'Perth ➔ Melbourne' },
    ],
    ctaTitle: 'Planning a Cross-Country Move From Perth?',
    ctaDescription: 'Get in touch with our Western Australia team for an accurate quote and timeline.',
    ctaButtonText: 'Get Perth Quote',
    ctaButtonUrl: '#quote',
    status: 'published',
    isPublished: true,
    publishedAt: new Date(),
    seo: {
      title: 'Interstate Removalists Perth | Coast-to-Coast Movers | OZ-INTERSTATE',
      metaDescription: 'Specialist Perth interstate removalists connecting WA to Melbourne, Sydney, Brisbane & Adelaide. Container & road linehaul. Request a free quote!',
      primaryKeyword: 'Interstate Removalists Perth',
      keywords: ['interstate removalists perth', 'perth to melbourne movers', 'wa interstate freight'],
      h1: 'Interstate Removalists Perth & WA Transport',
      canonicalUrl: '/location/perth',
      robots: 'index,follow',
      noIndex: false,
      noFollow: false,
      ogTitle: 'Interstate Removalists Perth | OZ-INTERSTATE',
      ogDescription: 'Specialist Perth interstate removalists for moves across Australia.',
      ogImage: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=1200&q=80',
      breadcrumbName: 'Perth',
    },
    businessSchema: {
      enabled: true,
      type: 'MovingCompany',
      businessName: 'OZ Interstate Movers Perth',
      businessType: 'MovingCompany',
      priceRange: '$$',
      address: {
        street: '102 Transport Ave',
        city: 'Kewdale',
        state: 'WA',
        postalCode: '6105',
        country: 'AU',
      },
      latitude: -31.9505,
      longitude: 115.8605,
    },
  },
]

const seed = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/oz_interstate')
    console.log(`Connected to MongoDB: ${conn.connection.host}`)

    console.log(`Seeding ${sampleLocations.length} locations...`)

    for (const locData of sampleLocations) {
      const health = calculateSeoHealth(locData)
      locData.seoScore = health.score
      locData.seoWarnings = health.warnings

      const saved = await Location.findOneAndUpdate(
        { slug: locData.slug },
        locData,
        { upsert: true, new: true }
      )

      await LocationRevision.findOneAndUpdate(
        { locationId: saved._id, version: 1 },
        {
          locationId: saved._id,
          version: 1,
          changedBy: 'System Seed',
          summary: 'Initial high-quality seed data with full SEO engine',
          snapshot: saved.toObject(),
        },
        { upsert: true }
      )

      console.log(`✓ Seeded Location: ${saved.name} (${saved.slug}) - SEO Score: ${saved.seoScore}/100`)
    }

    console.log('✅ All locations seeded successfully!')
    process.exit(0)
  } catch (err) {
    console.error('❌ Seeding error:', err)
    process.exit(1)
  }
}

seed()
