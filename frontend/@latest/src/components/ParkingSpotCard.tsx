import { MapPin, Navigation } from 'lucide-react'
import { useState } from 'react'
import type { ParkingSpot, Coordinates } from '../types/parking'
import { useRoute } from '../hooks/useRoute'
import StreetViewModal from './StreetViewModal'

interface ParkingSpotCardProps {
  spot: ParkingSpot
  isSelected: boolean
  onSelect: () => void
  onViewRoute?: () => void
  onNavigate?: () => void
  userLocation?: Coordinates | null
}

const ParkingSpotCard = ({
  spot,
  isSelected,
  onSelect,
  onViewRoute,
  onNavigate,
  userLocation
}: ParkingSpotCardProps) => {
  const [isStreetViewOpen, setIsStreetViewOpen] = useState(false)

  const { distanceText, durationText, loading, error } = useRoute(
    userLocation ?? null,
    { lat: spot.latitude, lng: spot.longitude }
  )

  const isAvailable = spot.availableSpots > 0

  return (
    <div
      className={`vaga-card ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
    >
      <div className="vaga-header">
        <div className="vaga-header-left">
          <MapPin size={20} className="vaga-icon" />
          <h3 className="vaga-nome">{spot.name}</h3>
        </div>

        {/* Ícones indicando o público-alvo da vaga */}
        {(spot.parking_disabled || spot.parking_pregnant || spot.parking_elderly) && (
          <div className="vaga-target-audience">
            {spot.parking_disabled && (
              <img
                src="/spotCard/pcd.png"
                alt="Vaga para pessoa com deficiência"
                title="Vaga para pessoa com deficiência"
                className="audience-icon"
              />
            )}
            {spot.parking_pregnant && (
              <img
                src="/spotCard/gestante.png"
                alt="Vaga para gestante"
                title="Vaga para gestante"
                className="audience-icon"
              />
            )}
            {spot.parking_elderly && (
              <img
                src="/spotCard/idoso.png"
                alt="Vaga para idoso"
                title="Vaga para idoso"
                className="audience-icon"
              />
            )}
          </div>
        )}
      </div>

      <p className="vaga-endereco">{spot.address}</p>

      {userLocation && (
        <div className="vaga-route-info">
          {loading && <small>Carregando rota...</small>}
          {error && <small style={{ color: '#b91c1c' }}>⚠️ {error}</small>}
          {!loading && !error && distanceText && durationText && (
            <small>{distanceText} · {durationText}</small>
          )}
        </div>
      )}

      <div className="vaga-info">
        <span className={`vaga-status ${isAvailable ? 'disponivel' : 'ocupado'}`}>
          {isAvailable ? 'Disponível' : 'Ocupado'}
        </span>

        <span className="vaga-count">
          {spot.availableSpots}/{spot.totalSpots} vagas
        </span>
      </div>

      <div className="vaga-actions">
        <div className="vaga-actions-left">
          {userLocation && (onNavigate || onViewRoute) && (
            <button
              onClick={e => {
                e.stopPropagation()
                // Prioritize external navigation (turn-by-turn) if available
                if (onNavigate) return onNavigate()
                if (onViewRoute) return onViewRoute()
              }}
              className="rota-button"
            >
              <Navigation size={16} />
              Ver rota
            </button>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation()
            setIsStreetViewOpen(true)
          }}
          className="camera-button"
          aria-label="Ver Street View"
          title="Ver foto do local"
        >
          <img src="/spotCard/camera.png" alt="Câmera" className="camera-icon" />
        </button>
      </div>

      <StreetViewModal
        isOpen={isStreetViewOpen}
        onClose={() => setIsStreetViewOpen(false)}
        location={{ lat: spot.latitude, lng: spot.longitude }}
        title={spot.name}
      />
    </div>
  )
}

export default ParkingSpotCard
