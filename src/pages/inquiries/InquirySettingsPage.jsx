import { useState, useEffect } from 'react'
import {
  Save,
  Loader2,
  Settings,
  Mail,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Send,
} from 'lucide-react'
import toast from 'react-hot-toast'
import inquiryService from '../../services/inquiryService'
import './Inquiries.css'

export default function InquirySettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    title: 'Get Your Moving Quote',
    subtitle: 'FREE ESTIMATE',
    description: 'Fill the form and our team will contact you shortly.',
    button_text: 'Submit Quote Request',
    success_message: 'Thank you! Your quote request has been submitted successfully. Our team will contact you shortly.',
    error_message: 'Oops! Unable to submit quote. Please check your details and try again.',
    email_notification: true,
    admin_email: 'admin@ozinterstate.com',
    auto_reply: true,
    auto_reply_message: 'Thank you for requesting a quote with OZ Interstate Movers. We have received your request and will call you shortly.',
    redirect_url: '',
    status: 'active',
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const res = await inquiryService.getAdminForm()
      if (res.success && res.data && res.data.form) {
        const f = res.data.form
        setFormData({
          title: f.title || 'Get Your Moving Quote',
          subtitle: f.subtitle || 'FREE ESTIMATE',
          description: f.description || '',
          button_text: f.button_text || 'Submit Quote Request',
          success_message: f.success_message || '',
          error_message: f.error_message || '',
          email_notification: Boolean(f.email_notification),
          admin_email: f.admin_email || '',
          auto_reply: Boolean(f.auto_reply),
          auto_reply_message: f.auto_reply_message || '',
          redirect_url: f.redirect_url || '',
          status: f.status || 'active',
        })
      }
    } catch (err) {
      console.error('Failed to load form settings:', err)
      toast.error('Failed to load settings.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      const res = await inquiryService.updateFormSettings(formData)
      if (res.success) {
        toast.success('Inquiry Form settings updated successfully!')
      }
    } catch (err) {
      console.error('Failed to save settings:', err)
      toast.error('Failed to save settings.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="banner-page-container">
      {/* Header */}
      <div className="banner-page-header">
        <div>
          <h1 className="banner-page-title">Inquiry Form Settings</h1>
          <p className="banner-page-subtitle">
            Configure Hero Quote Form title, badge text, button labels, messages, and email notifications.
          </p>
        </div>

        <button
          type="button"
          className="banner-add-button"
          disabled={saving}
          onClick={handleSubmit}
        >
          {saving ? (
            <>
              <Loader2 size={18} className="spinner" /> Saving...
            </>
          ) : (
            <>
              <Save size={18} /> Save Settings
            </>
          )}
        </button>
      </div>

      {loading ? (
        <div className="banner-loading-state">
          <Loader2 size={32} className="spinner" />
          <p>Loading settings...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="settings-cards-stack">
          {/* Card 1: Display Labels & Content */}
          <div className="banner-form-main-card mb-6">
            <div className="settings-card-header">
              <Settings size={18} />
              <h3>Hero Form Content & Labels</h3>
            </div>

            <div className="banner-form-body">
              <div className="form-row">
                <div className="form-group col-half">
                  <label className="required">Form Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Get Your Moving Quote"
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group col-half">
                  <label>Badge Text</label>
                  <input
                    type="text"
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleChange}
                    placeholder="e.g. FREE ESTIMATE"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-full">
                  <label>Form Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={2}
                    placeholder="e.g. Fill the form and our team will contact you shortly."
                    className="form-textarea"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-half">
                  <label className="required">Submit Button Text</label>
                  <input
                    type="text"
                    name="button_text"
                    value={formData.button_text}
                    onChange={handleChange}
                    placeholder="e.g. Submit Quote Request"
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group col-half">
                  <label>Custom Redirect URL (Optional)</label>
                  <input
                    type="text"
                    name="redirect_url"
                    value={formData.redirect_url}
                    onChange={handleChange}
                    placeholder="e.g. /thank-you"
                    className="form-input"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Response Messages */}
          <div className="banner-form-main-card mb-6">
            <div className="settings-card-header">
              <CheckCircle size={18} />
              <h3>User Feedback Messages</h3>
            </div>

            <div className="banner-form-body">
              <div className="form-row">
                <div className="form-group col-full">
                  <label>Success Toast Message</label>
                  <input
                    type="text"
                    name="success_message"
                    value={formData.success_message}
                    onChange={handleChange}
                    placeholder="Message shown when user submits successfully"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-full">
                  <label>Error Toast Message</label>
                  <input
                    type="text"
                    name="error_message"
                    value={formData.error_message}
                    onChange={handleChange}
                    placeholder="Message shown if submission fails"
                    className="form-input"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Notifications & Auto-Reply */}
          <div className="banner-form-main-card mb-6">
            <div className="settings-card-header">
              <Mail size={18} />
              <h3>Email Notifications & Auto-Reply</h3>
            </div>

            <div className="banner-form-body">
              <div className="video-toggles-grid mb-4">
                <label className="checkbox-toggle-card">
                  <input
                    type="checkbox"
                    name="email_notification"
                    checked={formData.email_notification}
                    onChange={handleChange}
                  />
                  <div>
                    <strong>Admin Email Alert</strong>
                    <span>Send email notification on new submission</span>
                  </div>
                </label>

                <label className="checkbox-toggle-card">
                  <input
                    type="checkbox"
                    name="auto_reply"
                    checked={formData.auto_reply}
                    onChange={handleChange}
                  />
                  <div>
                    <strong>Customer Auto-Reply</strong>
                    <span>Send confirmation email to customer</span>
                  </div>
                </label>
              </div>

              {formData.email_notification && (
                <div className="form-row">
                  <div className="form-group col-full">
                    <label>Admin Recipient Email Address</label>
                    <input
                      type="email"
                      name="admin_email"
                      value={formData.admin_email}
                      onChange={handleChange}
                      placeholder="admin@ozinterstate.com"
                      className="form-input"
                    />
                  </div>
                </div>
              )}

              {formData.auto_reply && (
                <div className="form-row">
                  <div className="form-group col-full">
                    <label>Customer Auto-Reply Email Message</label>
                    <textarea
                      name="auto_reply_message"
                      value={formData.auto_reply_message}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Enter automated thank-you message sent to customer..."
                      className="form-textarea"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>
      )}
    </div>
  )
}
