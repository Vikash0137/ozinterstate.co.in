import mongoose from 'mongoose'

const inquiryFormSchema = new mongoose.Schema(
  {
    numeric_id: { type: Number, default: 1 },
    title: { type: String, default: 'Get Your Moving Quote' },
    subtitle: { type: String, default: 'FREE ESTIMATE' },
    description: { type: String, default: 'Fill the form and our team will contact you shortly.' },
    button_text: { type: String, default: 'Submit Quote Request' },
    success_message: { type: String, default: 'Thank you! Your quote request has been submitted successfully. Our team will contact you shortly.' },
    error_message: { type: String, default: 'Oops! Unable to submit quote. Please check your details and try again.' },
    email_notification: { type: Number, default: 1 },
    admin_email: { type: String, default: 'admin@ozinterstate.com' },
    auto_reply: { type: Number, default: 1 },
    auto_reply_message: { type: String, default: 'Thank you for requesting a quote with OZ Interstate Movers. We have received your request and will call you shortly.' },
    redirect_url: { type: String, default: '' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
)

inquiryFormSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret.numeric_id || ret._id
    return ret
  },
})

export default mongoose.models.InquiryForm || mongoose.model('InquiryForm', inquiryFormSchema)
