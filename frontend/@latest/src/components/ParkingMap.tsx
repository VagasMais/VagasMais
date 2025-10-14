import { useEffect, useRef } from 'react'
import { loadGoogleMaps } from '../utils/googleMaps'
import type { ParkingSpot, Coordinates } from '../types/parking'
import { DEFAULT_ZOOM, ERROR_MESSAGES } from '../constants/defaults'

interface ParkingMapProps {
  spots: ParkingSpot[]
  userLocation: Coordinates | null
  onSelectSpot: (spot: ParkingSpot) => void
  error: string
  setError: (error: string) => void
  setSelectedSpot: (spot: ParkingSpot) => void
  googleMapRef: React.RefObject<google.maps.Map | null>
  nearbySpotIds?: string[] // IDs of spots near the searched address
}

/**
 * Interactive map component displaying parking spots
 * Uses Google Maps API to render markers and handle interactions
 */
const ParkingMap = ({
  spots,
  userLocation,
  onSelectSpot,
  error,
  setError,
  setSelectedSpot,
  googleMapRef,
  nearbySpotIds = []
}: ParkingMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const markersRef = useRef<google.maps.Marker[]>([])

  useEffect(() => {
    if (!mapRef.current || spots.length === 0) return

    const initMap = () => {
      if (typeof ((globalThis as unknown as { google?: unknown }).google) === 'undefined') {
        setError(ERROR_MESSAGES.MAPS_NOT_LOADED)
        return
      }

      type GoogleNamespace = typeof globalThis.google
      const google = (globalThis as unknown as { google?: GoogleNamespace }).google!
      const center = userLocation || { lat: spots[0].latitude, lng: spots[0].longitude }
      const map = new google.maps.Map(mapRef.current as HTMLDivElement, {
        center,
        zoom: DEFAULT_ZOOM,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      })

      // Update map reference
      if (googleMapRef) {
        googleMapRef.current = map
      }

      // Add user location marker
      if (userLocation) {
        new google.maps.Marker({
          position: userLocation,
          map,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#4285F4',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2
          },
          title: 'Sua localização'
        })
      }

      // Clear old markers
      markersRef.current.forEach(marker => marker.setMap(null))
      markersRef.current = []

      // Add parking spot markers
      spots.forEach(spot => {
        const isNearby = nearbySpotIds.includes(spot._id)
        const marker = new google.maps.Marker({
          position: { lat: spot.latitude, lng: spot.longitude },
          map,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: isNearby ? 12 : 10, // Nearby spots are larger
            fillColor: spot.availableSpots > 0 ? '#10b981' : '#ef4444',
            fillOpacity: isNearby ? 1 : 0.7, // Nearby spots more visible
            strokeColor: isNearby ? '#facc15' : '#ffffff', // Yellow border for nearby spots
            strokeWeight: isNearby ? 3 : 2
          },
          title: spot.name,
          zIndex: isNearby ? 1000 : 1 // Nearby spots appear on top
        })

        marker.addListener('click', () => {
          setSelectedSpot(spot)
          map.panTo({ lat: spot.latitude, lng: spot.longitude })
          onSelectSpot(spot)
        })

        markersRef.current.push(marker)
      })
    }

    if ('google' in window) {
      initMap()
    } else {
      loadGoogleMaps()
        .then(() => initMap())
        .catch(() => setError('Erro ao carregar o mapa. Verifique a chave da API.'))
    }
  }, [spots, userLocation, setError, setSelectedSpot, onSelectSpot, googleMapRef, nearbySpotIds])

  return (
    <div className="map-container">
      <div ref={mapRef} className="map" />
      {error && (
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#fef3c7',
          padding: '0.75rem 1rem',
          borderRadius: '8px',
          fontSize: '0.875rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          ⚠️ {error}
        </div>
      )}
    </div>
  )
}

export default ParkingMap
