import { motion } from 'framer-motion'
import { ShieldCheck, Clock, BadgeDollarSign, Truck, Award, HeartHandshake } from 'lucide-react'

const defaultWhy = [
  {
    icon: ShieldCheck,
    title: 'Comprehensive Transit Insurance',
    desc: 'Every item is covered under our premium goods-in-transit policy for total peace of mind.',
  },
  {
    icon: BadgeDollarSign,
    title: 'Guaranteed Fixed Quotes',
    desc: 'No surprise fees, hidden fuel levies, or unexpected charges on arrival.',
  },
  {
    icon: Truck,
    title: 'Modern GPS-Tracked Fleet',
    desc: 'Air-ride suspension linehaul trucks designed for maximum protection over interstate distances.',
  },
  {
    icon: Clock,
    title: 'Punctual Pickup & Delivery',
    desc: 'Strict dispatch schedules and timely arrival windows tailored to your settlement dates.',
  },
  {
    icon: Award,
    title: 'Trained & Vetted Movers',
    desc: 'Uniformed, background-checked professionals with extensive heavy-furniture handling experience.',
  },
  {
    icon: HeartHandshake,
    title: 'Dedicated Move Coordinator',
    desc: 'A single point of contact from initial quotation through to unpacking at your new address.',
  },
]

export default function LocationWhyChoose({ location = {} }) {
  return (
    <section className="bg-navy py-16 sm:py-24 text-white relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-mesh-dark opacity-60" />
      <div className="pointer-events-none absolute inset-0 bg-grid-lines-light opacity-20" />

      <div className="container-px mx-auto max-w-7xl relative">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full bg-accent/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-sky-300">
            The OZ Interstate Advantage
          </span>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            {location.highlightsTitle || `Why Choose Us for Your ${location.name} Move`}
          </h2>
          <p className="mt-3 text-base text-slate-300">
            Decades of interstate moving experience, nationwide logistics infrastructure, and five-star customer satisfaction.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {defaultWhy.map((item, idx) => {
            const Icon = item.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all duration-300 hover:border-sky-400/40 hover:bg-white/10"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-white shadow-lg shadow-accent/20">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-display text-lg font-bold text-white">{item.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-300">{item.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
