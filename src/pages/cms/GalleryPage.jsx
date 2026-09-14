import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Edit2, Trash2, SlidersHorizontal, Loader2, Image as ImageIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import galleryService from '../../services/galleryService'
import '../banners/Banners.css'

export default function GalleryPage() {
  const navigate = useNavigate()
  const [gallery, setGallery] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const fetchGallery = async () => {
    try {
      setLoading(true)
      const res = await galleryService.getGallery()
      if (res.data && res.data.success) {
        setGallery(res.data.data || [])
      } else if (res.data) {
        setGallery(res.data || [])
      } else {
         setGallery(res || [])
      }
    } catch (err) {
      console.error('Error loading gallery:', err)
      toast.error('Failed to load gallery.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(fetchGallery, 0)
    return () => clearTimeout(timer)
  }, [])

  const handleDelete = async (item) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return
    if (!item?._id) {
      toast.error('Unable to delete image: invalid gallery ID.')
      return
    }
    try {
      await galleryService.deleteGalleryImage(item._id)
      toast.success('Image deleted successfully.')
      setGallery((currentGallery) => currentGallery.filter((currentItem) => currentItem._id !== item._id))
    } catch (err) {
      console.error('Failed to delete image:', err)
      toast.error(err.response?.data?.message || 'Unable to delete image.')
    }
  }

  const filteredGallery = gallery.filter(g => 
    g.title?.toLowerCase().includes(search.toLowerCase()) || 
    g.category?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="banner-page-container">
      <div className="banner-page-header">
        <div>
          <h1 className="banner-page-title">Gallery Management</h1>
          <p className="banner-page-subtitle">Manage website portfolio, fleet images, and masonry grids.</p>
        </div>
        <button className="banner-add-button" onClick={() => navigate('/cms/gallery/create')}>
          <Plus size={18} /> Add New Image
        </button>
      </div>

      <div className="banner-toolbar">
        <div className="search-box-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by title or category..."
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
            <p>Loading gallery...</p>
          </div>
        ) : filteredGallery.length === 0 ? (
          <div className="banner-empty-state">
            <SlidersHorizontal size={40} className="empty-icon" />
            <h3>No images found</h3>
            <p>Try adjusting your search query or upload a new image.</p>
            <button className="banner-add-button" onClick={() => navigate('/cms/gallery/create')}>
              <Plus size={16} /> Upload Image
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="banner-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Details & Caption</th>
                  <th>Grid Span</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredGallery.map((item, index) => (
                  <tr key={item._id || index}>
                    <td>
                      <div className="table-image-preview">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.altText || item.title} />
                        ) : (
                          <div className="table-image-placeholder">
                            <ImageIcon size={20} className="text-slate-400" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="banner-table-title-cell max-w-xs">
                        <strong className="title-text">{item.title || 'Untitled'}</strong>
                        <div className="flex items-center gap-2 mt-1">
                           <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 capitalize">{item.category || 'General'}</span>
                        </div>
                        {item.caption && (
                          <p className="text-xs text-slate-500 mt-1 line-clamp-1">{item.caption}</p>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="font-mono text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded">{item.span || 'col-span-1'}</span>
                    </td>
                    <td>
                      <span className={`status-toggle-button status-${item.status || 'active'}`}>
                        {item.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons-group">
                        <button className="action-btn edit-btn" onClick={() => navigate(`/cms/gallery/edit/${item._id}`)}>
                          <Edit2 size={16} />
                        </button>
                        <button className="action-btn delete-btn" onClick={() => handleDelete(item)}>
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
