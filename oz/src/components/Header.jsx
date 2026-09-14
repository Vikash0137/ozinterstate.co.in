import { useEffect, useState, useRef } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X, Search, ArrowUpRight, Phone, ChevronDown, Sparkles, ArrowRight } from 'lucide-react'
import Logo from './Logo'
import { useSiteSettings } from '../context/SiteContext'
import { NAV_LINKS as DEFAULT_NAV, COMPANY as DEFAULT_COMPANY, SERVICES as DEFAULT_SERVICES } from '../data/siteData'
import { fetchServices } from '../services/api'
import { getIcon } from '../utils/iconMap'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [servicesList, setServicesList] = useState(DEFAULT_SERVICES)
  const location = useLocation()
  const navigate = useNavigate()
  const { siteSettings } = useSiteSettings()
  const dropdownTimeoutRef = useRef(null)

  const navLinks = siteSettings?.navigationItems?.length > 0 ? siteSettings.navigationItems : DEFAULT_NAV
  const company = siteSettings || DEFAULT_COMPANY

  useEffect(() => {
    fetchServices({ _t: Date.now() })
      .then((res) => {
        if (res.data?.success && Array.isArray(res.data.data)) {
          setServicesList(res.data.data)
        }
      })
      .catch((err) => console.error('Header services fetch error:', err))
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setSearchOpen(false)
    setServicesDropdownOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const handleMouseEnterServices = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current)
    setServicesDropdownOpen(true)
  }

  const handleMouseLeaveServices = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setServicesDropdownOpen(false)
    }, 200)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    const query = searchQuery.toLowerCase().trim()
    const matchedService = servicesList.find((s) => s.title.toLowerCase().includes(query) || s.slug.includes(query))
    if (matchedService) {
      navigate(`/service/${matchedService.slug}`)
    } else {
      navigate(`/services`)
    }
    setSearchOpen(false)
    setSearchQuery('')
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? 'py-2' : 'py-4'
      }`}
    >
      <div className="container-px">
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-full px-4 py-2.5 transition-all duration-500 ${
            scrolled
              ? 'bg-white/85 backdrop-blur-xl border border-white/60 shadow-soft'
              : 'bg-white/40 backdrop-blur-md border border-white/30'
          }`}
        >
          <Logo />

          {/* Center pill menu */}
          <nav className="hidden lg:block">
            <ul className="flex items-center gap-1 rounded-full bg-white/60 p-1.5 shadow-inner ring-1 ring-primary-100/60 backdrop-blur">
              {navLinks.map((link) => {
                const isServices =
                  link.url === '/services' ||
                  link.to === '/services' ||
                  link.label?.toLowerCase() === 'services' ||
                  link.label?.toLowerCase() === 'our services'

                if (isServices) {
                  return (
                    <li
                      key={link.url || link.to}
                      className="relative"
                      onMouseEnter={handleMouseEnterServices}
                      onMouseLeave={handleMouseLeaveServices}
                    >
                      <NavLink
                        to={link.url || link.to}
                        className={({ isActive }) =>
                          `relative flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-300 ${
                            isActive ? 'text-white' : 'text-navy/80 hover:text-primary-600'
                          }`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            {isActive && (
                              <motion.span
                                layoutId="nav-pill"
                                className="absolute inset-0 -z-10 rounded-full bg-blue-gradient shadow-soft"
                                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                              />
                            )}
                            <span>{link.label}</span>
                            <ChevronDown
                              className={`h-3.5 w-3.5 transition-transform duration-300 ${
                                servicesDropdownOpen ? 'rotate-180' : ''
                              }`}
                            />
                          </>
                        )}
                      </NavLink>

                      {/* Services Mega Dropdown */}
                      <AnimatePresence>
                        {servicesDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 12, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.96 }}
                            transition={{ duration: 0.2 }}
                            className="absolute left-1/2 top-full -translate-x-1/2 pt-3 z-50 w-[580px]"
                          >
                            <div className="rounded-3xl border border-slate-200/80 bg-white/95 p-5 shadow-2xl backdrop-blur-2xl">
                              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <span className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-accent">
                                  <Sparkles className="h-3.5 w-3.5" />
                                  Removalist Solutions
                                </span>
                                <Link
                                  to="/services"
                                  className="inline-flex items-center gap-1 text-xs font-bold text-primary-600 hover:text-navy"
                                >
                                  View All Services
                                  <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                              </div>

                              <div className="mt-3 grid grid-cols-2 gap-2">
                                {servicesList.slice(0, 6).map((svc) => (
                                  <Link
                                    key={svc.slug}
                                    to={`/service/${svc.slug}`}
                                    className="group flex items-start gap-3 rounded-2xl p-3 transition-colors hover:bg-primary-50/80"
                                  >
                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition-colors group-hover:bg-blue-gradient group-hover:text-white">
                                      {getIcon(svc.icon, { className: 'h-5 w-5' })}
                                    </span>
                                    <div>
                                      <p className="font-display text-sm font-bold text-navy group-hover:text-primary-600">
                                        {svc.title}
                                      </p>
                                      <p className="line-clamp-1 text-[11px] text-slate-500">
                                        {svc.short_description || svc.desc || 'Professional moving services'}
                                      </p>
                                    </div>
                                  </Link>
                                ))}
                              </div>

                              <div className="mt-4 rounded-2xl bg-slate-50 p-3.5 flex items-center justify-between border border-slate-100">
                                <div>
                                  <p className="text-xs font-bold text-navy">Need an Instant Moving Quote?</p>
                                  <p className="text-[11px] text-slate-500">Fixed-price guaranteed estimates in minutes.</p>
                                </div>
                                <Link to="/contact" className="btn-primary !px-4 !py-2 !text-xs">
                                  Get Quote
                                </Link>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </li>
                  )
                }

                return (
                  <li key={link.url || link.to}>
                    <NavLink
                      to={link.url || link.to}
                      className={({ isActive }) =>
                        `relative block rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-300 ${
                          isActive ? 'text-white' : 'text-navy/80 hover:text-primary-600'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <motion.span
                              layoutId="nav-pill"
                              className="absolute inset-0 -z-10 rounded-full bg-blue-gradient shadow-soft"
                              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                            />
                          )}
                          {link.label}
                        </>
                      )}
                    </NavLink>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen((s) => !s)}
              aria-label="Search"
              aria-expanded={searchOpen}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-primary-100 bg-white text-primary-600 transition-all hover:bg-primary-50 hover:shadow-soft"
            >
              <Search className="h-5 w-5" />
            </button>

            <Link to="/contact" className="hidden btn-primary !px-5 !py-2.5 sm:inline-flex">
              Get Quote
              <ArrowUpRight className="h-4 w-4" />
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-primary-100 bg-white text-navy lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Search bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mx-auto mt-2 max-w-7xl"
            >
              <form onSubmit={handleSearchSubmit} className="glass flex items-center gap-3 rounded-full px-5 py-3 shadow-xl">
                <Search className="h-5 w-5 text-primary-600 shrink-0" />
                <input
                  type="search"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search services (e.g. house removalists, interstate moving, storage)…"
                  className="w-full bg-transparent text-sm text-navy placeholder:text-ink/40 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  aria-label="Close search"
                  className="text-ink/50 hover:text-navy"
                >
                  <X className="h-5 w-5" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-navy/40 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
              className="fixed inset-y-0 right-0 z-50 flex w-[88%] max-w-sm flex-col overflow-y-auto bg-white p-6 shadow-card lg:hidden"
            >
              <div className="flex items-center justify-between">
                <Logo />
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-primary-100 text-navy"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="mt-8 flex flex-col gap-1.5">
                {navLinks.map((link, i) => {
                  const isServices =
                    link.url === '/services' ||
                    link.to === '/services' ||
                    link.label?.toLowerCase() === 'services' ||
                    link.label?.toLowerCase() === 'our services'

                  if (isServices) {
                    return (
                      <div key={link.url || link.to} className="space-y-1">
                        <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-2.5">
                          <NavLink
                            to="/services"
                            className="text-base font-bold text-navy hover:text-primary-600"
                            onClick={() => setMobileOpen(false)}
                          >
                            Our Services
                          </NavLink>
                          <button
                            type="button"
                            onClick={() => setMobileServicesOpen((prev) => !prev)}
                            className="p-1 text-slate-500 hover:text-navy"
                            aria-label="Toggle Services"
                          >
                            <ChevronDown
                              className={`h-5 w-5 transition-transform duration-300 ${
                                mobileServicesOpen ? 'rotate-180' : ''
                              }`}
                            />
                          </button>
                        </div>

                        {mobileServicesOpen && (
                          <div className="ml-3 space-y-1 border-l-2 border-primary-100 pl-3 pt-1">
                            {servicesList.map((svc) => (
                              <NavLink
                                key={svc.slug}
                                to={`/service/${svc.slug}`}
                                onClick={() => setMobileOpen(false)}
                                className={({ isActive }) =>
                                  `flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition-colors ${
                                    isActive ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50 hover:text-navy'
                                  }`
                                }
                              >
                                {getIcon(svc.icon, { className: 'h-4 w-4 text-primary-600' })}
                                <span>{svc.title}</span>
                              </NavLink>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  }

                  return (
                    <motion.div
                      key={link.url || link.to}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.08 + i * 0.05 }}
                    >
                      <NavLink
                        to={link.url || link.to}
                        onClick={() => setMobileOpen(false)}
                        className={({ isActive }) =>
                          `block rounded-2xl px-4 py-3.5 text-base font-semibold transition-colors ${
                            isActive ? 'bg-blue-gradient text-white shadow-soft' : 'text-navy hover:bg-primary-50'
                          }`
                        }
                      >
                        {link.label}
                      </NavLink>
                    </motion.div>
                  )
                })}
              </nav>

              <div className="mt-auto space-y-3 pt-6 border-t border-slate-100">
                <Link to="/contact" onClick={() => setMobileOpen(false)} className="btn-primary w-full">
                  Get Free Moving Quote
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <a href={company.phoneHref} className="btn-ghost w-full">
                  <Phone className="h-4 w-4" />
                  {company.phone}
                </a>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
