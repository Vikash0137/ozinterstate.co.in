import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ShieldCheck, Award, ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { fetchWhyChooseItems, fetchSiteSettings } from '../services/api'
import { getIcon } from '../utils/iconMap'
import { formatImageUrl } from '../utils/urlHelper'
import { fadeUp, staggerFast } from '../utils/motion'

export default function WhyChooseUs({ location }) {
  const [items, setItems] = useState([])
  const [section, setSection] = useState(null)

  useEffect(() => {
    let mounted = true
    fetchWhyChooseItems({ _t: Date.now() })
      .then((response) => {
        if (mounted) setItems(response.data?.success ? response.data.data : [])
      })
      .catch((error) => console.error('Failed to load why choose items:', error))
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    let mounted = true
    fetchSiteSettings()
      .then((response) => {
        const data = response.data
        if (mounted && data.success) setSection(data.data?.whyChooseSection || null)
      })
      .catch((error) => console.error('Failed to load Why Choose Us section:', error))
    return () => { mounted = false }
  }, [])

  const sectionImage = section?.image
    ? formatImageUrl(section.image)
    : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80'

  return (
    <section className="section relative overflow-hidden bg-light">
      <div className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-primary-100/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />

      <div className="container-px relative">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Visual side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative order-2 lg:order-1 lg:sticky lg:top-28"
          >
            <div className="relative overflow-hidden rounded-5xl shadow-float">
              <img
                src={sectionImage}
                alt="Professional MoveLink removalist team carefully handling boxes"
                loading="lazy"
                className="h-[520px] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/10 to-transparent" />

              {/* Floating badge — insured */}
              <div className="absolute left-5 top-5 flex items-center gap-3 rounded-2xl bg-white/90 px-4 py-3 shadow-card backdrop-blur">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-gradient text-white">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-display text-sm font-extrabold text-navy">100% Insured</p>
                  <p className="text-[11px] text-ink/55">Every move covered</p>
                </div>
              </div>
            </div>

            {/* Floating rating card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="absolute -bottom-8 right-4 flex items-center gap-4 rounded-3xl bg-white p-5 shadow-float sm:right-8"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                <Award className="h-7 w-7" />
              </span>
              <div>
                <p className="font-display text-2xl font-extrabold text-navy">10+ Years</p>
                <p className="text-xs font-medium text-ink/55">of trusted moving expertise</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Feature list */}
          <div className="order-1 lg:order-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-primary-600 ring-1 ring-primary-100">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-600" />
              Why Choose Us
            </span>
            <h2 className="mt-5 font-display text-3xl font-extrabold leading-tight text-navy sm:text-4xl lg:text-[2.6rem]">
              {location?.highlightsTitle || section?.title || (
                <>
                  The MoveLink{' '}
                  <span className="heading-gradient-animated">
                    {location ? `${location.name} difference` : 'difference'}
                  </span>
                </>
              )}
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-ink/65">
              {section?.subtitle || (location
                ? `We don't just move boxes — we move ${location.name} lives and businesses with the care, reliability and professionalism you deserve.`
                : `We don't just move boxes — we move lives and businesses with the care, reliability and professionalism you deserve.`)}
            </p>

            <motion.div
              variants={staggerFast}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="mt-8 space-y-2"
            >
              {items.map((item, i) => {
                return (
                  <motion.div
                    key={item.title}
                    variants={fadeUp}
                    custom={i}
                    className="group flex items-start gap-4 rounded-2xl border border-transparent p-4 transition-all duration-300 hover:border-primary-100 hover:bg-white hover:shadow-soft"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-primary-600 shadow-soft ring-1 ring-primary-100/70 transition-all duration-300 group-hover:bg-blue-gradient group-hover:text-white">
                      {getIcon(item.icon, { className: 'h-5 w-5' })}
                    </span>
                    <div>
                      <h3 className="font-display text-base font-bold text-navy">{item.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-ink/60">{item.description}</p>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>

            <Link
              to="/company-profile"
              className="group mt-8 inline-flex items-center gap-2 text-sm font-bold text-primary-600 transition-colors hover:text-accent"
            >
              Learn more about our story
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
