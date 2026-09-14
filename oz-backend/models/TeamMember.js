import mongoose from 'mongoose'

const teamMemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    designation: { type: String, required: true, trim: true },
    bio: { type: String, default: '', trim: true },
    image: { type: String, default: '', trim: true },
    imageAlt: { type: String, default: '', trim: true },
    
    // Social Links
    linkedin: { type: String, default: '', trim: true },
    twitter: { type: String, default: '', trim: true },
    email: { type: String, default: '', trim: true },
    
    sortOrder: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },

    // Soft delete
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
)

teamMemberSchema.index({ status: 1, isDeleted: 1, sortOrder: 1 })

export default mongoose.models.TeamMember || mongoose.model('TeamMember', teamMemberSchema)
