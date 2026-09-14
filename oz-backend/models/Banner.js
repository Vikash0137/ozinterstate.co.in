import mongoose from 'mongoose'

const bannerSchema = new mongoose.Schema(
  {
    numeric_id: { type: Number, default: 1 },
    media_type: { type: String, enum: ['image', 'video'], default: 'image' },
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    description: { type: String, default: '' },
    button_text: { type: String, default: 'Our Services' },
    button_link: { type: String, default: '/services' },
    image: { type: String, default: '' },
    video_url: { type: String, default: '' },
    video_thumbnail: { type: String, default: '' },
    autoplay: { type: Number, default: 1 },
    muted: { type: Number, default: 1 },
    loop: { type: Number, default: 1 },
    controls: { type: Number, default: 0 },
    preload: { type: String, default: 'auto' },
    object_fit: { type: String, default: 'cover' },
    overlay_opacity: { type: String, default: '0.7' },
    overlay_color: { type: String, default: '#000000' },
    font_family: { type: String, default: 'Inter' },
    title_font_size: { type: String, default: '48px' },
    title_font_weight: { type: String, default: '800' },
    title_font_style: { type: String, default: 'normal' },
    title_color: { type: String, default: '#ffffff' },
    title_letter_spacing: { type: String, default: '0px' },
    title_line_height: { type: String, default: '1.1' },
    title_text_transform: { type: String, default: 'none' },
    description_font_family: { type: String, default: 'Inter' },
    description_font_size: { type: String, default: '16px' },
    description_font_weight: { type: String, default: '400' },
    description_font_style: { type: String, default: 'normal' },
    description_color: { type: String, default: '#ffffff' },
    description_letter_spacing: { type: String, default: '0px' },
    description_line_height: { type: String, default: '1.6' },
    description_text_alignment: { type: String, default: 'left' },
    button_font_family: { type: String, default: 'Inter' },
    button_font_size: { type: String, default: '14px' },
    button_font_weight: { type: String, default: '700' },
    button_text_color: { type: String, default: '#ffffff' },
    button_background_color: { type: String, default: '#0284c7' },
    button_hover_color: { type: String, default: '#0369a1' },
    button_hover_text_color: { type: String, default: '#ffffff' },
    button_border_radius: { type: String, default: '12px' },
    button_border_color: { type: String, default: 'transparent' },
    text_alignment: { type: String, default: 'left' },
    display_order: { type: Number, default: 1 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
)

bannerSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret.numeric_id || ret._id
    return ret
  },
})

export default mongoose.models.Banner || mongoose.model('Banner', bannerSchema)
