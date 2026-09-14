import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Target, Eye, Award, Truck, Leaf, ShieldCheck, HeartHandshake } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageBanner from '../components/PageBanner'
import SectionHeading from '../components/SectionHeading'
import Stats from '../components/Stats'
import { fadeUp } from '../utils/motion'
import { fetchTeamMembers } from '../services/api'
import { formatImageUrl } from '../utils/urlHelper'
import { useSiteSettings } from '../context/SiteContext'

const values = [
  { icon: ShieldCheck, title: 'Integrity', desc: 'Honest pricing and transparent communication on every move.' },
  { icon: HeartHandshake, title: 'Care', desc: 'We treat your belongings as if they were our own.' },
  { icon: Award, title: 'Excellence', desc: 'Relentless commitment to quality and customer satisfaction.' },
  { icon: Leaf, title: 'Sustainability', desc: 'Reusable materials and optimised routes to reduce impact.' },
]

export default function CompanyProfile() {
  const [team, setTeam] = useState([])
  const { siteSettings } = useSiteSettings()
  const aboutSection = siteSettings?.aboutSection

  useEffect(() => {
    let mounted = true
    fetchTeamMembers({ _t: Date.now() })
      .then((response) => {
        if (mounted) setTeam(response.data?.success ? response.data.data : [])
      })
      .catch((error) => console.error('Failed to load public team:', error))
    return () => { mounted = false }
  }, [])

  return (
    <>
      <PageBanner
        title="Company Profile"
        crumb="Company Profile"
        subtitle="A decade of moving Australian families and businesses with care, precision and unwavering professionalism."
        image="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=2000&q=80"
      />

      {/* Story */}
      <section className="section">
        <div className="container-px">
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src={formatImageUrl(aboutSection?.image || 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80')}
                alt="MoveLink removalist team preparing a truck"
                className="rounded-4xl shadow-card"
                loading="lazy"
              />
              <div className="absolute -bottom-6 -right-4 flex items-center gap-3 rounded-2xl bg-white p-5 shadow-card sm:-right-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-gradient text-white">
                  <Truck className="h-6 w-6" />
                </span>
                <div>
                  <p className="font-display text-2xl font-extrabold text-navy">10+</p>
                  <p className="text-xs text-ink/55">Years on the road</p>
                </div>
              </div>
            </motion.div>

            <div>
              <SectionHeading
                center={false}
                eyebrow="Our Story"
                title="Moving Australia With Care"
                subtitle="Your Trusted Interstate Removalist"/>
              <div className="mt-5 space-y-4 text-ink/65">
                <p>Moving interstate is a big deal. You're not just changing addresses — you're relocating your family, starting a new chapter, or moving the business you've worked hard to build. When the stakes are that high, you want a removalist you can actually rely on.</p>
                <p>MoveLink offers interstate removalist services for homes, businesses and everyday moving needs, right across Australia.</p>
                <p>Our job is to make your move feel organised and manageable, from the moment we pick up your first box to the moment we set down the last one.</p>
              </div>
              <Link to={aboutSection?.primaryButtonUrl || '/contact'} className="btn-primary mt-7">
                {aboutSection?.primaryButtonText || 'Work With Us'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="section bg-light">
        <div className="container-px">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-2">
            {[
              { icon: Target, title: 'Our Mission', emphasis: 'Making Interstate Moving Easier', text: "We want to take the stress out of long-distance moves. That means clear communication, dependable service, and a team that actually pays attention to what you need.",
                points: [
                  'Stress-Free Moving — Simple and hassle-free interstate moves.',
                  'Trusted Care — Your belongings handled with care.',
                  'Reliable Service — Clear communication and dependable support.',
                ],
               },
              {
                icon: Eye,
                title: 'Our Vision',
                emphasis: 'A Better Way to Move Across Australia',
                text: "We're working to become the removalist people trust for interstate moves — and we're building that reputation on three things:",
                points: [
                  'Reliable service — support you can count on from start to finish.',
                  'Careful handling — your things treated the way you\'d treat them yourself.',
                  'Customer confidence — no confusion, no surprises, just a clear sense of what\'s happening and when.',
                ],
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="card-gradient-border rounded-4xl bg-white p-8 shadow-soft"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-gradient text-white shadow-soft">
                  <item.icon className="h-7 w-7" />
                </span>
                <h3 className="mt-5 font-display text-2xl font-bold text-navy">{item.title}</h3>
                {item.emphasis && <p className="mt-4 font-bold text-navy">{item.emphasis}</p>}
                <p className="mt-3 leading-relaxed text-ink/65">{item.text}</p>
                {item.points && (
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-ink/65">
                    {item.points.map((point) => <li key={point}>{point}</li>)}
                  </ul>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Stats />

      {/* Values */}
      <section className="section">
        <div className="container-px">
          <SectionHeading eyebrow="Our Values" title="What We Stand For" subtitle="The principles that guide every move and every interaction." />
          <div className="mx-auto mt-14 grid max-w-7xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                variants={fadeUp}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                className="rounded-3xl border border-lightgray bg-white p-7 text-center shadow-soft"
              >
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                  <v.icon className="h-7 w-7" />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-navy">{v.title}</h3>
                <p className="mt-2 text-sm text-ink/60">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section bg-light">
        <div className="container-px">
          <SectionHeading eyebrow="Our Team" title="The People Behind Every Move" subtitle="Experienced leaders and dedicated movers committed to your relocation." />
          <div className="mx-auto mt-14 grid max-w-7xl grid-cols-2 gap-5 lg:grid-cols-4">
            {team.map((member, i) => (
              <motion.div
                  key={member._id}
                variants={fadeUp}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="group overflow-hidden rounded-3xl bg-white shadow-soft"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={formatImageUrl(member.image)}
                    alt={member.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5 text-center">
                  <h3 className="font-display font-bold text-navy">{member.name}</h3>
                  <p className="text-sm text-primary-600">{member.designation}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
