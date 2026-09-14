import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

/**
 * Premium magnetic button with a shine sweep and arrow slide.
 * Renders as a react-router <Link> (to), an <a> (href) or a <button>.
 */
export default function MagneticButton({
  to,
  href,
  children,
  variant = 'primary',
  className = '',
  strength = 0.35,
  ...rest
}) {
  const ref = useRef(null)

  const handleMove = (e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) * strength
    const y = (e.clientY - rect.top - rect.height / 2) * strength
    el.style.transform = `translate(${x}px, ${y}px)`
  }

  const handleLeave = () => {
    const el = ref.current
    if (el) el.style.transform = 'translate(0px, 0px)'
  }

  const variants = {
    primary:
      'btn-shine bg-blue-gradient text-white shadow-soft hover:shadow-glow',
    light:
      'btn-shine bg-white text-primary-600 shadow-soft hover:shadow-glow',
    outline:
      'border border-white/40 bg-white/5 text-white backdrop-blur hover:bg-white/10',
    dark:
      'btn-shine bg-navy text-white shadow-card hover:shadow-glow',
  }

  const classes = `group inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 font-semibold transition-shadow duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 ${variants[variant] || variants.primary} ${className}`

  const inner = (
    <motion.span
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="pointer-events-none inline-flex items-center gap-2 transition-transform duration-200 ease-out"
    >
      {children}
    </motion.span>
  )

  if (to) {
    return (
      <Link to={to} className={classes} onMouseMove={handleMove} onMouseLeave={handleLeave} {...rest}>
        {inner}
      </Link>
    )
  }
  if (href) {
    return (
      <a href={href} className={classes} onMouseMove={handleMove} onMouseLeave={handleLeave} {...rest}>
        {inner}
      </a>
    )
  }
  return (
    <button className={classes} onMouseMove={handleMove} onMouseLeave={handleLeave} {...rest}>
      {inner}
    </button>
  )
}
