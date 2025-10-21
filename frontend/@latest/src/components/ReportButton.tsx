import { MessageSquare } from 'lucide-react'
import type { ParkingSpot, Coordinates } from '../types/parking'

interface ReportButtonProps {
  spot: ParkingSpot
  userLocation: Coordinates | null
  onClick: () => void
}

// Calculate distance using Haversine formula
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3 // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lon2 - lon1) * Math.PI) / 180

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c // Distance in meters
}

const ReportButton = ({ spot, userLocation, onClick }: ReportButtonProps) => {
  // Only show button if user is within 500 meters
  if (!userLocation) {
    return null
  }

  const distance = calculateDistance(
    userLocation.lat,
    userLocation.lng,
    spot.latitude,
    spot.longitude
  )

  // Don't show button if user is more than 500 meters away
  if (distance > 500) {
    return null
  }

  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      className="report-status-button"
      title="Reportar status atual"
    >
      <MessageSquare size={16} />
      <span>Reportar</span>
    </button>
  )
}

export default ReportButton
