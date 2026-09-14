import mongoose from 'mongoose'

const settingsSchema = new mongoose.Schema(
  {
    numeric_id: { type: Number, default: 1 },
    site_name: { type: String, default: 'OZ Interstate Movers' },
    site_email: { type: String, default: 'info@ozinterstate.com' },
    site_phone: { type: String, default: '1300 000 000' },
    site_address: { type: String, default: '' },
    logo: { type: String, default: '' },
    favicon: { type: String, default: '' },
    currency: { type: String, default: 'AUD ($)' },
    timezone: { type: String, default: 'Australia/Sydney' },
    footer_text: { type: String, default: '' },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
)

settingsSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret.numeric_id || ret._id
    return ret
  },
})

export default mongoose.models.Settings || mongoose.model('Settings', settingsSchema)
