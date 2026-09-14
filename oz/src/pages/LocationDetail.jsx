import { useEffect, useState } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import { Loader2, AlertCircle, MapPin, ArrowLeft } from 'lucide-react'
import LocationSEO from '../components/seo/LocationSEO'
import Hero from '../components/Hero'
import TrustStrip from '../components/TrustStrip'
import About from '../components/About'
import Stats from '../components/Stats'
import Services from '../components/Services'
import LocationCustomSection from '../components/location/LocationCustomSection'
import WhyChooseUs from '../components/WhyChooseUs'
import MovingProcess from '../components/MovingProcess'
import Locations from '../components/Locations'
import Reviews from '../components/Reviews'
import Gallery from '../components/Gallery'
import FAQ from '../components/FAQ'
import Contact from '../components/Contact'
import locationService from '../services/locationService'

export default function LocationDetail() {
  const { slug } = useParams()
  const locationHook = useLocation()

  const [location, setLocation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const isPreview = new URLSearchParams(locationHook.search).get('preview') === 'true'

  useEffect(() => {
    let isMounted = true

    const fetchLocation = async () => {
      try {
        setLoading(true)
        setError(null)

        const result = await locationService.getPublicLocation(slug, isPreview)
        if (!isMounted) return

        if (result?.success && result.data?.location) {
          setLocation(result.data.location)
        } else {
          setLocation(null)
          setError('Location unavailable or not found.')
        }
      } catch (err) {
        if (!isMounted) return
        console.error('Failed to fetch location details:', err)

        // If backend returned a 301 redirect
        if (err.response?.data?.redirectUrl) {
          window.location.replace(err.response.data.redirectUrl)
          return
        }

        setLocation(null)
        setError(err.response?.status === 404 ? 'Location not found' : 'Failed to load location details.')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    if (slug) {
      fetchLocation()
    }

    return () => {
      isMounted = false
    }
  }, [slug, isPreview])

  if (loading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center bg-slate-50 px-4 py-24 text-center">
        <Loader2 className="h-10 w-10 animate-spin text-accent" />
        <p className="mt-4 font-display text-base font-bold text-navy">
          Loading {slug ? slug.replace(/-/g, ' ') : 'location'} details...
        </p>
      </div>
    )
  }

  if (!location || error) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center bg-slate-50 px-4 py-24 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-red-100 text-red-600">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h2 className="mt-5 font-display text-3xl font-extrabold text-navy">
          {error || 'Location Not Found'}
        </h2>
        <p className="mt-2 max-w-md text-sm text-slate-600">
          We couldn't find the service location you were looking for. Please check our nationwide directory for available hubs.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/locations"
            className="inline-flex items-center gap-2 rounded-2xl bg-accent px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all hover:bg-sky-700"
          >
            <MapPin className="h-4 w-4" />
            Explore All Locations
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-6 py-3 text-xs font-bold uppercase tracking-wider text-navy shadow-sm transition-all hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Centralized SEO & Structured Schema */}
      <LocationSEO location={location} isPreview={isPreview} />

      {/* Preview Mode Notice */}
      {isPreview && (
        <div className="sticky top-0 z-50 bg-amber-500 py-2.5 text-center text-xs font-extrabold uppercase tracking-wider text-white shadow-md">
          ⚠️ Preview Mode — Unpublished Location Draft
        </div>
      )}

      {/* Hero Section (H1, H2 subtitle, description, and admin heroImage) */}
      <Hero location={location} />

      {/* Trust Strip */}
      <TrustStrip location={location} />

      {/* Location About Us & Local Story Section (Admin configured title, description, and image) */}
      <About location={location} />

      {/* Stats Counter */}
      <Stats location={location} />

      {/* Services Grid */}
      <Services location={location} />

      {/* Extra Custom Section (Admin configured title, subtitle, content, and image) */}
      <LocationCustomSection location={location} />

      {/* Why Choose Us */}
      <WhyChooseUs location={location} />

      {/* Moving Process */}
      <MovingProcess location={location} />

      {/* Connected Capital Hubs */}
      <Locations location={location} />

      {/* Reviews */}
      <Reviews location={location} />

      {/* Gallery */}
      <Gallery location={location} />

      {/* Location FAQs (Admin configured questions and answers) */}
      <FAQ location={location} />

      {/* Contact Section */}
      <Contact location={location} />
    </>
  )
}
