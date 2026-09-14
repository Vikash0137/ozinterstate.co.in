import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Save, ArrowLeft, Loader2, Image as ImageIcon, Plus, Trash2, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import blogService from '../../services/blogService'
import '../banners/Banners.css'

export default function BlogFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: '',
    summary: '',
    content: '',
    image: '',
    author: 'OZ Admin',
    readTime: '',
    tags: [''],
    status: 'published',
    isFeatured: false,
    seo: {
      title: '',
      metaDescription: '',
      keywords: ['']
    }
  })

  useEffect(() => {
    if (isEditing) {
      loadBlog()
    }
  }, [id])

  const loadBlog = async () => {
    try {
      setLoading(true)
      const res = await blogService.getBlogById(id)
      const data = res.data?.data || res.data || res
      
      setFormData({
        title: data.title || '',
        slug: data.slug || '',
        category: data.category || '',
        summary: data.summary || '',
        content: data.content || '',
        image: data.image || '',
        author: data.author || 'OZ Admin',
        readTime: data.readTime || '',
        tags: (data.tags && data.tags.length) ? data.tags : [''],
        status: data.status || 'published',
        isFeatured: Boolean(data.isFeatured),
        seo: {
          title: data.seo?.title || '',
          metaDescription: data.seo?.metaDescription || '',
          keywords: (data.seo?.keywords && data.seo?.keywords.length) ? data.seo?.keywords : ['']
        }
      })
    } catch (err) {
      console.error('Failed to load blog:', err)
      toast.error('Failed to load blog details')
      navigate('/cms/blogs')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (name.startsWith('seo.')) {
      const field = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        seo: { ...prev.seo, [field]: value }
      }))
    } else {
      setFormData(prev => {
        const val = type === 'checkbox' ? checked : value
        const next = { ...prev, [name]: val }
        if (name === 'title' && !isEditing && (!prev.slug || prev.slug === autoSlug(prev.title))) {
          next.slug = autoSlug(value)
        }
        return next
      })
    }
  }

  const autoSlug = (str) => {
    return (str || '')
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleTagChange = (index, value) => {
    const updated = [...formData.tags]
    updated[index] = value
    setFormData(prev => ({ ...prev, tags: updated }))
  }

  const addTag = () => {
    setFormData(prev => ({ ...prev, tags: [...prev.tags, ''] }))
  }

  const removeTag = (index) => {
    const updated = formData.tags.filter((_, i) => i !== index)
    setFormData(prev => ({ ...prev, tags: updated.length ? updated : [''] }))
  }

  const handleKeywordChange = (index, value) => {
    const updated = [...formData.seo.keywords]
    updated[index] = value
    setFormData(prev => ({
      ...prev,
      seo: { ...prev.seo, keywords: updated }
    }))
  }

  const addKeyword = () => {
    setFormData(prev => ({
      ...prev,
      seo: { ...prev.seo, keywords: [...prev.seo.keywords, ''] }
    }))
  }

  const removeKeyword = (index) => {
    const updated = formData.seo.keywords.filter((_, i) => i !== index)
    setFormData(prev => ({
      ...prev,
      seo: { ...prev.seo, keywords: updated.length ? updated : [''] }
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      const payload = {
        ...formData,
        tags: formData.tags.filter(t => t.trim().length > 0),
        seo: {
          ...formData.seo,
          keywords: formData.seo.keywords.filter(k => k.trim().length > 0)
        }
      }

      if (isEditing) {
        await blogService.updateBlog(id, payload)
        toast.success('Article updated successfully')
      } else {
        await blogService.createBlog(payload)
        toast.success('Article published successfully')
      }
      navigate('/cms/blogs')
    } catch (err) {
      console.error('Failed to save blog:', err)
      toast.error(err.response?.data?.message || 'Failed to save blog')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="banner-page-container">
        <div className="banner-loading-state">
          <Loader2 size={32} className="spinner" />
          <p>Loading article...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="banner-page-container">
      <div className="banner-form-topbar">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => navigate('/cms/blogs')} className="btn-back">
            <ArrowLeft size={18} /> Back to Articles
          </button>
          <div>
            <h1 className="banner-page-title">
              {isEditing ? 'Edit Article' : 'Write New Article'}
            </h1>
            <p className="banner-page-subtitle">Publish news, moving tips, and company updates</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="banner-add-button"
        >
          {saving ? <Loader2 size={16} className="spinner" /> : <Save size={16} />}
          {saving ? 'Saving...' : 'Publish Article'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="banner-form-grid">
        {/* Main Content Area */}
        <div className="banner-form-main-card">
          <div className="banner-form-body">
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>
              Article Content
            </h3>
            
            <div className="form-row">
              <div className="form-group col-half">
                <label className="required">Article Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g. Top 10 Packing Tips for Interstate Moves"
                />
              </div>
              <div className="form-group col-half">
                <label className="required">URL Slug</label>
                <input
                  type="text"
                  name="slug"
                  required
                  value={formData.slug}
                  onChange={handleChange}
                  className="form-input font-mono"
                  placeholder="e.g. top-10-packing-tips"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-full">
                <label className="required">Short Summary</label>
                <textarea
                  name="summary"
                  required
                  value={formData.summary}
                  onChange={handleChange}
                  rows={3}
                  className="form-textarea"
                  placeholder="Brief summary shown on blog list cards..."
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-full">
                <label className="required">Full Content (Markdown / HTML)</label>
                <textarea
                  name="content"
                  required
                  value={formData.content}
                  onChange={handleChange}
                  rows={12}
                  className="form-textarea font-mono"
                  placeholder="Write your article content here..."
                />
              </div>
            </div>

            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', margin: '24px 0 16px 0', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>
              Tags
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {formData.tags.map((tag, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => handleTagChange(idx, e.target.value)}
                    className="form-input"
                    placeholder={`Tag #${idx + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeTag(idx)}
                    className="action-btn delete-btn"
                    title="Remove Tag"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addTag}
                className="btn-back"
                style={{ alignSelf: 'flex-start', marginTop: '6px', color: '#0284c7' }}
              >
                <Plus size={16} /> Add Tag
              </button>
            </div>

            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', margin: '24px 0 16px 0', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>
              SEO Metadata
            </h3>

            <div className="form-row">
              <div className="form-group col-full">
                <label>SEO Title</label>
                <input
                  type="text"
                  name="seo.title"
                  value={formData.seo.title}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Custom page title for search engines..."
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-full">
                <label>SEO Meta Description</label>
                <textarea
                  name="seo.metaDescription"
                  value={formData.seo.metaDescription}
                  onChange={handleChange}
                  rows={2}
                  className="form-textarea"
                  placeholder="Description for Google search results snippet..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Area */}
        <div className="banner-form-main-card">
          <div className="banner-form-body">
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>
              Cover Image
            </h3>

            <div style={{ marginBottom: '16px' }}>
              {formData.image ? (
                <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #cbd5e1', maxHeight: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>
                  <img src={formData.image} alt="Cover Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => e.target.style.display = 'none'} />
                </div>
              ) : (
                <div style={{ height: '120px', borderRadius: '12px', border: '2px dashed #cbd5e1', background: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                  <ImageIcon size={32} style={{ marginBottom: '6px', opacity: 0.5 }} />
                  <span style={{ fontSize: '12px' }}>No cover image</span>
                </div>
              )}
            </div>

            <div className="form-row">
              <div className="form-group col-full">
                <label className="required">Cover Image URL</label>
                <input
                  type="text"
                  name="image"
                  required
                  value={formData.image}
                  onChange={handleChange}
                  className="form-input text-mono"
                  placeholder="https://..."
                />
              </div>
            </div>

            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', margin: '24px 0 16px 0', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>
              Publishing Options
            </h3>

            <div className="form-row">
              <div className="form-group col-full">
                <label>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-full">
                <label>Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g. Moving Tips, Interstate"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-full">
                <label>Author Name</label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-full">
                <label>Estimated Read Time</label>
                <input
                  type="text"
                  name="readTime"
                  value={formData.readTime}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g. 5 min read"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-full" style={{ flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="isFeatured"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  style={{ width: '18px', height: '18px', accentColor: '#0284c7' }}
                />
                <label htmlFor="isFeatured" style={{ margin: 0, cursor: 'pointer' }}>Feature this post on home page</label>
              </div>
            </div>

            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
              <button
                type="submit"
                disabled={saving}
                className="banner-add-button"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                {saving ? <Loader2 size={16} className="spinner" /> : <Save size={16} />}
                {saving ? 'Saving...' : 'Publish Article'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
