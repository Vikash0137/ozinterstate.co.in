import mongoose from 'mongoose'

const seoSubSchema = new mongoose.Schema(
  {
    title: { type: String, default: '', trim: true },
    metaDescription: { type: String, default: '', trim: true },
    keywords: { type: [String], default: [] },
    robots: {
      type: String,
      enum: ['index,follow', 'noindex,nofollow', 'index,nofollow', 'noindex,follow'],
      default: 'index,follow',
    },
    canonicalUrl: { type: String, default: '', trim: true },
    ogTitle: { type: String, default: '', trim: true },
    ogDescription: { type: String, default: '', trim: true },
    ogImage: { type: String, default: '', trim: true },
    twitterTitle: { type: String, default: '', trim: true },
    twitterDescription: { type: String, default: '', trim: true },
    twitterImage: { type: String, default: '', trim: true },
  },
  { _id: false }
)

const blogSchema = new mongoose.Schema(
  {
    numeric_id: { type: Number, default: 1 },
    category_id: { type: Number, default: null },
    category: { type: String, default: '' },
    tags: { type: [String], default: [] },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    summary: { type: String, default: '' }, // Keep for backward compatibility
    excerpt: { type: String, default: '' },
    content: { type: String, default: '' },
    image: { type: String, default: '' },
    featuredImageAlt: { type: String, default: '' },
    author: { type: String, default: 'OZ Admin' },
    readTime: { type: String, default: '' },
    isFeatured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
    publishedAt: { type: Date, default: null },
    status: { type: String, enum: ['published', 'draft', 'archived'], default: 'published' },
    
    // SEO
    seo: { type: seoSubSchema, default: () => ({}) },

    // Soft delete
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
)

blogSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret.numeric_id || ret._id
    return ret
  },
})

export default mongoose.models.Blog || mongoose.model('Blog', blogSchema)
