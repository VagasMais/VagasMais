import { MapPin, Navigation } from 'lucide-react'
import type { ParkingSpot, Coordinates } from '../types/parking'
import { useRoute } from '../hooks/useRoute'

interface ParkingSpotCardProps {
  spot: ParkingSpot
  isSelected: boolean
  onSelect: () => void
  onViewRoute?: () => void
  onNavigate?: () => void
  userLocation?: Coordinates | null
}

/**
 * Card component displaying parking spot information
 * Shows availability, distance, and navigation options
 */
const ParkingSpotCard = ({
  spot,
  isSelected,
  onSelect,
  onViewRoute,
  onNavigate,
  userLocation
}: ParkingSpotCardProps) => {
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
                src="/pcd.png"
                alt="Vaga para pessoa com deficiência"
                title="Vaga para pessoa com deficiência"
                className="audience-icon"
              />
            )}
            {spot.parking_pregnant && (
              <img
                src="/gestante.png"
                alt="Vaga para gestante"
                title="Vaga para gestante"
                className="audience-icon"
              />
            )}
            {spot.parking_elderly && (
              <img
                src="/idoso.png"
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
  )
}

export default ParkingSpotCard
