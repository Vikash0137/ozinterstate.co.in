import mongoose from 'mongoose'

const { Schema } = mongoose

const inventoryItemSchema = new Schema(
  {
    item: { type: String },
    quantity: { type: Number, default: 1 },
    notes: { type: String, default: '' },
  },
  { _id: false }
)

const addressSchema = new Schema(
  {
    address: { type: String, default: '' },
    suburb: { type: String, default: '' },
    state: { type: String, default: '' },
    postcode: { type: String, default: '' },
  },
  { _id: false }
)

const quoteSchema = new Schema(
  {
    quoteNumber: { type: String, unique: true, index: true },
    customerName: { type: String, required: true, trim: true },
    customerEmail: { type: String, required: true, lowercase: true, trim: true, index: true },
    customerPhone: { type: String, required: true, trim: true, index: true },
    movingFrom: { type: addressSchema, required: true },
    movingTo: { type: addressSchema, required: true },
    movingDate: { type: Date, required: true, index: true },
    propertyType: { type: String, enum: ['House', 'Apartment', 'Office', 'Other'], required: true },
    serviceType: { type: String, enum: ['Interstate Moving', 'Residential Moving', 'Commercial Moving', 'Packing', 'Storage', 'Other'], required: true },
    inventory: { type: [inventoryItemSchema], default: [] },
    estimatedVolume: { type: Number, default: 0 },
    estimatedWeight: { type: Number, default: 0 },
    additionalServices: { type: [String], default: [] },
    customerMessage: { type: String, default: '' },
    status: {
      type: String,
      enum: ['NEW', 'CONTACTED', 'QUOTED', 'FOLLOW_UP', 'CONVERTED', 'REJECTED', 'ARCHIVED'],
      default: 'NEW',
      index: true,
    },
    basePrice: { type: Number, default: 0 },
    additionalCharges: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
    currency: { type: String, default: 'AUD' },
    internalNotes: {
      type: [
        {
          note: String,
          createdBy: String,
          createdAt: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
    assignedTo: { type: String, default: '' },
    contactedAt: { type: Date },
    quotedAt: { type: Date },
    convertedAt: { type: Date },
    rejectedAt: { type: Date },
    archivedAt: { type: Date },
    source: { type: String, default: 'website' },
    locationId: { type: Schema.Types.ObjectId, ref: 'Location', default: null, index: true },
    locationSlug: { type: String, default: '' },
    locationName: { type: String, default: '' },
    landingPage: { type: String, default: '' },
    referrer: { type: String, default: '' },
    utmSource: { type: String, default: '' },
    utmMedium: { type: String, default: '' },
    utmCampaign: { type: String, default: '' },
    utmTerm: { type: String, default: '' },
    utmContent: { type: String, default: '' },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', default: null, index: true },
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', default: null, index: true },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
)

// Generate a quoteNumber before saving if missing
quoteSchema.pre('save', async function (next) {
  try {
    if (this.quoteNumber) return next()

    const year = new Date().getFullYear()
    const prefix = `OZQ-${year}-`
    // Simple sequence: count documents for the year and add 1
    const start = new Date(`${year}-01-01T00:00:00Z`)
    const end = new Date(`${year}-12-31T23:59:59Z`)
    const count = await mongoose.model('Quote').countDocuments({ createdAt: { $gte: start, $lte: end } }).catch(() => 0)
    const seq = String((count || 0) + 1).padStart(5, '0')
    this.quoteNumber = `${prefix}${seq}`
    return next()
  } catch (err) {
    return next(err)
  }
})

quoteSchema.index({ createdAt: -1 })

export default mongoose.models.Quote || mongoose.model('Quote', quoteSchema)
