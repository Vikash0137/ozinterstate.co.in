import mongoose from 'mongoose'

const trustBadgeSchema = new mongoose.Schema(
  {
    icon: { type: String, required: true, trim: true }, // Name of the lucide icon
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    
    sortOrder: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },

    // Soft delete
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
)

trustBadgeSchema.index({ status: 1, isDeleted: 1, sortOrder: 1 })

export default mongoose.models.TrustBadge || mongoose.model('TrustBadge', trustBadgeSchema)
