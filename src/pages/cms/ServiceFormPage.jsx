import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Save,
  ArrowLeft,
  Loader2,
  Plus,
  Trash2,
  ShieldCheck,
  Globe,
  Monitor,
  Smartphone,
  Eye,
  Info,
  Layers,
  HelpCircle,
  Truck,
  Home,
  Building2,
  Sofa,
  PackageOpen,
  Warehouse,
  Users,
  BadgeDollarSign,
  Route,
  Clock,
  HeartHandshake,
} from 'lucide-react'
import toast from 'react-hot-toast'
import serviceService from '../../services/serviceService'
import MediaUploadInput from '../../components/common/MediaUploadInput'

const AVAILABLE_ICONS = [
  { name: 'Home', icon: Home, label: 'House' },
  { name: 'Building2', icon: Building2, label: 'Commercial' },
  { name: 'Truck', icon: Truck, label: 'Interstate Truck' },
  { name: 'Sofa', icon: Sofa, label: 'Furniture' },
  { name: 'PackageOpen', icon: PackageOpen, label: 'Packing' },
  { name: 'Warehouse', icon: Warehouse, label: 'Storage' },
  { name: 'ShieldCheck', icon: ShieldCheck, label: 'Insured' },
  { name: 'Users', icon: Users, label: 'Team' },
  { name: 'BadgeDollarSign', icon: BadgeDollarSign, label: 'Fixed Price' },
  { name: 'Route', icon: Route, label: 'Linehaul Route' },
  { name: 'Clock', icon: Clock, label: 'Express' },
  { name: 'HeartHandshake', icon: HeartHandshake, label: 'Care & Trust' },
]

const initialForm = {
  title: '',
  slug: '',
  short_description: '',
  content: '',
  icon: 'Truck',
  image: '',
  price: 0,
  status: 'active',

  // Hero Section
  heroTitle: '',
  heroSubtitle: '',
  heroDescription: '',
  heroImage: '',

  // About / Overview Section
  aboutTitle: '',
  aboutSubtitle: '',
  aboutDescription: '',
  aboutImage: '',

  // Features List
  features: [
    'Dedicated Interstate Moving Coordinator',
    'Comprehensive Goods in Transit Insurance',
    'GPS Tracked Direct Highway Transport',
  ],

  // Structured FAQs
  faqTitle: '',
  faqs: [
    { question: '', answer: '' },
    { question: '', answer: '' },
  ],

  // SEO
  seo: {
    h1: '',
    title: '',
    metaDescription: '',
    primaryKeyword: '',
    keywords: [],
    robots: 'index,follow',
    canonicalUrl: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    twitterTitle: '',
    twitterDescription: '',
    twitterImage: '',
  },
}

export default function ServiceFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('hero')
  const [previewDevice, setPreviewDevice] = useState('desktop')
  const [form, setForm] = useState(initialForm)

  useEffect(() => {
    if (isEditing) {
      loadService()
    }
  }, [id])

  const autoSlug = (str) =>
    (str || '')
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')

  const loadService = async () => {
    try {
      setLoading(true)
      const res = await serviceService.getServiceById(id)
      const data = res.data?.data || res.data || res

      let parsedFaqs = []
      if (Array.isArray(data.faqs) && data.faqs.length > 0) {
        parsedFaqs = data.faqs.map((f) => ({
          question: f.question || f.q || '',
          answer: f.answer || f.a || '',
        }))
      } else {
        parsedFaqs = [
          { question: `What is included in ${data.title || 'this service'}?`, answer: 'Our service includes full protective furniture wrapping, trained heavy-lifting removalists, transit insurance, and destination room placement.' },
          { question: 'Are my goods insured during transport?', answer: 'Yes, full goods-in-transit insurance coverage is included as standard with every booking.' },
        ]
      }

      setForm({
        title: data.title || '',
        slug: data.slug || '',
        short_description: data.short_description || data.description || '',
        content: data.content || data.longDescription || '',
        icon: data.icon || 'Truck',
        image: data.image || '',
        price: data.price || 0,
        status: data.status || 'active',

        // Hero
        heroTitle: data.heroTitle || '',
        heroSubtitle: data.heroSubtitle || '',
        heroDescription: data.heroDescription || '',
        heroImage: data.heroImage || '',

        // About
        aboutTitle: data.aboutTitle || '',
        aboutSubtitle: data.aboutSubtitle || '',
        aboutDescription: data.aboutDescription || '',
        aboutImage: data.aboutImage || '',

        // Features
        features: Array.isArray(data.features) && data.features.length > 0 ? data.features : initialForm.features,

        // FAQs
        faqTitle: data.faqTitle || '',
        faqs: parsedFaqs,

        // SEO
        seo: {
          ...initialForm.seo,
          ...(data.seo || {}),
          keywords: Array.isArray(data.seo?.keywords) ? data.seo.keywords : [],
        },
      })
    } catch (err) {
      console.error('Failed to load service:', err)
      toast.error('Failed to load service details')
      navigate('/cms/services')
    } finally {
      setLoading(false)
    }
  }

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

      const updated = { ...prev, [field]: value }
      if (field === 'title' && !isEditing && (!prev.slug || prev.slug === autoSlug(prev.title))) {
        updated.slug = autoSlug(value)
      }
      return updated
    })
  }

  // Feature Handlers
  const handleFeatureChange = (index, value) => {
    setForm((prev) => {
      const updated = [...prev.features]
      updated[index] = value
      return { ...prev, features: updated }
    })
  }

  const addFeature = () => {
    setForm((prev) => ({ ...prev, features: [...prev.features, ''] }))
  }

  const removeFeature = (index) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }))
  }

  // FAQ Handlers
  const handleFaqChange = (index, field, value) => {
    setForm((prev) => {
      const updated = [...prev.faqs]
      updated[index] = { ...updated[index], [field]: value }
      return { ...prev, faqs: updated }
    })
  }

  const addFaq = () => {
    setForm((prev) => ({
      ...prev,
      faqs: [...prev.faqs, { question: '', answer: '' }],
    }))
  }

  const removeFaq = (index) => {
    setForm((prev) => {
      const updated = prev.faqs.filter((_, i) => i !== index)
      return { ...prev, faqs: updated.length > 0 ? updated : [{ question: '', answer: '' }] }
    })
  }

  // SEO Score calculation
  const seoAudit = useMemo(() => {
    let score = 0
    const checks = []
    const warnings = []

    const title = form.seo.title || form.heroTitle || form.title || ''
    const desc = form.seo.metaDescription || form.short_description || form.heroDescription || ''
    const h1 = form.seo.h1 || form.heroTitle || form.title || ''
    const canonical = form.seo.canonicalUrl || (form.slug ? `/service/${form.slug}` : '')

    if (form.title && form.slug) {
      score += 15
      checks.push({ label: 'Valid Service Title & URL Slug', passed: true, score: 15 })
    } else {
      warnings.push('Title and URL slug are required.')
      checks.push({ label: 'Valid Service Title & URL Slug', passed: false, score: 0 })
    }

    if (title.length >= 40 && title.length <= 65) {
      score += 20
      checks.push({ label: `Meta Title Length (${title.length} chars - Optimal 50-60)`, passed: true, score: 20 })
    } else if (title.length > 0) {
      score += 12
      warnings.push(`Meta title is ${title.length} chars. Target 50-60.`)
      checks.push({ label: `Meta Title Length (${title.length} chars)`, passed: true, score: 12 })
    } else {
      warnings.push('Meta title is missing.')
      checks.push({ label: 'Meta Title Present', passed: false, score: 0 })
    }

    if (desc.length >= 120 && desc.length <= 165) {
      score += 20
      checks.push({ label: `Meta Description Length (${desc.length} chars - Optimal 140-160)`, passed: true, score: 20 })
    } else if (desc.length > 0) {
      score += 12
      warnings.push(`Meta description is ${desc.length} chars. Target 140-160.`)
      checks.push({ label: `Meta Description Length (${desc.length} chars)`, passed: true, score: 12 })
    } else {
      warnings.push('Meta description is missing.')
      checks.push({ label: 'Meta Description Present', passed: false, score: 0 })
    }

    if (h1 && h1.length >= 6) {
      score += 15
      checks.push({ label: 'H1 Main Heading Present', passed: true, score: 15 })
    } else {
      warnings.push('Missing H1 heading.')
      checks.push({ label: 'H1 Heading Present', passed: false, score: 0 })
    }

    const validFaqs = form.faqs.filter((f) => f.question?.trim() && f.answer?.trim())
    if (validFaqs.length >= 2) {
      score += 15
      checks.push({ label: `Service FAQs (${validFaqs.length} items for FAQPage Schema)`, passed: true, score: 15 })
    } else {
      warnings.push('Add at least 2 complete FAQs (Question & Answer) for Google FAQ Rich Snippets.')
      checks.push({ label: 'Service FAQs (Need >= 2 Q&A)', passed: false, score: 0 })
    }

    if (form.features.filter((f) => f.trim()).length >= 3) {
      score += 15
      checks.push({ label: 'Key Features / Capabilities Configured', passed: true, score: 15 })
    } else {
      checks.push({ label: 'Key Features / Capabilities', passed: false, score: 0 })
    }

    return {
      score: Math.min(100, score),
      warnings,
      checks,
    }
  }, [form])

  const handleSubmit = async (e) => {
    if (e) e.preventDefault()

    const serviceTitle = form.title.trim() || form.heroTitle.trim()

    if (!serviceTitle) {
      toast.error('Please enter a Service Title')
      return
    }

    const payload = {
      ...form,
      title: serviceTitle,
      slug: form.slug || autoSlug(serviceTitle),
      features: form.features.filter((f) => f && f.trim() !== ''),
      faqs: form.faqs
        .filter((f) => f.question?.trim() || f.answer?.trim())
        .map((f) => ({ question: (f.question || '').trim(), answer: (f.answer || '').trim() })),
    }

    try {
      setSaving(true)
      if (isEditing) {
        await serviceService.updateService(id, payload)
        toast.success('Service updated successfully!')
      } else {
        await serviceService.createService(payload)
        toast.success('Service created successfully!')
      }

      navigate('/cms/services')
    } catch (err) {
      console.error('Failed to save service:', err)
      const existingServiceId = err.response?.data?.data?._id
      if (!isEditing && err.response?.status === 409 && existingServiceId) {
        await serviceService.updateService(existingServiceId, payload)
        toast.success('Existing service updated successfully!')
        navigate('/cms/services')
        return
      }
      toast.error(err.response?.data?.message || 'Failed to save service.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#475569' }}>
        <Loader2 size={32} className="spinner" style={{ margin: '0 auto 12px' }} />
        <p>Loading service details...</p>
      </div>
    )
  }

  const previewCanonical = form.slug ? `/service/${form.slug}` : ''

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 16px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            type="button"
            onClick={() => navigate('/cms/services')}
            style={{
              background: '#fff',
              border: '1px solid #cbd5e1',
              borderRadius: 10,
              padding: '8px 12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 style={{ margin: 0, color: '#183149', fontSize: 28, display: 'flex', alignItems: 'center', gap: 10 }}>
              <Truck color="#0284c7" size={28} /> {isEditing ? `Edit Service SEO: ${form.title}` : 'Create Service Page & SEO'}
            </h1>
            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 13 }}>
              Configure localized H1/H2 headings, images, About section, FAQs, and Schema SEO for this service.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {form.slug && (
            <button
              type="button"
              onClick={() => window.open(`http://localhost:5173/service/${form.slug}?preview=true`, '_blank')}
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

      <form onSubmit={handleSubmit}>
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: 4, borderBottom: '2px solid #e2e8f0', marginBottom: 24, overflowX: 'auto' }}>
          {[
            { key: 'hero', label: '1. Hero Section (H1, H2 & Media)', icon: Monitor },
            { key: 'about', label: '2. About Service & Overview', icon: Info },
            { key: 'features', label: '3. Key Features & Capabilities', icon: Layers },
            { key: 'faqs', label: '4. Service FAQs', icon: HelpCircle },
            { key: 'seo', label: '5. SEO & Google SERP', icon: Globe },
            { key: 'basic', label: '6. Basic Info & Icon', icon: Truck },
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

        {/* Tab Content Box */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, padding: 24, marginBottom: 24 }}>
          {/* TAB 1: HERO SECTION */}
          {activeTab === 'hero' && (
            <div>
              <h2 style={sectionHeadingStyle}>Hero Section (H1, H2 Heading, Description & Image/Video)</h2>
              <p style={{ color: '#64748b', fontSize: 13, marginTop: -10, marginBottom: 20 }}>
                This is the top banner displayed when a customer visits this service's dedicated page.
              </p>

              <Field label="Hero H1 Main Heading *">
                <input
                  value={form.heroTitle}
                  onChange={(e) => handleChange('heroTitle', e.target.value)}
                  style={inputStyle}
                  placeholder={`e.g. Professional ${form.title || 'House Removalists'} Across Australia`}
                />
                <span style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>This will render as the bold H1 heading at the top.</span>
              </Field>

              <Field label="Hero H2 Subtitle / Slogan">
                <input
                  value={form.heroSubtitle}
                  onChange={(e) => handleChange('heroSubtitle', e.target.value)}
                  style={inputStyle}
                  placeholder="e.g. Reliable, fully-insured interstate relocation specialists with scheduled weekly linehaul services."
                />
              </Field>

              <Field label="Hero Description Paragraph">
                <textarea
                  value={form.heroDescription}
                  onChange={(e) => handleChange('heroDescription', e.target.value)}
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical' }}
                  placeholder="e.g. From careful packing to secure highway transport and unpacking at your new location, our experienced movers ensure a smooth, on-time transition."
                />
              </Field>

              <div style={{ marginTop: 16 }}>
                <MediaUploadInput
                  label="Hero Section Media (Upload Image or Video)"
                  value={form.heroImage}
                  onChange={(val) => handleChange('heroImage', val)}
                  accept="image/*,video/*"
                  allowVideo={true}
                  helperText="Upload an image (PNG, JPG, WEBP) or video (MP4, WebM) for the service page top banner."
                />
              </div>
            </div>
          )}

          {/* TAB 2: ABOUT SERVICE */}
          {activeTab === 'about' && (
            <div>
              <h2 style={sectionHeadingStyle}>Service Overview & Detailed Scope</h2>
              <p style={{ color: '#64748b', fontSize: 13, marginTop: -10, marginBottom: 20 }}>
                Detailed explanation of how this service is executed, equipment used, and quality standards.
              </p>

              <Field label="About Service Heading / Title">
                <input
                  value={form.aboutTitle}
                  onChange={(e) => handleChange('aboutTitle', e.target.value)}
                  style={inputStyle}
                  placeholder={`e.g. Full-Service ${form.title || 'Interstate Removals'} Tailored to Your Timeline`}
                />
              </Field>

              <Field label="About Service Subtitle">
                <input
                  value={form.aboutSubtitle}
                  onChange={(e) => handleChange('aboutSubtitle', e.target.value)}
                  style={inputStyle}
                  placeholder="e.g. Guaranteed fixed quotes, experienced personnel, and modern heavy-duty fleet."
                />
              </Field>

              <Field label="About Service Description (Full Paragraphs)">
                <textarea
                  value={form.aboutDescription}
                  onChange={(e) => handleChange('aboutDescription', e.target.value)}
                  rows={6}
                  style={{ ...inputStyle, resize: 'vertical' }}
                  placeholder={`e.g. At OZ Interstate Movers, our ${form.title || 'service'} provides comprehensive door-to-door relocation solutions. We handle everything from protective blanket wrapping and fragile item crating to direct linehaul freight and placement at your destination.`}
                />
              </Field>

              <div style={{ marginTop: 16 }}>
                <MediaUploadInput
                  label="About Service Image (Upload Image)"
                  value={form.aboutImage}
                  onChange={(val) => handleChange('aboutImage', val)}
                  accept="image/*"
                  allowVideo={false}
                  helperText="Upload a photo demonstrating your team, fleet, or equipment executing this service."
                />
              </div>
            </div>
          )}

          {/* TAB 3: KEY FEATURES */}
          {activeTab === 'features' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div>
                  <h2 style={{ ...sectionHeadingStyle, marginBottom: 4, borderBottom: 'none', paddingBottom: 0 }}>
                    Key Features & Inclusions
                  </h2>
                  <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>
                    Highlight what makes this service stand out. These will show on the service page and card pills.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addFeature}
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
                  <Plus size={15} /> Add Feature
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {form.features.map((feature, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleFeatureChange(idx, e.target.value)}
                      placeholder={`Feature #${idx + 1} (e.g. Comprehensive Goods in Transit Insurance)`}
                      style={{ ...inputStyle, padding: '10px 14px' }}
                    />
                    {form.features.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFeature(idx)}
                        style={{
                          background: '#fee2e2',
                          border: 'none',
                          color: '#b91c1c',
                          padding: 10,
                          borderRadius: 8,
                          cursor: 'pointer',
                        }}
                        title="Remove Feature"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SERVICE FAQS */}
          {activeTab === 'faqs' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <h2 style={{ ...sectionHeadingStyle, marginBottom: 4, borderBottom: 'none', paddingBottom: 0 }}>
                    Service FAQs (Questions & Answers)
                  </h2>
                  <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>
                    Enter questions and answers for this service. These will render in the interactive accordion and Google FAQPage Schema.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addFaq}
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
                    placeholder={`e.g. Frequently Asked Questions About ${form.title || 'Our Removals'}`}
                  />
                </Field>
              </div>

              {/* Structured FAQ Question & Answer Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {form.faqs.map((faq, idx) => (
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

                      {form.faqs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFaq(idx)}
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
                        placeholder={`e.g. How does the ${form.title || 'moving'} process work?`}
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
                        placeholder="e.g. Our removalist team handles protective packing, linehaul freight, through to destination placement."
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 18, textAlign: 'center' }}>
                <button
                  type="button"
                  onClick={addFaq}
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
                    {form.seo.title || form.heroTitle || `${form.title || 'Service'} | OZ-INTERSTATE`}
                  </div>
                  <div style={{ color: '#4d5156', fontSize: 13, marginTop: 4, lineHeight: 1.4 }}>
                    {form.seo.metaDescription || form.short_description || form.heroDescription || `Professional ${form.title || 'service'} services across Australia with guaranteed fixed rates and full transit insurance.`}
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
                <Field label="Primary SEO Keyword">
                  <input
                    value={form.seo.primaryKeyword}
                    onChange={(e) => handleChange('seo.primaryKeyword', e.target.value)}
                    style={inputStyle}
                    placeholder="e.g. Interstate House Removalists"
                  />
                </Field>

                <Field label="Meta Title (Optimal: 50-60 characters)">
                  <input
                    value={form.seo.title}
                    onChange={(e) => handleChange('seo.title', e.target.value)}
                    style={inputStyle}
                    placeholder={`e.g. ${form.title || 'House Removalists'} Australia | OZ-INTERSTATE`}
                  />
                  <span style={{ fontSize: 11, color: form.seo.title.length >= 40 && form.seo.title.length <= 65 ? '#166534' : '#ea580c', fontWeight: 600, marginTop: 3 }}>
                    {form.seo.title.length}/60 characters {form.seo.title.length < 40 ? '(short)' : form.seo.title.length > 65 ? '(long)' : '✓ Optimal'}
                  </span>
                </Field>
              </div>

              <Field label="Meta Description (Optimal: 140-160 characters)">
                <textarea
                  value={form.seo.metaDescription}
                  onChange={(e) => handleChange('seo.metaDescription', e.target.value)}
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical' }}
                  placeholder={`e.g. Professional ${form.title || 'moving'} solutions with scheduled interstate highway linehaul routes, trained moving crews, and comprehensive transit insurance cover.`}
                />
                <span style={{ fontSize: 11, color: form.seo.metaDescription.length >= 120 && form.seo.metaDescription.length <= 165 ? '#166534' : '#ea580c', fontWeight: 600, marginTop: 3 }}>
                  {form.seo.metaDescription.length}/160 characters {form.seo.metaDescription.length < 120 ? '(short)' : form.seo.metaDescription.length > 165 ? '(long)' : '✓ Optimal'}
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
                  helperText="Recommended 1200x630 image for Facebook, LinkedIn, and WhatsApp link previews."
                />
              </div>
            </div>
          )}

          {/* TAB 6: BASIC DETAILS & SETTINGS */}
          {activeTab === 'basic' && (
            <div>
              <h2 style={sectionHeadingStyle}>Service Details, Icon & Settings</h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
                <Field label="Service Title *">
                  <input
                    value={form.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    required
                    style={inputStyle}
                    placeholder="e.g. House Removalists"
                  />
                </Field>

                <Field label="URL Slug * (Lowercase & URL-safe)">
                  <input
                    value={form.slug}
                    onChange={(e) => handleChange('slug', autoSlug(e.target.value))}
                    required
                    style={inputStyle}
                    placeholder="e.g. house-removalists"
                  />
                  <span style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>Public URL: /service/{form.slug || 'service-name'}</span>
                </Field>
              </div>

              <Field label="Short Teaser Description (Homepage & Services List Cards)">
                <textarea
                  value={form.short_description}
                  onChange={(e) => handleChange('short_description', e.target.value)}
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical' }}
                  placeholder="End-to-end home moves with careful handling, protective blankets, and a dedicated move coordinator..."
                />
              </Field>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginTop: 18 }}>
                <Field label="Status">
                  <select
                    value={form.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                    style={inputStyle}
                  >
                    <option value="active">Active (Visible on Website)</option>
                    <option value="inactive">Inactive (Hidden)</option>
                  </select>
                </Field>

                <Field label="Starting Price ($ AUD, Optional)">
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => handleChange('price', Number(e.target.value))}
                    style={inputStyle}
                    placeholder="0"
                  />
                </Field>
              </div>

              {/* Visual Icon Picker */}
              <div style={{ marginTop: 22 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 10 }}>
                  Choose Service Icon
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10 }}>
                  {AVAILABLE_ICONS.map((item) => {
                    const IconComponent = item.icon
                    const isSelected = form.icon === item.name
                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => handleChange('icon', item.name)}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 6,
                          padding: '12px 8px',
                          borderRadius: 12,
                          border: isSelected ? '2px solid #0284c7' : '1px solid #e2e8f0',
                          background: isSelected ? '#e0f2fe' : '#f8fafc',
                          color: isSelected ? '#0369a1' : '#475569',
                          cursor: 'pointer',
                          fontSize: 12,
                          fontWeight: isSelected ? 700 : 500,
                        }}
                      >
                        <IconComponent size={22} />
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
                          {item.label}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions Bar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, flexWrap: 'wrap', borderTop: '1px solid #e2e8f0', paddingTop: 20 }}>
          <button
            type="button"
            onClick={() => navigate('/cms/services')}
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
            {saving ? 'Saving Service...' : isEditing ? 'Update Service & Sync SEO' : 'Publish New Service Page'}
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
