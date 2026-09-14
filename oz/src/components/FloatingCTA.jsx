import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Phone, ArrowUp } from 'lucide-react'
import { useSiteSettings } from '../context/SiteContext'
import { resolveCompanyDetails, resolveContactValue } from '../utils/siteSettings'

export default function FloatingCTA() {
  const [showTop, setShowTop] = useState(false)
  const { siteSettings } = useSiteSettings()
  const company = resolveCompanyDetails(siteSettings)

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Scroll to top"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-primary-600 shadow-card ring-1 ring-primary-100 transition-transform hover:-translate-y-0.5"
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>

      <a
        href={resolveContactValue(company, 'phoneHref', 'tel:1300668254')}
        aria-label={`Call ${resolveContactValue(company, 'phone', '1300 668 254')}`}
        className="group flex h-14 w-14 items-center justify-center rounded-full bg-blue-gradient text-white shadow-glow transition-transform hover:scale-105"
      >
        <span className="absolute inline-flex h-14 w-14 animate-ping rounded-full bg-accent/40" />
        <Phone className="relative h-6 w-6" />
      </a>
    </div>
  )
}
