import mongoose from 'mongoose'

const inquiryFieldSchema = new mongoose.Schema(
  {
    numeric_id: { type: Number, default: 1 },
    form_id: { type: Number, default: 1 },
    label: { type: String, required: true },
    placeholder: { type: String, default: '' },
    field_name: { type: String, required: true },
    field_type: { type: String, default: 'text' },
    required: { type: Number, default: 0 },
    read_only: { type: Number, default: 0 },
    width: { type: String, default: '100%' },
    options: { type: [String], default: [] },
    default_value: { type: String, default: '' },
    help_text: { type: String, default: '' },
    validation: { type: String, default: '' },
    error_message: { type: String, default: '' },
    css_class: { type: String, default: '' },
    icon: { type: String, default: 'FileText' },
    sort_order: { type: Number, default: 1 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
)

inquiryFieldSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret.numeric_id || ret._id
    return ret
  },
})

export default mongoose.models.InquiryField || mongoose.model('InquiryField', inquiryFieldSchema)
