import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertTriangle,
  User,
  MessageSquare,
} from 'lucide-react'
import SectionHeading from './SectionHeading'
import { fadeUp } from '../utils/motion'
import { submitInquiry } from '../services/api'
import { resolveCompanyDetails, resolveContactValue } from '../utils/siteSettings'
import { useSiteSettings } from '../context/SiteContext'

export default function Contact({ location }) {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const { siteSettings } = useSiteSettings()
  const company = resolveCompanyDetails(siteSettings)

  const phoneValue = location?.phone || resolveContactValue(company, 'phone', '1300 668 254')
  const phoneHref = location?.phone ? `tel:${location.phone.replace(/\s+/g, '')}` : resolveContactValue(company, 'phoneHref', 'tel:1300668254')
  const emailValue = location?.email || resolveContactValue(company, 'email', 'hello@ozinterstate.com.au')
  const emailHref = location?.email ? `mailto:${location.email}` : resolveContactValue(company, 'emailHref', 'mailto:hello@ozinterstate.com.au')
  const addressValue = location?.address || (location?.name ? `${location.name}, ${location.state || 'Australia'}` : resolveContactValue(company, 'address', '24 Logistics Way, Port Melbourne, VIC 3207, Australia'))

  const contactDetails = [
    { icon: Phone, label: 'Call Us', value: phoneValue, href: phoneHref },
    { icon: Mail, label: 'Email Us', value: emailValue, href: emailHref },
    { icon: MapPin, label: 'Visit Us', value: addressValue },
    { icon: Clock, label: 'Working Hours', value: 'Mon–Sat: 7am – 7pm AEST' },
  ]

  const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        ...form,
        source: location ? 'location_page' : 'contact_form',
        locationId: location?._id || null,
        locationSlug: location?.slug || '',
        locationName: location?.name || '',
      }
      const response = await submitInquiry(payload)
      if (!response.data?.success) throw new Error(response.data?.message || 'Submission failed')
      setSent(true)
      setTimeout(() => setSent(false), 5000)
      setForm({ name: '', email: '', phone: '', message: '' })
    } catch (error) {
      console.error('Failed to submit contact enquiry:', error)
    }
  }

  return (
    <section className="section relative overflow-hidden" id="contact">
      <div className="pointer-events-none absolute -left-24 bottom-10 h-80 w-80 rounded-full bg-primary-100/40 blur-3xl" />
      <div className="container-px relative">
        <SectionHeading
          eyebrow="Get In Touch"
          title={location ? `Let's plan your` : `Let's plan`}
          highlight={location ? `${location.name} move` : `your move`}
          subtitle={
            location
              ? `Reach out for a free ${location.name} quote or any questions. Our team responds fast and is ready to make your move effortless.`
              : "Reach out for a free quote or any questions. Our team responds fast and is ready to make your move effortless."
          }
        />

        <div className="mx-auto mt-10 grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Contact info — dark premium panel */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-5xl bg-navy-gradient p-7 text-white shadow-float sm:p-8 lg:col-span-5"
          >
            <div className="pointer-events-none absolute inset-0 bg-mesh-dark opacity-70" />
            <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 animate-aurora rounded-full bg-accent/20 blur-3xl" />

            <div className="relative">
              <h3 className="font-display text-2xl font-bold">Contact information</h3>
              <p className="mt-2 text-sm text-white/65">
                {location ? `Prefer to reach our ${location.name} team directly? Here's how.` : "Prefer to reach us directly? Here's how."}
              </p>

              <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {contactDetails.map(({ icon: Icon, label, value, href }) => {
                  const inner = (
                    <div className="flex h-full flex-col gap-3 rounded-3xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-md transition-colors hover:border-white/25">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-accent ring-1 ring-white/15">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-white/45">{label}</p>
                        <p className="mt-1 text-sm font-semibold text-white">{value}</p>
                      </div>
                    </div>
                  )
                  return href ? (
                    <a key={label} href={href} className="block">
                      {inner}
                    </a>
                  ) : (
                    <div key={label}>{inner}</div>
                  )
                })}
              </div>

              {/* Emergency highlight */}
              <div className="mt-4 flex items-center gap-4 rounded-3xl border border-amber-300/20 bg-amber-300/10 p-5">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-300/15">
                  <AlertTriangle className="h-6 w-6 text-amber-300" />
                </span>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-white/50">24/7 Emergency Line</p>
                  <a href={resolveContactValue(company, 'emergencyPhoneHref', 'tel:0411555880')} className="font-display text-2xl font-extrabold hover:text-accent">
                    {resolveContactValue(company, 'emergencyPhone', '0411 555 880')}
                  </a>
                </div>
              </div>

              {/* Map */}
              <div className="relative mt-4 h-48 overflow-hidden rounded-3xl ring-1 ring-white/10">
                <iframe
                  title="OZ Interstate Movers office location map"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=144.92%2C-37.84%2C144.96%2C-37.82&layer=mapnik`}
                  className="h-full w-full grayscale-[0.3]"
                  loading="lazy"
                />
                <div className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-navy shadow-soft backdrop-blur">
                  <MapPin className="h-4 w-4 text-primary-600" />
                  {location?.name ? `${location.name}, ${location.state || 'AU'}` : 'Port Melbourne, VIC'}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Enquiry form */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="gradient-frame relative rounded-5xl bg-white p-7 shadow-float sm:p-9 lg:col-span-7"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-primary-600 ring-1 ring-primary-100">
              Free Quote
            </span>
            <h3 className="mt-4 font-display text-2xl font-bold text-navy">
              {location ? `Send us a ${location.name} enquiry` : 'Send us an enquiry'}
            </h3>
            <p className="mt-2 text-sm text-ink/55">Fill in the form and we'll get back to you within 30 minutes.</p>

            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 flex flex-col items-center gap-3 rounded-3xl bg-primary-50 px-6 py-14 text-center"
              >
                <CheckCircle2 className="h-14 w-14 text-accent" />
                <p className="font-display text-xl font-bold text-navy">Message sent successfully!</p>
                <p className="text-sm text-ink/60">Thanks for reaching out. Our team will contact you shortly.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <ContactField icon={User} label="Full Name">
                  <input required name="name" value={form.name} onChange={update} placeholder="John Smith" className="contact-input" />
                </ContactField>
                <ContactField icon={Phone} label="Phone">
                  <input required type="tel" name="phone" value={form.phone} onChange={update} placeholder="04XX XXX XXX" className="contact-input" />
                </ContactField>
                <div className="sm:col-span-2">
                  <ContactField icon={Mail} label="Email Address">
                    <input required type="email" name="email" value={form.email} onChange={update} placeholder="you@email.com" className="contact-input" />
                  </ContactField>
                </div>
                <div className="sm:col-span-2">
                  <ContactField icon={MessageSquare} label="How can we help?" align="start">
                    <textarea
                      required
                      name="message"
                      value={form.message}
                      onChange={update}
                      rows={4}
                      placeholder={location ? `Tell us about your ${location.name} move — locations, dates, items…` : "Tell us about your move — locations, dates, items…"}
                      className="contact-input resize-none"
                    />
                  </ContactField>
                </div>
                <button
                  type="submit"
                  className="btn-shine group inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-gradient px-7 py-4 font-semibold text-white shadow-soft transition-shadow duration-300 hover:shadow-glow sm:col-span-2"
                >
                  Send Enquiry
                  <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </form>
            )}

            <style>{`
              .contact-input {
                width: 100%;
                background: transparent;
                font-size: 0.9rem;
                font-weight: 600;
                color: #0F172A;
                outline: none;
              }
              .contact-input::placeholder { color: rgba(15,23,42,0.4); font-weight: 500; }
            `}</style>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function ContactField({ icon: Icon, label, children, align = 'center' }) {
  return (
    <label
      className={`flex gap-3 rounded-2xl border border-lightgray bg-light px-3.5 py-3 transition-all focus-within:border-accent focus-within:bg-white focus-within:shadow-soft ${
        align === 'start' ? 'items-start' : 'items-center'
      }`}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-primary-600 shadow-soft">
        <Icon className="h-4 w-4" />
      </span>
      <span className="flex w-full flex-col">
        <span className="text-[10px] font-bold uppercase tracking-wider text-ink/40">{label}</span>
        {children}
      </span>
    </label>
  )
}
