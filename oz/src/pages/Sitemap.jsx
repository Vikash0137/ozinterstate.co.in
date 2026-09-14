import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ChevronRight, Map } from 'lucide-react'
import PageBanner from '../components/PageBanner'
import { NAV_LINKS, SERVICES, LOCATIONS, BLOGS } from '../data/siteData'
import { fadeUp } from '../utils/motion'

export default function Sitemap() {
  const sections = [
    {
      title: 'Main Pages',
      links: [...NAV_LINKS, { label: 'Contact Us', to: '/contact' }],
    },
    {
      title: 'Our Services',
      links: SERVICES.map((s) => ({ label: s.title, to: '/services' })),
    },
    {
      title: 'Locations',
      links: LOCATIONS.map((l) => ({ label: `${l.city}, ${l.state}`, to: '/services' })),
    },
    {
      title: 'Latest Blogs',
      links: BLOGS.map((b) => ({ label: b.title, to: '/blogs' })),
    },
  ]

  return (
    <>
      <PageBanner
        title="Sitemap"
        crumb="Sitemap"
        subtitle="Navigate the entire MoveLink website from one convenient place."
        image="https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=2000&q=80"
      />

      <section className="section">
        <div className="container-px">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {sections.map((section, i) => (
              <motion.div
                key={section.title}
                variants={fadeUp}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="rounded-3xl border border-lightgray bg-white p-7 shadow-soft"
              >
                <div className="mb-5 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-gradient text-white">
                    <Map className="h-5 w-5" />
                  </span>
                  <h2 className="font-display text-lg font-bold text-navy">{section.title}</h2>
                </div>
                <ul className="space-y-2.5">
                  {section.links.map((link, j) => (
                    <li key={`${link.label}-${j}`}>
                      <Link
                        to={link.to}
                        className="group flex items-center gap-2 text-sm font-medium text-ink/65 transition-colors hover:text-primary-600"
                      >
                        <ChevronRight className="h-4 w-4 text-primary-300 transition-transform group-hover:translate-x-0.5" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
