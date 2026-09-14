import mongoose from 'mongoose'

const navigationItemSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    isVisible: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
    openInNewTab: { type: Boolean, default: false },
  },
  { _id: false }
)

const siteSettingsSchema = new mongoose.Schema(
  {
    // Company Information
    siteName: { type: String, default: 'OZ Interstate Movers', trim: true },
    fullName: { type: String, default: '', trim: true },
    tagline: { type: String, default: '', trim: true },
    logo: { type: String, default: '', trim: true },
    logoAlt: { type: String, default: 'OZ Interstate Movers', trim: true },
    favicon: { type: String, default: '', trim: true },
    phone: { type: String, default: '', trim: true },
    phoneHref: { type: String, default: '', trim: true },
    emergencyPhone: { type: String, default: '', trim: true },
    emergencyPhoneHref: { type: String, default: '', trim: true },
    email: { type: String, default: '', trim: true },
    emailHref: { type: String, default: '', trim: true },
    alternateEmail: { type: String, default: '', trim: true },
    address: { type: String, default: '', trim: true },
    openingHours: { type: String, default: '', trim: true },
    abn: { type: String, default: '', trim: true },
    companyRegistration: { type: String, default: '', trim: true },
    copyrightText: { type: String, default: '', trim: true },
    currency: { type: String, default: 'AUD ($)', trim: true },
    timezone: { type: String, default: 'Australia/Sydney', trim: true },
    mapUrl: { type: String, default: '', trim: true },

    // Social Media
    social: {
      facebook: { type: String, default: '', trim: true },
      instagram: { type: String, default: '', trim: true },
      linkedin: { type: String, default: '', trim: true },
      twitter: { type: String, default: '', trim: true },
      youtube: { type: String, default: '', trim: true },
      whatsapp: { type: String, default: '', trim: true },
    },

    // Global CTA (Footer CTA banner)
    globalCta: {
      title: { type: String, default: '', trim: true },
      description: { type: String, default: '', trim: true },
      buttonText: { type: String, default: '', trim: true },
      buttonUrl: { type: String, default: '', trim: true },
      secondaryButtonText: { type: String, default: '', trim: true },
      secondaryButtonUrl: { type: String, default: '', trim: true },
      backgroundImage: { type: String, default: '', trim: true },
    },

    whyChooseSection: {
      title: { type: String, default: '', trim: true },
      subtitle: { type: String, default: '', trim: true },
      image: { type: String, default: '', trim: true },
    },

    aboutSection: {
      title: { type: String, default: '', trim: true },
      subtitle: { type: String, default: '', trim: true },
      description: { type: String, default: '', trim: true },
      image: { type: String, default: '', trim: true },
      primaryButtonText: { type: String, default: '', trim: true },
      primaryButtonUrl: { type: String, default: '', trim: true },
      secondaryButtonText: { type: String, default: '', trim: true },
      secondaryButtonUrl: { type: String, default: '', trim: true },
    },

    // Header Configuration
    header: {
      logo: { type: String, default: '', trim: true },
      logoAlt: { type: String, default: '', trim: true },
      ctaText: { type: String, default: 'Contact Us', trim: true },
      ctaUrl: { type: String, default: '/contact', trim: true },
      searchEnabled: { type: Boolean, default: true },
      phoneVisible: { type: Boolean, default: true },
    },

    // Footer Configuration
    footer: {
      logo: { type: String, default: '', trim: true },
      logoAlt: { type: String, default: '', trim: true },
      description: { type: String, default: '', trim: true },
      copyright: { type: String, default: '', trim: true },
      privacyPolicyUrl: { type: String, default: '#', trim: true },
      termsUrl: { type: String, default: '#', trim: true },
    },

    // Floating CTA Configuration
    floatingCta: {
      enabled: { type: Boolean, default: true },
      phoneNumber: { type: String, default: '', trim: true },
      phoneHref: { type: String, default: '', trim: true },
      quoteUrl: { type: String, default: '/contact', trim: true },
      whatsappNumber: { type: String, default: '', trim: true },
    },

    // Navigation Items
    navigationItems: {
      type: [navigationItemSchema],
      default: [],
    },

    // Property Sizes (for quote forms)
    propertySizes: {
      type: [String],
      default: [],
    },

    // Status
    isActive: { type: Boolean, default: true, index: true },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  }
)

// Removed explicit index to prevent duplicate index warning

export default mongoose.models.SiteSettings || mongoose.model('SiteSettings', siteSettingsSchema)
