import mongoose from 'mongoose'

const statSchema = new mongoose.Schema(
  {
    value: { type: Number, required: true },
    label: { type: String, required: true, trim: true },
    prefix: { type: String, default: '', trim: true },
    suffix: { type: String, default: '', trim: true },
    decimals: { type: Number, default: 0 },
    icon: { type: String, default: '', trim: true }, // Name of the lucide icon
    
    sortOrder: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },

    // Soft delete
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
)

statSchema.index({ status: 1, isDeleted: 1, sortOrder: 1 })

export default mongoose.models.Stat || mongoose.model('Stat', statSchema)
