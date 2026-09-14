import mongoose from 'mongoose'

const processStepSchema = new mongoose.Schema(
  {
    stepNumber: { type: Number, required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    icon: { type: String, default: '', trim: true }, // Name of the lucide icon
    
    sortOrder: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },

    // Soft delete
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
)

processStepSchema.index({ status: 1, isDeleted: 1, sortOrder: 1 })

export default mongoose.models.ProcessStep || mongoose.model('ProcessStep', processStepSchema)
