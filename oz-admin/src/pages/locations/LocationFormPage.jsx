import { useEffect, useState, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  MapPin,
  Globe,
  Sparkles,
  ShieldCheck,
  FileText,
  HelpCircle,
  History,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Code,
  Eye,
  RotateCcw,
  Smartphone,
  Monitor,
  Image,
  Layers,
  Info,
  Plus,
  Trash2,
} from 'lucide-react'
import toast from 'react-hot-toast'
import locationService from '../../services/locationService'
import MediaUploadInput from '../../components/common/MediaUploadInput'

const initialForm = {
  // Basic
  name: '',
  slug: '',
  city: '',
  state: '',
  country: 'Australia',
  region: '',
  address: '',
  phone: '',
  email: '',
  whatsappNumber: '',
  badge: 'Service Available',
  status: 'published',
  coordinates: {
    latitude: '',
    longitude: '',
  },

  // Hero Section (H1, H2 subtitle, description, hero background image)
  heroTitle: '',
  heroSubtitle: '',
  heroDescription: '',
  heroImage: '',
  heroCtaText: 'Get Free Estimate',
  heroCtaUrl: '#quote',

  // About Us Section & Image
  aboutTitle: '',
  aboutSubtitle: '',
  aboutDescription: '',
  aboutImage: '',

  // Extra Custom Section & Image
  customSectionBadge: '',
  customSectionTitle: '',
  customSectionSubtitle: '',
  customSectionContent: '',
  customSectionImage: '',
  customSectionBullets: '',

  // Unique Content
  introduction: '',
  localBusinessDescription: '',
  introTitle: '',
  introContent: '',
  mainTitle: '',
  mainContent: '',
  servicesTitle: '',
  servicesContent: '',
  highlightsTitle: '',
  faqTitle: '',
  shortDescription: '',
  description: '',

  // SEO
  seo: {
    title: '',
    metaDescription: '',
    primaryKeyword: '',
    keywords: [],
    titleTemplate: '{primaryKeyword} in {city} | OZ-INTERSTATE',
    h1: '',
    canonicalUrl: '',
    robots: 'index,follow',
    noIndex: false,
    noFollow: false,
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    twitterTitle: '',
    twitterDescription: '',
    twitterImage: '',
    breadcrumbName: '',
  },

  // Services, Products, Highlights
  services: '',
  products: '',
  highlights: '',
  popularRoutes: '',
  nearbyAreas: '',

  // Structured FAQs: List of { question, answer }
  faqs: [
    { question: '', answer: '' },
    { question: '', answer: '' },
    { question: '', answer: '' },
  ],

  // Testimonials
  testimonials: '',

  // CTA
  ctaTitle: '',
  ctaDescription: '',
  ctaButtonText: 'Request a Quote',
  ctaButtonUrl: '#quote',
  rfqLink: '#quote',

  // Schema
  businessSchema: {
    enabled: true,
    type: 'MovingCompany',
    businessName: '',
    businessType: 'MovingCompany',
    priceRange: '$$',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'AU',
    },
    latitude: '',
    longitude: '',
    customJsonLd: '',
  },

  revisionSummary: '',
}

export default function LocationFormPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [form, setForm] = useState(initialForm)
  const [originalSlug, setOriginalSlug] = useState('')
  const [revisions, setRevisions] = useState([])
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(Boolean(id))
  const [activeTab, setActiveTab] = useState('hero')
  const [previewDevice, setPreviewDevice] = useState('desktop')

  useEffect(() => {
    const fetchLocation = async () => {
      if (!id) return

      try {
        setLoading(true)
        const response = await locationService.getLocationById(id)
        const data = response?.data?.data?.location
        const revs = response?.data?.data?.revisions || []
        if (!data) return

        setOriginalSlug(data.slug || '')
        setRevisions(revs)

        // Parse FAQs into structured array
        let parsedFaqs = []
        if (Array.isArray(data.faqs) && data.faqs.length > 0) {
          parsedFaqs = data.faqs.map((item) => ({
            question: typeof item === 'string' ? item.split('|')[0]?.trim() || '' : item.question || item.q || '',
            answer: typeof item === 'string' ? item.split('|')[1]?.trim() || '' : item.answer || item.a || '',
          }))
        } else if (typeof data.faqs === 'string' && data.faqs.trim()) {
          parsedFaqs = data.faqs
            .split('\n')
            .filter(Boolean)
            .map((line) => {
              const [q = '', a = ''] = line.split('|')
              return { question: q.trim(), answer: a.trim() }
            })
        }

        if (parsedFaqs.length === 0) {
          parsedFaqs = [
            { question: '', answer: '' },
            { question: '', answer: '' },
            { question: '', answer: '' },
          ]
        }

        setForm({
          name: data.name || '',
          slug: data.slug || '',
          city: data.city || '',
          state: data.state || '',
          country: data.country || 'Australia',
          region: data.region || '',
          address: data.address || '',
          phone: data.phone || '',
          email: data.email || '',
          whatsappNumber: data.whatsappNumber || '',
          badge: data.badge || 'Service Available',
          status: data.status || (data.isPublished ? 'published' : 'draft'),
          coordinates: {
            latitude: data.coordinates?.latitude != null ? String(data.coordinates.latitude) : '',
            longitude: data.coordinates?.longitude != null ? String(data.coordinates.longitude) : '',
          },
          heroTitle: data.heroTitle || '',
          heroSubtitle: data.heroSubtitle || '',
          heroDescription: data.heroDescription || '',
          heroImage: data.heroImage || '',
          heroCtaText: data.heroCtaText || 'Get Free Estimate',
          heroCtaUrl: data.heroCtaUrl || '#quote',

          // About Us
          aboutTitle: data.aboutTitle || '',
          aboutSubtitle: data.aboutSubtitle || '',
          aboutDescription: data.aboutDescription || '',
          aboutImage: data.aboutImage || '',

          // Custom Section
          customSectionBadge: data.customSectionBadge || '',
          customSectionTitle: data.customSectionTitle || '',
          customSectionSubtitle: data.customSectionSubtitle || '',
          customSectionContent: data.customSectionContent || '',
          customSectionImage: data.customSectionImage || '',
          customSectionBullets: Array.isArray(data.customSectionBullets) ? data.customSectionBullets.join(', ') : (data.customSectionBullets || ''),

          introduction: data.introduction || '',
          localBusinessDescription: data.localBusinessDescription || '',
          introTitle: data.introTitle || '',
          introContent: data.introContent || '',
          mainTitle: data.mainTitle || '',
          mainContent: data.mainContent || '',
          servicesTitle: data.servicesTitle || '',
          servicesContent: data.servicesContent || '',
          highlightsTitle: data.highlightsTitle || '',
          faqTitle: data.faqTitle || '',
          shortDescription: data.shortDescription || '',
          description: data.description || '',
          ctaTitle: data.ctaTitle || '',
          ctaDescription: data.ctaDescription || '',
          ctaButtonText: data.ctaButtonText || 'Request a Quote',
          ctaButtonUrl: data.ctaButtonUrl || '#quote',
          rfqLink: data.rfqLink || '#quote',
          seo: {
            ...initialForm.seo,
            ...(data.seo || {}),
            keywords: Array.isArray(data.seo?.keywords) ? data.seo.keywords : [],
          },
          services: Array.isArray(data.services)
            ? data.services.map((s) => `${s.title || ''}|${s.description || ''}|${s.icon || 'Truck'}|${(s.features || []).join(';')}`).join('\n')
            : '',
          products: Array.isArray(data.products)
            ? data.products.map((p) => `${p.name || ''}|${p.description || ''}|${p.tag || ''}|${p.link || ''}`).join('\n')
            : '',
          faqs: parsedFaqs,
          highlights: Array.isArray(data.highlights) ? data.highlights.map((item) => `${item.title || ''}|${item.desc || ''}`).join('\n') : '',
          testimonials: Array.isArray(data.testimonials) ? data.testimonials.map((item) => `${item.name || ''}|${item.role || ''}|${item.review || ''}|${item.rating || 5}|${item.locationTag || ''}`).join('\n') : '',
          popularRoutes: Array.isArray(data.popularRoutes) ? data.popularRoutes.join(', ') : '',
          nearbyAreas: Array.isArray(data.nearbyAreas) ? data.nearbyAreas.join(', ') : '',
          businessSchema: {
            ...initialForm.businessSchema,
            ...(data.businessSchema || {}),
            latitude: data.businessSchema?.latitude != null ? String(data.businessSchema.latitude) : '',
            longitude: data.businessSchema?.longitude != null ? String(data.businessSchema.longitude) : '',
          },
          revisionSummary: '',
        })
      } catch (error) {
        console.error('Failed to load location:', error)
        toast.error('Failed to load location.')
      } finally {
        setLoading(false)
      }
    }

    fetchLocation()
  }, [id])

  const generateSlug = (text) =>
    String(text)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

  const handleChange = (field, value) => {
    setForm((prev) => {
      if (field.includes('.')) {
        const [parent, child] = field.split('.')
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value,
          },
        }
      }
      return { ...prev, [field]: value }
    })
  }

  const handleNameChange = (val) => {
    setForm((prev) => {
      const newSlug = !id || !prev.slug ? generateSlug(val) : prev.slug
      return {
        ...prev,
        name: val,
        city: prev.city || val,
        slug: newSlug,
      }
    })
  }

  // FAQ Array Handlers
  const handleFaqChange = (index, field, value) => {
    setForm((prev) => {
      const updated = [...(prev.faqs || [])]
      updated[index] = {
        ...updated[index],
        [field]: value,
      }
      return { ...prev, faqs: updated }
    })
  }

  const handleAddFaq = () => {
    setForm((prev) => ({
      ...prev,
      faqs: [...(prev.faqs || []), { question: '', answer: '' }],
    }))
  }

  const handleRemoveFaq = (index) => {
    setForm((prev) => {
      const updated = (prev.faqs || []).filter((_, i) => i !== index)
      return { ...prev, faqs: updated.length > 0 ? updated : [{ question: '', answer: '' }] }
    })
  }

  // Real-time SEO Score Calculator
  const seoAudit = useMemo(() => {
    let score = 0
    const checks = []
    const warnings = []

    const title = form.seo.title || form.heroTitle || ''
    const desc = form.seo.metaDescription || form.shortDescription || form.heroDescription || ''
    const h1 = form.seo.h1 || form.heroTitle || ''
    const canonical = form.seo.canonicalUrl || (form.slug ? `/location/${form.slug}` : '')
    const ogImage = form.seo.ogImage || form.heroImage || form.aboutImage || ''

    if (form.name && form.slug) {
      score += 10
      checks.push({ label: 'Valid Name and URL Slug', passed: true, score: 10 })
    } else {
      warnings.push('Name and slug are required.')
      checks.push({ label: 'Valid Name and URL Slug', passed: false, score: 0 })
    }

    if (title.length >= 45 && title.length <= 65) {
      score += 15
      checks.push({ label: `Meta Title Length (${title.length} chars - Optimal 50-60)`, passed: true, score: 15 })
    } else if (title.length > 0) {
      score += 10
      warnings.push(`Meta title length is ${title.length} chars. Optimal: 50-60.`)
      checks.push({ label: `Meta Title Length (${title.length} chars)`, passed: true, score: 10 })
    } else {
      warnings.push('Meta title is missing.')
      checks.push({ label: 'Meta Title Present', passed: false, score: 0 })
    }

    if (desc.length >= 130 && desc.length <= 165) {
      score += 15
      checks.push({ label: `Meta Description Length (${desc.length} chars - Optimal 140-160)`, passed: true, score: 15 })
    } else if (desc.length > 0) {
      score += 10
      warnings.push(`Meta description is ${desc.length} chars. Optimal: 140-160.`)
      checks.push({ label: `Meta Description Length (${desc.length} chars)`, passed: true, score: 10 })
    } else {
      warnings.push('Meta description is missing.')
      checks.push({ label: 'Meta Description Present', passed: false, score: 0 })
    }

    if (h1 && h1.length >= 8) {
      score += 10
      checks.push({ label: 'H1 Heading Present', passed: true, score: 10 })
    } else {
      warnings.push('Missing H1 heading.')
      checks.push({ label: 'H1 Heading Present', passed: false, score: 0 })
    }

    const totalWords = (form.introduction + ' ' + form.aboutDescription + ' ' + form.customSectionContent + ' ' + form.heroDescription)
      .trim()
      .split(/\s+/)
      .filter(Boolean).length

    if (totalWords >= 120) {
      score += 20
      checks.push({ label: `Unique Content (${totalWords} words - High Quality)`, passed: true, score: 20 })
    } else if (totalWords >= 50) {
      score += 12
      warnings.push(`Moderate unique content (${totalWords} words). Target 120+ words to avoid thin-content flags.`)
      checks.push({ label: `Unique Content (${totalWords} words - Moderate)`, passed: true, score: 12 })
    } else {
      warnings.push('⚠ Thin Content Warning: Under 50 words of custom text.')
      checks.push({ label: `Unique Content (${totalWords} words - Thin Content)`, passed: false, score: 4 })
    }

    if (canonical) {
      score += 10
      checks.push({ label: 'Canonical URL Configured', passed: true, score: 10 })
    } else {
      checks.push({ label: 'Canonical URL Configured', passed: false, score: 0 })
    }

    if (form.businessSchema.enabled !== false) {
      score += 10
      checks.push({ label: 'LocalBusiness Schema Enabled', passed: true, score: 10 })
    } else {
      checks.push({ label: 'LocalBusiness Schema Enabled', passed: false, score: 0 })
    }

    const validFaqs = Array.isArray(form.faqs) ? form.faqs.filter((f) => f.question?.trim() && f.answer?.trim()) : []
    if (validFaqs.length >= 2) {
      score += 5
      checks.push({ label: `Local FAQs (${validFaqs.length} Q&A items for FAQPage Schema)`, passed: true, score: 5 })
    } else {
      warnings.push('Add at least 2 complete FAQs (Question & Answer) for FAQPage rich snippet.')
      checks.push({ label: 'Local FAQs (Need >= 2 complete Q&A)', passed: false, score: 0 })
    }

    if (ogImage) {
      score += 5
      checks.push({ label: 'Social OG Image Configured', passed: true, score: 5 })
    } else {
      warnings.push('OG Image missing.')
      checks.push({ label: 'Social OG Image', passed: false, score: 0 })
    }

    return {
      score: Math.min(100, score),
      warnings,
      checks,
    }
  }, [form])

  const handleRestoreVersion = async (version) => {
    if (!window.confirm(`Restore location to version ${version}? Current unsaved edits will be replaced.`)) return
    try {
      const res = await locationService.restoreLocationRevision(id, version)
      if (res.data?.success) {
        toast.success(`Restored to version ${version}!`)
        window.location.reload()
      }
    } catch (err) {
      toast.error('Failed to restore version.')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const payload = {
        name: form.name,
        slug: form.slug || generateSlug(form.name),
        city: form.city || form.name,
        state: form.state,
        country: form.country,
        region: form.region,
        address: form.address,
        phone: form.phone,
        email: form.email,
        whatsappNumber: form.whatsappNumber,
        badge: form.badge,
        status: form.status,
        coordinates: {
          latitude: form.coordinates.latitude !== '' ? Number(form.coordinates.latitude) : null,
          longitude: form.coordinates.longitude !== '' ? Number(form.coordinates.longitude) : null,
        },

        // Hero Content
        heroTitle: form.heroTitle,
        heroSubtitle: form.heroSubtitle,
        heroDescription: form.heroDescription,
        heroImage: form.heroImage,
        heroCtaText: form.heroCtaText,
        heroCtaUrl: form.heroCtaUrl,

        // About Us Section & Image
        aboutTitle: form.aboutTitle,
        aboutSubtitle: form.aboutSubtitle,
        aboutDescription: form.aboutDescription,
        aboutImage: form.aboutImage,

        // Custom Section & Image
        customSectionBadge: form.customSectionBadge,
        customSectionTitle: form.customSectionTitle,
        customSectionSubtitle: form.customSectionSubtitle,
        customSectionContent: form.customSectionContent,
        customSectionImage: form.customSectionImage,
        customSectionBullets: typeof form.customSectionBullets === 'string'
          ? form.customSectionBullets.split(',').map((s) => s.trim()).filter(Boolean)
          : form.customSectionBullets,

        introduction: form.introduction,
        localBusinessDescription: form.localBusinessDescription,
        introTitle: form.introTitle,
        introContent: form.introContent,
        mainTitle: form.mainTitle,
        mainContent: form.mainContent,
        servicesTitle: form.servicesTitle,
        servicesContent: form.servicesContent,
        highlightsTitle: form.highlightsTitle,
        faqTitle: form.faqTitle,
        shortDescription: form.shortDescription,
        description: form.description,
        ctaTitle: form.ctaTitle,
        ctaDescription: form.ctaDescription,
        ctaButtonText: form.ctaButtonText,
        ctaButtonUrl: form.ctaButtonUrl,
        rfqLink: form.rfqLink,
        seo: form.seo,
        services: form.services
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean)
          .map((line) => {
            const parts = line.split('|')
            return {
              title: parts[0]?.trim() || '',
              description: parts[1]?.trim() || '',
              icon: parts[2]?.trim() || 'Truck',
              features: parts[3] ? parts[3].split(';').map((s) => s.trim()) : [],
            }
          }),
        products: form.products
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean)
          .map((line) => {
            const parts = line.split('|')
            return {
              name: parts[0]?.trim() || '',
              description: parts[1]?.trim() || '',
              tag: parts[2]?.trim() || '',
              link: parts[3]?.trim() || '',
            }
          }),
        // Structured clean FAQs array
        faqs: Array.isArray(form.faqs)
          ? form.faqs
              .filter((f) => (f.question || '').trim() || (f.answer || '').trim())
              .map((f) => ({
                question: (f.question || '').trim(),
                answer: (f.answer || '').trim(),
              }))
          : [],
        highlights: form.highlights
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean)
          .map((line) => {
            const [t = '', d = ''] = line.split('|')
            return { title: t.trim(), desc: d.trim() }
          }),
        testimonials: form.testimonials
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean)
          .map((line) => {
            const [name = '', role = '', rev = '', rating = '5', tag = ''] = line.split('|')
            return { name: name.trim(), role: role.trim(), review: rev.trim(), rating: Number(rating) || 5, locationTag: tag.trim() }
          }),
        popularRoutes: form.popularRoutes.split(',').map((item) => item.trim()).filter(Boolean),
        nearbyAreas: form.nearbyAreas.split(',').map((item) => item.trim()).filter(Boolean),
        businessSchema: {
          ...form.businessSchema,
          latitude: form.businessSchema.latitude !== '' ? Number(form.businessSchema.latitude) : null,
          longitude: form.businessSchema.longitude !== '' ? Number(form.businessSchema.longitude) : null,
        },
        revisionSummary: form.revisionSummary,
      }

      if (id) {
        const response = await locationService.updateLocation(id, payload)
        if (response?.data?.success) {
          toast.success('Location updated successfully.')
          navigate('/admin/locations')
        }
      } else {
        const response = await locationService.createLocation(payload)
        if (response?.data?.success) {
          toast.success('Location created successfully.')
          navigate('/admin/locations')
        }
      }
    } catch (error) {
      console.error('Failed to save location:', error)
      toast.error(error?.response?.data?.message || 'Failed to save location.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center', color: '#475569' }}>Loading location data...</div>
  }

  const previewCanonical = form.slug ? `/location/${form.slug}` : ''

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 16px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ margin: 0, color: '#183149', fontSize: 30, display: 'flex', alignItems: 'center', gap: 10 }}>
            <MapPin color="#0284c7" size={28} /> {id ? `Edit Location: ${form.name || form.slug}` : 'Create Location Page'}
          </h1>
          <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: 14 }}>
            Configure localized H1/H2 headings, images, About Us, Custom Feature Section, FAQs, and SEO.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {form.slug && (
            <button
              type="button"
              onClick={() => window.open(`http://localhost:5173/location/${form.slug}?preview=true`, '_blank')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '10px 16px',
                borderRadius: 10,
                border: '1px solid #10b981',
                background: '#ecfdf5',
                color: '#065f46',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: 13,
              }}
            >
              <Eye size={15} /> Preview Public Page
            </button>
          )}

          <div
            style={{
              padding: '8px 14px',
              borderRadius: 10,
              fontWeight: 800,
              fontSize: 14,
              background: seoAudit.score >= 80 ? '#dcfce7' : seoAudit.score >= 60 ? '#fef3c7' : '#fee2e2',
              color: seoAudit.score >= 80 ? '#166534' : seoAudit.score >= 60 ? '#92400e' : '#991b1b',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <ShieldCheck size={18} /> SEO Score: {seoAudit.score}/100
          </div>
        </div>
      </div>

      {/* Slug change warning notice */}
      {id && originalSlug && form.slug && originalSlug !== form.slug && (
        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 12, padding: '12px 16px', marginBottom: 20, color: '#92400e', fontSize: 13 }}>
          <strong>⚡ 301 Redirect Notice:</strong> Changing the slug from <code style={{ background: '#fef3c7', padding: '2px 6px', borderRadius: 4 }}>{originalSlug}</code> to <code style={{ background: '#fef3c7', padding: '2px 6px', borderRadius: 4 }}>{form.slug}</code> will automatically create a <strong>301 Permanent Redirect</strong>.
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: 4, borderBottom: '2px solid #e2e8f0', marginBottom: 24, overflowX: 'auto' }}>
          {[
            { key: 'hero', label: '1. Hero Section (H1, H2 & Image)', icon: Monitor },
            { key: 'about', label: '2. About Us Section & Image', icon: Info },
            { key: 'custom', label: '3. Extra Custom Section', icon: Layers },
            { key: 'faqs', label: '4. Location FAQs', icon: HelpCircle },
            { key: 'seo', label: '5. SEO & Google SERP', icon: Globe },
            { key: 'basic', label: '6. Basic Info & Contact', icon: MapPin },
            { key: 'whyChoose', label: '7. Why Choose Us', icon: Sparkles },
            ...(id ? [{ key: 'revisions', label: `8. Revisions (${revisions.length})`, icon: History }] : []),
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.key
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '12px 16px',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontWeight: isActive ? '700' : '500',
                  color: isActive ? '#0284c7' : '#64748b',
                  borderBottom: isActive ? '3px solid #0284c7' : '3px solid transparent',
                  marginBottom: '-2px',
                  fontSize: 13,
                  whiteSpace: 'nowrap',
                }}
              >
                <Icon size={16} /> {tab.label}
              </button>
            )
          })}
        </div>

        {/* Tab Container */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, padding: 24, marginBottom: 24 }}>
          {/* TAB 1: HERO SECTION */}
          {activeTab === 'hero' && (
            <div>
              <h2 style={sectionHeadingStyle}>Hero Section (H1, H2 Heading, Description & Image)</h2>
              <p style={{ color: '#64748b', fontSize: 13, marginTop: -10, marginBottom: 20 }}>
                This is the main banner displayed at the top of the location page.
              </p>

              <Field label="Hero H1 Main Heading *">
                <input
                  value={form.heroTitle}
                  onChange={(e) => handleChange('heroTitle', e.target.value)}
                  style={inputStyle}
                  placeholder={`e.g. Interstate Removalists & Freight in ${form.name || 'Adelaide'}`}
                />
                <span style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>This will render as the main bold H1 title on the top banner.</span>
              </Field>

              <Field label="Hero H2 Subtitle / Slogan">
                <input
                  value={form.heroSubtitle}
                  onChange={(e) => handleChange('heroSubtitle', e.target.value)}
                  style={inputStyle}
                  placeholder={`e.g. Daily linehaul moving services connecting ${form.name || 'Adelaide'} with Melbourne, Sydney, Brisbane and Perth.`}
                />
                <span style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>This will render directly under the H1 heading.</span>
              </Field>

              <Field label="Hero Description Paragraph">
                <textarea
                  value={form.heroDescription}
                  onChange={(e) => handleChange('heroDescription', e.target.value)}
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical' }}
                  placeholder={`e.g. Direct moving services connecting ${form.name || 'Adelaide'} with Melbourne, Sydney, Perth, and regional Australia. Guaranteed fixed quotes and transit insurance included.`}
                />
              </Field>

              <div style={{ marginTop: 16 }}>
                <MediaUploadInput
                  label="Hero Section Background Media (Upload Image or Video)"
                  value={form.heroImage}
                  onChange={(val) => handleChange('heroImage', val)}
                  accept="image/*,video/*"
                  allowVideo={true}
                  helperText="Upload an image (PNG, JPG, WEBP) or high-definition video (MP4, WebM) for the location top hero banner. If left empty, the active global banner will play."
                />
              </div>
            </div>
          )}

          {/* TAB 2: ABOUT US SECTION & IMAGE */}
          {activeTab === 'about' && (
            <div>
              <h2 style={sectionHeadingStyle}>Location About Us Section & Image</h2>
              <p style={{ color: '#64748b', fontSize: 13, marginTop: -10, marginBottom: 20 }}>
                A dedicated About Us section specifically tailored to this location's operations, depot, and history.
              </p>

              <Field label="About Us Heading / Title">
                <input
                  value={form.aboutTitle}
                  onChange={(e) => handleChange('aboutTitle', e.target.value)}
                  style={inputStyle}
                  placeholder={`e.g. About OZ Interstate Movers in ${form.name || 'Adelaide'}`}
                />
              </Field>

              <Field label="About Us Subtitle">
                <input
                  value={form.aboutSubtitle}
                  onChange={(e) => handleChange('aboutSubtitle', e.target.value)}
                  style={inputStyle}
                  placeholder={`e.g. Professional Long-Haul & Local Moving Across ${form.state || 'South Australia'}`}
                />
              </Field>

              <Field label="About Us Description (Full Paragraphs)">
                <textarea
                  value={form.aboutDescription}
                  onChange={(e) => handleChange('aboutDescription', e.target.value)}
                  rows={5}
                  style={{ ...inputStyle, resize: 'vertical' }}
                  placeholder={`e.g. OZ Interstate Movers provides specialized long-haul removalist and freight solutions for residential, corporate, and commercial clients in ${form.name || 'Adelaide'}. Our experienced team and modern GPS-tracked fleet ensure safe, on-time delivery across Australia.`}
                />
              </Field>

              <div style={{ marginTop: 16 }}>
                <MediaUploadInput
                  label="About Us Section Image (Upload Image)"
                  value={form.aboutImage}
                  onChange={(val) => handleChange('aboutImage', val)}
                  accept="image/*"
                  allowVideo={false}
                  helperText="Upload a high-quality depot, moving team, or fleet image for this location."
                />
              </div>
            </div>
          )}

          {/* TAB 3: EXTRA CUSTOM SECTION */}
          {activeTab === 'custom' && (
            <div>
              <h2 style={sectionHeadingStyle}>Extra Custom Feature Section & Image</h2>
              <p style={{ color: '#64748b', fontSize: 13, marginTop: -10, marginBottom: 20 }}>
                An additional highlighted feature section for special routes, industrial capabilities, or local advantages.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
                <Field label="Section Badge">
                  <input
                    value={form.customSectionBadge}
                    onChange={(e) => handleChange('customSectionBadge', e.target.value)}
                    style={inputStyle}
                    placeholder="e.g. Express Linehaul"
                  />
                </Field>

                <Field label="Section Heading / Title">
                  <input
                    value={form.customSectionTitle}
                    onChange={(e) => handleChange('customSectionTitle', e.target.value)}
                    style={inputStyle}
                    placeholder={`e.g. Specialized Freight & Interstate Scope in ${form.name || 'Adelaide'}`}
                  />
                </Field>
              </div>

              <Field label="Section Subtitle">
                <input
                  value={form.customSectionSubtitle}
                  onChange={(e) => handleChange('customSectionSubtitle', e.target.value)}
                  style={inputStyle}
                  placeholder={`e.g. Tailored interstate solutions connecting ${form.name || 'Adelaide'} with all Australian capitals.`}
                />
              </Field>

              <Field label="Section Content Paragraph">
                <textarea
                  value={form.customSectionContent}
                  onChange={(e) => handleChange('customSectionContent', e.target.value)}
                  rows={4}
                  style={{ ...inputStyle, resize: 'vertical' }}
                  placeholder={`e.g. Our ${form.name || 'Adelaide'} linehaul operations provide dependable scheduling, secure palletized freight, and customized door-to-door moving services designed to minimize downtime.`}
                />
              </Field>

              <Field label="Key Bullet Points (Comma-separated)">
                <input
                  value={form.customSectionBullets}
                  onChange={(e) => handleChange('customSectionBullets', e.target.value)}
                  style={inputStyle}
                  placeholder="Daily linehaul departures, Air-ride suspension trucks, Dedicated moving coordinator"
                />
              </Field>

              <div style={{ marginTop: 16 }}>
                <MediaUploadInput
                  label="Custom Feature Section Image (Upload Image)"
                  value={form.customSectionImage}
                  onChange={(val) => handleChange('customSectionImage', val)}
                  accept="image/*"
                  allowVideo={false}
                  helperText="Upload a feature photo demonstrating linehaul equipment, freight handling, or transit routes."
                />
              </div>
            </div>
          )}

          {/* TAB 4: LOCATION FAQS */}
          {activeTab === 'faqs' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <h2 style={{ ...sectionHeadingStyle, marginBottom: 4, borderBottom: 'none', paddingBottom: 0 }}>
                    Location FAQs (Questions & Answers)
                  </h2>
                  <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>
                    Enter questions and answers for this location. These will render in the interactive accordion and Google FAQ Schema.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddFaq}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 16px',
                    borderRadius: 10,
                    border: '1px solid #0284c7',
                    background: '#e0f2fe',
                    color: '#0369a1',
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: 'pointer',
                  }}
                >
                  <Plus size={15} /> Add Question & Answer
                </button>
              </div>

              <div style={{ marginBottom: 20 }}>
                <Field label="FAQ Section Heading / Title">
                  <input
                    value={form.faqTitle}
                    onChange={(e) => handleChange('faqTitle', e.target.value)}
                    style={inputStyle}
                    placeholder={`e.g. Answers to your ${form.name || 'Noida'} moving questions`}
                  />
                </Field>
              </div>

              {/* Structured FAQ Question & Answer Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {(form.faqs || []).map((faq, idx) => (
                  <div
                    key={idx}
                    style={{
                      border: '1px solid #e2e8f0',
                      borderRadius: 14,
                      padding: 18,
                      background: '#f8fafc',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 12,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 800,
                          color: '#0284c7',
                          background: '#e0f2fe',
                          padding: '3px 10px',
                          borderRadius: 20,
                        }}
                      >
                        FAQ #{idx + 1}
                      </span>

                      {(form.faqs || []).length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveFaq(idx)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#ef4444',
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                          }}
                        >
                          <Trash2 size={14} /> Remove FAQ
                        </button>
                      )}
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                        Question:
                      </label>
                      <input
                        value={faq.question || ''}
                        onChange={(e) => handleFaqChange(idx, 'question', e.target.value)}
                        style={inputStyle}
                        placeholder={`e.g. How does the moving process work in ${form.name || 'this location'}?`}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                        Answer:
                      </label>
                      <textarea
                        value={faq.answer || ''}
                        onChange={(e) => handleFaqChange(idx, 'answer', e.target.value)}
                        rows={3}
                        style={{ ...inputStyle, resize: 'vertical' }}
                        placeholder="e.g. Our removalist team handles protective furniture wrapping, highway linehaul freight, through to room placement at destination."
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 18, textAlign: 'center' }}>
                <button
                  type="button"
                  onClick={handleAddFaq}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '10px 20px',
                    borderRadius: 10,
                    border: '1px dashed #0284c7',
                    background: '#f0f9ff',
                    color: '#0284c7',
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: 'pointer',
                  }}
                >
                  <Plus size={16} /> + Add Another FAQ Item
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: SEO SETTINGS & SERP PREVIEW */}
          {activeTab === 'seo' && (
            <div>
              <h2 style={sectionHeadingStyle}>SEO Metadata & Google Search Preview</h2>

              {/* SERP Preview Card */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: 18, borderRadius: 14, marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontWeight: 700, color: '#1e293b', fontSize: 13 }}>Google Search SERP Preview</span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      type="button"
                      onClick={() => setPreviewDevice('desktop')}
                      style={{
                        padding: '4px 10px',
                        borderRadius: 6,
                        border: '1px solid #cbd5e1',
                        background: previewDevice === 'desktop' ? '#0284c7' : '#fff',
                        color: previewDevice === 'desktop' ? '#fff' : '#475569',
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <Monitor size={12} /> Desktop
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewDevice('mobile')}
                      style={{
                        padding: '4px 10px',
                        borderRadius: 6,
                        border: '1px solid #cbd5e1',
                        background: previewDevice === 'mobile' ? '#0284c7' : '#fff',
                        color: previewDevice === 'mobile' ? '#fff' : '#475569',
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <Smartphone size={12} /> Mobile
                    </button>
                  </div>
                </div>

                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 16, maxWidth: previewDevice === 'mobile' ? 380 : '100%' }}>
                  <div style={{ fontSize: 12, color: '#202124', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontWeight: 700 }}>OZ Interstate Movers</span>
                    <span style={{ color: '#5f6368' }}>• https://oz-interstate.com.au{previewCanonical}</span>
                  </div>
                  <div style={{ color: '#1a0dab', fontSize: 18, fontWeight: 500, marginTop: 4, lineHeight: 1.3 }}>
                    {form.seo.title || form.heroTitle || `Interstate Removalists ${form.name || 'City'} | OZ-INTERSTATE`}
                  </div>
                  <div style={{ color: '#4d5156', fontSize: 13, marginTop: 4, lineHeight: 1.4 }}>
                    {form.seo.metaDescription || form.heroDescription || `Reliable interstate removalists and freight transport services for ${form.name || 'city'} homes and businesses across Australia.`}
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
                <Field label="Primary Keyword">
                  <input
                    value={form.seo.primaryKeyword}
                    onChange={(e) => handleChange('seo.primaryKeyword', e.target.value)}
                    style={inputStyle}
                    placeholder="e.g. Interstate Removalists Adelaide"
                  />
                </Field>

                <Field label="Meta Title (Optimal: 50-60 characters)">
                  <input
                    value={form.seo.title}
                    onChange={(e) => handleChange('seo.title', e.target.value)}
                    style={inputStyle}
                    placeholder="e.g. Interstate Removalists Adelaide | OZ-INTERSTATE"
                  />
                  <span style={{ fontSize: 11, color: form.seo.title.length >= 45 && form.seo.title.length <= 65 ? '#166534' : '#ea580c', fontWeight: 600, marginTop: 3 }}>
                    {form.seo.title.length}/60 characters {form.seo.title.length < 45 ? '(short)' : form.seo.title.length > 65 ? '(long)' : '✓ Optimal'}
                  </span>
                </Field>
              </div>

              <Field label="Meta Description (Optimal: 140-160 characters)">
                <textarea
                  value={form.seo.metaDescription}
                  onChange={(e) => handleChange('seo.metaDescription', e.target.value)}
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical' }}
                  placeholder="e.g. Trusted Adelaide interstate removalists and freight specialists. Regular linehaul routes to Melbourne, Sydney, Brisbane & Perth. Get a free fixed quote today."
                />
                <span style={{ fontSize: 11, color: form.seo.metaDescription.length >= 130 && form.seo.metaDescription.length <= 165 ? '#166534' : '#ea580c', fontWeight: 600, marginTop: 3 }}>
                  {form.seo.metaDescription.length}/160 characters {form.seo.metaDescription.length < 130 ? '(short)' : form.seo.metaDescription.length > 165 ? '(long)' : '✓ Optimal'}
                </span>
              </Field>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
                <Field label="Canonical URL">
                  <input
                    value={form.seo.canonicalUrl}
                    onChange={(e) => handleChange('seo.canonicalUrl', e.target.value)}
                    style={inputStyle}
                    placeholder={previewCanonical}
                  />
                </Field>

                <Field label="Robots Meta Tag">
                  <select
                    value={form.seo.robots}
                    onChange={(e) => handleChange('seo.robots', e.target.value)}
                    style={inputStyle}
                  >
                    <option value="index,follow">index,follow (Publicly Indexable)</option>
                    <option value="noindex,nofollow">noindex,nofollow (Do Not Index)</option>
                    <option value="index,nofollow">index,nofollow</option>
                    <option value="noindex,follow">noindex,follow</option>
                  </select>
                </Field>
              </div>

              <div style={{ marginTop: 16 }}>
                <MediaUploadInput
                  label="Social Share (OG) Image (Upload Image)"
                  value={form.seo.ogImage}
                  onChange={(val) => handleChange('seo.ogImage', val)}
                  accept="image/*"
                  allowVideo={false}
                  helperText="Recommended 1200x630 image for link previews on Facebook, LinkedIn, Twitter & WhatsApp."
                />
              </div>
            </div>
          )}

          {/* TAB 6: BASIC DETAILS & CONTACT */}
          {activeTab === 'basic' && (
            <div>
              <h2 style={sectionHeadingStyle}>Location Details & Contact</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
                <Field label="Location Name *">
                  <input
                    value={form.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    required
                    style={inputStyle}
                    placeholder="e.g. Adelaide"
                  />
                </Field>

                <Field label="URL Slug * (Lowercase & URL-safe)">
                  <input
                    value={form.slug}
                    onChange={(e) => handleChange('slug', generateSlug(e.target.value))}
                    required
                    style={inputStyle}
                    placeholder="e.g. adelaide"
                  />
                  <span style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>Public URL: /location/{form.slug || 'city'}</span>
                </Field>

                <Field label="City">
                  <input
                    value={form.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    style={inputStyle}
                    placeholder="e.g. Adelaide"
                  />
                </Field>

                <Field label="Country *">
                  <input
                    value={form.country}
                    onChange={(e) => handleChange('country', e.target.value)}
                    required
                    style={inputStyle}
                    placeholder="e.g. Australia"
                  />
                </Field>

                <Field label="State *">
                  <input
                    value={form.state}
                    onChange={(e) => handleChange('state', e.target.value)}
                    required
                    style={inputStyle}
                    placeholder="e.g. SA"
                  />
                </Field>

                <Field label="Badge / Hub Tag">
                  <input
                    value={form.badge}
                    onChange={(e) => handleChange('badge', e.target.value)}
                    style={inputStyle}
                    placeholder="e.g. SA Gateway • Service Available"
                  />
                </Field>

                <Field label="Status">
                  <select
                    value={form.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                    style={inputStyle}
                  >
                    <option value="published">Published (Indexable)</option>
                    <option value="draft">Draft (Noindex)</option>
                    <option value="unpublished">Unpublished</option>
                    <option value="archived">Archived</option>
                  </select>
                </Field>
              </div>

              <h3 style={{ margin: '24px 0 14px', color: '#1e293b', fontSize: 15, fontWeight: 700 }}>Contact & Depot</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
                <Field label="Depot Street Address">
                  <input
                    value={form.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    style={inputStyle}
                    placeholder="e.g. 42 Freight Way, Regency Park, SA 5010"
                  />
                </Field>

                <Field label="Direct Phone">
                  <input
                    value={form.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    style={inputStyle}
                    placeholder="e.g. 1300 668 254"
                  />
                </Field>

                <Field label="Direct Email">
                  <input
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    style={inputStyle}
                    placeholder="e.g. adelaide@oz-interstate.com.au"
                  />
                </Field>

                <Field label="WhatsApp Number">
                  <input
                    value={form.whatsappNumber}
                    onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                    style={inputStyle}
                    placeholder="e.g. +61411555880"
                  />
                </Field>
              </div>

              <h3 style={{ margin: '24px 0 14px', color: '#1e293b', fontSize: 15, fontWeight: 700 }}>Geographic Coordinates</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18 }}>
                <Field label="Latitude">
                  <input
                    value={form.coordinates.latitude}
                    onChange={(e) => handleChange('coordinates.latitude', e.target.value)}
                    style={inputStyle}
                    placeholder="e.g. -34.9285"
                  />
                </Field>
                <Field label="Longitude">
                  <input
                    value={form.coordinates.longitude}
                    onChange={(e) => handleChange('coordinates.longitude', e.target.value)}
                    style={inputStyle}
                    placeholder="e.g. 138.6007"
                  />
                </Field>
              </div>
            </div>
          )}

          {/* TAB 7: WHY CHOOSE US */}
          {activeTab === 'whyChoose' && (
            <div>
              <h2 style={sectionHeadingStyle}>Why Choose Us</h2>
              <Field label="Section Title">
                <input
                  value={form.highlightsTitle}
                  onChange={(e) => handleChange('highlightsTitle', e.target.value)}
                  style={inputStyle}
                  placeholder="Why choose OZ Interstate in this location?"
                />
              </Field>
              <Field label="Why Choose Us Points (Title | Description)">
                <textarea
                  value={form.highlights}
                  onChange={(e) => handleChange('highlights', e.target.value)}
                  rows={8}
                  style={{ ...inputStyle, resize: 'vertical', fontFamily: 'monospace' }}
                  placeholder="Experienced local team|Our team knows the area and handles every move carefully.\nFully insured service|Your belongings are protected from pickup to delivery."
                />
              </Field>
            </div>
          )}

          {/* TAB 8: REVISIONS */}
          {activeTab === 'revisions' && (
            <div>
              <h2 style={sectionHeadingStyle}>Revision History & Rollback</h2>
              {revisions.length === 0 ? (
                <p style={{ color: '#64748b', fontSize: 13 }}>No previous revisions saved for this location.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {revisions.map((rev) => (
                    <div
                      key={rev._id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '14px 18px',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: 12,
                        flexWrap: 'wrap',
                        gap: 10,
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, color: '#183149', fontSize: 14 }}>
                          Version {rev.version} — {rev.summary || 'Update'}
                        </div>
                        <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                          Saved by {rev.changedBy || 'Admin'} on {new Date(rev.createdAt).toLocaleString()}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRestoreVersion(rev.version)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '7px 14px',
                          borderRadius: 8,
                          border: '1px solid #cbd5e1',
                          background: '#fff',
                          color: '#183149',
                          fontWeight: 700,
                          fontSize: 12,
                          cursor: 'pointer',
                        }}
                      >
                        <RotateCcw size={14} /> Restore Version {rev.version}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Change summary note for revision history */}
        {id && (
          <div style={{ marginBottom: 20 }}>
            <Field label="Revision Change Summary (Optional)">
              <input
                value={form.revisionSummary}
                onChange={(e) => handleChange('revisionSummary', e.target.value)}
                style={inputStyle}
                placeholder="e.g. Updated Hero H1, About Us section, and added custom section image"
              />
            </Field>
          </div>
        )}

        {/* Bottom Actions Bar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, flexWrap: 'wrap', borderTop: '1px solid #e2e8f0', paddingTop: 20 }}>
          <button
            type="button"
            onClick={() => navigate('/admin/locations')}
            style={{
              padding: '12px 20px',
              borderRadius: 12,
              border: '1px solid #cbd5e1',
              background: '#fff',
              color: '#183149',
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            style={{
              padding: '12px 24px',
              borderRadius: 12,
              border: 'none',
              background: '#0284c7',
              color: '#fff',
              fontWeight: 800,
              fontSize: 14,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)',
            }}
          >
            {saving ? 'Saving Location...' : id ? 'Update Location & Sync Changes' : 'Publish New Location'}
          </button>
        </div>
      </form>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontWeight: 700, color: '#334155', fontSize: 13, marginTop: 12 }}>
      <span>{label}</span>
      {children}
    </label>
  )
}

const sectionHeadingStyle = {
  margin: '0 0 18px',
  color: '#183149',
  fontSize: 18,
  fontWeight: 800,
  borderBottom: '1px solid #f1f5f9',
  paddingBottom: 10,
}

const inputStyle = {
  width: '100%',
  border: '1px solid #cbd5e1',
  borderRadius: 10,
  padding: '10px 14px',
  fontSize: 14,
  color: '#0f172a',
  background: '#fff',
  fontFamily: 'inherit',
}
