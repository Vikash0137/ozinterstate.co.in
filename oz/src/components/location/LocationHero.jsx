import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Phone, ShieldCheck, Clock, MapPin, ChevronRight, Sparkles, Star } from 'lucide-react'

export default function LocationHero({ location = {}, isPreview = false }) {
  const city = location.city || location.name || 'Location'
  const state = location.state || 'Australia'

  return (
    <section className="relative overflow-hidden bg-navy pt-28 pb-16 text-white sm:pt-32 sm:pb-24">
      {/* Background aesthetic gradients & grids */}
      <div className="pointer-events-none absolute inset-0 bg-mesh-dark opacity-75" />
      <div className="pointer-events-none absolute inset-0 bg-grid-lines-light opacity-30" />
      <div className="pointer-events-none absolute -top-32 right-10 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-10 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />

      {/* Preview Mode Banner */}
      {isPreview && (
        <div className="relative mx-auto mb-6 max-w-5xl rounded-2xl border border-amber-400/40 bg-amber-500/20 px-4 py-3 text-center text-sm font-bold text-amber-200 backdrop-blur-md">
          ⚠ PREVIEW MODE ACTIVE: This page is currently a Draft/Unpublished location and is set to <code className="rounded bg-amber-900/50 px-1.5 py-0.5">noindex,nofollow</code>.
        </div>
      )}

      <div className="container-px relative mx-auto max-w-7xl">
        {/* Breadcrumb Bar */}
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-xs font-semibold text-white/70 sm:text-sm">
          <Link to="/" className="transition-colors hover:text-white">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 opacity-50" />
          <Link to="/locations" className="transition-colors hover:text-white">
            Locations
          </Link>
          <ChevronRight className="h-3.5 w-3.5 opacity-50" />
          <span className="font-bold text-sky-300">{location.name}</span>
        </nav>

        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* Hero Left Content */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-sky-300 backdrop-blur-md"
            >
              <MapPin className="h-3.5 w-3.5 text-accent" />
              <span>{location.badge || 'Service Available'} • {state}</span>
            </motion.div>

            {/* H1 Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl"
            >
              {location.seo?.h1 || location.heroTitle || `Interstate Removalists & Freight in ${location.name}`}
            </motion.h1>

            {/* Hero Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg"
            >
              {location.heroSubtitle ||
                location.shortDescription ||
                `Trusted removalists and regular linehaul services connecting ${location.name} with Sydney, Melbourne, Brisbane, and all national capitals.`}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <a
                href="#quote"
                className="inline-flex items-center gap-2 rounded-2xl bg-blue-gradient px-7 py-4 text-sm font-extrabold uppercase tracking-wider text-white shadow-float transition-all hover:scale-105 hover:shadow-glow-accent"
              >
                <Sparkles className="h-4 w-4" />
                {location.heroCtaText || 'Get Free Estimate'}
              </a>

              {location.phone && (
                <a
                  href={`tel:${location.phone.replace(/\s+/g, '')}`}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 py-4 text-sm font-bold text-white backdrop-blur-md transition-colors hover:bg-white/20"
                >
                  <Phone className="h-4 w-4 text-sky-400" />
                  Call {location.phone}
                </a>
              )}
            </motion.div>

            {/* Trust Badges Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-10 grid grid-cols-3 gap-4 border-t border-white/15 pt-6 text-xs text-slate-300 sm:text-sm"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
                <span>Fully Insured Transit</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-sky-400" />
                <span>On-Time Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                <span>4.9★ Top Rated</span>
              </div>
            </motion.div>
          </div>

          {/* Hero Right Visual Card */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative overflow-hidden rounded-4xl border border-white/20 bg-white/5 p-3 shadow-2xl backdrop-blur-xl"
            >
              <img
                src={
                  location.heroImage ||
                  'https://images.unsplash.com/photo-1524813686514-a57563d77965?auto=format&fit=crop&w=1200&q=80'
                }
                alt={`${location.name} Interstate Moving`}
                className="h-80 w-full rounded-3xl object-cover sm:h-96"
                loading="eager"
              />
              <div className="absolute inset-x-7 bottom-7 rounded-2xl border border-white/20 bg-navy/85 p-4 backdrop-blur-md">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>Hub: {location.address || `${location.name}, ${state}`}</span>
                  <span className="font-bold text-emerald-400">● Linehaul Active</span>
                </div>
                <p className="mt-1 font-display text-sm font-bold text-white">
                  Scheduled Weekly Corridor Transit
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
