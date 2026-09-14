import { formatImageUrl } from '../../utils/urlHelper'
import { motion } from 'framer-motion'
import { Sparkles, CheckCircle2, ArrowRight, Route } from 'lucide-react'
import { fadeUp } from '../../utils/motion'

export default function LocationCustomSection({ location = {} }) {
  const badge = location.customSectionBadge || 'Custom Capabilities'
  const title =
    location.customSectionTitle ||
    location.mainTitle ||
    `Specialized Freight & Interstate Scope in ${location.name}`
  const subtitle =
    location.customSectionSubtitle ||
    `Tailored interstate solutions connecting ${location.name} with all Australian capitals.`
  const content =
    location.customSectionContent ||
    location.mainContent ||
    `Our ${location.name} linehaul operations provide dependable scheduling, secure palletized freight, and customized door-to-door moving services designed to minimize downtime and eliminate relocation friction.`

  const rawImage =
    location.customSectionImage ||
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80'

  const image = formatImageUrl(rawImage)

  const bullets =
    Array.isArray(location.customSectionBullets) && location.customSectionBullets.length > 0
      ? location.customSectionBullets
      : Array.isArray(location.popularRoutes) && location.popularRoutes.length > 0
      ? location.popularRoutes
      : [
          `Daily linehaul departures connecting ${location.name} with Sydney, Melbourne, Brisbane & Perth.`,
          'GPS-tracked heavy fleet with air-ride suspension and hydraulic tailgates.',
          'Specialist handling for pianos, fragile antiques, and high-value equipment.',
        ]

  return (
    <section className="section relative overflow-hidden bg-slate-50">
      <div className="pointer-events-none absolute -right-32 top-10 h-80 w-80 rounded-full bg-sky-100/60 blur-3xl" />
      <div className="container-px relative">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Content Column */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-accent ring-1 ring-accent/20">
              <Sparkles className="h-3.5 w-3.5" />
              {badge}
            </span>

            <h2 className="mt-5 font-display text-3xl font-extrabold leading-tight text-navy sm:text-4xl lg:text-[2.5rem]">
              {title}
            </h2>

            {subtitle && (
              <p className="mt-3 text-base font-semibold text-slate-700">
                {subtitle}
              </p>
            )}

            <div className="mt-4 text-base leading-relaxed text-slate-600">
              <p>{content}</p>
            </div>

            {/* Bullet Points */}
            <div className="mt-6 space-y-3">
              {bullets.map((b, idx) => (
                <div key={idx} className="flex items-start gap-3 rounded-2xl bg-white p-3.5 shadow-sm border border-slate-200/80">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-semibold text-slate-700">{b}</span>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <a href="#quote" className="btn-primary">
                Book {location.name} Transport
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </motion.div>

          {/* Image Column */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative overflow-hidden rounded-5xl shadow-float">
              <img
                src={image}
                alt={title}
                loading="lazy"
                className="h-[460px] w-full object-cover sm:h-[500px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent" />

              {/* Floating route badge */}
              <div className="absolute bottom-6 left-6 right-6 rounded-3xl bg-navy/90 p-5 text-white backdrop-blur-md border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-white shadow-md">
                    <Route className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-display text-sm font-bold text-white">{location.name} Network</h4>
                    <p className="text-xs text-white/70">Connecting every Australian state depot</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
