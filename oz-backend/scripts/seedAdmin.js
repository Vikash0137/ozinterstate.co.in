import dotenv from 'dotenv'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import Admin from '../models/Admin.js'
import { connectMongo } from '../config/db.js'

dotenv.config()

const ADMIN_NAME = process.env.ADMIN_NAME
const ADMIN_EMAIL = process.env.ADMIN_EMAIL
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

async function run() {
  if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error('ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment.')
    process.exit(1)
  }

  try {
    await connectMongo()

    // Ensure mongoose connection ready
    if (mongoose.connection.readyState !== 1) {
      console.error('MongoDB is not connected. Aborting seeding.')
      process.exit(1)
    }

    const email = String(ADMIN_EMAIL).toLowerCase()
    let admin = await Admin.findOne({ email }).select('+password')

    if (admin) {
      console.log('Admin user already exists:', email)
      process.exit(0)
    }

    admin = new Admin({ name: ADMIN_NAME, email, password: ADMIN_PASSWORD, role: 'Super Admin', status: 'active' })
    await admin.save()
    console.log('Seeded Super Admin user:', email)
    process.exit(0)
  } catch (err) {
    console.error('Failed to seed admin user:', err)
    process.exit(1)
  }
}

run()
