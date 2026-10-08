import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Save, ArrowLeft, Loader2, Image as ImageIcon, Star, UserCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import reviewService from '../../services/reviewService'
import '../banners/Banners.css'

export default function ReviewFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    role: 'Customer',
    company: '',
    avatar: '',
    content: '',
    rating: 5,
    route: '',
    isFeatured: false,
    isVerified: true,
    status: 'active',
    sortOrder: 0
  })

  useEffect(() => {
    if (isEditing) {
      loadReview()
    }
  }, [id])

  const loadReview = async () => {
    try {
      setLoading(true)
      const res = await reviewService.getReviewById(id)
      const data = res.data?.data || res.data || res
      
      setFormData({
        name: data.name || '',
        role: data.role || 'Customer',
        company: data.company || '',
        avatar: data.avatar || '',
        content: data.content || '',
        rating: data.rating || 5,
        route: data.route || '',
        isFeatured: Boolean(data.isFeatured),
        isVerified: data.isVerified !== undefined ? Boolean(data.isVerified) : true,
        status: data.status || 'active',
        sortOrder: data.sortOrder || 0
      })
    } catch (err) {
      console.error('Failed to load review:', err)
      toast.error('Failed to load review details')
      navigate('/cms/reviews')
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
        await reviewService.updateReview(id, formData)
        toast.success('Review updated successfully')
      } else {
        await reviewService.createReview(formData)
        toast.success('Review created successfully')
      }
      navigate('/cms/reviews')
    } catch (err) {
      console.error('Failed to save review:', err)
      toast.error(err.response?.data?.message || 'Failed to save review')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="banner-page-container">
        <div className="banner-loading-state">
          <Loader2 size={32} className="spinner" />
          <p>Loading review...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="banner-page-container">
      <div className="banner-form-topbar">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => navigate('/cms/reviews')} className="btn-back">
            <ArrowLeft size={18} /> Back to Reviews
          </button>
          <div>
            <h1 className="banner-page-title">
              {isEditing ? 'Edit Review' : 'Add New Review'}
            </h1>
            <p className="banner-page-subtitle">Manage verified customer feedback and ratings</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="banner-add-button"
        >
          {saving ? <Loader2 size={16} className="spinner" /> : <Save size={16} />}
          {saving ? 'Saving...' : 'Save Review'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="banner-form-grid">
        {/* Main Content Area */}
        <div className="banner-form-main-card">
          <div className="banner-form-body">
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>
              Customer Testimonial
            </h3>
            
            <div className="form-row">
              <div className="form-group col-half">
                <label className="required">Customer Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g. David Miller"
                />
              </div>
              <div className="form-group col-half">
                <label>Role / Title</label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g. Homeowner, Verified Buyer"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-half">
                <label>Company / Location Area</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g. Melbourne, VIC"
                />
              </div>
              <div className="form-group col-half">
                <label>Moving Route</label>
                <input
                  type="text"
                  name="route"
                  value={formData.route}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g. Melbourne to Sydney"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-full">
                <label className="required">Rating</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                    >
                      <Star
                        size={26}
                        style={{
                          fill: star <= formData.rating ? '#f59e0b' : 'none',
                          color: star <= formData.rating ? '#f59e0b' : '#cbd5e1'
                        }}
                      />
                    </button>
                  ))}
                  <span style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', marginLeft: '8px' }}>
                    {formData.rating} / 5 Stars
                  </span>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-full">
                <label className="required">Review Feedback Content</label>
                <textarea
                  name="content"
                  required
                  value={formData.content}
                  onChange={handleChange}
                  rows={5}
                  className="form-textarea"
                  placeholder="Customer's direct feedback and experience..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Area */}
        <div className="banner-form-main-card">
          <div className="banner-form-body">
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>
              Customer Avatar
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '16px' }}>
              {formData.avatar ? (
                <img src={formData.avatar} alt="Avatar" style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #0284c7', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} onError={(e) => e.target.style.display = 'none'} />
              ) : (
                <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', border: '2px dashed #cbd5e1' }}>
                  <UserCircle size={48} style={{ opacity: 0.5 }} />
                </div>
              )}
            </div>

            <div className="form-row">
              <div className="form-group col-full">
                <label>Avatar Image URL</label>
                <input
                  type="text"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleChange}
                  className="form-input text-mono"
                  placeholder="https://..."
                />
              </div>
            </div>

            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', margin: '24px 0 16px 0', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>
              Settings & Badges
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
              <div className="form-group col-full" style={{ flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="isVerified"
                  name="isVerified"
                  checked={formData.isVerified}
                  onChange={handleChange}
                  style={{ width: '18px', height: '18px', accentColor: '#0284c7' }}
                />
                <label htmlFor="isVerified" style={{ margin: 0, cursor: 'pointer' }}>Mark as Verified Move</label>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-full" style={{ flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="isFeatured"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  style={{ width: '18px', height: '18px', accentColor: '#0284c7' }}
                />
                <label htmlFor="isFeatured" style={{ margin: 0, cursor: 'pointer' }}>Feature on Home Page</label>
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
                {saving ? 'Saving...' : 'Save Review'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
