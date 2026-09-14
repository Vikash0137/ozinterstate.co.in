import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import Banner from '../models/Banner.js'
import InquiryForm from '../models/InquiryForm.js'
import InquiryField from '../models/InquiryField.js'
import InquiryResponse from '../models/InquiryResponse.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const backendRoot = path.join(__dirname, '..')

const readJson = async (fileName, fallback) => {
  try {
    return JSON.parse(await fs.readFile(path.join(backendRoot, fileName), 'utf8'))
  } catch {
    return fallback
  }
}

export const migrateLegacyStorage = async () => {
  const banners = await readJson('banners.json', [])
  for (const banner of Array.isArray(banners) ? banners : []) {
    const { id, _id, created_at, updated_at, ...data } = banner
    await Banner.updateOne(
      { numeric_id: Number(id) },
      { $setOnInsert: { ...data, numeric_id: Number(id) } },
      { upsert: true },
    )
  }

  const inquiries = await readJson('inquiries.json', {})
  if (inquiries.form) {
    const { id, _id, created_at, updated_at, ...data } = inquiries.form
    await InquiryForm.updateOne(
      { numeric_id: Number(id || 1) },
      { $setOnInsert: { ...data, numeric_id: Number(id || 1) } },
      { upsert: true },
    )
  }

  for (const field of Array.isArray(inquiries.fields) ? inquiries.fields : []) {
    const { id, _id, created_at, updated_at, ...data } = field
    await InquiryField.updateOne(
      { numeric_id: Number(id) },
      { $setOnInsert: { ...data, numeric_id: Number(id) } },
      { upsert: true },
    )
  }

  for (const response of Array.isArray(inquiries.responses) ? inquiries.responses : []) {
    const { id, _id, created_at, updated_at, ...data } = response
    await InquiryResponse.updateOne(
      { numeric_id: Number(id) },
      { $setOnInsert: { ...data, numeric_id: Number(id) } },
      { upsert: true },
    )
  }

  console.log('Legacy banner and inquiry data migrated to MongoDB.')
}
