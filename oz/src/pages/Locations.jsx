import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  MapPin,
  Search,
  ArrowRight,
  CheckCircle2,
  PhoneCall,
  Sparkles,
  Truck,
  Building2,
  Globe2,
} from 'lucide-react'
import PageBanner from '../components/PageBanner'
import locationService from '../services/locationService'

const STATES = ['All', 'NSW', 'VIC', 'QLD', 'SA', 'WA', 'ACT', 'TAS']

export default function Locations() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedState, setSelectedState] = useState('All')
  const [locationsData, setLocationsData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Set directory document title and meta
    document.title = 'Interstate Moving Locations & Service Areas | OZ-INTERSTATE'

    const fetchLocations = async () => {
      try {
        setLoading(true)
        const result = await locationService.getPublicLocations()
        if (result?.success) {
          setLocationsData(result.data?.locations || [])
        }
      } catch (error) {
        console.error('Failed to load locations:', error)
        setLocationsData([])
      } finally {
        setLoading(false)
      }
    }

    fetchLocations()
  }, [])

  const filteredLocations = useMemo(() => {
    return locationsData.filter((loc) => {
      const matchState =
        selectedState === 'All' ||
        (loc.state && loc.state.toUpperCase() === selectedState.toUpperCase())

      if (!matchState) return false

      if (!searchTerm.trim()) return true
      const q = searchTerm.toLowerCase().trim()
      return (
        (loc.name || '').toLowerCase().includes(q) ||
        (loc.city || '').toLowerCase().includes(q) ||
        (loc.state || '').toLowerCase().includes(q) ||
        (loc.region || '').toLowerCase().includes(q) ||
        (loc.shortDescription || '').toLowerCase().includes(q)
      )
    })
  }, [searchTerm, selectedState, locationsData])

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Directory Page Banner */}
      <PageBanner
        title="Our Interstate Moving Locations"
        crumb="Locations Directory"
        subtitle="Explore our nationwide network of capital city depots, linehaul hubs, and regional transport routes across Australia."
        image="https://images.unsplash.com/photo-1524813686514-a57563d77965?auto=format&fit=crop&w=2000&q=80"
      >
        {/* Search input inside Hero */}
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by city, suburb or state..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-full border border-white/30 bg-white/95 py-3.5 pl-12 pr-10 text-sm font-medium text-slate-900 shadow-xl outline-none backdrop-blur-xl transition-all placeholder:text-slate-500 focus:bg-white focus:ring-4 focus:ring-accent/30"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>
      </PageBanner>

      {/* State Filter Tabs Bar */}
      <div className="border-b border-slate-200 bg-white shadow-sm sticky top-16 z-20">
        <div className="container-px mx-auto flex max-w-7xl items-center justify-between gap-4 py-3 overflow-x-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-1 hidden sm:inline">
              Filter:
            </span>
            {STATES.map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setSelectedState(st)}
                className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all whitespace-nowrap ${
                  selectedState === st
                    ? 'bg-accent text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st === 'All' ? 'All States' : st}
              </button>
            ))}
          </div>

          <span className="text-xs font-semibold text-slate-500 shrink-0">
            Showing <strong className="text-navy">{filteredLocations.length}</strong> {filteredLocations.length === 1 ? 'City' : 'Cities'}
          </span>
        </div>
      </div>

      {/* Locations Grid Section */}
      <section className="py-12 sm:py-16">
        <div className="container-px mx-auto max-w-7xl">
          {loading ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-16 text-center shadow-sm">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-sky-200 border-t-accent" />
              <p className="mt-4 text-sm text-slate-500">Loading service locations from database...</p>
            </div>
          ) : filteredLocations.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-16 text-center shadow-sm">
              <MapPin className="mx-auto h-12 w-12 text-slate-300" />
              <h3 className="mt-4 font-display text-xl font-bold text-navy">
                No location matching "{searchTerm || selectedState}"
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                We operate nationwide linehaul routes even if your specific city is not listed.
              </p>
              <div className="mt-6 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedState('All')
                  }}
                  className="rounded-xl bg-accent px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all hover:bg-sky-700"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
              {filteredLocations.map((loc, idx) => (
                <motion.div
                  key={loc.slug || loc._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.04 }}
                  className="group flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-sky-300 hover:shadow-xl"
                >
                  <div>
                    {/* Header Row: Badge & State */}
                    <div className="mb-4 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        {loc.badge || 'Service Available'}
                      </span>
                      <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-extrabold text-slate-700">
                        {loc.state}
                      </span>
                    </div>

                    {/* Location Name & Icon */}
                    <div className="mb-3 flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-accent transition-colors group-hover:bg-accent group-hover:text-white">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-display text-xl font-extrabold text-navy group-hover:text-accent transition-colors">
                          {loc.name}
                        </h3>
                        <span className="text-xs text-slate-400">Interstate Moving & Freight</span>
                      </div>
                    </div>

                    {/* Short Description */}
                    <p className="mb-4 text-xs leading-relaxed text-slate-600 line-clamp-3">
                      {loc.shortDescription || loc.description || `Specialized interstate removals and scheduled linehaul transport in ${loc.name}.`}
                    </p>

                    {/* Popular Route Pill Preview */}
                    {Array.isArray(loc.popularRoutes) && loc.popularRoutes.length > 0 && (
                      <div className="mb-4 rounded-xl bg-slate-50 p-2.5 text-[11px] font-semibold text-slate-600 border border-slate-100">
                        <div className="flex items-center gap-1 text-slate-400 mb-1 font-bold uppercase text-[10px]">
                          <Truck className="h-3 w-3 text-accent" /> Key Connection
                        </div>
                        <span className="text-navy">{loc.popularRoutes[0]}</span>
                      </div>
                    )}
                  </div>

                  {/* Card Footer: View Location Button */}
                  <div className="border-t border-slate-100 pt-4">
                    <Link
                      to={`/location/${loc.slug}`}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 py-3 text-xs font-bold uppercase tracking-wider text-navy transition-all duration-300 group-hover:bg-blue-gradient group-hover:text-white group-hover:shadow-md"
                    >
                      View {loc.name} Page
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Directory CTA BANNER */}
      <section className="bg-navy py-16 text-white relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-mesh-dark opacity-60" />
        <div className="container-px mx-auto max-w-4xl text-center relative">
          <h2 className="font-display text-3xl font-extrabold sm:text-4xl">
            Don't See Your Specific Town Listed?
          </h2>
          <p className="mt-3 text-base text-slate-300">
            We provide nationwide transport across all Australian states and regional routes. Contact our moving logistics team for a custom quote.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="tel:1300668254"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-3.5 text-xs font-extrabold uppercase tracking-wider text-navy shadow-lg transition-all hover:bg-slate-100"
            >
              <PhoneCall className="h-4 w-4 text-accent" /> Call 1300 668 254
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-2xl bg-blue-gradient px-7 py-3.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-lg transition-all hover:scale-105"
            >
              <Sparkles className="h-4 w-4" /> Get Free Estimate
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
