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

const pageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true, index: true },
    route: { type: String, required: true, trim: true },
    pageType: {
      type: String,
      enum: ['home', 'company', 'services', 'reviews', 'blogs', 'locations', 'contact', 'sitemap', 'notfound', 'custom'],
      default: 'custom',
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'inactive'],
      default: 'published',
      index: true,
    },
    isPublished: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },

    // SEO
    seo: { type: seoSubSchema, default: () => ({}) },

    // Structured Data
    schemaType: { type: String, default: '', trim: true },
    schemaJson: { type: mongoose.Schema.Types.Mixed, default: null },

    // Page Banner
    banner: {
      enabled: { type: Boolean, default: true },
      title: { type: String, default: '', trim: true },
      subtitle: { type: String, default: '', trim: true },
      description: { type: String, default: '', trim: true },
      image: { type: String, default: '', trim: true },
      imageAlt: { type: String, default: '', trim: true },
      crumb: { type: String, default: '', trim: true },
    },

    // Soft delete
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  }
)

// Compound indexes
pageSchema.index({ slug: 1, status: 1 })
pageSchema.index({ route: 1, status: 1 })
pageSchema.index({ status: 1, isDeleted: 1 })

export default mongoose.models.Page || mongoose.model('Page', pageSchema)
