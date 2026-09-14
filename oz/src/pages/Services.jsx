import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { ArrowRight, ShieldCheck, CheckCircle2, Sparkles, Search, Truck } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageBanner from '../components/PageBanner'
import SectionHeading from '../components/SectionHeading'
import { fetchServices } from '../services/api'
import { getIcon } from '../utils/iconMap'
import { fadeUp } from '../utils/motion'

function ServiceDescription({ text }) {
  const lines = String(text || '').split('\n').map((line) => line.trim()).filter(Boolean)
  const idealForIndex = lines.findIndex((line) => line.toUpperCase() === 'IDEAL FOR')

  if (idealForIndex < 1) {
    return <p className="mt-2.5 whitespace-pre-line text-xs leading-relaxed text-slate-600 sm:text-sm">{text}</p>
  }

  const introLines = lines.slice(0, idealForIndex)
  const idealForItems = lines.slice(idealForIndex + 1)

  return (
    <div className="mt-2.5 text-xs leading-relaxed text-slate-600 sm:text-sm">
      <p className="font-semibold text-navy">{introLines[0]}</p>
      {introLines.slice(1).map((line) => <p key={line} className="mt-2">{line}</p>)}
      <p className="mt-3 font-bold uppercase tracking-wide text-navy">Ideal for</p>
      <ul className="mt-1 list-disc space-y-1 pl-5">
        {idealForItems.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </div>
  )
}

export default function Services() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    let mounted = true
    fetchServices({ _t: Date.now() })
      .then((response) => {
        if (mounted) {
          setServices(response.data?.success ? response.data.data : [])
        }
      })
      .catch((error) => console.error('Failed to load services:', error))
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  const filteredServices = searchQuery.trim()
    ? services.filter(
        (s) =>
          s.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.short_description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.heroTitle?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : services

  return (
    <>
      <PageBanner
        title="Our Interstate Moving Services"
        crumb="Services"
        subtitle="Explore our complete range of specialized interstate removalist and logistics services across Australia. Select any service to view full blueprints, vehicle capacities, and get an instant quote."
        image="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=2000&q=80"
      />

      {/* Services Hub Section */}
      <section className="section bg-slate-50 relative overflow-hidden py-16 sm:py-24">
        {/* Ambient background flares */}
        <div className="pointer-events-none absolute -left-28 top-20 h-96 w-96 rounded-full bg-sky-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-28 bottom-10 h-96 w-96 rounded-full bg-primary-200/30 blur-3xl" />

        <div className="container-px relative">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.18em] text-primary-600 ring-1 ring-primary-100">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              Specialized Solutions
            </span>

            <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-navy sm:text-4xl lg:text-[2.75rem]">
              Select a Moving Service
            </h2>

            <p className="mt-3 text-base text-slate-600 sm:text-lg">
              Click any service below to view custom specifications, route schedules, and request your free fixed quote.
            </p>

            {/* Search filter input */}
            <div className="mx-auto mt-7 max-w-md">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search removalist services (e.g. house, office, packing)..."
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pl-11 text-xs font-semibold text-navy shadow-xs outline-none transition-all placeholder:text-slate-400 focus:border-accent focus:ring-4 focus:ring-accent/20"
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="py-24 text-center text-slate-500 font-semibold">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
              <p className="mt-3 text-sm">Loading available removalist services...</p>
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="mx-auto mt-12 max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
              <Truck className="mx-auto h-10 w-10 text-slate-300" />
              <p className="mt-3 text-base font-bold text-navy">No Services Found</p>
              <p className="mt-1 text-xs text-slate-400">
                Try a different search keyword or clear the search input.
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 rounded-xl bg-accent px-4 py-2 text-xs font-bold text-white hover:bg-sky-700 transition-colors"
              >
                Show All Services
              </button>
            </div>
          ) : (
            <div className="mx-auto mt-12 grid max-w-7xl grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence>
                {filteredServices.map((service, i) => {
                  const serviceFeatures =
                    Array.isArray(service.features) && service.features.length > 0
                      ? service.features
                      : [
                          'Comprehensive Transit Insurance',
                          'Dedicated Move Coordinator',
                          'GPS Live Satellite Tracked Fleet',
                        ]

                  return (
                    <motion.div
                      key={service.slug || service._id || i}
                      layout
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="group flex flex-col justify-between overflow-hidden rounded-4xl border border-slate-200/80 bg-white p-8 shadow-card transition-all duration-300 hover:border-accent/40 hover:shadow-float hover:-translate-y-1.5"
                    >
                      <div>
                        {/* Top Card Icon & Number */}
                        <div className="flex items-center justify-between">
                          <Link
                            to={`/service/${service.slug}`}
                            className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 transition-all duration-300 group-hover:bg-blue-gradient group-hover:text-white group-hover:shadow-glow-accent"
                          >
                            {getIcon(service.icon, { className: 'h-8 w-8' })}
                          </Link>
                          <span className="font-display text-3xl font-extrabold text-slate-200 transition-colors group-hover:text-primary-200">
                            0{i + 1}
                          </span>
                        </div>

                        {/* Title */}
                        <Link
                          to={`/service/${service.slug}`}
                          className="mt-6 block transition-colors group-hover:text-accent"
                        >
                          <h3 className="font-display text-2xl font-black text-navy transition-colors group-hover:text-accent">
                            {service.title}
                          </h3>
                        </Link>

                        {/* Short Description */}
                        <ServiceDescription text={service.short_description || service.description || service.heroDescription} />

                        {/* Feature Highlights Pills */}
                        <div className="mt-5 space-y-2 border-t border-slate-100 pt-4">
                          {serviceFeatures.slice(0, 3).map((feat, fIdx) => (
                            <div
                              key={fIdx}
                              className="flex items-center gap-2 text-xs font-semibold text-slate-700"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                              <span className="truncate">{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Bottom Direct Navigation Action */}
                      <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5">
                        <Link
                          to={`/service/${service.slug}`}
                          className="inline-flex items-center gap-2 rounded-xl bg-blue-gradient px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-soft transition-all group-hover:shadow-glow-accent"
                        >
                          View Service
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                        </Link>

                        <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                          <ShieldCheck className="h-3.5 w-3.5" /> 100% Insured
                        </span>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
