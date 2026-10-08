import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Edit2, Trash2, SlidersHorizontal, Loader2, TrendingUp } from 'lucide-react'
import toast from 'react-hot-toast'
import statService from '../../services/statService'
import '../banners/Banners.css'

export default function StatsPage() {
  const navigate = useNavigate()
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const fetchStats = async () => {
    try {
      setLoading(true)
      const res = await statService.getStats()
      if (res.data && res.data.success) {
        setStats(res.data.data || [])
      } else if (res.data) {
        setStats(res.data || [])
      } else {
         setStats(res || [])
      }
    } catch (err) {
      console.error('Error loading stats:', err)
      toast.error('Failed to load stats.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this stat?')) return
    try {
      await statService.deleteStat(id)
      toast.success('Stat deleted successfully.')
      fetchStats()
    } catch (err) {
      console.error('Failed to delete stat:', err)
      toast.error('Failed to delete stat.')
    }
  }

  const filteredStats = stats.filter(stat => 
    stat.label?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="banner-page-container">
      <div className="banner-page-header">
        <div>
          <h1 className="banner-page-title">Company Statistics</h1>
          <p className="banner-page-subtitle">Manage animated counters and trust metrics.</p>
        </div>
        <button className="banner-add-button" onClick={() => navigate('/cms/stats/create')}>
          <Plus size={18} /> Add New Stat
        </button>
      </div>

      <div className="banner-toolbar">
        <div className="search-box-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by label..."
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
            <p>Loading stats...</p>
          </div>
        ) : filteredStats.length === 0 ? (
          <div className="banner-empty-state">
            <SlidersHorizontal size={40} className="empty-icon" />
            <h3>No stats found</h3>
            <p>Try adjusting your search query or add a new stat.</p>
            <button className="banner-add-button" onClick={() => navigate('/cms/stats/create')}>
              <Plus size={16} /> Add Stat
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="banner-table">
              <thead>
                <tr>
                  <th>Stat Value</th>
                  <th>Label & Icon</th>
                  <th>Order</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStats.map((stat, index) => (
                  <tr key={stat._id || index}>
                    <td>
                      <div className="flex h-12 w-32 items-center justify-center rounded-lg bg-sky-50 text-sky-700">
                        <span className="text-xl font-bold">
                          {stat.prefix}{stat.value}{stat.suffix}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="banner-table-title-cell max-w-xs">
                        <strong className="text-sm font-medium text-slate-800">{stat.label}</strong>
                        <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500">
                          <TrendingUp size={12} /> Icon: {stat.icon || 'None'}
                        </div>
                      </div>
                    </td>
                    <td className="font-mono text-slate-600">
                      {stat.sortOrder || 0}
                    </td>
                    <td>
                      <span className={`status-toggle-button status-${stat.status || 'active'}`}>
                        {stat.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons-group">
                        <button className="action-btn edit-btn" onClick={() => navigate(`/cms/stats/edit/${stat._id || stat.id}`)}>
                          <Edit2 size={16} />
                        </button>
                        <button className="action-btn delete-btn" onClick={() => handleDelete(stat._id || stat.id)}>
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
