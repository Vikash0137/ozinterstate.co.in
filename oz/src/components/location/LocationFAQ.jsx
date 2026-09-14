import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HelpCircle, ChevronDown, PhoneCall } from 'lucide-react'

export default function LocationFAQ({ location = {} }) {
  const [openIndex, setOpenIndex] = useState(0)

  const faqs = Array.isArray(location.faqs) && location.faqs.length > 0
    ? location.faqs
    : [
        {
          question: `How does the interstate moving process work in ${location.name}?`,
          answer: `Our ${location.name} moving team manages everything from initial inventory assessment, protective furniture wrapping, secure loading, direct highway linehaul, through to delivery and room placement at your destination.`,
        },
        {
          question: `Are all goods fully insured during transport to and from ${location.name}?`,
          answer: `Yes, all shipments carried by OZ Interstate Movers include comprehensive goods-in-transit insurance coverage against fire, collision, overturning, and accidental loss.`,
        },
        {
          question: `How far in advance should I book my ${location.name} move?`,
          answer: `We recommend booking 2 to 3 weeks in advance for interstate moves, especially during peak periods and month-ends. However, express emergency slots are frequently available.`,
        },
      ]

  const toggleFaq = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx)
  }

  return (
    <section className="bg-slate-50 py-16 sm:py-24">
      <div className="container-px mx-auto max-w-4xl">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-3.5 py-1 text-xs font-bold text-accent">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
            {location.faqTitle || `${location.name} Moving & Freight FAQs`}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Answers to common questions about moving to and from {location.name}.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="mt-10 space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx
            return (
              <div
                key={idx}
                className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="flex w-full items-center justify-between p-5 text-left font-display text-base font-bold text-navy hover:text-accent transition-colors"
                >
                  <span className="pr-4">{faq.question}</span>
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 bg-sky-100 text-accent' : ''
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="border-t border-slate-100 px-5 pb-5 pt-3 text-sm leading-relaxed text-slate-600">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>

        {/* Still have questions prompt */}
        <div className="mt-10 rounded-2xl border border-sky-200 bg-sky-50/70 p-6 text-center">
          <h4 className="font-display text-base font-bold text-navy">
            Have a specific question about moving in {location.name}?
          </h4>
          <p className="mt-1 text-xs text-slate-600">
            Our logistics support specialists are ready 7 days a week to answer route, pricing, and timing inquiries.
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            {location.phone && (
              <a
                href={`tel:${location.phone.replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:bg-sky-700"
              >
                <PhoneCall className="h-3.5 w-3.5" /> Call {location.phone}
              </a>
            )}
            <a
              href="#quote"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-navy shadow-sm hover:bg-slate-50"
            >
              Ask Online
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
