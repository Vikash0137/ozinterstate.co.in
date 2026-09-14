import mongoose from 'mongoose'

const gallerySchema = new mongoose.Schema(
  {
    numeric_id: { type: Number, default: 1 },
    title: { type: String, default: '' },
    category: { type: String, default: 'general' },
    image_url: { type: String, required: true },
    altText: { type: String, default: '' },
    caption: { type: String, default: '' },
    span: { type: String, default: 'col-span-1 row-span-1' }, // For masonry/grid layouts
    display_order: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },

    // Soft delete
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: { createdAt: 'created_at' } }
)

gallerySchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret.numeric_id || ret._id
    return ret
  },
})

export default mongoose.models.Gallery || mongoose.model('Gallery', gallerySchema)
