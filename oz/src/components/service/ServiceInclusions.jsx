import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShieldCheck,
  PackageCheck,
  Truck,
  Wrench,
  Clock,
  Lock,
  Sparkles,
  CheckCircle2,
  Box,
  Layers,
  MapPin,
  Check,
} from 'lucide-react'
import { getIcon } from '../../utils/iconMap'
import { fadeUp } from '../../utils/motion'

const ALL_INCLUSIONS = [
  {
    category: 'packing',
    icon: PackageCheck,
    title: 'Multi-Layer Protective Wrapping',
    description: 'Heavy-duty removalist felt blankets, shrink wrap, and padded corner protectors for all furniture.',
    badge: 'Included',
    tag: 'Protection',
  },
  {
    category: 'transit',
    icon: ShieldCheck,
    title: 'Goods-in-Transit Insurance Cover',
    description: 'Full comprehensive road transit insurance protecting your cargo across all state lines.',
    badge: 'Included',
    tag: 'Security',
  },
  {
    category: 'delivery',
    icon: Wrench,
    title: 'Disassembly & Reassembly',
    description: 'Beds, desks, and dining suites dismantled at pickup and reassembled in your new home.',
    badge: 'Included',
    tag: 'Labor',
  },
  {
    category: 'transit',
    icon: Truck,
    title: 'Satellite GPS Fleet Tracking',
    description: 'Air-ride suspension transport vehicles with live satellite positioning and milestone alerts.',
    badge: 'Included',
    tag: 'Fleet',
  },
  {
    category: 'delivery',
    icon: Clock,
    title: 'Guaranteed Arrival Windows',
    description: 'Punctual scheduled delivery slots with dedicated interstate coordinator communications.',
    badge: 'Included',
    tag: 'Timeline',
  },
  {
    category: 'packing',
    icon: Lock,
    title: 'Secure Depot Storage Capacity',
    description: 'Optional short-term or long-term storage in CCTV-monitored capital city facilities.',
    badge: 'Available',
    tag: 'Storage',
  },
]

export default function ServiceInclusions({ service }) {
  const [activeCategory, setActiveCategory] = useState('all')

  const serviceFeatures = Array.isArray(service?.features) && service.features.length > 0
    ? service.features
    : []

  const filteredInclusions = activeCategory === 'all'
    ? ALL_INCLUSIONS
    : ALL_INCLUSIONS.filter((item) => item.category === activeCategory)

  return (
    <section className="section relative overflow-hidden bg-white py-20 sm:py-28">
      {/* Subtle background ambient mesh */}
      <div className="pointer-events-none absolute -left-20 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-sky-100/60 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-1/4 h-80 w-80 rounded-full bg-primary-100/50 blur-3xl" />

      <div className="container-px relative">
        {/* Centered Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.18em] text-primary-600 ring-1 ring-primary-100">
            <Layers className="h-3.5 w-3.5 text-accent" />
            Capabilities & Inclusions Matrix
          </span>

          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-navy sm:text-4xl lg:text-[2.75rem]">
            What’s Included in Our {service?.title || 'Relocations'}
          </h2>

          <p className="mt-3 text-base text-slate-600 sm:text-lg">
            No surprise add-ons. Every OZ Interstate relocation comes standard with industry-leading transit equipment and vetted personnel.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="mx-auto mt-10 flex max-w-5xl flex-nowrap justify-center gap-2.5 overflow-x-auto pb-1">
          {[
            { key: 'all', label: 'All Inclusions (6)' },
            { key: 'packing', label: 'Packing & Padding' },
            { key: 'transit', label: 'Transit & Insurance' },
            { key: 'delivery', label: 'Delivery & Setup' },
          ].map((cat) => {
            const isSelected = activeCategory === cat.key
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveCategory(cat.key)}
                className={`shrink-0 whitespace-nowrap rounded-2xl px-5 py-2.5 text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                  isSelected
                    ? 'bg-navy text-white shadow-soft scale-105'
                    : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {cat.label}
              </button>
            )
          })}
        </div>

        {/* Custom Highlights from Admin if present */}
        {serviceFeatures.length > 0 && (
          <div className="mx-auto mt-10 max-w-5xl rounded-4xl border border-sky-200/80 bg-gradient-to-r from-sky-50/70 via-white to-sky-50/70 p-6 shadow-sm sm:p-8">
            <div className="flex items-center justify-between border-b border-sky-100 pb-4">
              <span className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-accent">
                <Sparkles className="h-4 w-4" />
                Specialized Inclusions for {service?.title}
              </span>
              <span className="rounded-full bg-accent px-3 py-0.5 text-[10px] font-black uppercase text-white">
                {serviceFeatures.length} Custom Features
              </span>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {serviceFeatures.map((feat, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 rounded-2xl border border-slate-100 bg-white p-3.5 shadow-xs transition-all hover:border-accent/40"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                  <span className="text-xs font-bold text-navy">{feat}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Inclusions Grid */}
        <div className="mx-auto mt-10 grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredInclusions.map((item, idx) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.title}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-4xl border border-slate-200/80 bg-slate-50/60 p-8 transition-all duration-300 hover:border-accent/40 hover:bg-white hover:shadow-card hover:-translate-y-1.5"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="flex h-14 w-14 items-center justify-center rounded-3xl bg-white text-primary-600 shadow-xs border border-slate-100 transition-all duration-300 group-hover:bg-blue-gradient group-hover:text-white group-hover:shadow-glow-accent">
                        <Icon className="h-6 w-6" />
                      </span>
                      <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-emerald-700">
                        {item.badge}
                      </span>
                    </div>

                    <span className="mt-6 inline-block text-[10px] font-black uppercase tracking-widest text-accent">
                      {item.tag}
                    </span>

                    <h3 className="mt-1 font-display text-xl font-bold text-navy transition-colors group-hover:text-primary-600">
                      {item.title}
                    </h3>

                    <p className="mt-2.5 text-xs leading-relaxed text-slate-600 sm:text-sm">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center gap-2 border-t border-slate-200/60 pt-4 text-xs font-bold text-emerald-600">
                    <Check className="h-4 w-4 shrink-0" />
                    <span>Included at no hidden surcharge</span>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
