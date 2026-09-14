import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  MapPin,
  Save,
  UserRound,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { quoteStatuses, serviceOptions } from '../../data/quoteConstants'
import quoteService from '../../services/quoteService'
import CustomerSelect from '../../components/common/CustomerSelect'
import './QuoteFormPage.css'

const initialFormData = {
  customerName: '',
  customerId: null,
  email: '',
  phone: '',
  pickupLocation: '',
  destinationLocation: '',
  movingDate: '',
  propertyType: '',
  service: '',
  status: 'New',
  assignedTo: 'Unassigned',
  message: '',
  internalNote: '',
  numberOfMovers: '2',
  truckSize: '',
  hourlyRate: '',
  minimumHours: '2.5',
  calloutCharge: '',
  travelCharge: '',
  packingCharge: '',
  additionalCharge: '',
  discount: '',
  estimatedTotal: '',
}

const propertyTypes = [
  'Studio Apartment',
  '1 Bedroom Apartment',
  '2 Bedroom Apartment',
  '3 Bedroom Apartment',
  'Townhouse',
  '2 Bedroom House',
  '3 Bedroom House',
  '4 Bedroom House',
  '5+ Bedroom House',
  'Office',
  'Warehouse',
  'Commercial Property',
  'Other',
]

const teamMembers = [
  'Unassigned',
  'Michael Brown',
  'Emma Taylor',
  'Oliver Wilson',
  'Sophia Martin',
]

const truckOptions = [
  '4.5T Truck',
  '6.5T Truck',
  '8T Truck',
  '10T Truck',
  'Custom Truck',
]

const QuoteFormPage = () => {
  const navigate = useNavigate()
  const { quoteId } = useParams()

  const [existingQuote, setExistingQuote] = useState(null)

  const isEditMode = Boolean(quoteId)

  const [formData, setFormData] = useState(initialFormData)

  const [errors, setErrors] = useState({})
  const [isSaving, setIsSaving] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }))

    if (errors[name]) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        [name]: '',
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required.'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address.'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required.'
    }

    if (!formData.pickupLocation.trim()) {
      newErrors.pickupLocation = 'Pickup location is required.'
    }

    if (!formData.destinationLocation.trim()) {
      newErrors.destinationLocation = 'Destination is required.'
    }

    if (!formData.movingDate) {
      newErrors.movingDate = 'Moving date is required.'
    }

    if (!formData.propertyType) {
      newErrors.propertyType = 'Property type is required.'
    }

    if (!formData.service) {
      newErrors.service = 'Service is required.'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!validateForm()) {
      toast.error('Please complete all required fields.')
      return
    }

    try {
      setIsSaving(true)

      // Build API payload mapping UI fields to backend model
      const payload = {
        customerId: formData.customerId,
        customerName: formData.customerName,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        movingFrom: {
          address: '',
          suburb: formData.pickupLocation,
          state: '',
          postcode: '',
        },
        movingTo: {
          address: '',
          suburb: formData.destinationLocation,
          state: '',
          postcode: '',
        },
        movingDate: formData.movingDate,
        propertyType: formData.propertyType,
        serviceType: formData.service,
        customerMessage: formData.message,
        assignedTo: formData.assignedTo,
        status: formData.status,
      }

      if (isEditMode && quoteId) {
        await quoteService.updateQuote(quoteId, payload)
        toast.success(`Quote ${quoteId} updated successfully.`)
        navigate(`/quotes/${quoteId}`)
      } else {
        const res = await quoteService.createQuote(payload)
        const newId = res?.data?.quote?._id || res?.data?.quote?.quoteNumber
        toast.success('Quote created successfully.')
        navigate(`/quotes/${newId || ''}`)
      }
    } catch (error) {
      console.error('Unable to save quote:', error)
      toast.error('Unable to save quote. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  // Load existing quote when editing
  useEffect(() => {
    let mounted = true
    const load = async () => {
      if (!isEditMode || !quoteId) return
      try {
        const res = await quoteService.getQuote(quoteId)
        if (mounted && res && res.data && res.data.quote) {
          const q = res.data.quote
          setExistingQuote(q)
          setFormData((current) => ({
            ...current,
            customerId: q.customerId?._id || q.customerId || null,
            customerName: q.customerName || '',
            email: q.customerEmail || q.email || '',
            phone: q.customerPhone || q.phone || '',
            pickupLocation: (q.movingFrom && q.movingFrom.suburb) || q.pickupLocation || '',
            destinationLocation: (q.movingTo && q.movingTo.suburb) || q.destinationLocation || '',
            movingDate: q.movingDate ? new Date(q.movingDate).toISOString().slice(0, 10) : '',
            propertyType: q.propertyType || '',
            service: q.serviceType || q.service || '',
            status: q.status || 'New',
            assignedTo: q.assignedTo || 'Unassigned',
            message: q.customerMessage || q.message || '',
          }))
        }
      } catch (err) {
        console.error('Failed to load quote for edit', err)
        toast.error('Unable to load quote.')
        navigate('/quotes')
      }
    }

    load()
    return () => {
      mounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode, quoteId])

  if (isEditMode && !existingQuote) {
    return (
      <div className="quote-form-not-found">
        <h2>Quote not found</h2>
        <p>The requested quote could not be loaded.</p>

        <button type="button" onClick={() => navigate('/quotes')}>
          Return to Quotes
        </button>
      </div>
    )
  }

  return (
    <div className="quote-form-page">
      <section className="quote-form-header">
        <div>
          <button
            type="button"
            className="quote-form-back"
            onClick={() => navigate('/quotes')}
          >
            <ArrowLeft size={17} />
            Back to Quotes
          </button>

          <p>{isEditMode ? 'Update Request' : 'Manual Entry'}</p>

          <h2>{isEditMode ? `Edit ${quoteId}` : 'Create New Quote'}</h2>

          <span>
            {isEditMode
              ? 'Update customer, moving and pricing information.'
              : 'Add a new customer moving quote request manually.'}
          </span>
        </div>

        <div className="quote-form-header-actions">
          <button
            type="button"
            className="quote-form-cancel-button"
            onClick={() => navigate('/quotes')}
          >
            Cancel
          </button>

          <button
            type="submit"
            form="quote-form"
            className="quote-form-save-button"
            disabled={isSaving}
          >
            <Save size={17} />
            {isSaving
              ? 'Saving...'
              : isEditMode
                ? 'Update Quote'
                : 'Create Quote'}
          </button>
        </div>
      </section>

      <form
        id="quote-form"
        className="quote-form-layout"
        onSubmit={handleSubmit}
        noValidate
      >
        <div className="quote-form-main">
          <section className="quote-form-card">
            <div className="quote-form-card-heading">
              <div className="quote-form-heading-icon">
                <UserRound size={20} />
              </div>

              <div>
                <p>Customer</p>
                <h3>Customer Information</h3>
                <span>Primary customer contact details.</span>
              </div>
            </div>

            <div className="quote-form-grid two-columns">
              <div className="quote-input-group full-width">
                <label>Link Existing Customer</label>
                <CustomerSelect onSelect={(c) => {
                  setFormData((cur) => ({
                    ...cur,
                    customerId: c._id,
                    customerName: c.name || cur.customerName,
                    email: c.email || cur.email,
                    phone: c.phone || cur.phone,
                  }))
                }} initial={existingQuote && existingQuote.customerId ? existingQuote.customerId : null} />
                <small>Search and select an existing customer to link to this quote, or leave blank to create a new customer.</small>
              </div>

              <div className="quote-input-group">
                <label htmlFor="customerName">
                  Customer Name <strong>*</strong>
                </label>

                <input
                  id="customerName"
                  type="text"
                  name="customerName"
                  placeholder="Enter full customer name"
                  value={formData.customerName}
                  onChange={handleChange}
                  className={errors.customerName ? 'input-error' : ''}
                />

                {errors.customerName && (
                  <span className="quote-field-error">
                    {errors.customerName}
                  </span>
                )}
              </div>

              <div className="quote-input-group">
                <label htmlFor="phone">
                  Phone Number <strong>*</strong>
                </label>

                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  placeholder="+61 400 000 000"
                  value={formData.phone}
                  onChange={handleChange}
                  className={errors.phone ? 'input-error' : ''}
                />

                {errors.phone && (
                  <span className="quote-field-error">{errors.phone}</span>
                )}
              </div>

              <div className="quote-input-group full-width">
                <label htmlFor="email">
                  Email Address <strong>*</strong>
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="customer@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'input-error' : ''}
                />

                {errors.email && (
                  <span className="quote-field-error">{errors.email}</span>
                )}
              </div>
            </div>
          </section>

          <section className="quote-form-card">
            <div className="quote-form-card-heading">
              <div className="quote-form-heading-icon green">
                <MapPin size={20} />
              </div>

              <div>
                <p>Moving Details</p>
                <h3>Pickup and Destination</h3>
                <span>Enter locations and preferred moving date.</span>
              </div>
            </div>

            <div className="quote-form-grid two-columns">
              <div className="quote-input-group">
                <label htmlFor="pickupLocation">
                  Moving From <strong>*</strong>
                </label>

                <input
                  id="pickupLocation"
                  type="text"
                  name="pickupLocation"
                  placeholder="Pickup suburb, city or address"
                  value={formData.pickupLocation}
                  onChange={handleChange}
                  className={errors.pickupLocation ? 'input-error' : ''}
                />

                {errors.pickupLocation && (
                  <span className="quote-field-error">
                    {errors.pickupLocation}
                  </span>
                )}
              </div>

              <div className="quote-input-group">
                <label htmlFor="destinationLocation">
                  Moving To <strong>*</strong>
                </label>

                <input
                  id="destinationLocation"
                  type="text"
                  name="destinationLocation"
                  placeholder="Destination suburb, city or address"
                  value={formData.destinationLocation}
                  onChange={handleChange}
                  className={
                    errors.destinationLocation ? 'input-error' : ''
                  }
                />

                {errors.destinationLocation && (
                  <span className="quote-field-error">
                    {errors.destinationLocation}
                  </span>
                )}
              </div>

              <div className="quote-input-group">
                <label htmlFor="movingDate">
                  Moving Date <strong>*</strong>
                </label>

                <input
                  id="movingDate"
                  type="date"
                  name="movingDate"
                  value={formData.movingDate}
                  onChange={handleChange}
                  className={errors.movingDate ? 'input-error' : ''}
                />

                {errors.movingDate && (
                  <span className="quote-field-error">
                    {errors.movingDate}
                  </span>
                )}
              </div>

              <div className="quote-input-group">
                <label htmlFor="propertyType">
                  Property Type <strong>*</strong>
                </label>

                <select
                  id="propertyType"
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  className={errors.propertyType ? 'input-error' : ''}
                >
                  <option value="">Select property type</option>

                  {propertyTypes.map((propertyType) => (
                    <option key={propertyType} value={propertyType}>
                      {propertyType}
                    </option>
                  ))}
                </select>

                {errors.propertyType && (
                  <span className="quote-field-error">
                    {errors.propertyType}
                  </span>
                )}
              </div>

              <div className="quote-input-group">
                <label htmlFor="service">
                  Moving Service <strong>*</strong>
                </label>

                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className={errors.service ? 'input-error' : ''}
                >
                  <option value="">Select service</option>

                  {serviceOptions.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>

                {errors.service && (
                  <span className="quote-field-error">
                    {errors.service}
                  </span>
                )}
              </div>

              <div className="quote-input-group">
                <label htmlFor="assignedTo">Assigned Manager</label>

                <select
                  id="assignedTo"
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleChange}
                >
                  {teamMembers.map((teamMember) => (
                    <option key={teamMember} value={teamMember}>
                      {teamMember}
                    </option>
                  ))}
                </select>
              </div>

              <div className="quote-input-group full-width">
                <label htmlFor="message">Customer Message</label>

                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  placeholder="Add furniture details, access instructions or special requirements..."
                  value={formData.message}
                  onChange={handleChange}
                />
              </div>
            </div>
          </section>

          <section className="quote-form-card">
            <div className="quote-form-card-heading">
              <div className="quote-form-heading-icon">
                <CalendarDays size={20} />
              </div>

              <div>
                <p>Pricing</p>
                <h3>Quote Pricing Information</h3>
                <span>Configure movers, truck and estimated charges.</span>
              </div>
            </div>

            <div className="quote-form-grid three-columns">
              <div className="quote-input-group">
                <label htmlFor="truckSize">Truck Size</label>

                <select
                  id="truckSize"
                  name="truckSize"
                  value={formData.truckSize}
                  onChange={handleChange}
                >
                  <option value="">Select truck</option>

                  {truckOptions.map((truck) => (
                    <option key={truck} value={truck}>
                      {truck}
                    </option>
                  ))}
                </select>
              </div>

              <div className="quote-input-group">
                <label htmlFor="numberOfMovers">Number of Movers</label>

                <select
                  id="numberOfMovers"
                  name="numberOfMovers"
                  value={formData.numberOfMovers}
                  onChange={handleChange}
                >
                  <option value="1">1 Mover</option>
                  <option value="2">2 Movers</option>
                  <option value="3">3 Movers</option>
                  <option value="4">4 Movers</option>
                  <option value="5">5 Movers</option>
                </select>
              </div>

              <div className="quote-input-group">
                <label htmlFor="hourlyRate">Hourly Rate</label>

                <div className="quote-price-input">
                  <span>$</span>

                  <input
                    id="hourlyRate"
                    type="number"
                    min="0"
                    step="0.01"
                    name="hourlyRate"
                    placeholder="0.00"
                    value={formData.hourlyRate}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="quote-input-group">
                <label htmlFor="minimumHours">Minimum Hours</label>

                <input
                  id="minimumHours"
                  type="number"
                  min="0"
                  step="0.5"
                  name="minimumHours"
                  value={formData.minimumHours}
                  onChange={handleChange}
                />
              </div>

              <div className="quote-input-group">
                <label htmlFor="calloutCharge">Callout Charge</label>

                <div className="quote-price-input">
                  <span>$</span>

                  <input
                    id="calloutCharge"
                    type="number"
                    min="0"
                    step="0.01"
                    name="calloutCharge"
                    placeholder="0.00"
                    value={formData.calloutCharge}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="quote-input-group">
                <label htmlFor="travelCharge">Travel Charge</label>

                <div className="quote-price-input">
                  <span>$</span>

                  <input
                    id="travelCharge"
                    type="number"
                    min="0"
                    step="0.01"
                    name="travelCharge"
                    placeholder="0.00"
                    value={formData.travelCharge}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="quote-input-group">
                <label htmlFor="packingCharge">Packing Charge</label>

                <div className="quote-price-input">
                  <span>$</span>

                  <input
                    id="packingCharge"
                    type="number"
                    min="0"
                    step="0.01"
                    name="packingCharge"
                    placeholder="0.00"
                    value={formData.packingCharge}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="quote-input-group">
                <label htmlFor="additionalCharge">Additional Charge</label>

                <div className="quote-price-input">
                  <span>$</span>

                  <input
                    id="additionalCharge"
                    type="number"
                    min="0"
                    step="0.01"
                    name="additionalCharge"
                    placeholder="0.00"
                    value={formData.additionalCharge}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="quote-input-group">
                <label htmlFor="discount">Discount</label>

                <div className="quote-price-input">
                  <span>$</span>

                  <input
                    id="discount"
                    type="number"
                    min="0"
                    step="0.01"
                    name="discount"
                    placeholder="0.00"
                    value={formData.discount}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="quote-input-group full-width">
                <label htmlFor="estimatedTotal">Estimated Total</label>

                <div className="quote-price-input total-input">
                  <span>$</span>

                  <input
                    id="estimatedTotal"
                    type="number"
                    min="0"
                    step="0.01"
                    name="estimatedTotal"
                    placeholder="Enter estimated total"
                    value={formData.estimatedTotal}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="quote-form-card">
            <div className="quote-form-card-heading">
              <div className="quote-form-heading-icon green">
                <CheckCircle2 size={20} />
              </div>

              <div>
                <p>Internal</p>
                <h3>Administration Information</h3>
                <span>Status and internal team notes.</span>
              </div>
            </div>

            <div className="quote-form-grid two-columns">
              <div className="quote-input-group">
                <label htmlFor="status">Quote Status</label>

                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  {quoteStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="quote-input-group full-width">
                <label htmlFor="internalNote">Internal Note</label>

                <textarea
                  id="internalNote"
                  name="internalNote"
                  rows="4"
                  placeholder="This information will only be visible to admin users."
                  value={formData.internalNote}
                  onChange={handleChange}
                />
              </div>
            </div>
          </section>
        </div>

        <aside className="quote-form-sidebar">
          <section className="quote-form-side-card">
            <h3>Quote Summary</h3>

            <div className="quote-summary-route">
              <span>Moving From</span>
              <strong>{formData.pickupLocation || 'Not selected'}</strong>
            </div>

            <div className="quote-summary-separator" />

            <div className="quote-summary-route destination">
              <span>Moving To</span>
              <strong>
                {formData.destinationLocation || 'Not selected'}
              </strong>
            </div>

            <div className="quote-side-summary-list">
              <div>
                <span>Customer</span>
                <strong>{formData.customerName || 'Not entered'}</strong>
              </div>

              <div>
                <span>Moving Date</span>
                <strong>{formData.movingDate || 'Not selected'}</strong>
              </div>

              <div>
                <span>Service</span>
                <strong>{formData.service || 'Not selected'}</strong>
              </div>

              <div>
                <span>Status</span>
                <strong>{formData.status}</strong>
              </div>

              <div>
                <span>Estimated Total</span>
                <strong>
                  {formData.estimatedTotal
                    ? `$${Number(formData.estimatedTotal).toFixed(2)}`
                    : '$0.00'}
                </strong>
              </div>
            </div>
          </section>

          <section className="quote-form-side-card quote-form-help">
            <h3>Required Information</h3>

            <p>
              Fields marked with an asterisk are required before the quote
              can be created.
            </p>

            <ul>
              <li>Customer contact details</li>
              <li>Pickup and destination</li>
              <li>Moving date</li>
              <li>Property type</li>
              <li>Requested service</li>
            </ul>
          </section>

          <button
            type="submit"
            className="quote-sidebar-save-button"
            disabled={isSaving}
          >
            <Save size={17} />
            {isSaving
              ? 'Saving Quote...'
              : isEditMode
                ? 'Update Quote'
                : 'Create Quote'}
          </button>
        </aside>
      </form>
    </div>
  )
}

export default QuoteFormPage