import { X } from 'lucide-react'
import type { Coordinates } from '../types/parking'
import { openGoogleMaps, openWaze } from '../utils/externalNavigation'

interface NavigationModalProps {
  isOpen: boolean
  onClose: () => void
  origin: Coordinates | null
  destinationLat: number
  destinationLng: number
  destinationName?: string
}

/**
 * Modal for selecting navigation app (Google Maps or Waze)
 */
const NavigationModal = ({
  isOpen,
  onClose,
  origin,
  destinationLat,
  destinationLng,
  destinationName
}: NavigationModalProps) => {
  if (!isOpen) return null

  const handleGoogleMaps = () => {
    openGoogleMaps(origin, destinationLat, destinationLng)
    onClose()
  }

  const handleWaze = () => {
    openWaze(origin, destinationLat, destinationLng)
    onClose()
  }

  return (
    <div className="navigation-modal-overlay" onClick={onClose}>
      <div className="navigation-modal" onClick={e => e.stopPropagation()}>
        <button className="navigation-modal-close" onClick={onClose} aria-label="Fechar">
          <X size={20} />
        </button>

        <h3 className="navigation-modal-title">Escolha o app de navegação</h3>

        {destinationName && (
          <p className="navigation-modal-subtitle">{destinationName}</p>
        )}

        <div className="navigation-modal-buttons">
          <button className="navigation-option google-maps" onClick={handleGoogleMaps}>
            <div className="navigation-option-icon">
              <img src="/spotCard/google-maps.png" alt="Google Maps" />
            </div>
            <div className="navigation-option-text">
              <span className="navigation-option-name">Google Maps</span>
              <span className="navigation-option-desc">Navegação turn-by-turn</span>
            </div>
          </button>

          <button className="navigation-option waze" onClick={handleWaze}>
            <div className="navigation-option-icon waze-icon">
              <img src="/spotCard/waze.png" alt="Waze" />
            </div>
            <div className="navigation-option-text">
              <span className="navigation-option-name">Waze</span>
              <span className="navigation-option-desc">Navegação com alertas de trânsito</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default NavigationModal
