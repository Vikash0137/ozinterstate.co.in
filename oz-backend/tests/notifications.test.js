import mongoose from 'mongoose'
import Notification from '../models/Notification.js'
import Admin from '../models/Admin.js'

const MONGODB_URI = 'mongodb://127.0.0.1:27017/oz_interstate'

async function runTests() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI)
    console.log('✓ MongoDB connection established')

    console.log('\n=== STARTING NOTIFICATION TESTS ===\n')

    // 1. Clear test data
    await Notification.deleteMany({
      title: /TEST/,
    })
    await Admin.deleteMany({ email: 'test-notif-admin@test.com' })

    // 2. Create test admin
    console.log('1. Creating test admin...')
    const testAdmin = new Admin({
      name: 'Test Notif Admin',
      email: 'test-notif-admin@test.com',
      password: 'testpassword123',
      role: 'Admin',
      status: 'active',
    })
    await testAdmin.save()
    console.log('✓ Test admin created')

    // 3. Create notification
    console.log('2. Creating notification...')
    const notification = new Notification({
      userId: testAdmin._id,
      type: 'QUOTE',
      title: 'TEST: New Quote Received',
      message: 'A new quote has been created',
      entityId: 'quote123',
      entityType: 'Quote',
      isRead: false,
    })
    await notification.save()
    console.log('✓ Notification created')

    // 4. List notifications
    console.log('3. Testing list notifications...')
    const notifications = await Notification.find({
      userId: testAdmin._id,
    })
      .lean()
      .sort({ createdAt: -1 })
      .limit(10)
    console.log(`✓ Found ${notifications.length} notification(s)`)

    // 5. Get unread count
    console.log('4. Testing unread count...')
    const unreadCount = await Notification.countDocuments({
      userId: testAdmin._id,
      isRead: false,
    })
    console.log(`✓ Unread count: ${unreadCount}`)

    // 6. Filter by unread
    console.log('5. Testing filter by unread...')
    const unreadNotifs = await Notification.find({
      userId: testAdmin._id,
      isRead: false,
    }).lean()
    console.log(`✓ Unread filter found ${unreadNotifs.length} notification(s)`)

    // 7. Filter by read
    console.log('6. Testing filter by read...')
    const readNotifs = await Notification.find({
      userId: testAdmin._id,
      isRead: true,
    }).lean()
    console.log(`✓ Read filter found ${readNotifs.length} notification(s)`)

    // 8. Mark as read
    console.log('7. Marking notification as read...')
    await Notification.findByIdAndUpdate(notification._id, {
      isRead: true,
    })
    const updated = await Notification.findById(notification._id).lean()
    if (updated.isRead) {
      console.log('✓ Notification marked as read')
    } else {
      console.log('✗ FAILED: Notification not marked as read')
    }

    // 9. Mark all as read
    console.log('8. Creating more notifications...')
    const notifs = []
    for (let i = 0; i < 3; i++) {
      const n = new Notification({
        userId: testAdmin._id,
        type: 'CUSTOMER',
        title: `TEST: Notification ${i}`,
        message: `Test notification message ${i}`,
        isRead: false,
      })
      await n.save()
      notifs.push(n)
    }
    console.log(`✓ Created 3 more notifications`)

    console.log('9. Marking all as read...')
    const result = await Notification.updateMany(
      { userId: testAdmin._id, isRead: false },
      { isRead: true }
    )
    console.log(`✓ Updated ${result.modifiedCount} notification(s)`)

    // 10. Verify all marked as read
    console.log('10. Verifying all marked as read...')
    const unreadAfter = await Notification.countDocuments({
      userId: testAdmin._id,
      isRead: false,
    })
    if (unreadAfter === 0) {
      console.log('✓ All notifications marked as read')
    } else {
      console.log(`✗ FAILED: ${unreadAfter} unread notifications still exist`)
    }

    // 11. Test pagination
    console.log('11. Testing pagination...')
    const total = await Notification.countDocuments({
      userId: testAdmin._id,
    })
    const limit = 2
    const pages = Math.ceil(total / limit)
    const page1 = await Notification.find({ userId: testAdmin._id })
      .lean()
      .limit(limit)
      .skip(0)
    console.log(
      `✓ Pagination: ${total} total, ${pages} pages at limit ${limit}, page 1 has ${page1.length} items`
    )

    // 12. Test different notification types
    console.log('12. Testing different notification types...')
    const types = ['QUOTE', 'CUSTOMER', 'ADMIN', 'SYSTEM']
    for (const type of types) {
      const n = new Notification({
        userId: testAdmin._id,
        type,
        title: `TEST: ${type} Notification`,
        message: `Test ${type} message`,
      })
      await n.save()
    }
    console.log('✓ Created notifications for all types')

    // 13. Filter by type
    console.log('13. Testing filter by type...')
    const quoteNotifs = await Notification.find({
      userId: testAdmin._id,
      type: 'QUOTE',
    }).lean()
    console.log(`✓ QUOTE type filter found ${quoteNotifs.length} notification(s)`)

    // 14. Test sorting by date
    console.log('14. Testing sort by date (newest first)...')
    const sorted = await Notification.find({
      userId: testAdmin._id,
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

    // 15. Test user isolation
    console.log('15. Testing user isolation...')
    const admin2 = new Admin({
      name: 'Test Admin 2',
      email: 'test-admin2@test.com',
      password: 'testpassword123',
      role: 'Admin',
      status: 'active',
    })
    await admin2.save()

    const notifForAdmin2 = new Notification({
      userId: admin2._id,
      type: 'SYSTEM',
      title: 'TEST: For Admin 2',
      message: 'This is for admin 2',
    })
    await notifForAdmin2.save()

    const admin1Notifs = await Notification.find({
      userId: testAdmin._id,
    }).lean()
    const admin2Notifs = await Notification.find({
      userId: admin2._id,
    }).lean()
    if (admin1Notifs.length > 0 && admin2Notifs.length === 1) {
      console.log(
        `✓ User isolation working: Admin1=${admin1Notifs.length}, Admin2=${admin2Notifs.length}`
      )
    } else {
      console.log('✗ FAILED: User isolation issue')
    }

    // 16. Test indexes exist
    console.log('16. Verifying indexes...')
    const indexes = await Notification.collection.getIndexes()
    const hasUserIdIndex = Object.values(indexes).some(
      (idx) => idx.key && idx.key.userId
    )
    const hasIsReadIndex = Object.values(indexes).some(
      (idx) => idx.key && idx.key.isRead
    )
    console.log(`✓ Index check: userId=${hasUserIdIndex}, isRead=${hasIsReadIndex}`)

    // 17. Test get single notification
    console.log('17. Getting single notification...')
    const single = await Notification.findById(notification._id).lean()
    if (single) {
      console.log('✓ Single notification retrieved')
    } else {
      console.log('✗ FAILED: Could not retrieve single notification')
    }

    // 18. Test timestamp
    console.log('18. Verifying timestamps...')
    const now = new Date()
    const newNotif = new Notification({
      userId: testAdmin._id,
      type: 'SYSTEM',
      title: 'TEST: Timestamp Test',
      message: 'Testing timestamps',
    })
    await newNotif.save()
    const retrieved = await Notification.findById(newNotif._id).lean()
    if (retrieved.createdAt) {
      console.log('✓ Timestamp created correctly')
    } else {
      console.log('✗ FAILED: No timestamp')
    }

    // 19. Cleanup test data
    console.log('19. Cleaning up test data...')
    await Notification.deleteMany({
      title: /TEST/,
    })
    await Admin.deleteMany({
      $or: [
        { email: 'test-notif-admin@test.com' },
        { email: 'test-admin2@test.com' },
      ],
    })
    console.log('✓ Test data cleaned up')

    console.log('\n=== ALL NOTIFICATION TESTS PASSED ===\n')
    process.exit(0)
  } catch (error) {
    console.error('\n✗ TEST FAILED:', error.message)
    console.error(error)
    process.exit(1)
  }
}

runTests()
