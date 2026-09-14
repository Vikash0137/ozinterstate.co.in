import { formatImageUrl } from '../utils/urlHelper'
import { motion } from 'framer-motion'
import { Star, Quote, Award } from 'lucide-react'
import PageBanner from '../components/PageBanner'
import Reviews from '../components/Reviews'
import SectionHeading from '../components/SectionHeading'
import { useEffect, useState } from 'react'
import { fetchReviews } from '../services/api'
import { fadeUp } from '../utils/motion'

const ratingBreakdown = [
  { stars: 5, pct: 94 },
  { stars: 4, pct: 5 },
  { stars: 3, pct: 1 },
  { stars: 2, pct: 0 },
  { stars: 1, pct: 0 },
]

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    let mounted = true
    fetchReviews({ _t: Date.now() })
      .then((response) => {
        if (mounted) setReviews(response.data?.success ? response.data.data : [])
      })
      .catch((error) => console.error('Failed to load public reviews:', error))
    return () => { mounted = false }
  }, [])

  return (
    <>
      <PageBanner
        title="Customer Reviews"
        crumb="Reviews"
        subtitle="Don't just take our word for it — hear from thousands of happy customers across Australia."
        image="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=2000&q=80"
      />

      {/* Rating summary */}
      <section className="section">
        <div className="container-px">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-3">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-col items-center justify-center rounded-4xl bg-navy-gradient p-10 text-center text-white shadow-card"
            >
              <Award className="h-12 w-12 text-amber-300" />
              <p className="mt-4 font-display text-6xl font-extrabold">4.9</p>
              <div className="mt-2 flex gap-1 text-amber-300">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <p className="mt-3 text-white/75">Based on 1,200+ verified reviews</p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-col justify-center gap-3 rounded-4xl bg-white p-10 shadow-soft lg:col-span-2"
            >
              {ratingBreakdown.map((r) => (
                <div key={r.stars} className="flex items-center gap-4">
                  <span className="flex w-12 items-center gap-1 text-sm font-bold text-navy">
                    {r.stars} <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  </span>
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-lightgray">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${r.pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full rounded-full bg-blue-gradient"
                    />
                  </div>
                  <span className="w-10 text-right text-sm font-semibold text-ink/60">{r.pct}%</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <Reviews />

      {/* All reviews grid */}
      <section className="section">
        <div className="container-px">
          <SectionHeading eyebrow="More Stories" title="What Our Customers Say" />
          <div className="mx-auto mt-14 grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review, i) => (
              <motion.div
                key={`${review.name}-${i}`}
                variants={fadeUp}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="flex flex-col rounded-3xl border border-lightgray bg-white p-7 shadow-soft"
              >
                <Quote className="h-8 w-8 text-primary-100" />
                <div className="mt-2 flex gap-1 text-amber-400">
                  {[...Array(review.rating)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/70">“{review.content}”</p>
                <div className="mt-5 flex items-center gap-3 border-t border-lightgray pt-4">
                  <img src={review.avatar ? formatImageUrl(review.avatar) : 'https://i.pravatar.cc/150?img=47'} alt={review.name} loading="lazy" className="h-11 w-11 rounded-full object-cover" />
                  <div>
                    <p className="font-display text-sm font-bold text-navy">{review.name}</p>
                    <p className="text-xs text-ink/50">{review.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
