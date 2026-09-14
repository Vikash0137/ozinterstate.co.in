import {
  Archive,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Filter,
  MapPin,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  SlidersHorizontal,
  UserRound,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { quoteStatuses, serviceOptions } from '../../data/quoteConstants'
import quoteService from '../../services/quoteService'
import CustomerSelect from '../../components/common/CustomerSelect'
import './QuotesPage.css'

const statusTabs = [
  { label: 'All Quotes', value: 'All' },
  { label: 'New', value: 'New' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Contacted', value: 'Contacted' },
  { label: 'Converted', value: 'Converted' },
  { label: 'Rejected', value: 'Rejected' },
]

const QuotesPage = () => {
  const navigate = useNavigate()

  const [quotes, setQuotes] = useState([])
  const [activeStatus, setActiveStatus] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [serviceFilter, setServiceFilter] = useState('All')
  const [dateFilter, setDateFilter] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [openActionId, setOpenActionId] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)

  const itemsPerPage = 8

  const filteredQuotes = useMemo(() => {
    // client-side fallback filtering for UI responsiveness
    return quotes.filter((quote) => {
      const normalizedSearch = searchQuery.trim().toLowerCase()

      const matchesSearch =
        !normalizedSearch ||
        (quote.quoteNumber || quote._id || '').toString().toLowerCase().includes(normalizedSearch) ||
        (quote.customerName || '').toLowerCase().includes(normalizedSearch) ||
        (quote.customerEmail || quote.email || '').toLowerCase().includes(normalizedSearch) ||
        (quote.customerPhone || quote.phone || '').toLowerCase().includes(normalizedSearch) ||
        ((quote.movingFrom && quote.movingFrom.suburb) || (quote.pickupLocation || '')).toLowerCase().includes(normalizedSearch) ||
        ((quote.movingTo && quote.movingTo.suburb) || (quote.destinationLocation || '')).toLowerCase().includes(normalizedSearch)

      const matchesStatus = activeStatus === 'All' || quote.status === activeStatus || quote.status === undefined && activeStatus === 'All'

      const matchesService = serviceFilter === 'All' || (quote.serviceType || quote.service || '').toString() === serviceFilter

      const matchesDate = !dateFilter || (quote.movingDate || quote.submittedAt || '').toString().startsWith(dateFilter)

      return matchesSearch && matchesStatus && matchesService && matchesDate
    })
  }, [quotes, searchQuery, activeStatus, serviceFilter, dateFilter])

  const totalPages = Math.max(
    1,
    Math.ceil(filteredQuotes.length / itemsPerPage),
  )

  const paginatedQuotes = filteredQuotes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  const getStatusCount = (status) => {
    if (status === 'All') {
      return quotes.length
    }

    return quotes.filter((quote) => quote.status === status).length
  }

  const handleStatusTabChange = (status) => {
    setActiveStatus(status)
    setCurrentPage(1)
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setActiveStatus('All')
    setServiceFilter('All')
    setDateFilter('')
    setCurrentPage(1)
  }

  // Fetch quotes from API
  const [loading, setLoading] = useState(false)

  const fetchQuotes = async (params = {}) => {
    try {
      setLoading(true)
      // include customer filter if selected
      const p = { ...params }
      if (selectedCustomer) p.customerId = selectedCustomer._id || selectedCustomer
      const res = await quoteService.getQuotes(p)
      if (res && res.data && res.data.quotes) {
        setQuotes(res.data.quotes)
      }
    } catch (err) {
      console.error('Failed to fetch quotes', err)
      toast.error('Unable to load quotes from server.')
    } finally {
      setLoading(false)
    }
  }

  // Load initial page
  useEffect(() => {
    fetchQuotes({ page: 1, limit: 50 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleStatusChange = (quoteId, newStatus) => {
    setQuotes((currentQuotes) =>
      currentQuotes.map((quote) =>
        quote.id === quoteId
          ? {
              ...quote,
              status: newStatus,
            }
          : quote,
      ),
    )

    setOpenActionId(null)
    toast.success(`Quote ${quoteId} marked as ${newStatus}.`)
  }

  const handleArchive = (quoteId) => {
    handleStatusChange(quoteId, 'Archived')
  }

  const handleExportCsv = () => {
    if (!filteredQuotes.length) {
      toast.error('There are no quotes to export.')
      return
    }

    const headers = [
      'Quote ID',
      'Customer Name',
      'Email',
      'Phone',
      'Pickup',
      'Destination',
      'Moving Date',
      'Property Type',
      'Service',
      'Status',
      'Assigned To',
      'Submitted At',
    ]

    const rows = filteredQuotes.map((quote) => [
      quote.id,
      quote.customerName,
      quote.email,
      quote.phone,
      quote.pickupLocation,
      quote.destinationLocation,
      quote.movingDate,
      quote.propertyType,
      quote.service,
      quote.status,
      quote.assignedTo,
      quote.submittedAt,
    ])

    const escapeCsvValue = (value) =>
      `"${String(value ?? '').replaceAll('"', '""')}"`

    const csvContent = [
      headers.map(escapeCsvValue).join(','),
      ...rows.map((row) => row.map(escapeCsvValue).join(',')),
    ].join('\n')

    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;',
    })

    const downloadUrl = URL.createObjectURL(blob)
    const downloadLink = document.createElement('a')

    downloadLink.href = downloadUrl
    downloadLink.download = `oz-quotes-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`

    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
    URL.revokeObjectURL(downloadUrl)

    toast.success('Quotes exported successfully.')
  }

  return (
    <div className="quotes-page">
      <section className="quotes-page-heading">
        <div>
          <p>Customer Requests</p>
          <h2>Quote Management</h2>
          <span>
            Review, filter and manage all customer moving quote requests.
          </span>
        </div>

        <div className="quotes-heading-actions">
          <button
            type="button"
            className="quotes-secondary-button"
            onClick={handleExportCsv}
          >
            <Download size={17} />
            Export CSV
          </button>

          <button
            type="button"
            className="quotes-primary-button"
            onClick={() => toast('Create Quote form will be added next.')}
          >
            <Plus size={18} />
            Create Quote
          </button>
        </div>
      </section>

      <section className="quote-summary-grid">
        <article className="quote-summary-card">
          <span>Total Quotes</span>
          <strong>{quotes.length}</strong>
          <small>All customer requests</small>
        </article>

        <article className="quote-summary-card new-card">
          <span>New Quotes</span>
          <strong>{getStatusCount('New')}</strong>
          <small>Needs immediate review</small>
        </article>

        <article className="quote-summary-card pending-card">
          <span>Pending</span>
          <strong>{getStatusCount('Pending')}</strong>
          <small>Waiting for follow-up</small>
        </article>

        <article className="quote-summary-card converted-card">
          <span>Converted</span>
          <strong>{getStatusCount('Converted')}</strong>
          <small>Converted into bookings</small>
        </article>
      </section>

      <section className="quotes-content-card">
        <div className="quotes-status-tabs">
          <div className="quotes-tabs-scroll">
            {statusTabs.map((tab) => (
              <button
                key={tab.value}
                type="button"
                className={`quote-status-tab ${
                  activeStatus === tab.value ? 'active' : ''
                }`}
                onClick={() => handleStatusTabChange(tab.value)}
              >
                {tab.label}
                <span>{getStatusCount(tab.value)}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="quotes-toolbar">
          <div className="quotes-search-box">
            <Search size={18} />

            <input
              type="search"
              placeholder="Search quote ID, customer, phone or location..."
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value)
                setCurrentPage(1)
              }}
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                <X size={17} />
              </button>
            )}
          </div>

          <button
            type="button"
            className={`filter-toggle-button ${
              showFilters ? 'active' : ''
            }`}
            onClick={() => setShowFilters((current) => !current)}
          >
            <SlidersHorizontal size={17} />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="quotes-filter-panel">
            <div className="quote-filter-group">
              <label>Customer</label>
              <CustomerSelect onSelect={(c) => {
                setSelectedCustomer(c)
                setCurrentPage(1)
                fetchQuotes({ page: 1, limit: 50, customerId: c._id })
              }} />
              {selectedCustomer && (
                <div className="selected-customer-pill">
                  Filter: {selectedCustomer.name} <button type="button" onClick={() => { setSelectedCustomer(null); fetchQuotes({ page:1, limit:50 }) }}>Clear</button>
                </div>
              )}
            </div>
            <div className="quote-filter-group">
              <label htmlFor="service-filter">Service</label>

              <select
                id="service-filter"
                value={serviceFilter}
                onChange={(event) => {
                  setServiceFilter(event.target.value)
                  setCurrentPage(1)
                }}
              >
                <option value="All">All Services</option>

                {serviceOptions.map((service) => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>
            </div>

            <div className="quote-filter-group">
              <label htmlFor="moving-date-filter">Moving Date</label>

              <input
                id="moving-date-filter"
                type="date"
                value={dateFilter}
                onChange={(event) => {
                  setDateFilter(event.target.value)
                  setCurrentPage(1)
                }}
              />
            </div>

            <div className="filter-panel-info">
              <Filter size={17} />

              <span>
                Showing {filteredQuotes.length} of {quotes.length} quotes
              </span>
            </div>

            <button
              type="button"
              className="clear-filter-button"
              onClick={handleClearFilters}
            >
              Clear Filters
            </button>
          </div>
        )}

        <div className="quotes-table-wrapper">
          <table className="quotes-table">
            <thead>
              <tr>
                <th>Quote</th>
                <th>Customer</th>
                <th>Moving Route</th>
                <th>Moving Date</th>
                <th>Service</th>
                <th>Assigned To</th>
                <th>Status</th>
                <th aria-label="Actions" />
              </tr>
            </thead>

            <tbody>
              {paginatedQuotes.map((quote) => (
                <tr key={quote.id}>
                  <td>
                    <button
                      type="button"
                      className="quote-id-button"
                      onClick={() => navigate(`/quotes/${quote.id}`)}
                    >
                      {quote.id}
                    </button>

                    <span className="quote-submitted-date">
                      {new Date(quote.submittedAt).toLocaleDateString('en-AU', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </td>

                  <td>
                    <div className="quote-customer-cell">
                      <div className="quote-customer-avatar">
                        {quote.customerName.charAt(0)}
                      </div>

                      <div>
                        {quote.customerId ? (
                          <button type="button" className="quote-customer-link" onClick={() => navigate(`/customers/${quote.customerId._id || quote.customerId}`)}>
                            <strong>{quote.customerName}</strong>
                          </button>
                        ) : (
                          <strong>{quote.customerName}</strong>
                        )}

                        <span>
                          <Phone size={12} />
                          {quote.phone}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div className="quote-route-cell">
                      <div>
                        <MapPin size={14} />
                        <span>{quote.pickupLocation}</span>
                      </div>

                      <i />

                      <div>
                        <MapPin size={14} />
                        <span>{quote.destinationLocation}</span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div className="quote-moving-date">
                      <CalendarDays size={15} />

                      <span>
                        {new Date(
                          `${quote.movingDate}T00:00:00`,
                        ).toLocaleDateString('en-AU', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </td>

                  <td>
                    <span className="quote-service-label">
                      {quote.service}
                    </span>
                  </td>

                  <td>
                    <div className="quote-assigned-cell">
                      <UserRound size={14} />
                      {quote.assignedTo}
                    </div>
                  </td>

                  <td>
                    <span
                      className={`quote-list-status ${quote.status.toLowerCase()}`}
                    >
                      {quote.status}
                    </span>
                  </td>

                  <td>
                    <div className="quote-row-actions">
                      <button
                        type="button"
                        className="quote-view-button"
                        onClick={() => navigate(`/quotes/${quote.id}`)}
                        aria-label={`View ${quote.id}`}
                      >
                        <Eye size={17} />
                      </button>

                      <button
                        type="button"
                        className="quote-action-button"
                        onClick={() =>
                          setOpenActionId((currentId) =>
                            currentId === quote.id ? null : quote.id,
                          )
                        }
                        aria-label={`More actions for ${quote.id}`}
                      >
                        <MoreHorizontal size={18} />
                      </button>

                      {openActionId === quote.id && (
                        <div className="quote-action-dropdown">
                          <button
                            type="button"
                            onClick={() => navigate(`/quotes/${quote.id}`)}
                          >
                            <Eye size={15} />
                            View Details
                          </button>

                          {quoteStatuses
                            .filter(
                              (status) =>
                                status !== quote.status &&
                                status !== 'Archived',
                            )
                            .map((status) => (
                              <button
                                key={status}
                                type="button"
                                onClick={() =>
                                  handleStatusChange(quote.id, status)
                                }
                              >
                                <span
                                  className={`action-status-dot ${status.toLowerCase()}`}
                                />
                                Mark as {status}
                              </button>
                            ))}

                          {quote.status !== 'Archived' && (
                            <button
                              type="button"
                              className="archive-action"
                              onClick={() => handleArchive(quote.id)}
                            >
                              <Archive size={15} />
                              Archive Quote
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!paginatedQuotes.length && (
            <div className="quotes-empty-state">
              <Search size={34} />

              <h3>No quotes found</h3>

              <p>
                Try changing the search keyword, status or filter options.
              </p>

              <button type="button" onClick={handleClearFilters}>
                Clear All Filters
              </button>
            </div>
          )}
        </div>

        <div className="quotes-pagination">
          <span>
            Showing{' '}
            {filteredQuotes.length
              ? (currentPage - 1) * itemsPerPage + 1
              : 0}{' '}
            to{' '}
            {Math.min(
              currentPage * itemsPerPage,
              filteredQuotes.length,
            )}{' '}
            of {filteredQuotes.length} quotes
          </span>

          <div>
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage((current) => Math.max(1, current - 1))
              }
            >
              <ChevronLeft size={17} />
            </button>

            <span>{currentPage}</span>

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((current) =>
                  Math.min(totalPages, current + 1),
                )
              }
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default QuotesPage