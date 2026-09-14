import { motion } from 'framer-motion'
import { blurReveal, staggerFast } from '../utils/motion'

/**
 * Premium section heading with animated eyebrow, blur-reveal title and
 * optional gradient-highlighted phrase.
 */
export default function SectionHeading({
  eyebrow,
  title,
  highlight,
  subtitle,
  center = true,
  light = false,
  className = '',
}) {
  return (
    <motion.div
      variants={staggerFast}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      className={`max-w-3xl ${center ? 'mx-auto text-center' : ''} ${className}`}
    >
      {eyebrow && (
        <motion.span
          variants={blurReveal}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] ${
            light
              ? 'border border-white/20 bg-white/10 text-white/90 backdrop-blur'
              : 'bg-primary-50 text-primary-600 ring-1 ring-primary-100'
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${light ? 'bg-accent' : 'bg-primary-600'}`} />
          {eyebrow}
        </motion.span>
      )}
      <motion.h2
        variants={blurReveal}
        custom={1}
        className={`mt-5 font-display text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1] text-balance ${
          light ? 'text-white' : 'text-navy'
        }`}
      >
        {title}{' '}
        {highlight && (
          <span
            className={
              light
                ? 'bg-gradient-to-r from-sky-200 to-accent bg-clip-text text-transparent'
                : 'heading-gradient-animated'
            }
          >
            {highlight}
          </span>
        )}
      </motion.h2>
      {subtitle && (
        <motion.p
          variants={blurReveal}
          custom={2}
          className={`mt-5 text-base leading-relaxed sm:text-lg ${
            center ? 'mx-auto max-w-2xl' : ''
          } ${light ? 'text-white/75' : 'text-ink/65'}`}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  )
}
