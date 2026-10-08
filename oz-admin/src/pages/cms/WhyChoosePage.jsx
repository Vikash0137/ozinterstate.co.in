import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Edit2, Trash2, SlidersHorizontal, Loader2, Star, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import whyChooseService from '../../services/whyChooseService'
import siteSettingsService from '../../services/siteSettingsService'
import MediaUploadInput from '../../components/common/MediaUploadInput'
import '../banners/Banners.css'

export default function WhyChoosePage() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [section, setSection] = useState({ title: '', subtitle: '', image: '' })
  const [savingSection, setSavingSection] = useState(false)

  const fetchItems = async () => {
    try {
      setLoading(true)
      const res = await whyChooseService.getWhyChooseItems()
      if (res.data && res.data.success) {
        setItems(res.data.data || [])
      } else if (res.data) {
        setItems(res.data || [])
      } else {
         setItems(res || [])
      }
      const settingsRes = await siteSettingsService.getSiteSettings()
      const settings = settingsRes.data?.data || settingsRes.data || {}
      setSection({
        title: settings.whyChooseSection?.title || '',
        subtitle: settings.whyChooseSection?.subtitle || '',
        image: settings.whyChooseSection?.image || '',
      })
    } catch (err) {
      console.error('Error loading items:', err)
      toast.error('Failed to load items.')
    } finally {
      setLoading(false)
    }
  }

  const saveSection = async () => {
    try {
      setSavingSection(true)
      await siteSettingsService.updateSiteSettings({ whyChooseSection: section })
      toast.success('Why Choose Us section saved successfully.')
    } catch (err) {
      console.error('Failed to save Why Choose Us section:', err)
      toast.error(err.response?.data?.message || 'Failed to save section.')
    } finally {
      setSavingSection(false)
    }
  }

  const deleteSection = async () => {
    if (!window.confirm('Remove the Why Choose Us section content?')) return
    try {
      setSavingSection(true)
      const emptySection = { title: '', subtitle: '', image: '' }
      await siteSettingsService.updateSiteSettings({ whyChooseSection: emptySection })
      setSection(emptySection)
      toast.success('Why Choose Us section content removed.')
    } catch (err) {
      console.error('Failed to remove Why Choose Us section:', err)
      toast.error(err.response?.data?.message || 'Failed to remove section.')
    } finally {
      setSavingSection(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(fetchItems, 0)
    return () => clearTimeout(timer)
  }, [])

  const handleDelete = async (item) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return
    try {
      await whyChooseService.deleteWhyChooseItem(item._id)
      toast.success('Item deleted successfully.')
      setItems((currentItems) => currentItems.filter((currentItem) => currentItem._id !== item._id))
    } catch (err) {
      console.error('Failed to delete item:', err)
      toast.error(err.response?.data?.message || 'Unable to delete item.')
    }
  }

  const filteredItems = items.filter(item => 
    item.title?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="banner-page-container">
      <div className="banner-page-header">
        <div>
          <h1 className="banner-page-title">Why Choose Us</h1>
          <p className="banner-page-subtitle">Manage value propositions and key benefits.</p>
        </div>
        <button className="banner-add-button" onClick={() => navigate('/cms/why-choose/create')}>
          <Plus size={18} /> Add New Item
        </button>
      </div>

      <div className="banner-toolbar">
        <div className="search-box-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="banner-form-main-card" style={{ marginBottom: 20 }}>
        <div className="banner-form-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 18, color: '#1e293b' }}>Section Content</h2>
              <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 13 }}>Manage the public section title, subtitle, and image.</p>
            </div>
            <div className="action-buttons-group">
              <button type="button" className="banner-add-button" onClick={saveSection} disabled={savingSection}>
                <Save size={16} /> {savingSection ? 'Saving...' : 'Save Section'}
              </button>
              <button type="button" className="action-btn delete-btn" onClick={deleteSection} disabled={savingSection} title="Remove section content">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col-half">
              <label>Section Title</label>
              <input className="form-input" value={section.title} onChange={(e) => setSection((current) => ({ ...current, title: e.target.value }))} placeholder="e.g. The OZ Interstate difference" />
            </div>
            <div className="form-group col-half">
              <label>Section Subtitle</label>
              <textarea className="form-textarea" rows={2} value={section.subtitle} onChange={(e) => setSection((current) => ({ ...current, subtitle: e.target.value }))} placeholder="Short introduction for this section" />
            </div>
          </div>
          <MediaUploadInput
            label="Section Image"
            value={section.image}
            onChange={(image) => setSection((current) => ({ ...current, image }))}
            accept="image/*"
            allowVideo={false}
            helperText="Upload the image shown beside the Why Choose Us points."
          />
        </div>
      </div>

      <div className="banner-table-card">
        {loading ? (
          <div className="banner-loading-state">
            <Loader2 size={32} className="spinner" />
            <p>Loading items...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="banner-empty-state">
            <SlidersHorizontal size={40} className="empty-icon" />
            <h3>No items found</h3>
            <p>Try adjusting your search query or add a new item.</p>
            <button className="banner-add-button" onClick={() => navigate('/cms/why-choose/create')}>
              <Plus size={16} /> Add Item
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="banner-table">
              <thead>
                <tr>
                  <th>Icon</th>
                  <th>Title & Description</th>
                  <th>Order</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item, index) => (
                  <tr key={item._id || index}>
                    <td>
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                        <Star size={24} />
                      </div>
                    </td>
                    <td>
                      <div className="banner-table-title-cell max-w-sm">
                        <strong className="text-sm font-medium text-slate-800">{item.title}</strong>
                        <p className="subtitle-text line-clamp-2 mt-1 text-slate-500" title={item.description}>
                          {item.description}
                        </p>
                        <div className="mt-1 text-xs text-slate-400 font-mono">
                          Lucide Icon: {item.icon}
                        </div>
                      </div>
                    </td>
                    <td className="font-mono text-slate-600">
                      {item.sortOrder || 0}
                    </td>
                    <td>
                      <span className={`status-toggle-button status-${item.status || 'active'}`}>
                        {item.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons-group">
                        <button className="action-btn edit-btn" onClick={() => navigate(`/cms/why-choose/edit/${item._id}`)}>
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
