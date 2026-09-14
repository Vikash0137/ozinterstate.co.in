import mongoose from 'mongoose'

const inquiryResponseSchema = new mongoose.Schema(
  {
    numeric_id: { type: Number, default: 1 },
    form_id: { type: Number, default: 1 },
    response_data: { type: mongoose.Schema.Types.Mixed, required: true },
    status: { type: String, enum: ['new', 'contacted', 'completed', 'spam'], default: 'new' },
  },
  { timestamps: { createdAt: 'created_at' } }
)

inquiryResponseSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret.numeric_id || ret._id
    return ret
  },
})

export default mongoose.models.InquiryResponse || mongoose.model('InquiryResponse', inquiryResponseSchema)
