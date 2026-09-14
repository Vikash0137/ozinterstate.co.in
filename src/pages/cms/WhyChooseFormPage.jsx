import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Save, ArrowLeft, Loader2, Star } from 'lucide-react'
import toast from 'react-hot-toast'
import whyChooseService from '../../services/whyChooseService'
import '../banners/Banners.css'

export default function WhyChooseFormPage() {
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
      loadItem()
    }
  }, [id])

  const loadItem = async () => {
    try {
      setLoading(true)
      const res = await whyChooseService.getWhyChooseItems()
      const data = res.data?.data || res.data || res
      const item = Array.isArray(data) ? data.find(s => s._id === id || s.id == id) : null
      
      if (item) {
        setFormData({
          title: item.title || '',
          description: item.description || '',
          icon: item.icon || '',
          sortOrder: item.sortOrder || 0,
          status: item.status || 'active',
        })
      } else {
        toast.error('Item not found')
        navigate('/cms/why-choose')
      }
    } catch (err) {
      console.error('Failed to load item:', err)
      toast.error('Failed to load item details')
      navigate('/cms/why-choose')
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
        await whyChooseService.updateWhyChooseItem(id, formData)
        toast.success('Item updated successfully')
      } else {
        await whyChooseService.createWhyChooseItem(formData)
        toast.success('Item created successfully')
      }
      navigate('/cms/why-choose')
    } catch (err) {
      console.error('Failed to save item:', err)
      toast.error(err.response?.data?.message || 'Failed to save item')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="banner-page-container">
        <div className="banner-loading-state">
          <Loader2 size={32} className="spinner" />
          <p>Loading item...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="banner-page-container">
      <div className="banner-form-topbar">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => navigate('/cms/why-choose')} className="btn-back">
            <ArrowLeft size={18} /> Back to Why Choose Us
          </button>
          <div>
            <h1 className="banner-page-title">
              {isEditing ? 'Edit Why Choose Us Item' : 'Add Why Choose Us Item'}
            </h1>
            <p className="banner-page-subtitle">Manage key benefits and value propositions</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="banner-add-button"
        >
          {saving ? <Loader2 size={16} className="spinner" /> : <Save size={16} />}
          {saving ? 'Saving...' : 'Save Item'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="banner-form-grid">
        {/* Main Content Area */}
        <div className="banner-form-main-card">
          <div className="banner-form-body">
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>
              Benefit Details
            </h3>
            
            <div className="form-row">
              <div className="form-group col-full">
                <label className="required">Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g. 10+ Years Experience, Transparent Fixed Pricing"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-full">
                <label className="required">Description</label>
                <textarea
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="form-textarea"
                  placeholder="Provide clear reasons and details why customers should trust your service..."
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
                  placeholder="e.g. ShieldCheck, Clock, Award, Star"
                />
                <small style={{ color: '#64748b', fontSize: '12px' }}>Enter any valid Lucide icon name.</small>
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
                {saving ? 'Saving...' : 'Save Item'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
