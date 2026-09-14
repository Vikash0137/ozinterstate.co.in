import { formatImageUrl } from '../../utils/urlHelper'
import { motion } from 'framer-motion'
import { ShieldCheck, Award, CheckCircle2, ArrowRight, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { fadeUp } from '../../utils/motion'

export default function LocationAbout({ location = {} }) {
  const title = location.aboutTitle || `About OZ Interstate Movers in ${location.name}`
  const subtitle = location.aboutSubtitle || `Professional Long-Haul & Local Relocation in ${location.state || 'Australia'}`
  const description =
    location.aboutDescription ||
    location.localBusinessDescription ||
    location.introduction ||
    `OZ Interstate Movers delivers specialized moving, freight, and residential relocation services across ${location.name} and Australia. Our experienced team ensures every transition is punctual, secure, and stress-free.`

  const rawImage =
    location.aboutImage ||
    location.featuredImage ||
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80'

  const image = formatImageUrl(rawImage)

  return (
    <section className="section relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-primary-100/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />

      <div className="container-px relative">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Visual Image side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative overflow-hidden rounded-5xl shadow-float">
              <img
                src={image}
                alt={`${location.name} interstate moving team`}
                loading="lazy"
                className="h-[480px] w-full object-cover sm:h-[520px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/10 to-transparent" />

              {/* Floating badge */}
              <div className="absolute left-5 top-5 flex items-center gap-3 rounded-2xl bg-white/95 px-4 py-3 shadow-card backdrop-blur">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-gradient text-white">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-display text-sm font-extrabold text-navy">{location.name} Depot</p>
                  <p className="text-[11px] text-ink/55">{location.state || 'Australia'} Wide Service</p>
                </div>
              </div>
            </div>

            {/* Rating badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="absolute -bottom-6 right-4 flex items-center gap-4 rounded-3xl bg-white p-5 shadow-float sm:right-8 border border-slate-100"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                <Award className="h-7 w-7" />
              </span>
              <div>
                <p className="font-display text-2xl font-extrabold text-navy">100% Vetted</p>
                <p className="text-xs font-medium text-ink/55">Trained & Insured Movers</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Text Content side */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="order-1 lg:order-2"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-primary-600 ring-1 ring-primary-100">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-600" />
              About {location.name} Operations
            </span>

            <h2 className="mt-5 font-display text-3xl font-extrabold leading-tight text-navy sm:text-4xl lg:text-[2.6rem]">
              {title}
            </h2>

            {subtitle && (
              <p className="mt-3 text-base font-semibold text-accent">
                {subtitle}
              </p>
            )}

            <div className="mt-4 space-y-4 text-base leading-relaxed text-slate-600">
              <p>{description}</p>
            </div>

            {/* Bullet Highlights */}
            {Array.isArray(location.highlights) && location.highlights.length > 0 ? (
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {location.highlights.map((hl, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 rounded-2xl border border-slate-100 bg-slate-50 p-3.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-navy">{hl.title}</h4>
                      {hl.desc && <p className="text-[11px] text-slate-500">{hl.desc}</p>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-6 flex flex-wrap gap-3 text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" /> Full Transit Protection
                </span>
                <span className="flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-2">
                  <CheckCircle2 className="h-4 w-4 text-sky-600" /> Scheduled Highway Linehaul
                </span>
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a href="#quote" className="btn-primary">
                Get {location.name} Quote
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link to="/contact" className="btn-outline">
                Contact {location.name} Hub
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
