import mongoose from 'mongoose'

const testimonialSchema = new mongoose.Schema(
  {
    numeric_id: { type: Number, default: 1 },
    name: { type: String, required: true },
    role: { type: String, default: 'Customer' },
    company: { type: String, default: '' },
    avatar: { type: String, default: '' },
    content: { type: String, required: true },
    rating: { type: Number, default: 5 },
    route: { type: String, default: '' }, // e.g. "Melbourne to Sydney"
    isFeatured: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    
    // Soft delete
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: { createdAt: 'created_at' } }
)

testimonialSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret.numeric_id || ret._id
    return ret
  },
})

export default mongoose.models.Testimonial || mongoose.model('Testimonial', testimonialSchema)
