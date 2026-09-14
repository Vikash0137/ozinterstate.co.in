import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Plus,
  Search,
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  AlertTriangle,
  Loader2,
  RefreshCw,
  Video as VideoIcon,
  Image as ImageIcon,
  Film,
} from 'lucide-react'
import toast from 'react-hot-toast'
import bannerService from '../../services/bannerService'
import BannerViewModal from './BannerViewModal'
import './Banners.css'

export default function BannerListPage() {
  const navigate = useNavigate()

  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('display_order')
  const [sortOrder, setSortOrder] = useState('asc')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 })

  // Modal States
  const [viewingBanner, setViewingBanner] = useState(null)
  const [deletingBanner, setDeletingBanner] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchBanners = async () => {
    try {
      setLoading(true)
      const res = await bannerService.getAllBanners({
        search,
        status: statusFilter,
        sortBy,
        sortOrder,
        page,
        limit: 8,
      })
      if (res.success) {
        setBanners(res.data || [])
        setPagination(res.pagination || { total: 0, totalPages: 1 })
      }
    } catch (err) {
      console.error('Error loading banners:', err)
      toast.error('Failed to load banners.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBanners()
  }, [search, statusFilter, sortBy, sortOrder, page])

  const handleToggleStatus = async (banner) => {
    const newStatus = banner.status === 'active' ? 'inactive' : 'active'
    try {
      const res = await bannerService.toggleBannerStatus(banner.id, newStatus)
      if (res.success) {
        toast.success(`Banner status updated to ${newStatus}`)
        fetchBanners()
      }
    } catch (err) {
      console.error('Failed to toggle status:', err)
      toast.error('Failed to update status.')
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deletingBanner) return
    try {
      setIsDeleting(true)
      const res = await bannerService.deleteBanner(deletingBanner.id)
      if (res.success) {
        toast.success('Banner deleted successfully.')
        setDeletingBanner(null)
        fetchBanners()
      }
    } catch (err) {
      console.error('Failed to delete banner:', err)
      toast.error('Failed to delete banner.')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleSortChange = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('asc')
    }
  }

  const apiHost = import.meta.env.VITE_API_BASE_URL || '/ozinterstate/api'

  const getMediaUrl = (path) => {
    if (!path) return null
    if (path.startsWith('http') || path.startsWith('data:')) return path
    return `${apiHost}${path}`
  }

  return (
    <div className="banner-page-container">
      {/* Page Header */}
      <div className="banner-page-header">
        <div>
          <h1 className="banner-page-title">Banner Management</h1>
          <p className="banner-page-subtitle">
            Manage website Hero banners (Image & Video background), typography, and action buttons.
          </p>
        </div>

        <button
          type="button"
          className="banner-add-button"
          onClick={() => navigate('/banners/create')}
        >
          <Plus size={18} /> Add New Banner
        </button>
      </div>

      {/* Toolbar Controls */}
      <div className="banner-toolbar">
        <div className="search-box-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by title, subtitle..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="search-input"
          />
        </div>

        <div className="toolbar-filter-group">
          <div className="filter-select-wrapper">
            <SlidersHorizontal size={16} className="filter-icon" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setPage(1)
              }}
              className="filter-select"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>

          <button
            type="button"
            className="btn-refresh"
            onClick={fetchBanners}
            title="Refresh List"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Banner Data Table */}
      <div className="banner-table-card">
        {loading ? (
          <div className="banner-loading-state">
            <Loader2 size={32} className="spinner" />
            <p>Loading banners...</p>
          </div>
        ) : banners.length === 0 ? (
          <div className="banner-empty-state">
            <SlidersHorizontal size={40} className="empty-icon" />
            <h3>No banners found</h3>
            <p>Try adjusting your search query or add a new hero banner.</p>
            <button
              type="button"
              className="banner-add-button"
              onClick={() => navigate('/banners/create')}
            >
              <Plus size={16} /> Add Banner
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="banner-table">
              <thead>
                <tr>
                  <th
                    className="sortable"
                    onClick={() => handleSortChange('display_order')}
                  >
                    <div className="th-content">
                      Order <ArrowUpDown size={14} />
                    </div>
                  </th>
                  <th>Media Type</th>
                  <th>Banner Media Preview</th>
                  <th
                    className="sortable"
                    onClick={() => handleSortChange('title')}
                  >
                    <div className="th-content">
                      Title & Subtitle <ArrowUpDown size={14} />
                    </div>
                  </th>
                  <th>Button</th>
                  <th
                    className="sortable"
                    onClick={() => handleSortChange('status')}
                  >
                    <div className="th-content">
                      Status <ArrowUpDown size={14} />
                    </div>
                  </th>
                  <th>Created Date</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {banners.map((banner) => {
                  const imgUrl = getMediaUrl(banner.image)
                  const videoUrl = getMediaUrl(banner.video_url)
                  const isVideo = banner.media_type === 'video'

                  return (
                    <tr key={banner._id}>
                      <td className="font-mono">
                        <span className="order-chip">#{banner.display_order}</span>
                      </td>

                      <td>
                        <span
                          className={`media-type-badge ${
                            isVideo ? 'badge-video' : 'badge-image'
                          }`}
                        >
                          {isVideo ? (
                            <><Film size={13} /> Video</>
                          ) : (
                            <><ImageIcon size={13} /> Image</>
                          )}
                        </span>
                      </td>

                      <td>
                        <div className="table-image-preview">
                          {isVideo ? (
                            videoUrl ? (
                              <video
                                src={videoUrl}
                                muted
                                className="table-video-thumb"
                              />
                            ) : (
                              <div className="table-image-placeholder">
                                <span>Video File</span>
                              </div>
                            )
                          ) : imgUrl ? (
                            <img src={imgUrl} alt={banner.title} />
                          ) : (
                            <div className="table-image-placeholder">
                              <span>No Image</span>
                            </div>
                          )}
                        </div>
                      </td>

                      <td>
                        <div className="banner-table-title-cell">
                          <strong className="title-text" style={{ color: banner.title_color }}>
                            {banner.title}
                          </strong>
                          {banner.subtitle && (
                            <span className="subtitle-text">
                              {banner.subtitle}
                            </span>
                          )}
                        </div>
                      </td>

                      <td>
                        {banner.button_text ? (
                          <span
                            className="button-pill-badge"
                            style={{
                              backgroundColor: banner.button_background_color || '#0284c7',
                              color: banner.button_text_color || '#ffffff',
                            }}
                          >
                            {banner.button_text}
                          </span>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>

                      <td>
                        <button
                          type="button"
                          className={`status-toggle-button status-${banner.status}`}
                          onClick={() => handleToggleStatus(banner)}
                          title="Click to toggle status"
                        >
                          {banner.status === 'active' ? (
                            <>
                              <CheckCircle2 size={14} /> Active
                            </>
                          ) : (
                            <>
                              <XCircle size={14} /> Inactive
                            </>
                          )}
                        </button>
                      </td>

                      <td className="text-muted text-sm">
                        {new Date(banner.created_at).toLocaleDateString()}
                      </td>

                      <td>
                        <div className="action-buttons-group">
                          <button
                            type="button"
                            className="action-btn view-btn"
                            onClick={() => setViewingBanner(banner)}
                            title="View Banner Details"
                          >
                            <Eye size={16} />
                          </button>

                          <button
                            type="button"
                            className="action-btn edit-btn"
                            onClick={() => navigate(`/banners/edit/${banner.id}`)}
                            title="Edit Banner"
                          >
                            <Edit2 size={16} />
                          </button>

                          <button
                            type="button"
                            className="action-btn delete-btn"
                            onClick={() => setDeletingBanner(banner)}
                            title="Delete Banner"
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
              <strong>{pagination.totalPages}</strong> ({pagination.total} banners)
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

      {/* View Modal */}
      {viewingBanner && (
        <BannerViewModal
          banner={viewingBanner}
          onClose={() => setViewingBanner(null)}
          onEdit={(id) => navigate(`/banners/edit/${id}`)}
        />
      )}

      {/* Confirmation Dialog before Delete */}
      {deletingBanner && (
        <div className="banner-modal-overlay">
          <div className="banner-modal-content delete-modal-content">
            <div className="delete-modal-header">
              <AlertTriangle size={32} className="warning-icon" />
              <h3>Delete Banner?</h3>
            </div>

            <p className="delete-modal-text">
              Are you sure you want to delete banner{' '}
              <strong>"{deletingBanner.title}"</strong>? This action cannot be
              undone.
            </p>

            <div className="banner-modal-footer">
              <button
                type="button"
                className="btn-secondary"
                disabled={isDeleting}
                onClick={() => setDeletingBanner(null)}
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
                  'Yes, Delete Banner'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
