import { useState, useEffect } from 'react'
import { Save, Loader2, Building, Phone, Globe, Share2 } from 'lucide-react'
import toast from 'react-hot-toast'
import siteSettingsService from '../../services/siteSettingsService'
import MediaUploadInput from '../../components/common/MediaUploadInput'
import '../banners/Banners.css'

export default function SiteSettingsPage() {
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('general')

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const res = await siteSettingsService.getSiteSettings()
      const data = res.data?.data || res.data || res || {}
      setSettings(data)
    } catch (error) {
      console.error('Failed to fetch site settings', error)
      toast.error('Failed to load site settings')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith('social.')) {
      const field = name.split('.')[1]
      setSettings((prev) => ({
        ...prev,
        social: { ...prev.social, [field]: value }
      }))
    } else if (name.startsWith('globalCta.')) {
      const field = name.split('.')[1]
      setSettings((prev) => ({
        ...prev,
        globalCta: { ...prev.globalCta, [field]: value }
      }))
    } else if (name.startsWith('aboutSection.')) {
      const field = name.split('.')[1]
      setSettings((prev) => ({
        ...prev,
        aboutSection: { ...prev.aboutSection, [field]: value }
      }))
    } else {
      setSettings((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await siteSettingsService.updateSiteSettings(settings)
      toast.success('Site settings saved successfully!')
    } catch (error) {
      console.error('Failed to update settings', error)
      toast.error('Failed to save settings.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="banner-page-container">
        <div className="banner-loading-state">
          <Loader2 size={32} className="spinner" />
          <p>Loading site settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="banner-page-container">
      <div className="banner-form-topbar">
        <div>
          <h1 className="banner-page-title">Site Settings & Branding</h1>
          <p className="banner-page-subtitle">Configure company details, branding, contact info, and social links.</p>
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
            <Building size={16} /> Company & Branding
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'contact' ? 'active' : ''}`}
            onClick={() => setActiveTab('contact')}
          >
            <Phone size={16} /> Contact Information
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'social' ? 'active' : ''}`}
            onClick={() => setActiveTab('social')}
          >
            <Share2 size={16} /> Social Media Profiles
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'cta' ? 'active' : ''}`}
            onClick={() => setActiveTab('cta')}
          >
            <Globe size={16} /> Global Call to Action (CTA)
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            <Building size={16} /> About Us Section
          </button>
        </div>

        <form onSubmit={handleSubmit} className="banner-form-body">
          {activeTab === 'general' && (
            <div>
              <div className="form-row">
                <div className="form-group col-half">
                  <label className="required">Brand / Site Name</label>
                  <input
                    type="text"
                    name="siteName"
                    value={settings.siteName || ''}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g. OZ Interstate Movers"
                    required
                  />
                </div>
                <div className="form-group col-half">
                  <label>Legal Company Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={settings.fullName || ''}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g. OZ Interstate Freight Pty Ltd"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-full">
                  <label>Tagline / Motto</label>
                  <input
                    type="text"
                    name="tagline"
                    value={settings.tagline || ''}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g. Australia's Most Trusted Interstate Moving & Freight Service"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-half">
                  <label>Logo Image URL</label>
                  <input
                    type="text"
                    name="logo"
                    value={settings.logo || ''}
                    onChange={handleChange}
                    className="form-input text-mono"
                    placeholder="https://.../logo.png"
                  />
                </div>
                <div className="form-group col-half">
                  <label>Favicon URL</label>
                  <input
                    type="text"
                    name="favicon"
                    value={settings.favicon || ''}
                    onChange={handleChange}
                    className="form-input text-mono"
                    placeholder="https://.../favicon.ico"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-half">
                  <label>Australian Business Number (ABN)</label>
                  <input
                    type="text"
                    name="abn"
                    value={settings.abn || ''}
                    onChange={handleChange}
                    className="form-input font-mono"
                    placeholder="XX XXX XXX XXX"
                  />
                </div>
                <div className="form-group col-half">
                  <label>Copyright Footer Text</label>
                  <input
                    type="text"
                    name="copyrightText"
                    value={settings.copyrightText || ''}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="© 2026 OZ Interstate Movers. All rights reserved."
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div>
              <div className="form-row">
                <div className="form-group col-half">
                  <label className="required">Primary Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={settings.phone || ''}
                    onChange={handleChange}
                    className="form-input font-bold"
                    placeholder="1300 XXX XXX"
                    required
                  />
                </div>
                <div className="form-group col-half">
                  <label>Emergency / After-hours Phone</label>
                  <input
                    type="text"
                    name="emergencyPhone"
                    value={settings.emergencyPhone || ''}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="+61 4XX XXX XXX"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-half">
                  <label className="required">Contact Email</label>
                  <input
                    type="email"
                    name="email"
                    value={settings.email || ''}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="info@oz-interstate.com.au"
                    required
                  />
                </div>
                <div className="form-group col-half">
                  <label>Alternate / Support Email</label>
                  <input
                    type="email"
                    name="alternateEmail"
                    value={settings.alternateEmail || ''}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="support@oz-interstate.com.au"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-full">
                  <label>Headquarters Physical Address</label>
                  <input
                    type="text"
                    name="address"
                    value={settings.address || ''}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g. 123 Logistics Way, Melbourne VIC 3000"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-half">
                  <label>Opening Hours</label>
                  <input
                    type="text"
                    name="openingHours"
                    value={settings.openingHours || ''}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Mon - Sun: 7:00 AM - 8:00 PM"
                  />
                </div>
                <div className="form-group col-half">
                  <label>Google Maps Embed / Link URL</label>
                  <input
                    type="text"
                    name="mapUrl"
                    value={settings.mapUrl || ''}
                    onChange={handleChange}
                    className="form-input font-mono"
                    placeholder="https://maps.google.com/..."
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'social' && (
            <div>
              <div className="form-row">
                <div className="form-group col-half">
                  <label>Facebook URL</label>
                  <input
                    type="text"
                    name="social.facebook"
                    value={settings.social?.facebook || ''}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="https://facebook.com/ozinterstate"
                  />
                </div>
                <div className="form-group col-half">
                  <label>Instagram URL</label>
                  <input
                    type="text"
                    name="social.instagram"
                    value={settings.social?.instagram || ''}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="https://instagram.com/ozinterstate"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-half">
                  <label>LinkedIn URL</label>
                  <input
                    type="text"
                    name="social.linkedin"
                    value={settings.social?.linkedin || ''}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="https://linkedin.com/company/ozinterstate"
                  />
                </div>
                <div className="form-group col-half">
                  <label>Twitter / X URL</label>
                  <input
                    type="text"
                    name="social.twitter"
                    value={settings.social?.twitter || ''}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="https://x.com/ozinterstate"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-half">
                  <label>YouTube Channel URL</label>
                  <input
                    type="text"
                    name="social.youtube"
                    value={settings.social?.youtube || ''}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="https://youtube.com/@ozinterstate"
                  />
                </div>
                <div className="form-group col-half">
                  <label>WhatsApp Number / Link</label>
                  <input
                    type="text"
                    name="social.whatsapp"
                    value={settings.social?.whatsapp || ''}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="https://wa.me/614XXXXXXXX"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cta' && (
            <div>
              <div className="form-row">
                <div className="form-group col-full">
                  <label>Footer CTA Heading Title</label>
                  <input
                    type="text"
                    name="globalCta.title"
                    value={settings.globalCta?.title || ''}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Ready for a Hassle-Free Interstate Move?"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-full">
                  <label>Footer CTA Subtitle / Description</label>
                  <textarea
                    name="globalCta.description"
                    value={settings.globalCta?.description || ''}
                    onChange={handleChange}
                    rows={3}
                    className="form-textarea"
                    placeholder="Get a fast and transparent quote in under 2 minutes with OZ Interstate Movers."
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-half">
                  <label>Primary Button Text</label>
                  <input
                    type="text"
                    name="globalCta.buttonText"
                    value={settings.globalCta?.buttonText || ''}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Get Instant Quote"
                  />
                </div>
                <div className="form-group col-half">
                  <label>Primary Button URL</label>
                  <input
                    type="text"
                    name="globalCta.buttonUrl"
                    value={settings.globalCta?.buttonUrl || ''}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="/quote"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div>
              <div className="form-row">
                <div className="form-group col-half">
                  <label>About Section Title</label>
                  <input
                    type="text"
                    name="aboutSection.title"
                    value={settings.aboutSection?.title || ''}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Decades of Interstate Moving Excellence Across Australia"
                  />
                </div>
                <div className="form-group col-half">
                  <label>About Section Subtitle</label>
                  <input
                    type="text"
                    name="aboutSection.subtitle"
                    value={settings.aboutSection?.subtitle || ''}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Australia's Trusted Linehaul & Residential Relocation Specialists"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-full">
                  <label>About Section Description</label>
                  <textarea
                    name="aboutSection.description"
                    value={settings.aboutSection?.description || ''}
                    onChange={handleChange}
                    rows={5}
                    className="form-textarea"
                    placeholder="Tell visitors about your company and moving expertise."
                  />
                </div>
              </div>
              <MediaUploadInput
                label="About Section Image"
                value={settings.aboutSection?.image || ''}
                onChange={(image) => setSettings((prev) => ({ ...prev, aboutSection: { ...prev.aboutSection, image } }))}
                accept="image/*"
                allowVideo={false}
                helperText="Upload the image displayed in the public About Us section."
              />
              <div className="form-row" style={{ marginTop: 16 }}>
                <div className="form-group col-half">
                  <label>Primary Button Text</label>
                  <input type="text" name="aboutSection.primaryButtonText" value={settings.aboutSection?.primaryButtonText || ''} onChange={handleChange} className="form-input" placeholder="Get Free Moving Estimate" />
                </div>
                <div className="form-group col-half">
                  <label>Primary Button URL</label>
                  <input type="text" name="aboutSection.primaryButtonUrl" value={settings.aboutSection?.primaryButtonUrl || ''} onChange={handleChange} className="form-input" placeholder="#quote" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-half">
                  <label>Secondary Button Text</label>
                  <input type="text" name="aboutSection.secondaryButtonText" value={settings.aboutSection?.secondaryButtonText || ''} onChange={handleChange} className="form-input" placeholder="All Services" />
                </div>
                <div className="form-group col-half">
                  <label>Secondary Button URL</label>
                  <input type="text" name="aboutSection.secondaryButtonUrl" value={settings.aboutSection?.secondaryButtonUrl || ''} onChange={handleChange} className="form-input" placeholder="/services" />
                </div>
              </div>
              <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
                <button type="button" className="action-btn delete-btn" onClick={() => setSettings((prev) => ({ ...prev, aboutSection: { title: '', subtitle: '', description: '', image: '', primaryButtonText: '', primaryButtonUrl: '', secondaryButtonText: '', secondaryButtonUrl: '' } }))} title="Clear About section content" style={{ width: 'auto', minWidth: 150, minHeight: 38, padding: '8px 14px', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  Clear About Section
                </button>
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
