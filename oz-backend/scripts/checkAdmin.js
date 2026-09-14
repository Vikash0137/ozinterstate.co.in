import dotenv from 'dotenv'
import mongoose from 'mongoose'
import Admin from '../models/Admin.js'
import { connectMongo } from '../config/db.js'

dotenv.config()

async function run() {
  try {
    await connectMongo()
    if (mongoose.connection.readyState !== 1) {
      console.error('MongoDB not connected.');
      process.exit(1)
    }

    const email = (process.env.ADMIN_EMAIL || 'admin@ozinterstate.com').toLowerCase()
    const admin = await Admin.findOne({ email }).select('+password')
    if (!admin) {
      console.error('Admin not found:', email)
      process.exit(2)
    }

    console.log('Admin found:')
    console.log('  id:', admin.id || admin._id)
    console.log('  name:', admin.name)
    console.log('  email:', admin.email)
    console.log('  role:', admin.role)
    console.log('  status:', admin.status)
    console.log('  password present:', admin.password ? 'YES' : 'NO')
    if (admin.password) {
      console.log('  password looks like bcrypt:', /^\$2[aby]\$/.test(admin.password))
    }

    process.exit(0)
  } catch (err) {
    console.error('Error checking admin:', err)
    process.exit(3)
  }
}

run()
