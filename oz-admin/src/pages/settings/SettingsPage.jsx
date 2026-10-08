import { useState, useEffect } from 'react'
import { Save, Loader2, Settings, ShieldAlert, Bell, Sliders, Server, Lock, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import siteSettingsService from '../../services/siteSettingsService'
import '../banners/Banners.css'

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('general')

  const [formData, setFormData] = useState({
    siteName: 'OZ Interstate Movers',
    fullName: 'OZ Interstate Movers',
    phone: '1300 668 254',
    phoneHref: 'tel:1300668254',
    emergencyPhone: '0411 555 880',
    emergencyPhoneHref: 'tel:0411555880',
    email: 'hello@ozinterstate.com.au',
    emailHref: 'mailto:hello@ozinterstate.com.au',
    address: '24 Logistics Way, Port Melbourne, VIC 3207, Australia',
    openingHours: 'Mon–Sat: 7am – 7pm AEST',
    mapUrl: '',
    social: {
      facebook: '',
      instagram: '',
      linkedin: '',
      twitter: '',
      youtube: '',
      whatsapp: ''
    },
    currency: 'AUD ($)',
    timezone: 'Australia/Sydney',
    maintenanceMode: false,
    maintenanceMessage: 'Our website is undergoing scheduled maintenance. Please call 1300 XXX XXX for immediate quotes.',
    emailNotifications: true,
    smsNotifications: false,
    adminNotificationEmail: 'admin@oz-interstate.com.au',
    sessionTimeoutMinutes: 60,
    enable2FA: false,
    quoteAutoExpiryDays: 14,
    googleMapsApiKey: 'AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXX',
    stripePublishableKey: 'pk_live_XXXXXXXXXXXXXXXXXXXXXXXXX'
  })

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)
      const res = await siteSettingsService.getSiteSettings()
      const data = res.data?.data || res.data || res || {}
      setFormData(prev => ({
        ...prev,
        siteName: data.siteName || prev.siteName,
        fullName: data.fullName || prev.fullName,
        phone: data.phone || prev.phone,
        phoneHref: data.phoneHref || prev.phoneHref,
        emergencyPhone: data.emergencyPhone || prev.emergencyPhone,
        emergencyPhoneHref: data.emergencyPhoneHref || prev.emergencyPhoneHref,
        email: data.email || prev.email,
        emailHref: data.emailHref || prev.emailHref,
        address: data.address || prev.address,
        openingHours: data.openingHours || prev.openingHours,
        mapUrl: data.mapUrl || prev.mapUrl,
        social: {
          ...prev.social,
          ...(data.social || {}),
        },
        currency: data.currency || prev.currency,
        timezone: data.timezone || prev.timezone,
        adminNotificationEmail: data.email || prev.adminNotificationEmail,
      }))
    } catch (err) {
      console.error('Failed to load settings:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      // Save to backend site settings
      await siteSettingsService.updateSiteSettings({
        siteName: formData.siteName,
        fullName: formData.fullName,
        phone: formData.phone,
        phoneHref: formData.phoneHref || `tel:${String(formData.phone || '').replace(/\s+/g, '')}`,
        emergencyPhone: formData.emergencyPhone,
        emergencyPhoneHref: formData.emergencyPhoneHref || `tel:${String(formData.emergencyPhone || '').replace(/\s+/g, '')}`,
        email: formData.email,
        emailHref: formData.emailHref || `mailto:${formData.email || ''}`,
        address: formData.address,
        openingHours: formData.openingHours,
        mapUrl: formData.mapUrl,
        currency: formData.currency,
        timezone: formData.timezone,
        social: {
          facebook: formData.social.facebook,
          instagram: formData.social.instagram,
          linkedin: formData.social.linkedin,
          twitter: formData.social.twitter,
          youtube: formData.social.youtube,
          whatsapp: formData.social.whatsapp,
        },
      })
      toast.success('System settings saved successfully!')
    } catch (err) {
      console.error('Failed to save settings:', err)
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="banner-page-container">
        <div className="banner-loading-state">
          <Loader2 size={32} className="spinner" />
          <p>Loading system settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="banner-page-container">
      {/* Header */}
      <div className="banner-form-topbar">
        <div>
          <h1 className="banner-page-title">System & Business Settings</h1>
          <p className="banner-page-subtitle">Configure application defaults, alert rules, security policies, and integrations.</p>
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
            <Sliders size={16} /> Regional & General
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <Bell size={16} /> Notification Rules
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <Lock size={16} /> Security & Session
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'maintenance' ? 'active' : ''}`}
            onClick={() => setActiveTab('maintenance')}
          >
            <ShieldAlert size={16} /> Maintenance Mode
          </button>
        </div>

        <form onSubmit={handleSubmit} className="banner-form-body">
          {activeTab === 'general' && (
            <div>
              <div className="form-row">
                <div className="form-group col-half">
                  <label className="required">System Currency</label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="form-select font-bold"
                  >
                    <option value="AUD ($)">AUD ($) - Australian Dollar</option>
                    <option value="NZD ($)">NZD ($) - New Zealand Dollar</option>
                    <option value="USD ($)">USD ($) - US Dollar</option>
                  </select>
                </div>
                <div className="form-group col-half">
                  <label className="required">Default Timezone</label>
                  <select
                    name="timezone"
                    value={formData.timezone}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="Australia/Sydney">Australia/Sydney (AEST/AEDT)</option>
                    <option value="Australia/Melbourne">Australia/Melbourne</option>
                    <option value="Australia/Brisbane">Australia/Brisbane (AEST)</option>
                    <option value="Australia/Adelaide">Australia/Adelaide (ACST)</option>
                    <option value="Australia/Perth">Australia/Perth (AWST)</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-half">
                  <label>Business Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
                <div className="form-group col-half">
                  <label>Main Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-half">
                  <label>Emergency Phone</label>
                  <input
                    type="text"
                    name="emergencyPhone"
                    value={formData.emergencyPhone}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
                <div className="form-group col-half">
                  <label>Primary Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-full">
                  <label>Business Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    className="form-textarea"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-half">
                  <label>Opening Hours</label>
                  <input
                    type="text"
                    name="openingHours"
                    value={formData.openingHours}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
                <div className="form-group col-half">
                  <label>Map Embed URL</label>
                  <input
                    type="url"
                    name="mapUrl"
                    value={formData.mapUrl}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="https://maps.google.com/..."
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-half">
                  <label>Quote Validity Window (Days)</label>
                  <input
                    type="number"
                    name="quoteAutoExpiryDays"
                    value={formData.quoteAutoExpiryDays}
                    onChange={handleChange}
                    className="form-input"
                  />
                  <small style={{ color: '#64748b', fontSize: '12px' }}>Quotes will automatically expire after these many days if not confirmed.</small>
                </div>
                <div className="form-group col-half">
                  <label>System Platform Status</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: '#dcfce7', borderRadius: '10px', color: '#15803d', fontWeight: '700', fontSize: '14px' }}>
                    <CheckCircle2 size={18} /> All API Services Operational
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <div className="form-row">
                <div className="form-group col-full">
                  <label className="required">Admin Notification Recipient Email</label>
                  <input
                    type="email"
                    name="adminNotificationEmail"
                    value={formData.adminNotificationEmail}
                    onChange={handleChange}
                    className="form-input font-bold"
                    placeholder="alerts@oz-interstate.com.au"
                  />
                  <small style={{ color: '#64748b', fontSize: '12px' }}>New quote requests and customer inquiries will trigger instant notifications to this address.</small>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-full">
                  <label>Facebook URL</label>
                  <input type="url" name="social.facebook" value={formData.social.facebook} onChange={(e) => setFormData(prev => ({ ...prev, social: { ...prev.social, facebook: e.target.value } }))} className="form-input" placeholder="https://facebook.com/" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-half">
                  <label>Instagram URL</label>
                  <input type="url" name="social.instagram" value={formData.social.instagram} onChange={(e) => setFormData(prev => ({ ...prev, social: { ...prev.social, instagram: e.target.value } }))} className="form-input" placeholder="https://instagram.com/" />
                </div>
                <div className="form-group col-half">
                  <label>LinkedIn URL</label>
                  <input type="url" name="social.linkedin" value={formData.social.linkedin} onChange={(e) => setFormData(prev => ({ ...prev, social: { ...prev.social, linkedin: e.target.value } }))} className="form-input" placeholder="https://linkedin.com/company/" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-half">
                  <label>Twitter URL</label>
                  <input type="url" name="social.twitter" value={formData.social.twitter} onChange={(e) => setFormData(prev => ({ ...prev, social: { ...prev.social, twitter: e.target.value } }))} className="form-input" placeholder="https://twitter.com/" />
                </div>
                <div className="form-group col-half">
                  <label>YouTube URL</label>
                  <input type="url" name="social.youtube" value={formData.social.youtube} onChange={(e) => setFormData(prev => ({ ...prev, social: { ...prev.social, youtube: e.target.value } }))} className="form-input" placeholder="https://youtube.com/" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-full">
                  <label>WhatsApp Number</label>
                  <input type="text" name="social.whatsapp" value={formData.social.whatsapp} onChange={(e) => setFormData(prev => ({ ...prev, social: { ...prev.social, whatsapp: e.target.value } }))} className="form-input" placeholder="61400000000" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-full" style={{ flexDirection: 'row', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                  <input
                    type="checkbox"
                    id="emailNotifications"
                    name="emailNotifications"
                    checked={formData.emailNotifications}
                    onChange={handleChange}
                    style={{ width: '20px', height: '20px', accentColor: '#0284c7' }}
                  />
                  <div>
                    <label htmlFor="emailNotifications" style={{ margin: 0, cursor: 'pointer', fontWeight: '700' }}>Instant Email Alerts on New Quote</label>
                    <span style={{ display: 'block', fontSize: '12px', color: '#64748b' }}>Receive instant email when a customer submits an interstate quote form.</span>
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-full" style={{ flexDirection: 'row', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                  <input
                    type="checkbox"
                    id="smsNotifications"
                    name="smsNotifications"
                    checked={formData.smsNotifications}
                    onChange={handleChange}
                    style={{ width: '20px', height: '20px', accentColor: '#0284c7' }}
                  />
                  <div>
                    <label htmlFor="smsNotifications" style={{ margin: 0, cursor: 'pointer', fontWeight: '700' }}>SMS Alerts on Emergency Bookings</label>
                    <span style={{ display: 'block', fontSize: '12px', color: '#64748b' }}>Send SMS alerts to dispatch manager for next-day or urgent moves.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div>
              <div className="form-row">
                <div className="form-group col-half">
                  <label>Admin Session Idle Timeout (Minutes)</label>
                  <input
                    type="number"
                    name="sessionTimeoutMinutes"
                    value={formData.sessionTimeoutMinutes}
                    onChange={handleChange}
                    className="form-input font-bold"
                  />
                </div>
                <div className="form-group col-half">
                  <label>Password Expiration Policy</label>
                  <select className="form-select">
                    <option>Never Expire</option>
                    <option>Every 90 Days</option>
                    <option>Every 180 Days</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-full" style={{ flexDirection: 'row', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                  <input
                    type="checkbox"
                    id="enable2FA"
                    name="enable2FA"
                    checked={formData.enable2FA}
                    onChange={handleChange}
                    style={{ width: '20px', height: '20px', accentColor: '#0284c7' }}
                  />
                  <div>
                    <label htmlFor="enable2FA" style={{ margin: 0, cursor: 'pointer', fontWeight: '700' }}>Enforce Two-Factor Authentication (2FA) for Super Admins</label>
                    <span style={{ display: 'block', fontSize: '12px', color: '#64748b' }}>Require OTP verification on login from unknown IP addresses.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'maintenance' && (
            <div>
              <div style={{ padding: '16px', background: formData.maintenanceMode ? '#fef2f2' : '#f8fafc', borderRadius: '12px', border: `1px solid ${formData.maintenanceMode ? '#fecaca' : '#e2e8f0'}`, marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input
                    type="checkbox"
                    id="maintenanceMode"
                    name="maintenanceMode"
                    checked={formData.maintenanceMode}
                    onChange={handleChange}
                    style={{ width: '22px', height: '22px', accentColor: '#dc2626' }}
                  />
                  <div>
                    <label htmlFor="maintenanceMode" style={{ margin: 0, cursor: 'pointer', fontSize: '15px', fontWeight: '800', color: formData.maintenanceMode ? '#dc2626' : '#1e293b' }}>
                      Enable Public Maintenance Mode
                    </label>
                    <span style={{ display: 'block', fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                      When enabled, public visitors will see a maintenance notice. Administrators will still have access to this dashboard.
                    </span>
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-full">
                  <label>Maintenance Notice Message</label>
                  <textarea
                    name="maintenanceMessage"
                    value={formData.maintenanceMessage}
                    onChange={handleChange}
                    rows={4}
                    className="form-textarea"
                    placeholder="Message displayed to visitors during maintenance..."
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
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
