import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Upload,
  Crop,
  Trash2,
  Save,
  Loader2,
  Type,
  Sliders,
  Sparkles,
  Eye,
  Check,
  AlertCircle,
  Video as VideoIcon,
  Image as ImageIcon,
  Play,
  Pause,
  Film,
  Settings2,
} from 'lucide-react'
import toast from 'react-hot-toast'
import bannerService from '../../services/bannerService'
import ImageCropModal from '../../components/banners/ImageCropModal'
import './Banners.css'

const fontOptions = [
  'Inter',
  'Roboto',
  'Outfit',
  'Montserrat',
  'Poppins',
  'Playfair Display',
  'Open Sans',
  'Plus Jakarta Sans',
  'Lato',
  'System-UI',
]

const fontSizeOptions = ['24px', '32px', '40px', '48px', '56px', '64px', '72px']
const descFontSizeOptions = ['14px', '16px', '18px', '20px', '22px']
const btnFontSizeOptions = ['12px', '14px', '16px', '18px']
const fontWeightOptions = ['300', '400', '500', '600', '700', '800', '900']

export default function BannerFormPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditMode = Boolean(id)

  const [activeTab, setActiveTab] = useState('details')
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Image Upload & Crop State
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [croppedImage, setCroppedImage] = useState('')
  const [removeImage, setRemoveImage] = useState(false)
  const [showCropModal, setShowCropModal] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [imageError, setImageError] = useState('')

  const fileInputRef = useRef(null)

  // Video Upload & Preview State
  const [videoFile, setVideoFile] = useState(null)
  const [videoPreview, setVideoPreview] = useState('')
  const [removeVideo, setRemoveVideo] = useState(false)
  const [videoError, setVideoError] = useState('')
  const [isVideoDragOver, setIsVideoDragOver] = useState(false)
  const [isPlayingPreview, setIsPlayingPreview] = useState(false)

  const videoInputRef = useRef(null)
  const previewVideoRef = useRef(null)

  // Form State
  const [formData, setFormData] = useState({
    media_type: 'image', // 'image' or 'video'
    title: '',
    subtitle: '',
    description: '',
    button_text: 'Our Services',
    button_link: '/services',
    video_url: '',
    video_thumbnail: '',
    autoplay: true,
    muted: true,
    loop: true,
    controls: false,
    preload: 'auto',
    object_fit: 'cover',
    overlay_opacity: '0.7',
    overlay_color: '#000000',
    font_family: 'Inter',
    title_font_size: '48px',
    title_font_weight: '800',
    title_font_style: 'normal',
    title_color: '#ffffff',
    title_letter_spacing: '0px',
    title_line_height: '1.1',
    title_text_transform: 'none',
    description_font_family: 'Inter',
    description_font_size: '16px',
    description_font_weight: '400',
    description_font_style: 'normal',
    description_color: '#ffffff',
    description_letter_spacing: '0px',
    description_line_height: '1.6',
    description_text_alignment: 'left',
    button_font_family: 'Inter',
    button_font_size: '14px',
    button_font_weight: '700',
    button_text_color: '#ffffff',
    button_background_color: '#0284c7',
    button_hover_color: '#0369a1',
    button_hover_text_color: '#ffffff',
    button_border_radius: '12px',
    button_border_color: 'transparent',
    text_alignment: 'left',
    display_order: 1,
    status: 'active',
  })

  useEffect(() => {
    if (isEditMode) {
      fetchBannerDetails()
    }
  }, [id])

  const fetchBannerDetails = async () => {
    try {
      setLoading(true)
      const res = await bannerService.getBannerById(id)
      if (res.success && res.data) {
        const b = res.data
        setFormData({
          media_type: b.media_type || 'image',
          title: b.title || '',
          subtitle: b.subtitle || '',
          description: b.description || '',
          button_text: b.button_text || '',
          button_link: b.button_link || '',
          video_url: b.video_url || '',
          video_thumbnail: b.video_thumbnail || '',
          autoplay: b.autoplay !== undefined ? Boolean(b.autoplay) : true,
          muted: b.muted !== undefined ? Boolean(b.muted) : true,
          loop: b.loop !== undefined ? Boolean(b.loop) : true,
          controls: b.controls !== undefined ? Boolean(b.controls) : false,
          preload: b.preload || 'auto',
          object_fit: b.object_fit || 'cover',
          overlay_opacity: b.overlay_opacity !== undefined ? String(b.overlay_opacity) : '0.7',
          overlay_color: b.overlay_color || '#000000',
          font_family: b.font_family || 'Inter',
          title_font_size: b.title_font_size || '48px',
          title_font_weight: b.title_font_weight || '800',
          title_font_style: b.title_font_style || 'normal',
          title_color: b.title_color || '#ffffff',
          title_letter_spacing: b.title_letter_spacing || '0px',
          title_line_height: b.title_line_height || '1.1',
          title_text_transform: b.title_text_transform || 'none',
          description_font_family: b.description_font_family || 'Inter',
          description_font_size: b.description_font_size || '16px',
          description_font_weight: b.description_font_weight || '400',
          description_font_style: b.description_font_style || 'normal',
          description_color: b.description_color || '#ffffff',
          description_letter_spacing: b.description_letter_spacing || '0px',
          description_line_height: b.description_line_height || '1.6',
          description_text_alignment: b.description_text_alignment || 'left',
          button_font_family: b.button_font_family || 'Inter',
          button_font_size: b.button_font_size || '14px',
          button_font_weight: b.button_font_weight || '700',
          button_text_color: b.button_text_color || '#ffffff',
          button_background_color: b.button_background_color || '#0284c7',
          button_hover_color: b.button_hover_color || '#0369a1',
          button_hover_text_color: b.button_hover_text_color || '#ffffff',
          button_border_radius: b.button_border_radius || '12px',
          button_border_color: b.button_border_color || 'transparent',
          text_alignment: b.text_alignment || 'left',
          display_order: b.display_order || 1,
          status: b.status || 'active',
        })

        const apiHost = import.meta.env.VITE_API_BASE_URL || '/ozinterstate/api'

        if (b.image) {
          const imgUrl = b.image.startsWith('http') || b.image.startsWith('data:')
            ? b.image
            : `${apiHost}${b.image}`
          setImagePreview(imgUrl)
        }

        if (b.video_url) {
          const vidUrl = b.video_url.startsWith('http') || b.video_url.startsWith('data:')
            ? b.video_url
            : `${apiHost}${b.video_url}`
          setVideoPreview(vidUrl)
        }
      }
    } catch (err) {
      console.error('Error fetching banner details:', err)
      toast.error('Failed to load banner details.')
    } finally {
      setLoading(false)
    }
  }

  const formatHex = (color) => {
    if (!color) return '#000000'
    if (color === 'transparent') return '#ffffff'
    let hex = color.trim()
    if (!hex.startsWith('#')) return '#000000'
    if (hex.length === 4) {
      return '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3]
    }
    // Pad or truncate to 7 characters
    while (hex.length < 7) hex += '0'
    if (hex.length > 7) hex = hex.substring(0, 7)
    return hex
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'color' ? formatHex(value) : value,
    }))
  }

  // Image Selection & Drag/Drop Handlers
  const validateAndSetFile = (file) => {
    setImageError('')
    if (!file) return

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setImageError('Only JPG, PNG, and WEBP files are allowed.')
      toast.error('Invalid image type. Please use JPG, PNG, or WEBP.')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setImageError('File size exceeds 5MB limit.')
      toast.error('Image size must be less than 5MB.')
      return
    }

    setImageFile(file)
    setRemoveImage(false)
    setCroppedImage('')

    const reader = new FileReader()
    reader.onload = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleFileDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0])
    }
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview('')
    setCroppedImage('')
    setRemoveImage(true)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleCropComplete = (croppedBase64) => {
    setCroppedImage(croppedBase64)
    setImagePreview(croppedBase64)
    setShowCropModal(false)
    toast.success('Image cropped successfully.')
  }

  // Video Selection & Drag/Drop Handlers
  const validateAndSetVideoFile = (file) => {
    setVideoError('')
    if (!file) return

    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg']
    const ext = file.name.split('.').pop().toLowerCase()
    const allowedExts = ['mp4', 'webm', 'ogg']

    if (!allowedTypes.includes(file.type) && !allowedExts.includes(ext)) {
      setVideoError('Unsupported video format. Please upload MP4, WebM, or OGG video.')
      toast.error('Invalid video format. Supported: MP4, WebM, OGG.')
      return
    }

    if (file.size > 100 * 1024 * 1024) {
      setVideoError('Video file size exceeds 100MB maximum limit.')
      toast.error('Video size must be under 100MB.')
      return
    }

    setVideoFile(file)
    setRemoveVideo(false)

    const objectUrl = URL.createObjectURL(file)
    setVideoPreview(objectUrl)
    toast.success('Video loaded for preview.')
  }

  const handleVideoDrop = (e) => {
    e.preventDefault()
    setIsVideoDragOver(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetVideoFile(e.dataTransfer.files[0])
    }
  }

  const handleRemoveVideo = () => {
    setVideoFile(null)
    setVideoPreview('')
    setRemoveVideo(true)
    setIsPlayingPreview(false)
    if (videoInputRef.current) videoInputRef.current.value = ''
  }

  const togglePlayPausePreview = () => {
    if (!previewVideoRef.current) return
    if (previewVideoRef.current.paused) {
      previewVideoRef.current.play()
      setIsPlayingPreview(true)
    } else {
      previewVideoRef.current.pause()
      setIsPlayingPreview(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      toast.error('Banner Title is required.')
      return
    }

    if (formData.media_type === 'video' && !videoPreview && !videoFile) {
      toast.error('Please upload a video file for Video Banner.')
      return
    }

    try {
      setSubmitting(true)
      const dataToSend = { ...formData }

      if (imageFile) {
        dataToSend.imageFile = imageFile
      }
      if (videoFile) {
        dataToSend.videoFile = videoFile
      }
      if (croppedImage) {
        dataToSend.cropped_image = croppedImage
      }
      if (removeImage) {
        dataToSend.remove_image = true
      }
      if (removeVideo) {
        dataToSend.remove_video = true
      }

      if (isEditMode) {
        const res = await bannerService.updateBanner(id, dataToSend)
        if (res.success) {
          toast.success('Banner updated successfully!')
          navigate('/banners')
        } else {
          throw new Error(res.message || 'Banner update failed.')
        }
      } else {
        const res = await bannerService.createBanner(dataToSend)
        if (res.success) {
          toast.success('Banner created successfully!')
          navigate('/banners')
        } else {
          throw new Error(res.message || 'Banner creation failed.')
        }
      }
    } catch (err) {
      console.error('Error saving banner:', err)
      toast.error(err.message || 'Failed to save banner. Please check required fields.')
    } finally {
      setSubmitting(false)
    }
  }

  const [btnHover, setBtnHover] = useState(false)

  // Calculate overlay RGBA
  const getOverlayStyle = () => {
    const hex = formData.overlay_color || '#000000'
    const opacity = parseFloat(formData.overlay_opacity) || 0.7
    let r = 0, g = 0, b = 0
    if (hex.startsWith('#') && hex.length === 7) {
      r = parseInt(hex.slice(1, 3), 16)
      g = parseInt(hex.slice(3, 5), 16)
      b = parseInt(hex.slice(5, 7), 16)
    }
    return `rgba(${r}, ${g}, ${b}, ${opacity})`
  }

  return (
    <div className="banner-page-container">
      {/* Top Bar */}
      <div className="banner-form-topbar">
        <button
          type="button"
          className="btn-back"
          onClick={() => navigate('/banners')}
        >
          <ArrowLeft size={18} /> Back to Banners
        </button>

        <h2>{isEditMode ? `Edit Banner #${id}` : 'Create New Hero Banner'}</h2>

        <div className="topbar-actions">
          <button
            type="button"
            className="banner-add-button"
            disabled={submitting}
            onClick={handleSubmit}
          >
            {submitting ? (
              <>
                <Loader2 size={18} className="spinner" /> Saving...
              </>
            ) : (
              <>
                <Save size={18} /> Save Banner
              </>
            )}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="banner-loading-state">
          <Loader2 size={32} className="spinner" />
          <p>Loading banner details...</p>
        </div>
      ) : (
        <div className="banner-form-grid">
          {/* Main Form Tabs & Inputs */}
          <div className="banner-form-main-card">
            <div className="form-tabs-header">
              <button
                type="button"
                className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
                onClick={() => setActiveTab('details')}
              >
                <Film size={16} /> Banner Media & Details
              </button>
              <button
                type="button"
                className={`tab-btn ${activeTab === 'title' ? 'active' : ''}`}
                onClick={() => setActiveTab('title')}
              >
                <Type size={16} /> Title Typography
              </button>
              <button
                type="button"
                className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
                onClick={() => setActiveTab('description')}
              >
                <Type size={16} /> Description Styling
              </button>
              <button
                type="button"
                className={`tab-btn ${activeTab === 'button' ? 'active' : ''}`}
                onClick={() => setActiveTab('button')}
              >
                <Sliders size={16} /> Button Customization
              </button>
            </div>

            <form onSubmit={handleSubmit} className="banner-form-body">
              {/* TAB 1: MEDIA TYPE, DETAILS & MEDIA UPLOAD */}
              {activeTab === 'details' && (
                <div className="tab-pane">
                  {/* MEDIA TYPE SELECTOR */}
                  <div className="media-type-selector-card">
                    <label className="section-label">Banner Media Type</label>
                    <p className="section-help">
                      Choose whether this Hero banner displays a static image or a video background.
                    </p>

                    <div className="media-type-options-group">
                      <label
                        className={`media-type-option ${
                          formData.media_type === 'image' ? 'selected' : ''
                        }`}
                      >
                        <input
                          type="radio"
                          name="media_type"
                          value="image"
                          checked={formData.media_type === 'image'}
                          onChange={handleChange}
                        />
                        <ImageIcon size={20} className="option-icon" />
                        <div>
                          <strong>Image Banner</strong>
                          <span>Standard background photo</span>
                        </div>
                      </label>

                      <label
                        className={`media-type-option ${
                          formData.media_type === 'video' ? 'selected' : ''
                        }`}
                      >
                        <input
                          type="radio"
                          name="media_type"
                          value="video"
                          checked={formData.media_type === 'video'}
                          onChange={handleChange}
                        />
                        <VideoIcon size={20} className="option-icon" />
                        <div>
                          <strong>Video Banner</strong>
                          <span>Dynamic background video</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group col-full">
                      <label className="required">Banner Title</label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g. Logistics Excellence: Beyond Boundaries"
                        required
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group col-half">
                      <label>Banner Subtitle (Optional Badge)</label>
                      <input
                        type="text"
                        name="subtitle"
                        value={formData.subtitle}
                        onChange={handleChange}
                        placeholder="e.g. Logistic Transportation"
                        className="form-input"
                      />
                    </div>

                    <div className="form-group col-quarter">
                      <label>Display Order</label>
                      <input
                        type="number"
                        name="display_order"
                        value={formData.display_order}
                        onChange={handleChange}
                        min="1"
                        className="form-input"
                      />
                    </div>

                    <div className="form-group col-quarter">
                      <label>Status</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={(e) =>
                          setFormData({ ...formData, status: e.target.value })
                        }
                        className="form-select"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group col-full">
                      <label>Banner Description</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Enter moving / logistic service description text..."
                        className="form-textarea"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group col-half">
                      <label>Button Text</label>
                      <input
                        type="text"
                        name="button_text"
                        value={formData.button_text}
                        onChange={handleChange}
                        placeholder="e.g. Our Services"
                        className="form-input"
                      />
                    </div>

                    <div className="form-group col-half">
                      <label>Button Target Link</label>
                      <input
                        type="text"
                        name="button_link"
                        value={formData.button_link}
                        onChange={handleChange}
                        placeholder="e.g. /services"
                        className="form-input"
                      />
                    </div>
                  </div>

                  {/* CONDITIONAL MEDIA UPLOADER */}

                  {/* IF MEDIA TYPE = IMAGE */}
                  {formData.media_type === 'image' && (
                    <div className="image-upload-section">
                      <label className="section-label">Banner Image Upload</label>
                      <p className="section-help">
                        Accepts JPG, PNG, WEBP files up to 5MB. You can drag and drop or crop before saving.
                      </p>

                      <div
                        className={`drag-drop-zone ${isDragOver ? 'drag-over' : ''}`}
                        onDragOver={(e) => {
                          e.preventDefault()
                          setIsDragOver(true)
                        }}
                        onDragLeave={() => setIsDragOver(false)}
                        onDrop={handleFileDrop}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          style={{ display: 'none' }}
                          onChange={(e) =>
                            e.target.files && validateAndSetFile(e.target.files[0])
                          }
                        />

                        <div className="drop-zone-content">
                          <Upload size={32} className="upload-icon" />
                          <p className="drop-title">
                            <strong>Click to upload</strong> or drag and drop image here
                          </p>
                          <span className="drop-subtitle">
                            Supported formats: JPG, PNG, WEBP (Max 5MB)
                          </span>
                        </div>
                      </div>

                      {imageError && (
                        <p className="image-error-text">
                          <AlertCircle size={14} /> {imageError}
                        </p>
                      )}

                      {imagePreview && (
                        <div className="image-preview-card">
                          <img src={imagePreview} alt="Banner preview" />

                          <div className="preview-card-actions">
                            <button
                              type="button"
                              className="btn-crop"
                              onClick={() => setShowCropModal(true)}
                            >
                              <Crop size={15} /> Crop Image
                            </button>

                            <button
                              type="button"
                              className="btn-replace"
                              onClick={() => fileInputRef.current?.click()}
                            >
                              <Upload size={15} /> Replace
                            </button>

                            <button
                              type="button"
                              className="btn-delete"
                              onClick={handleRemoveImage}
                            >
                              <Trash2 size={15} /> Remove
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* IF MEDIA TYPE = VIDEO */}
                  {formData.media_type === 'video' && (
                    <div className="video-upload-section">
                      <label className="section-label">Hero Background Video Upload</label>
                      <p className="section-help">
                        Upload background video for Hero banner. Supports MP4, WebM, and OGG formats up to 100MB.
                      </p>

                      <div
                        className={`drag-drop-zone video-drop-zone ${
                          isVideoDragOver ? 'drag-over' : ''
                        }`}
                        onDragOver={(e) => {
                          e.preventDefault()
                          setIsVideoDragOver(true)
                        }}
                        onDragLeave={() => setIsVideoDragOver(false)}
                        onDrop={handleVideoDrop}
                        onClick={() => videoInputRef.current?.click()}
                      >
                        <input
                          ref={videoInputRef}
                          type="file"
                          accept="video/mp4,video/webm,video/ogg"
                          style={{ display: 'none' }}
                          onChange={(e) =>
                            e.target.files && validateAndSetVideoFile(e.target.files[0])
                          }
                        />

                        <div className="drop-zone-content">
                          <VideoIcon size={36} className="upload-icon video-icon-pulse" />
                          <p className="drop-title">
                            <strong>Click to upload video</strong> or drag and drop MP4 / WebM / OGG video here
                          </p>
                          <span className="drop-subtitle">
                            Supported formats: MP4, WebM, OGG (Max 100MB)
                          </span>
                        </div>
                      </div>

                      {videoError && (
                        <p className="image-error-text">
                          <AlertCircle size={14} /> {videoError}
                        </p>
                      )}

                      {videoPreview && (
                        <div className="video-preview-card">
                          <video
                            ref={previewVideoRef}
                            src={videoPreview}
                            className="video-player-element"
                            autoPlay={formData.autoplay}
                            muted={formData.muted}
                            loop={formData.loop}
                            controls={formData.controls}
                            style={{ objectFit: formData.object_fit }}
                          />

                          <div className="preview-card-actions">
                            <button
                              type="button"
                              className="btn-play-pause"
                              onClick={togglePlayPausePreview}
                            >
                              {isPlayingPreview ? (
                                <><Pause size={15} /> Pause Video</>
                              ) : (
                                <><Play size={15} /> Play Video</>
                              )}
                            </button>

                            <button
                              type="button"
                              className="btn-replace"
                              onClick={() => videoInputRef.current?.click()}
                            >
                              <Upload size={15} /> Replace Video
                            </button>

                            <button
                              type="button"
                              className="btn-delete"
                              onClick={handleRemoveVideo}
                            >
                              <Trash2 size={15} /> Remove Video
                            </button>
                          </div>
                        </div>
                      )}

                      {/* VIDEO CONFIGURATION SETTINGS */}
                      <div className="video-settings-card">
                        <div className="settings-header">
                          <Settings2 size={16} />
                          <h4>Video Playback & Overlay Settings</h4>
                        </div>

                        <div className="video-toggles-grid">
                          <label className="checkbox-toggle-card">
                            <input
                              type="checkbox"
                              name="autoplay"
                              checked={formData.autoplay}
                              onChange={handleChange}
                            />
                            <div>
                              <strong>Autoplay</strong>
                              <span>Automatically start video on load</span>
                            </div>
                          </label>

                          <label className="checkbox-toggle-card">
                            <input
                              type="checkbox"
                              name="muted"
                              checked={formData.muted}
                              onChange={handleChange}
                            />
                            <div>
                              <strong>Muted</strong>
                              <span>Mute audio (Required for autoplay)</span>
                            </div>
                          </label>

                          <label className="checkbox-toggle-card">
                            <input
                              type="checkbox"
                              name="loop"
                              checked={formData.loop}
                              onChange={handleChange}
                            />
                            <div>
                              <strong>Loop Video</strong>
                              <span>Continuously repeat playback</span>
                            </div>
                          </label>

                          <label className="checkbox-toggle-card">
                            <input
                              type="checkbox"
                              name="controls"
                              checked={formData.controls}
                              onChange={handleChange}
                            />
                            <div>
                              <strong>Show Controls</strong>
                              <span>Display video play/pause bar</span>
                            </div>
                          </label>
                        </div>

                        <div className="form-row mt-4">
                          <div className="form-group col-quarter">
                            <label>Preload</label>
                            <select
                              name="preload"
                              value={formData.preload}
                              onChange={handleChange}
                              className="form-select"
                            >
                              <option value="auto">Auto</option>
                              <option value="metadata">Metadata</option>
                              <option value="none">None</option>
                            </select>
                          </div>

                          <div className="form-group col-quarter">
                            <label>Object Fit</label>
                            <select
                              name="object_fit"
                              value={formData.object_fit}
                              onChange={handleChange}
                              className="form-select"
                            >
                              <option value="cover">Cover (Fill screen)</option>
                              <option value="contain">Contain (Fit aspect ratio)</option>
                            </select>
                          </div>

                          <div className="form-group col-quarter">
                            <label>Overlay Opacity</label>
                            <input
                              type="range"
                              name="overlay_opacity"
                              min="0"
                              max="1"
                              step="0.05"
                              value={formData.overlay_opacity}
                              onChange={handleChange}
                              className="range-input"
                            />
                            <span className="text-xs text-muted text-center font-mono">
                              {Math.round(parseFloat(formData.overlay_opacity || 0.7) * 100)}%
                            </span>
                          </div>

                          <div className="form-group col-quarter">
                            <label>Overlay Color</label>
                            <div className="color-picker-input">
                              <input
                                type="color"
                                name="overlay_color"
                                value={formatHex(formData.overlay_color)}
                                onChange={handleChange}
                              />
                              <input
                                type="text"
                                name="overlay_color"
                                value={formData.overlay_color}
                                onChange={handleChange}
                                className="form-input text-mono"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: TITLE TYPOGRAPHY */}
              {activeTab === 'title' && (
                <div className="tab-pane">
                  <div className="form-row">
                    <div className="form-group col-half">
                      <label>Font Family</label>
                      <select
                        name="font_family"
                        value={formData.font_family}
                        onChange={handleChange}
                        className="form-select"
                      >
                        {fontOptions.map((f) => (
                          <option key={f} value={f}>
                            {f}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group col-quarter">
                      <label>Font Size</label>
                      <select
                        name="title_font_size"
                        value={formData.title_font_size}
                        onChange={handleChange}
                        className="form-select"
                      >
                        {fontSizeOptions.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group col-quarter">
                      <label>Font Weight</label>
                      <select
                        name="title_font_weight"
                        value={formData.title_font_weight}
                        onChange={handleChange}
                        className="form-select"
                      >
                        {fontWeightOptions.map((w) => (
                          <option key={w} value={w}>
                            {w}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group col-quarter">
                      <label>Font Style</label>
                      <select
                        name="title_font_style"
                        value={formData.title_font_style}
                        onChange={handleChange}
                        className="form-select"
                      >
                        <option value="normal">Normal</option>
                        <option value="italic">Italic</option>
                      </select>
                    </div>

                    <div className="form-group col-quarter">
                      <label>Text Color</label>
                      <div className="color-picker-input">
                        <input
                          type="color"
                          name="title_color"
                          value={formatHex(formData.title_color)}
                          onChange={handleChange}
                        />
                        <input
                          type="text"
                          name="title_color"
                          value={formData.title_color}
                          onChange={handleChange}
                          className="form-input text-mono"
                        />
                      </div>
                    </div>

                    <div className="form-group col-quarter">
                      <label>Letter Spacing</label>
                      <input
                        type="text"
                        name="title_letter_spacing"
                        value={formData.title_letter_spacing}
                        onChange={handleChange}
                        placeholder="e.g. 0px or 1px"
                        className="form-input"
                      />
                    </div>

                    <div className="form-group col-quarter">
                      <label>Line Height</label>
                      <input
                        type="text"
                        name="title_line_height"
                        value={formData.title_line_height}
                        onChange={handleChange}
                        placeholder="e.g. 1.1 or 1.2"
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group col-half">
                      <label>Text Alignment</label>
                      <select
                        name="text_alignment"
                        value={formData.text_alignment}
                        onChange={handleChange}
                        className="form-select"
                      >
                        <option value="left">Left</option>
                        <option value="center">Center</option>
                        <option value="right">Right</option>
                      </select>
                    </div>

                    <div className="form-group col-half">
                      <label>Text Transform</label>
                      <select
                        name="title_text_transform"
                        value={formData.title_text_transform}
                        onChange={handleChange}
                        className="form-select"
                      >
                        <option value="none">None</option>
                        <option value="uppercase">UPPERCASE</option>
                        <option value="lowercase">lowercase</option>
                        <option value="capitalize">Capitalize</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: DESCRIPTION TYPOGRAPHY */}
              {activeTab === 'description' && (
                <div className="tab-pane">
                  <div className="form-row">
                    <div className="form-group col-half">
                      <label>Font Family</label>
                      <select
                        name="description_font_family"
                        value={formData.description_font_family}
                        onChange={handleChange}
                        className="form-select"
                      >
                        {fontOptions.map((f) => (
                          <option key={f} value={f}>
                            {f}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group col-quarter">
                      <label>Font Size</label>
                      <select
                        name="description_font_size"
                        value={formData.description_font_size}
                        onChange={handleChange}
                        className="form-select"
                      >
                        {descFontSizeOptions.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group col-quarter">
                      <label>Font Weight</label>
                      <select
                        name="description_font_weight"
                        value={formData.description_font_weight}
                        onChange={handleChange}
                        className="form-select"
                      >
                        {fontWeightOptions.map((w) => (
                          <option key={w} value={w}>
                            {w}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group col-quarter">
                      <label>Font Style</label>
                      <select
                        name="description_font_style"
                        value={formData.description_font_style}
                        onChange={handleChange}
                        className="form-select"
                      >
                        <option value="normal">Normal</option>
                        <option value="italic">Italic</option>
                      </select>
                    </div>

                    <div className="form-group col-quarter">
                      <label>Text Color</label>
                      <div className="color-picker-input">
                        <input
                          type="color"
                          name="description_color"
                          value={formatHex(formData.description_color)}
                          onChange={handleChange}
                        />
                        <input
                          type="text"
                          name="description_color"
                          value={formData.description_color}
                          onChange={handleChange}
                          className="form-input text-mono"
                        />
                      </div>
                    </div>

                    <div className="form-group col-quarter">
                      <label>Letter Spacing</label>
                      <input
                        type="text"
                        name="description_letter_spacing"
                        value={formData.description_letter_spacing}
                        onChange={handleChange}
                        placeholder="e.g. 0px"
                        className="form-input"
                      />
                    </div>

                    <div className="form-group col-quarter">
                      <label>Line Height</label>
                      <input
                        type="text"
                        name="description_line_height"
                        value={formData.description_line_height}
                        onChange={handleChange}
                        placeholder="e.g. 1.6"
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: BUTTON CUSTOMIZATION */}
              {activeTab === 'button' && (
                <div className="tab-pane">
                  <div className="form-row">
                    <div className="form-group col-half">
                      <label>Font Family</label>
                      <select
                        name="button_font_family"
                        value={formData.button_font_family}
                        onChange={handleChange}
                        className="form-select"
                      >
                        {fontOptions.map((f) => (
                          <option key={f} value={f}>
                            {f}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group col-quarter">
                      <label>Font Size</label>
                      <select
                        name="button_font_size"
                        value={formData.button_font_size}
                        onChange={handleChange}
                        className="form-select"
                      >
                        {btnFontSizeOptions.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group col-quarter">
                      <label>Font Weight</label>
                      <select
                        name="button_font_weight"
                        value={formData.button_font_weight}
                        onChange={handleChange}
                        className="form-select"
                      >
                        {fontWeightOptions.map((w) => (
                          <option key={w} value={w}>
                            {w}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group col-quarter">
                      <label>Text Color</label>
                      <div className="color-picker-input">
                        <input
                          type="color"
                          name="button_text_color"
                          value={formatHex(formData.button_text_color)}
                          onChange={handleChange}
                        />
                        <input
                          type="text"
                          name="button_text_color"
                          value={formData.button_text_color}
                          onChange={handleChange}
                          className="form-input text-mono"
                        />
                      </div>
                    </div>

                    <div className="form-group col-quarter">
                      <label>Background Color</label>
                      <div className="color-picker-input">
                        <input
                          type="color"
                          name="button_background_color"
                          value={formatHex(formData.button_background_color)}
                          onChange={handleChange}
                        />
                        <input
                          type="text"
                          name="button_background_color"
                          value={formData.button_background_color}
                          onChange={handleChange}
                          className="form-input text-mono"
                        />
                      </div>
                    </div>

                    <div className="form-group col-quarter">
                      <label>Hover Background</label>
                      <div className="color-picker-input">
                        <input
                          type="color"
                          name="button_hover_color"
                          value={formatHex(formData.button_hover_color)}
                          onChange={handleChange}
                        />
                        <input
                          type="text"
                          name="button_hover_color"
                          value={formData.button_hover_color}
                          onChange={handleChange}
                          className="form-input text-mono"
                        />
                      </div>
                    </div>

                    <div className="form-group col-quarter">
                      <label>Hover Text Color</label>
                      <div className="color-picker-input">
                        <input
                          type="color"
                          name="button_hover_text_color"
                          value={formatHex(formData.button_hover_text_color)}
                          onChange={handleChange}
                        />
                        <input
                          type="text"
                          name="button_hover_text_color"
                          value={formData.button_hover_text_color}
                          onChange={handleChange}
                          className="form-input text-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group col-half">
                      <label>Border Radius</label>
                      <input
                        type="text"
                        name="button_border_radius"
                        value={formData.button_border_radius}
                        onChange={handleChange}
                        placeholder="e.g. 12px or 50px"
                        className="form-input"
                      />
                    </div>

                    <div className="form-group col-half">
                      <label>Border Color</label>
                      <div className="color-picker-input">
                        <input
                          type="color"
                          name="button_border_color"
                          value={
                            formData.button_border_color === 'transparent'
                              ? '#000000'
                              : formData.button_border_color
                          }
                          onChange={handleChange}
                        />
                        <input
                          type="text"
                          name="button_border_color"
                          value={formData.button_border_color === 'transparent' ? '#ffffff' : formatHex(formData.button_border_color)}
                          onChange={handleChange}
                          className="form-input text-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* LIVE REAL-TIME PREVIEW CARD */}
          <div className="banner-preview-side-card">
            <div className="preview-card-header">
              <Eye size={18} />
              <h3>Live Hero Preview ({formData.media_type === 'video' ? 'Video' : 'Image'})</h3>
            </div>

            <div className="preview-card-body">
              <div
                className="banner-live-preview-container"
                style={{
                  backgroundImage:
                    formData.media_type === 'image' && imagePreview
                      ? `url(${imagePreview})`
                      : undefined,
                  backgroundColor: '#0f172a',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  textAlign: formData.text_alignment || 'left',
                }}
              >
                {/* VIDEO BACKGROUND IF MEDIA TYPE = VIDEO */}
                {formData.media_type === 'video' && videoPreview && (
                  <video
                    src={videoPreview}
                    autoPlay={formData.autoplay}
                    muted={formData.muted}
                    loop={formData.loop}
                    controls={formData.controls}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: formData.object_fit || 'cover',
                      zIndex: 0,
                    }}
                  />
                )}

                {/* OVERLAY WITH CUSTOM OPACITY AND COLOR */}
                <div
                  className="banner-preview-overlay"
                  style={{
                    backgroundColor: getOverlayStyle(),
                    zIndex: 1,
                  }}
                />

                <div className="banner-preview-content">
                  {formData.subtitle && (
                    <span className="banner-preview-subtitle">
                      <Sparkles size={12} /> {formData.subtitle}
                    </span>
                  )}

                  <h1
                    className="banner-preview-title"
                    style={{
                      fontFamily: formData.font_family,
                      fontSize: formData.title_font_size,
                      fontWeight: formData.title_font_weight,
                      fontStyle: formData.title_font_style,
                      color: formData.title_color,
                      letterSpacing: formData.title_letter_spacing,
                      lineHeight: formData.title_line_height,
                      textTransform: formData.title_text_transform,
                    }}
                  >
                    {formData.title || 'Your Banner Title Here'}
                  </h1>

                  {formData.description && (
                    <p
                      className="banner-preview-description"
                      style={{
                        fontFamily: formData.description_font_family,
                        fontSize: formData.description_font_size,
                        fontWeight: formData.description_font_weight,
                        fontStyle: formData.description_font_style,
                        color: formData.description_color,
                        letterSpacing: formData.description_letter_spacing,
                        lineHeight: formData.description_line_height,
                        textAlign: formData.description_text_alignment || formData.text_alignment,
                      }}
                    >
                      {formData.description}
                    </p>
                  )}

                  {formData.button_text && (
                    <div className="banner-preview-btn-row">
                      <button
                        type="button"
                        className="banner-preview-button"
                        onMouseEnter={() => setBtnHover(true)}
                        onMouseLeave={() => setBtnHover(false)}
                        style={{
                          fontFamily: formData.button_font_family,
                          fontSize: formData.button_font_size,
                          fontWeight: formData.button_font_weight,
                          color: btnHover
                            ? formData.button_hover_text_color
                            : formData.button_text_color,
                          backgroundColor: btnHover
                            ? formData.button_hover_color
                            : formData.button_background_color,
                          borderRadius: formData.button_border_radius,
                          borderColor: formData.button_border_color,
                        }}
                      >
                        {formData.button_text}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="preview-info-box">
              <span className="info-label">Live Sync Notice:</span>
              <p>
                Any changes made here will be reflected instantly on the website Hero section after saving.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Image Crop Modal */}
      {showCropModal && imagePreview && (
        <ImageCropModal
          imageUrl={imagePreview}
          onClose={() => setShowCropModal(false)}
          onCropComplete={handleCropComplete}
        />
      )}
    </div>
  )
}
