import mongoose from 'mongoose'

const loginLogSchema = new mongoose.Schema(
  {
    admin_id: { type: String, default: null },
    email: { type: String, required: true },
    ip_address: { type: String, default: '' },
    user_agent: { type: String, default: '' },
    status: { type: String, enum: ['success', 'failed'], default: 'success' },
  },
  { timestamps: { createdAt: 'created_at' } }
)

export default mongoose.models.LoginLog || mongoose.model('LoginLog', loginLogSchema)
