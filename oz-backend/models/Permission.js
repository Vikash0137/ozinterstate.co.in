import mongoose from 'mongoose'

const permissionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    module: { type: String, required: true },
  },
  { timestamps: { createdAt: 'created_at' } }
)

export default mongoose.models.Permission || mongoose.model('Permission', permissionSchema)
