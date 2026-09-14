import mongoose from 'mongoose'

const contactSchema = new mongoose.Schema(
  {
    numeric_id: { type: Number, default: 1 },
    address: { type: String, default: '' },
    phone_primary: { type: String, default: '' },
    phone_secondary: { type: String, default: '' },
    email_primary: { type: String, default: '' },
    email_secondary: { type: String, default: '' },
    opening_hours: { type: String, default: '' },
    google_maps_link: { type: String, default: '' },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
)

contactSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret.numeric_id || ret._id
    return ret
  },
})

export default mongoose.models.Contact || mongoose.model('Contact', contactSchema)
