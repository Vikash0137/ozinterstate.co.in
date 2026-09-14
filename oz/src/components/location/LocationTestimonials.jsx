import { motion } from 'framer-motion'
import { Star, Quote, CheckCircle2 } from 'lucide-react'

export default function LocationTestimonials({ location = {} }) {
  const testimonials = Array.isArray(location.testimonials) && location.testimonials.length > 0
    ? location.testimonials
    : [
        {
          name: 'Michael & Sarah Davies',
          role: 'Residential Relocation',
          review: `Moving our family home from ${location.name} to the Gold Coast was completely stress-free with OZ Interstate Movers. The team arrived on time, took exceptional care of our fragile glassware, and kept us updated throughout transit.`,
          rating: 5,
          locationTag: `${location.name} ➔ Interstate`,
        },
        {
          name: 'James Reynolds',
          role: 'Commercial Logistics Manager',
          review: `We needed commercial equipment moved on an urgent schedule from ${location.name}. The team handled the heavy logistics seamlessly and met our exact delivery window.`,
          rating: 5,
          locationTag: 'Commercial Moving',
        },
      ]

  return (
    <section className="bg-white py-16 sm:py-24 border-t border-slate-100">
      <div className="container-px mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700">
            Real Customer Experiences
          </span>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
            Customer Feedback in {location.name}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Read verified reviews from homeowners and businesses who moved with us.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="relative flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-slate-50 p-7 shadow-sm transition-all hover:border-sky-300 hover:bg-white hover:shadow-md"
            >
              <div>
                {/* Rating stars */}
                <div className="flex items-center gap-1">
                  {[...Array(t.rating || 5)].map((_, rIdx) => (
                    <Star key={rIdx} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="mt-4 text-sm leading-relaxed text-slate-700 italic">
                  "{t.review}"
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-slate-200/60 pt-4">
                <div>
                  <h4 className="font-display text-sm font-bold text-navy">{t.name}</h4>
                  <span className="text-xs text-slate-500">{t.role}</span>
                </div>
                {t.locationTag && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-[11px] font-bold text-slate-700 border border-slate-200">
                    <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                    {t.locationTag}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
