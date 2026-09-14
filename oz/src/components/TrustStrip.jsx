import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Star } from 'lucide-react'
import { fetchTrustBadges } from '../services/api'
import { getIcon } from '../utils/iconMap'

export default function TrustStrip() {
  const [badges, setBadges] = useState([])

  useEffect(() => {
    let mounted = true
    fetchTrustBadges({ _t: Date.now() })
      .then((response) => {
        const data = response.data
        if (mounted && data.success && Array.isArray(data.data)) {
          setBadges(data.data.map((badge) => ({
            icon: (props) => getIcon(badge.icon, props),
            label: badge.title,
          })))
        }
      })
      .catch((error) => console.error('Failed to load public trust badges:', error))
    return () => { mounted = false }
  }, [])

  return (
    <section className="container-px relative z-20 -mt-10">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="gradient-frame relative mx-auto max-w-7xl overflow-hidden rounded-4xl bg-white/80 shadow-float backdrop-blur-xl"
      >
        {/* soft glow accents */}
        <div className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full bg-primary-100/50 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -right-10 h-40 w-40 rounded-full bg-accent/10 blur-3xl" />

        <div className="relative grid grid-cols-1 items-center gap-6 p-6 sm:p-8 lg:grid-cols-[auto,1fr] lg:gap-10">
          {/* Rating pill */}
          <div className="flex items-center gap-3 lg:border-r lg:border-lightgray lg:pr-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-gradient text-white shadow-soft">
              <Star className="h-6 w-6 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <p className="mt-0.5 text-sm font-bold text-navy">
                Rated <span className="text-primary-600">4.9/5</span> by 1,200+ movers
              </p>
            </div>
          </div>

          {/* Badges */}
          <ul className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-5">
            {badges.map(({ icon: Icon, label }, i) => (
              <motion.li
                key={label}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
                className="group flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left"
              >
                <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 ring-1 ring-primary-100/70 transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-blue-gradient group-hover:text-white group-hover:shadow-glow-accent">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="font-display text-[13px] font-bold leading-tight text-navy">{label}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>
    </section>
  )
}
