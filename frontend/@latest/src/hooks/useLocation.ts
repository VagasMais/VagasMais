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
    if (navigator.geolocation) {
      const options = {
        enableHighAccuracy: false, // Mais rápido, menos preciso
        timeout: 10000, // 10 segundos
        maximumAge: 300000 // Cache de 5 minutos
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
          setError('') // Limpa erro se conseguiu localização
        },
        (error) => {
          let errorMessage = ERROR_MESSAGES.LOCATION_UNAVAILABLE

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Permissão de localização negada. Usando localização padrão.'
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Localização indisponível. Usando localização padrão.'
              break
            case error.TIMEOUT:
              errorMessage = 'Tempo esgotado ao obter localização. Usando localização padrão.'
              break
          }

          console.warn('Error getting location:', errorMessage, error)
          setError(errorMessage)
          // Use default location (Rio de Janeiro)
        },
        options
      )
    } else {
      setError(ERROR_MESSAGES.LOCATION_UNAVAILABLE)
    }
  }

  return { location, error, fetchLocation }
}
