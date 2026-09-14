import { useState } from 'react'
import { motion } from 'framer-motion'
import { Truck, Home, Building2, Box, Users, ArrowRight, ShieldCheck, Check } from 'lucide-react'
import { fadeUp } from '../../utils/motion'

const FLEET_OPTIONS = [
  {
    id: 'small',
    name: '4.5 Ton Pantech Truck',
    badge: '1-2 Bedroom / Small Move',
    capacity: '20 - 25 m³',
    crew: '2 Certified Removalists',
    idealFor: 'Apartments, 1-2 bedroom homes, few bulky items, student relocations.',
    specs: ['Hydraulic Tail-Lift', 'Padded Tie-Down Rails', 'Fits in Tight Driveways', 'Standard 1-Day Loading'],
    image: 'https://images.unsplash.com/photo-1600518464441-9154a4dea21b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'medium',
    name: '8.5 Ton Heavy Rigid Linehaul',
    badge: '3-4 Bedroom Family Home',
    capacity: '40 - 50 m³',
    crew: '2 to 3 Removalists',
    idealFor: 'Full 3-4 bedroom family houses, townhouses, combined storage loads.',
    specs: ['Air-Ride Smooth Suspension', 'Full Furniture Blanket Sets', 'GPS Satellite Tracking', 'Same-Week Linehaul'],
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
    popular: true,
  },
  {
    id: 'large',
    name: '12+ Ton High-Cube Semi Trailer',
    badge: 'Large Estates & Commercial Offices',
    capacity: '70 - 90 m³',
    crew: '3 to 4 Specialists',
    idealFor: '5+ bedroom homes, corporate offices, heavy machinery, full interstate relocations.',
    specs: ['Direct Highway Linehaul', 'High-Cube Maximum Clearance', 'Multiple Compartments', 'Dedicated Coordinator'],
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80',
  },
]

export default function ServiceFleet({ service }) {
  const [selectedFleet, setSelectedFleet] = useState(FLEET_OPTIONS[1])

  return (
    <section className="section relative overflow-hidden bg-white py-20 sm:py-24">
      <div className="container-px relative">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-primary-600 ring-1 ring-primary-100">
            <Truck className="h-3.5 w-3.5 text-accent" />
            Specialist Transport Fleet
          </span>

          <h2 className="mt-4 font-display text-3xl font-extrabold text-navy sm:text-4xl lg:text-[2.6rem]">
            Engineered Vehicles for {service?.title || 'Every Relocation'}
          </h2>

          <p className="mt-3 text-base text-slate-600 sm:text-lg">
            Choose the right vehicle capacity for your move size. Modern, air-ride suspended vehicles ensure zero transit vibration.
          </p>
        </div>

        {/* Vehicle Selection Tabs */}
        <div className="mx-auto mt-10 flex max-w-2xl flex-wrap justify-center gap-3">
          {FLEET_OPTIONS.map((f) => {
            const isSelected = selectedFleet.id === f.id
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setSelectedFleet(f)}
                className={`relative flex items-center gap-2.5 rounded-2xl px-5 py-3 text-xs font-extrabold uppercase tracking-wider transition-all duration-300 ${
                  isSelected
                    ? 'bg-blue-gradient text-white shadow-soft'
                    : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {f.popular && (
                  <span className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase ${
                    isSelected ? 'bg-amber-400 text-navy' : 'bg-accent/20 text-accent'
                  }`}>
                    Popular
                  </span>
                )}
                {f.name}
              </button>
            )
          })}
        </div>

        {/* Selected Vehicle Showcase Card */}
        <motion.div
          key={selectedFleet.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mx-auto mt-10 grid max-w-6xl grid-cols-1 items-center gap-8 overflow-hidden rounded-4xl border border-slate-200/80 bg-slate-50 p-6 shadow-card lg:grid-cols-12 lg:p-10"
        >
          {/* Image */}
          <div className="relative overflow-hidden rounded-3xl lg:col-span-6">
            <img
              src={selectedFleet.image}
              alt={selectedFleet.name}
              className="h-72 w-full object-cover sm:h-96"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/95 p-4 shadow-md backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-accent">Capacity</span>
                  <p className="font-display text-xl font-black text-navy">{selectedFleet.capacity}</p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-accent">Crew</span>
                  <p className="font-display text-base font-bold text-navy">{selectedFleet.crew}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-6">
            <span className="rounded-full bg-primary-100 px-3.5 py-1 text-xs font-bold text-primary-700">
              {selectedFleet.badge}
            </span>

            <h3 className="mt-3 font-display text-2xl font-extrabold text-navy sm:text-3xl">
              {selectedFleet.name}
            </h3>

            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              {selectedFleet.idealFor}
            </p>

            <div className="mt-6 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Included Vehicle Specs</h4>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {selectedFleet.specs.map((spec, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-xl bg-white p-3 shadow-xs border border-slate-100 text-xs font-bold text-navy">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-slate-200/80 pt-6">
              <a href="#quote" className="btn-primary">
                Book This Vehicle Size
                <ArrowRight className="h-4 w-4" />
              </a>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                Transit Insurance Included
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
