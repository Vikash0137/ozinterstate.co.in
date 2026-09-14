import { formatImageUrl } from '../utils/urlHelper'
import { motion } from 'framer-motion'
import { ShieldCheck, Award, CheckCircle2, ArrowRight, MapPin, Truck, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { fadeUp } from '../utils/motion'
import { useSiteSettings } from '../context/SiteContext'

export default function About({ location = null, service = null }) {
  const { siteSettings } = useSiteSettings()
  const aboutSection = siteSettings?.aboutSection
  const primaryButtonText = aboutSection?.primaryButtonText || `Get Free ${service ? service.title : 'Moving'} Estimate`
  const primaryButtonUrl = aboutSection?.primaryButtonUrl || '#quote'
  const secondaryButtonText = aboutSection?.secondaryButtonText || 'All Services'
  const secondaryButtonUrl = aboutSection?.secondaryButtonUrl || '/services'
  const eyebrow = service
    ? 'Service Overview & Standards'
    : location
    ? `About ${location.name} Operations`
    : 'About OZ Interstate'

  const title =
    service?.aboutTitle ||
    (service
      ? `Specialized ${service.title} Solutions`
      : location?.aboutTitle ||
        (location
          ? `About OZ Interstate Movers in ${location.name}`
          : aboutSection?.title || 'Decades of Interstate Moving Excellence Across Australia'))

  const subtitle =
    service?.aboutSubtitle ||
    (service
      ? 'Professional Moving & Freight Logistics by Australia’s Trusted Experts'
      : location?.aboutSubtitle ||
        (location
          ? `Professional Long-Haul & Local Relocation in ${location.state || 'Australia'}`
          : aboutSection?.subtitle || 'Australia’s Trusted Linehaul & Residential Relocation Specialists'))

  const description =
    service?.aboutDescription ||
    service?.content ||
    service?.short_description ||
    location?.aboutDescription ||
    location?.localBusinessDescription ||
    location?.introduction ||
    aboutSection?.description ||
    'With over a decade of nationwide logistics and residential moving experience, OZ Interstate Movers operates scheduled highway linehaul services connecting all major Australian capital cities and regional communities. Our fully trained removalists, modern GPS-tracked fleet, and comprehensive goods-in-transit protection guarantee a seamless, punctual, and stress-free move.'

  const rawImage =
    service?.aboutImage ||
    service?.image ||
    location?.aboutImage ||
    location?.featuredImage ||
    aboutSection?.image ||
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80'

  const image = formatImageUrl(rawImage)

  return (
    <section className="section relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-primary-100/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />

      <div className="container-px relative">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Visual Image side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative overflow-hidden rounded-5xl shadow-float">
              <img
                src={image}
                alt={service ? `${service.title} professional service team` : location ? `${location.name} interstate moving team` : 'OZ Interstate Movers professional team'}
                loading="lazy"
                className="h-[480px] w-full object-cover sm:h-[520px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/10 to-transparent" />

              {/* Floating badge */}
              <div className="absolute left-5 top-5 flex items-center gap-3 rounded-2xl bg-white/95 px-4 py-3 shadow-card backdrop-blur">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-gradient text-white">
                  {location ? <MapPin className="h-5 w-5" /> : <Truck className="h-5 w-5" />}
                </span>
                <div>
                  <p className="font-display text-sm font-extrabold text-navy">
                    {service ? `${service.title}` : location ? `${location.name} Operations Hub` : 'Nationwide Fleet Network'}
                  </p>
                  <p className="text-[11px] text-ink/55">
                    {location ? `${location.state || 'Australia'} Wide Service` : 'Servicing All Australian States'}
                  </p>
                </div>
              </div>
            </div>

            {/* Rating & Trust badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="absolute -bottom-6 right-4 flex items-center gap-4 rounded-3xl bg-white p-5 shadow-float sm:right-8 border border-slate-100"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                <Award className="h-7 w-7" />
              </span>
              <div>
                <p className="font-display text-2xl font-extrabold text-navy">100% Vetted</p>
                <p className="text-xs font-medium text-ink/55">Trained & Insured Movers</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Text Content side */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="order-1 lg:order-2"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-primary-600 ring-1 ring-primary-100">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-600" />
              {eyebrow}
            </span>

            <h2 className="mt-5 font-display text-3xl font-extrabold leading-tight text-navy sm:text-4xl lg:text-[2.6rem]">
              {title}
            </h2>

            {subtitle && (
              <p className="mt-3 text-base font-semibold text-accent">
                {subtitle}
              </p>
            )}

            <div className="mt-4 space-y-4 text-base leading-relaxed text-slate-600">
              {typeof description === 'string' && description.includes('\n') ? (
                description
                  .split('\n')
                  .filter((p) => p.trim())
                  .map((paragraph, idx) => <p key={idx}>{paragraph}</p>)
              ) : (
                <p>{description}</p>
              )}
            </div>

            {/* Bullet Highlights */}
            {Array.isArray(service?.features) && service.features.length > 0 ? (
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {service.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 rounded-2xl border border-slate-100 bg-slate-50 p-3.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-navy">{feat}</h4>
                    </div>
                  </div>
                ))}
              </div>
            ) : Array.isArray(location?.highlights) && location.highlights.length > 0 ? (
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {location.highlights.map((hl, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 rounded-2xl border border-slate-100 bg-slate-50 p-3.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-navy">{hl.title}</h4>
                      {hl.desc && <p className="text-[11px] text-slate-500">{hl.desc}</p>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs font-bold text-slate-700">
                <div className="flex items-center gap-2.5 rounded-2xl bg-slate-50 border border-slate-100 p-3.5">
                  <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
                  <span>Comprehensive Transit Insurance</span>
                </div>
                <div className="flex items-center gap-2.5 rounded-2xl bg-slate-50 border border-slate-100 p-3.5">
                  <Truck className="h-5 w-5 text-accent shrink-0" />
                  <span>Scheduled Daily Linehaul Fleet</span>
                </div>
                <div className="flex items-center gap-2.5 rounded-2xl bg-slate-50 border border-slate-100 p-3.5">
                  <Clock className="h-5 w-5 text-amber-600 shrink-0" />
                  <span>Strict Punctual Transit Timelines</span>
                </div>
                <div className="flex items-center gap-2.5 rounded-2xl bg-slate-50 border border-slate-100 p-3.5">
                  <Award className="h-5 w-5 text-primary-600 shrink-0" />
                  <span>100% Fixed Transparent Pricing</span>
                </div>
              </div>
            )}

            {/* CTA row */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a href={primaryButtonUrl} className="btn-primary">
                {primaryButtonText}
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                to={secondaryButtonUrl}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-navy shadow-sm transition-all hover:border-accent hover:text-accent"
              >
                {secondaryButtonText}
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
