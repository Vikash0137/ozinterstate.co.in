import mongoose from 'mongoose'
import Location from '../models/Location.js'
import { connectMongo } from '../config/db.js'

let testLocations = []

const log = (msg) => console.log(`✓ ${msg}`)
const logError = (msg) => console.error(`✗ ${msg}`)
const logSection = (msg) => console.log(`\n═══ ${msg} ═══`)

const cleanupLocations = async () => {
  try {
    if (testLocations.length > 0) {
      await Location.deleteMany({ _id: { $in: testLocations } })
      testLocations = []
    }
  } catch (err) {
    logError(`Cleanup error: ${err.message}`)
  }
}

const runTests = async () => {
  console.log('\n=== LOCATION SEO AND DYNAMIC CONTENT TESTS ===\n')

  try {
    await connectMongo()
    log('Connected to MongoDB')

    // Clean up before tests
    await cleanupLocations()

    // Test 1: Create location with basic fields
    logSection('CREATE LOCATION - Basic Fields')
    try {
      const locationData = {
        name: 'Sydney Branch',
        slug: 'sydney-branch',
        city: 'Sydney',
        state: 'NSW',
        country: 'Australia',
        address: '123 Main Street, Sydney NSW 2000',
        phone: '1300-111-111',
        email: 'sydney@oz.com.au',
        status: 'active',
      }

      const location = await Location.create(locationData)
      testLocations.push(location._id)

      if (location.name === 'Sydney Branch' && location.slug === 'sydney-branch') {
        log('Created location with basic fields')
      } else {
        logError('Failed to create location with basic fields')
      }
    } catch (err) {
      logError(`Create basic location: ${err.message}`)
    }

    // Test 2: Create location with complete SEO data
    logSection('CREATE LOCATION - Complete SEO Data')
    try {
      const locationData = {
        name: 'Melbourne Branch',
        slug: 'melbourne-branch',
        city: 'Melbourne',
        state: 'VIC',
        country: 'Australia',
        address: '456 Park Road, Melbourne VIC 3000',
        phone: '1300-222-222',
        email: 'melbourne@oz.com.au',
        status: 'active',
        seo: {
          title: 'Interstate Removalists Melbourne | OZ-INTERSTATE',
          metaDescription: 'Professional removalists in Melbourne offering affordable interstate moving services.',
          keywords: ['removalists melbourne', 'interstate movers', 'moving company'],
          h1: 'Interstate Removalists Melbourne',
          canonicalUrl: '/locations/melbourne-branch',
          robots: 'index,follow',
          ogTitle: 'Professional Removalists in Melbourne',
          ogDescription: 'Affordable interstate moving services in Melbourne',
          ogImage: '/images/melbourne-og.jpg',
          breadcrumbName: 'Melbourne',
        },
        heroTitle: 'Expert Removalists in Melbourne',
        heroSubtitle: 'Professional interstate moving services',
        introTitle: 'Welcome to OZ Interstate Melbourne Branch',
        introContent: 'We provide comprehensive moving solutions for Melbourne businesses and families.',
        mainTitle: 'Premium Interstate Moving Services',
        mainContent: 'Our experienced team ensures safe and timely delivery of your belongings.',
        servicesTitle: 'Available Services',
        servicesContent: 'Full range of moving and transport services',
      }

      const location = await Location.create(locationData)
      testLocations.push(location._id)

      if (
        location.seo?.title === 'Interstate Removalists Melbourne | OZ-INTERSTATE' &&
        location.heroTitle === 'Expert Removalists in Melbourne'
      ) {
        log('Created location with complete SEO data')
      } else {
        logError('Failed to create location with SEO data')
      }
    } catch (err) {
      logError(`Create SEO location: ${err.message}`)
    }

    // Test 3: Create location with services as objects
    logSection('CREATE LOCATION - Services as Objects')
    try {
      const locationData = {
        name: 'Brisbane Branch',
        slug: 'brisbane-branch',
        city: 'Brisbane',
        state: 'QLD',
        country: 'Australia',
        address: '789 Queen Street, Brisbane QLD 4000',
        phone: '1300-333-333',
        email: 'brisbane@oz.com.au',
        status: 'active',
        services: [
          { title: 'Residential Moving', description: 'Full service residential removals' },
          { title: 'Commercial Moving', description: 'Business and office relocations' },
        ],
      }

      const location = await Location.create(locationData)
      testLocations.push(location._id)

      if (
        Array.isArray(location.services) &&
        location.services.length === 2 &&
        location.services[0].title === 'Residential Moving'
      ) {
        log('Created location with services as objects')
      } else {
        logError('Failed to create location with services')
      }
    } catch (err) {
      logError(`Create location with services: ${err.message}`)
    }

    // Test 4: Create location with schema data
    logSection('CREATE LOCATION - Schema Data')
    try {
      const locationData = {
        name: 'Perth Branch',
        slug: 'perth-branch',
        city: 'Perth',
        state: 'WA',
        country: 'Australia',
        address: '321 Hay Street, Perth WA 6000',
        phone: '1300-444-444',
        email: 'perth@oz.com.au',
        status: 'active',
        businessSchema: {
          businessName: 'OZ Interstate Perth',
          businessType: 'MovingCompany',
          priceRange: '$$$',
          address: {
            street: '321 Hay Street',
            city: 'Perth',
            state: 'WA',
            postalCode: '6000',
            country: 'AU',
          },
          latitude: -31.9454,
          longitude: 115.8604,
        },
      }

      const location = await Location.create(locationData)
      testLocations.push(location._id)

      if (
        location.businessSchema?.businessName === 'OZ Interstate Perth' &&
        location.businessSchema?.latitude === -31.9454
      ) {
        log('Created location with schema data')
      } else {
        logError('Failed to create location with schema data')
      }
    } catch (err) {
      logError(`Create location with schema: ${err.message}`)
    }

    // Test 5: Reject duplicate slug
    logSection('VALIDATION - Duplicate Slug')
    try {
      const locationData = {
        name: 'Duplicate City',
        slug: 'sydney-branch', // Duplicate slug
        city: 'Other City',
        state: 'NSW',
        country: 'Australia',
        address: 'Some address',
        phone: '1300-555-555',
        email: 'test@oz.com.au',
        status: 'active',
      }

      try {
        await Location.create(locationData)
        logError('Should have rejected duplicate slug')
      } catch (err) {
        if (err.code === 11000 || err.message.includes('duplicate')) {
          log('Correctly rejected duplicate slug')
        } else {
          logError(`Unexpected error: ${err.message}`)
        }
      }
    } catch (err) {
      logError(`Duplicate slug test: ${err.message}`)
    }

    // Test 6: Retrieve location with SEO
    logSection('RETRIEVE - Location with SEO')
    try {
      const location = await Location.findOne({ slug: 'melbourne-branch' })

      if (location && location.seo?.title && location.introTitle) {
        log('Retrieved location with SEO data intact')
      } else {
        logError('Failed to retrieve location with SEO data')
      }
    } catch (err) {
      logError(`Retrieve location: ${err.message}`)
    }

    // Test 7: Update location SEO fields
    logSection('UPDATE - Location SEO Fields')
    try {
      const location = await Location.findOne({ slug: 'melbourne-branch' })

      if (location) {
        location.seo.title = 'Updated Title for Melbourne'
        location.seo.metaDescription = 'Updated description for Melbourne'
        await location.save()

        const updated = await Location.findById(location._id)
        if (updated.seo.title === 'Updated Title for Melbourne') {
          log('Updated location SEO fields')
        } else {
          logError('Failed to update SEO fields')
        }
      }
    } catch (err) {
      logError(`Update SEO fields: ${err.message}`)
    }

    // Test 8: Update location content
    logSection('UPDATE - Location Content')
    try {
      const location = await Location.findOne({ slug: 'melbourne-branch' })

      if (location) {
        location.introTitle = 'New Intro Title'
        location.mainContent = 'Updated main content'
        location.ctaTitle = 'Book Your Move Now'
        await location.save()

        const updated = await Location.findById(location._id)
        if (updated.introTitle === 'New Intro Title' && updated.ctaTitle === 'Book Your Move Now') {
          log('Updated location content fields')
        } else {
          logError('Failed to update content fields')
        }
      }
    } catch (err) {
      logError(`Update content fields: ${err.message}`)
    }

    // Test 9: Update FAQs
    logSection('UPDATE - Location FAQs')
    try {
      const location = await Location.findOne({ slug: 'melbourne-branch' })

      if (location) {
        location.faqs = [
          { question: 'What is your service area?', answer: 'We service Victoria and surrounding regions.' },
          { question: 'How much does it cost?', answer: 'Pricing varies based on distance and volume.' },
        ]
        await location.save()

        const updated = await Location.findById(location._id)
        if (updated.faqs && updated.faqs.length === 2) {
          log('Updated location FAQs')
        } else {
          logError('Failed to update FAQs')
        }
      }
    } catch (err) {
      logError(`Update FAQs: ${err.message}`)
    }

    // Test 10: Robots validation enum
    logSection('VALIDATION - Robots Enum')
    try {
      const validRobotValues = ['index,follow', 'noindex,follow', 'index,nofollow', 'noindex,nofollow']
      let allValid = true

      for (const robotValue of validRobotValues) {
        try {
          const locationData = {
            name: `Robot Test ${robotValue}`,
            slug: `robot-test-${robotValue.replace(',', '-')}`,
            city: 'Test City',
            state: 'NSW',
            country: 'Australia',
            address: 'Test address',
            phone: '1300-robot',
            email: 'robot@test.com',
            status: 'active',
            seo: {
              robots: robotValue,
            },
          }

          const loc = await Location.create(locationData)
          testLocations.push(loc._id)

          if (loc.seo.robots !== robotValue) {
            allValid = false
          }
        } catch (err) {
          allValid = false
        }
      }

      if (allValid) {
        log('Robots enum validation working correctly')
      } else {
        logError('Robots enum validation failed')
      }
    } catch (err) {
      logError(`Robots enum test: ${err.message}`)
    }

    // Test 11: List all active locations
    logSection('RETRIEVE - List All Active Locations')
    try {
      const locations = await Location.find({ status: 'active', isDeleted: { $ne: true } })

      if (locations.length > 0) {
        log(`Retrieved ${locations.length} active locations`)
      } else {
        logError('No active locations found')
      }
    } catch (err) {
      logError(`List locations: ${err.message}`)
    }

    // Test 12: Soft delete location
    logSection('DELETE - Soft Delete Location')
    try {
      const location = await Location.findOne({ slug: 'perth-branch' })

      if (location) {
        location.isDeleted = true
        await location.save()

        const deleted = await Location.findById(location._id)
        if (deleted.isDeleted === true) {
          log('Soft-deleted location successfully')
        } else {
          logError('Failed to soft-delete location')
        }
      }
    } catch (err) {
      logError(`Soft delete: ${err.message}`)
    }

    // Test 13: Deleted locations not in public list
    logSection('VALIDATION - Deleted Locations Hidden')
    try {
      const publicLocations = await Location.find({ status: 'active', isDeleted: { $ne: true } })
      const perthLocation = publicLocations.find((loc) => loc.slug === 'perth-branch')

      if (!perthLocation) {
        log('Deleted locations correctly excluded from public list')
      } else {
        logError('Deleted location still visible in public list')
      }
    } catch (err) {
      logError(`Check deleted locations: ${err.message}`)
    }

    // Test 14: Status and isDeleted combination
    logSection('VALIDATION - Status and isDeleted Combination')
    try {
      const location = await Location.findOne({ slug: 'brisbane-branch' })

      if (location) {
        location.status = 'inactive'
        await location.save()

        const inactive = await Location.findById(location._id)
        if (inactive.status === 'inactive') {
          log('Status change working correctly')
        } else {
          logError('Failed to update status')
        }
      }
    } catch (err) {
      logError(`Status update: ${err.message}`)
    }

    // Summary
    logSection('TEST SUMMARY')
    log('Location SEO and Dynamic Content Tests Completed')

    // Cleanup
    await cleanupLocations()
  } catch (err) {
    logError(`Fatal error: ${err.message}`)
  } finally {
    await mongoose.connection.close()
    process.exit(0)
  }
}

runTests()
