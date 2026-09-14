import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <section className="flex min-h-[80vh] items-center justify-center px-5 pt-28">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <p className="font-display text-[7rem] font-extrabold leading-none heading-gradient sm:text-[10rem]">404</p>
        <h1 className="mt-2 font-display text-2xl font-bold text-navy sm:text-3xl">Page Not Found</h1>
        <p className="mx-auto mt-4 max-w-md text-ink/60">
          The page you're looking for may have moved or no longer exists. Let's get you back on the road.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link to="/" className="btn-primary">
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
          <Link to="/contact" className="btn-ghost">
            <ArrowLeft className="h-4 w-4" />
            Contact Support
          </Link>
        </div>
      </motion.div>
    </section>
  )
}
