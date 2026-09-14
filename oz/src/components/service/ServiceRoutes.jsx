import { motion } from 'framer-motion'
import { Route, MapPin, Clock, ArrowRight, Truck, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { fadeUp } from '../../utils/motion'

const POPULAR_ROUTES = [
  {
    from: 'Melbourne',
    to: 'Sydney',
    transitTime: '1 - 2 Days',
    frequency: 'Daily Departures',
    distance: '870 km',
    popular: true,
  },
  {
    from: 'Sydney',
    to: 'Brisbane',
    transitTime: '1 - 2 Days',
    frequency: 'Daily Departures',
    distance: '915 km',
    popular: true,
  },
  {
    from: 'Melbourne',
    to: 'Brisbane',
    transitTime: '2 - 3 Days',
    frequency: 'Tri-Weekly',
    distance: '1,780 km',
    popular: false,
  },
  {
    from: 'Melbourne',
    to: 'Adelaide',
    transitTime: '1 - 2 Days',
    frequency: 'Daily Departures',
    distance: '725 km',
    popular: false,
  },
  {
    from: 'Sydney',
    to: 'Canberra',
    transitTime: 'Same Day / 24h',
    frequency: 'Daily Express',
    distance: '280 km',
    popular: false,
  },
  {
    from: 'East Coast',
    to: 'Perth (WA)',
    transitTime: '5 - 7 Days',
    frequency: 'Twice Weekly',
    distance: '3,400+ km',
    popular: true,
  },
]

export default function ServiceRoutes({ service }) {
  return (
    <section className="section relative overflow-hidden bg-slate-50 py-20 sm:py-24">
      <div className="container-px relative">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-primary-600 ring-1 ring-primary-100">
            <Route className="h-3.5 w-3.5 text-accent" />
            Nationwide Route Coverage
          </span>

          <h2 className="mt-4 font-display text-3xl font-extrabold text-navy sm:text-4xl lg:text-[2.6rem]">
            Scheduled Interstate Routes for {service?.title || 'Relocations'}
          </h2>

          <p className="mt-3 text-base text-slate-600 sm:text-lg">
            Regular highway linehaul departures connecting all Australian capitals and regional hubs with fixed delivery timelines.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-7xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {POPULAR_ROUTES.map((route, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              whileHover={{ y: -6 }}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-soft transition-all duration-300 hover:border-accent/40 hover:shadow-card"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-accent">
                    <Truck className="h-4 w-4" />
                    Interstate Linehaul
                  </span>
                  {route.popular && (
                    <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-black uppercase text-amber-800">
                      High Demand
                    </span>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-slate-50 p-4 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span className="font-display text-base font-bold text-navy">{route.from}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1" />
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-accent shrink-0" />
                    <span className="font-display text-base font-bold text-navy">{route.to}</span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl bg-slate-50 p-2.5">
                    <span className="text-slate-400 font-semibold block">Transit Time</span>
                    <span className="font-bold text-navy flex items-center gap-1 mt-0.5">
                      <Clock className="h-3.5 w-3.5 text-amber-600" />
                      {route.transitTime}
                    </span>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-2.5">
                    <span className="text-slate-400 font-semibold block">Departures</span>
                    <span className="font-bold text-navy flex items-center gap-1 mt-0.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      {route.frequency}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-4 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">Approx. {route.distance}</span>
                <a
                  href="#quote"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-accent transition-colors hover:text-navy"
                >
                  Quote Route
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/locations"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-navy shadow-sm transition-all hover:border-navy hover:shadow-md"
          >
            <MapPin className="h-4 w-4 text-accent" />
            Explore All 15+ Australian Depots & Locations
          </Link>
        </div>
      </div>
    </section>
  )
}
