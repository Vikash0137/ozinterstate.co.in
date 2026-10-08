import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import adminService from '../../services/adminService'
import './AdminDetailsPage.css'

const AdminDetailsPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  })
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')

  useEffect(() => {
    loadAdmin()
  }, [id])

  const loadAdmin = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await adminService.getAdmin(id)
      if (res?.data?.success) {
        setAdmin(res.data.data.admin)
      }
    } catch (err) {
      console.error('Failed to load admin:', err)
      setError('Failed to load admin details.')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusToggle = async () => {
    try {
      const newStatus = admin.status === 'active' ? 'inactive' : 'active'
      const res = await adminService.updateAdminStatus(id, newStatus)
      if (res?.data?.success) {
        setAdmin(res.data.data.admin)
      }
    } catch (err) {
      console.error('Failed to update status:', err)
      setError('Failed to update admin status.')
    }
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess('')

    if (!passwordData.newPassword) {
      setPasswordError('New password is required.')
      return
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters.')
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Passwords do not match.')
      return
    }

    setPasswordLoading(true)

    try {
      await adminService.changeAdminPassword(id, {
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      })

      setPasswordSuccess('Password changed successfully!')
      setPasswordData({ newPassword: '', confirmPassword: '' })
      setTimeout(() => {
        setShowPasswordModal(false)
      }, 1500)
    } catch (err) {
      console.error('Failed to change password:', err)
      const errorMsg = err?.response?.data?.message || 'Failed to change password.'
      setPasswordError(errorMsg)
    } finally {
      setPasswordLoading(false)
    }
  }

  if (loading) {
    return <div className="admin-details-loading">Loading admin details...</div>
  }

  if (!admin) {
    return <div className="admin-details-error">Admin not found.</div>
  }

  return (
    <div className="admin-details-container">
      <div className="admin-details-header">
        <h1>{admin.name}</h1>
        <button className="btn-back" onClick={() => navigate('/admins')}>
          ← Back to Admins
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="admin-details-card">
        <div className="admin-details-grid">
          <div className="detail-item">
            <label>Name</label>
            <div className="detail-value">{admin.name}</div>
          </div>

          <div className="detail-item">
            <label>Email</label>
            <div className="detail-value">{admin.email}</div>
          </div>

          <div className="detail-item">
            <label>Role</label>
            <div className="detail-value">
              <span className="role-badge">{admin.role}</span>
            </div>
          </div>

          <div className="detail-item">
            <label>Status</label>
            <div className="detail-value">
              <span className={`status-badge status-${admin.status}`}>
                {admin.status}
              </span>
            </div>
          </div>

          <div className="detail-item">
            <label>Created Date</label>
            <div className="detail-value">
              {new Date(admin.created_at).toLocaleDateString()}{' '}
              {new Date(admin.created_at).toLocaleTimeString()}
            </div>
          </div>

          <div className="detail-item">
            <label>Last Updated</label>
            <div className="detail-value">
              {new Date(admin.updated_at).toLocaleDateString()}{' '}
              {new Date(admin.updated_at).toLocaleTimeString()}
            </div>
          </div>
        </div>

        <div className="admin-details-actions">
          <button
            className="btn-primary"
            onClick={() => navigate(`/admins/${admin._id}/edit`)}
          >
            ✏️ Edit Admin
          </button>

          <button className="btn-secondary" onClick={() => setShowPasswordModal(true)}>
            🔑 Change Password
          </button>

          <button
            className={`btn-status ${admin.status === 'active' ? 'btn-deactivate' : 'btn-activate'}`}
            onClick={handleStatusToggle}
          >
            {admin.status === 'active' ? '🔒 Deactivate' : '🔓 Activate'}
          </button>
        </div>
      </div>

      {showPasswordModal && (
        <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Change Password</h2>
              <button
                className="modal-close"
                onClick={() => setShowPasswordModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit} className="password-form">
              {passwordError && (
                <div className="error-message">{passwordError}</div>
              )}
              {passwordSuccess && (
                <div className="success-message">{passwordSuccess}</div>
              )}

              <div className="form-group">
                <label htmlFor="newPassword">New Password *</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password (minimum 6 characters)"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password *</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm new password"
                  required
                />
              </div>

              <div className="modal-actions">
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={passwordLoading}
                >
                  {passwordLoading ? 'Updating...' : 'Change Password'}
                </button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowPasswordModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDetailsPage
