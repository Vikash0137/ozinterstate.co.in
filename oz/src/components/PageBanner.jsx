import { formatImageUrl } from '../utils/urlHelper'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

export default function PageBanner({ title, subtitle, crumb, image, children }) {
  const imageUrl = image
    ? formatImageUrl(image)
    : 'https://images.unsplash.com/photo-1600518464441-9154a4dea21b?auto=format&fit=crop&w=2000&q=80'

  return (
    <section className="relative px-3 pt-28 sm:px-5 lg:pt-32">
      <div className="relative mx-auto flex min-h-[44vh] max-w-[1400px] items-center overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] pt-12 pb-10 sm:pt-14 sm:pb-12">
        <div className="absolute inset-0">
          <img
            src={imageUrl}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/75 to-navy/60" />
          <div className="absolute inset-0 bg-grid opacity-[0.08]" />
        </div>

        <div className="container-px relative z-10 w-full">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-3xl"
            >
              <nav className="flex items-center gap-2 text-sm font-semibold text-white/80">
                <Link to="/" className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <Home className="h-4 w-4 text-accent" />
                  Home
                </Link>
                <ChevronRight className="h-4 w-4 text-white/40" />
                <span className="text-accent font-bold">{crumb || title}</span>
              </nav>
              <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight tracking-tight text-white text-balance sm:text-5xl lg:text-6xl">
                {title}
              </h1>
              {subtitle && <p className="mt-4 text-base leading-relaxed text-white/85 sm:text-lg">{subtitle}</p>}
            </motion.div>

            {children && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="w-full lg:w-96 lg:shrink-0"
              >
                {children}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
