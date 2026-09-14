import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Edit2, Trash2, SlidersHorizontal, Loader2, UserCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import teamService from '../../services/teamService'
import '../banners/Banners.css'

export default function TeamPage() {
  const navigate = useNavigate()
  const [teamMembers, setTeamMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const fetchTeam = async () => {
    try {
      setLoading(true)
      const res = await teamService.getTeamMembers()
      if (res.data && res.data.success) {
        setTeamMembers(res.data.data || [])
      } else if (res.data) {
        setTeamMembers(res.data || [])
      } else {
         setTeamMembers(res || [])
      }
    } catch (err) {
      console.error('Error loading team:', err)
      toast.error('Failed to load team members.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(fetchTeam, 0)
    return () => clearTimeout(timer)
  }, [])

  const handleDelete = async (member) => {
    if (!window.confirm('Are you sure you want to delete this team member?')) return
    try {
      await teamService.deleteTeamMember(member._id)
      toast.success('Team member deleted successfully.')
      fetchTeam()
    } catch (err) {
      console.error('Failed to delete team member:', err)
      toast.error('Failed to delete team member.')
    }
  }

  const filteredTeam = teamMembers.filter(member => 
    member.name?.toLowerCase().includes(search.toLowerCase()) || 
    member.designation?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="banner-page-container">
      <div className="banner-page-header">
        <div>
          <h1 className="banner-page-title">Team Management</h1>
          <p className="banner-page-subtitle">Manage company staff profiles and leadership.</p>
        </div>
        <button className="banner-add-button" onClick={() => navigate('/cms/team/create')}>
          <Plus size={18} /> Add Team Member
        </button>
      </div>

      <div className="banner-toolbar">
        <div className="search-box-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by name or designation..."
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
            <p>Loading team members...</p>
          </div>
        ) : filteredTeam.length === 0 ? (
          <div className="banner-empty-state">
            <SlidersHorizontal size={40} className="empty-icon" />
            <h3>No team members found</h3>
            <p>Try adjusting your search query or add a new team member.</p>
            <button className="banner-add-button" onClick={() => navigate('/cms/team/create')}>
              <Plus size={16} /> Add Member
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="banner-table">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Designation & Bio</th>
                  <th>Order</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeam.map((member, index) => (
                  <tr key={member._id || index}>
                    <td>
                      <div className="flex items-center gap-3">
                        {member.image ? (
                          <img src={member.image} alt={member.name} className="h-10 w-10 rounded-full object-cover border border-slate-200" />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                            <UserCircle size={24} />
                          </div>
                        )}
                        <div>
                          <strong className="block text-sm font-semibold text-slate-800">{member.name}</strong>
                          <span className="text-xs text-slate-500">{member.email || 'No Email'}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="banner-table-title-cell max-w-xs">
                        <strong className="text-sm font-medium text-slate-700">{member.designation}</strong>
                        <p className="subtitle-text line-clamp-1 mt-1 text-slate-500" title={member.bio}>
                          {member.bio || 'No bio provided'}
                        </p>
                      </div>
                    </td>
                    <td className="font-mono text-slate-600">
                      {member.sortOrder || 0}
                    </td>
                    <td>
                      <span className={`status-toggle-button status-${member.status || 'active'}`}>
                        {member.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons-group">
                        <button className="action-btn edit-btn" onClick={() => navigate(`/cms/team/edit/${member._id}`)}>
                          <Edit2 size={16} />
                        </button>
                        <button className="action-btn delete-btn" onClick={() => handleDelete(member)}>
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
