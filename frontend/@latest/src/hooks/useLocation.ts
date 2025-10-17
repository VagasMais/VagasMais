import { useState, useEffect } from 'react'
import type { Coordinates } from '../types/parking'
import { ERROR_MESSAGES } from '../constants/defaults'

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
    if (!navigator.geolocation) {
      setError(ERROR_MESSAGES.LOCATION_UNAVAILABLE)
      return
    }

    // Try with low accuracy first (faster, uses network location)
    const lowAccuracyOptions = {
      enableHighAccuracy: false,
      timeout: 10000, // 10 seconds
      maximumAge: 300000 // Cache for 5 minutes
    }

    // Fallback with high accuracy (uses GPS)
    const highAccuracyOptions = {
      enableHighAccuracy: true,
      timeout: 15000, // 15 seconds
      maximumAge: 0 // No cache
    }

    const onSuccess = (position: GeolocationPosition) => {
      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      })
      setError('')
    }

    const onError = (error: GeolocationPositionError) => {
      let errorMessage = ERROR_MESSAGES.LOCATION_UNAVAILABLE

      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = ERROR_MESSAGES.LOCATION_PERMISSION_DENIED
          break
        case error.POSITION_UNAVAILABLE:
          errorMessage = ERROR_MESSAGES.LOCATION_POSITION_UNAVAILABLE
          // Try with high accuracy as fallback
          console.info('Trying with high accuracy GPS...')
          navigator.geolocation.getCurrentPosition(
            onSuccess,
            (highAccError) => {
              console.warn('High accuracy also failed:', highAccError)
              setError(errorMessage)
            },
            highAccuracyOptions
          )
          return // Don't set error yet, wait for high accuracy attempt
        case error.TIMEOUT:
          errorMessage = ERROR_MESSAGES.LOCATION_TIMEOUT
          break
      }

      console.warn('Error getting location:', errorMessage, error)
      setError(errorMessage)
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError, lowAccuracyOptions)
  }

  return { location, error, fetchLocation }
}
