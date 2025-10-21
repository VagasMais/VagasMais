import ParkingSpotCard from './ParkingSpotCard'
import type { ParkingSpot, Coordinates } from '../types/parking'
import type { ParkingSpotWithReport } from '../hooks/useParkingSpotsWithReports'

interface ParkingSpotsListProps {
  spots: ParkingSpotWithReport[]
  selectedSpot: ParkingSpot | null
  onSelect: (spot: ParkingSpot) => void
  onViewRoute?: (spot: ParkingSpot) => void
  onNavigate?: (spot: ParkingSpot) => void
  userLocation: Coordinates | null
  onReportSuccess?: () => void
}

/**
 * List component displaying all parking spots
 * Renders a grid of parking spot cards
 */
const ParkingSpotsList = ({
  spots,
  selectedSpot,
  onSelect,
  onViewRoute,
  onNavigate,
  userLocation,
  onReportSuccess
}: ParkingSpotsListProps) => {
  return (
    <div className="vagas-list">
      <h2 className="list-title">
        Vagas por perto ({spots.length})
      </h2>
      <div className="vagas-grid">
        {spots.map(spot => (
          <ParkingSpotCard
            key={spot._id}
            spot={spot}
            isSelected={selectedSpot?._id === spot._id}
            onSelect={() => onSelect(spot)}
            onViewRoute={userLocation ? () => onViewRoute?.(spot) : undefined}
            onNavigate={userLocation ? () => onNavigate?.(spot) : undefined}
            userLocation={userLocation}
            latestReport={spot.latestReport}
            onReportSuccess={onReportSuccess}
          />
        ))}
      </div>
    </div>
  )
}

export default ParkingSpotsList
