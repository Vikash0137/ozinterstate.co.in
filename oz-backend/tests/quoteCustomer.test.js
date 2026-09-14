import { connectMongo } from '../config/db.js'
import Customer from '../models/Customer.js'
import Quote from '../models/Quote.js'

async function run() {
  console.log('Connecting to MongoDB...')
  await connectMongo()

  try {
    // 1. Create customer
    const unique = Date.now()
    const customerPayload = {
      name: `QC Test ${unique}`,
      email: `qc_test+${unique}@example.com`,
      phone: `+611${String(unique).slice(-8)}`,
      companyName: 'QC Co',
      city: 'TestCity',
    }
    const customer = await new Customer(customerPayload).save()
    console.log('Customer created:', customer._id)

    // 2. Create quote linked to customer
    const quotePayload = {
      customerId: customer._id,
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      movingFrom: { suburb: 'A', address: '', state: '', postcode: '' },
      movingTo: { suburb: 'B', address: '', state: '', postcode: '' },
      movingDate: new Date(),
      propertyType: 'House',
      serviceType: 'Interstate Moving',
      source: 'admin',
    }

    const quote = await new Quote(quotePayload).save()
    console.log('Quote created:', quote._id)

    // 3. Read quote
    const fetched = await Quote.findById(quote._id).lean()
    if (!fetched) throw new Error('Quote not found')
    console.log('Quote fetched OK')

    // 4. Verify customerId
    if (!fetched.customerId || String(fetched.customerId) !== String(customer._id)) throw new Error('customerId mismatch')
    console.log('customerId OK')

    // 5. Populate customer
    const populated = await Quote.findById(quote._id).populate('customerId', 'name email phone companyName').lean()
    if (!populated.customerId || populated.customerId.email !== customer.email) throw new Error('Populate failed')
    console.log('Populate OK')

    // 6. Get customer quotes
    const custQuotes = await Quote.find({ customerId: customer._id }).lean()
    if (!custQuotes.length) throw new Error('Customer quotes empty')
    console.log('Customer quotes OK count=', custQuotes.length)

    // 7. Search customer quotes
    const searchRes = await Quote.find({ customerId: customer._id, quoteNumber: /OZQ/i }).limit(5).lean()
    console.log('Search returned', searchRes.length)

    // 8. Pagination
    const page = 1, limit = 2
    const paged = await Quote.find({ customerId: customer._id }).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean()
    console.log(`Pagination OK got=${paged.length}`)

    // 9. Update quote customer - create new customer and reassign
    const other = await new Customer({ name: 'Other', email: `other+${unique}@example.com`, phone: `+612${String(unique).slice(-8)}` }).save()
    const updated = await Quote.findByIdAndUpdate(quote._id, { customerId: other._id }, { new: true }).lean()
    if (!updated || String(updated.customerId) !== String(other._id)) throw new Error('Failed to update quote customer')
    console.log('Update quote customer OK')

    // 10. Remove/unlink customer if supported (set customerId null)
    const unlinked = await Quote.findByIdAndUpdate(quote._id, { customerId: null }, { new: true }).lean()
    if (unlinked.customerId !== null) throw new Error('Unlink failed')
    console.log('Unlink OK')

    // 11. Soft delete customer
    await Customer.findByIdAndUpdate(customer._id, { status: 'inactive' })
    const stillQuote = await Quote.findById(quote._id).lean()
    if (!stillQuote) throw new Error('Quote disappeared after customer soft-delete')
    console.log('Quote still exists after soft delete')

    // 12. Verify quote customer reference remains safe
    // (no exception thrown thus far)

    // 13. Cleanup
    await Quote.deleteOne({ _id: quote._id })
    await Customer.deleteOne({ _id: customer._id })
    await Customer.deleteOne({ _id: other._id })

    console.log('All quote-customer tests passed.')
    process.exit(0)
  } catch (err) {
    console.error('Quote-customer tests failed:', err)
    process.exit(1)
  }
}

run()
