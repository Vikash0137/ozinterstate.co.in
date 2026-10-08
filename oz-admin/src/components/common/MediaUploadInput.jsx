import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon, Video as VideoIcon, Loader2, Link2, Check, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import mediaService from '../../services/mediaService'

export default function MediaUploadInput({
  value = '',
  onChange,
  accept = 'image/*,video/*',
  label = 'Upload Media',
  helperText = 'Supports PNG, JPG, WEBP, SVG, MP4, WebM up to 50MB.',
  allowVideo = true,
}) {
  const fileInputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [showUrlInput, setShowUrlInput] = useState(false)

  const isVideo =
    value &&
    (value.endsWith('.mp4') ||
      value.endsWith('.webm') ||
      value.endsWith('.ogg') ||
      value.includes('/uploads/videos/'))

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/ozinterstate/api'
  const fullUrl = value
    ? value.startsWith('http') || value.startsWith('data:')
      ? value
      : `${apiBaseUrl}${value.startsWith('/') ? '' : '/'}${value}`
    : ''

  const handleFile = async (file) => {
    if (!file) return

    // Validate size (50MB max)
    if (file.size > 50 * 1024 * 1024) {
      toast.error('File size exceeds 50MB limit.')
      return
    }

    try {
      setUploading(true)
      const formData = new FormData()
      formData.append('file', file)
      formData.append('title', file.name)

      const response = await mediaService.uploadMediaFile(formData)
      if (response?.data?.success && response.data.data?.file_path) {
        const path = response.data.data.file_path
        onChange(path)
        toast.success(`${file.type.startsWith('video') ? 'Video' : 'Image'} uploaded successfully!`)
      } else {
        toast.error('Upload completed without file path.')
      }
    } catch (error) {
      console.error('File upload error:', error)
      toast.error(error.userMessage || error.response?.data?.message || 'Failed to upload media file.')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleRemove = () => {
    onChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>{label}</span>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          style={{
            background: 'none',
            border: 'none',
            color: '#0284c7',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <Link2 size={13} /> {showUrlInput ? 'Hide URL field' : 'Paste URL instead'}
        </button>
      </div>

      {showUrlInput && (
        <div style={{ marginBottom: 10 }}>
          <input
            type="text"
            placeholder="https://images.unsplash.com/... or /uploads/..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 12px',
              border: '1px solid #cbd5e1',
              borderRadius: 8,
              fontSize: 13,
              color: '#0f172a',
            }}
          />
        </div>
      )}

      {value ? (
        <div
          style={{
            position: 'relative',
            border: '1px solid #e2e8f0',
            borderRadius: 14,
            overflow: 'hidden',
            background: '#f8fafc',
            padding: 12,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          {/* Media Preview */}
          <div style={{ position: 'relative', width: '100%', maxHeight: 240, overflow: 'hidden', borderRadius: 10, background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {isVideo ? (
              <video
                src={fullUrl}
                controls
                style={{ width: '100%', maxHeight: 240, objectFit: 'contain' }}
              />
            ) : (
              <img
                src={fullUrl}
                alt="Uploaded media preview"
                style={{ width: '100%', maxHeight: 240, objectFit: 'contain' }}
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80'
                }}
              />
            )}

            <div
              style={{
                position: 'absolute',
                top: 8,
                left: 8,
                background: 'rgba(15, 23, 42, 0.75)',
                color: '#fff',
                padding: '4px 8px',
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                backdropFilter: 'blur(4px)',
              }}
            >
              {isVideo ? <VideoIcon size={12} color="#38bdf8" /> : <ImageIcon size={12} color="#4ade80" />}
              {isVideo ? 'Video' : 'Image'}
            </div>
          </div>

          {/* Action Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <div style={{ fontSize: 11, color: '#64748b', wordBreak: 'break-all', maxWidth: '70%' }}>
              <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: 4 }}>{value}</code>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '6px 12px',
                  borderRadius: 8,
                  border: '1px solid #cbd5e1',
                  background: '#fff',
                  color: '#1e293b',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <RefreshCw size={13} /> Replace
              </button>

              <button
                type="button"
                onClick={handleRemove}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '6px 12px',
                  borderRadius: 8,
                  border: '1px solid #fecaca',
                  background: '#fff5f5',
                  color: '#b91c1c',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <X size={13} /> Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragOver(true)
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !uploading && fileInputRef.current?.click()}
          style={{
            border: isDragOver ? '2px dashed #0284c7' : '2px dashed #cbd5e1',
            background: isDragOver ? '#f0f9ff' : '#f8fafc',
            borderRadius: 14,
            padding: '24px 16px',
            textAlign: 'center',
            cursor: uploading ? 'wait' : 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          {uploading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: '#0284c7' }}>
              <Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} />
              <span style={{ fontSize: 13, fontWeight: 700 }}>Uploading file to server...</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: '#e0f2fe', display: 'grid', placeItems: 'center', color: '#0284c7' }}>
                <Upload size={22} />
              </div>

              <div>
                <strong style={{ fontSize: 14, color: '#1e293b', display: 'block' }}>
                  Click to upload {allowVideo ? 'image or video' : 'image'}
                </strong>
                <span style={{ fontSize: 12, color: '#64748b', display: 'block', marginTop: 2 }}>
                  or drag and drop your file here
                </span>
              </div>

              <span style={{ fontSize: 11, color: '#94a3b8' }}>{helperText}</span>
            </div>
          )}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0])
          }
        }}
        style={{ display: 'none' }}
      />
    </div>
  )
}
