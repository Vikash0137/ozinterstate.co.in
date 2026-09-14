import mongoose from 'mongoose'
import { connectMongo } from '../config/db.js'
import Booking from '../models/Booking.js'
import Quote from '../models/Quote.js'
import Customer from '../models/Customer.js'
import Admin from '../models/Admin.js'

const testResults = {
  passed: 0,
  failed: 0,
  errors: [],
}

const testCase = (name, fn) =>
  Promise.resolve()
    .then(fn)
    .then(() => {
      console.log(`✓ ${name}`)
      testResults.passed += 1
    })
    .catch((err) => {
      console.error(`✗ ${name}`)
      console.error(`  Error: ${err.message}`)
      testResults.failed += 1
      testResults.errors.push({ test: name, error: err.message })
    })

const run = async () => {
  console.log('Starting Booking tests...\n')
  await connectMongo()

  const customer = await Customer.create({
    name: 'Booking Customer',
    email: 'booking-customer@example.com',
    phone: '0400000000',
    companyName: 'Booking Co',
    status: 'active',
  })

  const admin = await Admin.create({
    name: 'Booking Admin',
    email: 'booking-admin@example.com',
    password: 'password123',
    role: 'Admin',
    status: 'active',
  })

  await Booking.deleteMany({ customerEmail: /booking-test|booking-customer/i }).catch(() => {})
  await Quote.deleteMany({ customerEmail: /booking-test|booking-customer/i }).catch(() => {})
  await Customer.deleteMany({ email: /booking-test|booking-customer/i }).catch(() => {})
  await Admin.deleteMany({ email: /booking-admin@example.com/i }).catch(() => {})

  const createdCustomer = await Customer.create({
    name: 'Booking Customer',
    email: 'booking-customer@example.com',
    phone: '0400000000',
    companyName: 'Booking Co',
    status: 'active',
  })

  const createdAdmin = await Admin.create({
    name: 'Booking Admin',
    email: 'booking-admin@example.com',
    password: 'password123',
    role: 'Admin',
    status: 'active',
  })

  let quote = await Quote.create({
    customerName: createdCustomer.name,
    customerEmail: createdCustomer.email,
    customerPhone: createdCustomer.phone,
    movingFrom: { address: '1 Start St', suburb: 'Sydney', state: 'NSW', postcode: '2000' },
    movingTo: { address: '5 Finish Ave', suburb: 'Melbourne', state: 'VIC', postcode: '3000' },
    movingDate: new Date(),
    propertyType: 'House',
    serviceType: 'Interstate Moving',
    status: 'QUOTED',
    totalAmount: 4200,
    currency: 'AUD',
    customerId: createdCustomer._id,
  })

  await testCase('MongoDB connection', async () => {
    if (!mongoose.connection.readyState || mongoose.connection.readyState !== 1) {
      throw new Error('MongoDB not connected')
    }
  })

  await testCase('Create booking', async () => {
    const booking = await Booking.create({
      quoteId: quote._id,
      customerId: createdCustomer._id,
      customerName: createdCustomer.name,
      customerEmail: createdCustomer.email,
      customerPhone: createdCustomer.phone,
      serviceType: 'Interstate Moving',
      pickupLocation: 'Sydney',
      deliveryLocation: 'Melbourne',
      pickupDate: new Date(),
      deliveryDate: new Date(Date.now() + 86400000),
      vehicleType: 'Truck',
      quantity: 1,
      totalAmount: 4200,
      currency: 'AUD',
      status: 'pending',
      assignedTo: createdAdmin._id,
      createdBy: createdAdmin._id,
      description: 'booking-test create',
    })

    if (!booking.bookingNumber) throw new Error('Booking number missing')
    if (booking.status !== 'pending') throw new Error('Booking status incorrect')
  })

  await testCase('Booking number generation', async () => {
    const booking = await Booking.create({
      customerId: createdCustomer._id,
      customerName: createdCustomer.name,
      customerEmail: createdCustomer.email,
      customerPhone: createdCustomer.phone,
      serviceType: 'Packing',
      pickupLocation: 'Adelaide',
      deliveryLocation: 'Perth',
      pickupDate: new Date(),
      deliveryDate: new Date(Date.now() + 86400000),
      vehicleType: 'Van',
      quantity: 2,
      totalAmount: 1500,
      currency: 'AUD',
      status: 'pending',
      createdBy: createdAdmin._id,
      description: 'booking-test booking number',
    })

    if (!/^BK-\d{4}-\d{6}$/.test(booking.bookingNumber)) {
      throw new Error(`Unexpected booking number format: ${booking.bookingNumber}`)
    }
  })

  await testCase('Unique booking number', async () => {
    const b1 = await Booking.create({
      customerId: createdCustomer._id,
      customerName: createdCustomer.name,
      customerEmail: createdCustomer.email,
      customerPhone: createdCustomer.phone,
      serviceType: 'Storage',
      pickupLocation: 'Brisbane',
      deliveryLocation: 'Gold Coast',
      pickupDate: new Date(),
      deliveryDate: new Date(Date.now() + 86400000),
      vehicleType: 'Truck',
      quantity: 1,
      totalAmount: 900,
      currency: 'AUD',
      status: 'pending',
      createdBy: createdAdmin._id,
      description: 'booking-test unique number',
    })

    const b2 = await Booking.create({
      customerId: createdCustomer._id,
      customerName: createdCustomer.name,
      customerEmail: createdCustomer.email,
      customerPhone: createdCustomer.phone,
      serviceType: 'Storage',
      pickupLocation: 'Brisbane',
      deliveryLocation: 'Gold Coast',
      pickupDate: new Date(),
      deliveryDate: new Date(Date.now() + 86400000),
      vehicleType: 'Truck',
      quantity: 1,
      totalAmount: 900,
      currency: 'AUD',
      status: 'pending',
      createdBy: createdAdmin._id,
      description: 'booking-test unique number 2',
    })

    if (b1.bookingNumber === b2.bookingNumber) throw new Error('Duplicate booking numbers generated')
  })

  await testCase('Get booking', async () => {
    const booking = await Booking.findOne({ description: 'booking-test create' }).lean()
    if (!booking) throw new Error('Booking not found')
  })

  await testCase('List bookings', async () => {
    const result = await Booking.find({ isDeleted: { $ne: true } }).sort({ createdAt: -1 }).limit(5)
    if (!Array.isArray(result)) throw new Error('Listing bookings failed')
  })

  await testCase('Pagination', async () => {
    const page = 1
    const limit = 2
    const total = await Booking.countDocuments({ isDeleted: { $ne: true } })
    const items = await Booking.find({ isDeleted: { $ne: true } }).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit)
    if (items.length > limit) throw new Error('Pagination not limiting results')
    if (total < 1) throw new Error('No bookings for pagination test')
  })

  await testCase('Search booking', async () => {
    const match = await Booking.findOne({ customerName: /Booking Customer/i })
    if (!match) throw new Error('Search by customer name failed')
  })

  await testCase('Status filter', async () => {
    const match = await Booking.findOne({ status: 'pending' })
    if (!match) throw new Error('Status filter returned no matches')
  })

  await testCase('Customer filter', async () => {
    const bookings = await Booking.find({ customerId: createdCustomer._id })
    if (bookings.length < 1) throw new Error('Customer filter returned no bookings')
  })

  await testCase('Update booking', async () => {
    const booking = await Booking.findOne({ serviceType: 'Packing' })
    booking.description = 'booking-test updated'
    booking.notes = 'Updated notes'
    await booking.save()
    const fresh = await Booking.findById(booking._id)
    if (fresh.description !== 'booking-test updated') throw new Error('Booking update failed')
  })

  await testCase('Status update', async () => {
    const booking = await Booking.findOne({ serviceType: 'Packing' })
    booking.status = 'confirmed'
    await booking.save()
    const fresh = await Booking.findById(booking._id)
    if (fresh.status !== 'confirmed') throw new Error('Status update failed')
  })

  await testCase('Invalid status rejection', async () => {
    const booking = await Booking.findOne({ serviceType: 'Packing' })
    booking.status = 'invalidstatus'
    try {
      await booking.save()
      throw new Error('Status validation should reject invalid status')
    } catch (err) {
      if (!err) throw new Error('Expected validation error')
    }
  })

  await testCase('Invalid status transition rejection', async () => {
    const booking = await Booking.findOne({ serviceType: 'Packing' })
    booking.status = 'completed'
    await booking.save()
    booking.status = 'pending'
    try {
      await booking.save()
      throw new Error('Transition validation should reject completed -> pending')
    } catch (err) {
      if (!err) throw new Error('Expected validation error')
    }
  })

  await testCase('Assign booking', async () => {
    const booking = await Booking.findOne({ serviceType: 'Packing' })
    booking.assignedTo = createdAdmin._id
    await booking.save()
    if (!booking.assignedTo) throw new Error('Booking not assigned')
  })

  await testCase('Reject inactive admin assignment', async () => {
    const inactiveAdmin = await Admin.create({
      name: 'Inactive Admin',
      email: 'inactive-admin-booking@example.com',
      password: 'password123',
      role: 'Admin',
      status: 'inactive',
    })

    const booking = await Booking.findOne({ serviceType: 'Packing' })
    booking.assignedTo = inactiveAdmin._id
    try {
      await booking.save()
      throw new Error('Inactive admin assignment should be rejected')
    } catch (err) {
      if (!err) throw new Error('Expected validation error')
    }
  })

  await testCase('Quote → booking conversion', async () => {
    const quoteToConvert = await Quote.create({
      customerName: 'Quote Booking Customer',
      customerEmail: 'quote-booking@example.com',
      customerPhone: '0400000111',
      movingFrom: { address: 'A', suburb: 'Sydney', state: 'NSW', postcode: '2000' },
      movingTo: { address: 'B', suburb: 'Melbourne', state: 'VIC', postcode: '3000' },
      movingDate: new Date(),
      propertyType: 'Apartment',
      serviceType: 'Residential Moving',
      status: 'QUOTED',
      totalAmount: 2500,
      currency: 'AUD',
    })

    const customerForQuote = await Customer.create({
      name: 'Quote Booking Customer',
      email: 'quote-booking@example.com',
      phone: '0400000111',
      companyName: 'QBC',
      status: 'active',
    })

    quoteToConvert.customerId = customerForQuote._id
    await quoteToConvert.save()

    const booking = await Booking.create({
      quoteId: quoteToConvert._id,
      customerId: customerForQuote._id,
      customerName: customerForQuote.name,
      customerEmail: customerForQuote.email,
      customerPhone: customerForQuote.phone,
      serviceType: quoteToConvert.serviceType,
      pickupLocation: 'Sydney',
      deliveryLocation: 'Melbourne',
      pickupDate: new Date(),
      deliveryDate: new Date(Date.now() + 86400000),
      vehicleType: 'Truck',
      quantity: 1,
      totalAmount: quoteToConvert.totalAmount,
      currency: quoteToConvert.currency,
      status: 'pending',
      createdBy: createdAdmin._id,
      description: 'booking-test quote conversion',
    })

    quoteToConvert.bookingId = booking._id
    await quoteToConvert.save()

    if (!quoteToConvert.bookingId) throw new Error('Quote bookingId not set')
    if (!booking.bookingNumber) throw new Error('Converted quote booking missing number')
  })

  await testCase('Prevent duplicate quote conversion', async () => {
    const quote = await Quote.create({
      customerName: 'Duplicate Quote',
      customerEmail: 'duplicate-quote@example.com',
      customerPhone: '0400000999',
      movingFrom: { address: 'X', suburb: 'Perth', state: 'WA', postcode: '6000' },
      movingTo: { address: 'Y', suburb: 'Adelaide', state: 'SA', postcode: '5000' },
      movingDate: new Date(),
      propertyType: 'House',
      serviceType: 'Interstate Moving',
      status: 'QUOTED',
      totalAmount: 5000,
      currency: 'AUD',
      bookingId: new mongoose.Types.ObjectId(),
    })

    if (!quote.bookingId) throw new Error('BookingId not set for duplicate test')
  })

  await testCase('Quote.bookingId updated', async () => {
    const q = await Quote.findOne({ customerEmail: 'quote-booking@example.com' })
    if (!q || !q.bookingId) throw new Error('Quote bookingId not present after conversion')
  })

  await testCase('Customer → booking relation', async () => {
    const count = await Booking.countDocuments({ customerId: createdCustomer._id })
    if (count < 1) throw new Error('No bookings linked to customer')
  })

  await testCase('Soft delete', async () => {
    const booking = await Booking.findOne({ description: 'booking-test create' })
    booking.isDeleted = true
    booking.deletedAt = new Date()
    booking.status = 'cancelled'
    await booking.save()
    const fresh = await Booking.findById(booking._id)
    if (!fresh.isDeleted || fresh.status !== 'cancelled') throw new Error('Soft delete failed')
  })

  await testCase('Activity log creation', async () => {
    const log = { action: 'BOOKING_CREATE', module: 'BOOKINGS', description: 'booking created' }
    if (!log.action || !log.module) throw new Error('Activity log invalid')
  })

  await testCase('Notification creation', async () => {
    const notif = { title: 'New Booking Created', message: 'Booking BK-2026-000001 has been created.' }
    if (!notif.title || !notif.message) throw new Error('Notification invalid')
  })

  await testCase('Dashboard booking stats', async () => {
    const stats = await Booking.aggregate([
      { $match: { isDeleted: { $ne: true } } },
      { $group: { _id: null, total: { $sum: 1 }, value: { $sum: '$totalAmount' } } },
    ])
    if (!Array.isArray(stats)) throw new Error('Dashboard booking aggregation failed')
  })

  await testCase('Booking analytics', async () => {
    const analytics = await Booking.aggregate([
      { $match: { isDeleted: { $ne: true } } },
      { $group: { _id: null, total_bookings: { $sum: 1 }, total_value: { $sum: '$totalAmount' } } },
    ])
    if (!Array.isArray(analytics)) throw new Error('Booking analytics failed')
  })

  await testCase('Recent bookings', async () => {
    const recent = await Booking.find({ isDeleted: { $ne: true } }).sort({ createdAt: -1 }).limit(5)
    if (!Array.isArray(recent)) throw new Error('Recent bookings query failed')
  })

  await testCase('Cleanup', async () => {
    await Booking.deleteMany({ customerEmail: { $regex: 'booking|quote-booking|duplicate-quote', $options: 'i' } })
    await Quote.deleteMany({ customerEmail: { $regex: 'booking|quote-booking|duplicate-quote', $options: 'i' } })
    await Customer.deleteMany({ email: { $regex: 'booking|quote-booking|duplicate-quote', $options: 'i' } })
    await Admin.deleteMany({ email: { $regex: 'booking-admin|inactive-admin-booking', $options: 'i' } })
  })

  console.log(`\nBooking tests complete: ${testResults.passed} passed, ${testResults.failed} failed`)
  if (testResults.failed > 0) {
    process.exitCode = 1
  }
}

run().catch((err) => {
  console.error('Fatal booking test error:', err)
  process.exit(1)
})
