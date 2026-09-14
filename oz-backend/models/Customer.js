import mongoose from 'mongoose'

const { Schema } = mongoose

const customerSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    phone: { type: String, required: true, trim: true, index: true },
    alternatePhone: { type: String, trim: true, default: '' },
    companyName: { type: String, trim: true, index: true, default: '' },
    address: { type: String, trim: true, default: '' },
    city: { type: String, trim: true, default: '' },
    state: { type: String, trim: true, default: '' },
    country: { type: String, trim: true, default: 'India' },
    postalCode: { type: String, trim: true, default: '' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active', index: true },
    notes: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
)

// Removed explicit indexes for email, phone, companyName, status to fix duplicate index warnings

export default mongoose.models.Customer || mongoose.model('Customer', customerSchema)
