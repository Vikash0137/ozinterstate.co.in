import {
  Home as HomeIcon,
  Building2,
  Truck,
  Sofa,
  PackageOpen,
  Warehouse,
  ShieldCheck,
  Users,
  BadgeDollarSign,
  Route,
  Clock,
  HeartHandshake,
} from 'lucide-react'

export const COMPANY = {
  name: 'MoveLink',
  fullName: 'MoveLink Interstate Removalists',
  tagline: "Australia's Trusted Interstate Removalists",
  phone: '03 41576927',
  phoneHref: 'tel:0341576927',
  emergency: '0411 555 880',
  emergencyHref: 'tel:0411555880',
  email: 'info@ozinterstatemovers.com.au',
  emailHref: 'mailto:info@ozinterstatemovers.com.au',
  address: '10 Cactus Lane, Campbellfield VIC 3061, Australia',
  abn: 'ABN 84 622 119 037',
}

export const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Company Profile', to: '/company-profile' },
  { label: 'Our Services', to: '/services' },
  { label: 'Reviews', to: '/reviews' },
  { label: 'Our Blogs', to: '/blogs' },
  { label: 'Sitemap', to: '/sitemap' },
]

export const TRUST_BADGES = [
  { icon: ShieldCheck, label: 'Fully Insured' },
  { icon: Users, label: 'Professional Movers' },
  { icon: Route, label: 'Interstate Specialists' },
  { icon: Clock, label: 'Same Day Service' },
  { icon: BadgeDollarSign, label: 'Transparent Pricing' },
]

export const STATS = [
  { value: 5000, suffix: '+', label: 'Moves Completed' },
  { value: 4.9, suffix: '★', label: 'Google Rating', decimals: 1 },
  { value: 10, suffix: '+', label: 'Years Experience' },
  { value: 24, suffix: '/7', label: 'Customer Support' },
]

export const SERVICES = [
  {
    icon: HomeIcon,
    title: 'House Removalists',
    slug: 'house-removalists',
    desc: 'End-to-end home moves with careful handling, protective wrapping and a dedicated move coordinator.',
  },
  {
    icon: Building2,
    title: 'Office Relocation',
    slug: 'office-relocation',
    desc: 'Minimise downtime with after-hours corporate relocations, IT handling and workstation reassembly.',
  },
  {
    icon: Truck,
    title: 'Interstate Moving',
    slug: 'interstate-moving',
    desc: 'Reliable backloading and dedicated trucks connecting every capital city across Australia.',
  },
  {
    icon: Sofa,
    title: 'Furniture Moving',
    slug: 'furniture-moving',
    desc: 'Single items to full households — disassembly, padding and damage-free transport guaranteed.',
  },
  {
    icon: PackageOpen,
    title: 'Packing Services',
    slug: 'packing-services',
    desc: 'Premium materials and trained packers to secure your fragile, valuable and bulky belongings.',
  },
  {
    icon: Warehouse,
    title: 'Storage Solutions',
    slug: 'storage-solutions',
    desc: 'Secure, climate-controlled short and long-term storage with flexible access when you need it.',
  },
]

export const WHY_CHOOSE = [
  { icon: Users, title: 'Experienced Team', desc: 'Background-checked, trained removalists with 10+ years on Australian roads.' },
  { icon: BadgeDollarSign, title: 'Affordable Pricing', desc: 'Transparent, fixed quotes with no hidden fees or surprise charges.' },
  { icon: Truck, title: 'Safe Transportation', desc: 'GPS-tracked, padded trucks engineered for long-haul interstate moves.' },
  { icon: Clock, title: 'On-Time Delivery', desc: 'Guaranteed delivery windows so you can plan your move with confidence.' },
  { icon: HeartHandshake, title: 'Satisfaction Guarantee', desc: '4.9★ rated service backed by our promise to make it right, every time.' },
]

export const PROCESS_STEPS = [
  { step: '01', title: 'Request Quote', desc: 'Share your move details and receive a transparent, fixed-price quote in minutes.' },
  { step: '02', title: 'Plan Your Move', desc: 'A dedicated coordinator builds your custom moving plan and timeline.' },
  { step: '03', title: 'Professional Packing', desc: 'Our trained team wraps, boxes and labels every item with premium materials.' },
  { step: '04', title: 'Safe Transportation', desc: 'GPS-tracked trucks transport your belongings securely across state lines.' },
  { step: '05', title: 'Successful Delivery', desc: 'We unload, reassemble and place everything exactly where you want it.' },
]

export const LOCATIONS = [
  { city: 'Melbourne', state: 'VIC', moves: '1,800+', image: 'https://images.unsplash.com/photo-1545044846-351ba102b6d5?auto=format&fit=crop&w=800&q=80' },
  { city: 'Sydney', state: 'NSW', moves: '2,100+', image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80' },
  { city: 'Brisbane', state: 'QLD', moves: '1,250+', image: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=800&q=80' },
  { city: 'Adelaide', state: 'SA', moves: '780+', image: 'https://images.unsplash.com/photo-1589330273594-fade1ee91647?auto=format&fit=crop&w=800&q=80' },
  { city: 'Perth', state: 'WA', moves: '640+', image: 'https://images.unsplash.com/photo-1573935448851-5da25b62f681?auto=format&fit=crop&w=800&q=80' },
  { city: 'Canberra', state: 'ACT', moves: '430+', image: 'https://images.unsplash.com/photo-1591025207163-942350e47db2?auto=format&fit=crop&w=800&q=80' },
]

export const REVIEWS = [
  {
    name: 'Sarah Thompson',
    role: 'Melbourne → Sydney',
    rating: 5,
    avatar: 'https://i.pravatar.cc/150?img=47',
    text: 'Absolutely seamless interstate move. The team wrapped everything beautifully and delivered a day early. Not a single scratch on our furniture!',
  },
  {
    name: 'James Mitchell',
    role: 'Office Relocation, Brisbane',
    rating: 5,
    avatar: 'https://i.pravatar.cc/150?img=12',
    text: 'They relocated our 40-person office over a weekend with zero downtime. Professional, punctual and incredibly well organised.',
  },
  {
    name: 'Priya Nair',
    role: 'Adelaide → Perth',
    rating: 5,
    avatar: 'https://i.pravatar.cc/150?img=32',
    text: 'The fixed quote was exactly what we paid — no surprises. GPS tracking gave us total peace of mind across the Nullarbor.',
  },
  {
    name: 'Daniel O’Connor',
    role: 'House Move, Canberra',
    rating: 5,
    avatar: 'https://i.pravatar.cc/150?img=15',
    text: 'From packing to reassembly, the crew was friendly and efficient. Best removalist experience we have ever had, hands down.',
  },
  {
    name: 'Emily Chen',
    role: 'Sydney → Gold Coast',
    rating: 5,
    avatar: 'https://i.pravatar.cc/150?img=45',
    text: 'Booked a same-day move and they delivered. Careful with our piano and artwork. Highly recommend MoveLink to anyone.',
  },
]

export const GALLERY = [
  { src: 'https://images.unsplash.com/photo-1600518464441-9154a4dea21b?auto=format&fit=crop&w=900&q=80', alt: 'Moving truck loaded with boxes', span: 'row-span-2' },
  { src: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=900&q=80', alt: 'Packing team wrapping furniture' },
  { src: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80', alt: 'Office relocation in progress' },
  { src: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=900&q=80', alt: 'Movers carrying boxes into a home', span: 'row-span-2' },
  { src: 'https://images.unsplash.com/photo-1607512795097-a17b4960b2c9?auto=format&fit=crop&w=900&q=80', alt: 'Furniture being moved carefully' },
  { src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80', alt: 'Interstate transport truck on highway' },
]

export const FAQS = [
  {
    q: 'How much does interstate moving cost?',
    a: 'Interstate moving costs depend on distance, volume, access and timing. A typical 2-bedroom move between capital cities ranges from $1,200–$3,500. Request a free quote and we will provide a transparent, fixed price with no hidden fees.',
  },
  {
    q: 'Are my items insured?',
    a: 'Yes. Every move includes comprehensive transit insurance covering your belongings from pickup to delivery. We also offer optional full-replacement cover for high-value items for complete peace of mind.',
  },
  {
    q: 'Do you offer packing services?',
    a: 'Absolutely. Our trained packers use premium materials to wrap, box and label everything. You can choose full packing, partial packing, or fragile-only packing to suit your budget and needs.',
  },
  {
    q: 'Can I book same-day moving?',
    a: 'Yes, subject to availability. We keep capacity reserved for urgent and same-day moves. Call our team on 1300 668 254 and we will do our best to accommodate your timeline.',
  },
  {
    q: 'Which cities do you cover?',
    a: 'We service every Australian capital and major regional centre, including Melbourne, Sydney, Brisbane, Adelaide, Perth and Canberra, with regular interstate routes between them all.',
  },
]

export const BLOGS = [
  {
    title: '10 Essential Tips for a Stress-Free Interstate Move',
    slug: 'stress-free-interstate-move',
    category: 'Moving Tips',
    date: 'Jun 12, 2026',
    read: '6 min read',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
    excerpt: 'Planning a move across state lines? These expert-backed tips will keep your relocation smooth, safe and on schedule.',
  },
  {
    title: 'How to Pack Fragile Items Like a Professional',
    slug: 'pack-fragile-items',
    category: 'Packing Guides',
    date: 'May 28, 2026',
    read: '5 min read',
    image: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=900&q=80',
    excerpt: 'Glassware, artwork and electronics deserve special care. Learn the techniques our packers use to keep fragile items safe.',
  },
  {
    title: 'The True Cost of Moving Interstate in 2026',
    slug: 'cost-of-moving-interstate-2026',
    category: 'Cost & Budgeting',
    date: 'May 10, 2026',
    read: '7 min read',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=900&q=80',
    excerpt: 'Understand what really drives the price of an interstate move and how to budget smartly without compromising on quality.',
  },
  {
    title: 'Office Relocation Checklist for Australian Businesses',
    slug: 'office-relocation-checklist',
    category: 'Business Moves',
    date: 'Apr 22, 2026',
    read: '8 min read',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80',
    excerpt: 'Minimise downtime and protect your assets with our step-by-step checklist for a seamless corporate relocation.',
  },
  {
    title: 'Storage Solutions: Short-Term vs Long-Term',
    slug: 'storage-short-vs-long-term',
    category: 'Storage',
    date: 'Apr 05, 2026',
    read: '4 min read',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=900&q=80',
    excerpt: 'Not sure which storage option fits your move? We break down the pros, cons and costs of each to help you decide.',
  },
  {
    title: 'Moving With Pets: A Complete Guide',
    slug: 'moving-with-pets',
    category: 'Moving Tips',
    date: 'Mar 18, 2026',
    read: '5 min read',
    image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=900&q=80',
    excerpt: 'Relocating with furry family members? Keep your pets calm, safe and comfortable throughout your interstate journey.',
  },
]

export const PROPERTY_SIZES = [
  'Studio / 1 Bedroom',
  '2 Bedroom',
  '3 Bedroom',
  '4+ Bedroom',
  'Office / Commercial',
  'Few Items Only',
]
