import mongoose from 'mongoose'

const activityLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
      index: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
      index: true,
    },
    module: {
      type: String,
      required: true,
      index: true,
    },
    entityId: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
      index: true,
    },
    entityType: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      required: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ipAddress: {
      type: String,
      default: null,
    },
    userAgent: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  }
)

// Index for common queries
activityLogSchema.index({ createdAt: -1 })
activityLogSchema.index({ userId: 1, createdAt: -1 })
activityLogSchema.index({ action: 1, createdAt: -1 })
activityLogSchema.index({ module: 1, createdAt: -1 })

export default mongoose.models.ActivityLog || mongoose.model('ActivityLog', activityLogSchema)
