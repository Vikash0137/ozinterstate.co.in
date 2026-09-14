import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import adminService from '../../services/adminService'
import './AdminFormPage.css'

const AdminFormPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditMode = !!id

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Admin',
    status: 'active',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (isEditMode) {
      loadAdmin()
    }
  }, [id])

  const loadAdmin = async () => {
    setLoading(true)
    try {
      const res = await adminService.getAdmin(id)
      if (res?.data?.success) {
        const admin = res.data.data.admin
        setFormData({
          name: admin.name || '',
          email: admin.email || '',
          password: '',
          confirmPassword: '',
          role: admin.role || 'Admin',
          status: admin.status || 'active',
        })
      }
    } catch (err) {
      console.error('Failed to load admin:', err)
      setError('Failed to load admin details.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required.')
      return false
    }

    if (!formData.email.trim()) {
      setError('Email is required.')
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.')
      return false
    }

    if (!isEditMode) {
      if (!formData.password) {
        setError('Password is required.')
        return false
      }

      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters.')
        return false
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match.')
        return false
      }
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      let res
      if (isEditMode) {
        res = await adminService.updateAdmin(id, {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          status: formData.status,
        })
      } else {
        res = await adminService.createAdmin({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          role: formData.role,
          status: formData.status,
        })
      }

      if (res?.data?.success) {
        setSuccess(isEditMode ? 'Admin updated successfully!' : 'Admin created successfully!')
        setTimeout(() => {
          navigate('/admins')
        }, 1500)
      }
    } catch (err) {
      console.error('Failed to save admin:', err)
      const errorMsg = err?.response?.data?.message || 'Failed to save admin.'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  if (loading && isEditMode) {
    return <div className="admin-form-loading">Loading admin details...</div>
  }

  return (
    <div className="admin-form-container">
      <div className="admin-form-header">
        <h1>{isEditMode ? 'Edit Admin' : 'Create New Admin'}</h1>
        <button className="btn-back" onClick={() => navigate('/admins')}>
          ← Back to Admins
        </button>
      </div>

      <form onSubmit={handleSubmit} className="admin-form">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="form-group">
          <label htmlFor="name">Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter admin name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email address"
            required
          />
        </div>

        {!isEditMode && (
          <>
            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password (minimum 6 characters)"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password *</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                required
              />
            </div>
          </>
        )}

        <div className="form-group">
          <label htmlFor="role">Role *</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="Admin">Admin</option>
            <option value="Super Admin">Super Admin</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="status">Status *</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {isEditMode && (
          <div className="form-group info-box">
            <p>To change password, please visit the admin details page and use "Change Password".</p>
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Saving...' : isEditMode ? 'Update Admin' : 'Create Admin'}
          </button>
          <button type="button" className="btn-cancel" onClick={() => navigate('/admins')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminFormPage
