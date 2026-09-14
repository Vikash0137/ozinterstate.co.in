import { motion } from 'framer-motion'
import { MapPin, ArrowUpRight, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import SectionHeading from './SectionHeading'
import { LOCATIONS } from '../data/siteData'
import { fadeUp } from '../utils/motion'

const spans = [
  'sm:col-span-2 lg:col-span-3 lg:row-span-2',
  'lg:col-span-3',
  'lg:col-span-3',
  'lg:col-span-2',
  'lg:col-span-2',
  'lg:col-span-2',
]

export default function Locations() {
  return (
    <section className="section relative">
      <div className="container-px">
        <SectionHeading
          eyebrow="Where We Move"
          title="Servicing every"
          highlight="Australian capital"
          subtitle="Regular interstate routes connecting all major cities, with local depots ensuring fast, reliable service wherever you're headed."
        />

        <div className="mx-auto mt-10 grid max-w-7xl auto-rows-[220px] grid-cols-1 gap-4 sm:grid-cols-2 lg:auto-rows-[210px] lg:grid-cols-6">
          {LOCATIONS.map((loc, i) => (
            <motion.div
              key={loc.city}
              variants={fadeUp}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              whileHover={{ y: -6 }}
              className={`group relative overflow-hidden rounded-4xl shadow-soft ${spans[i]}`}
            >
              <img
                src={loc.image}
                alt={`${loc.city} skyline — interstate removalist services`}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/35 to-transparent transition-opacity duration-300 group-hover:from-navy/95" />
              <div className="pointer-events-none absolute inset-0 rounded-4xl ring-1 ring-inset ring-white/10" />

              <div className="absolute inset-x-0 bottom-0 p-6">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                      <MapPin className="h-3.5 w-3.5 text-accent" />
                      {loc.state}
                    </span>
                    <h3 className={`mt-2 font-display font-extrabold text-white ${i === 0 ? 'text-3xl sm:text-4xl' : 'text-2xl'}`}>
                      {loc.city}
                    </h3>
                    <p className="flex items-center gap-1.5 text-sm text-white/80">
                      <TrendingUp className="h-3.5 w-3.5 text-accent" />
                      {loc.moves} moves completed
                    </p>
                  </div>
                  <Link
                    to="/contact"
                    aria-label={`Get a quote for ${loc.city}`}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition-all duration-300 group-hover:bg-blue-gradient group-hover:shadow-glow-accent"
                  >
                    <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:rotate-45" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
