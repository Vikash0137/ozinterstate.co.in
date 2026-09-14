import { useState, useEffect } from 'react'
import { getActivityLogs } from '../../services/activityLogService.js'
import './ActivityLogsPage.css'

const ActivityLogsPage = () => {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [actionFilter, setActionFilter] = useState('')
  const [moduleFilter, setModuleFilter] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const fetchLogs = async () => {
    setLoading(true)
    setError('')
    try {
      const params = {
        page,
        limit: 20,
        search,
        action: actionFilter,
        module: moduleFilter,
        from: dateFrom,
        to: dateTo,
        sort: 'desc',
      }

      const response = await getActivityLogs(params)
      if (response.data && response.data.success) {
        setLogs(response.data.data.logs || [])
        setTotalPages(response.data.data.pagination?.pages || 1)
      } else {
        setError('Failed to load activity logs')
      }
    } catch (err) {
      console.error('Error fetching activity logs:', err)
      setError('Error loading activity logs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setPage(1)
  }, [search, actionFilter, moduleFilter, dateFrom, dateTo])

  useEffect(() => {
    fetchLogs()
  }, [page, search, actionFilter, moduleFilter, dateFrom, dateTo])

  const handleReset = () => {
    setSearch('')
    setActionFilter('')
    setModuleFilter('')
    setDateFrom('')
    setDateTo('')
    setPage(1)
  }

  const getActionBadgeClass = (action) => {
    if (action === 'LOGIN') return 'badge-login'
    if (action === 'LOGOUT') return 'badge-logout'
    if (action === 'CREATE' || action.includes('CREATE')) return 'badge-create'
    if (action === 'UPDATE' || action.includes('UPDATE')) return 'badge-update'
    if (action === 'DELETE' || action.includes('DEACTIVATE')) return 'badge-delete'
    if (action.includes('STATUS')) return 'badge-status'
    if (action === 'PASSWORD_CHANGE') return 'badge-password'
    return 'badge-default'
  }

  return (
    <div className="activity-logs-page">
      <div className="page-header">
        <h1>Activity Logs</h1>
        <p>Track all admin actions and system activities</p>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Search</label>
          <input
            type="text"
            placeholder="Admin, Email, or Description"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label>Action</label>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Actions</option>
            <option value="LOGIN">Login</option>
            <option value="LOGOUT">Logout</option>
            <option value="CREATE">Create</option>
            <option value="UPDATE">Update</option>
            <option value="DELETE">Delete</option>
            <option value="PASSWORD_CHANGE">Password Change</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Module</label>
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Modules</option>
            <option value="AUTH">Auth</option>
            <option value="ADMINS">Admins</option>
            <option value="CUSTOMERS">Customers</option>
            <option value="QUOTES">Quotes</option>
            <option value="DASHBOARD">Dashboard</option>
          </select>
        </div>

        <div className="filter-group">
          <label>From Date</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label>To Date</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="filter-input"
          />
        </div>

        <button onClick={handleReset} className="btn-reset">
          Reset
        </button>
      </div>

      {/* Error Message */}
      {error && <div className="error-message">{error}</div>}

      {/* Loading State */}
      {loading && <div className="loading-state">Loading activity logs...</div>}

      {/* Logs Table */}
      {!loading && logs.length > 0 && (
        <div className="logs-table-container">
          <table className="logs-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Admin</th>
                <th>Action</th>
                <th>Module</th>
                <th>Description</th>
                <th>IP Address</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id} className="log-row">
                  <td className="date-time">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="admin-info">
                    <div>{log.userName}</div>
                    <small>{log.userEmail}</small>
                  </td>
                  <td>
                    <span className={`action-badge ${getActionBadgeClass(log.action)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td>
                    <span className="module-badge">{log.module}</span>
                  </td>
                  <td className="description">{log.description}</td>
                  <td className="ip-address">{log.ipAddress || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {!loading && logs.length === 0 && !error && (
        <div className="empty-state">
          <p>No activity logs found</p>
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

export default ActivityLogsPage
