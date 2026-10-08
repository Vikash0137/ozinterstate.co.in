import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Edit2, Trash2, SlidersHorizontal, Loader2, BookOpen } from 'lucide-react'
import toast from 'react-hot-toast'
import blogService from '../../services/blogService'
import '../banners/Banners.css'

export default function BlogsPage() {
  const navigate = useNavigate()
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      const res = await blogService.getBlogs()
      if (res.data && res.data.success) {
        setBlogs(res.data.data || [])
      } else if (res.data) {
        setBlogs(res.data || [])
      } else {
         setBlogs(res || [])
      }
    } catch (err) {
      console.error('Error loading blogs:', err)
      toast.error('Failed to load blogs.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(fetchBlogs, 0)
    return () => clearTimeout(timer)
  }, [])

  const handleDelete = async (blog) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return
    if (!blog?._id) {
      toast.error('Unable to delete blog: invalid blog ID.')
      return
    }
    try {
      await blogService.deleteBlog(blog._id)
      toast.success('Blog deleted successfully.')
      setBlogs((currentBlogs) => currentBlogs.filter((currentBlog) => currentBlog._id !== blog._id))
    } catch (err) {
      console.error('Failed to delete blog:', err)
      toast.error(err.response?.data?.message || 'Unable to delete blog.')
    }
  }

  const filteredBlogs = blogs.filter(b => 
    b.title?.toLowerCase().includes(search.toLowerCase()) || 
    b.category?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="banner-page-container">
      <div className="banner-page-header">
        <div>
          <h1 className="banner-page-title">Blog Management</h1>
          <p className="banner-page-subtitle">Manage blog posts, articles, and SEO optimization.</p>
        </div>
        <button className="banner-add-button" onClick={() => navigate('/cms/blogs/create')}>
          <Plus size={18} /> Add New Post
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
            <p>Loading blogs...</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="banner-empty-state">
            <SlidersHorizontal size={40} className="empty-icon" />
            <h3>No blog posts found</h3>
            <p>Try adjusting your search query or create a new post.</p>
            <button className="banner-add-button" onClick={() => navigate('/cms/blogs/create')}>
              <Plus size={16} /> Create Post
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="banner-table">
              <thead>
                <tr>
                  <th>Cover</th>
                  <th>Title & Details</th>
                  <th>Author</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBlogs.map((blog, index) => (
                  <tr key={blog._id || index}>
                    <td>
                      <div className="table-image-preview">
                        {blog.image ? (
                          <img src={blog.image} alt={blog.title} />
                        ) : (
                          <div className="table-image-placeholder">
                            <BookOpen size={20} className="text-slate-400" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="banner-table-title-cell">
                        <strong className="title-text">{blog.title}</strong>
                        <div className="flex items-center gap-2 mt-1">
                           <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{blog.category || 'Uncategorized'}</span>
                           <span className="text-xs text-slate-500">/{blog.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="text-sm font-medium text-slate-700">{blog.author}</td>
                    <td>
                      <span className={`status-toggle-button status-${blog.status === 'published' ? 'active' : 'inactive'}`}>
                        {blog.status === 'published' ? 'Published' : blog.status === 'draft' ? 'Draft' : 'Archived'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons-group">
                        <button className="action-btn edit-btn" onClick={() => navigate(`/cms/blogs/edit/${blog._id}`)}>
                          <Edit2 size={16} />
                        </button>
                        <button className="action-btn delete-btn" onClick={() => handleDelete(blog)}>
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
