import { formatImageUrl } from '../../utils/urlHelper'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShieldCheck,
  Award,
  CheckCircle2,
  ArrowRight,
  Truck,
  Clock,
  Sparkles,
  Box,
  Phone,
  Layers,
  Wrench,
  Compass,
  Check,
} from 'lucide-react'
import { COMPANY } from '../../data/siteData'

function renderServiceDescription(text) {
  const lines = String(text || '').split('\n').map((line) => line.trim()).filter(Boolean)
  const idealForIndex = lines.findIndex((line) => line.toUpperCase() === 'IDEAL FOR')

  if (idealForIndex < 1) {
    return <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-slate-600 sm:text-base">{text}</p>
  }

  const introLines = lines.slice(0, idealForIndex)
  const idealForItems = lines.slice(idealForIndex + 1)

  return (
    <div className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
      <h4 className="font-display text-xl font-bold text-navy">{introLines[0]}</h4>
      {introLines.slice(1).map((line) => <p key={line} className="mt-4">{line}</p>)}
      <h5 className="mt-6 font-display text-base font-bold uppercase text-navy">Ideal for</h5>
      <ul className="mt-2 list-disc space-y-1.5 pl-5">
        {idealForItems.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </div>
  )
}

export default function ServiceOverview({ service }) {
  const [activeTab, setActiveTab] = useState('scope')

  const title =
    service?.aboutTitle ||
    `Specialized ${service?.title || 'Relocation'} Solutions Across Australia`

  const subtitle =
    service?.aboutSubtitle ||
    'Decades of interstate linehaul experience, precision handling, and total customer care.'

  const description =
    service?.aboutDescription ||
    service?.content ||
    service?.short_description ||
    `At OZ Interstate Movers, our ${service?.title || 'service'} delivers dependable, stress-free relocations connecting capital cities and regional centres across Australia. Every job is coordinated with dedicated move managers, professional furniture padding, and strict delivery timelines.`

  const rawImage =
    service?.aboutImage ||
    service?.image ||
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'

  const image = formatImageUrl(rawImage)

  const tabContents = {
    scope: {
      label: '1. Service Scope',
      icon: Compass,
      heading: `Full-Service ${service?.title || 'Relocation'} Protocol`,
      text: description,
      highlights: [
        'Dedicated Move Coordinator for your route',
        'Door-to-door direct interstate linehaul',
        'Goods-in-transit insurance included standard',
        'Scheduled departure & guaranteed arrival windows',
      ],
    },
    protection: {
      label: '2. Padding & Protection',
      icon: ShieldCheck,
      heading: 'Multi-Layer Packing & Care Standards',
      text: 'Every fragile, polished, and bulky item is treated with specialized protective materials before loading to prevent highway transit friction.',
      highlights: [
        'Heavy-duty removalist felt blankets',
        'High-gauge shrink wrap & mattress covers',
        'Custom crating for mirrors, art & glass',
        'Padded vehicle rails & tie-down straps',
      ],
    },
    equipment: {
      label: '3. Vehicles & Fleet',
      icon: Truck,
      heading: 'Air-Ride Suspension Heavy Transport',
      text: 'Our fleet of custom pantechs and heavy rigid linehaulers are engineered specifically for long-distance highway travel without load vibration.',
      highlights: [
        'Hydraulic tail-lifts for heavy appliances',
        'Real-time GPS satellite positioning',
        'High-cube capacity for maximum clearance',
        'EPA compliant modern commercial fleet',
      ],
    },
    assembly: {
      label: '4. Setup & Delivery',
      icon: Wrench,
      heading: 'Precision Room-by-Room Placement',
      text: 'Upon arrival, our certified removalists position each item into designated rooms, reassemble furniture, and clear away transit packaging.',
      highlights: [
        'Bed frames, desks & tables reassembly',
        'Placement into designated rooms',
        'Inventory sign-off & condition verification',
        'Zero rubbish left at your property',
      ],
    },
  }

  const currentTab = tabContents[activeTab] || tabContents.scope

  return (
    <section className="section relative overflow-hidden bg-slate-50/70 py-20 sm:py-24">
      {/* Background glow flares */}
      <div className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-sky-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-primary-200/30 blur-3xl" />

      <div className="container-px relative">
        {/* Top Header */}
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.18em] text-primary-600 ring-1 ring-primary-100">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            Service Scope & Standards
          </span>

          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-navy sm:text-4xl lg:text-[2.75rem]">
            {title}
          </h2>

          {subtitle && (
            <p className="mt-3 font-display text-base font-bold text-accent sm:text-lg">
              {subtitle}
            </p>
          )}
        </div>

        {/* Tab Selector Pills */}
        <div className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-2.5">
          {Object.entries(tabContents).map(([key, tab]) => {
            const Icon = tab.icon
            const isSelected = activeTab === key
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key)}
                className={`relative flex items-center gap-2 rounded-2xl px-5 py-3 text-xs font-extrabold uppercase tracking-wider transition-all duration-300 ${
                  isSelected
                    ? 'bg-blue-gradient text-white shadow-soft scale-105'
                    : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className={`h-4 w-4 ${isSelected ? 'text-white' : 'text-primary-600'}`} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Main Bento Showcase Card */}
        <div className="mx-auto mt-10 grid max-w-7xl grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
          {/* Left Tab Dynamic Content Card */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col justify-between rounded-4xl border border-slate-200/80 bg-white p-7 shadow-card sm:p-10 lg:col-span-7"
          >
            <div>
              <div className="flex items-center gap-2.5">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 font-black">
                  <currentTab.icon className="h-5 w-5" />
                </span>
                <span className="text-xs font-black uppercase tracking-wider text-accent">
                  Operational Standard
                </span>
              </div>

              <h3 className="mt-4 font-display text-2xl font-black text-navy sm:text-3xl">
                {currentTab.heading}
              </h3>

              {activeTab === 'scope' ? renderServiceDescription(currentTab.text) : (
                <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
                  {currentTab.text}
                </p>
              )}

              {/* Highlights Checkmark List */}
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {currentTab.highlights.map((h, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 rounded-2xl border border-slate-100 bg-slate-50 p-3.5 text-xs font-bold text-navy"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-6">
              <a href="#quote" className="btn-primary">
                Get Estimate for {service?.title || 'Move'}
                <ArrowRight className="h-4 w-4" />
              </a>

              <a
                href={COMPANY.phoneHref}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-navy shadow-xs transition-all hover:border-navy"
              >
                <Phone className="h-4 w-4 text-accent" />
                Call {COMPANY.phone}
              </a>
            </div>
          </motion.div>

          {/* Right Visual Image Showcase Card */}
          <div className="relative flex flex-col overflow-hidden rounded-4xl border border-slate-200/80 bg-navy p-3 shadow-card lg:col-span-5">
            <div className="relative h-full min-h-[360px] overflow-hidden rounded-3xl">
              <img
                src={image}
                alt={service?.title || 'Service Overview'}
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/20 to-transparent" />

              {/* Floating Top Pill */}
              <div className="absolute left-4 top-4 flex items-center gap-2.5 rounded-2xl border border-white/20 bg-navy/80 px-4 py-2.5 text-xs font-bold text-white backdrop-blur-md">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Linehaul Active: All Capital Hubs</span>
              </div>

              {/* Floating Bottom Card */}
              <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/20 bg-white/95 p-4 text-navy shadow-lg backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-gradient text-white">
                      <ShieldCheck className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-display text-sm font-extrabold">100% Goods Insured</p>
                      <p className="text-[11px] text-slate-500">Every km of highway transit</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-black uppercase text-emerald-800">
                    Protected
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Bottom Metric Cards */}
        <div className="mx-auto mt-8 grid max-w-7xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="group rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs transition-all duration-300 hover:border-sky-300 hover:shadow-card hover:-translate-y-1">
            <span className="font-display text-2xl font-black text-slate-200 group-hover:text-primary-300 transition-colors">01</span>
            <h4 className="mt-2 font-display text-base font-bold text-navy">Transit Protection</h4>
            <p className="mt-1 text-xs text-slate-500">Comprehensive goods cover standard with every contract.</p>
          </div>

          <div className="group rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs transition-all duration-300 hover:border-sky-300 hover:shadow-card hover:-translate-y-1">
            <span className="font-display text-2xl font-black text-slate-200 group-hover:text-primary-300 transition-colors">02</span>
            <h4 className="mt-2 font-display text-base font-bold text-navy">Blanket Padding</h4>
            <p className="mt-1 text-xs text-slate-500">Heavy-duty felt wrap for all wooden and polished items.</p>
          </div>

          <div className="group rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs transition-all duration-300 hover:border-sky-300 hover:shadow-card hover:-translate-y-1">
            <span className="font-display text-2xl font-black text-slate-200 group-hover:text-primary-300 transition-colors">03</span>
            <h4 className="mt-2 font-display text-base font-bold text-navy">Satellite GPS Fleet</h4>
            <p className="mt-1 text-xs text-slate-500">Milestone transit notifications straight to your phone.</p>
          </div>

          <div className="group rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs transition-all duration-300 hover:border-sky-300 hover:shadow-card hover:-translate-y-1">
            <span className="font-display text-2xl font-black text-slate-200 group-hover:text-primary-300 transition-colors">04</span>
            <h4 className="mt-2 font-display text-base font-bold text-navy">Fixed Price Rates</h4>
            <p className="mt-1 text-xs text-slate-500">Clear, written contracts with no hidden fees or extras.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
