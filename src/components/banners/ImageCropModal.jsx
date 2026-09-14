import { useState, useRef, useEffect } from 'react'
import { X, Crop, Check, RotateCw, ZoomIn, ZoomOut } from 'lucide-react'

export default function ImageCropModal({ imageUrl, onClose, onCropComplete }) {
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [cropBox, setCropBox] = useState({ x: 10, y: 10, width: 80, height: 60 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  const imageRef = useRef(null)

  const handleApplyCrop = () => {
    if (!imageRef.current) return

    const img = imageRef.current
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    // Calculate crop coordinates relative to actual image natural size
    const scaleX = img.naturalWidth / img.width
    const scaleY = img.naturalHeight / img.height

    const cropX = (cropBox.x / 100) * img.width * scaleX
    const cropY = (cropBox.y / 100) * img.height * scaleY
    const cropWidth = (cropBox.width / 100) * img.width * scaleX
    const cropHeight = (cropBox.height / 100) * img.height * scaleY

    canvas.width = Math.max(100, cropWidth)
    canvas.height = Math.max(100, cropHeight)

    if (rotation !== 0) {
      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.rotate((rotation * Math.PI) / 180)
      ctx.drawImage(
        img,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        -canvas.width / 2,
        -canvas.height / 2,
        canvas.width,
        canvas.height
      )
    } else {
      ctx.drawImage(
        img,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        canvas.width,
        canvas.height
      )
    }

    const croppedBase64 = canvas.toDataURL('image/jpeg', 0.92)
    onCropComplete(croppedBase64)
  }

  return (
    <div className="banner-modal-overlay">
      <div className="banner-modal-content crop-modal-content">
        <div className="banner-modal-header">
          <div className="modal-title-row">
            <Crop size={20} className="modal-icon" />
            <h3>Crop & Adjust Banner Image</h3>
          </div>
          <button type="button" className="banner-modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="crop-modal-body">
          <div className="crop-preview-container">
            <img
              ref={imageRef}
              src={imageUrl}
              alt="Crop target"
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                transition: 'transform 0.2s ease',
              }}
              className="crop-target-image"
            />

            <div
              className="crop-overlay-box"
              style={{
                left: `${cropBox.x}%`,
                top: `${cropBox.y}%`,
                width: `${cropBox.width}%`,
                height: `${cropBox.height}%`,
              }}
            >
              <div className="crop-grid-lines">
                <div className="grid-line horizontal-1" />
                <div className="grid-line horizontal-2" />
                <div className="grid-line vertical-1" />
                <div className="grid-line vertical-2" />
              </div>
            </div>
          </div>

          <div className="crop-controls-toolbar">
            <div className="crop-control-group">
              <label>Zoom</label>
              <div className="control-slider-row">
                <ZoomOut size={16} />
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                />
                <ZoomIn size={16} />
              </div>
            </div>

            <div className="crop-control-group">
              <label>Rotation</label>
              <div className="control-slider-row">
                <RotateCw size={16} />
                <input
                  type="range"
                  min="0"
                  max="360"
                  step="90"
                  value={rotation}
                  onChange={(e) => setRotation(parseInt(e.target.value))}
                />
                <span>{rotation}°</span>
              </div>
            </div>

            <div className="crop-preset-buttons">
              <button
                type="button"
                className="btn-secondary-sm"
                onClick={() => setCropBox({ x: 5, y: 15, width: 90, height: 70 })}
              >
                Wide (16:9)
              </button>
              <button
                type="button"
                className="btn-secondary-sm"
                onClick={() => setCropBox({ x: 10, y: 5, width: 80, height: 80 })}
              >
                Square (1:1)
              </button>
              <button
                type="button"
                className="btn-secondary-sm"
                onClick={() => setCropBox({ x: 0, y: 0, width: 100, height: 100 })}
              >
                Reset Selection
              </button>
            </div>
          </div>
        </div>

        <div className="banner-modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn-primary" onClick={handleApplyCrop}>
            <Check size={18} /> Apply Crop
          </button>
        </div>
      </div>
    </div>
  )
}
