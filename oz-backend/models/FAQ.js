import mongoose from 'mongoose'

const faqSchema = new mongoose.Schema(
  {
    numeric_id: { type: Number, default: 1 },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: { type: String, default: 'general' },
    
    // Associations for filtering
    pageSlug: { type: String, default: null, index: true },
    locationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', default: null, index: true },
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', default: null, index: true },
    
    display_order: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },

    // Soft delete
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: { createdAt: 'created_at' } }
)

faqSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret.numeric_id || ret._id
    return ret
  },
})

export default mongoose.models.FAQ || mongoose.model('FAQ', faqSchema)
