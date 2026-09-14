import { motion } from 'framer-motion'
import { Phone, ShieldCheck, ArrowRight, Sparkles, CheckCircle2, Clock, MapPin, Truck } from 'lucide-react'
import { COMPANY } from '../../data/siteData'

const KEY_ROUTES = [
  'Melbourne ↔ Sydney',
  'Sydney ↔ Brisbane',
  'Melbourne ↔ Adelaide',
  'Perth ↔ East Coast',
  'Canberra ↔ Capitals',
]

export default function ServiceCTA({ service }) {
  return (
    <section className="section relative overflow-hidden bg-white py-16 sm:py-24">
      <div className="container-px relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto max-w-7xl overflow-hidden rounded-5xl bg-navy-gradient p-8 text-white shadow-float sm:p-14"
        >
          {/* Lighting flares */}
          <div className="pointer-events-none absolute -right-14 -top-14 h-80 w-80 rounded-full bg-accent/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-14 -left-14 h-80 w-80 rounded-full bg-sky-500/20 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-dots-light opacity-30" />

          <div className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-sky-300 backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5" />
                Scheduled Interstate Freight & Relocations
              </span>

              <h2 className="mt-4 font-display text-2xl font-black sm:text-4xl lg:text-5xl">
                Ready to Book Your {service?.title || 'Interstate Move'}?
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
                Get a transparent, fixed-price quote with zero hidden charges. Our professional removalists ensure your belongings arrive on time and fully protected across all Australian states.
              </p>

              {/* Highway Route Corridor Tags */}
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-sky-300 mr-1 flex items-center gap-1">
                  <Truck className="h-3.5 w-3.5" /> Active Linehaul:
                </span>
                {KEY_ROUTES.map((route, i) => (
                  <span
                    key={i}
                    className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/90"
                  >
                    {route}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-6 text-xs font-bold text-slate-200">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>100% Transit Insurance Covered</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-sky-400" />
                  <span>Scheduled Weekly Departures</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                  <span>Zero Hidden Surcharges</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3.5 sm:flex-row lg:col-span-4 lg:flex-col lg:items-end">
              <a
                href="#quote"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-gradient px-8 py-4 text-xs font-black uppercase tracking-wider text-white shadow-soft transition-all hover:scale-105 hover:shadow-glow-accent sm:w-auto"
              >
                Get Free Online Quote
                <ArrowRight className="h-4 w-4" />
              </a>

              <a
                href={COMPANY.phoneHref}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-8 py-4 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md transition-colors hover:bg-white/20 sm:w-auto"
              >
                <Phone className="h-4 w-4 text-sky-400" />
                Call {COMPANY.phone}
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
