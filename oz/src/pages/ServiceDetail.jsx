import { useEffect, useState } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react'
import ServiceSEO from '../components/seo/ServiceSEO'
import ServiceHero from '../components/service/ServiceHero'
import ServiceOverview from '../components/service/ServiceOverview'
import ServiceInclusions from '../components/service/ServiceInclusions'
import ServiceFAQSection from '../components/service/ServiceFAQSection'
import ServiceCTA from '../components/service/ServiceCTA'
import { fetchServiceBySlug } from '../services/api'

export default function ServiceDetail() {
  const { slug } = useParams()
  const locationHook = useLocation()
  const isPreview = new URLSearchParams(locationHook.search).get('preview') === 'true'

  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    const fetchService = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetchServiceBySlug(slug)
        const data = response.data

        if (!isMounted) return

        if (data.success && data.data) {
          setService(data.data)
        } else {
          setService(null)
          setError(data.message || 'Service not found.')
        }
      } catch (err) {
        if (!isMounted) return
        console.error('Failed to load service details:', err)
        setService(null)
        setError('Failed to load service details.')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    if (slug) {
      fetchService()
    }

    return () => {
      isMounted = false
    }
  }, [slug])

  if (loading) {
    return (
      <div className="flex min-h-[75vh] flex-col items-center justify-center bg-slate-50 px-4 py-28 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-accent" />
        <p className="mt-4 font-display text-base font-bold text-navy">
          Loading {slug ? slug.replace(/-/g, ' ') : 'service'} details...
        </p>
        <span className="mt-1 text-xs text-slate-400">Australia's Trusted Interstate Removalists</span>
      </div>
    )
  }

  if (!service || error) {
    return (
      <div className="flex min-h-[75vh] flex-col items-center justify-center bg-slate-50 px-4 py-28 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-red-100 text-red-600 shadow-soft">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h2 className="mt-5 font-display text-3xl font-extrabold text-navy">
          {error || 'Service Not Found'}
        </h2>
        <p className="mt-2 max-w-md text-sm text-slate-600">
          We couldn't find the requested moving service. Please explore our full range of Australian removalist solutions.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 rounded-2xl bg-accent px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all hover:bg-sky-700 hover:shadow-lg"
          >
            <ArrowLeft className="h-4 w-4" /> Back to All Services
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-navy shadow-sm transition-all hover:border-navy"
          >
            Return Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* 1. Dynamic SEO & Google SERP Schema Engine (Admin Tab 5) */}
      <ServiceSEO service={service} isPreview={isPreview} />

      {/* Preview Mode Alert Banner */}
      {isPreview && (
        <div className="sticky top-0 z-50 bg-amber-500 py-2.5 text-center text-xs font-extrabold uppercase tracking-wider text-white shadow-md">
          ⚠️ Preview Mode — Viewing Service Draft
        </div>
      )}

      {/* 2. Dedicated Service Hero Section (Admin Tab 1 + Tab 6) */}
      <ServiceHero service={service} />

      {/* 3. Dedicated Service Scope & Overview Section (Admin Tab 2) */}
      <ServiceOverview service={service} />

      {/* 4. Dedicated Key Features & Capabilities Inclusions Matrix (Admin Tab 3) */}
      <ServiceInclusions service={service} />

      {/* 5. Dedicated Service FAQs Section (Admin Tab 4) */}
      <ServiceFAQSection service={service} />

      {/* 6. Dedicated Service Closing Conversion CTA Section */}
      <ServiceCTA service={service} />
    </>
  )
}
