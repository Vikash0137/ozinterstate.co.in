import { useEffect } from 'react'

export default function ServiceSEO({ service = {}, isPreview = false }) {
  if (!service || !service.slug) return null

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://oz-interstate.com.au'

  const title =
    service.seo?.title ||
    `${service.title} | OZ-INTERSTATE Removalists`

  const metaDescription =
    service.seo?.metaDescription ||
    service.short_description ||
    `Professional ${service.title} services across Australia. Scheduled linehaul, goods-in-transit insurance, and fixed transparent pricing.`

  const canonicalUrl = service.seo?.canonicalUrl || `/service/${service.slug}`
  const robots = isPreview ? 'noindex,nofollow' : service.seo?.robots || (service.status === 'active' ? 'index,follow' : 'noindex,nofollow')
  const ogTitle = service.seo?.ogTitle || title
  const ogDescription = service.seo?.ogDescription || metaDescription
  const rawImage = service.seo?.ogImage || service.image || '/oz-logo.png'
  const ogImage = rawImage.startsWith('http') ? rawImage : `${baseUrl}${rawImage.startsWith('/') ? '' : '/'}${rawImage}`

  useEffect(() => {
    document.title = title

    const setMeta = (name, content, isProperty = false) => {
      if (!content) return
      let el = document.querySelector(`meta[${isProperty ? 'property' : 'name'}="${name}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(isProperty ? 'property' : 'name', name)
        document.head.appendChild(el)
      }
      el.content = content
    }

    setMeta('description', metaDescription)
    setMeta('robots', robots)
    if (service.seo?.keywords?.length > 0) {
      setMeta('keywords', Array.isArray(service.seo.keywords) ? service.seo.keywords.join(', ') : service.seo.keywords)
    }

    // OpenGraph
    setMeta('og:title', ogTitle, true)
    setMeta('og:description', ogDescription, true)
    setMeta('og:url', `${baseUrl}${canonicalUrl}`, true)
    setMeta('og:image', ogImage, true)
    setMeta('og:type', 'service', true)

    // Twitter
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', service.seo?.twitterTitle || ogTitle)
    setMeta('twitter:description', service.seo?.twitterDescription || ogDescription)
    setMeta('twitter:image', ogImage)

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = `${baseUrl}${canonicalUrl}`

    // JSON-LD Service Schema
    const addJsonLD = (schema, id) => {
      if (!schema) return
      let script = document.getElementById(id)
      if (!script) {
        script = document.createElement('script')
        script.id = id
        script.type = 'application/ld+json'
        document.head.appendChild(script)
      }
      script.innerHTML = JSON.stringify(schema)
    }

    const serviceSchema = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: service.title,
      description: metaDescription,
      provider: {
        '@type': 'MovingCompany',
        name: 'OZ Interstate Movers',
        url: baseUrl,
        telephone: '+611300668254',
      },
      areaServed: {
        '@type': 'Country',
        name: 'Australia',
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: service.title,
        itemListElement: (service.features || []).map((feat, idx) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: feat,
          },
        })),
      },
    }
    addJsonLD(serviceSchema, 'service-schema-jsonld')

    // Breadcrumb Schema
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: baseUrl,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Services',
          item: `${baseUrl}/services`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: service.title,
          item: `${baseUrl}${canonicalUrl}`,
        },
      ],
    }
    addJsonLD(breadcrumbSchema, 'service-breadcrumb-schema')

    // FAQs Schema if available
    if (Array.isArray(service.faqs) && service.faqs.length > 0) {
      const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: service.faqs
          .filter((f) => (f.question || f.q) && (f.answer || f.a))
          .map((f) => ({
            '@type': 'Question',
            name: f.question || f.q,
            acceptedAnswer: {
              '@type': 'Answer',
              text: f.answer || f.a,
            },
          })),
      }
      addJsonLD(faqSchema, 'service-faq-schema')
    }

    return () => {
      const scripts = ['service-schema-jsonld', 'service-breadcrumb-schema', 'service-faq-schema']
      scripts.forEach((id) => {
        const s = document.getElementById(id)
        if (s) s.remove()
      })
    }
  }, [service, isPreview, title, metaDescription, canonicalUrl, robots, ogTitle, ogDescription, ogImage, baseUrl])

  return null
}
