import mongoose from 'mongoose'

const mediaLibrarySchema = new mongoose.Schema(
  {
    numeric_id: { type: Number, default: 1 },
    file_name: { type: String, required: true }, // Original file name
    file_path: { type: String, required: true }, // URL path
    file_type: { type: String, required: true }, // 'images', 'videos', 'documents'
    file_size: { type: Number, required: true }, // In bytes
    mime_type: { type: String, required: true },
    
    // Metadata
    title: { type: String, default: '' },
    alt_text: { type: String, default: '' },
    caption: { type: String, default: '' },
    description: { type: String, default: '' },
    
    // Organization
    folder: { type: String, default: 'general' },
    
    // Image Dimensions (if applicable)
    width: { type: Number, default: null },
    height: { type: Number, default: null },
    
    // Tracking
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', default: null },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },

    // Soft delete
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
)

mediaLibrarySchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret.numeric_id || ret._id
    // Provide a computed URL for the frontend
    ret.url = ret.file_path.startsWith('http') ? ret.file_path : `${process.env.API_BASE_URL || ''}${ret.file_path}`
    return ret
  },
})

export default mongoose.models.MediaLibrary || mongoose.model('MediaLibrary', mediaLibrarySchema)
