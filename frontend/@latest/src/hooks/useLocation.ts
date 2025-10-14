import { useState, useEffect } from 'react'
import type { Coordinates } from '../types/parking'
import { DEFAULT_LOCATION, ERROR_MESSAGES } from '../constants/defaults'

/**
 * Hook to get and manage user's geolocation
 * Falls back to default location (Rio de Janeiro) if unavailable
 */
export function useLocation() {
  const [location, setLocation] = useState<Coordinates | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchLocation()
  }, [])

  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.error('Error getting location:', error)
          setError(ERROR_MESSAGES.LOCATION_UNAVAILABLE)
          // Use default location (Rio de Janeiro)
          setLocation(DEFAULT_LOCATION)
        }
      )
    } else {
      setError(ERROR_MESSAGES.LOCATION_UNAVAILABLE)
      setLocation(DEFAULT_LOCATION)
    }
  }

  return { location, error, fetchLocation }
}
