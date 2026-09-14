import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Edit2, Trash2, SlidersHorizontal, Loader2, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import trustBadgeService from '../../services/trustBadgeService'
import '../banners/Banners.css'

export default function TrustBadgesPage() {
  const navigate = useNavigate()
  const [badges, setBadges] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const fetchBadges = async () => {
    try {
      setLoading(true)
      const res = await trustBadgeService.getTrustBadges()
      if (res.data && res.data.success) {
        setBadges(res.data.data || [])
      } else if (res.data) {
        setBadges(res.data || [])
      } else {
         setBadges(res || [])
      }
    } catch (err) {
      console.error('Error loading trust badges:', err)
      toast.error('Failed to load trust badges.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBadges()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this trust badge?')) return
    try {
      await trustBadgeService.deleteTrustBadge(id)
      toast.success('Trust badge deleted successfully.')
      fetchBadges()
    } catch (err) {
      console.error('Failed to delete badge:', err)
      toast.error('Failed to delete badge.')
    }
  }

  const filteredBadges = badges.filter(badge => 
    badge.title?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="banner-page-container">
      <div className="banner-page-header">
        <div>
          <h1 className="banner-page-title">Trust Badges</h1>
          <p className="banner-page-subtitle">Manage trust indicators like 'Fully Insured' or '5-Star Rated'.</p>
        </div>
        <button className="banner-add-button" onClick={() => navigate('/cms/trust-badges/create')}>
          <Plus size={18} /> Add New Badge
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
            <p>Loading trust badges...</p>
          </div>
        ) : filteredBadges.length === 0 ? (
          <div className="banner-empty-state">
            <SlidersHorizontal size={40} className="empty-icon" />
            <h3>No trust badges found</h3>
            <p>Try adjusting your search query or add a new badge.</p>
            <button className="banner-add-button" onClick={() => navigate('/cms/trust-badges/create')}>
              <Plus size={16} /> Add Badge
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="banner-table">
              <thead>
                <tr>
                  <th>Badge</th>
                  <th>Title & Description</th>
                  <th>Order</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBadges.map((badge, index) => (
                  <tr key={badge._id || index}>
                    <td>
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                        <ShieldCheck size={24} />
                      </div>
                    </td>
                    <td>
                      <div className="banner-table-title-cell max-w-sm">
                        <strong className="text-sm font-medium text-slate-800">{badge.title}</strong>
                        <p className="subtitle-text line-clamp-1 mt-1 text-slate-500" title={badge.description}>
                          {badge.description || 'No description'}
                        </p>
                        <div className="mt-1 text-xs text-slate-400 font-mono">
                          Icon: {badge.icon}
                        </div>
                      </div>
                    </td>
                    <td className="font-mono text-slate-600">
                      {badge.sortOrder || 0}
                    </td>
                    <td>
                      <span className={`status-toggle-button status-${badge.status || 'active'}`}>
                        {badge.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons-group">
                        <button className="action-btn edit-btn" onClick={() => navigate(`/cms/trust-badges/edit/${badge._id || badge.id}`)}>
                          <Edit2 size={16} />
                        </button>
                        <button className="action-btn delete-btn" onClick={() => handleDelete(badge._id || badge.id)}>
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
