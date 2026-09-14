import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { ArrowUpRight, ArrowRight, Sparkles } from 'lucide-react'
import SectionHeading from './SectionHeading'
import MagneticButton from './ui/MagneticButton'
import { fetchServices } from '../services/api'
import { getIcon } from '../utils/iconMap'
import { fadeUp } from '../utils/motion'

function ServiceCardDescription({ text, featured = false }) {
  const lines = String(text || '').split('\n').map((line) => line.trim()).filter(Boolean)
  const idealForIndex = lines.findIndex((line) => line.toUpperCase() === 'IDEAL FOR')

  if (idealForIndex < 1) {
    return <p className={featured ? 'mt-3 max-w-md whitespace-pre-line text-[15px] leading-relaxed text-white/75' : 'relative mt-2.5 flex-1 whitespace-pre-line text-sm leading-relaxed text-ink/60'}>{text}</p>
  }

  const introLines = lines.slice(0, idealForIndex)
  const idealForItems = lines.slice(idealForIndex + 1)

  return (
    <div className={featured ? 'mt-3 max-w-md text-[15px] leading-relaxed text-white/75' : 'relative mt-2.5 flex-1 text-sm leading-relaxed text-ink/60'}>
      <p className="font-semibold">{introLines[0]}</p>
      {introLines.slice(1).map((line) => <p key={line} className="mt-2">{line}</p>)}
      <p className="mt-3 font-bold uppercase tracking-wide">Ideal for</p>
      <ul className="mt-1 list-disc space-y-1 pl-5">
        {idealForItems.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </div>
  )
}

export default function Services() {
  const [servicesData, setServicesData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadServices = async () => {
      try {
        const { data } = await fetchServices({ _t: Date.now() })
        setServicesData(data.data || [])
      } catch (error) {
        console.error('Failed to load services:', error)
      } finally {
        setLoading(false)
      }
    }
    loadServices()
  }, [])

  if (loading || servicesData.length === 0) return null

  const [featured, ...rest] = servicesData

  return (
    <section id="services" className="section relative overflow-hidden bg-mesh-light">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-200/60 to-transparent" />
      <div className="container-px relative">
        <SectionHeading
          eyebrow="What We Do"
          title="Premium Removalist"
          highlight="Services"
          subtitle="From a single piece of furniture to an entire office, our specialist teams deliver every move with precision, care and total transparency."
        />

        <div className="mx-auto mt-10 grid max-w-7xl grid-cols-1 gap-5 sm:grid-cols-2 lg:auto-rows-[minmax(210px,auto)] lg:grid-cols-6">
          {/* Featured card */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-4xl bg-navy-gradient p-8 text-white shadow-float sm:col-span-2 lg:col-span-3 lg:row-span-2"
          >
            <div className="pointer-events-none absolute inset-0 bg-mesh-dark opacity-70" />
            <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 animate-aurora rounded-full bg-accent/25 blur-3xl" />
            <div className="pointer-events-none absolute inset-0 bg-dots-light opacity-40" />

            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white/90 backdrop-blur">
                <Sparkles className="h-3.5 w-3.5 text-accent" />
                Most Requested
              </span>
              <span className="mt-8 flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 text-white ring-1 ring-white/20 backdrop-blur">
                {getIcon(featured.icon, { className: 'h-8 w-8' })}
              </span>
              <h3 className="mt-6 font-display text-2xl font-extrabold sm:text-3xl">{featured.title}</h3>
              <ServiceCardDescription text={featured.short_description} featured />
            </div>

            <div className="relative mt-8">
              <MagneticButton to={`/service/${featured.slug}`} variant="light" className="px-6 py-3 text-sm">
                Explore Service
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </MagneticButton>
            </div>
          </motion.div>

          {/* Remaining services */}
          {rest.map((service, i) => {
            return (
              <motion.div
                key={service.slug}
                variants={fadeUp}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                whileHover={{ y: -8 }}
                className={`card-gradient-border group relative flex flex-col overflow-hidden rounded-4xl bg-white/85 p-7 shadow-soft backdrop-blur-sm transition-shadow duration-300 hover:shadow-card ${
                  i === 0 || i === 1 ? 'lg:col-span-3' : 'lg:col-span-2'
                }`}
              >
                <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary-50 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative mb-5 flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 ring-1 ring-primary-100/70 transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-blue-gradient group-hover:text-white group-hover:shadow-glow-accent">
                    {getIcon(service.icon, { className: 'h-6 w-6' })}
                  </span>
                  <span className="font-display text-4xl font-extrabold text-lightgray transition-colors group-hover:text-primary-100">
                    0{i + 2}
                  </span>
                </div>

                <h3 className="relative font-display text-xl font-bold text-navy">{service.title}</h3>
                <ServiceCardDescription text={service.short_description} />

                <Link
                  to={`/service/${service.slug}`}
                  className="relative mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-primary-600 transition-colors hover:text-accent"
                >
                  Explore {service.title}
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
