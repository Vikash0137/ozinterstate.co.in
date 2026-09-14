import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Save, ArrowLeft, Loader2, GitMerge } from 'lucide-react'
import toast from 'react-hot-toast'
import processStepService from '../../services/processStepService'
import '../banners/Banners.css'

export default function ProcessStepFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    stepNumber: 1,
    title: '',
    description: '',
    icon: '',
    sortOrder: 0,
    status: 'active'
  })

  useEffect(() => {
    if (isEditing) {
      loadStep()
    }
  }, [id])

  const loadStep = async () => {
    try {
      setLoading(true)
      const res = await processStepService.getProcessSteps()
      const data = res.data?.data || res.data || res
      const step = Array.isArray(data) ? data.find(s => s._id === id || s.id == id) : null
      
      if (step) {
        setFormData({
          stepNumber: step.stepNumber || 1,
          title: step.title || '',
          description: step.description || '',
          icon: step.icon || '',
          sortOrder: step.sortOrder || 0,
          status: step.status || 'active',
        })
      } else {
        toast.error('Process step not found')
        navigate('/cms/process-steps')
      }
    } catch (err) {
      console.error('Failed to load step:', err)
      toast.error('Failed to load step details')
      navigate('/cms/process-steps')
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
        await processStepService.updateProcessStep(id, formData)
        toast.success('Process step updated successfully')
      } else {
        await processStepService.createProcessStep(formData)
        toast.success('Process step created successfully')
      }
      navigate('/cms/process-steps')
    } catch (err) {
      console.error('Failed to save process step:', err)
      toast.error(err.response?.data?.message || 'Failed to save step')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="banner-page-container">
        <div className="banner-loading-state">
          <Loader2 size={32} className="spinner" />
          <p>Loading step...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="banner-page-container">
      <div className="banner-form-topbar">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => navigate('/cms/process-steps')} className="btn-back">
            <ArrowLeft size={18} /> Back to Process Steps
          </button>
          <div>
            <h1 className="banner-page-title">
              {isEditing ? 'Edit Process Step' : 'Add Process Step'}
            </h1>
            <p className="banner-page-subtitle">Manage "How It Works" and operational flow steps</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="banner-add-button"
        >
          {saving ? <Loader2 size={16} className="spinner" /> : <Save size={16} />}
          {saving ? 'Saving...' : 'Save Step'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="banner-form-grid">
        {/* Main Content Area */}
        <div className="banner-form-main-card">
          <div className="banner-form-body">
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>
              Step Information
            </h3>
            
            <div className="form-row">
              <div className="form-group col-quarter">
                <label className="required">Step #</label>
                <input
                  type="number"
                  name="stepNumber"
                  required
                  min="1"
                  value={formData.stepNumber}
                  onChange={handleChange}
                  className="form-input font-bold"
                />
              </div>
              <div className="form-group col-half" style={{ flex: '1 1 calc(75% - 8px)' }}>
                <label className="required">Step Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g. Request a Quote, We Pack & Load"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-full">
                <label className="required">Step Description</label>
                <textarea
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="form-textarea"
                  placeholder="Explain what happens in this step clearly for customers..."
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
                <label>Icon (Lucide Name)</label>
                <input
                  type="text"
                  name="icon"
                  value={formData.icon}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g. ClipboardCheck, Truck, Box"
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
                {saving ? 'Saving...' : 'Save Step'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
