import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { ClipboardList, CalendarCheck, PackageOpen, Truck, PartyPopper } from 'lucide-react'
import SectionHeading from './SectionHeading'
import { fetchProcessSteps } from '../services/api'

const icons = [ClipboardList, CalendarCheck, PackageOpen, Truck, PartyPopper]

export default function MovingProcess() {
  const [steps, setSteps] = useState([])

  useEffect(() => {
    let mounted = true
    fetchProcessSteps({ _t: Date.now() })
      .then((response) => {
        const data = response.data
        if (mounted && data.success && Array.isArray(data.data)) {
          setSteps(data.data.map((step) => ({
            step: String(step.stepNumber).padStart(2, '0'),
            title: step.title,
            desc: step.description,
            icon: step.icon,
          })))
        }
      })
      .catch((error) => console.error('Failed to load public process steps:', error))
    return () => { mounted = false }
  }, [])

  return (
    <section className="section relative overflow-hidden bg-navy-gradient text-white">
      <div className="pointer-events-none absolute inset-0 bg-mesh-dark opacity-70" />
      <div className="pointer-events-none absolute inset-0 bg-grid-lines-light opacity-50" />
      <div className="pointer-events-none absolute -top-20 right-10 h-72 w-72 animate-aurora rounded-full bg-accent/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-10 h-72 w-72 animate-aurora rounded-full bg-primary-500/20 blur-3xl [animation-delay:-6s]" />

      <div className="container-px relative">
        <SectionHeading
          light
          eyebrow="How It Works"
          title="Your move in"
          highlight="5 simple steps"
          subtitle="A clear, transparent process designed to take the stress out of moving — from first quote to final delivery."
        />

        <div className="relative mx-auto mt-12 max-w-3xl">
          {/* central vertical line */}
          <div className="absolute bottom-0 left-7 top-0 w-px bg-gradient-to-b from-transparent via-white/25 to-transparent sm:left-1/2 sm:-translate-x-1/2" />

          <div className="space-y-6 sm:space-y-0">
            {steps.map((step, i) => {
              const Icon = icons[i]
              const isRight = i % 2 === 1
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className={`relative flex items-start gap-5 sm:block sm:w-1/2 sm:pb-8 ${
                    isRight ? 'sm:ml-auto sm:pl-12' : 'sm:pr-12 sm:text-right'
                  }`}
                >
                  {/* Node */}
                  <div
                    className={`relative z-10 shrink-0 sm:absolute sm:top-0 ${
                      isRight ? 'sm:-left-7' : 'sm:-right-7'
                    }`}
                  >
                    <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md ring-1 ring-white/20">
                      <span className="absolute inset-0 rounded-2xl bg-accent/30 blur-md" />
                      <Icon className="relative h-6 w-6 text-accent" />
                      <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-blue-gradient text-[11px] font-extrabold text-white shadow-soft">
                        {step.step}
                      </span>
                    </div>
                  </div>

                  {/* Card */}
                  <div className="min-w-0 w-full rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-md transition-colors duration-300 hover:border-white/25">
                    <h3 className="font-display text-lg font-bold">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/70">{step.desc}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
