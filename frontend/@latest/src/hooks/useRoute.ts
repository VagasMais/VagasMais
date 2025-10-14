import { useEffect, useState } from 'react'
import type { Coordinates } from '../types/parking'
import { ERROR_MESSAGES } from '../constants/defaults'

/**
 * Hook to get route information between two points
 * Uses Google Maps Directions API
 */
export function useRoute(origin: Coordinates | null, destination: Coordinates | null) {
  const [loading, setLoading] = useState(false)
  const [distanceText, setDistanceText] = useState<string | null>(null)
  const [durationText, setDurationText] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!origin || !destination) return
    if (typeof globalThis.google === 'undefined') return

    let mounted = true
    setLoading(true)
    const directionsService = new google.maps.DirectionsService()

    directionsService.route({
      origin,
      destination: destination,
      travelMode: google.maps.TravelMode.DRIVING,
      drivingOptions: { departureTime: new Date() } // Include traffic if available and API key allows
    }, (result, status) => {
      if (!mounted) return
      setLoading(false)

      if (status === 'OK' && result && result.routes?.length) {
        const leg = result.routes[0].legs[0]
        setDistanceText(leg.distance?.text ?? null)
        setDurationText(leg.duration?.text ?? null)
        setError(null)
      } else {
        setError(ERROR_MESSAGES.ROUTE_NOT_AVAILABLE)
      }
    })

    return () => { mounted = false }
  }, [origin?.lat, origin?.lng, destination?.lat, destination?.lng])

  return { loading, distanceText, durationText, error }
}
