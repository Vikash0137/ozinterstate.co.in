import mongoose from 'mongoose'

const pageSectionSchema = new mongoose.Schema(
  {
    pageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Page',
      required: true,
      index: true,
    },
    sectionKey: { type: String, default: '', trim: true },
    sectionType: {
      type: String,
      enum: [
        'hero',
        'page_banner',
        'trust_strip',
        'stats',
        'services_grid',
        'why_choose_us',
        'moving_process',
        'locations_grid',
        'reviews',
        'gallery',
        'faq',
        'contact',
        'quote_form',
        'content',
        'image_content',
        'cards',
        'team',
        'cta',
        'custom_html',
      ],
      required: true,
    },
    // Standard Content Fields
    title: { type: String, default: '', trim: true },
    subtitle: { type: String, default: '', trim: true },
    eyebrow: { type: String, default: '', trim: true },
    description: { type: String, default: '', trim: true },
    content: { type: String, default: '' }, // For rich text or custom HTML

    // Media
    image: { type: String, default: '', trim: true },
    imageAlt: { type: String, default: '', trim: true },
    mobileImage: { type: String, default: '', trim: true },
    backgroundImage: { type: String, default: '', trim: true },

    // Actions
    buttonText: { type: String, default: '', trim: true },
    buttonUrl: { type: String, default: '', trim: true },
    secondaryButtonText: { type: String, default: '', trim: true },
    secondaryButtonUrl: { type: String, default: '', trim: true },

    // Flexible Data
    items: { type: mongoose.Schema.Types.Mixed, default: [] }, // Array of sub-items (e.g., cards, lists)
    settings: { type: mongoose.Schema.Types.Mixed, default: {} }, // Section-specific config (e.g., alignment, colors)

    // Display
    sortOrder: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true, index: true },

    // Soft delete
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  }
)

pageSectionSchema.index({ pageId: 1, sortOrder: 1 })
pageSectionSchema.index({ pageId: 1, isVisible: 1, isDeleted: 1 })

export default mongoose.models.PageSection || mongoose.model('PageSection', pageSectionSchema)
