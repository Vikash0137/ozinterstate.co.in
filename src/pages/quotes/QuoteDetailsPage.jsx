import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Mail,
  MapPin,
  MessageSquareText,
  Phone,
  Save,
  Send,
  UserRound,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { quoteStatuses } from '../../data/quoteConstants'
import quoteService from '../../services/quoteService'
import './QuoteDetailsPage.css'

const QuoteDetailsPage = () => {
  const navigate = useNavigate()
  const { quoteId } = useParams()

  const [selectedQuote, setSelectedQuote] = useState(null)
  const [status, setStatus] = useState('New')
  const [note, setNote] = useState('')
  const [notes, setNotes] = useState([])

  // load quote from API
  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const res = await quoteService.getQuote(quoteId)
        if (mounted && res && res.data && res.data.quote) {
          const q = res.data.quote
          setSelectedQuote(q)
          setStatus(q.status || 'New')
          setNotes(q.internalNotes || [])
        }
      } catch (err) {
        console.error('Failed to load quote', err)
        toast.error('Unable to load quote details.')
        navigate('/quotes')
      }
    }

    if (quoteId) load()
    return () => {
      mounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quoteId])

  if (!selectedQuote) {
    return (
      <div className="quote-not-found">
        <h2>Quote not found</h2>

        <button type="button" onClick={() => navigate('/quotes')}>
          Return to Quotes
        </button>
      </div>
    )
  }

  const handleAddNote = () => {
    if (!note.trim()) {
      toast.error('Please enter an internal note.')
      return
    }

    setNotes((currentNotes) => [
      {
        id: Date.now(),
        text: note.trim(),
        author: 'OZ Admin',
        createdAt: new Date().toISOString(),
      },
      ...currentNotes,
    ])

    setNote('')
    toast.success('Internal note added.')
  }

  const handleSaveStatus = () => {
    toast.success(`Quote status updated to ${status}.`)
  }

  const handleConvertBooking = async () => {
    try {
      const res = await quoteService.convertQuote(quoteId)
      const booking = res?.data?.data?.booking
      if (booking) {
        toast.success(`Quote converted into booking ${booking.bookingNumber || 'successfully'}.`)
      } else {
        toast.success('Quote converted into booking.')
      }
      setStatus('Converted')
      navigate(`/bookings/${booking?._id}`)
    } catch (err) {
      console.error('Failed to convert quote to booking:', err)
      const message = err?.response?.data?.message || 'Unable to convert quote into booking.'
      toast.error(message)
    }
  }

  return (
    <div className="quote-details-page">
      <div className="quote-details-header">
        <div>
          <button
            type="button"
            className="quote-back-button"
            onClick={() => navigate('/quotes')}
          >
            <ArrowLeft size={17} />
            Back to Quotes
          </button>

          <h2>{selectedQuote.id}</h2>

          <span>
            Submitted on{' '}
            {new Date(selectedQuote.submittedAt).toLocaleString(
              'en-AU',
            )}
          </span>
        </div>

        <div className="quote-details-actions">
          <button
            type="button"
            className="quote-send-button"
            onClick={() => toast('Quote email feature will be connected later.')}
          >
            <Send size={17} />
            Send Quote Email
          </button>

          <button
            type="button"
            className="quote-convert-button"
            onClick={handleConvertBooking}
          >
            <CheckCircle2 size={17} />
            Convert to Booking
          </button>
        </div>
      </div>

      <div className="quote-details-grid">
        <div className="quote-details-main">
          <section className="quote-detail-card">
            <div className="quote-detail-card-heading">
              <div>
                <p>Customer</p>
                <h3>Customer Information</h3>
              </div>

              <span
                className={`quote-detail-status ${status.toLowerCase()}`}
              >
                {status}
              </span>
            </div>

            <div className="customer-detail-grid">
              <div className="customer-detail-item">
                <UserRound size={18} />

                <div>
                  <span>Customer Name</span>
                  <strong>
                    {selectedQuote.customerName}
                    {selectedQuote.customerId && (
                      <button type="button" className="view-customer-link" onClick={() => navigate(`/customers/${selectedQuote.customerId._id || selectedQuote.customerId}`)}>
                        View Customer
                      </button>
                    )}
                  </strong>
                </div>
              </div>

              <div className="customer-detail-item">
                <Mail size={18} />

                <div>
                  <span>Email Address</span>
                  <strong>{selectedQuote.email}</strong>
                </div>
              </div>

              <div className="customer-detail-item">
                <Phone size={18} />

                <div>
                  <span>Phone Number</span>
                  <strong>{selectedQuote.phone}</strong>
                </div>
              </div>

              <div className="customer-detail-item">
                <CalendarDays size={18} />

                <div>
                  <span>Moving Date</span>
                  <strong>
                    {new Date(
                      `${selectedQuote.movingDate}T00:00:00`,
                    ).toLocaleDateString('en-AU', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </strong>
                </div>
              </div>
            </div>
          </section>

          <section className="quote-detail-card">
            <div className="quote-detail-card-heading">
              <div>
                <p>Move Details</p>
                <h3>Moving Information</h3>
              </div>
            </div>

            <div className="moving-route-display">
              <div className="moving-route-point">
                <div className="route-point-icon">
                  <MapPin size={18} />
                </div>

                <div>
                  <span>Moving From</span>
                  <strong>{selectedQuote.pickupLocation}</strong>
                </div>
              </div>

              <div className="moving-route-line" />

              <div className="moving-route-point destination">
                <div className="route-point-icon">
                  <MapPin size={18} />
                </div>

                <div>
                  <span>Moving To</span>
                  <strong>
                    {selectedQuote.destinationLocation}
                  </strong>
                </div>
              </div>
            </div>

            <div className="quote-information-grid">
              <div>
                <span>Property Type</span>
                <strong>{selectedQuote.propertyType}</strong>
              </div>

              <div>
                <span>Requested Service</span>
                <strong>{selectedQuote.service}</strong>
              </div>

              <div>
                <span>Assigned To</span>
                <strong>{selectedQuote.assignedTo}</strong>
              </div>
            </div>
          </section>

          <section className="quote-detail-card">
            <div className="quote-detail-card-heading">
              <div>
                <p>Customer Message</p>
                <h3>Additional Information</h3>
              </div>
            </div>

            <div className="customer-message-box">
              <MessageSquareText size={20} />
              <p>{selectedQuote.message}</p>
            </div>
          </section>

          <section className="quote-detail-card">
            <div className="quote-detail-card-heading">
              <div>
                <p>Internal</p>
                <h3>Notes and Follow-up</h3>
              </div>
            </div>

            <div className="add-note-box">
              <textarea
                rows="4"
                placeholder="Add an internal note about this quote..."
                value={note}
                onChange={(event) => setNote(event.target.value)}
              />

              <button type="button" onClick={handleAddNote}>
                <Save size={16} />
                Add Note
              </button>
            </div>

            <div className="quote-notes-list">
              {notes.length ? (
                notes.map((item) => (
                  <article key={item.id}>
                    <div className="note-avatar">
                      {item.author.charAt(0)}
                    </div>

                    <div>
                      <div className="note-meta">
                        <strong>{item.author}</strong>

                        <span>
                          {new Date(item.createdAt).toLocaleString(
                            'en-AU',
                          )}
                        </span>
                      </div>

                      <p>{item.text}</p>
                    </div>
                  </article>
                ))
              ) : (
                <div className="no-notes-message">
                  No internal notes have been added.
                </div>
              )}
            </div>
          </section>
        </div>

        <aside className="quote-details-sidebar">
          <section className="quote-side-card">
            <h3>Quote Status</h3>

            <label htmlFor="quote-status">Current Status</label>

            <select
              id="quote-status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              {quoteStatuses.map((quoteStatus) => (
                <option key={quoteStatus} value={quoteStatus}>
                  {quoteStatus}
                </option>
              ))}
            </select>

            <button type="button" onClick={handleSaveStatus}>
              <Save size={16} />
              Update Status
            </button>
          </section>

          <section className="quote-side-card">
            <h3>Quick Contact</h3>

            <a href={`tel:${selectedQuote.phone}`}>
              <Phone size={17} />
              Call Customer
            </a>

            <a href={`mailto:${selectedQuote.email}`}>
              <Mail size={17} />
              Send Email
            </a>
          </section>

          <section className="quote-side-card quote-source-card">
            <h3>Quote Information</h3>

            <div>
              <span>Reference</span>
              <strong>{selectedQuote.id}</strong>
            </div>

            <div>
              <span>Source</span>
              <strong>Website Quote Form</strong>
            </div>

            <div>
              <span>Submitted</span>
              <strong>
                {new Date(
                  selectedQuote.submittedAt,
                ).toLocaleDateString('en-AU')}
              </strong>
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}

export default QuoteDetailsPage