import { connectMongo } from '../config/db.js'
import Quote from '../models/Quote.js'
import Customer from '../models/Customer.js'

console.log('Starting Dashboard Tests...\n')

let testResults = {
  passed: 0,
  failed: 0,
  errors: [],
}

const testCase = (name, fn) => {
  return fn()
    .then(() => {
      console.log(`✓ ${name}`)
      testResults.passed++
    })
    .catch((err) => {
      console.error(`✗ ${name}`)
      console.error(`  Error: ${err.message}`)
      testResults.failed++
      testResults.errors.push({ test: name, error: err.message })
    })
}

const runTests = async () => {
  try {
    await connectMongo()
    console.log('Connected to MongoDB\n')

    // Clean up test data
    await Quote.deleteMany({ customerEmail: { $regex: 'dashboard-test' } }).catch(() => {})
    await Customer.deleteMany({ email: { $regex: 'dashboard-test' } }).catch(() => {})

    // Create test customers
    const customer1 = await Customer.create({
      name: 'Test Customer 1',
      email: 'customer1-dashboard-test@example.com',
      phone: '1234567890',
      companyName: 'Test Company 1',
      status: 'active',
    })

    const customer2 = await Customer.create({
      name: 'Test Customer 2',
      email: 'customer2-dashboard-test@example.com',
      phone: '0987654321',
      companyName: 'Test Company 2',
      status: 'inactive',
    })

    // Create test quotes with different statuses
    const quote1 = await Quote.create({
      customerName: customer1.name,
      customerEmail: customer1.email,
      customerPhone: customer1.phone,
      movingFrom: { address: '123 Main St', suburb: 'Sydney', state: 'NSW', postcode: '2000' },
      movingTo: { address: '456 Oak Ave', suburb: 'Melbourne', state: 'VIC', postcode: '3000' },
      movingDate: new Date(),
      propertyType: 'House',
      serviceType: 'Interstate Moving',
      status: 'NEW',
      basePrice: 5000,
      totalAmount: 5500,
      customerId: customer1._id,
    })

    const quote2 = await Quote.create({
      customerName: customer1.name,
      customerEmail: customer1.email,
      customerPhone: customer1.phone,
      movingFrom: { address: '123 Main St', suburb: 'Sydney', state: 'NSW', postcode: '2000' },
      movingTo: { address: '789 Pine Rd', suburb: 'Brisbane', state: 'QLD', postcode: '4000' },
      movingDate: new Date(),
      propertyType: 'Apartment',
      serviceType: 'Residential Moving',
      status: 'QUOTED',
      basePrice: 3500,
      totalAmount: 3900,
      customerId: customer1._id,
    })

    const quote3 = await Quote.create({
      customerName: customer2.name,
      customerEmail: customer2.email,
      customerPhone: customer2.phone,
      movingFrom: { address: '999 Smith Way', suburb: 'Adelaide', state: 'SA', postcode: '5000' },
      movingTo: { address: '101 Green Dr', suburb: 'Perth', state: 'WA', postcode: '6000' },
      movingDate: new Date(),
      propertyType: 'Office',
      serviceType: 'Commercial Moving',
      status: 'CONVERTED',
      basePrice: 8000,
      totalAmount: 9200,
      customerId: customer2._id,
    })

    const quote4 = await Quote.create({
      customerName: 'External Customer',
      customerEmail: 'external-dashboard-test@example.com',
      customerPhone: '5555555555',
      movingFrom: { address: 'External Addr', suburb: 'Hobart', state: 'TAS', postcode: '7000' },
      movingTo: { address: 'External Addr 2', suburb: 'Darwin', state: 'NT', postcode: '0800' },
      movingDate: new Date(),
      propertyType: 'House',
      serviceType: 'Interstate Moving',
      status: 'REJECTED',
      basePrice: 4000,
      totalAmount: 0,
    })

    console.log('Test data created\n')

    // Test 1: Count total quotes
    await testCase('Count total quotes', async () => {
      const total = await Quote.countDocuments({})
      if (total < 4) throw new Error(`Expected at least 4 quotes, got ${total}`)
    })

    // Test 2: Count quotes by status
    await testCase('Count quotes by status', async () => {
      const newCount = await Quote.countDocuments({ status: 'NEW' })
      const quotedCount = await Quote.countDocuments({ status: 'QUOTED' })
      const convertedCount = await Quote.countDocuments({ status: 'CONVERTED' })
      const rejectedCount = await Quote.countDocuments({ status: 'REJECTED' })

      if (newCount < 1) throw new Error('Expected at least 1 NEW quote')
      if (quotedCount < 1) throw new Error('Expected at least 1 QUOTED quote')
      if (convertedCount < 1) throw new Error('Expected at least 1 CONVERTED quote')
      if (rejectedCount < 1) throw new Error('Expected at least 1 REJECTED quote')
    })

    // Test 3: Count total customers
    await testCase('Count total customers', async () => {
      const total = await Customer.countDocuments({})
      if (total < 2) throw new Error(`Expected at least 2 customers, got ${total}`)
    })

    // Test 4: Count customers by status
    await testCase('Count customers by status', async () => {
      const activeCount = await Customer.countDocuments({ status: 'active' })
      const inactiveCount = await Customer.countDocuments({ status: 'inactive' })

      if (activeCount < 1) throw new Error('Expected at least 1 active customer')
      if (inactiveCount < 1) throw new Error('Expected at least 1 inactive customer')
    })

    // Test 5: Fetch recent quotes
    await testCase('Fetch recent quotes with populate', async () => {
      const quotes = await Quote.find({})
        .populate('customerId', 'name email phone companyName')
        .select('quoteNumber customerName status totalAmount serviceType createdAt customerId')
        .sort({ createdAt: -1 })
        .limit(10)

      if (quotes.length < 4) throw new Error(`Expected at least 4 quotes, got ${quotes.length}`)
      const quote = quotes[0]
      if (!quote.quoteNumber) throw new Error('Quote missing quoteNumber')
      if (!quote.status) throw new Error('Quote missing status')
      if (quote.customerId && !quote.customerId.name) throw new Error('Populated customer missing name')
    })

    // Test 6: Fetch recent customers
    await testCase('Fetch recent customers', async () => {
      const customers = await Customer.find({})
        .select('name email phone companyName status createdAt')
        .sort({ createdAt: -1 })
        .limit(10)

      if (customers.length < 2) throw new Error(`Expected at least 2 customers, got ${customers.length}`)
      const customer = customers[0]
      if (!customer.name) throw new Error('Customer missing name')
      if (!customer.status) throw new Error('Customer missing status')
    })

    // Test 7: Aggregate monthly analytics
    await testCase('Aggregate monthly analytics', async () => {
      const endDate = new Date()
      const startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 11, 1)

      const result = await Quote.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
            },
            total: { $sum: 1 },
            approved: {
              $sum: {
                $cond: [{ $eq: ['$status', 'QUOTED'] }, 1, 0],
              },
            },
            completed: {
              $sum: {
                $cond: [{ $eq: ['$status', 'CONVERTED'] }, 1, 0],
              },
            },
            value: { $sum: { $ifNull: ['$totalAmount', 0] } },
          },
        },
        {
          $sort: {
            '_id.year': 1,
            '_id.month': 1,
          },
        },
      ])

      if (!Array.isArray(result)) throw new Error('Expected array result from aggregation')
      if (result.length < 1) throw new Error('Expected at least 1 month of data')

      const month = result[0]
      if (!month._id) throw new Error('Month group missing _id')
      if (typeof month.total !== 'number') throw new Error('Month group missing total count')
      if (typeof month.value !== 'number') throw new Error('Month group missing value sum')
    })

    // Test 8: Aggregate customer growth
    await testCase('Aggregate customer growth', async () => {
      const endDate = new Date()
      const startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 11, 1)

      const result = await Customer.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
            },
            customers: { $sum: 1 },
          },
        },
        {
          $sort: {
            '_id.year': 1,
            '_id.month': 1,
          },
        },
      ])

      if (!Array.isArray(result)) throw new Error('Expected array result from aggregation')
      if (result.length < 1) throw new Error('Expected at least 1 month of data')

      const month = result[0]
      if (typeof month.customers !== 'number') throw new Error('Month group missing customers count')
    })

    // Test 9: Aggregate top customers
    await testCase('Aggregate top customers by quote activity', async () => {
      const result = await Quote.aggregate([
        {
          $match: {
            customerId: { $ne: null },
          },
        },
        {
          $group: {
            _id: '$customerId',
            quoteCount: { $sum: 1 },
            totalValue: { $sum: { $ifNull: ['$totalAmount', 0] } },
            customerName: { $first: '$customerName' },
          },
        },
        {
          $lookup: {
            from: 'customers',
            localField: '_id',
            foreignField: '_id',
            as: 'customerInfo',
          },
        },
        {
          $unwind: {
            path: '$customerInfo',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            customerId: '$_id',
            name: { $ifNull: ['$customerInfo.name', '$customerName'] },
            companyName: { $ifNull: ['$customerInfo.companyName', ''] },
            quoteCount: 1,
            totalValue: 1,
          },
        },
        {
          $sort: { quoteCount: -1 },
        },
        {
          $limit: 10,
        },
      ])

      if (!Array.isArray(result)) throw new Error('Expected array result from aggregation')
      if (result.length < 1) throw new Error('Expected at least 1 top customer')

      const topCustomer = result[0]
      if (!topCustomer.name) throw new Error('Top customer missing name')
      if (typeof topCustomer.quoteCount !== 'number') throw new Error('Top customer missing quoteCount')
      if (typeof topCustomer.totalValue !== 'number') throw new Error('Top customer missing totalValue')
    })

    // Test 10: Aggregate quote value analytics
    await testCase('Aggregate quote value analytics', async () => {
      const result = await Quote.aggregate([
        {
          $group: {
            _id: null,
            totalValue: { $sum: { $ifNull: ['$totalAmount', 0] } },
            approvedValue: {
              $sum: {
                $cond: [
                  { $eq: ['$status', 'QUOTED'] },
                  { $ifNull: ['$totalAmount', 0] },
                  0,
                ],
              },
            },
            completedValue: {
              $sum: {
                $cond: [
                  { $eq: ['$status', 'CONVERTED'] },
                  { $ifNull: ['$totalAmount', 0] },
                  0,
                ],
              },
            },
          },
        },
      ])

      if (!Array.isArray(result) || result.length === 0) throw new Error('Expected aggregation result')

      const data = result[0]
      if (typeof data.totalValue !== 'number') throw new Error('Result missing totalValue')
      if (typeof data.approvedValue !== 'number') throw new Error('Result missing approvedValue')
      if (typeof data.completedValue !== 'number') throw new Error('Result missing completedValue')

      // Verify values
      if (data.totalValue < 3900) throw new Error(`Expected total value >= 3900, got ${data.totalValue}`)
      if (data.approvedValue < 3900) throw new Error(`Expected approved value >= 3900, got ${data.approvedValue}`)
      if (data.completedValue < 9200) throw new Error(`Expected completed value >= 9200, got ${data.completedValue}`)
    })

    // Cleanup
    await Quote.deleteMany({ customerEmail: { $regex: 'dashboard-test' } })
    await Customer.deleteMany({ email: { $regex: 'dashboard-test' } })

    console.log('\nCleanup completed')
  } catch (err) {
    console.error('Test setup error:', err)
    testResults.failed++
    testResults.errors.push({ test: 'Setup', error: err.message })
  } finally {
    console.log(`\n\nTest Results: ${testResults.passed} passed, ${testResults.failed} failed`)

    if (testResults.failed > 0) {
      console.log('\nFailed Tests:')
      testResults.errors.forEach((e) => {
        console.log(`  - ${e.test}: ${e.error}`)
      })
      process.exit(1)
    } else {
      console.log('All dashboard tests passed!')
      process.exit(0)
    }
  }
}

runTests()
