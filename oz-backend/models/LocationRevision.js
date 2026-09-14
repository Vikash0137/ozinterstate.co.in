import mongoose from 'mongoose'

const locationRevisionSchema = new mongoose.Schema(
  {
    locationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location',
      required: true,
      index: true,
    },
    version: {
      type: Number,
      required: true,
    },
    changedBy: {
      type: String,
      default: 'Admin',
    },
    summary: {
      type: String,
      default: 'Updated location details',
    },
    snapshot: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: { createdAt: 'createdAt' },
  }
)

locationRevisionSchema.index({ locationId: 1, version: -1 })

export default mongoose.models.LocationRevision || mongoose.model('LocationRevision', locationRevisionSchema)
