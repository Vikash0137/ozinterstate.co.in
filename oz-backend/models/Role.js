import mongoose from 'mongoose'

const roleSchema = new mongoose.Schema(
  {
    role_id: { type: Number, default: 1 },
    name: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
)

export default mongoose.models.Role || mongoose.model('Role', roleSchema)
