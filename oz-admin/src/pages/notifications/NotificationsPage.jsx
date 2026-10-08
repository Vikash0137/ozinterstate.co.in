import { useState, useEffect } from 'react'
import { getNotifications, markAsRead, markAllAsRead } from '../../services/notificationService.js'
import './NotificationsPage.css'

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [unreadFilter, setUnreadFilter] = useState('all')

  const fetchNotifications = async () => {
    setLoading(true)
    setError('')
    try {
      const params = {
        page,
        limit: 20,
        unread: unreadFilter === 'all' ? '' : unreadFilter,
        sort: 'desc',
      }

      const response = await getNotifications(params)
      if (response.data && response.data.success) {
        setNotifications(response.data.data.notifications || [])
        setTotalPages(response.data.data.pagination?.pages || 1)
      } else {
        setError('Failed to load notifications')
      }
    } catch (err) {
      console.error('Error fetching notifications:', err)
      setError('Error loading notifications')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setPage(1)
  }, [unreadFilter])

  useEffect(() => {
    fetchNotifications()
  }, [page, unreadFilter])

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id)
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      )
    } catch (err) {
      console.error('Error marking as read:', err)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead()
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      )
    } catch (err) {
      console.error('Error marking all as read:', err)
    }
  }

  const getTypeBadgeClass = (type) => {
    if (type === 'QUOTE') return 'badge-quote'
    if (type === 'CUSTOMER') return 'badge-customer'
    if (type === 'ADMIN') return 'badge-admin'
    if (type === 'SYSTEM') return 'badge-system'
    return 'badge-default'
  }

  return (
    <div className="notifications-page">
      <div className="page-header">
        <h1>Notifications</h1>
        <p>View all system notifications</p>
      </div>

      {/* Filter & Actions */}
      <div className="filter-actions">
        <div className="filter-group">
          <label>Show</label>
          <select
            value={unreadFilter}
            onChange={(e) => setUnreadFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Notifications</option>
            <option value="true">Unread Only</option>
            <option value="false">Read Only</option>
          </select>
        </div>

        {notifications.some((n) => !n.isRead) && (
          <button onClick={handleMarkAllAsRead} className="btn-mark-all">
            Mark All as Read
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && <div className="error-message">{error}</div>}

      {/* Loading State */}
      {loading && <div className="loading-state">Loading notifications...</div>}

      {/* Notifications List */}
      {!loading && notifications.length > 0 && (
        <div className="notifications-list">
          {notifications.map((notif) => (
            <div
              key={notif._id}
              className={`notification-item ${notif.isRead ? 'read' : 'unread'}`}
            >
              <div className="notification-header">
                <h3>{notif.title}</h3>
                <span className={`type-badge ${getTypeBadgeClass(notif.type)}`}>
                  {notif.type}
                </span>
              </div>
              <p className="notification-message">{notif.message}</p>
              <div className="notification-footer">
                <small>
                  {new Date(notif.createdAt).toLocaleString()}
                </small>
                {!notif.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(notif._id)}
                    className="btn-read"
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && notifications.length === 0 && !error && (
        <div className="empty-state">
          <p>No notifications</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="btn-pagination"
          >
            ← Previous
          </button>
          <span className="page-info">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="btn-pagination"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}

export default NotificationsPage
