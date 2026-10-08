import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Save, ArrowLeft, Loader2, Image as ImageIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import galleryService from '../../services/galleryService'
import '../banners/Banners.css'

export default function GalleryFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    category: 'general',
    image_url: '',
    altText: '',
    caption: '',
    span: 'col-span-1 row-span-1',
    display_order: 0,
    status: 'active'
  })

  useEffect(() => {
    if (isEditing) {
      loadGalleryImage()
    }
  }, [id])

  const loadGalleryImage = async () => {
    try {
      setLoading(true)
      const res = await galleryService.getGalleryById(id)
      const data = res.data?.data || res.data || res
      
      setFormData({
        title: data.title || '',
        category: data.category || 'general',
        image_url: data.image_url || '',
        altText: data.altText || '',
        caption: data.caption || '',
        span: data.span || 'col-span-1 row-span-1',
        display_order: data.display_order || 0,
        status: data.status || 'active',
      })
    } catch (err) {
      console.error('Failed to load gallery image:', err)
      toast.error('Failed to load image details')
      navigate('/cms/gallery')
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
        await galleryService.updateGalleryImage(id, formData)
        toast.success('Gallery image updated successfully')
      } else {
        await galleryService.createGalleryImage(formData)
        toast.success('Gallery image created successfully')
      }
      navigate('/cms/gallery')
    } catch (err) {
      console.error('Failed to save gallery image:', err)
      toast.error(err.response?.data?.message || 'Failed to save image')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="banner-page-container">
        <div className="banner-loading-state">
          <Loader2 size={32} className="spinner" />
          <p>Loading image...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="banner-page-container">
      <div className="banner-form-topbar">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => navigate('/cms/gallery')} className="btn-back">
            <ArrowLeft size={18} /> Back to Gallery
          </button>
          <div>
            <h1 className="banner-page-title">
              {isEditing ? 'Edit Gallery Image' : 'Upload New Image'}
            </h1>
            <p className="banner-page-subtitle">Manage portfolio and fleet images</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="banner-add-button"
        >
          {saving ? <Loader2 size={16} className="spinner" /> : <Save size={16} />}
          {saving ? 'Saving...' : 'Save Image'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="banner-form-grid">
        {/* Main Content Area */}
        <div className="banner-form-main-card">
          <div className="banner-form-body">
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>
              Image Information
            </h3>
            
            <div className="form-row">
              <div className="form-group col-full">
                <label>Image Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g. Modern Fleet Truck"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-full">
                <label>Caption (Optional)</label>
                <textarea
                  name="caption"
                  value={formData.caption}
                  onChange={handleChange}
                  rows={3}
                  className="form-textarea"
                  placeholder="A brief description to display beneath the image..."
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-full">
                <label>Alt Text (For SEO & Accessibility)</label>
                <input
                  type="text"
                  name="altText"
                  value={formData.altText}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g. A large interstate moving truck driving on motorway"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Area */}
        <div className="banner-form-main-card">
          <div className="banner-form-body">
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>
              Media & Preview
            </h3>
            
            <div style={{ marginBottom: '16px' }}>
              {formData.image_url ? (
                <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #cbd5e1', maxHeight: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>
                  <img src={formData.image_url} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => e.target.style.display = 'none'} />
                </div>
              ) : (
                <div style={{ height: '120px', borderRadius: '12px', border: '2px dashed #cbd5e1', background: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                  <ImageIcon size={32} style={{ marginBottom: '6px', opacity: 0.5 }} />
                  <span style={{ fontSize: '12px' }}>No image URL provided</span>
                </div>
              )}
            </div>

            <div className="form-row">
              <div className="form-group col-full">
                <label className="required">Image URL</label>
                <input
                  type="text"
                  name="image_url"
                  required
                  value={formData.image_url}
                  onChange={handleChange}
                  className="form-input text-mono"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-full">
                <label>Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="general">General</option>
                  <option value="fleet">Fleet & Trucks</option>
                  <option value="packing">Packing</option>
                  <option value="team">Our Team</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-full">
                <label>Grid Span (Masonry)</label>
                <select
                  name="span"
                  value={formData.span}
                  onChange={handleChange}
                  className="form-select font-mono"
                >
                  <option value="col-span-1 row-span-1">1x1 (Standard Square)</option>
                  <option value="col-span-2 row-span-1">2x1 (Wide)</option>
                  <option value="col-span-1 row-span-2">1x2 (Tall)</option>
                  <option value="col-span-2 row-span-2">2x2 (Large Feature)</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-half">
                <label>Display Order</label>
                <input
                  type="number"
                  name="display_order"
                  value={formData.display_order}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              <div className="form-group col-half">
                <label>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
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
                {saving ? 'Saving...' : 'Save Image'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
