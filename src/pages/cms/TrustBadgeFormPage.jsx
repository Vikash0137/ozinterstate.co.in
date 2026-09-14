import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Save, ArrowLeft, Loader2, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import trustBadgeService from '../../services/trustBadgeService'
import '../banners/Banners.css'

export default function TrustBadgeFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: '',
    sortOrder: 0,
    status: 'active'
  })

  useEffect(() => {
    if (isEditing) {
      loadBadge()
    }
  }, [id])

  const loadBadge = async () => {
    try {
      setLoading(true)
      const res = await trustBadgeService.getTrustBadges()
      const data = res.data?.data || res.data || res
      const badge = Array.isArray(data) ? data.find(s => s._id === id || s.id == id) : null
      
      if (badge) {
        setFormData({
          title: badge.title || '',
          description: badge.description || '',
          icon: badge.icon || '',
          sortOrder: badge.sortOrder || 0,
          status: badge.status || 'active',
        })
      } else {
        toast.error('Trust badge not found')
        navigate('/cms/trust-badges')
      }
    } catch (err) {
      console.error('Failed to load trust badge:', err)
      toast.error('Failed to load badge details')
      navigate('/cms/trust-badges')
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
        await trustBadgeService.updateTrustBadge(id, formData)
        toast.success('Trust badge updated successfully')
      } else {
        await trustBadgeService.createTrustBadge(formData)
        toast.success('Trust badge created successfully')
      }
      navigate('/cms/trust-badges')
    } catch (err) {
      console.error('Failed to save trust badge:', err)
      toast.error(err.response?.data?.message || 'Failed to save badge')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="banner-page-container">
        <div className="banner-loading-state">
          <Loader2 size={32} className="spinner" />
          <p>Loading trust badge...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="banner-page-container">
      <div className="banner-form-topbar">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => navigate('/cms/trust-badges')} className="btn-back">
            <ArrowLeft size={18} /> Back to Trust Badges
          </button>
          <div>
            <h1 className="banner-page-title">
              {isEditing ? 'Edit Trust Badge' : 'Add Trust Badge'}
            </h1>
            <p className="banner-page-subtitle">Manage authority badges and trust indicators</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="banner-add-button"
        >
          {saving ? <Loader2 size={16} className="spinner" /> : <Save size={16} />}
          {saving ? 'Saving...' : 'Save Badge'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="banner-form-grid">
        {/* Main Content Area */}
        <div className="banner-form-main-card">
          <div className="banner-form-body">
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>
              Badge Information
            </h3>
            
            <div className="form-row">
              <div className="form-group col-full">
                <label className="required">Badge Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g. 100% Fully Insured, Licensed Carrier"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-full">
                <label>Description / Subtext</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="form-textarea"
                  placeholder="Short explanation to display below the title..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Area */}
        <div className="banner-form-main-card">
          <div className="banner-form-body">
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>
              Configuration
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
                <label className="required">Icon (Lucide Name)</label>
                <input
                  type="text"
                  name="icon"
                  required
                  value={formData.icon}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g. ShieldCheck, Award, Lock, CheckCircle"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-full">
                <label>Display Order</label>
                <input
                  type="number"
                  name="sortOrder"
                  value={formData.sortOrder}
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
                {saving ? 'Saving...' : 'Save Badge'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
