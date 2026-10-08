import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Edit2, Trash2, SlidersHorizontal, Loader2, Star, UserCircle, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import reviewService from '../../services/reviewService'
import '../banners/Banners.css'

export default function ReviewsPage() {
  const navigate = useNavigate()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const res = await reviewService.getReviews()
      if (res.data && res.data.success) {
        setReviews(res.data.data || [])
      } else if (res.data) {
        setReviews(res.data || [])
      } else {
         setReviews(res || [])
      }
    } catch (err) {
      console.error('Error loading reviews:', err)
      toast.error('Failed to load reviews.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(fetchReviews, 0)
    return () => clearTimeout(timer)
  }, [])

  const handleDelete = async (review) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return
    if (!review?._id) {
      toast.error('Unable to delete review: invalid review ID.')
      return
    }
    try {
      await reviewService.deleteReview(review._id)
      toast.success('Review deleted successfully.')
      setReviews((currentReviews) => currentReviews.filter((currentReview) => currentReview._id !== review._id))
    } catch (err) {
      console.error('REVIEW DELETE ERROR:', err.response?.data || err)
      toast.error(err.response?.data?.message || 'Unable to delete review.')
    }
  }

  const filteredReviews = reviews.filter(r => 
    r.name?.toLowerCase().includes(search.toLowerCase()) || 
    r.content?.toLowerCase().includes(search.toLowerCase())
  )

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} size={14} className={i < rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'} />
    ))
  }

  return (
    <div className="banner-page-container">
      <div className="banner-page-header">
        <div>
          <h1 className="banner-page-title">Testimonials & Reviews</h1>
          <p className="banner-page-subtitle">Manage customer reviews, ratings, and display settings.</p>
        </div>
        <button className="banner-add-button" onClick={() => navigate('/cms/reviews/create')}>
          <Plus size={18} /> Add New Review
        </button>
      </div>

      <div className="banner-toolbar">
        <div className="search-box-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by customer name or content..."
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
            <p>Loading reviews...</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="banner-empty-state">
            <SlidersHorizontal size={40} className="empty-icon" />
            <h3>No reviews found</h3>
            <p>Try adjusting your search query or add a new review.</p>
            <button className="banner-add-button" onClick={() => navigate('/cms/reviews/create')}>
              <Plus size={16} /> Add Review
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="banner-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Rating & Content</th>
                  <th>Route / Location</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReviews.map((review, index) => (
                  <tr key={review._id || index}>
                    <td>
                      <div className="flex items-center gap-3">
                        {review.avatar ? (
                          <img src={review.avatar} alt={review.name} className="h-10 w-10 rounded-full object-cover border border-slate-200" />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                            <UserCircle size={24} />
                          </div>
                        )}
                        <div>
                          <strong className="block text-sm font-semibold text-slate-800">{review.name}</strong>
                          <span className="text-xs text-slate-500">{review.role || 'Customer'}</span>
                          {review.isVerified && (
                             <span className="ml-1 inline-flex items-center text-[10px] text-green-600"><CheckCircle2 size={10} className="mr-0.5" />Verified</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="banner-table-title-cell max-w-xs">
                        <div className="mb-1 flex items-center gap-0.5">
                          {renderStars(review.rating || 5)}
                        </div>
                        <p className="subtitle-text line-clamp-2" title={review.content}>
                          "{review.content}"
                        </p>
                      </div>
                    </td>
                    <td>
                      <span className="text-sm font-medium text-slate-600">{review.route || '—'}</span>
                    </td>
                    <td>
                      <span className={`status-toggle-button status-${review.status || 'active'}`}>
                        {review.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons-group">
                        <button className="action-btn edit-btn" onClick={() => navigate(`/cms/reviews/edit/${review._id}`)}>
                          <Edit2 size={16} />
                        </button>
                        <button className="action-btn delete-btn" onClick={() => handleDelete(review)}>
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
