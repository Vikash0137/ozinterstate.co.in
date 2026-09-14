import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Edit2, SlidersHorizontal, Loader2, Layout, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import pageService from '../../services/pageService'
import '../banners/Banners.css'

export default function PagesPage() {
  const navigate = useNavigate()
  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const fetchPages = async () => {
    try {
      setLoading(true)
      const res = await pageService.getPages()
      if (res.data && res.data.success) {
        setPages(res.data.data || [])
      } else if (res.data) {
        setPages(res.data || [])
      } else {
         setPages(res || [])
      }
    } catch (err) {
      console.error('Error loading pages:', err)
      toast.error('Failed to load pages.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPages()
  }, [])

  const filteredPages = pages.filter(p => 
    p.title?.toLowerCase().includes(search.toLowerCase()) || 
    p.slug?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="banner-page-container">
      <div className="banner-page-header">
        <div>
          <h1 className="banner-page-title">Pages & Sections Management</h1>
          <p className="banner-page-subtitle">Manage website landing pages, metadata, and SEO settings.</p>
        </div>
        <button className="banner-add-button" onClick={() => toast('Page Builder coming soon!')} disabled>
          <Plus size={18} /> Add Custom Page
        </button>
      </div>

      <div className="banner-toolbar">
        <div className="search-box-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by page title or slug..."
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
            <p>Loading pages...</p>
          </div>
        ) : filteredPages.length === 0 ? (
          <div className="banner-empty-state">
            <SlidersHorizontal size={40} className="empty-icon" />
            <h3>No pages found</h3>
            <p>Ensure the database is seeded or check your connection.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="banner-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Page Info</th>
                  <th>Route / URL</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPages.map((page, index) => (
                  <tr key={page._id || index}>
                    <td>
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
                        <Layout size={20} />
                      </div>
                    </td>
                    <td>
                      <div className="banner-table-title-cell">
                        <strong className="title-text">{page.title}</strong>
                        <span className="text-xs text-slate-500 uppercase">{page.pageType || 'Custom'}</span>
                      </div>
                    </td>
                    <td>
                      <a href={`http://localhost:5173${page.route}`} target="_blank" rel="noreferrer" className="text-sm font-medium text-sky-600 hover:underline">
                        {page.route}
                      </a>
                    </td>
                    <td>
                      <span className={`status-toggle-button status-${page.status || 'published'}`}>
                        {page.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons-group">
                        <button className="action-btn edit-btn" onClick={() => toast('Page editor module in progress.')} title="Edit Page Metadata">
                          <Edit2 size={16} />
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
