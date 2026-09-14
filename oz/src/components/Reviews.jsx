import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react'
import SectionHeading from './SectionHeading'
import { fetchReviews } from '../services/api'
import { formatImageUrl } from '../utils/urlHelper'

const normalizeReview = (review) => ({
  ...review,
  text: review.content,
  avatar: review.avatar
    ? review.avatar.startsWith('http') || review.avatar.startsWith('data:')
      ? review.avatar
      : formatImageUrl(review.avatar)
    : 'https://i.pravatar.cc/150?img=47',
})

export default function Reviews() {
  const [index, setIndex] = useState(0)
  const [dir, setDir] = useState(1)
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    let mounted = true

    fetchReviews({ _t: Date.now() })
      .then((response) => {
        if (mounted) setReviews(response.data?.success ? response.data.data.map(normalizeReview) : [])
      })
      .catch((error) => console.error('Failed to load public reviews:', error))

    return () => {
      mounted = false
    }
  }, [])

  const go = (i) => {
    setDir(i > index ? 1 : -1)
    setIndex(i)
  }
  const paginate = (d) => {
    setDir(d)
    setIndex((i) => reviews.length ? (i + d + reviews.length) % reviews.length : 0)
  }

  const active = reviews[index]

  if (!active) return <section className="section relative overflow-hidden bg-light"><div className="pointer-events-none absolute inset-0 bg-grid opacity-40" /><div className="container-px relative"><SectionHeading eyebrow="Reviews" title="Loved by movers" highlight="across Australia" subtitle="Real stories from real customers. Here's what families and businesses say about moving with MoveLink." /></div></section>

  return (
    <section className="section relative overflow-hidden bg-light">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
      <div className="pointer-events-none absolute -left-24 top-24 h-80 w-80 rounded-full bg-primary-100/40 blur-3xl" />
      <div className="container-px relative">
        <SectionHeading
          eyebrow="Reviews"
          title="Loved by movers"
          highlight="across Australia"
          subtitle="Real stories from real customers. Here's what families and businesses say about moving with MoveLink."
        />

        <div className="mx-auto mt-10 grid max-w-7xl grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
          {/* Featured quote */}
          <div className="lg:col-span-7">
            <div className="gradient-frame relative h-full overflow-hidden rounded-5xl bg-white p-8 shadow-float sm:p-10">
              <div className="pointer-events-none absolute -right-6 -top-8 select-none font-display text-[10rem] leading-none text-primary-50">
                &rdquo;
              </div>
              <Quote className="relative h-10 w-10 text-accent" />
              <AnimatePresence mode="wait" custom={dir}>
                <motion.div
                  key={index}
                  custom={dir}
                  initial={{ opacity: 0, x: dir * 40, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, x: dir * -40, filter: 'blur(8px)' }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="relative"
                >
                  <div className="mt-5 flex items-center gap-1 text-amber-400">
                    {[...Array(active.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current" />
                    ))}
                  </div>
                  <p className="mt-5 font-display text-xl font-semibold leading-relaxed text-navy sm:text-2xl">
                    &ldquo;{active.text}&rdquo;
                  </p>
                  <div className="mt-8 flex items-center gap-4">
                    <img
                      src={active.avatar}
                      alt={active.name}
                      loading="lazy"
                      className="h-14 w-14 rounded-2xl border-2 border-primary-100 object-cover"
                    />
                    <div>
                      <p className="font-display text-lg font-bold text-navy">{active.name}</p>
                      <p className="text-sm font-medium text-primary-600">{active.role}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Controls */}
              <div className="mt-10 flex items-center gap-4">
                <button
                  onClick={() => paginate(-1)}
                  aria-label="Previous review"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-primary-200 bg-white text-primary-600 transition-all hover:bg-blue-gradient hover:text-white hover:shadow-soft"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => paginate(1)}
                  aria-label="Next review"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-primary-200 bg-white text-primary-600 transition-all hover:bg-blue-gradient hover:text-white hover:shadow-soft"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <div className="ml-1 flex items-center gap-2">
                  {reviews.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => go(i)}
                      aria-label={`Go to review ${i + 1}`}
                      className={`h-2.5 rounded-full transition-all ${
                        i === index ? 'w-7 bg-primary-600' : 'w-2.5 bg-primary-200 hover:bg-primary-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Reviewer switcher */}
          <div className="lg:col-span-5">
            <div className="flex h-full flex-col gap-4 rounded-5xl bg-navy-gradient p-6 text-white shadow-float sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-display text-4xl font-extrabold">4.9</p>
                  <div className="mt-1 flex items-center gap-1 text-amber-300">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="max-w-[8rem] text-right text-xs text-white/60">
                  Average rating from 1,200+ verified reviews
                </p>
              </div>
              <div className="h-px bg-white/10" />
              <div className="flex flex-col gap-1.5">
                {reviews.map((review, i) => (
                  <button
                    key={review.name}
                    onClick={() => go(i)}
                    className={`flex items-center gap-3 rounded-2xl p-3 text-left transition-all duration-300 ${
                      i === index ? 'bg-white/15 ring-1 ring-white/20' : 'hover:bg-white/[0.07]'
                    }`}
                  >
                    <img
                      src={review.avatar}
                      alt={review.name}
                      loading="lazy"
                      className={`h-11 w-11 rounded-xl object-cover transition-all ${
                        i === index ? 'ring-2 ring-accent' : 'opacity-80'
                      }`}
                    />
                    <div className="min-w-0">
                      <p className="truncate font-display text-sm font-bold">{review.name}</p>
                      <p className="truncate text-xs text-white/60">{review.role}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
