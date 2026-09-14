import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['QUOTE', 'CUSTOMER', 'ADMIN', 'SYSTEM'],
      default: 'SYSTEM',
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    entityId: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    entityType: {
      type: String,
      default: null,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  }
)

// Indexes for common queries
notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 })
notificationSchema.index({ userId: 1, createdAt: -1 })
notificationSchema.index({ createdAt: -1 })

export default mongoose.models.Notification || mongoose.model('Notification', notificationSchema)
