import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const adminSchema = new mongoose.Schema(
  {
    role_id: { type: Number, default: 1 },
    role: { type: String, default: 'Super Admin' },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    phone: { type: String, default: '' },
    avatar: { type: String, default: '' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    remember_token: { type: String, default: '' },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
)

// Hash password before saving if modified
adminSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) return next()
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    return next()
  } catch (err) {
    return next(err)
  }
})

adminSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id
    // Do not expose password or remember_token
    delete ret.password
    delete ret.remember_token
    return ret
  },
})

export default mongoose.models.Admin || mongoose.model('Admin', adminSchema)
