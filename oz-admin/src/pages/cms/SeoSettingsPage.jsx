import { useState, useEffect } from 'react'
import { Save, Loader2, Search, Globe, Share2, Code, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import seoSettingsService from '../../services/seoSettingsService'
import '../banners/Banners.css'

export default function SeoSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('general')

  const [formData, setFormData] = useState({
    defaultTitle: '',
    titleTemplate: '',
    defaultMetaDescription: '',
    defaultKeywords: '',
    defaultRobots: 'index,follow',
    defaultCanonical: '',
    defaultOgTitle: '',
    defaultOgDescription: '',
    defaultOgImage: '',
    defaultTwitterTitle: '',
    defaultTwitterDescription: '',
    defaultTwitterImage: '',
    googleSiteVerification: '',
    bingSiteVerification: '',
    googleAnalyticsId: '',
    googleTagManagerId: ''
  })

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)
      const res = await seoSettingsService.getSeoSettings()
      const data = res.data?.data || res.data || res
      
      if (data) {
        setFormData({
          defaultTitle: data.defaultTitle || '',
          titleTemplate: data.titleTemplate || '',
          defaultMetaDescription: data.defaultMetaDescription || '',
          defaultKeywords: Array.isArray(data.defaultKeywords) ? data.defaultKeywords.join(', ') : (data.defaultKeywords || ''),
          defaultRobots: data.defaultRobots || 'index,follow',
          defaultCanonical: data.defaultCanonical || '',
          defaultOgTitle: data.defaultOgTitle || '',
          defaultOgDescription: data.defaultOgDescription || '',
          defaultOgImage: data.defaultOgImage || '',
          defaultTwitterTitle: data.defaultTwitterTitle || '',
          defaultTwitterDescription: data.defaultTwitterDescription || '',
          defaultTwitterImage: data.defaultTwitterImage || '',
          googleSiteVerification: data.googleSiteVerification || '',
          bingSiteVerification: data.bingSiteVerification || '',
          googleAnalyticsId: data.googleAnalyticsId || '',
          googleTagManagerId: data.googleTagManagerId || ''
        })
      }
    } catch (err) {
      console.error('Failed to load SEO settings:', err)
      toast.error('Failed to load SEO settings')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      
      const payload = { ...formData }
      if (payload.defaultKeywords && typeof payload.defaultKeywords === 'string') {
        payload.defaultKeywords = payload.defaultKeywords.split(',').map(k => k.trim()).filter(Boolean)
      }

      await seoSettingsService.updateSeoSettings(payload)
      toast.success('SEO settings saved successfully')
    } catch (err) {
      console.error('Failed to save SEO settings:', err)
      toast.error('Failed to save SEO settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="banner-page-container">
        <div className="banner-loading-state">
          <Loader2 size={32} className="spinner" />
          <p>Loading SEO Settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="banner-page-container">
      {/* Top Header */}
      <div className="banner-form-topbar">
        <div>
          <h1 className="banner-page-title">Global SEO Settings</h1>
          <p className="banner-page-subtitle">Configure search engine indexing, metadata defaults, social previews, and tracking codes.</p>
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="banner-add-button"
        >
          {saving ? <Loader2 size={16} className="spinner" /> : <Save size={16} />}
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      <div className="banner-form-main-card">
        {/* Navigation Tabs */}
        <div className="form-tabs-header">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => setActiveTab('general')}
          >
            <Search size={16} /> General SEO Defaults
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'social' ? 'active' : ''}`}
            onClick={() => setActiveTab('social')}
          >
            <Share2 size={16} /> Social Sharing (OG / Twitter)
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'tracking' ? 'active' : ''}`}
            onClick={() => setActiveTab('tracking')}
          >
            <Code size={16} /> Verification & Analytics
          </button>
        </div>

        {/* Tab Content Form */}
        <form onSubmit={handleSubmit} className="banner-form-body">
          {activeTab === 'general' && (
            <div>
              <div className="form-row">
                <div className="form-group col-half">
                  <label className="required">Default Website Title</label>
                  <input
                    type="text"
                    name="defaultTitle"
                    value={formData.defaultTitle}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g. OZ Interstate - Professional Removalists"
                    required
                  />
                </div>
                <div className="form-group col-half">
                  <label className="required">Title Template</label>
                  <input
                    type="text"
                    name="titleTemplate"
                    value={formData.titleTemplate}
                    onChange={handleChange}
                    className="form-input font-mono"
                    placeholder="e.g. %s | OZ Interstate"
                    required
                  />
                  <small style={{ color: '#64748b', fontSize: '12px' }}>Use <code>%s</code> as placeholder for the page title.</small>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-full">
                  <label>Default Meta Description</label>
                  <textarea
                    name="defaultMetaDescription"
                    value={formData.defaultMetaDescription}
                    onChange={handleChange}
                    className="form-textarea"
                    rows={3}
                    placeholder="Enter default meta description for search engines..."
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-full">
                  <label>Default Meta Keywords</label>
                  <input
                    type="text"
                    name="defaultKeywords"
                    value={formData.defaultKeywords}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g. interstate movers, freight australia, removalists (comma separated)"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-half">
                  <label>Robots Directive</label>
                  <select
                    name="defaultRobots"
                    value={formData.defaultRobots}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="index,follow">index, follow (Recommended)</option>
                    <option value="noindex,follow">noindex, follow</option>
                    <option value="index,nofollow">index, nofollow</option>
                    <option value="noindex,nofollow">noindex, nofollow</option>
                  </select>
                </div>
                <div className="form-group col-half">
                  <label>Default Canonical URL</label>
                  <input
                    type="text"
                    name="defaultCanonical"
                    value={formData.defaultCanonical}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="https://oz-interstate.com.au"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'social' && (
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>
                Open Graph Settings (Facebook, LinkedIn, WhatsApp)
              </h3>
              <div className="form-row">
                <div className="form-group col-half">
                  <label>OG Title</label>
                  <input
                    type="text"
                    name="defaultOgTitle"
                    value={formData.defaultOgTitle}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g. OZ Interstate Movers"
                  />
                </div>
                <div className="form-group col-half">
                  <label>OG Image URL</label>
                  <input
                    type="text"
                    name="defaultOgImage"
                    value={formData.defaultOgImage}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="https://.../og-image.jpg"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-full">
                  <label>OG Description</label>
                  <textarea
                    name="defaultOgDescription"
                    value={formData.defaultOgDescription}
                    onChange={handleChange}
                    className="form-textarea"
                    rows={2}
                    placeholder="Enter social sharing description..."
                  />
                </div>
              </div>

              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', margin: '24px 0 16px 0', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>
                Twitter Cards Settings
              </h3>
              <div className="form-row">
                <div className="form-group col-half">
                  <label>Twitter Title</label>
                  <input
                    type="text"
                    name="defaultTwitterTitle"
                    value={formData.defaultTwitterTitle}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g. OZ Interstate Movers"
                  />
                </div>
                <div className="form-group col-half">
                  <label>Twitter Image URL</label>
                  <input
                    type="text"
                    name="defaultTwitterImage"
                    value={formData.defaultTwitterImage}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="https://.../twitter-card.jpg"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-full">
                  <label>Twitter Description</label>
                  <textarea
                    name="defaultTwitterDescription"
                    value={formData.defaultTwitterDescription}
                    onChange={handleChange}
                    className="form-textarea"
                    rows={2}
                    placeholder="Enter Twitter sharing card description..."
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tracking' && (
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>
                Search Console Verification
              </h3>
              <div className="form-row">
                <div className="form-group col-half">
                  <label>Google Site Verification Meta / Token</label>
                  <input
                    type="text"
                    name="googleSiteVerification"
                    value={formData.googleSiteVerification}
                    onChange={handleChange}
                    className="form-input font-mono"
                    placeholder="e.g. abcdef1234567890"
                  />
                </div>
                <div className="form-group col-half">
                  <label>Bing Site Verification Code</label>
                  <input
                    type="text"
                    name="bingSiteVerification"
                    value={formData.bingSiteVerification}
                    onChange={handleChange}
                    className="form-input font-mono"
                    placeholder="e.g. 1234567890ABCDEF"
                  />
                </div>
              </div>

              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', margin: '24px 0 16px 0', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>
                Analytics & Tracking IDs
              </h3>
              <div className="form-row">
                <div className="form-group col-half">
                  <label>Google Analytics 4 Measurement ID (GA4)</label>
                  <input
                    type="text"
                    name="googleAnalyticsId"
                    value={formData.googleAnalyticsId}
                    onChange={handleChange}
                    className="form-input font-mono"
                    placeholder="e.g. G-XXXXXXXXXX"
                  />
                </div>
                <div className="form-group col-half">
                  <label>Google Tag Manager ID (GTM)</label>
                  <input
                    type="text"
                    name="googleTagManagerId"
                    value={formData.googleTagManagerId}
                    onChange={handleChange}
                    className="form-input font-mono"
                    placeholder="e.g. GTM-XXXXXXX"
                  />
                </div>
              </div>
            </div>
          )}

          <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              disabled={saving}
              className="banner-add-button"
            >
              {saving ? <Loader2 size={16} className="spinner" /> : <Save size={16} />}
              {saving ? 'Saving Changes...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
