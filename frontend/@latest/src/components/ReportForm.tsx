import { useState } from 'react'
import { MapPin, Upload, X, AlertCircle } from 'lucide-react'
import type { ReportFormData, SpotType, ViolationType } from '../types/parking'
import { useLocation } from '../hooks/useLocation'
import '../styles/ReportForm.css'

const MAX_FILE_SIZE_MB = 10
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024
const MAX_FILES = 3

interface ReportFormProps {
  onSubmit: (data: ReportFormData) => void
  isSubmitting?: boolean
}

export function ReportForm({ onSubmit, isSubmitting = false }: ReportFormProps) {
  const { location, error: locationError, fetchLocation } = useLocation()

  const [formData, setFormData] = useState<ReportFormData>({
    address: '',
    latitude: null,
    longitude: null,
    spotType: 'disabled',
    violationType: 'no_credential',
    description: '',
    media: []
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)

  const handleUseCurrentLocation = async () => {
    setIsLoadingLocation(true)
    fetchLocation()

    // Wait for location to be updated
    setTimeout(() => {
      if (location) {
        setFormData(prev => ({
          ...prev,
          latitude: location.lat,
          longitude: location.lng
        }))

        // Try to reverse geocode to get address
        reverseGeocode(location.lat, location.lng)
      }
      setIsLoadingLocation(false)
    }, 1000)
  }

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const geocoder = new google.maps.Geocoder()
      const result = await geocoder.geocode({ location: { lat, lng } })

      if (result.results[0]) {
        setFormData(prev => ({
          ...prev,
          address: result.results[0].formatted_address
        }))
      }
    } catch (error) {
      console.error('Erro ao obter endereço:', error)
    }
  }

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, address: e.target.value }))
    if (errors.address) {
      setErrors(prev => ({ ...prev, address: '' }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    // Check number of files
    if (formData.media.length + files.length > MAX_FILES) {
      setErrors(prev => ({
        ...prev,
        media: `Você pode enviar no máximo ${MAX_FILES} arquivos`
      }))
      return
    }

    // Check file sizes
    const oversizedFiles = files.filter(file => file.size > MAX_FILE_SIZE_BYTES)
    if (oversizedFiles.length > 0) {
      setErrors(prev => ({
        ...prev,
        media: `Alguns arquivos excedem o tamanho máximo de ${MAX_FILE_SIZE_MB}MB`
      }))
      return
    }

    // Check file types (images and videos only)
    const invalidFiles = files.filter(file =>
      !file.type.startsWith('image/') && !file.type.startsWith('video/')
    )
    if (invalidFiles.length > 0) {
      setErrors(prev => ({
        ...prev,
        media: 'Apenas imagens e vídeos são permitidos'
      }))
      return
    }

    setFormData(prev => ({
      ...prev,
      media: [...prev.media, ...files]
    }))
    setErrors(prev => ({ ...prev, media: '' }))
  }

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index)
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.address.trim()) {
      newErrors.address = 'Endereço é obrigatório'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória'
    }

    if (formData.media.length === 0) {
      newErrors.media = 'Adicione pelo menos uma foto ou vídeo'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onSubmit(formData)
    }
  }

  return (
    <form className="report-form" onSubmit={handleSubmit}>
      <div className="form-section">
        <h3 className="form-section-title">Local da Infração</h3>

        <div className="form-group">
          <label htmlFor="address" className="form-label">
            Endereço *
          </label>
          <div className="address-input-group">
            <input
              id="address"
              type="text"
              className={`form-input ${errors.address ? 'input-error' : ''}`}
              value={formData.address}
              onChange={handleAddressChange}
              placeholder="Digite o endereço completo"
            />
            <button
              type="button"
              className="location-button"
              onClick={handleUseCurrentLocation}
              disabled={isLoadingLocation}
              title="Usar localização atual"
            >
              <MapPin size={20} />
              {isLoadingLocation ? 'Obtendo...' : 'Usar localização'}
            </button>
          </div>
          {errors.address && (
            <span className="error-message">
              <AlertCircle size={16} />
              {errors.address}
            </span>
          )}
          {locationError && (
            <span className="error-message">
              <AlertCircle size={16} />
              {locationError}
            </span>
          )}
        </div>
      </div>

      <div className="form-section">
        <h3 className="form-section-title">Tipo de Vaga</h3>

        <div className="form-group">
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="spotType"
                value="disabled"
                checked={formData.spotType === 'disabled'}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  spotType: e.target.value as SpotType
                }))}
              />
              <span>Pessoa com Deficiência</span>
            </label>

            <label className="radio-label">
              <input
                type="radio"
                name="spotType"
                value="elderly"
                checked={formData.spotType === 'elderly'}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  spotType: e.target.value as SpotType
                }))}
              />
              <span>Idoso</span>
            </label>

            <label className="radio-label">
              <input
                type="radio"
                name="spotType"
                value="pregnant"
                checked={formData.spotType === 'pregnant'}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  spotType: e.target.value as SpotType
                }))}
              />
              <span>Gestante</span>
            </label>
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3 className="form-section-title">Tipo de Infração</h3>

        <div className="form-group">
          <select
            className="form-select"
            value={formData.violationType}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              violationType: e.target.value as ViolationType
            }))}
          >
            <option value="no_credential">Veículo sem Credencial</option>
            <option value="blocking_access">Bloqueio de Acesso</option>
            <option value="misuse">Uso Indevido</option>
            <option value="other">Outro</option>
          </select>
        </div>
      </div>

      <div className="form-section">
        <h3 className="form-section-title">Descrição</h3>

        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Descreva a situação *
          </label>
          <textarea
            id="description"
            className={`form-textarea ${errors.description ? 'input-error' : ''}`}
            value={formData.description}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, description: e.target.value }))
              if (errors.description) {
                setErrors(prev => ({ ...prev, description: '' }))
              }
            }}
            placeholder="Descreva detalhes da infração, como placa do veículo, horário, etc."
            rows={4}
          />
          {errors.description && (
            <span className="error-message">
              <AlertCircle size={16} />
              {errors.description}
            </span>
          )}
        </div>
      </div>

      <div className="form-section">
        <h3 className="form-section-title">Mídias</h3>

        <div className="form-group">
          <label htmlFor="media" className="form-label">
            Fotos ou Vídeos * (máx. {MAX_FILES} arquivos, {MAX_FILE_SIZE_MB}MB cada)
          </label>

          <div className="media-upload-container">
            {formData.media.length < MAX_FILES && (
              <label className="upload-button">
                <input
                  id="media"
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={handleFileChange}
                  className="file-input-hidden"
                />
                <Upload size={24} />
                <span>Adicionar Arquivo</span>
              </label>
            )}

            {formData.media.length > 0 && (
              <div className="media-preview-grid">
                {formData.media.map((file, index) => (
                  <div key={index} className="media-preview-item">
                    {file.type.startsWith('image/') ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="media-preview-image"
                      />
                    ) : (
                      <video
                        src={URL.createObjectURL(file)}
                        className="media-preview-video"
                      />
                    )}
                    <button
                      type="button"
                      className="remove-media-button"
                      onClick={() => removeFile(index)}
                      title="Remover arquivo"
                    >
                      <X size={16} />
                    </button>
                    <div className="media-preview-info">
                      <span className="media-filename">{file.name}</span>
                      <span className="media-filesize">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {errors.media && (
            <span className="error-message">
              <AlertCircle size={16} />
              {errors.media}
            </span>
          )}
        </div>
      </div>

      <div className="form-actions">
        <button
          type="submit"
          className="submit-button"
          disabled={isSubmitting}
          style={{
            opacity: isSubmitting ? 0.6 : 1,
            cursor: isSubmitting ? 'not-allowed' : 'pointer'
          }}
        >
          {isSubmitting ? 'Enviando...' : 'Enviar Denúncia'}
        </button>
      </div>
    </form>
  )
}
