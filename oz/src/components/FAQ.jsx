import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus, Minus, MessagesSquare, Phone } from 'lucide-react'
import MagneticButton from './ui/MagneticButton'
import { COMPANY } from '../data/siteData'
import { fetchFAQs } from '../services/api'

export default function FAQ({ location }) {
  const [open, setOpen] = useState(0)
  const [faqs, setFaqs] = useState([])

  useEffect(() => {
    if (Array.isArray(location?.faqs) && location.faqs.length > 0) {
      const parsed = location.faqs
        .filter((f) => (f.question || f.q)?.trim() && (f.answer || f.a)?.trim())
        .map((f) => ({
          q: (f.question || f.q).trim(),
          a: (f.answer || f.a).trim(),
        }))

      if (parsed.length > 0) {
        setFaqs(parsed)
        return
      }
    }

    let mounted = true

    fetchFAQs({ _t: Date.now() })
      .then((response) => {
        if (!mounted) return
        const records = response.data?.success ? response.data.data : []
        setFaqs(records.map((faq) => ({ q: faq.question, a: faq.answer })))
      })
      .catch((error) => {
        console.error('Failed to load public FAQs:', error)
      })

    return () => {
      mounted = false
    }
  }, [location])

  return (
    <section className="section relative overflow-hidden bg-light">
      <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-primary-100/40 blur-3xl" />
      <div className="container-px relative">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
          {/* Left intro */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-primary-600 ring-1 ring-primary-100">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-600" />
              FAQ
            </span>
            <h2 className="mt-5 font-display text-3xl font-extrabold leading-tight text-navy sm:text-4xl">
              {location?.faqTitle || (
                <>
                  Answers to your{' '}
                  <span className="heading-gradient-animated">
                    {location ? `${location.name} moving questions` : 'moving questions'}
                  </span>
                </>
              )}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink/65">
              Everything you need to know before booking your {location ? `${location.name} ` : ''}interstate move. Still have questions? Our team is
              one call away.
            </p>

            <div className="relative mt-8 overflow-hidden rounded-4xl bg-navy-gradient p-7 text-white shadow-float">
              <div className="pointer-events-none absolute inset-0 bg-mesh-dark opacity-70" />
              <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 animate-aurora rounded-full bg-accent/25 blur-3xl" />
              <div className="relative">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
                  <MessagesSquare className="h-6 w-6 text-accent" />
                </span>
                <h3 className="mt-5 font-display text-xl font-bold">Still have questions?</h3>
                <p className="mt-2 text-sm text-white/75">
                  Can't find the answer you're looking for? Chat with our friendly moving consultants.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <MagneticButton to="/contact" variant="light" className="px-6 py-3 text-sm">
                    Contact Support
                  </MagneticButton>
                  <a
                    href={location?.phone ? `tel:${location.phone.replace(/\s+/g, '')}` : COMPANY.phoneHref}
                    className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/10"
                  >
                    <Phone className="h-4 w-4 text-accent" />
                    {location?.phone || COMPANY.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right accordion */}
          <div className="space-y-3.5 lg:col-span-7">
            {faqs.map((faq, i) => {
              const isOpen = open === i
              return (
                <motion.div
                  key={faq.q || i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className={`overflow-hidden rounded-3xl border transition-all duration-300 ${
                    isOpen
                      ? 'border-primary-200 bg-white shadow-card'
                      : 'border-lightgray bg-white/70 hover:border-primary-100 hover:bg-white'
                  }`}
                >
                  <button
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="flex items-center gap-4">
                      <span className={`font-display text-sm font-extrabold transition-colors ${isOpen ? 'text-primary-600' : 'text-primary-200'}`}>
                        0{i + 1}
                      </span>
                      <span className="font-display text-base font-bold text-navy sm:text-lg">{faq.q}</span>
                    </span>
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                        isOpen ? 'rotate-180 bg-blue-gradient text-white' : 'bg-primary-50 text-primary-600'
                      }`}
                    >
                      {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        <p className="px-6 pb-6 pl-16 text-sm leading-relaxed text-ink/65">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
