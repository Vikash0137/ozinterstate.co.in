import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
} from 'lucide-react'
import Logo from './Logo'
import MagneticButton from './ui/MagneticButton'
import { NAV_LINKS, LOCATIONS } from '../data/siteData'
import { fetchServices } from '../services/api'
import locationService from '../services/locationService'
import { useSiteSettings } from '../context/SiteContext'
import { resolveCompanyDetails, resolveSocialUrl } from '../utils/siteSettings'

const FOOTER_SERVICES = [
  { title: 'House Removals', slug: 'house-removals' },
  { title: 'Office Removals', slug: 'moving-your-office' },
  { title: 'Interstate Moving', slug: 'moving-between-australian-states' },
  { title: 'Furniture Removal', slug: 'furniture-removal' },
]

export default function Footer() {
  const [services, setServices] = useState(FOOTER_SERVICES)
  const [locations, setLocations] = useState(LOCATIONS)
  const { siteSettings } = useSiteSettings()
  const company = resolveCompanyDetails(siteSettings)
  const socials = [
    { icon: Facebook, label: 'Facebook', href: resolveSocialUrl(siteSettings, 'facebook') },
    { icon: Instagram, label: 'Instagram', href: resolveSocialUrl(siteSettings, 'instagram') },
    { icon: Linkedin, label: 'LinkedIn', href: resolveSocialUrl(siteSettings, 'linkedin') },
    { icon: Twitter, label: 'Twitter', href: resolveSocialUrl(siteSettings, 'twitter') },
    { icon: Youtube, label: 'YouTube', href: resolveSocialUrl(siteSettings, 'youtube') },
  ]

  useEffect(() => {
    fetchServices({ _t: Date.now() })
      .then((res) => {
        if (res.data?.success && Array.isArray(res.data.data)) {
          setServices(FOOTER_SERVICES.map((footerService) => ({
            ...footerService,
            ...res.data.data.find((service) => service.slug === footerService.slug),
            title: footerService.title,
          })))
        }
      })
      .catch((err) => console.error('Footer services load error:', err))

    locationService.getPublicLocations({ limit: 100 })
      .then((res) => {
        const publicLocations = res?.data?.locations
        if (Array.isArray(publicLocations) && publicLocations.length > 0) {
          setLocations(publicLocations)
        }
      })
      .catch((err) => console.error('Footer locations load error:', err))
  }, [])

  return (
    <footer className="relative mt-10 overflow-hidden bg-navy-gradient text-white">
      <div className="pointer-events-none absolute inset-0 bg-mesh-dark opacity-60" />
      <div className="pointer-events-none absolute inset-0 bg-grid-lines-light opacity-40" />
      <div className="pointer-events-none absolute -top-24 right-0 h-72 w-72 animate-aurora rounded-full bg-accent/20 blur-3xl" />

      {/* CTA banner */}
      <div className="container-px relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto -mb-2 max-w-7xl -translate-y-14 overflow-hidden rounded-5xl bg-blue-gradient p-8 shadow-float sm:p-12"
        >
          <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-dots-light opacity-40" />
          <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <h3 className="font-display text-2xl font-extrabold sm:text-3xl">Ready to Move Interstate?</h3>
              <p className="mt-2 max-w-xl text-white/80">
               Whether you're moving a home, relocating an office or transporting furniture across Australia, we're ready to help.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <MagneticButton to="/contact" variant="light" className="group">
                Get A Free Quote
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </MagneticButton>
              <a
                href={company.phoneHref}
                className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/5 px-7 py-3.5 font-semibold text-white backdrop-blur transition-colors hover:bg-white/10"
              >
                <Phone className="h-4 w-4" />
                {company.phone}
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="container-px relative">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 pb-12 pt-8 sm:pt-12 md:grid-cols-3 lg:grid-cols-6">
          {/* Brand */}
          <div className="col-span-2">
            <Logo light />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/70">
              Premium, fully insured interstate moving across every Australian
              capital. Trusted by thousands of families and businesses.
            </p>
            <div className="mt-6 flex gap-2.5">
              {socials.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition-all hover:-translate-y-1 hover:bg-accent hover:text-white hover:shadow-glow-accent"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <FooterCol title="Quick Links">
            {NAV_LINKS.map((l) => (
              <FooterLink key={l.to} to={l.to}>
                {l.label}
              </FooterLink>
            ))}
            <FooterLink to="/contact">Contact Us</FooterLink>
            <FooterLink to="/locations">Locations</FooterLink>
          </FooterCol>

          {/* Services */}
          <FooterCol title="Services">
            {services.map((s) => (
              <FooterLink key={s.slug} to={`/service/${s.slug}`}>
                {s.title}
              </FooterLink>
            ))}
            <FooterLink to="/services">
              <span className="font-bold text-sky-400">All Services →</span>
            </FooterLink>
          </FooterCol>

          {/* Locations */}
          <FooterCol title="Locations">
            {locations.slice(0, 5).map((location) => {
              const city = location.city || location.name
              const slug = location.slug || city?.toLowerCase().replace(/\s+/g, '-')

              return (
                <FooterLink key={location._id || slug} to={`/location/${slug}`}>
                  {city}, {location.state}
                </FooterLink>
              )
            })}
            <FooterLink to="/locations">
              <span className="font-bold text-sky-400">All Locations →</span>
            </FooterLink>
          </FooterCol>

          {/* Contact */}
          <FooterCol title="Contact Info">
            <li>
              <a href={company.phoneHref} className="flex items-start gap-2.5 text-sm text-white/70 hover:text-white">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                {company.phone}
              </a>
            </li>
            <li>
              <a href={company.emailHref} className="flex items-start gap-2.5 text-sm text-white/70 hover:text-white">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                {company.email}
              </a>
            </li>
            <li>
              <span className="flex items-start gap-2.5 text-sm text-white/70">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                {company.address}
              </span>
            </li>
          </FooterCol>
        </div>

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-white/10 py-7 text-sm text-white/60 sm:flex-row">
          <p>
            © {new Date().getFullYear()} All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/sitemap" className="hover:text-white">Sitemap</Link>
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, children }) {
  return (
    <div>
      <h4 className="mb-4 font-display text-sm font-bold uppercase tracking-[0.16em] text-white/90">{title}</h4>
      <ul className="space-y-2.5">{children}</ul>
    </div>
  )
}

function FooterLink({ to, children }) {
  return (
    <li>
      <Link to={to} className="text-sm text-white/70 transition-colors hover:text-white">
        {children}
      </Link>
    </li>
  )
}
