import { useEffect } from 'react'

export default function LocationSEO({ location = {}, isPreview = false }) {
  if (!location || !location.slug) return null

  const city = location.city || location.name || 'Location'
  const state = location.state || 'Australia'
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://oz-interstate.com.au'

  // Apply SEO data with fallbacks
  const seo = {
    title: location.seo?.title || `Interstate Removalists ${location.name} | OZ-INTERSTATE`,
    metaDescription:
      location.seo?.metaDescription ||
      `Reliable interstate removalists and freight services in ${location.name}, ${state}. Fixed rates & comprehensive transit insurance.`,
    keywords:
      location.seo?.keywords?.length > 0
        ? location.seo.keywords
        : [`interstate removalists ${city}`, `removalists ${city}`, `freight ${city}`, 'interstate freight'],
    h1: location.seo?.h1 || location.heroTitle || `Interstate Removalists in ${location.name}`,
    canonicalUrl: location.seo?.canonicalUrl || `/location/${location.slug}`,
    robots: isPreview ? 'noindex,nofollow' : location.seo?.robots || (location.isPublished ? 'index,follow' : 'noindex,nofollow'),
    ogTitle: location.seo?.ogTitle || location.seo?.title || `Interstate Removalists ${location.name} | OZ-INTERSTATE`,
    ogDescription: location.seo?.ogDescription || location.seo?.metaDescription,
    ogImage: location.seo?.ogImage || location.heroImage || '/oz-logo.png',
    twitterTitle: location.seo?.twitterTitle || location.seo?.ogTitle || location.seo?.title || `Interstate Removalists ${location.name}`,
    twitterDescription: location.seo?.twitterDescription || location.seo?.ogDescription || location.seo?.metaDescription,
    twitterImage: location.seo?.twitterImage || location.seo?.ogImage || location.heroImage || '/oz-logo.png',
    breadcrumbName: location.seo?.breadcrumbName || location.name,
  }

  useEffect(() => {
    // Set document title
    document.title = seo.title

    // Helper to set/update meta tag
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

    // Set basic meta tags
    setMeta('description', seo.metaDescription)
    setMeta('keywords', Array.isArray(seo.keywords) ? seo.keywords.join(', ') : seo.keywords)
    setMeta('robots', seo.robots)

    // Set OpenGraph tags
    setMeta('og:title', seo.ogTitle, true)
    setMeta('og:description', seo.ogDescription, true)
    setMeta('og:url', `${baseUrl}${seo.canonicalUrl}`, true)
    const fullOgImage = seo.ogImage.startsWith('http') ? seo.ogImage : `${baseUrl}${seo.ogImage.startsWith('/') ? '' : '/'}${seo.ogImage}`
    setMeta('og:image', fullOgImage, true)
    setMeta('og:type', 'website', true)

    // Set Twitter tags
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', seo.twitterTitle)
    setMeta('twitter:description', seo.twitterDescription)
    setMeta('twitter:image', fullOgImage)

    // Set canonical link
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = `${baseUrl}${seo.canonicalUrl}`

    // Add JSON-LD script helper
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

    // 1. Generate JSON-LD for LocalBusiness / MovingCompany
    const schemaData = location.businessSchema || location.schema || {}
    if (schemaData.enabled !== false) {
      if (schemaData.customJsonLd && schemaData.customJsonLd.trim()) {
        try {
          const parsed = JSON.parse(schemaData.customJsonLd)
          addJsonLD(parsed, 'location-schema-custom')
        } catch (e) {
          console.warn('Invalid custom JSON-LD schema:', e)
        }
      } else {
        const localBusinessSchema = {
          '@context': 'https://schema.org',
          '@type': schemaData.type || 'MovingCompany',
          name: schemaData.businessName || `OZ Interstate Movers - ${location.name}`,
          description: location.shortDescription || seo.metaDescription,
          url: `${baseUrl}${seo.canonicalUrl}`,
          telephone: location.phone || '1300 668 254',
          email: location.email || 'hello@oz-interstate.com.au',
          priceRange: schemaData.priceRange || '$$',
          address: {
            '@type': 'PostalAddress',
            streetAddress: schemaData.address?.street || location.address || '',
            addressLocality: schemaData.address?.city || city,
            addressRegion: schemaData.address?.state || state,
            postalCode: schemaData.address?.postalCode || '',
            addressCountry: schemaData.address?.country || 'AU',
          },
        }

        const lat = schemaData.latitude != null ? schemaData.latitude : location.coordinates?.latitude
        const lon = schemaData.longitude != null ? schemaData.longitude : location.coordinates?.longitude

        if (lat != null && lon != null && !isNaN(lat) && !isNaN(lon)) {
          localBusinessSchema.geo = {
            '@type': 'GeoCoordinates',
            latitude: Number(lat),
            longitude: Number(lon),
          }
        }

        addJsonLD(localBusinessSchema, 'location-localbusiness-schema')
      }
    }

    // 2. Generate JSON-LD for FAQPage if FAQs exist
    if (Array.isArray(location.faqs) && location.faqs.length > 0) {
      const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: location.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question || '',
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer || '',
          },
        })),
      }
      addJsonLD(faqSchema, 'location-faq-schema')
    }

    // 3. Generate JSON-LD for BreadcrumbList
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${baseUrl}/`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Locations',
          item: `${baseUrl}/locations`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: seo.breadcrumbName,
          item: `${baseUrl}${seo.canonicalUrl}`,
        },
      ],
    }
    addJsonLD(breadcrumbSchema, 'location-breadcrumb-schema')

    // Cleanup on unmount
    return () => {
      const ids = [
        'location-localbusiness-schema',
        'location-faq-schema',
        'location-breadcrumb-schema',
        'location-schema-custom',
      ]
      ids.forEach((id) => {
        const el = document.getElementById(id)
        if (el) el.remove()
      })
    }
  }, [location, seo, baseUrl, city, state, isPreview])

  return null
}
