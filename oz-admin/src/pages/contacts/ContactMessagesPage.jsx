import { useState, useEffect } from 'react'
import { Mail, Search, Trash2, Eye, Loader2, MessageSquare, Phone, User, Calendar, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import apiClient from '../../services/apiClient'
import '../banners/Banners.css'

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedMessage, setSelectedMessage] = useState(null)

  const loadMessages = async () => {
    try {
      setLoading(true)
      const res = await apiClient.get('/inquiries/admin/responses')
      const data = res.data?.data || res.data || []
      const messages = Array.isArray(data) ? data.map((response) => ({
        ...response.response_data,
        id: response.id,
        _id: response.id,
        status: response.status,
        createdAt: response.created_at,
      })) : []
      setMessages(messages)
    } catch (err) {
      console.error('Failed to load contact messages:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMessages()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return
    try {
      await apiClient.delete(`/inquiries/admin/responses/${id}`)
      toast.success('Message deleted')
      loadMessages()
    } catch (err) {
      toast.error('Failed to delete message')
    }
  }

  const filteredMessages = messages.filter(m =>
    m.name?.toLowerCase().includes(search.toLowerCase()) ||
    m.email?.toLowerCase().includes(search.toLowerCase()) ||
    m.subject?.toLowerCase().includes(search.toLowerCase()) ||
    m.message?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="banner-page-container">
      {/* Header */}
      <div className="banner-page-header">
        <div>
          <h1 className="banner-page-title">Contact Form Messages</h1>
          <p className="banner-page-subtitle">View and respond to inquiries submitted through the contact page.</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="banner-toolbar">
        <div className="search-box-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by sender, email, subject, or keywords..."
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
            <p>Loading messages...</p>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="banner-empty-state">
            <MessageSquare size={40} className="empty-icon" />
            <h3>No contact messages</h3>
            <p>Inquiries submitted by customers via the contact form will appear here.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="banner-table">
              <thead>
                <tr>
                  <th>Sender</th>
                  <th>Subject & Message</th>
                  <th>Date</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMessages.map((msg, index) => (
                  <tr key={msg._id || index}>
                    <td>
                      <div>
                        <strong style={{ fontSize: '14px', color: '#1e293b', display: 'block' }}>{msg.name}</strong>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>{msg.email}</span>
                        {msg.phone && <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>{msg.phone}</span>}
                      </div>
                    </td>
                    <td>
                      <div className="banner-table-title-cell max-w-md">
                        <strong className="title-text">{msg.subject || 'General Inquiry'}</strong>
                        <p className="subtitle-text line-clamp-1 mt-1 text-slate-500">{msg.message}</p>
                      </div>
                    </td>
                    <td style={{ fontSize: '13px', color: '#64748b' }}>
                      {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : 'Recent'}
                    </td>
                    <td>
                      <div className="action-buttons-group">
                        <button className="action-btn edit-btn" onClick={() => setSelectedMessage(msg)} title="View Message">
                          <Eye size={16} />
                        </button>
                        <button className="action-btn delete-btn" onClick={() => handleDelete(msg._id || msg.id)} title="Delete Message">
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

      {/* Message Modal */}
      {selectedMessage && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="banner-form-main-card" style={{ maxWidth: '600px', width: '100%', borderRadius: '16px' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b', margin: 0 }}>
                {selectedMessage.subject || 'Contact Inquiry'}
              </h2>
              <button onClick={() => setSelectedMessage(null)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#94a3b8' }}>&times;</button>
            </div>

            <div style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '14px', background: '#f8fafc', borderRadius: '10px', marginBottom: '18px' }}>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>From</span>
                  <p style={{ margin: '2px 0 0 0', fontWeight: '700', color: '#1e293b' }}>{selectedMessage.name}</p>
                  <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#0284c7' }}>{selectedMessage.email}</p>
                </div>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Phone</span>
                  <p style={{ margin: '2px 0 0 0', fontWeight: '700', color: '#1e293b' }}>{selectedMessage.phone || 'Not provided'}</p>
                </div>
              </div>

              <div>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Message Body</span>
                <div style={{ marginTop: '6px', padding: '16px', background: '#ffffff', borderRadius: '10px', border: '1px solid #e2e8f0', color: '#334155', fontSize: '14px', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                  {selectedMessage.message}
                </div>
              </div>

              <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject || 'OZ Interstate Inquiry')}`}
                  className="banner-add-button"
                  style={{ textDecoration: 'none' }}
                >
                  <Mail size={16} /> Reply via Email
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedMessage(null)}
                  style={{ padding: '10px 18px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#fff', color: '#475569', fontWeight: '600', cursor: 'pointer' }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
