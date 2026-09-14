import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Sparkles,
  Star,
  ShieldCheck,
  Send,
  MapPin,
  CalendarDays,
  Home,
  Phone,
  Mail,
  User,
} from 'lucide-react'
import { fadeUp, stagger } from '../utils/motion'
import { getLocationBySlug } from '../data/locationsData'
import { fetchActiveBanner, fetchInquiryForm, submitInquiry } from '../services/api'
import { resolveApiBaseUrl } from '../utils/siteSettings'
import toast from 'react-hot-toast'

const slides = [0, 1, 2]

function QuoteForm({ location, service }) {
  const [formSettings, setFormSettings] = useState(null)
  const [fields, setFields] = useState([])
  const [formValues, setFormValues] = useState({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchInquiryForm()
      .then((response) => {
        const data = response.data
        if (data.success && data.data) {
          if (data.data.form) setFormSettings(data.data.form)
          if (data.data.fields && data.data.fields.length > 0) {
            setFields(data.data.fields)
            const initialVals = {}
            data.data.fields.forEach((f) => {
              initialVals[f.field_name] = f.default_value || ''
            })
            // If location provided, set 'from' or 'moving_from' default value
            if (location?.city || location?.name) {
              initialVals['from'] = location.city || location.name
              initialVals['movingFrom'] = location.city || location.name
            }
            setFormValues((prev) => ({ ...initialVals, ...prev }))
          }
        }
      })
      .catch((err) => {
        console.error('Failed to fetch dynamic inquiry form schema:', err)
      })
  }, [])

  useEffect(() => {
    if (location?.city || location?.name) {
      setFormValues((prev) => ({
        ...prev,
        from: prev.from || location.city || location.name,
        movingFrom: prev.movingFrom || location.city || location.name,
      }))
    }
  }, [location])

  const handleChange = (fieldName, value) => {
    setFormValues((prev) => ({ ...prev, [fieldName]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSubmitting(true)
      const payload = {
        ...formValues,
        source: service ? 'service_page' : location ? 'location_page' : 'website',
        serviceId: service?._id || null,
        serviceSlug: service?.slug || '',
        serviceTitle: service?.title || '',
        locationId: location?._id || null,
        locationSlug: location?.slug || '',
        locationName: location?.name || '',
      }

      const response = await submitInquiry(payload)
      const data = response.data
      if (data.success) {
        toast.success(data.message || 'Quote request submitted successfully!')
        // Reset form
        const resetVals = {}
        fields.forEach((f) => {
          resetVals[f.field_name] = ''
        })
        if (location?.city || location?.name) {
          resetVals['from'] = location.city || location.name
          resetVals['movingFrom'] = location.city || location.name
        }
        setFormValues(resetVals)
        if (data.redirect_url) {
          window.location.href = data.redirect_url
        }
      } else {
        toast.error(data.message || 'Failed to submit quote request.')
      }
    } catch (err) {
      console.error('Error submitting form:', err)
      toast.error('Failed to submit. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass =
    'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 pl-11 text-sm font-medium text-slate-800 shadow-sm outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-accent focus:ring-4 focus:ring-accent/20'

  const renderIcon = (iconName) => {
    switch (iconName) {
      case 'User':
        return <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      case 'Phone':
        return <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      case 'Mail':
        return <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      case 'MapPin':
        return <MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      case 'CalendarDays':
      case 'Calendar':
        return <CalendarDays className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      case 'Home':
        return <Home className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      case 'ShieldCheck':
        return <ShieldCheck className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      case 'Sparkles':
        return <Sparkles className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      default:
        return <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    }
  }

  // Fallback fields if backend is loading or unavailable
  const activeFields =
    fields.length > 0
      ? fields
      : [
          { field_name: 'name', label: 'Full Name', placeholder: 'Full Name', field_type: 'text', required: true, width: '50%', icon: 'User' },
          { field_name: 'phone', label: 'Phone Number', placeholder: 'Phone Number', field_type: 'phone', required: true, width: '50%', icon: 'Phone' },
          { field_name: 'email', label: 'Email Address', placeholder: 'Email Address', field_type: 'email', required: false, width: '100%', icon: 'Mail' },
          { field_name: 'from', label: 'Moving From', placeholder: 'Moving From', field_type: 'text', required: true, width: '100%', icon: 'MapPin' },
          { field_name: 'to', label: 'Moving To', placeholder: 'Moving To', field_type: 'text', required: true, width: '100%', icon: 'MapPin' },
          { field_name: 'date', label: 'Moving Date', placeholder: '', field_type: 'date', required: false, width: '50%', icon: 'CalendarDays' },
          { field_name: 'property', label: 'Property Type', placeholder: 'Property Type', field_type: 'select', options: ['1 Bedroom', '2 Bedroom', '3 Bedroom', '4 Bedroom', 'Office'], required: false, width: '50%', icon: 'Home' },
        ]

  return (
    <div id="quote" className="rounded-[2rem] border border-white/30 bg-white/95 p-5 shadow-2xl backdrop-blur-xl sm:p-6 lg:p-7">
      <div className="mb-6">
        <span className="inline-flex rounded-full bg-accent/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent">
          {formSettings?.subtitle || 'Free Instant Estimate'}
        </span>
        <h3 className="mt-3 font-display text-2xl font-extrabold text-navy">
          {service
            ? `Get Your ${service.title} Quote`
            : location
            ? `Get Your ${location.name} Moving Quote`
            : formSettings?.title || 'Get Your Moving Quote'}
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          {formSettings?.description || 'Fill the form and our team will contact you shortly.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-wrap gap-y-4 -mx-2">
          {activeFields.map((f) => {
            const widthClass =
              f.width === '50%'
                ? 'w-full sm:w-1/2 px-2'
                : f.width === '33%'
                ? 'w-full sm:w-1/3 px-2'
                : f.width === '25%'
                ? 'w-full sm:w-1/4 px-2'
                : 'w-full px-2'

            return (
              <div key={f.field_name || f.id} className={widthClass}>
                <div className="relative">
                  {renderIcon(f.icon)}

                  {f.field_type === 'select' || f.field_type === 'dropdown' ? (
                    <select
                      name={f.field_name}
                      value={formValues[f.field_name] || ''}
                      onChange={(e) => handleChange(f.field_name, e.target.value)}
                      className={inputClass}
                      required={Boolean(f.required)}
                      disabled={Boolean(f.read_only)}
                    >
                      <option value="">{f.placeholder || `Select ${f.label}`}</option>
                      {(Array.isArray(f.options) ? f.options : []).map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : f.field_type === 'textarea' ? (
                    <textarea
                      name={f.field_name}
                      value={formValues[f.field_name] || ''}
                      onChange={(e) => handleChange(f.field_name, e.target.value)}
                      placeholder={f.placeholder || f.label}
                      rows={2}
                      className={inputClass}
                      required={Boolean(f.required)}
                      disabled={Boolean(f.read_only)}
                    />
                  ) : (
                    <input
                      type={f.field_type === 'phone' ? 'tel' : f.field_type}
                      name={f.field_name}
                      value={formValues[f.field_name] || ''}
                      onChange={(e) => handleChange(f.field_name, e.target.value)}
                      placeholder={f.placeholder || f.label}
                      className={inputClass}
                      required={Boolean(f.required)}
                      disabled={Boolean(f.read_only)}
                    />
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-gradient px-5 py-4 text-sm font-extrabold uppercase tracking-wide text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-60"
        >
          {submitting
            ? 'Submitting Request...'
            : formSettings?.button_text ||
              (service
                ? `Get Free ${service.title} Quote`
                : location
                ? `Get Free ${location.name} Quote`
                : 'Submit Quote Request')}
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  )
}

export default function Hero({ location: propLocation, service: propService }) {
  const [active, setActive] = useState(0)
  const [bannerData, setBannerData] = useState(null)
  const [searchParams] = useSearchParams()

  const locationQuery = searchParams.get('location')
  const selectedLocation = propLocation || (locationQuery ? getLocationBySlug(locationQuery) : null)
  const selectedService = propService

  useEffect(() => {
    fetchActiveBanner()
      .then((response) => {
        const data = response.data
        if (data.success && data.data) {
          setBannerData(data.data)
        }
      })
      .catch((err) => {
        console.error('Failed to fetch active banner:', err)
      })
  }, [])

  // Dynamic Badge text (Sync with banner API subtitle, service, or location)
  const heroBadgeText = selectedService
    ? `${selectedService.title} • Australian Transport`
    : selectedLocation
    ? selectedLocation.badge || bannerData?.subtitle || `${selectedLocation.state || selectedLocation.name} Interstate Movers`
    : bannerData?.subtitle || 'Logistic Transportation'

  // Dynamic Title text (Sync with banner API title and styling)
  const heroTitleText = selectedService
    ? selectedService.heroTitle || selectedService.title
    : selectedLocation
    ? selectedLocation.heroTitle ||
      selectedLocation.mainTitle ||
      (bannerData?.title ? bannerData.title : `Interstate Removalists & Freight in ${selectedLocation.name}`)
    : bannerData?.title

  // Dynamic Subtitle text
  const heroSubtitleText = selectedService
    ? selectedService.heroSubtitle || selectedService.short_description
    : selectedLocation
    ? selectedLocation.heroSubtitle || ''
    : ''

  // Dynamic Description text (Sync with banner API description)
  const heroDescriptionText = selectedService
    ? selectedService.heroDescription ||
      selectedService.content ||
      selectedService.short_description ||
      'Dedicated interstate moving, professional packing, and safe transport across Australia.'
    : selectedLocation
    ? selectedLocation.heroDescription ||
      selectedLocation.introduction ||
      selectedLocation.shortDescription ||
      bannerData?.description ||
      `Direct moving services connecting ${selectedLocation.name} with Melbourne, Sydney, Brisbane, Perth, and regional Australia.`
    : bannerData?.description ||
      'Streamlining your move with professional interstate removalist solutions, timely service, and safe transportation across Australia.'

  const API_BASE = resolveApiBaseUrl()
  
  const rawMediaUrl =
    selectedService?.heroImage ||
    selectedService?.image ||
    selectedLocation?.heroImage ||
    (bannerData?.media_type === 'video' && bannerData?.video_url ? bannerData.video_url : bannerData?.image)

  const isVideo =
    Boolean(rawMediaUrl) &&
    (rawMediaUrl.endsWith('.mp4') ||
      rawMediaUrl.endsWith('.webm') ||
      rawMediaUrl.endsWith('.ogg') ||
      rawMediaUrl.includes('/uploads/videos/') ||
      (!selectedService?.heroImage && !selectedLocation?.heroImage && bannerData?.media_type === 'video' && Boolean(bannerData?.video_url)))

  const formattedMediaUrl = rawMediaUrl
    ? rawMediaUrl.startsWith('http') || rawMediaUrl.startsWith('data:')
      ? rawMediaUrl
      : `${API_BASE}${rawMediaUrl.startsWith('/') ? '' : '/'}${rawMediaUrl}`
    : 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=2000&q=80'

  return (
    <section className="relative px-3 pt-24 sm:px-5 lg:pt-28">
      <div className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[2rem] sm:rounded-[2.5rem]">
        <div className="absolute inset-0">
          {isVideo ? (
            <video
              key={formattedMediaUrl}
              autoPlay={bannerData?.autoplay !== 0}
              muted={bannerData?.muted !== 0}
              loop={bannerData?.loop !== 0}
              controls={Boolean(bannerData?.controls)}
              preload={bannerData?.preload || 'auto'}
              poster={
                bannerData?.video_thumbnail
                  ? bannerData.video_thumbnail.startsWith('http') || bannerData.video_thumbnail.startsWith('data:')
                    ? bannerData.video_thumbnail
                    : `${API_BASE}${bannerData.video_thumbnail}`
                  : undefined
              }
              className="h-full w-full object-cover"
              style={{ objectFit: bannerData?.object_fit || 'cover' }}
            >
              <source src={formattedMediaUrl} />
            </video>
          ) : (
            <img
              src={formattedMediaUrl}
              alt={heroTitleText || 'Hero Banner'}
              className="h-full w-full object-cover"
            />
          )}

          <div
            className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30"
            style={
              bannerData?.overlay_color
                ? {
                    backgroundColor: bannerData.overlay_color,
                    opacity: bannerData.overlay_opacity !== undefined ? parseFloat(bannerData.overlay_opacity) : 0.7,
                  }
                : undefined
            }
          />
        </div>

        <div className="container-px relative z-10 grid min-h-[88vh] grid-cols-1 items-center gap-10 py-16 lg:min-h-[92vh] lg:grid-cols-12 lg:py-20">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 xl:col-span-6"
          >
            <motion.span
              variants={fadeUp}
              className="inline-flex items-center gap-2 rounded-full border border-white/95 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white backdrop-blur"
            >
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              {heroBadgeText}
            </motion.span>

            <motion.h1
              variants={fadeUp}
              className="mt-6 font-display text-3xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-4xl lg:text-5xl xl:text-[3.5rem]"
              style={
                bannerData
                  ? {
                      fontFamily: bannerData.font_family || 'Inter',
                      fontSize: bannerData.title_font_size || undefined,
                      fontWeight: bannerData.title_font_weight || undefined,
                      fontStyle: bannerData.title_font_style || undefined,
                      color: bannerData.title_color || '#ffffff',
                      letterSpacing: bannerData.title_letter_spacing || undefined,
                      lineHeight: bannerData.title_line_height || undefined,
                      textTransform: bannerData.title_text_transform || undefined,
                      textAlign: bannerData.text_alignment || undefined,
                    }
                  : undefined
              }
            >
              {heroTitleText || (
                <>
                  Logistics Excellence:
                  <span className="block bg-gradient-to-r from-white via-sky-200 to-accent bg-clip-text text-transparent">
                    Beyond Boundaries
                  </span>
                </>
              )}
            </motion.h1>

            {selectedLocation?.heroSubtitle && (
              <motion.h2
                variants={fadeUp}
                className="mt-3 text-sm sm:text-base font-semibold text-sky-200"
              >
                {selectedLocation.heroSubtitle}
              </motion.h2>
            )}

            <motion.p
              variants={fadeUp}
              className="mt-6 max-w-xl text-sm leading-relaxed text-white/100 sm:text-base"
              style={
                bannerData
                  ? {
                      fontFamily: bannerData.description_font_family || undefined,
                      fontSize: bannerData.description_font_size || undefined,
                      fontWeight: bannerData.description_font_weight || undefined,
                      fontStyle: bannerData.description_font_style || undefined,
                      color: bannerData.description_color || undefined,
                      letterSpacing: bannerData.description_letter_spacing || undefined,
                      lineHeight: bannerData.description_line_height || undefined,
                      textAlign: bannerData.description_text_alignment || undefined,
                    }
                  : undefined
              }
            >
              {heroDescriptionText}
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to={bannerData?.button_link || '/services'}
                className="btn-primary"
                style={
                  bannerData?.button_background_color
                    ? {
                        fontFamily: bannerData.button_font_family || undefined,
                        fontSize: bannerData.button_font_size || undefined,
                        fontWeight: bannerData.button_font_weight || undefined,
                        color: bannerData.button_text_color || '#ffffff',
                        backgroundColor: bannerData.button_background_color,
                        borderRadius: bannerData.button_border_radius || undefined,
                        borderColor: bannerData.button_border_color || undefined,
                      }
                    : undefined
                }
              >
                {bannerData?.button_text || 'Our Services'}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/contact" className="btn-outline">
                Get Free Quote
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <div className="flex items-center gap-2.5">
                <div className="flex -space-x-3">
                  {[47, 12, 32, 15].map((i) => (
                    <img
                      key={i}
                      src={`https://i.pravatar.cc/80?img=${i}`}
                      alt="Happy customer"
                      className="h-9 w-9 rounded-full border-2 border-white object-cover"
                    />
                  ))}
                </div>

                <div className="text-sm">
                  <div className="flex items-center gap-1 text-amber-300">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="font-semibold text-white">4.9/5 from 1,200+ reviews</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-white">
                <ShieldCheck className="h-9 w-9 text-accent" />
                <div className="text-sm">
                  <p className="font-bold">Fully Insured</p>
                  <p className="text-white/70">Every move, every km</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="lg:col-span-5 xl:col-span-5 xl:col-start-8"
          >
            <QuoteForm location={selectedLocation} service={selectedService} />
          </motion.div>
        </div>

        <div className="absolute right-5 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-3 lg:flex">
          {slides.map((s) => (
            <button
              key={s}
              onClick={() => setActive(s)}
              aria-label={`Go to slide ${s + 1}`}
              className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                active === s ? 'h-8 bg-accent' : 'bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}