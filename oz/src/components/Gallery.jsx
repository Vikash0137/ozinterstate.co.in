import { formatImageUrl } from '../utils/urlHelper'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import SectionHeading from './SectionHeading'
import { fetchGallery } from '../services/api'

const aspects = ['aspect-[4/5]', 'aspect-square', 'aspect-square', 'aspect-[4/5]', 'aspect-square', 'aspect-[16/11]']

export default function Gallery() {
  const [gallery, setGallery] = useState([])

  useEffect(() => {
    let mounted = true
    fetchGallery({ _t: Date.now() })
      .then((response) => {
        if (mounted) setGallery(response.data?.success ? response.data.data : [])
      })
      .catch((error) => console.error('Failed to load public gallery:', error))
    return () => { mounted = false }
  }, [])

  const getImageUrl = (image) => formatImageUrl(image)

  return (
    <section className="section relative overflow-hidden bg-mesh-light">
      <div className="container-px relative">
        <SectionHeading
          eyebrow="Our Work"
          title="Moves we're"
          highlight="proud of"
          subtitle="A glimpse into the everyday craftsmanship of our removalist teams across Australia."
        />

        <div className="mx-auto mt-10 max-w-7xl columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
          {gallery.map((item, i) => (
            <motion.figure
              key={item.alt}
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: (i % 3) * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="group relative block break-inside-avoid overflow-hidden rounded-4xl shadow-soft"
            >
              <div className={`${aspects[i % aspects.length]} w-full overflow-hidden`}>
                <img
                  src={getImageUrl(item.image_url)}
                  alt={item.altText || item.title || item.caption || 'Gallery image'}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="pointer-events-none absolute inset-0 rounded-4xl ring-1 ring-inset ring-white/10" />

              <span className="absolute right-4 top-4 flex h-11 w-11 translate-y-2 items-center justify-center rounded-full bg-white/90 text-primary-600 opacity-0 shadow-soft backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <ArrowUpRight className="h-5 w-5" />
              </span>

              <figcaption className="absolute inset-x-0 bottom-0 translate-y-3 p-6 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <span className="text-sm font-semibold text-white">{item.altText || item.title || item.caption || 'Gallery image'}</span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}
