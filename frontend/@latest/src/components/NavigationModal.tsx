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
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#4285F4"/>
                <path d="M12 6.5c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5z" fill="#EA4335"/>
                <path d="M12 11.5c-1.38 0-2.5-1.12-2.5-2.5h5c0 1.38-1.12 2.5-2.5 2.5z" fill="#FBBC04"/>
                <path d="M12 6.5v5c1.38 0 2.5-1.12 2.5-2.5S13.38 6.5 12 6.5z" fill="#34A853"/>
              </svg>
            </div>
            <div className="navigation-option-text">
              <span className="navigation-option-name">Google Maps</span>
              <span className="navigation-option-desc">Navegação turn-by-turn</span>
            </div>
          </button>

          <button className="navigation-option waze" onClick={handleWaze}>
            <div className="navigation-option-icon waze-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5h3V8h4v4h3l-5 5z" fill="#00D8FF"/>
              </svg>
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
