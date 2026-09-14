import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { fetchStats } from '../services/api'

function Counter({ value, decimals = 0, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    let raf
    const duration = 1800
    const start = performance.now()
    const animate = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(value * eased)
      if (progress < 1) raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [inView, value])

  return (
    <span ref={ref}>
      {display.toLocaleString('en-AU', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  )
}

export default function Stats() {
  const [stats, setStats] = useState([])

  useEffect(() => {
    let mounted = true
    fetchStats({ _t: Date.now() })
      .then((response) => {
        const data = response.data
        if (mounted && data.success && Array.isArray(data.data)) {
          setStats(data.data)
        }
      })
      .catch((error) => console.error('Failed to load public stats:', error))
    return () => { mounted = false }
  }, [])

  return (
    <section className="section relative">
      <div className="container-px relative">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-6xl bg-navy-gradient px-6 py-14 shadow-float sm:px-10 sm:py-16 lg:px-16">
          {/* backgrounds */}
          <div className="pointer-events-none absolute inset-0 bg-mesh-dark opacity-80" />
          <div className="pointer-events-none absolute inset-0 bg-grid-lines-light opacity-60" />
          <div className="pointer-events-none absolute -left-10 top-0 h-72 w-72 animate-aurora rounded-full bg-accent/30 blur-3xl" />
          <div className="pointer-events-none absolute -right-10 bottom-0 h-72 w-72 animate-aurora rounded-full bg-primary-500/30 blur-3xl [animation-delay:-5s]" />

          <div className="relative grid items-center gap-12 lg:grid-cols-[minmax(0,1fr),1.4fr]">
            {/* Intro */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white/90 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                By the numbers
              </span>
              <h2 className="mt-5 font-display text-3xl font-extrabold leading-tight text-white sm:text-4xl">
                A decade of moves,{' '}
                <span className="bg-gradient-to-r from-sky-200 to-accent bg-clip-text text-transparent">
                  measured in trust
                </span>
              </h2>
              <p className="mt-4 max-w-md text-white/70">
                Every figure below is earned — thousands of families and businesses relocated safely across
                Australia, on time and on budget.
              </p>
            </motion.div>

            {/* Counters */}
            <div className="grid grid-cols-2 gap-4 sm:gap-5">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30, scale: 0.96 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -6 }}
                  className={`group relative overflow-hidden rounded-3xl border border-white/15 bg-white/[0.07] p-6 backdrop-blur-md transition-colors hover:border-white/30 sm:p-7 ${
                    i === 0 ? 'sm:translate-y-4' : ''
                  } ${i === 3 ? 'sm:-translate-y-4' : ''}`}
                >
                  <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-accent/20 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
                  <p className="relative font-display text-4xl font-extrabold text-white sm:text-5xl">
                    <Counter value={stat.value} decimals={stat.decimals} suffix={stat.suffix} />
                  </p>
                  <p className="relative mt-2 text-sm font-semibold text-white/60">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
