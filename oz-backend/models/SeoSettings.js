import mongoose from 'mongoose'

const seoSettingsSchema = new mongoose.Schema(
  {
    // Global Defaults
    defaultTitle: { type: String, default: 'OZ Interstate Movers - Reliable Freight & Transport', trim: true },
    titleTemplate: { type: String, default: '%s | OZ Interstate Movers', trim: true },
    defaultMetaDescription: { type: String, default: 'Professional interstate removalists and freight services across Australia.', trim: true },
    defaultKeywords: { type: [String], default: ['interstate movers', 'removalists', 'freight australia'] },
    defaultRobots: { type: String, default: 'index,follow' },
    defaultCanonical: { type: String, default: 'https://oz-interstate.com.au' },
    
    // Default Social Sharing
    defaultOgTitle: { type: String, default: 'OZ Interstate Movers' },
    defaultOgDescription: { type: String, default: 'Professional interstate removalists and freight services across Australia.' },
    defaultOgImage: { type: String, default: '/oz-logo.png' },
    defaultTwitterTitle: { type: String, default: 'OZ Interstate Movers' },
    defaultTwitterDescription: { type: String, default: 'Professional interstate removalists and freight services across Australia.' },
    defaultTwitterImage: { type: String, default: '/oz-logo.png' },

    // Verification & Tracking
    googleSiteVerification: { type: String, default: '' },
    bingSiteVerification: { type: String, default: '' },
    googleAnalyticsId: { type: String, default: '' },
    googleTagManagerId: { type: String, default: '' },

    // Structured Data (JSON-LD Strings)
    organizationSchema: { type: mongoose.Schema.Types.Mixed, default: null },
    websiteSchema: { type: mongoose.Schema.Types.Mixed, default: null },

    // Single Document Enforcement
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
)

// Removed explicit index to prevent duplicate index warning

export default mongoose.models.SeoSettings || mongoose.model('SeoSettings', seoSettingsSchema)
