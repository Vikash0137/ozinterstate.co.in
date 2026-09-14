import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Edit2, Trash2, SlidersHorizontal, Loader2, GitMerge } from 'lucide-react'
import toast from 'react-hot-toast'
import processStepService from '../../services/processStepService'
import '../banners/Banners.css'

export default function ProcessStepsPage() {
  const navigate = useNavigate()
  const [steps, setSteps] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const fetchSteps = async () => {
    try {
      setLoading(true)
      const res = await processStepService.getProcessSteps()
      if (res.data && res.data.success) {
        setSteps(res.data.data || [])
      } else if (res.data) {
        setSteps(res.data || [])
      } else {
         setSteps(res || [])
      }
    } catch (err) {
      console.error('Error loading process steps:', err)
      toast.error('Failed to load process steps.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSteps()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this process step?')) return
    try {
      await processStepService.deleteProcessStep(id)
      toast.success('Process step deleted successfully.')
      fetchSteps()
    } catch (err) {
      console.error('Failed to delete step:', err)
      toast.error('Failed to delete step.')
    }
  }

  const filteredSteps = steps.filter(step => 
    step.title?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="banner-page-container">
      <div className="banner-page-header">
        <div>
          <h1 className="banner-page-title">Process Steps</h1>
          <p className="banner-page-subtitle">Manage "How It Works" and operational flow steps.</p>
        </div>
        <button className="banner-add-button" onClick={() => navigate('/cms/process-steps/create')}>
          <Plus size={18} /> Add New Step
        </button>
      </div>

      <div className="banner-toolbar">
        <div className="search-box-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="banner-table-card">
        {loading ? (
          <div className="banner-loading-state">
            <Loader2 size={32} className="spinner" />
            <p>Loading steps...</p>
          </div>
        ) : filteredSteps.length === 0 ? (
          <div className="banner-empty-state">
            <SlidersHorizontal size={40} className="empty-icon" />
            <h3>No process steps found</h3>
            <p>Try adjusting your search query or add a new step.</p>
            <button className="banner-add-button" onClick={() => navigate('/cms/process-steps/create')}>
              <Plus size={16} /> Add Step
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="banner-table">
              <thead>
                <tr>
                  <th>Step Number</th>
                  <th>Title & Description</th>
                  <th>Icon</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSteps.map((step, index) => (
                  <tr key={step._id || index}>
                    <td>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-800 font-bold">
                        {step.stepNumber}
                      </div>
                    </td>
                    <td>
                      <div className="banner-table-title-cell max-w-sm">
                        <strong className="text-sm font-medium text-slate-800">{step.title}</strong>
                        <p className="subtitle-text line-clamp-2 mt-1 text-slate-500" title={step.description}>
                          {step.description}
                        </p>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <GitMerge size={14} /> {step.icon || 'None'}
                      </div>
                    </td>
                    <td>
                      <span className={`status-toggle-button status-${step.status || 'active'}`}>
                        {step.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons-group">
                        <button className="action-btn edit-btn" onClick={() => navigate(`/cms/process-steps/edit/${step._id || step.id}`)}>
                          <Edit2 size={16} />
                        </button>
                        <button className="action-btn delete-btn" onClick={() => handleDelete(step._id || step.id)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
