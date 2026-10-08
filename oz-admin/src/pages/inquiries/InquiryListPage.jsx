import { useState, useEffect } from 'react'
import {
  Search,
  SlidersHorizontal,
  Download,
  Printer,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Loader2,
  RefreshCw,
  Mail,
  Phone,
  User,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  FileSpreadsheet,
} from 'lucide-react'
import toast from 'react-hot-toast'
import inquiryService from '../../services/inquiryService'
import './Inquiries.css'

export default function InquiryListPage() {
  const [responses, setResponses] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState('desc')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 })

  // Selection & Bulk Actions
  const [selectedIds, setSelectedIds] = useState([])

  // Modals
  const [viewingResponse, setViewingResponse] = useState(null)
  const [deletingResponse, setDeletingResponse] = useState(null)
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchResponses = async () => {
    try {
      setLoading(true)
      const res = await inquiryService.getAllResponses({
        search,
        status: statusFilter,
        sortBy,
        sortOrder,
        page,
        limit: 10,
      })
      if (res.success) {
        setResponses(res.data || [])
        setPagination(res.pagination || { total: 0, totalPages: 1 })
      }
    } catch (err) {
      console.error('Failed to fetch inquiry responses:', err)
      toast.error('Failed to load inquiries.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchResponses()
  }, [search, statusFilter, sortBy, sortOrder, page])

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(responses.map((r) => r.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await inquiryService.updateResponseStatus(id, newStatus)
      if (res.success) {
        toast.success(`Inquiry marked as ${newStatus}`)
        fetchResponses()
      }
    } catch (err) {
      console.error('Failed to update status:', err)
      toast.error('Failed to update status.')
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deletingResponse) return
    try {
      setIsDeleting(true)
      const res = await inquiryService.deleteResponse(deletingResponse.id)
      if (res.success) {
        toast.success('Inquiry deleted successfully.')
        setDeletingResponse(null)
        fetchResponses()
      }
    } catch (err) {
      console.error('Failed to delete inquiry:', err)
      toast.error('Failed to delete inquiry.')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleBulkDeleteConfirm = async () => {
    if (selectedIds.length === 0) return
    try {
      setIsDeleting(true)
      const res = await inquiryService.bulkDeleteResponses(selectedIds)
      if (res.success) {
        toast.success(`${selectedIds.length} inquiries deleted successfully.`)
        setSelectedIds([])
        setShowBulkDeleteModal(false)
        fetchResponses()
      }
    } catch (err) {
      console.error('Failed to bulk delete:', err)
      toast.error('Failed to bulk delete inquiries.')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleExportCsv = () => {
    window.open(inquiryService.getExportCsvUrl(), '_blank')
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="banner-page-container">
      {/* Header */}
      <div className="banner-page-header">
        <div>
          <h1 className="banner-page-title">Inquiry Submissions</h1>
          <p className="banner-page-subtitle">
            View, search, filter, and manage customer quote requests submitted through the Hero Quote Form.
          </p>
        </div>

        <div className="topbar-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={handleExportCsv}
            title="Export CSV"
          >
            <Download size={16} /> Export CSV
          </button>

          <button
            type="button"
            className="btn-secondary"
            onClick={handlePrint}
            title="Print View"
          >
            <Printer size={16} /> Print
          </button>
        </div>
      </div>

      {/* Toolbar Controls */}
      <div className="banner-toolbar">
        <div className="search-box-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, email, phone, date..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="search-input"
          />
        </div>

        <div className="toolbar-filter-group">
          {/* Status Tabs */}
          <div className="status-filter-pills">
            {['all', 'new', 'contacted', 'completed', 'spam'].map((st) => (
              <button
                key={st}
                type="button"
                className={`pill-btn ${statusFilter === st ? 'active' : ''}`}
                onClick={() => {
                  setStatusFilter(st)
                  setPage(1)
                }}
              >
                {st.charAt(0).toUpperCase() + st.slice(1)}
              </button>
            ))}
          </div>

          {selectedIds.length > 0 && (
            <button
              type="button"
              className="btn-danger-sm"
              onClick={() => setShowBulkDeleteModal(true)}
            >
              <Trash2 size={14} /> Bulk Delete ({selectedIds.length})
            </button>
          )}

          <button
            type="button"
            className="btn-refresh"
            onClick={fetchResponses}
            title="Refresh List"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Inquiries Table Card */}
      <div className="banner-table-card">
        {loading ? (
          <div className="banner-loading-state">
            <Loader2 size={32} className="spinner" />
            <p>Loading inquiries...</p>
          </div>
        ) : responses.length === 0 ? (
          <div className="banner-empty-state">
            <SlidersHorizontal size={40} className="empty-icon" />
            <h3>No inquiries found</h3>
            <p>No customer quote submissions match your current filters.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="banner-table">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>
                    <input
                      type="checkbox"
                      checked={
                        responses.length > 0 && selectedIds.length === responses.length
                      }
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th>ID</th>
                  <th>Customer Info</th>
                  <th>Locations (From → To)</th>
                  <th>Date & Property</th>
                  <th>Status</th>
                  <th>Submitted Date</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {responses.map((item) => {
                  const d = item.response_data || {}
                  const isChecked = selectedIds.includes(item.id)

                  return (
                    <tr key={item.id} className={isChecked ? 'row-selected' : ''}>
                      <td>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleSelectOne(item.id)}
                        />
                      </td>

                      <td className="font-mono">#{item.id}</td>

                      <td>
                        <div className="customer-info-cell">
                          <strong className="customer-name">
                            <User size={13} /> {d.name || 'Anonymous'}
                          </strong>
                          {d.phone && (
                            <span className="customer-sub-text">
                              <Phone size={12} /> {d.phone}
                            </span>
                          )}
                          {d.email && (
                            <span className="customer-sub-text">
                              <Mail size={12} /> {d.email}
                            </span>
                          )}
                        </div>
                      </td>

                      <td>
                        <div className="locations-cell">
                          <span>From: {d.from || '—'}</span>
                          <span>To: {d.to || '—'}</span>
                        </div>
                      </td>

                      <td>
                        <div className="locations-cell">
                          <span>Date: {d.date || 'Flexible'}</span>
                          <span>Property: {d.property || '—'}</span>
                        </div>
                      </td>

                      <td>
                        <select
                          value={item.status}
                          onChange={(e) => handleStatusChange(item.id, e.target.value)}
                          className={`status-select-badge status-${item.status}`}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="completed">Completed</option>
                          <option value="spam">Spam</option>
                        </select>
                      </td>

                      <td className="text-muted text-sm">
                        {new Date(item.created_at).toLocaleString()}
                      </td>

                      <td>
                        <div className="action-buttons-group">
                          <button
                            type="button"
                            className="action-btn view-btn"
                            onClick={() => setViewingResponse(item)}
                            title="View Full Details"
                          >
                            <Eye size={16} />
                          </button>

                          <button
                            type="button"
                            className="action-btn delete-btn"
                            onClick={() => setDeletingResponse(item)}
                            title="Delete Inquiry"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {pagination.totalPages > 1 && (
          <div className="banner-pagination">
            <span className="pagination-info">
              Showing page <strong>{page}</strong> of{' '}
              <strong>{pagination.totalPages}</strong> ({pagination.total} inquiries)
            </span>

            <div className="pagination-controls">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="btn-page"
              >
                <ChevronLeft size={16} /> Previous
              </button>

              <button
                type="button"
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="btn-page"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* VIEW SUBMISSION DETAILS MODAL */}
      {viewingResponse && (
        <div className="banner-modal-overlay">
          <div className="banner-modal-content view-modal-content">
            <div className="banner-modal-header">
              <div className="modal-title-row">
                <User size={20} className="modal-icon" />
                <h3>Inquiry Submission Details #{viewingResponse.id}</h3>
              </div>
              <button
                type="button"
                className="banner-modal-close"
                onClick={() => setViewingResponse(null)}
              >
                <XCircle size={20} />
              </button>
            </div>

            <div className="banner-modal-body">
              <div className="view-detail-card mb-4">
                <h4>Submission Status</h4>
                <div className="detail-row">
                  <span className="label">Status:</span>
                  <span className="value capitalize font-bold">
                    {viewingResponse.status}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="label">Submitted At:</span>
                  <span className="value">
                    {new Date(viewingResponse.created_at).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="view-detail-card">
                <h4>Form Fields Data</h4>
                {Object.entries(viewingResponse.response_data || {}).map(
                  ([key, val]) => (
                    <div key={key} className="detail-row">
                      <span className="label capitalize">{key.replace(/_/g, ' ')}:</span>
                      <span className="value font-semibold">
                        {val ? String(val) : '—'}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="banner-modal-footer">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setViewingResponse(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingResponse && (
        <div className="banner-modal-overlay">
          <div className="banner-modal-content delete-modal-content">
            <div className="delete-modal-header">
              <AlertTriangle size={32} className="warning-icon" />
              <h3>Delete Inquiry?</h3>
            </div>

            <p className="delete-modal-text">
              Are you sure you want to delete inquiry submission #{deletingResponse.id}? This action cannot be undone.
            </p>

            <div className="banner-modal-footer">
              <button
                type="button"
                className="btn-secondary"
                disabled={isDeleting}
                onClick={() => setDeletingResponse(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-danger"
                disabled={isDeleting}
                onClick={handleDeleteConfirm}
              >
                {isDeleting ? (
                  <>
                    <Loader2 size={16} className="spinner" /> Deleting...
                  </>
                ) : (
                  'Yes, Delete Inquiry'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BULK DELETE CONFIRMATION MODAL */}
      {showBulkDeleteModal && (
        <div className="banner-modal-overlay">
          <div className="banner-modal-content delete-modal-content">
            <div className="delete-modal-header">
              <AlertTriangle size={32} className="warning-icon" />
              <h3>Bulk Delete {selectedIds.length} Inquiries?</h3>
            </div>

            <p className="delete-modal-text">
              Are you sure you want to delete all {selectedIds.length} selected inquiries?
            </p>

            <div className="banner-modal-footer">
              <button
                type="button"
                className="btn-secondary"
                disabled={isDeleting}
                onClick={() => setShowBulkDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-danger"
                disabled={isDeleting}
                onClick={handleBulkDeleteConfirm}
              >
                {isDeleting ? (
                  <>
                    <Loader2 size={16} className="spinner" /> Deleting...
                  </>
                ) : (
                  `Delete ${selectedIds.length} Items`
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
