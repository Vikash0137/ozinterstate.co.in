import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Save, ArrowLeft, Loader2, TrendingUp } from 'lucide-react'
import toast from 'react-hot-toast'
import statService from '../../services/statService'
import '../banners/Banners.css'

export default function StatFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    value: 0,
    label: '',
    prefix: '',
    suffix: '',
    decimals: 0,
    icon: '',
    sortOrder: 0,
    status: 'active'
  })

  useEffect(() => {
    if (isEditing) {
      loadStat()
    }
  }, [id])

  const loadStat = async () => {
    try {
      setLoading(true)
      const res = await statService.getStats()
      const data = res.data?.data || res.data || res
      const stat = Array.isArray(data) ? data.find(s => s._id === id || s.id == id) : null
      
      if (stat) {
        setFormData({
          value: stat.value || 0,
          label: stat.label || '',
          prefix: stat.prefix || '',
          suffix: stat.suffix || '',
          decimals: stat.decimals || 0,
          icon: stat.icon || '',
          sortOrder: stat.sortOrder || 0,
          status: stat.status || 'active',
        })
      } else {
        toast.error('Stat not found')
        navigate('/cms/stats')
      }
    } catch (err) {
      console.error('Failed to load stat:', err)
      toast.error('Failed to load stat details')
      navigate('/cms/stats')
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
        await statService.updateStat(id, formData)
        toast.success('Stat updated successfully')
      } else {
        await statService.createStat(formData)
        toast.success('Stat created successfully')
      }
      navigate('/cms/stats')
    } catch (err) {
      console.error('Failed to save stat:', err)
      toast.error(err.response?.data?.message || 'Failed to save stat')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="banner-page-container">
        <div className="banner-loading-state">
          <Loader2 size={32} className="spinner" />
          <p>Loading stat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="banner-page-container">
      <div className="banner-form-topbar">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => navigate('/cms/stats')} className="btn-back">
            <ArrowLeft size={18} /> Back to Stats
          </button>
          <div>
            <h1 className="banner-page-title">
              {isEditing ? 'Edit Stat' : 'Add New Stat'}
            </h1>
            <p className="banner-page-subtitle">Manage animated counters and trust metrics</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="banner-add-button"
        >
          {saving ? <Loader2 size={16} className="spinner" /> : <Save size={16} />}
          {saving ? 'Saving...' : 'Save Stat'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="banner-form-grid">
        {/* Main Content Area */}
        <div className="banner-form-main-card">
          <div className="banner-form-body">
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>
              Metric Details
            </h3>
            
            <div className="form-row">
              <div className="form-group col-full">
                <label className="required">Label / Description</label>
                <input
                  type="text"
                  name="label"
                  required
                  value={formData.label}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g. Happy Customers, Interstate Moves Completed"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-quarter">
                <label>Prefix</label>
                <input
                  type="text"
                  name="prefix"
                  value={formData.prefix}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g. $"
                />
              </div>
              <div className="form-group col-half">
                <label className="required">Numeric Value</label>
                <input
                  type="number"
                  name="value"
                  required
                  value={formData.value}
                  onChange={handleChange}
                  className="form-input font-bold"
                  placeholder="e.g. 5000"
                />
              </div>
              <div className="form-group col-quarter">
                <label>Suffix</label>
                <input
                  type="text"
                  name="suffix"
                  value={formData.suffix}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g. +, %, k"
                />
              </div>
            </div>

            {/* Live Counter Preview Box */}
            <div style={{ marginTop: '20px', padding: '24px', background: '#f0f9ff', borderRadius: '12px', border: '1px solid #bae6fd', textAlign: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#0369a1', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Counter Live Preview</span>
              <div style={{ fontSize: '42px', fontWeight: '800', color: '#0284c7', margin: '8px 0 4px 0' }}>
                {formData.prefix}{formData.value}{formData.suffix}
              </div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#334155' }}>
                {formData.label || 'Your Label Here'}
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
                <label>Decimal Places</label>
                <input
                  type="number"
                  name="decimals"
                  min="0"
                  max="4"
                  value={formData.decimals}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-full">
                <label>Icon (Lucide Name)</label>
                <input
                  type="text"
                  name="icon"
                  value={formData.icon}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g. Users, Trophy, Truck"
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
                {saving ? 'Saving...' : 'Save Stat'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
