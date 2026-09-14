import mongoose from 'mongoose'

const redirectSchema = new mongoose.Schema(
  {
    source: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    destination: {
      type: String,
      required: true,
      trim: true,
    },
    statusCode: {
      type: Number,
      enum: [301, 302, 307, 308],
      default: 301,
    },
    hits: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  }
)

redirectSchema.index({ source: 1, isActive: 1 })

export default mongoose.models.Redirect || mongoose.model('Redirect', redirectSchema)
