import mongoose from 'mongoose'

const seoSchema = new mongoose.Schema(
  {
    numeric_id: { type: Number, default: 1 },
    page_name: { type: String, required: true, unique: true },
    meta_title: { type: String, default: '' },
    meta_description: { type: String, default: '' },
    meta_keywords: { type: String, default: '' },
    canonical_url: { type: String, default: '' },
    og_image: { type: String, default: '' },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
)

seoSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret.numeric_id || ret._id
    return ret
  },
})

export default mongoose.models.SEO || mongoose.model('SEO', seoSchema)
