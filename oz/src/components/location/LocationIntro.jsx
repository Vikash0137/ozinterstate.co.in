import { motion } from 'framer-motion'
import { MapPin, CheckCircle2, Route, ArrowRight } from 'lucide-react'

export default function LocationIntro({ location = {} }) {
  const city = location.city || location.name || 'Location'

  return (
    <section className="relative overflow-hidden py-16 sm:py-24 bg-white">
      <div className="container-px mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left Column - Intro Content */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3.5 py-1 text-xs font-bold text-accent">
              <MapPin className="h-3.5 w-3.5" />
              <span>Local Service Overview</span>
            </div>

            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
              {location.introTitle || `Trusted Interstate Moving in ${location.name}`}
            </h2>

            <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-600">
              <p>
                {location.introContent ||
                  location.introduction ||
                  `OZ Interstate Movers provides specialized long-haul removalist and freight solutions for residential, corporate, and commercial clients in ${location.name}.`}
              </p>
              {location.mainContent && (
                <p>{location.mainContent}</p>
              )}
            </div>

            {/* Key highlights checklist */}
            {Array.isArray(location.highlights) && location.highlights.length > 0 && (
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {location.highlights.map((hl, idx) => (
                  <div key={idx} className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-navy">{hl.title}</h4>
                      {hl.desc && <p className="mt-0.5 text-xs text-slate-500">{hl.desc}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Popular Routes & Hub Card */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-slate-200/80 bg-slate-50 p-6 shadow-sm sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent text-white shadow-md">
                  <Route className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-navy">
                    Key Routes from {location.name}
                  </h3>
                  <span className="text-xs text-slate-400">Regular Linehaul Schedules</span>
                </div>
              </div>

              {Array.isArray(location.popularRoutes) && location.popularRoutes.length > 0 ? (
                <div className="mt-6 space-y-2.5">
                  {location.popularRoutes.map((route, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-xl bg-white p-3 text-xs font-semibold text-slate-700 shadow-sm border border-slate-100"
                    >
                      <span>{route}</span>
                      <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                        Active
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-6 space-y-2.5">
                  <div className="flex items-center justify-between rounded-xl bg-white p-3 text-xs font-semibold text-slate-700 shadow-sm border border-slate-100">
                    <span>{location.name} ➔ Sydney Linehaul</span>
                    <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600">Daily</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-white p-3 text-xs font-semibold text-slate-700 shadow-sm border border-slate-100">
                    <span>{location.name} ➔ Melbourne Direct</span>
                    <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600">Daily</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-white p-3 text-xs font-semibold text-slate-700 shadow-sm border border-slate-100">
                    <span>{location.name} ➔ Brisbane Corridor</span>
                    <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600">Scheduled</span>
                  </div>
                </div>
              )}

              {/* Service Areas Pill List */}
              {Array.isArray(location.nearbyAreas) && location.nearbyAreas.length > 0 && (
                <div className="mt-6 border-t border-slate-200/60 pt-6">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Areas & Suburbs Served:
                  </span>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {location.nearbyAreas.map((area, idx) => (
                      <span
                        key={idx}
                        className="rounded-lg bg-white border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
