import mongoose from 'mongoose'

const { Schema } = mongoose

const bookingSchema = new Schema(
  {
    bookingNumber: { type: String, unique: true, sparse: true, index: true },
    quoteId: { type: Schema.Types.ObjectId, ref: 'Quote', default: null, index: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
    customerName: { type: String, required: true, trim: true },
    customerEmail: { type: String, required: true, lowercase: true, trim: true, index: true },
    customerPhone: { type: String, required: true, trim: true, index: true },
    serviceType: { type: String, required: true, trim: true },
    pickupLocation: { type: String, required: true, trim: true },
    deliveryLocation: { type: String, required: true, trim: true },
    pickupDate: { type: Date, required: true, index: true },
    deliveryDate: { type: Date, required: true, index: true },
    vehicleType: { type: String, default: '' },
    description: { type: String, default: '' },
    quantity: { type: Number, default: 1, min: 1 },
    totalAmount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'AUD' },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'in_transit', 'delivered', 'completed', 'cancelled'],
      default: 'pending',
      index: true,
    },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'Admin', default: null, index: true },
    notes: { type: String, default: '' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'Admin', default: null, index: true },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
)

async function generateBookingNumber() {
  const year = new Date().getFullYear()
  const prefix = `BK-${year}-`
  const count = await mongoose.models.Booking.countDocuments({
    createdAt: {
      $gte: new Date(`${year}-01-01T00:00:00.000Z`),
      $lt: new Date(`${year + 1}-01-01T00:00:00.000Z`),
    },
  })
  return `${prefix}${String(count + 1).padStart(6, '0')}`
}

bookingSchema.pre('save', async function (next) {
  try {
    if (!this.bookingNumber) {
      this.bookingNumber = await generateBookingNumber()
    }
    next()
  } catch (error) {
    next(error)
  }
})

// Removed explicit indexes for bookingNumber, quoteId, customerId, status, assignedTo, pickupDate, deliveryDate to fix duplicate index warnings
bookingSchema.index({ createdAt: -1 })

export default mongoose.models.Booking || mongoose.model('Booking', bookingSchema)
