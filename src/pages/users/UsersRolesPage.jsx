import { useState, useEffect } from 'react'
import { Plus, Search, ShieldCheck, UserCheck, Trash2, Edit2, Loader2, Key, Mail, Phone, Lock } from 'lucide-react'
import toast from 'react-hot-toast'
import adminService from '../../services/adminService'
import '../banners/Banners.css'
import './UsersRolesPage.css'

export default function UsersRolesPage() {
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingAdmin, setEditingAdmin] = useState(null)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'admin',
    password: '',
    status: 'active'
  })

  const loadAdmins = async () => {
    try {
      setLoading(true)
      const res = await adminService.getAdmins()
      const data = res.data?.data || res.data || res || []
      setAdmins(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to load admins:', err)
      toast.error('Failed to load users & roles')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAdmins()
  }, [])

  useEffect(() => {
    if (!showModal) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [showModal])

  const handleOpenCreate = () => {
    setEditingAdmin(null)
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'admin',
      password: '',
      status: 'active'
    })
    setShowModal(true)
  }

  const handleOpenEdit = (admin) => {
    setEditingAdmin(admin)
    setFormData({
      name: admin.name || '',
      email: admin.email || '',
      phone: admin.phone || '',
      role: admin.role || 'admin',
      password: '',
      status: admin.status || 'active'
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this administrator account?')) return
    try {
      await adminService.deleteAdmin(id)
      toast.success('Admin user removed successfully')
      loadAdmins()
    } catch (err) {
      console.error('Failed to delete admin:', err)
      toast.error('Failed to delete admin')
    }
  }

  const handleToggleStatus = async (admin) => {
    const nextStatus = admin.status === 'active' ? 'inactive' : 'active'
    try {
      await adminService.updateAdminStatus(admin._id || admin.id, nextStatus)
      toast.success(`User marked as ${nextStatus}`)
      loadAdmins()
    } catch (err) {
      console.error('Failed to update status:', err)
      toast.error('Failed to update status')
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      if (editingAdmin) {
        await adminService.updateAdmin(editingAdmin._id || editingAdmin.id, formData)
        toast.success('User updated successfully')
      } else {
        await adminService.createAdmin(formData)
        toast.success('User account created successfully')
      }
      setShowModal(false)
      loadAdmins()
    } catch (err) {
      console.error('Failed to save user:', err)
      toast.error(err.response?.data?.message || 'Failed to save user')
    } finally {
      setSaving(false)
    }
  }

  const filteredAdmins = admins.filter(a =>
    a.name?.toLowerCase().includes(search.toLowerCase()) ||
    a.email?.toLowerCase().includes(search.toLowerCase()) ||
    a.role?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="banner-page-container">
      {/* Header */}
      <div className="banner-page-header">
        <div>
          <h1 className="banner-page-title">Users & Role Access Control</h1>
          <p className="banner-page-subtitle">Manage administrative team members, access roles, and system permissions.</p>
        </div>
        <button onClick={handleOpenCreate} className="banner-add-button">
          <Plus size={18} /> Add New User
        </button>
      </div>

      {/* Toolbar */}
      <div className="banner-toolbar">
        <div className="search-box-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, email, or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Table */}
      <div className="banner-table-card">
        {loading ? (
          <div className="banner-loading-state">
            <Loader2 size={32} className="spinner" />
            <p>Loading users & roles...</p>
          </div>
        ) : filteredAdmins.length === 0 ? (
          <div className="banner-empty-state">
            <ShieldCheck size={40} className="empty-icon" />
            <h3>No users found</h3>
            <p>Create staff or administrator accounts to grant dashboard access.</p>
            <button className="banner-add-button" onClick={handleOpenCreate}>
              <Plus size={16} /> Add User
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="banner-table">
              <thead>
                <tr>
                  <th>User Details</th>
                  <th>Contact Info</th>
                  <th>Role & Access</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAdmins.map((admin, index) => (
                  <tr key={admin._id || index}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '15px' }}>
                          {admin.name ? admin.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <strong style={{ fontSize: '14px', color: '#1e293b', display: 'block' }}>{admin.name}</strong>
                          <span style={{ fontSize: '12px', color: '#64748b' }}>Admin ID: {admin.id || admin._id?.substring(0, 8)}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '13px', color: '#334155' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Mail size={13} style={{ color: '#94a3b8' }} /> {admin.email}
                        </div>
                        {admin.phone && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px', color: '#64748b' }}>
                            <Phone size={13} style={{ color: '#94a3b8' }} /> {admin.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '700',
                        textTransform: 'capitalize',
                        background: admin.role === 'super_admin' ? '#fef3c7' : admin.role === 'admin' ? '#e0f2fe' : '#f1f5f9',
                        color: admin.role === 'super_admin' ? '#b45309' : admin.role === 'admin' ? '#0369a1' : '#475569'
                      }}>
                        <ShieldCheck size={13} /> {admin.role?.replace('_', ' ') || 'Admin'}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(admin)}
                        className={`status-toggle-button status-${admin.status || 'active'}`}
                      >
                        {admin.status === 'active' ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td>
                      <div className="action-buttons-group">
                        <button className="action-btn edit-btn" onClick={() => handleOpenEdit(admin)} title="Edit User">
                          <Edit2 size={16} />
                        </button>
                        <button className="action-btn delete-btn" onClick={() => handleDelete(admin._id || admin.id)} title="Delete User">
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

      {/* Create / Edit Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="banner-form-main-card users-roles-modal" style={{ maxWidth: '520px', width: '100%', maxHeight: 'calc(100vh - 40px)', borderRadius: '16px', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b', margin: 0 }}>
                {editingAdmin ? 'Edit User & Role' : 'Create Administrator Account'}
              </h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#94a3b8' }}>&times;</button>
            </div>

            <form className="users-roles-modal-content" onSubmit={handleSave} style={{ padding: '24px', maxHeight: 'calc(100vh - 140px)', overflowY: 'auto' }}>
              <div className="form-row">
                <div className="form-group col-full">
                  <label className="required">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="form-input"
                    placeholder="e.g. John Smith"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-full">
                  <label className="required">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="form-input"
                    placeholder="john@oz-interstate.com.au"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-half">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="form-input"
                    placeholder="+61 4XX XXX XXX"
                  />
                </div>
                <div className="form-group col-half">
                  <label className="required">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    className="form-select font-bold"
                  >
                    <option value="super_admin">Super Admin (Full Control)</option>
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="editor">Content Editor</option>
                  </select>
                </div>
              </div>

              {!editingAdmin && (
                <div className="form-row">
                  <div className="form-group col-full">
                    <label className="required">Initial Password</label>
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className="form-input"
                      placeholder="Minimum 8 characters"
                    />
                  </div>
                </div>
              )}

              <div className="form-row">
                <div className="form-group col-full">
                  <label>Account Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="form-select"
                  >
                    <option value="active">Active (Access Granted)</option>
                    <option value="inactive">Inactive (Suspended)</option>
                  </select>
                </div>
              </div>

              <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{ padding: '10px 18px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#fff', color: '#475569', fontWeight: '600', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="banner-add-button"
                >
                  {saving ? <Loader2 size={16} className="spinner" /> : <ShieldCheck size={16} />}
                  {saving ? 'Saving...' : editingAdmin ? 'Update Account' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
