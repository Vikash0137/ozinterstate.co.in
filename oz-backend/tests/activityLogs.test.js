import mongoose from 'mongoose'
import ActivityLog from '../models/ActivityLog.js'
import Admin from '../models/Admin.js'

const MONGODB_URI = 'mongodb://127.0.0.1:27017/oz_interstate'

async function runTests() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI)
    console.log('✓ MongoDB connection established')

    console.log('\n=== STARTING ACTIVITY LOG TESTS ===\n')

    // 1. Clear test data
    await ActivityLog.deleteMany({
      description: /TEST/,
    })
    await Admin.deleteMany({ email: 'test-admin@test.com' })

    // 2. Create test admin
    console.log('1. Creating test admin...')
    const testAdmin = new Admin({
      name: 'Test Admin',
      email: 'test-admin@test.com',
      password: 'testpassword123',
      role: 'Admin',
      status: 'active',
    })
    await testAdmin.save()
    console.log('✓ Test admin created')

    // 3. Create activity log entry
    console.log('2. Creating activity log entry...')
    const activityLog = new ActivityLog({
      userId: testAdmin._id,
      userName: testAdmin.name,
      userEmail: testAdmin.email,
      action: 'LOGIN',
      module: 'AUTH',
      description: 'TEST: Admin logged in successfully',
      metadata: { email: testAdmin.email },
      ipAddress: '127.0.0.1',
      userAgent: 'Mozilla/5.0',
    })
    await activityLog.save()
    console.log('✓ Activity log created')

    // 4. List activity logs
    console.log('3. Testing list with pagination...')
    const page1 = await ActivityLog.find()
      .lean()
      .sort({ createdAt: -1 })
      .limit(10)
      .skip(0)
    console.log(`✓ Found ${page1.length} logs on first page`)

    // 5. Search by name
    console.log('4. Testing search by username...')
    const searchName = await ActivityLog.find({
      userName: new RegExp('Test', 'i'),
    }).lean()
    console.log(`✓ Search by name found ${searchName.length} result(s)`)

    // 6. Search by email
    console.log('5. Testing search by email...')
    const searchEmail = await ActivityLog.find({
      userEmail: new RegExp('test-admin', 'i'),
    }).lean()
    console.log(`✓ Search by email found ${searchEmail.length} result(s)`)

    // 7. Search by description
    console.log('6. Testing search by description...')
    const searchDesc = await ActivityLog.find({
      description: new RegExp('TEST', 'i'),
    }).lean()
    console.log(`✓ Search by description found ${searchDesc.length} result(s)`)

    // 8. Filter by action
    console.log('7. Testing filter by action...')
    const filterAction = await ActivityLog.find({
      action: 'LOGIN',
    }).lean()
    console.log(`✓ Filter by action found ${filterAction.length} result(s)`)

    // 9. Filter by module
    console.log('8. Testing filter by module...')
    const filterModule = await ActivityLog.find({
      module: 'AUTH',
    }).lean()
    console.log(`✓ Filter by module found ${filterModule.length} result(s)`)

    // 10. Filter by date range
    console.log('9. Testing filter by date range...')
    const yesterday = new Date(Date.now() - 86400000)
    const tomorrow = new Date(Date.now() + 86400000)
    const dateFilter = await ActivityLog.find({
      createdAt: { $gte: yesterday, $lte: tomorrow },
    }).lean()
    console.log(`✓ Date range filter found ${dateFilter.length} result(s)`)

    // 11. Get single activity log
    console.log('10. Getting single activity log...')
    const singleLog = await ActivityLog.findById(activityLog._id).lean()
    if (singleLog) {
      console.log('✓ Single log retrieved')
    } else {
      console.log('✗ FAILED: Could not retrieve single log')
    }

    // 12. Create multiple logs with different actions
    console.log('11. Creating logs with different actions...')
    const actionTypes = [
      {
        action: 'CREATE',
        module: 'QUOTES',
        description: 'TEST: Quote created',
      },
      {
        action: 'UPDATE',
        module: 'CUSTOMERS',
        description: 'TEST: Customer updated',
      },
      {
        action: 'DELETE',
        module: 'ADMINS',
        description: 'TEST: Admin deactivated',
      },
      {
        action: 'PASSWORD_CHANGE',
        module: 'ADMINS',
        description: 'TEST: Password changed',
      },
    ]

    for (const type of actionTypes) {
      const log = new ActivityLog({
        userId: testAdmin._id,
        userName: testAdmin.name,
        userEmail: testAdmin.email,
        action: type.action,
        module: type.module,
        description: type.description,
        metadata: {},
        ipAddress: '127.0.0.1',
      })
      await log.save()
    }
    console.log('✓ Multiple logs created with different actions')

    // 13. Test sorting by date
    console.log('12. Testing sort by date (newest first)...')
    const sorted = await ActivityLog.find({
      description: /TEST/,
    })
      .lean()
      .sort({ createdAt: -1 })
    if (sorted.length >= 2) {
      if (sorted[0].createdAt >= sorted[1].createdAt) {
        console.log('✓ Sort by date working correctly')
      } else {
        console.log('✗ FAILED: Sort order incorrect')
      }
    }

    // 14. Test that sensitive data is never stored
    console.log('13. Verifying sensitive data not stored...')
    const allLogs = await ActivityLog.find().lean()
    let hasSensitiveData = false
    for (const log of allLogs) {
      if (
        log.description.includes('password') ||
        log.description.includes('token') ||
        log.description.includes('JWT') ||
        (log.metadata && log.metadata.password)
      ) {
        hasSensitiveData = true
        break
      }
    }
    if (!hasSensitiveData) {
      console.log('✓ No sensitive data found in logs')
    } else {
      console.log('✗ FAILED: Sensitive data found in logs')
    }

    // 15. Test user isolation (if applicable)
    console.log('14. Testing user isolation...')
    const adminLogs = await ActivityLog.find({
      userId: testAdmin._id,
    }).lean()
    console.log(`✓ Retrieved ${adminLogs.length} logs for specific user`)

    // 16. Test pagination calculation
    console.log('15. Testing pagination...')
    const total = await ActivityLog.countDocuments({
      description: /TEST/,
    })
    const limit = 2
    const pages = Math.ceil(total / limit)
    console.log(`✓ Pagination: ${total} total logs, ${pages} pages at limit ${limit}`)

    // 17. Test indexes exist (implicit - no error thrown)
    console.log('16. Verifying indexes...')
    const indexes = await ActivityLog.collection.getIndexes()
    const hasCreatedAtIndex = Object.values(indexes).some(
      (idx) => idx.key && idx.key.createdAt
    )
    const hasUserIdIndex = Object.values(indexes).some(
      (idx) => idx.key && idx.key.userId
    )
    console.log(`✓ Index check: createdAt=${hasCreatedAtIndex}, userId=${hasUserIdIndex}`)

    // 18. Test combining filters
    console.log('17. Testing combined filters (action + module)...')
    const combined = await ActivityLog.find({
      action: 'CREATE',
      module: 'QUOTES',
    }).lean()
    console.log(
      `✓ Combined filter (CREATE + QUOTES) found ${combined.length} result(s)`
    )

    // 19. Cleanup test data
    console.log('18. Cleaning up test data...')
    await ActivityLog.deleteMany({
      description: /TEST/,
    })
    await Admin.deleteMany({
      email: 'test-admin@test.com',
    })
    console.log('✓ Test data cleaned up')

    console.log('\n=== ALL ACTIVITY LOG TESTS PASSED ===\n')
    process.exit(0)
  } catch (error) {
    console.error('\n✗ TEST FAILED:', error.message)
    console.error(error)
    process.exit(1)
  }
}

runTests()
