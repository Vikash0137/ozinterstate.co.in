import { motion } from 'framer-motion'
import { Truck, Home, Building2, Package, Warehouse, ShieldCheck, Check, ArrowRight } from 'lucide-react'

const iconMap = {
  Truck,
  Home,
  Building2,
  Package,
  Warehouse,
  ShieldCheck,
}

export default function LocationServices({ location = {} }) {
  const services = Array.isArray(location.services) && location.services.length > 0
    ? location.services
    : [
        {
          title: 'Full House Removalists',
          description: `End-to-end residential moving from ${location.name} to all Australian states with furniture padding and disassembly.`,
          icon: 'Home',
          features: ['Protective Wrapping', 'Door-to-Door Service', 'Transit Insurance'],
        },
        {
          title: 'Office & Commercial Relocations',
          description: `After-hours and weekend corporate moves in ${location.name} to minimize business disruption.`,
          icon: 'Building2',
          features: ['Workstation Setup', 'IT Disconnect/Reconnect', 'Security Crates'],
        },
        {
          title: 'Interstate Freight & Linehaul',
          description: `Scheduled weekly departures connecting ${location.name} directly with Eastern and Western capitals.`,
          icon: 'Truck',
          features: ['GPS Fleet Tracking', 'Scheduled Departures', 'Backloading Discounts'],
        },
        {
          title: 'Short & Long-Term Storage',
          description: `Secure, CCTV-monitored warehouse storage options available for ${location.name} relocations.`,
          icon: 'Warehouse',
          features: ['24/7 Security', 'Climate-Controlled', 'Palletized Storage'],
        },
      ]

  return (
    <section className="bg-slate-50 py-16 sm:py-24">
      <div className="container-px mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full bg-sky-100 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-accent">
            Tailored Moving Solutions
          </span>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
            {location.servicesTitle || `Moving & Freight Services in ${location.name}`}
          </h2>
          <p className="mt-3 text-base text-slate-600">
            {location.servicesContent ||
              `Specialized interstate transport solutions engineered for safe, reliable delivery across Australia.`}
          </p>
        </div>

        {/* Services Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((svc, idx) => {
            const IconComponent = (svc.icon && iconMap[svc.icon]) ? iconMap[svc.icon] : Truck
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="group flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-sky-300 hover:shadow-xl"
              >
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-accent transition-colors group-hover:bg-accent group-hover:text-white">
                    <IconComponent className="h-6 w-6" />
                  </div>

                  <h3 className="mt-5 font-display text-lg font-bold text-navy group-hover:text-accent transition-colors">
                    {svc.title}
                  </h3>

                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    {svc.description}
                  </p>

                  {/* Feature Bullets */}
                  {Array.isArray(svc.features) && svc.features.length > 0 && (
                    <ul className="mt-4 space-y-2 border-t border-slate-100 pt-4">
                      {svc.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-center gap-2 text-xs text-slate-500">
                          <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <a
                    href="#quote"
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent transition-all group-hover:translate-x-1"
                  >
                    Get Estimate
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Location Products & Packaging (if available) */}
        {Array.isArray(location.products) && location.products.length > 0 && (
          <div className="mt-16 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="font-display text-xl font-bold text-navy">
              Packaging & Supplies Available in {location.name}
            </h3>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {location.products.map((prod, pIdx) => (
                <div key={pIdx} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <span className="rounded bg-sky-100 px-2 py-0.5 text-[10px] font-bold text-accent">
                    {prod.tag || 'Moving Supply'}
                  </span>
                  <h4 className="mt-2 font-display text-sm font-bold text-navy">{prod.name}</h4>
                  <p className="mt-1 text-xs text-slate-500">{prod.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
