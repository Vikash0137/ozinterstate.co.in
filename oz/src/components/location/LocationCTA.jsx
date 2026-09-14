import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, Mail, Send, CheckCircle2, ShieldCheck, Sparkles, MessageSquare } from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'
import { resolveApiBaseUrl } from '../../utils/siteSettings'

const API_BASE_URL = resolveApiBaseUrl()

export default function LocationCTA({ location = {} }) {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    movingFrom: location.city || location.name || '',
    movingTo: '',
    movingDate: '',
    propertyType: 'House',
    serviceType: 'Interstate Moving',
    customerMessage: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    // Capture URL params for UTM lead attribution
    const searchParams = new URLSearchParams(window.location.search)
    const utmSource = searchParams.get('utm_source') || ''
    const utmMedium = searchParams.get('utm_medium') || ''
    const utmCampaign = searchParams.get('utm_campaign') || ''
    const utmTerm = searchParams.get('utm_term') || ''
    const utmContent = searchParams.get('utm_content') || ''

    const payload = {
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      customerPhone: formData.customerPhone,
      movingFrom: {
        address: formData.movingFrom,
        suburb: formData.movingFrom,
        state: location.state || '',
        postcode: '',
      },
      movingTo: {
        address: formData.movingTo,
        suburb: formData.movingTo,
        state: '',
        postcode: '',
      },
      movingDate: formData.movingDate ? new Date(formData.movingDate) : new Date(Date.now() + 86400000 * 7),
      propertyType: formData.propertyType,
      serviceType: formData.serviceType,
      customerMessage: formData.customerMessage,
      source: 'location_page',
      locationId: location._id || null,
      locationSlug: location.slug || '',
      locationName: location.name || '',
      landingPage: window.location.href,
      referrer: document.referrer || '',
      utmSource,
      utmMedium,
      utmCampaign,
      utmTerm,
      utmContent,
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/quotes`, payload)
      if (response.data?.success) {
        setSubmitted(true)
        toast.success(`Quote request for ${location.name} received! Our team will contact you shortly.`)
      } else {
        toast.success('Inquiry submitted successfully!')
        setSubmitted(true)
      }
    } catch (error) {
      console.error('Error submitting location quote:', error)
      // Fallback: try inquiry submit endpoint
      try {
        await axios.post(`${API_BASE_URL}/inquiries/submit`, {
          ...payload,
          name: formData.customerName,
          email: formData.customerEmail,
          phone: formData.customerPhone,
          message: formData.customerMessage,
        })
        setSubmitted(true)
        toast.success('Quote request submitted!')
      } catch (err2) {
        toast.error('Failed to submit quote request. Please call us directly.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="quote" className="relative overflow-hidden bg-navy py-16 sm:py-24 text-white">
      <div className="pointer-events-none absolute inset-0 bg-mesh-dark opacity-60" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />

      <div className="container-px relative mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left Column - Direct Action Info */}
          <div className="lg:col-span-5">
            <span className="inline-block rounded-full bg-accent/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-sky-300">
              Instant Fixed Quote
            </span>
            <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              {location.ctaTitle || `Book Your ${location.name} Move Today`}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-300">
              {location.ctaDescription ||
                `Get an accurate, no-obligation estimate from Australia's premier interstate removalists. Fast turnaround and transparent pricing guaranteed.`}
            </p>

            {/* Direct Contact Cards */}
            <div className="mt-8 space-y-4">
              {location.phone && (
                <a
                  href={`tel:${location.phone.replace(/\s+/g, '')}`}
                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition-all hover:bg-white/10"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-white shadow-md">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-300">Call Direct ({location.name})</span>
                    <p className="font-display text-base font-bold text-white">{location.phone}</p>
                  </div>
                </a>
              )}

              {location.whatsappNumber && (
                <a
                  href={`https://wa.me/${location.whatsappNumber.replace(/[^0-9]/g, '')}?text=Hi%20OZ%20Interstate,%20I'd%20like%20a%20quote%20for%20${encodeURIComponent(location.name)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 backdrop-blur-md transition-all hover:bg-emerald-500/20"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-xs text-emerald-300">Chat on WhatsApp</span>
                    <p className="font-display text-base font-bold text-white">Instant WhatsApp Chat</p>
                  </div>
                </a>
              )}
            </div>

            {/* Trust highlights */}
            <div className="mt-8 flex flex-wrap gap-4 text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Transit Insurance Included
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-sky-400" />
                Zero Hidden Charges
              </span>
            </div>
          </div>

          {/* Right Column - RFQ Lead Form */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
              {submitted ? (
                <div className="py-12 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                  <h3 className="mt-4 font-display text-2xl font-bold text-white">
                    Thank You, {formData.customerName}!
                  </h3>
                  <p className="mt-2 text-sm text-slate-300">
                    Your {location.name} quote request has been received. One of our moving coordinators will contact you within 15 minutes.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false)
                      setFormData({
                        customerName: '',
                        customerEmail: '',
                        customerPhone: '',
                        movingFrom: location.city || location.name || '',
                        movingTo: '',
                        movingDate: '',
                        propertyType: 'House',
                        serviceType: 'Interstate Moving',
                        customerMessage: '',
                      })
                    }}
                    className="mt-6 inline-flex rounded-xl bg-accent px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-sky-700"
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="font-display text-xl font-bold text-white">
                    Request Fast Estimate for {location.name}
                  </h3>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-300">Full Name *</label>
                      <input
                        type="text"
                        name="customerName"
                        required
                        value={formData.customerName}
                        onChange={handleChange}
                        placeholder="John Smith"
                        className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-300">Phone Number *</label>
                      <input
                        type="tel"
                        name="customerPhone"
                        required
                        value={formData.customerPhone}
                        onChange={handleChange}
                        placeholder="0400 000 000"
                        className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-300">Email Address *</label>
                      <input
                        type="email"
                        name="customerEmail"
                        required
                        value={formData.customerEmail}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-300">Moving Date</label>
                      <input
                        type="date"
                        name="movingDate"
                        value={formData.movingDate}
                        onChange={handleChange}
                        className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-300">Moving From (Suburb/City)</label>
                      <input
                        type="text"
                        name="movingFrom"
                        value={formData.movingFrom}
                        onChange={handleChange}
                        placeholder="e.g. Melbourne"
                        className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-300">Moving To (Suburb/City)</label>
                      <input
                        type="text"
                        name="movingTo"
                        value={formData.movingTo}
                        onChange={handleChange}
                        placeholder="e.g. Sydney, Brisbane..."
                        className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-300">Additional Notes / Inventory</label>
                    <textarea
                      name="customerMessage"
                      rows={2}
                      value={formData.customerMessage}
                      onChange={handleChange}
                      placeholder="e.g. 3-bedroom house with piano, moving late this month..."
                      className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-gradient py-4 text-sm font-extrabold uppercase tracking-wider text-white shadow-float transition-all hover:scale-[1.01] hover:shadow-glow-accent disabled:opacity-60"
                  >
                    <Sparkles className="h-4 w-4" />
                    {submitting ? 'Submitting Estimate Request...' : location.ctaButtonText || 'Calculate Free Estimate'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
