import { formatImageUrl } from '../../utils/urlHelper'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Sparkles,
  ShieldCheck,
  Star,
  Clock,
  Phone,
  Send,
  User,
  Mail,
  MapPin,
  CalendarDays,
  Home,
  CheckCircle2,
  Truck,
  ArrowRight,
  ChevronRight,
  Award,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { getIcon } from '../../utils/iconMap'
import { COMPANY, PROPERTY_SIZES } from '../../data/siteData'
import { submitInquiry } from '../../services/api'

function ServiceQuoteForm({ service }) {
  const [formValues, setFormValues] = useState({
    name: '',
    phone: '',
    email: '',
    from: '',
    to: '',
    date: '',
    property: '2 Bedroom',
  })
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSubmitting(true)
      const payload = {
        ...formValues,
        source: 'service_page',
        serviceId: service?._id || null,
        serviceSlug: service?.slug || '',
        serviceTitle: service?.title || '',
      }

      const response = await submitInquiry(payload)
      const data = response.data
      if (data.success) {
        toast.success(data.message || 'Quote request submitted successfully!')
        setFormValues({
          name: '',
          phone: '',
          email: '',
          from: '',
          to: '',
          date: '',
          property: '2 Bedroom',
        })
        if (data.redirect_url) {
          window.location.href = data.redirect_url
        }
      } else {
        toast.error(data.message || 'Failed to submit quote request.')
      }
    } catch (err) {
      console.error('Error submitting service quote:', err)
      toast.error('Failed to submit quote request. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass =
    'w-full rounded-2xl border border-slate-200 bg-white/95 px-4 py-3 pl-11 text-xs font-semibold text-navy shadow-xs outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-accent focus:bg-white focus:ring-4 focus:ring-accent/20'

  return (
    <div id="quote" className="relative overflow-hidden rounded-4xl border border-white/40 bg-white/95 p-6 shadow-float backdrop-blur-2xl sm:p-8">
      {/* Decorative accent top strip */}
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-sky-400 via-primary-500 to-accent" />

      <div className="mb-5 flex items-center justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-accent">
            <Sparkles className="h-3 w-3" />
            Fast Quote Estimate
          </span>
          <h3 className="mt-2 font-display text-2xl font-black text-navy sm:text-[1.65rem]">
            Book {service?.title || 'Relocation'}
          </h3>
        </div>
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 font-bold">
          {service?.icon ? getIcon(service.icon, { className: 'h-6 w-6' }) : <Truck className="h-6 w-6" />}
        </span>
      </div>

      <p className="mb-5 text-xs text-slate-500">
        Fixed transparent rates • 100% Goods-in-transit insurance • No surprise fees
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {/* Name */}
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              required
              type="text"
              name="name"
              value={formValues.name}
              onChange={handleChange}
              placeholder="Your Full Name"
              className={inputClass}
            />
          </div>

          {/* Phone */}
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              required
              type="tel"
              name="phone"
              value={formValues.phone}
              onChange={handleChange}
              placeholder="Phone (04XX XXX XXX)"
              className={inputClass}
            />
          </div>
        </div>

        {/* Email */}
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="email"
            name="email"
            value={formValues.email}
            onChange={handleChange}
            placeholder="Email Address"
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {/* From */}
          <div className="relative">
            <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              required
              type="text"
              name="from"
              value={formValues.from}
              onChange={handleChange}
              placeholder="Moving From (City/Suburb)"
              className={inputClass}
            />
          </div>

          {/* To */}
          <div className="relative">
            <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              required
              type="text"
              name="to"
              value={formValues.to}
              onChange={handleChange}
              placeholder="Moving To (Destination)"
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {/* Date */}
          <div className="relative">
            <CalendarDays className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="date"
              name="date"
              value={formValues.date}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* Property Size */}
          <div className="relative">
            <Home className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <select
              name="property"
              value={formValues.property}
              onChange={handleChange}
              className={inputClass}
            >
              {PROPERTY_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-gradient px-5 py-4 text-xs font-black uppercase tracking-wider text-white shadow-soft transition-all duration-300 hover:shadow-glow-accent hover:-translate-y-0.5 disabled:opacity-60"
        >
          {submitting ? 'Calculating Quote...' : `Get Instant ${service?.title || 'Moving'} Quote`}
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  )
}

export default function ServiceHero({ service }) {
  const h1Title = service?.heroTitle || service?.seo?.h1 || service?.title || 'Professional Removalists'
  const subtitle = service?.heroSubtitle || ''
  const description =
    service?.heroDescription ||
    service?.content ||
    service?.short_description ||
    'Dedicated interstate moving, professional packing, and safe scheduled highway linehaul across Australia.'

  const features = Array.isArray(service?.features) && service.features.length > 0
    ? service.features.slice(0, 3)
    : ['Comprehensive Goods-in-Transit Insurance', 'Dedicated Interstate Move Coordinator', 'GPS Live Satellite Tracked Fleet']

  const rawMediaUrl = service?.heroImage || service?.image
  const isVideo =
    Boolean(rawMediaUrl) &&
    (rawMediaUrl.endsWith('.mp4') || rawMediaUrl.endsWith('.webm') || rawMediaUrl.includes('/uploads/videos/'))

  const formattedMediaUrl = rawMediaUrl
    ? formatImageUrl(rawMediaUrl)
    : 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=2000&q=80'

  return (
    <section className="relative overflow-hidden bg-navy pt-24 pb-20 text-white sm:pt-28 sm:pb-28">
      {/* Dynamic Background Media from Admin Hero Media */}
      <div className="absolute inset-0 z-0">
        {isVideo ? (
          <video
            key={formattedMediaUrl}
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
          >
            <source src={formattedMediaUrl} />
          </video>
        ) : (
          <img
            src={formattedMediaUrl}
            alt={h1Title}
            className="h-full w-full object-cover"
          />
        )}
        {/* Dark Navy Overlay for maximum contrast and readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/90 to-navy/85 backdrop-blur-[2px]" />
      </div>

      {/* Ambience & Lighting effects */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-grid-lines-light opacity-20" />
      <div className="pointer-events-none absolute -top-40 -right-20 z-0 h-[500px] w-[500px] animate-aurora rounded-full bg-accent/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-20 z-0 h-96 w-96 rounded-full bg-sky-500/20 blur-3xl" />

      <div className="container-px relative z-10 mx-auto max-w-7xl">
        {/* Sleek Breadcrumb Pill */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <nav aria-label="Breadcrumb" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/90 backdrop-blur-md">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3 text-white/50" />
            <Link to="/services" className="hover:text-white transition-colors">Services</Link>
            <ChevronRight className="h-3 w-3 text-white/50" />
            <span className="font-bold text-sky-300">{service?.title}</span>
          </nav>

          <div className="hidden sm:flex items-center gap-3 text-xs font-bold text-emerald-400">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Weekly Highway Departures Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Left Hero Narrative */}
          <div className="lg:col-span-7">
            {/* Service Category Tag */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/15 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-sky-300 backdrop-blur-md"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-white">
                {service?.icon ? getIcon(service.icon, { className: 'h-3 w-3' }) : <Sparkles className="h-3 w-3" />}
              </span>
              <span>{service?.title || 'Specialized Service'} • Australia-Wide Linehaul</span>
            </motion.div>

            {/* Main H1 Title */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-5 font-display text-3xl font-black tracking-tight sm:text-4xl lg:text-[3.25rem] lg:leading-[1.1]"
            >
              {h1Title}
            </motion.h1>

            {/* H2 Subtitle */}
            {subtitle && (
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="mt-4 font-display text-lg font-bold text-sky-200 sm:text-xl"
              >
                {subtitle}
              </motion.h2>
            )}

            {/* Paragraph Description */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-200 sm:text-base"
            >
              {description}
            </motion.p>

            {/* Included Capabilities Pills */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="mt-6 space-y-2.5"
            >
              {features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-200">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </span>
                  <span>{feat}</span>
                </div>
              ))}
            </motion.div>

            {/* Action Hotline & Quick CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <a
                href="#quote"
                className="inline-flex items-center gap-2 rounded-2xl bg-blue-gradient px-7 py-4 text-xs font-black uppercase tracking-wider text-white shadow-float transition-all hover:scale-105 hover:shadow-glow-accent"
              >
                Get Free Estimate
                <ArrowRight className="h-4 w-4" />
              </a>

              <a
                href={COMPANY.phoneHref}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 py-4 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md transition-colors hover:bg-white/20"
              >
                <Phone className="h-4 w-4 text-sky-400" />
                {COMPANY.phone}
              </a>
            </motion.div>

            {/* Trust Metrics Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-10 grid grid-cols-3 gap-3 border-t border-white/15 pt-6 text-xs text-slate-300 sm:text-sm"
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
                <div>
                  <p className="font-bold text-white">100% Insured</p>
                  <p className="text-[11px] text-slate-400">Transit Protected</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="h-5 w-5 text-sky-400 shrink-0" />
                <div>
                  <p className="font-bold text-white">Strict Schedules</p>
                  <p className="text-[11px] text-slate-400">On-Time Windows</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Star className="h-5 w-5 fill-amber-400 text-amber-400 shrink-0" />
                <div>
                  <p className="font-bold text-white">4.9/5 Rating</p>
                  <p className="text-[11px] text-slate-400">1,200+ Reviews</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Floating Quote Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5"
          >
            <ServiceQuoteForm service={service} />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
