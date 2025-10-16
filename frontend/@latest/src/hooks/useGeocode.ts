import { useState } from 'react'
import type { Coordinates } from '../types/parking'
import { ERROR_MESSAGES } from '../constants/defaults'

/**
 * Hook for geocoding addresses and calculating distances
 */
export function useGeocode() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  /**
   * Convert an address to coordinates using Google Geocoding API
   */
  const geocodeAddress = async (address: string): Promise<Coordinates | null> => {
    setLoading(true)
    setError('')

    try {
      if (typeof ((globalThis as unknown as { google?: unknown }).google) === 'undefined') {
        setError(ERROR_MESSAGES.MAPS_NOT_LOADED)
        return null
      }

      type GoogleNamespace = typeof globalThis.google
      const google = (globalThis as unknown as { google?: GoogleNamespace }).google!
      const geocoder = new google.maps.Geocoder()

      return new Promise((resolve, reject) => {
        geocoder.geocode(
          { address },
          (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
            setLoading(false)

            if (status === 'OK' && results && results[0]) {
              const location = results[0].geometry.location
              resolve({
                lat: location.lat(),
                lng: location.lng(),
              })
            } else {
              setError(ERROR_MESSAGES.ADDRESS_NOT_FOUND)
              reject(new Error(ERROR_MESSAGES.ADDRESS_NOT_FOUND))
            }
          }
        )
      })
    } catch {
      setLoading(false)
      setError(ERROR_MESSAGES.GEOCODING_ERROR)
      return null
    }
  }

  /**
   * Calculate distance between two coordinates using Haversine formula
   * @returns Distance in kilometers
   */
  const calculateDistance = (
    coord1: Coordinates,
    coord2: Coordinates
  ): number => {
    const R = 6371 // Earth's radius in km
    const dLat = (coord2.lat - coord1.lat) * Math.PI / 180
    const dLng = (coord2.lng - coord1.lng) * Math.PI / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(coord1.lat * Math.PI / 180) *
      Math.cos(coord2.lat * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c // Distance in km
  }

  return { geocodeAddress, calculateDistance, loading, error }
}
