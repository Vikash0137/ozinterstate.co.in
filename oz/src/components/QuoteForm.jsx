import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Navigation, Calendar, Home, Phone, ArrowRight, CheckCircle2 } from 'lucide-react'
import { PROPERTY_SIZES } from '../data/siteData'

export default function QuoteForm({ variant = 'glass' }) {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    from: '',
    to: '',
    date: '',
    size: '',
    phone: '',
  })

  const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 4500)
    setForm({ from: '', to: '', date: '', size: '', phone: '' })
  }

  const dark = variant === 'glass'

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={
        dark
          ? 'glass-dark rounded-4xl p-6 shadow-card sm:p-8'
          : 'card-gradient-border rounded-4xl bg-white p-6 shadow-card sm:p-8'
      }
    >
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-gradient text-white shadow-soft">
          <Navigation className="h-5 w-5" />
        </span>
        <div>
          <h3 className={`font-display text-lg font-bold ${dark ? 'text-white' : 'text-navy'}`}>
            Get an Instant Quote
          </h3>
          <p className={`text-xs ${dark ? 'text-white/60' : 'text-ink/50'}`}>Free & no obligation</p>
        </div>
      </div>

      {submitted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`flex flex-col items-center gap-3 rounded-3xl px-6 py-10 text-center ${
            dark ? 'bg-white/10' : 'bg-primary-50'
          }`}
        >
          <CheckCircle2 className="h-12 w-12 text-accent" />
          <p className={`font-display text-lg font-bold ${dark ? 'text-white' : 'text-navy'}`}>
            Thank you! Quote request received.
          </p>
          <p className={`text-sm ${dark ? 'text-white/70' : 'text-ink/60'}`}>
            Our team will call you within 30 minutes during business hours.
          </p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <Field dark={dark} icon={MapPin} label="Moving From">
            <input
              required
              name="from"
              value={form.from}
              onChange={update}
              placeholder="e.g. Melbourne"
              className="quote-input"
            />
          </Field>
          <Field dark={dark} icon={Navigation} label="Moving To">
            <input
              required
              name="to"
              value={form.to}
              onChange={update}
              placeholder="e.g. Sydney"
              className="quote-input"
            />
          </Field>
          <Field dark={dark} icon={Calendar} label="Moving Date">
            <input
              required
              type="date"
              name="date"
              value={form.date}
              onChange={update}
              className="quote-input"
            />
          </Field>
          <Field dark={dark} icon={Home} label="Property Size">
            <select required name="size" value={form.size} onChange={update} className="quote-input">
              <option value="" disabled>
                Select size
              </option>
              {PROPERTY_SIZES.map((s) => (
                <option key={s} value={s} className="text-navy">
                  {s}
                </option>
              ))}
            </select>
          </Field>
          <div className="sm:col-span-2">
            <Field dark={dark} icon={Phone} label="Phone Number">
              <input
                required
                type="tel"
                name="phone"
                value={form.phone}
                onChange={update}
                placeholder="04XX XXX XXX"
                className="quote-input"
              />
            </Field>
          </div>

          <button type="submit" className="btn-primary mt-1 w-full sm:col-span-2">
            Get Instant Quote
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      )}

      <style>{`
        .quote-input {
          width: 100%;
          background: transparent;
          font-size: 0.9rem;
          font-weight: 600;
          color: ${dark ? '#fff' : '#0F172A'};
          outline: none;
        }
        .quote-input::placeholder { color: ${dark ? 'rgba(255,255,255,0.45)' : 'rgba(15,23,42,0.4)'}; font-weight: 500; }
        .quote-input option { color: #0F172A; }
        .quote-input::-webkit-calendar-picker-indicator { filter: ${dark ? 'invert(1)' : 'none'}; opacity: 0.6; }
      `}</style>
    </motion.div>
  )
}

function Field({ dark, icon: Icon, label, children }) {
  return (
    <label
      className={`flex items-center gap-3 rounded-2xl border px-3.5 py-2.5 transition-colors focus-within:border-accent ${
        dark ? 'border-white/15 bg-white/5' : 'border-lightgray bg-light'
      }`}
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
          dark ? 'bg-white/10 text-accent' : 'bg-white text-primary-600 shadow-soft'
        }`}
      >
        <Icon className="h-4 w-4" />
      </span>
      <span className="flex w-full flex-col">
        <span className={`text-[10px] font-bold uppercase tracking-wider ${dark ? 'text-white/50' : 'text-ink/40'}`}>
          {label}
        </span>
        {children}
      </span>
    </label>
  )
}
