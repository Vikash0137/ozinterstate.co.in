import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus, HelpCircle, MessagesSquare, Phone, Sparkles, Search } from 'lucide-react'
import { COMPANY } from '../../data/siteData'

export default function ServiceFAQSection({ service }) {
  const [openIndex, setOpenIndex] = useState(0)
  const [searchFilter, setSearchFilter] = useState('')

  const defaultFaqs = [
    {
      q: `What is included with ${service?.title || 'this moving service'}?`,
      a: `Our ${service?.title || 'moving service'} includes full goods-in-transit insurance, protective blanket wrapping, certified heavy lifting movers, and destination room placement.`,
      tag: 'Inclusions',
    },
    {
      q: 'Are my belongings insured during highway transit?',
      a: 'Yes, comprehensive transit insurance is included standard with every booking covering road transport, loading, and unloading.',
      tag: 'Insurance',
    },
    {
      q: 'How far in advance should I book my move?',
      a: 'We recommend booking 1 to 2 weeks in advance for interstate moves, although urgent and same-week departures are accommodated based on fleet availability.',
      tag: 'Timeline',
    },
    {
      q: 'How is the fixed moving quote calculated?',
      a: 'Quotes are calculated based on your inventory volume (m³), pickup and delivery access, distance, and chosen move dates with zero hidden fees.',
      tag: 'Pricing',
    },
  ]

  const rawFaqs = Array.isArray(service?.faqs) && service.faqs.length > 0
    ? service.faqs
        .filter((f) => (f.question || f.q)?.trim() && (f.answer || f.a)?.trim())
        .map((f, i) => ({
          q: (f.question || f.q).trim(),
          a: (f.answer || f.a).trim(),
          tag: i === 0 ? 'Overview' : i === 1 ? 'Insurance' : i === 2 ? 'Schedule' : 'Pricing',
        }))
    : defaultFaqs

  const faqs = rawFaqs.length > 0 ? rawFaqs : defaultFaqs

  const filteredFaqs = searchFilter.trim()
    ? faqs.filter((f) => f.q.toLowerCase().includes(searchFilter.toLowerCase()) || f.a.toLowerCase().includes(searchFilter.toLowerCase()))
    : faqs

  const faqTitle =
    service?.faqTitle ||
    `Frequently Asked Questions About ${service?.title || 'Our Relocation Service'}`

  return (
    <section className="section relative overflow-hidden bg-slate-50/80 py-20 sm:py-28">
      {/* Background flare accents */}
      <div className="pointer-events-none absolute -left-24 top-1/4 h-80 w-80 rounded-full bg-sky-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-primary-200/30 blur-3xl" />

      <div className="container-px relative">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.18em] text-primary-600 ring-1 ring-primary-100">
            <HelpCircle className="h-3.5 w-3.5 text-accent" />
            Service Knowledge Hub
          </span>

          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-navy sm:text-4xl lg:text-[2.75rem]">
            {faqTitle}
          </h2>

          <p className="mt-3 text-base text-slate-600 sm:text-lg">
            Got questions about your {service?.title || 'interstate'} relocation? Find quick, direct answers below or connect with our coordinator.
          </p>

          {/* Quick FAQ Search Bar */}
          <div className="mx-auto mt-7 max-w-md">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search FAQ questions (e.g. insurance, timeline, pricing)..."
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pl-11 text-xs font-semibold text-navy shadow-xs outline-none transition-all placeholder:text-slate-400 focus:border-accent focus:ring-4 focus:ring-accent/20"
              />
            </div>
          </div>
        </div>

        <div className="mx-auto mt-12 grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
          {/* FAQ Accordion list */}
          <div className="space-y-4 lg:col-span-8">
            {filteredFaqs.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-500 text-sm">
                No matching questions found. Try a different search query or contact our team directly.
              </div>
            ) : (
              filteredFaqs.map((faq, i) => {
                const isOpen = openIndex === i
                return (
                  <motion.div
                    key={i}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`overflow-hidden rounded-4xl border transition-all duration-300 ${
                      isOpen
                        ? 'border-accent bg-white shadow-card ring-2 ring-accent/10'
                        : 'border-slate-200/80 bg-white hover:border-slate-300'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? -1 : i)}
                      className="flex w-full items-center justify-between gap-4 p-6 sm:p-7 text-left"
                    >
                      <div className="flex items-start gap-4">
                        <span className={`font-display text-sm font-black transition-colors ${isOpen ? 'text-accent' : 'text-slate-300'}`}>
                          0{i + 1}
                        </span>
                        <div>
                          <span className="inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-slate-600 mb-1.5">
                            {faq.tag}
                          </span>
                          <h4 className="font-display text-base font-bold text-navy sm:text-lg">
                            {faq.q}
                          </h4>
                        </div>
                      </div>

                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl transition-all duration-300 ${
                          isOpen
                            ? 'rotate-180 bg-blue-gradient text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600'
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
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                        >
                          <div className="border-t border-slate-100 bg-slate-50/50 px-7 pb-7 pt-4 text-xs sm:text-sm leading-relaxed text-slate-600">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })
            )}
          </div>

          {/* Right Help Card */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <div className="relative overflow-hidden rounded-4xl bg-navy-gradient p-7 text-white shadow-float sm:p-8">
              <div className="pointer-events-none absolute inset-0 bg-mesh-dark opacity-80" />
              <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 animate-aurora rounded-full bg-accent/25 blur-3xl" />

              <div className="relative">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
                  <MessagesSquare className="h-6 w-6 text-accent" />
                </span>

                <h3 className="mt-5 font-display text-xl font-bold">Have a Custom Move Requirement?</h3>

                <p className="mt-2 text-xs leading-relaxed text-white/75 sm:text-sm">
                  Our moving coordinators are ready 7 days a week to review your inventory and customize your schedule.
                </p>

                <div className="mt-6 space-y-3">
                  <a
                    href={COMPANY.phoneHref}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3.5 text-xs font-black uppercase tracking-wider text-navy shadow-soft transition-all hover:bg-sky-50"
                  >
                    <Phone className="h-4 w-4 text-accent" />
                    Call {COMPANY.phone}
                  </a>

                  <a
                    href="#quote"
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md transition-colors hover:bg-white/20"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-accent" />
                    Request Online Quote
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
