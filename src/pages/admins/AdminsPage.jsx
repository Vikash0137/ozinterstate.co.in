import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import adminService from '../../services/adminService'
import './AdminsPage.css'

const AdminsPage = () => {
  const navigate = useNavigate()
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [error, setError] = useState('')

  const loadAdmins = async (p = 1, s = '', r = '', st = '') => {
    setLoading(true)
    setError('')
    try {
      const res = await adminService.getAdmins({
        page: p,
        limit: 10,
        search: s,
        role: r,
        status: st,
      })

      if (res?.data?.success) {
        setAdmins(res.data.data.admins || [])
        setPage(res.data.data.pagination.page)
        setTotalPages(res.data.data.pagination.totalPages)
      }
    } catch (err) {
      console.error('Failed to load admins:', err)
      setError('Failed to load admins. Please try again.')
      setAdmins([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAdmins(1, search, roleFilter, statusFilter)
  }, [])

  const handleSearch = (e) => {
    const value = e.target.value
    setSearch(value)
    setPage(1)
    loadAdmins(1, value, roleFilter, statusFilter)
  }

  const handleRoleFilter = (e) => {
    const value = e.target.value
    setRoleFilter(value)
    setPage(1)
    loadAdmins(1, search, value, statusFilter)
  }

  const handleStatusFilter = (e) => {
    const value = e.target.value
    setStatusFilter(value)
    setPage(1)
    loadAdmins(1, search, roleFilter, value)
  }

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
      await adminService.updateAdminStatus(id, newStatus)
      loadAdmins(page, search, roleFilter, statusFilter)
    } catch (err) {
      console.error('Failed to update admin status:', err)
      setError('Failed to update admin status.')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to deactivate this admin?')) {
      return
    }
    try {
      await adminService.deleteAdmin(id)
      loadAdmins(page, search, roleFilter, statusFilter)
    } catch (err) {
      console.error('Failed to delete admin:', err)
      setError('Failed to delete admin.')
    }
  }

  const handlePrevPage = () => {
    if (page > 1) {
      loadAdmins(page - 1, search, roleFilter, statusFilter)
      setPage(page - 1)
    }
  }

  const handleNextPage = () => {
    if (page < totalPages) {
      loadAdmins(page + 1, search, roleFilter, statusFilter)
      setPage(page + 1)
    }
  }

  return (
    <div className="admins-page-container">
      <div className="admins-page-header">
        <h1>Admin Management</h1>
        <button className="btn-primary" onClick={() => navigate('/admins/new')}>
          + New Admin
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="admins-filters">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={handleSearch}
          className="filter-input"
        />

        <select value={roleFilter} onChange={handleRoleFilter} className="filter-select">
          <option value="">All Roles</option>
          <option value="Super Admin">Super Admin</option>
          <option value="Admin">Admin</option>
        </select>

        <select value={statusFilter} onChange={handleStatusFilter} className="filter-select">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading admins...</div>
      ) : admins.length === 0 ? (
        <div className="no-data">No admins found.</div>
      ) : (
        <div className="admins-table-wrapper">
          <table className="admins-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin._id}>
                  <td>{admin.name}</td>
                  <td>{admin.email}</td>
                  <td className="role-badge">{admin.role}</td>
                  <td>
                    <span className={`status-badge status-${admin.status}`}>
                      {admin.status}
                    </span>
                  </td>
                  <td>{new Date(admin.created_at).toLocaleDateString()}</td>
                  <td className="actions-cell">
                    <button
                      className="btn-icon"
                      onClick={() => navigate(`/admins/${admin._id}`)}
                      title="View"
                    >
                      👁️
                    </button>
                    <button
                      className="btn-icon"
                      onClick={() => navigate(`/admins/${admin._id}/edit`)}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-icon btn-status"
                      onClick={() => handleStatusToggle(admin._id, admin.status)}
                      title={admin.status === 'active' ? 'Deactivate' : 'Activate'}
                    >
                      {admin.status === 'active' ? '🔒' : '🔓'}
                    </button>
                    <button
                      className="btn-icon btn-danger"
                      onClick={() => handleDelete(admin._id)}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="pagination">
        <button onClick={handlePrevPage} disabled={page <= 1} className="btn-pagination">
          ← Previous
        </button>
        <span className="pagination-info">
          Page {page} of {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={page >= totalPages} className="btn-pagination">
          Next →
        </button>
      </div>
    </div>
  )
}

export default AdminsPage
