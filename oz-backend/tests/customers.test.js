import { connectMongo } from '../config/db.js'
import Customer from '../models/Customer.js'

async function run() {
  console.log('Connecting to MongoDB...')
  await connectMongo()

  try {
    // Create
    const unique = Date.now()
    const payload = {
      name: `Test User ${unique}`,
      email: `testuser+${unique}@example.com`,
      phone: `+6112345${String(unique).slice(-6)}`,
      companyName: 'TestCo',
      city: 'Testville',
      status: 'active',
    }

    const created = await new Customer(payload).save()
    console.log('Created customer id=', created._id)

    // Read
    const fetched = await Customer.findById(created._id).lean()
    if (!fetched || fetched.email !== payload.email) throw new Error('Fetch failed or data mismatch')
    console.log('Fetch OK')

    // Update
    const updated = await Customer.findByIdAndUpdate(created._id, { companyName: 'TestCoUpdated' }, { new: true }).lean()
    if (!updated || updated.companyName !== 'TestCoUpdated') throw new Error('Update failed')
    console.log('Update OK')

    // Search
    const searchRes = await Customer.find({ $or: [{ name: /Test User/i }, { email: /testuser\+/i }] }).limit(10).lean()
    if (!Array.isArray(searchRes) || searchRes.length === 0) throw new Error('Search returned no results')
    console.log('Search OK, found', searchRes.length)

    // Pagination
    const page = 1
    const limit = 5
    const total = await Customer.countDocuments({})
    const paged = await Customer.find({}).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean()
    console.log(`Pagination OK total=${total} page=${page} got=${paged.length}`)

    // Soft delete (status -> inactive)
    const del = await Customer.findByIdAndUpdate(created._id, { status: 'inactive' }, { new: true }).lean()
    if (!del || del.status !== 'inactive') throw new Error('Delete (soft) failed')
    console.log('Soft delete OK')

    // Cleanup: remove test document
    await Customer.deleteOne({ _id: created._id })
    console.log('Cleanup done')

    console.log('All customer tests passed.')
    process.exit(0)
  } catch (err) {
    console.error('Customer tests failed:', err)
    process.exit(1)
  }
}

run()
