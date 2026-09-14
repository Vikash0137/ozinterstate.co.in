import mongoose from 'mongoose'

const locationSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      default: '',
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    country: {
      type: String,
      default: 'Australia',
      trim: true,
    },
    region: {
      type: String,
      default: '',
      trim: true,
    },
    address: {
      type: String,
      default: '',
      trim: true,
    },
    phone: {
      type: String,
      default: '',
      trim: true,
    },
    email: {
      type: String,
      default: '',
      trim: true,
    },
    whatsappNumber: {
      type: String,
      default: '',
      trim: true,
    },
    badge: {
      type: String,
      default: 'Service Available',
      trim: true,
    },
    shortDescription: {
      type: String,
      default: '',
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    introduction: {
      type: String,
      default: '',
      trim: true,
    },
    localBusinessDescription: {
      type: String,
      default: '',
      trim: true,
    },

    // Hero Content
    heroTitle: {
      type: String,
      default: '',
      trim: true,
    },
    heroSubtitle: {
      type: String,
      default: '',
      trim: true,
    },
    heroDescription: {
      type: String,
      default: '',
      trim: true,
    },
    heroImage: {
      type: String,
      default: '',
      trim: true,
    },
    heroCtaText: {
      type: String,
      default: 'Get Free Estimate',
      trim: true,
    },
    heroCtaUrl: {
      type: String,
      default: '#quote',
      trim: true,
    },

    // Products & Services Available in this Location
    products: {
      type: [
        {
          name: { type: String, default: '' },
          description: { type: String, default: '' },
          icon: { type: String, default: 'Package' },
          tag: { type: String, default: '' },
          link: { type: String, default: '' },
        },
      ],
      default: [],
    },
    services: {
      type: [
        {
          title: { type: String, default: '' },
          description: { type: String, default: '' },
          icon: { type: String, default: 'Truck' },
          features: { type: [String], default: [] },
        },
      ],
      default: [],
    },

    // Highlights / Why Choose Us in this location
    highlights: {
      type: [
        {
          title: { type: String, default: '' },
          desc: { type: String, default: '' },
        },
      ],
      default: [],
    },
    highlightsTitle: {
      type: String,
      default: '',
      trim: true,
    },

    // Nearby Areas & Related Locations
    nearbyAreas: {
      type: [String],
      default: [],
    },
    relatedLocations: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Location' }],
      default: [],
    },
    popularRoutes: {
      type: [String],
      default: [],
    },

    // Location FAQs
    faqs: {
      type: [
        {
          question: { type: String, default: '' },
          answer: { type: String, default: '' },
        },
      ],
      default: [],
    },
    faqTitle: {
      type: String,
      default: '',
      trim: true,
    },

    // Testimonials / Reviews in this Location
    testimonials: {
      type: [
        {
          name: { type: String, default: '' },
          role: { type: String, default: 'Verified Customer' },
          review: { type: String, default: '' },
          rating: { type: Number, default: 5 },
          avatar: { type: String, default: '' },
          locationTag: { type: String, default: '' },
        },
      ],
      default: [],
    },

    // Call To Action (CTA) / RFQ Form Customization
    ctaTitle: {
      type: String,
      default: '',
      trim: true,
    },
    ctaDescription: {
      type: String,
      default: '',
      trim: true,
    },
    ctaButtonText: {
      type: String,
      default: 'Request a Quote',
      trim: true,
    },
    ctaButtonUrl: {
      type: String,
      default: '/contact',
      trim: true,
    },
    rfqLink: {
      type: String,
      default: '#quote',
      trim: true,
    },

    // Coordinates for Geolocation and Haversine Distance Calculation
    coordinates: {
      latitude: { type: Number, default: null },
      longitude: { type: Number, default: null },
    },

    // Custom Content Blocks (Commercial, Logistics, Industries, etc.)
    contentBlocks: {
      type: [
        {
          title: { type: String, default: '' },
          content: { type: String, default: '' },
          type: { type: String, default: 'text' }, // text, overview, industries, logistics
        },
      ],
      default: [],
    },

    // About Us & Local Story Section
    aboutTitle: {
      type: String,
      default: '',
      trim: true,
    },
    aboutSubtitle: {
      type: String,
      default: '',
      trim: true,
    },
    aboutDescription: {
      type: String,
      default: '',
      trim: true,
    },
    aboutImage: {
      type: String,
      default: '',
      trim: true,
    },

    // Extra Custom Content / Feature Section
    customSectionBadge: {
      type: String,
      default: '',
      trim: true,
    },
    customSectionTitle: {
      type: String,
      default: '',
      trim: true,
    },
    customSectionSubtitle: {
      type: String,
      default: '',
      trim: true,
    },
    customSectionContent: {
      type: String,
      default: '',
      trim: true,
    },
    customSectionImage: {
      type: String,
      default: '',
      trim: true,
    },
    customSectionBullets: {
      type: [String],
      default: [],
    },

    // Landing Page Titles & Sections
    introTitle: {
      type: String,
      default: '',
      trim: true,
    },
    introContent: {
      type: String,
      default: '',
      trim: true,
    },
    mainTitle: {
      type: String,
      default: '',
      trim: true,
    },
    mainContent: {
      type: String,
      default: '',
      trim: true,
    },
    servicesTitle: {
      type: String,
      default: '',
      trim: true,
    },
    servicesContent: {
      type: String,
      default: '',
      trim: true,
    },

    // SEO Settings
    seo: {
      title: {
        type: String,
        default: '',
        trim: true,
      },
      metaDescription: {
        type: String,
        default: '',
        trim: true,
      },
      primaryKeyword: {
        type: String,
        default: '',
        trim: true,
      },
      keywords: {
        type: [String],
        default: [],
      },
      titleTemplate: {
        type: String,
        default: '{primaryKeyword} in {city} | OZ-INTERSTATE',
        trim: true,
      },
      h1: {
        type: String,
        default: '',
        trim: true,
      },
      canonicalUrl: {
        type: String,
        default: '',
        trim: true,
      },
      robots: {
        type: String,
        enum: ['index,follow', 'noindex,nofollow', 'index,nofollow', 'noindex,follow'],
        default: 'index,follow',
      },
      noIndex: {
        type: Boolean,
        default: false,
      },
      noFollow: {
        type: Boolean,
        default: false,
      },
      ogTitle: {
        type: String,
        default: '',
        trim: true,
      },
      ogDescription: {
        type: String,
        default: '',
        trim: true,
      },
      ogImage: {
        type: String,
        default: '',
        trim: true,
      },
      twitterTitle: {
        type: String,
        default: '',
        trim: true,
      },
      twitterDescription: {
        type: String,
        default: '',
        trim: true,
      },
      twitterImage: {
        type: String,
        default: '',
        trim: true,
      },
      breadcrumbName: {
        type: String,
        default: '',
        trim: true,
      },
    },

    // LocalBusiness Schema.org Settings
    businessSchema: {
      enabled: {
        type: Boolean,
        default: true,
      },
      type: {
        type: String,
        default: 'LocalBusiness',
      },
      businessName: {
        type: String,
        default: '',
        trim: true,
      },
      businessType: {
        type: String,
        default: 'MovingCompany',
        trim: true,
      },
      priceRange: {
        type: String,
        default: '$$',
        trim: true,
      },
      address: {
        street: { type: String, default: '', trim: true },
        city: { type: String, default: '', trim: true },
        state: { type: String, default: '', trim: true },
        postalCode: { type: String, default: '', trim: true },
        country: { type: String, default: 'AU', trim: true },
      },
      latitude: {
        type: Number,
        default: null,
      },
      longitude: {
        type: Number,
        default: null,
      },
      customJsonLd: {
        type: String,
        default: '',
      },
    },

    // Internal Linking Network
    internalLinks: {
      type: [
        {
          anchorText: { type: String, default: '' },
          url: { type: String, default: '' },
          description: { type: String, default: '' },
        },
      ],
      default: [],
    },

    // Status & Workflow
    status: {
      type: String,
      enum: ['draft', 'published', 'unpublished', 'archived', 'active', 'inactive'],
      default: 'published',
      index: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    // SEO Health Score & Audit
    seoScore: {
      type: Number,
      default: 85,
    },
    seoWarnings: {
      type: [String],
      default: [],
    },

    // Analytics & Metrics
    views: {
      type: Number,
      default: 0,
    },
    leadsCount: {
      type: Number,
      default: 0,
    },

    // Legacy fields for backward compatibility
    featuredImage: {
      type: String,
      default: '',
    },
    metaTitle: {
      type: String,
      default: '',
    },
    metaDescription: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  }
)

// Compound Indexes for fast querying
locationSchema.index({ status: 1, name: 1 })
locationSchema.index({ isPublished: 1, isDeleted: 1 })
locationSchema.index({ slug: 1, isDeleted: 1 })
locationSchema.index({ country: 1, state: 1, city: 1 })
locationSchema.index({ 'coordinates.latitude': 1, 'coordinates.longitude': 1 })

export default mongoose.models.Location || mongoose.model('Location', locationSchema)
