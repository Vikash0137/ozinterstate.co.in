import { formatImageUrl } from '../utils/urlHelper'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Calendar, Clock, ArrowUpRight, Tag } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageBanner from '../components/PageBanner'
import SectionHeading from '../components/SectionHeading'
import { fetchBlogs } from '../services/api'
import { fadeUp } from '../utils/motion'

export default function Blogs() {
  const [blogs, setBlogs] = useState([])

  useEffect(() => {
    let mounted = true
    fetchBlogs({ _t: Date.now() })
      .then((response) => {
        if (mounted) setBlogs(response.data?.success ? response.data.data : [])
      })
      .catch((error) => console.error('Failed to load public blogs:', error))
    return () => { mounted = false }
  }, [])

  const [featured, ...rest] = blogs

  const getImageUrl = (image) => formatImageUrl(image)
  const formatDate = (date) => date ? new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : ''

  return (
    <>
      <PageBanner
        title="Our Blogs"
        crumb="Our Blogs"
        subtitle="Expert moving tips, packing guides and industry insights to help you move smarter."
        image="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=2000&q=80"
      />

      {!featured ? (
        <section className="section">
          <div className="container-px text-center">
            <SectionHeading
              eyebrow="Latest Articles"
              title="Moving advice is on the way"
              subtitle="Published moving tips, packing guides and company updates will appear here."
            />
          </div>
        </section>
      ) : (
        <>
      {/* Featured */}
      <section className="section">
        <div className="container-px">
          <motion.article
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mx-auto grid max-w-7xl grid-cols-1 gap-8 overflow-hidden rounded-4xl bg-white shadow-card lg:grid-cols-2"
          >
            <div className="relative min-h-[280px] overflow-hidden">
              <img src={getImageUrl(featured.image)} alt={featured.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
              <span className="absolute left-5 top-5 rounded-full bg-blue-gradient px-4 py-1.5 text-xs font-bold text-white">
                Featured
              </span>
            </div>
            <div className="flex flex-col justify-center p-8 lg:p-10">
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-ink/50">
                <span className="inline-flex items-center gap-1.5 text-primary-600">
                  <Tag className="h-3.5 w-3.5" />
                  {featured.category}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(featured.publishedAt || featured.created_at)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {featured.readTime}
                </span>
              </div>
              <h2 className="mt-4 font-display text-2xl font-extrabold text-navy sm:text-3xl">{featured.title}</h2>
              <p className="mt-4 leading-relaxed text-ink/65">{featured.excerpt || featured.summary}</p>
              <Link to="/blogs" className="btn-primary mt-7 w-fit">
                Read Article
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.article>
        </div>
      </section>

      {/* Grid */}
      <section className="section -mt-16 pt-0">
        <div className="container-px">
          <SectionHeading eyebrow="Latest Articles" title="From the MoveLink Blog" />
          <div className="mx-auto mt-14 grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post, i) => (
              <motion.article
                key={post.slug}
                variants={fadeUp}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                whileHover={{ y: -8 }}
                className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-soft transition-shadow hover:shadow-card"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={getImageUrl(post.image)}
                    alt={post.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-primary-600 backdrop-blur">
                    {post.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-4 text-xs font-medium text-ink/45">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(post.publishedAt || post.created_at)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="mt-3 font-display text-lg font-bold leading-snug text-navy group-hover:text-primary-600">
                    {post.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/60">{post.excerpt || post.summary}</p>
                  <Link
                    to="/blogs"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary-600 hover:text-accent"
                  >
                    Read More
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
        </>
      )}
    </>
  )
}
