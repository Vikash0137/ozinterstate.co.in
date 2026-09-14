import mongoose from 'mongoose'

const aboutSchema = new mongoose.Schema(
  {
    numeric_id: { type: Number, default: 1 },
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    description: { type: String, default: '' },
    experience_years: { type: Number, default: 10 },
    completed_moves: { type: Number, default: 5000 },
    happy_customers: { type: Number, default: 1200 },
    image_1: { type: String, default: '' },
    image_2: { type: String, default: '' },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
)

aboutSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret.numeric_id || ret._id
    return ret
  },
})

export default mongoose.models.About || mongoose.model('About', aboutSchema)
