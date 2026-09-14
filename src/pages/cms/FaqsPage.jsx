import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Edit2, Trash2, SlidersHorizontal, Loader2, HelpCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import faqService from '../../services/faqService'
import '../banners/Banners.css'

export default function FaqsPage() {
  const navigate = useNavigate()
  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const fetchFaqs = async () => {
    try {
      setLoading(true)
      let res
      let lastError

      for (let attempt = 0; attempt < 3; attempt += 1) {
        try {
          res = await faqService.getFAQs()
          break
        } catch (err) {
          lastError = err
          if (attempt < 2) {
            await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)))
          }
        }
      }

      if (!res) throw lastError

      if (res.data && res.data.success) {
        setFaqs(res.data.data || [])
      } else if (res.data) {
        setFaqs(res.data || [])
      } else {
         setFaqs(res || [])
      }
    } catch (err) {
      console.error('Error loading FAQs:', err)
      toast.error('Failed to load FAQs.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(fetchFaqs, 0)
    return () => clearTimeout(timer)
  }, [])

  const handleDelete = async (faq) => {
    if (!window.confirm('Are you sure you want to delete this FAQ?')) return

    if (!faq?._id) {
      toast.error('Unable to delete FAQ: invalid FAQ ID.')
      return
    }

    try {
      await faqService.deleteFAQ(faq._id)
      toast.success('FAQ deleted successfully.')
      setFaqs((currentFaqs) => currentFaqs.filter((currentFaq) => currentFaq._id !== faq._id))
    } catch (err) {
      console.error('FAQ DELETE ERROR:', err.response?.data || err)
      toast.error(err.response?.data?.message || 'Unable to delete FAQ.')
    }
  }

  const filteredFaqs = faqs.filter(f => 
    f.question?.toLowerCase().includes(search.toLowerCase()) || 
    f.category?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="banner-page-container">
      <div className="banner-page-header">
        <div>
          <h1 className="banner-page-title">Frequently Asked Questions</h1>
          <p className="banner-page-subtitle">Manage FAQs across the website, locations, and services.</p>
        </div>
        <button className="banner-add-button" onClick={() => navigate('/cms/faqs/create')}>
          <Plus size={18} /> Add New FAQ
        </button>
      </div>

      <div className="banner-toolbar">
        <div className="search-box-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search questions or categories..."
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
            <p>Loading FAQs...</p>
          </div>
        ) : filteredFaqs.length === 0 ? (
          <div className="banner-empty-state">
            <SlidersHorizontal size={40} className="empty-icon" />
            <h3>No FAQs found</h3>
            <p>Try adjusting your search query or create a new FAQ.</p>
            <button className="banner-add-button" onClick={() => navigate('/cms/faqs/create')}>
              <Plus size={16} /> Create FAQ
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="banner-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Question & Answer</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFaqs.map((faq, index) => (
                  <tr key={faq._id || index}>
                    <td className="font-mono">
                      <span className="order-chip">#{faq.display_order || 0}</span>
                    </td>
                    <td>
                      <div className="banner-table-title-cell max-w-md">
                        <strong className="title-text flex items-center gap-1.5 text-slate-800">
                          <HelpCircle size={16} className="text-slate-400" />
                          {faq.question}
                        </strong>
                        <p className="subtitle-text line-clamp-1 mt-1 text-slate-500" title={faq.answer}>
                          {faq.answer}
                        </p>
                      </div>
                    </td>
                    <td>
                      <span className="rounded bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 capitalize">
                        {faq.category || 'General'}
                      </span>
                    </td>
                    <td>
                      <span className={`status-toggle-button status-${faq.status || 'active'}`}>
                        {faq.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons-group">
                        <button className="action-btn edit-btn" onClick={() => navigate(`/cms/faqs/edit/${faq.id || faq._id}`)}>
                          <Edit2 size={16} />
                        </button>
                        <button className="action-btn delete-btn" onClick={() => handleDelete(faq)}>
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
