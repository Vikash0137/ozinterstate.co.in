import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, ArrowRight, Truck, Globe2 } from 'lucide-react'

export default function LocationNearby({ location = {}, nearbyLocations = [] }) {
  if (!Array.isArray(nearbyLocations) || nearbyLocations.length === 0) {
    return null
  }

  return (
    <section className="bg-white py-16 sm:py-24 border-t border-slate-100">
      <div className="container-px mx-auto max-w-7xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3.5 py-1 text-xs font-bold text-accent">
              <Globe2 className="h-3.5 w-3.5" />
              <span>Internal Linking & Transport Network</span>
            </div>
            <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
              Connected Hubs & Nearby Service Areas
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Explore interstate corridors and regional depots connected directly to {location.name}.
            </p>
          </div>

          <Link
            to="/locations"
            className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-accent transition-colors hover:text-sky-700"
          >
            View All Australian Locations
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Nearby Cities Grid */}
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {nearbyLocations.map((loc, idx) => (
            <motion.div
              key={loc.slug || idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.04 }}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50 p-5 transition-all duration-200 hover:-translate-y-1 hover:border-sky-300 hover:bg-white hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-white px-2 py-0.5 text-[10px] font-extrabold text-slate-600 border border-slate-200">
                    {loc.state}
                  </span>
                  {loc.distanceKm != null && (
                    <span className="text-[10px] font-bold text-sky-600">
                      ~{loc.distanceKm} km away
                    </span>
                  )}
                </div>

                <div className="mt-3 flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-100 text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-navy group-hover:text-accent transition-colors">
                      {loc.name}
                    </h3>
                    <span className="text-[10px] text-slate-400">Interstate Moving Hub</span>
                  </div>
                </div>

                {loc.shortDescription && (
                  <p className="mt-3 line-clamp-2 text-xs text-slate-500 leading-relaxed">
                    {loc.shortDescription}
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60">
                <Link
                  to={`/location/${loc.slug}`}
                  className="flex w-full items-center justify-between text-xs font-bold text-navy group-hover:text-accent transition-colors"
                >
                  <span>Explore {loc.name} Routes</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
