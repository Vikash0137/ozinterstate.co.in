import { X, ExternalLink, Calendar, CheckCircle2, XCircle, Sliders, Film, Image as ImageIcon } from 'lucide-react'

export default function BannerViewModal({ banner, onClose, onEdit }) {
  if (!banner) return null

  const apiHost = import.meta.env.VITE_API_BASE_URL || '/ozinterstate/api'

  const getMediaUrl = (path) => {
    if (!path) return null
    if (path.startsWith('http') || path.startsWith('data:')) return path
    return `${apiHost}${path}`
  }

  const imageUrl = getMediaUrl(banner.image)
  const videoUrl = getMediaUrl(banner.video_url)

  const isVideo = banner.media_type === 'video'

  return (
    <div className="banner-modal-overlay">
      <div className="banner-modal-content view-modal-content">
        <div className="banner-modal-header">
          <div className="modal-title-row">
            <Sliders size={20} className="modal-icon" />
            <h3>Banner Details & Preview ({isVideo ? 'Video' : 'Image'})</h3>
          </div>
          <button type="button" className="banner-modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="banner-modal-body">
          {/* Live Preview Display */}
          <div className="view-modal-preview-box">
            <div
              className="banner-live-preview-container"
              style={{
                backgroundImage: !isVideo && imageUrl ? `url(${imageUrl})` : undefined,
                backgroundColor: '#0f172a',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                textAlign: banner.text_alignment || 'left',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {isVideo && videoUrl && (
                <video
                  src={videoUrl}
                  autoPlay={Boolean(banner.autoplay)}
                  muted={Boolean(banner.muted)}
                  loop={Boolean(banner.loop)}
                  controls={Boolean(banner.controls)}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: banner.object_fit || 'cover',
                    zIndex: 0,
                  }}
                />
              )}

              <div
                className="banner-preview-overlay"
                style={{
                  backgroundColor: banner.overlay_color
                    ? `rgba(0,0,0,${banner.overlay_opacity || 0.7})`
                    : undefined,
                  zIndex: 1,
                }}
              />

              <div className="banner-preview-content" style={{ zIndex: 2 }}>
                {banner.subtitle && (
                  <span className="banner-preview-subtitle">
                    {banner.subtitle}
                  </span>
                )}

                <h2
                  className="banner-preview-title"
                  style={{
                    fontFamily: banner.font_family || 'Inter',
                    fontSize: banner.title_font_size || '36px',
                    fontWeight: banner.title_font_weight || '800',
                    fontStyle: banner.title_font_style || 'normal',
                    color: banner.title_color || '#ffffff',
                    letterSpacing: banner.title_letter_spacing || '0px',
                    lineHeight: banner.title_line_height || '1.1',
                    textTransform: banner.title_text_transform || 'none',
                  }}
                >
                  {banner.title}
                </h2>

                {banner.description && (
                  <p
                    className="banner-preview-description"
                    style={{
                      fontFamily: banner.description_font_family || 'Inter',
                      fontSize: banner.description_font_size || '16px',
                      fontWeight: banner.description_font_weight || '400',
                      fontStyle: banner.description_font_style || 'normal',
                      color: banner.description_color || '#f8fafc',
                      letterSpacing: banner.description_letter_spacing || '0px',
                      lineHeight: banner.description_line_height || '1.6',
                      textAlign: banner.description_text_alignment || banner.text_alignment || 'left',
                    }}
                  >
                    {banner.description}
                  </p>
                )}

                {banner.button_text && (
                  <div className="banner-preview-btn-row">
                    <button
                      type="button"
                      className="banner-preview-button"
                      style={{
                        fontFamily: banner.button_font_family || 'Inter',
                        fontSize: banner.button_font_size || '14px',
                        fontWeight: banner.button_font_weight || '700',
                        color: banner.button_text_color || '#ffffff',
                        backgroundColor: banner.button_background_color || '#0284c7',
                        borderRadius: banner.button_border_radius || '12px',
                        borderColor: banner.button_border_color || 'transparent',
                      }}
                    >
                      {banner.button_text}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Detailed Info Grid */}
          <div className="view-details-grid">
            <div className="view-detail-card">
              <h4>General Information</h4>
              <div className="detail-row">
                <span className="label">Media Type:</span>
                <span className="value capitalize font-bold">
                  {banner.media_type === 'video' ? '🎬 Video Banner' : '🖼️ Image Banner'}
                </span>
              </div>
              <div className="detail-row">
                <span className="label">Title:</span>
                <span className="value font-semibold">{banner.title}</span>
              </div>
              <div className="detail-row">
                <span className="label">Subtitle:</span>
                <span className="value">{banner.subtitle || 'N/A'}</span>
              </div>
              <div className="detail-row">
                <span className="label">Status:</span>
                <span className={`status-badge status-${banner.status}`}>
                  {banner.status === 'active' ? (
                    <><CheckCircle2 size={14} /> Active</>
                  ) : (
                    <><XCircle size={14} /> Inactive</>
                  )}
                </span>
              </div>
              <div className="detail-row">
                <span className="label">Display Order:</span>
                <span className="value badge-order">#{banner.display_order}</span>
              </div>
              <div className="detail-row">
                <span className="label">Button Link:</span>
                <span className="value text-link">
                  {banner.button_link || '/services'} <ExternalLink size={13} />
                </span>
              </div>
            </div>

            <div className="view-detail-card">
              <h4>Media & Typography Settings</h4>
              {isVideo ? (
                <>
                  <div className="detail-row">
                    <span className="label">Video URL:</span>
                    <span className="value text-sm font-mono truncate max-w-[200px]">
                      {banner.video_url || 'N/A'}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Playback:</span>
                    <span className="value text-xs">
                      Autoplay: {banner.autoplay ? 'Yes' : 'No'} | Muted: {banner.muted ? 'Yes' : 'No'} | Loop: {banner.loop ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Object Fit:</span>
                    <span className="value capitalize">{banner.object_fit || 'cover'}</span>
                  </div>
                </>
              ) : (
                <div className="detail-row">
                  <span className="label">Image Path:</span>
                  <span className="value text-sm font-mono truncate max-w-[200px]">
                    {banner.image || 'N/A'}
                  </span>
                </div>
              )}
              <div className="detail-row">
                <span className="label">Title Font:</span>
                <span className="value">
                  {banner.font_family} ({banner.title_font_size}, {banner.title_font_weight})
                </span>
              </div>
              <div className="detail-row">
                <span className="label">Button Styling:</span>
                <span className="value">
                  BG: {banner.button_background_color} | Hover: {banner.button_hover_color}
                </span>
              </div>
              <div className="detail-row">
                <span className="label">Created Date:</span>
                <span className="value">
                  {new Date(banner.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="banner-modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Close
          </button>
          {onEdit && (
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                onClose()
                onEdit(banner.id)
              }}
            >
              Edit Banner
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
