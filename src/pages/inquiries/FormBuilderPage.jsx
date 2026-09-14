import { useState, useEffect } from 'react'
import {
  Plus,
  Save,
  Eye,
  Trash2,
  Copy,
  Edit3,
  MoveUp,
  MoveDown,
  GripVertical,
  CheckCircle2,
  XCircle,
  Loader2,
  FileText,
  User,
  Phone,
  Mail,
  MapPin,
  CalendarDays,
  Home,
  Hash,
  Clock,
  Globe,
  Lock,
  Upload,
  CheckSquare,
  Sparkles,
  Send,
  X,
  Sliders,
  HelpCircle,
} from 'lucide-react'
import toast from 'react-hot-toast'
import inquiryService from '../../services/inquiryService'
import './Inquiries.css'

const fieldTypesList = [
  { value: 'text', label: 'Single Line Text', icon: FileText },
  { value: 'email', label: 'Email Address', icon: Mail },
  { value: 'phone', label: 'Phone Number', icon: Phone },
  { value: 'number', label: 'Number Input', icon: Hash },
  { value: 'date', label: 'Date Picker', icon: CalendarDays },
  { value: 'time', label: 'Time Picker', icon: Clock },
  { value: 'textarea', label: 'Paragraph Textarea', icon: FileText },
  { value: 'select', label: 'Dropdown Select', icon: Sliders },
  { value: 'radio', label: 'Radio Buttons', icon: CheckSquare },
  { value: 'checkbox', label: 'Checkboxes', icon: CheckSquare },
  { value: 'multiselect', label: 'Multi Select', icon: Sliders },
  { value: 'file', label: 'File Upload', icon: Upload },
  { value: 'url', label: 'URL / Website', icon: Globe },
  { value: 'password', label: 'Password', icon: Lock },
  { value: 'hidden', label: 'Hidden Field', icon: Eye },
]

const iconOptions = [
  'User',
  'Phone',
  'Mail',
  'MapPin',
  'CalendarDays',
  'Home',
  'FileText',
  'Hash',
  'Clock',
  'Globe',
  'Lock',
  'Upload',
  'CheckSquare',
]

export default function FormBuilderPage() {
  const [formSettings, setFormSettings] = useState(null)
  const [fields, setFields] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Edit/Add Field Modal
  const [editingField, setEditingField] = useState(null) // null or field object
  const [isNewField, setIsNewField] = useState(false)

  useEffect(() => {
    fetchFormSchema()
  }, [])

  const fetchFormSchema = async () => {
    try {
      setLoading(true)
      const res = await inquiryService.getAdminForm()
      if (res.success && res.data) {
        setFormSettings(res.data.form || {})
        setFields(res.data.fields || [])
      }
    } catch (err) {
      console.error('Failed to load form builder schema:', err)
      toast.error('Failed to load form builder.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddFieldClick = (type = 'text') => {
    const newId = `new_${Date.now()}`
    const defaultLabel = type.charAt(0).toUpperCase() + type.slice(1) + ' Field'
    const newFieldObj = {
      id: newId,
      label: defaultLabel,
      placeholder: `Enter ${defaultLabel.toLowerCase()}`,
      field_name: `field_${Date.now().toString().slice(-4)}`,
      field_type: type,
      required: false,
      read_only: false,
      width: '100%',
      icon: type === 'phone' ? 'Phone' : type === 'email' ? 'Mail' : type === 'date' ? 'CalendarDays' : 'FileText',
      help_text: '',
      default_value: '',
      options: ['Option 1', 'Option 2', 'Option 3'],
      status: 'active',
    }

    setEditingField(newFieldObj)
    setIsNewField(true)
  }

  const handleSaveFieldModal = (e) => {
    e.preventDefault()
    if (!editingField.label.trim()) {
      toast.error('Field Label is required.')
      return
    }

    if (isNewField) {
      setFields((prev) => [...prev, editingField])
      toast.success('New field added to form.')
    } else {
      setFields((prev) =>
        prev.map((f) => (f.id === editingField.id ? editingField : f))
      )
      toast.success('Field updated.')
    }

    setEditingField(null)
  }

  const handleToggleFieldStatus = (id) => {
    setFields((prev) =>
      prev.map((f) =>
        f.id === id
          ? { ...f, status: f.status === 'active' ? 'inactive' : 'active' }
          : f
      )
    )
  }

  const handleDuplicateField = (field) => {
    const duplicated = {
      ...field,
      id: `new_${Date.now()}`,
      label: `${field.label} (Copy)`,
      field_name: `${field.field_name}_copy`,
    }
    setFields((prev) => [...prev, duplicated])
    toast.success(`Duplicated "${field.label}"`)
  }

  const handleDeleteField = (id, label) => {
    setFields((prev) => prev.filter((f) => f.id !== id))
    toast.success(`Deleted "${label}"`)
  }

  const handleMoveField = (index, direction) => {
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= fields.length) return
    const updated = [...fields]
    const temp = updated[index]
    updated[index] = updated[newIndex]
    updated[newIndex] = temp
    setFields(updated)
  }

  const handleSaveAllFields = async () => {
    try {
      setSaving(true)
      const res = await inquiryService.saveFormFields(fields)
      if (res.success) {
        toast.success('Form fields and layout saved successfully!')
        if (res.data) setFields(res.data)
      }
    } catch (err) {
      console.error('Failed to save fields:', err)
      toast.error('Failed to save form fields.')
    } finally {
      setSaving(false)
    }
  }

  // Render Icon component by name
  const renderFieldIcon = (iconName) => {
    switch (iconName) {
      case 'User': return <User className="input-icon" />
      case 'Phone': return <Phone className="input-icon" />
      case 'Mail': return <Mail className="input-icon" />
      case 'MapPin': return <MapPin className="input-icon" />
      case 'CalendarDays': return <CalendarDays className="input-icon" />
      case 'Home': return <Home className="input-icon" />
      case 'Hash': return <Hash className="input-icon" />
      case 'Clock': return <Clock className="input-icon" />
      case 'Globe': return <Globe className="input-icon" />
      case 'Lock': return <Lock className="input-icon" />
      case 'Upload': return <Upload className="input-icon" />
      default: return <FileText className="input-icon" />
    }
  }

  return (
    <div className="banner-page-container">
      {/* Page Header */}
      <div className="banner-page-header">
        <div>
          <h1 className="banner-page-title">Dynamic Form Builder</h1>
          <p className="banner-page-subtitle">
            Add, reorder, edit fields and see live real-time preview of the Hero Quote Form.
          </p>
        </div>

        <div className="topbar-actions">
          <button
            type="button"
            className="banner-add-button"
            disabled={saving}
            onClick={handleSaveAllFields}
          >
            {saving ? (
              <>
                <Loader2 size={18} className="spinner" /> Saving...
              </>
            ) : (
              <>
                <Save size={18} /> Save Form Layout
              </>
            )}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="banner-loading-state">
          <Loader2 size={32} className="spinner" />
          <p>Loading Form Builder...</p>
        </div>
      ) : (
        <div className="builder-grid-layout">
          {/* LEFT: FIELD LIST & ADD TOOLBAR */}
          <div className="builder-left-card">
            {/* Add Field Types Toolbar */}
            <div className="add-field-toolbar">
              <span className="toolbar-title">Add New Field Type:</span>
              <div className="field-types-buttons-grid">
                {fieldTypesList.map((item) => {
                  const IconComp = item.icon
                  return (
                    <button
                      key={item.value}
                      type="button"
                      className="btn-add-type-chip"
                      onClick={() => handleAddFieldClick(item.value)}
                      title={`Add ${item.label}`}
                    >
                      <IconComp size={14} /> {item.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Field List Cards */}
            <div className="builder-fields-list">
              {fields.length === 0 ? (
                <div className="banner-empty-state">
                  <FileText size={36} className="empty-icon" />
                  <h3>No fields in form</h3>
                  <p>Click any field type above to add a field to the Quote Form.</p>
                </div>
              ) : (
                fields.map((field, idx) => (
                  <div
                    key={field.id}
                    className={`field-item-card ${
                      field.status === 'inactive' ? 'field-inactive' : ''
                    }`}
                  >
                    <div className="field-card-drag-handle">
                      <GripVertical size={18} />
                    </div>

                    <div className="field-card-main-info">
                      <div className="field-card-header-row">
                        <strong className="field-label-text">{field.label}</strong>
                        <span className="field-type-badge">{field.field_type}</span>
                        <span className="field-width-badge">{field.width || '100%'}</span>
                        {field.required ? (
                          <span className="badge-required">Required</span>
                        ) : null}
                      </div>

                      <div className="field-card-sub-info">
                        <span>Name: <code>{field.field_name}</code></span>
                        {field.placeholder && (
                          <span>Placeholder: "{field.placeholder}"</span>
                        )}
                      </div>
                    </div>

                    {/* Field Actions */}
                    <div className="field-card-actions">
                      <button
                        type="button"
                        className="action-btn-sm"
                        disabled={idx === 0}
                        onClick={() => handleMoveField(idx, -1)}
                        title="Move Up"
                      >
                        <MoveUp size={14} />
                      </button>

                      <button
                        type="button"
                        className="action-btn-sm"
                        disabled={idx === fields.length - 1}
                        onClick={() => handleMoveField(idx, 1)}
                        title="Move Down"
                      >
                        <MoveDown size={14} />
                      </button>

                      <button
                        type="button"
                        className={`action-btn-sm ${
                          field.status === 'active' ? 'btn-status-on' : 'btn-status-off'
                        }`}
                        onClick={() => handleToggleFieldStatus(field.id)}
                        title="Toggle Enable/Disable"
                      >
                        {field.status === 'active' ? (
                          <CheckCircle2 size={14} />
                        ) : (
                          <XCircle size={14} />
                        )}
                      </button>

                      <button
                        type="button"
                        className="action-btn-sm edit-btn"
                        onClick={() => {
                          setEditingField(field)
                          setIsNewField(false)
                        }}
                        title="Edit Field"
                      >
                        <Edit3 size={14} />
                      </button>

                      <button
                        type="button"
                        className="action-btn-sm copy-btn"
                        onClick={() => handleDuplicateField(field)}
                        title="Duplicate Field"
                      >
                        <Copy size={14} />
                      </button>

                      <button
                        type="button"
                        className="action-btn-sm delete-btn"
                        onClick={() => handleDeleteField(field.id, field.label)}
                        title="Delete Field"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* RIGHT: LIVE REAL-TIME PREVIEW CARD */}
          <div className="builder-right-preview-card">
            <div className="preview-card-header">
              <Eye size={18} />
              <h3>Live Quote Form Preview</h3>
            </div>

            <div className="live-quote-form-preview-wrapper">
              <div className="rounded-[2rem] border border-slate-200 bg-white/95 p-5 shadow-2xl backdrop-blur-xl sm:p-6">
                <div className="mb-6">
                  {formSettings?.subtitle && (
                    <span className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-sky-700">
                      {formSettings.subtitle}
                    </span>
                  )}
                  <h3 className="mt-3 font-display text-2xl font-extrabold text-slate-900">
                    {formSettings?.title || 'Get Your Moving Quote'}
                  </h3>
                  {formSettings?.description && (
                    <p className="mt-1 text-sm text-slate-500">
                      {formSettings.description}
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="form-preview-fields-flex">
                    {fields
                      .filter((f) => f.status === 'active' && f.field_type !== 'hidden')
                      .map((f) => {
                        const widthClass =
                          f.width === '50%'
                            ? 'col-preview-half'
                            : f.width === '33%'
                            ? 'col-preview-third'
                            : f.width === '25%'
                            ? 'col-preview-quarter'
                            : 'col-preview-full'

                        return (
                          <div key={f.id} className={`preview-input-group ${widthClass}`}>
                            {f.label && (
                              <label className="preview-field-label">
                                {f.label} {f.required ? <span className="text-red-500">*</span> : null}
                              </label>
                            )}

                            <div className="relative-input-box">
                              {renderFieldIcon(f.icon)}

                              {f.field_type === 'select' || f.field_type === 'dropdown' ? (
                                <select className="preview-input-field" disabled={Boolean(f.read_only)}>
                                  <option value="">{f.placeholder || `Select ${f.label}`}</option>
                                  {(Array.isArray(f.options) ? f.options : []).map((opt) => (
                                    <option key={opt} value={opt}>
                                      {opt}
                                    </option>
                                  ))}
                                </select>
                              ) : f.field_type === 'textarea' ? (
                                <textarea
                                  rows={2}
                                  placeholder={f.placeholder}
                                  className="preview-input-field preview-textarea"
                                  disabled={Boolean(f.read_only)}
                                />
                              ) : (
                                <input
                                  type={f.field_type === 'phone' ? 'tel' : f.field_type}
                                  placeholder={f.placeholder}
                                  defaultValue={f.default_value}
                                  className="preview-input-field"
                                  disabled={Boolean(f.read_only)}
                                />
                              )}
                            </div>
                          </div>
                        )
                      })}
                  </div>

                  <button
                    type="button"
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-600 px-5 py-4 text-sm font-extrabold uppercase tracking-wide text-white shadow-lg"
                  >
                    {formSettings?.button_text || 'Submit Quote Request'}
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="preview-info-box">
              <span className="info-label">Live Sync Notice:</span>
              <p>
                Any field added, edited, or reordered here will appear on the website Hero Quote Form.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* EDIT / ADD FIELD MODAL */}
      {editingField && (
        <div className="banner-modal-overlay">
          <div className="banner-modal-content field-modal-content">
            <div className="banner-modal-header">
              <div className="modal-title-row">
                <Sliders size={20} className="modal-icon" />
                <h3>{isNewField ? 'Add New Form Field' : `Edit Field: ${editingField.label}`}</h3>
              </div>
              <button
                type="button"
                className="banner-modal-close"
                onClick={() => setEditingField(null)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveFieldModal} className="banner-modal-body">
              <div className="form-row">
                <div className="form-group col-half">
                  <label className="required">Field Label</label>
                  <input
                    type="text"
                    value={editingField.label}
                    onChange={(e) =>
                      setEditingField({ ...editingField, label: e.target.value })
                    }
                    placeholder="e.g. Phone Number"
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group col-half">
                  <label className="required">Field Name (API Key)</label>
                  <input
                    type="text"
                    value={editingField.field_name}
                    onChange={(e) =>
                      setEditingField({ ...editingField, field_name: e.target.value })
                    }
                    placeholder="e.g. phone"
                    required
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-half">
                  <label>Field Type</label>
                  <select
                    value={editingField.field_type}
                    onChange={(e) =>
                      setEditingField({ ...editingField, field_type: e.target.value })
                    }
                    className="form-select"
                  >
                    {fieldTypesList.map((ft) => (
                      <option key={ft.value} value={ft.value}>
                        {ft.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group col-half">
                  <label>Placeholder Text</label>
                  <input
                    type="text"
                    value={editingField.placeholder || ''}
                    onChange={(e) =>
                      setEditingField({ ...editingField, placeholder: e.target.value })
                    }
                    placeholder="e.g. Enter Phone Number"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-quarter">
                  <label>Width Size</label>
                  <select
                    value={editingField.width || '100%'}
                    onChange={(e) =>
                      setEditingField({ ...editingField, width: e.target.value })
                    }
                    className="form-select"
                  >
                    <option value="100%">100% (Full Width)</option>
                    <option value="50%">50% (Half Width)</option>
                    <option value="33%">33% (One Third)</option>
                    <option value="25%">25% (Quarter)</option>
                  </select>
                </div>

                <div className="form-group col-quarter">
                  <label>Field Icon</label>
                  <select
                    value={editingField.icon || 'FileText'}
                    onChange={(e) =>
                      setEditingField({ ...editingField, icon: e.target.value })
                    }
                    className="form-select"
                  >
                    {iconOptions.map((ic) => (
                      <option key={ic} value={ic}>
                        {ic}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group col-quarter">
                  <label>Required Field</label>
                  <select
                    value={editingField.required ? 'yes' : 'no'}
                    onChange={(e) =>
                      setEditingField({
                        ...editingField,
                        required: e.target.value === 'yes',
                      })
                    }
                    className="form-select"
                  >
                    <option value="yes">Yes (Required)</option>
                    <option value="no">No (Optional)</option>
                  </select>
                </div>

                <div className="form-group col-quarter">
                  <label>Read Only</label>
                  <select
                    value={editingField.read_only ? 'yes' : 'no'}
                    onChange={(e) =>
                      setEditingField({
                        ...editingField,
                        read_only: e.target.value === 'yes',
                      })
                    }
                    className="form-select"
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
              </div>

              {(editingField.field_type === 'select' ||
                editingField.field_type === 'dropdown' ||
                editingField.field_type === 'radio' ||
                editingField.field_type === 'checkbox' ||
                editingField.field_type === 'multiselect') && (
                <div className="form-row">
                  <div className="form-group col-full">
                    <label>Options (One per line)</label>
                    <textarea
                      rows={3}
                      value={
                        Array.isArray(editingField.options)
                          ? editingField.options.join('\n')
                          : editingField.options || ''
                      }
                      onChange={(e) =>
                        setEditingField({
                          ...editingField,
                          options: e.target.value.split('\n'),
                        })
                      }
                      placeholder="Option 1&#10;Option 2&#10;Option 3"
                      className="form-textarea"
                    />
                  </div>
                </div>
              )}

              <div className="form-row">
                <div className="form-group col-half">
                  <label>Default Value</label>
                  <input
                    type="text"
                    value={editingField.default_value || ''}
                    onChange={(e) =>
                      setEditingField({ ...editingField, default_value: e.target.value })
                    }
                    placeholder="Optional default value"
                    className="form-input"
                  />
                </div>

                <div className="form-group col-half">
                  <label>Help Text / Subtext</label>
                  <input
                    type="text"
                    value={editingField.help_text || ''}
                    onChange={(e) =>
                      setEditingField({ ...editingField, help_text: e.target.value })
                    }
                    placeholder="Instructions displayed below field"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="banner-modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setEditingField(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Apply Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
