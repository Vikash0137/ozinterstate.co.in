import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Save, ArrowLeft, Loader2, UserCircle, Globe, Link2, Mail } from 'lucide-react'
import toast from 'react-hot-toast'
import teamService from '../../services/teamService'
import '../banners/Banners.css'

export default function TeamFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    bio: '',
    image: '',
    imageAlt: '',
    linkedin: '',
    twitter: '',
    email: '',
    sortOrder: 0,
    status: 'active'
  })

  useEffect(() => {
    if (isEditing) {
      loadTeamMember()
    }
  }, [id])

  const loadTeamMember = async () => {
    try {
      setLoading(true)
      const res = await teamService.getTeamMemberById(id)
      const data = res.data?.data || res.data || res
      
      setFormData({
        name: data.name || '',
        designation: data.designation || '',
        bio: data.bio || '',
        image: data.image || '',
        imageAlt: data.imageAlt || '',
        linkedin: data.linkedin || '',
        twitter: data.twitter || '',
        email: data.email || '',
        sortOrder: data.sortOrder || 0,
        status: data.status || 'active',
      })
    } catch (err) {
      console.error('Failed to load team member:', err)
      toast.error('Failed to load member details')
      navigate('/cms/team')
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
        await teamService.updateTeamMember(id, formData)
        toast.success('Team member updated successfully')
      } else {
        await teamService.createTeamMember(formData)
        toast.success('Team member created successfully')
      }
      navigate('/cms/team')
    } catch (err) {
      console.error('Failed to save team member:', err)
      toast.error(err.response?.data?.message || 'Failed to save member')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="banner-page-container">
        <div className="banner-loading-state">
          <Loader2 size={32} className="spinner" />
          <p>Loading team member...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="banner-page-container">
      <div className="banner-form-topbar">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => navigate('/cms/team')} className="btn-back">
            <ArrowLeft size={18} /> Back to Team
          </button>
          <div>
            <h1 className="banner-page-title">
              {isEditing ? 'Edit Team Member' : 'Add Team Member'}
            </h1>
            <p className="banner-page-subtitle">Manage leadership and staff profiles</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="banner-add-button"
        >
          {saving ? <Loader2 size={16} className="spinner" /> : <Save size={16} />}
          {saving ? 'Saving...' : 'Save Member'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="banner-form-grid">
        {/* Main Content Area */}
        <div className="banner-form-main-card">
          <div className="banner-form-body">
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>
              Personal Information
            </h3>
            
            <div className="form-row">
              <div className="form-group col-half">
                <label className="required">Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g. Sarah Jenkins"
                />
              </div>
              <div className="form-group col-half">
                <label className="required">Designation / Role</label>
                <input
                  type="text"
                  name="designation"
                  required
                  value={formData.designation}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g. Operations Director"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-full">
                <label>Biography</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  className="form-textarea"
                  placeholder="Write a brief professional background..."
                />
              </div>
            </div>

            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', margin: '24px 0 16px 0', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>
              Social & Contact Links
            </h3>

            <div className="form-row">
              <div className="form-group col-full">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="name@oz-interstate.com.au"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-half">
                <label>LinkedIn Profile URL</label>
                <input
                  type="text"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              <div className="form-group col-half">
                <label>Twitter / X Profile URL</label>
                <input
                  type="text"
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="https://x.com/username"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Area */}
        <div className="banner-form-main-card">
          <div className="banner-form-body">
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>
              Profile Photo
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '16px' }}>
              {formData.image ? (
                <img src={formData.image} alt="Preview" style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #0284c7', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} onError={(e) => e.target.style.display = 'none'} />
              ) : (
                <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', border: '2px dashed #cbd5e1' }}>
                  <UserCircle size={64} style={{ opacity: 0.5 }} />
                </div>
              )}
            </div>

            <div className="form-row">
              <div className="form-group col-full">
                <label>Image URL</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="form-input text-mono"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-full">
                <label>Image Alt Text (SEO)</label>
                <input
                  type="text"
                  name="imageAlt"
                  value={formData.imageAlt}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g. Sarah Jenkins Headshot"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-half">
                <label>Display Order</label>
                <input
                  type="number"
                  name="sortOrder"
                  value={formData.sortOrder}
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
                {saving ? 'Saving...' : 'Save Member'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
