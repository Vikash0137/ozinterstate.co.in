import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Save, ArrowLeft, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import faqService from '../../services/faqService'
import '../banners/Banners.css'

export default function FaqFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'general',
    pageSlug: '',
    display_order: 0,
    status: 'active'
  })

  useEffect(() => {
    if (isEditing) {
      loadFaq()
    }
  }, [id])

  const loadFaq = async () => {
    try {
      setLoading(true)
      const res = await faqService.getFAQById(id)
      const data = res.data?.data || res.data || res
      
      setFormData({
        question: data.question || '',
        answer: data.answer || '',
        category: data.category || 'general',
        pageSlug: data.pageSlug || '',
        display_order: data.display_order || 0,
        status: data.status || 'active',
      })
    } catch (err) {
      console.error('Failed to load FAQ:', err)
      toast.error('Failed to load FAQ details')
      navigate('/cms/faqs')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const val = type === 'checkbox' ? checked : value
    setFormData(prev => ({ ...prev, [name]: val }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      
      if (isEditing) {
        await faqService.updateFAQ(id, formData)
        toast.success('FAQ updated successfully')
      } else {
        await faqService.createFAQ(formData)
        toast.success('FAQ created successfully')
      }
      navigate('/cms/faqs')
    } catch (err) {
      console.error('Failed to save FAQ:', err)
      toast.error(err.response?.data?.message || 'Failed to save FAQ')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="banner-page-container">
        <div className="banner-loading-state">
          <Loader2 size={32} className="spinner" />
          <p>Loading FAQ...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="banner-page-container">
      <div className="banner-form-topbar">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => navigate('/cms/faqs')} className="btn-back">
            <ArrowLeft size={18} /> Back to FAQs
          </button>
          <div>
            <h1 className="banner-page-title">
              {isEditing ? 'Edit FAQ' : 'Create New FAQ'}
            </h1>
            <p className="banner-page-subtitle">Manage frequently asked questions</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="banner-add-button"
        >
          {saving ? <Loader2 size={16} className="spinner" /> : <Save size={16} />}
          {saving ? 'Saving...' : 'Save FAQ'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="banner-form-grid">
        {/* Main Content Area */}
        <div className="banner-form-main-card">
          <div className="banner-form-body">
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>
              FAQ Details
            </h3>
            
            <div className="form-row">
              <div className="form-group col-full">
                <label className="required">Question</label>
                <input
                  type="text"
                  name="question"
                  required
                  value={formData.question}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g. How do you pack fragile items?"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-full">
                <label className="required">Answer</label>
                <textarea
                  name="answer"
                  required
                  value={formData.answer}
                  onChange={handleChange}
                  rows={6}
                  className="form-textarea"
                  placeholder="Provide a detailed and helpful answer here..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Area */}
        <div className="banner-form-main-card">
          <div className="banner-form-body">
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>
              Settings & Taxonomy
            </h3>
            
            <div className="form-row">
              <div className="form-group col-full">
                <label>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="active">Active (Visible)</option>
                  <option value="inactive">Inactive (Hidden)</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-full">
                <label>Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g. general, pricing, moving"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-full">
                <label>Target Page Slug (Optional)</label>
                <input
                  type="text"
                  name="pageSlug"
                  value={formData.pageSlug}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g. melbourne-to-sydney"
                />
                <small style={{ color: '#64748b', fontSize: '12px' }}>Leave blank to show on general FAQ page.</small>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-full">
                <label>Display Order</label>
                <input
                  type="number"
                  name="display_order"
                  value={formData.display_order}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>

            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
              <button
                type="submit"
                disabled={saving}
                className="banner-add-button"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                {saving ? <Loader2 size={16} className="spinner" /> : <Save size={16} />}
                {saving ? 'Saving...' : 'Save FAQ'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
