import { X } from 'lucide-react'
import type { Coordinates } from '../types/parking'
import { useEffect } from 'react'

interface StreetViewModalProps {
  isOpen: boolean
  onClose: () => void
  location: Coordinates
  title: string
}

const StreetViewModal = ({ isOpen, onClose, location, title }: StreetViewModalProps) => {
  // Prevenir scroll do body quando modal está aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  // Google Street View Static API URL - tamanho maior para melhor qualidade
  const streetViewUrl = `https://maps.googleapis.com/maps/api/streetview?size=1200x800&location=${location.lat},${location.lng}&fov=90&heading=0&pitch=0&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`

  return (
    <div className="streetview-modal-overlay" onClick={onClose}>
      <div className="streetview-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="streetview-modal-header">
          <h2 className="streetview-modal-title">{title}</h2>
          <button className="streetview-modal-close" onClick={onClose} aria-label="Fechar">
            <X size={20} />
          </button>
        </div>
        <div className="streetview-modal-body">
          <img
            src={streetViewUrl}
            alt={`Vista da rua de ${title}`}
            className="streetview-image"
            onError={(e) => {
              const target = e.currentTarget
              target.style.display = 'none'
              const errorDiv = document.createElement('div')
              errorDiv.className = 'streetview-error'
              errorDiv.innerHTML = `
                <div class="streetview-error-icon">📍</div>
                <p class="streetview-error-text">Street View não disponível para este local</p>
              `
              target.parentElement?.appendChild(errorDiv)
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default StreetViewModal
