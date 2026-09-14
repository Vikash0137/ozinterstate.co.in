import mongoose from 'mongoose'

const seoSubSchema = new mongoose.Schema(
  {
    h1: { type: String, default: '', trim: true },
    title: { type: String, default: '', trim: true },
    metaDescription: { type: String, default: '', trim: true },
    primaryKeyword: { type: String, default: '', trim: true },
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

const faqSubSchema = new mongoose.Schema(
  {
    question: { type: String, default: '', trim: true },
    answer: { type: String, default: '', trim: true },
  },
  { _id: false }
)

const serviceSchema = new mongoose.Schema(
  {
    numeric_id: { type: Number, default: 1 },
    category_id: { type: Number, default: null },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true, index: true },
    short_description: { type: String, default: '', trim: true },
    longDescription: { type: String, default: '', trim: true },
    content: { type: String, default: '', trim: true },
    icon: { type: String, default: 'Truck', trim: true },
    image: { type: String, default: '', trim: true },
    imageAlt: { type: String, default: '', trim: true },
    price: { type: Number, default: 0 },

    // Hero Section Content
    heroTitle: { type: String, default: '', trim: true },
    heroSubtitle: { type: String, default: '', trim: true },
    heroDescription: { type: String, default: '', trim: true },
    heroImage: { type: String, default: '', trim: true },

    // About / Scope Section Content
    aboutTitle: { type: String, default: '', trim: true },
    aboutSubtitle: { type: String, default: '', trim: true },
    aboutDescription: { type: String, default: '', trim: true },
    aboutImage: { type: String, default: '', trim: true },

    // Extra Custom Section Content
    customSectionBadge: { type: String, default: '', trim: true },
    customSectionTitle: { type: String, default: '', trim: true },
    customSectionSubtitle: { type: String, default: '', trim: true },
    customSectionContent: { type: String, default: '', trim: true },
    customSectionImage: { type: String, default: '', trim: true },
    customSectionBullets: { type: [String], default: [] },

    // Feature Lists
    features: { type: [String], default: [] },
    benefits: { type: [String], default: [] },

    // Service FAQs
    faqs: { type: [faqSubSchema], default: [] },
    faqTitle: { type: String, default: '', trim: true },

    // Actions & CTA
    ctaText: { type: String, default: 'Request Free Quote', trim: true },
    ctaUrl: { type: String, default: '#quote', trim: true },

    // Display
    sortOrder: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },

    // SEO
    seo: { type: seoSubSchema, default: () => ({}) },

    // Soft delete
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
)

serviceSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret.numeric_id || ret._id
    return ret
  },
})

export default mongoose.models.Service || mongoose.model('Service', serviceSchema)
