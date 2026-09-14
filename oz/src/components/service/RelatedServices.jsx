import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react'
import { fetchServices } from '../../services/api'
import { getIcon } from '../../utils/iconMap'
import { fadeUp } from '../../utils/motion'
import { SERVICES as DEFAULT_SERVICES } from '../../data/siteData'

export default function RelatedServices({ currentSlug }) {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    fetchServices({ _t: Date.now() })
      .then((res) => {
        if (!isMounted) return
        if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          setServices(res.data.data)
        } else {
          setServices(DEFAULT_SERVICES)
        }
      })
      .catch((err) => {
        console.error('Failed to load related services:', err)
        if (isMounted) setServices(DEFAULT_SERVICES)
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const filtered = services.filter((s) => s.slug !== currentSlug)

  if (!loading && filtered.length === 0) return null

  return (
    <section className="section relative overflow-hidden bg-white py-20 sm:py-24">
      <div className="container-px relative">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-primary-600 ring-1 ring-primary-100">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            Comprehensive Relocation Solutions
          </span>

          <h2 className="mt-4 font-display text-3xl font-extrabold text-navy sm:text-4xl lg:text-[2.6rem]">
            Explore Other Removalist Services
          </h2>

          <p className="mt-3 text-base text-slate-600 sm:text-lg">
            Looking for something else? We offer tailored solutions for residential moves, corporate relocations, storage, and specialized freight.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.slice(0, 3).map((svc, idx) => {
            const features = Array.isArray(svc.features) && svc.features.length > 0
              ? svc.features.slice(0, 2)
              : ['Full Insurance Cover', 'Professional Removalists']

            return (
              <motion.div
                key={svc.slug || idx}
                variants={fadeUp}
                custom={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                whileHover={{ y: -6 }}
                className="card-gradient-border group flex flex-col justify-between rounded-3xl bg-white p-7 shadow-soft transition-all duration-300 hover:shadow-card"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <Link
                      to={`/service/${svc.slug}`}
                      className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 transition-all duration-300 group-hover:bg-blue-gradient group-hover:text-white"
                    >
                      {getIcon(svc.icon, { className: 'h-7 w-7' })}
                    </Link>
                    <span className="font-display text-3xl font-black text-lightgray transition-colors group-hover:text-primary-200">
                      0{idx + 1}
                    </span>
                  </div>

                  <Link to={`/service/${svc.slug}`} className="block mt-5">
                    <h3 className="font-display text-xl font-bold text-navy transition-colors group-hover:text-primary-600">
                      {svc.title}
                    </h3>
                  </Link>

                  <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
                    {svc.short_description || svc.desc || svc.description}
                  </p>

                  <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-3">
                    {features.map((f, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 border-t border-slate-100 pt-4 flex items-center justify-between">
                  <Link
                    to={`/service/${svc.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-primary-600 transition-all group-hover:text-accent group-hover:translate-x-1"
                  >
                    View Service Details
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <Link to="/contact" className="text-xs font-bold text-slate-400 hover:text-navy">
                    Get Quote
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 rounded-full bg-blue-gradient px-8 py-4 text-xs font-extrabold uppercase tracking-wider text-white shadow-soft transition-all hover:shadow-glow-accent hover:-translate-y-0.5"
          >
            Browse All Removalist Solutions
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
