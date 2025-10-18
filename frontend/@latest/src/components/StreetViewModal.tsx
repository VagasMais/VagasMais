import { X, Loader2 } from 'lucide-react'
import type { Coordinates } from '../types/parking'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface StreetViewModalProps {
  isOpen: boolean
  onClose: () => void
  location: Coordinates
  title: string
}

const StreetViewModal = ({ isOpen, onClose, location, title }: StreetViewModalProps) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  // Prevenir scroll do body quando modal está aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setImageLoaded(false)
      setImageError(false)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  // Google Street View Static API URL - tamanho otimizado para tela cheia
  const streetViewUrl = `https://maps.googleapis.com/maps/api/streetview?size=1600x900&location=${location.lat},${location.lng}&fov=90&heading=0&pitch=0&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`

  const modalContent = (
    <div className="streetview-modal-overlay" onClick={onClose}>
      <div className="streetview-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="streetview-modal-header">
          <h2 className="streetview-modal-title">{title}</h2>
          <button className="streetview-modal-close" onClick={onClose} aria-label="Fechar">
            <X size={24} />
          </button>
        </div>
        <div className="streetview-modal-body">
          {!imageLoaded && !imageError && (
            <div className="streetview-loading">
              <Loader2 className="streetview-spinner" size={48} />
              <p className="streetview-loading-text">Carregando vista da rua...</p>
            </div>
          )}
          {imageError && (
            <div className="streetview-error">
              <div className="streetview-error-icon">📍</div>
              <p className="streetview-error-text">Street View não disponível para este local</p>
            </div>
          )}
          <img
            src={streetViewUrl}
            alt={`Vista da rua de ${title}`}
            className="streetview-image"
            style={{ display: imageLoaded ? 'block' : 'none' }}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true)
              setImageLoaded(false)
            }}
          />
        </div>
      </div>
    </div>
  )

  // Renderiza o modal diretamente no body, fora da hierarquia do componente pai
  return createPortal(modalContent, document.body)
}

export default StreetViewModal
