import { useState, useRef } from 'react'
import { Loader } from 'lucide-react'
import type { ParkingSpot, Coordinates } from '../types/parking'
import ParkingMap from '../components/ParkingMap'
import AddressSearchBar from '../components/AddressSearchBar'
import ParkingSpotsList from '../components/ParkingSpotsList'
import { useParkingSpots } from '../hooks/useParkingSpots'
import { useLocation } from '../hooks/useLocation'
import { useGeocode } from '../hooks/useGeocode'
import { openExternalNavigation } from '../utils/externalNavigation'
import { SEARCH_RADIUS_KM, NEARBY_RADIUS_KM, FOCUSED_ZOOM, ERROR_MESSAGES } from '../constants/defaults'

/**
 * Map page component
 * Displays map, search, and parking spots list
 */
function MapPage() {
  const { spots, loading, error: spotsError } = useParkingSpots()
  const { location: userLocation, error: locationError } = useLocation()
  const { calculateDistance } = useGeocode()
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [mapError, setMapError] = useState('')
  const [selectedAddress, setSelectedAddress] = useState<Coordinates | null>(null)
  const googleMapRef = useRef<google.maps.Map | null>(null)
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null)
  const searchMarkerRef = useRef<google.maps.Marker | null>(null)

  /**
   * Draw route on the map from user location to a parking spot
   */
  const drawRoute = (spot: ParkingSpot) => {
    if (!userLocation) {
      alert(ERROR_MESSAGES.ALLOW_LOCATION_ACCESS)
      return
    }

    // Ensure google maps is available
    if (typeof google === 'undefined' || !googleMapRef.current) {
      setMapError(ERROR_MESSAGES.MAPS_NOT_LOADED)
      return
    }

    // Clear previous route
    if (directionsRendererRef.current) {
      directionsRendererRef.current.setMap(null)
      directionsRendererRef.current = null
    }

    const directionsService = new google.maps.DirectionsService()
    const directionsRenderer = new google.maps.DirectionsRenderer({ suppressMarkers: false })
    directionsRenderer.setMap(googleMapRef.current)
    directionsRendererRef.current = directionsRenderer

    directionsService.route(
      {
        origin: { lat: userLocation.lat, lng: userLocation.lng },
        destination: { lat: spot.latitude, lng: spot.longitude },
        travelMode: google.maps.TravelMode.DRIVING
      },
      (result: google.maps.DirectionsResult | null, status: google.maps.DirectionsStatus) => {
        if (status === 'OK' && result) {
          directionsRenderer.setDirections(result)
        } else {
          console.error('DirectionsService failed:', status, result)
          setMapError(ERROR_MESSAGES.DRAW_ROUTE_FAILED)
        }
      }
    )
  }

  /**
   * Handle address selection from search
   */
  const handleSelectAddress = (_address: string, coordinates: Coordinates) => {
    setSelectedAddress(coordinates)

    // Move map to selected address
    if (googleMapRef.current) {
      googleMapRef.current.panTo(coordinates)
      googleMapRef.current.setZoom(FOCUSED_ZOOM)

      // Add marker at searched location
      if (typeof google === 'undefined') return

      // Remove previous marker
      if (searchMarkerRef.current) {
        searchMarkerRef.current.setMap(null)
      }

      // Create new marker
      searchMarkerRef.current = new google.maps.Marker({
        position: coordinates,
        map: googleMapRef.current,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: '#3b82f6',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 3
        },
        title: 'Local pesquisado'
      })
    }
  }

  /**
   * Clear search and reset map
   */
  const handleClearSearch = () => {
    setSearchQuery('')
    setSelectedAddress(null)

    // Remove search marker
    if (searchMarkerRef.current) {
      searchMarkerRef.current.setMap(null)
      searchMarkerRef.current = null
    }
  }

  /**
   * Filter spots by text search OR proximity to selected address
   */
  const filteredSpots = spots.filter(spot => {
    // Filter by text (name or address)
    const matchesText = spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       spot.address.toLowerCase().includes(searchQuery.toLowerCase())

    // If there's a selected address, filter by proximity (within SEARCH_RADIUS_KM)
    if (selectedAddress) {
      const distance = calculateDistance(
        selectedAddress,
        { lat: spot.latitude, lng: spot.longitude }
      )
      return distance <= SEARCH_RADIUS_KM
    }

    return matchesText
  })

  // Get IDs of spots very close to selected address (for highlighting on map)
  const nearbySpotIds = selectedAddress
    ? spots
        .filter(spot => {
          const distance = calculateDistance(
            selectedAddress,
            { lat: spot.latitude, lng: spot.longitude }
          )
          return distance <= NEARBY_RADIUS_KM
        })
        .map(spot => spot._id)
    : filteredSpots.map(spot => spot._id)

  return (
    <div className="home">
      {/* Search bar */}
      <AddressSearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        onClear={handleClearSearch}
        onSelectAddress={handleSelectAddress}
        placeholder="Buscar por endereço..."
      />

      {/* Map */}
      {loading ? (
        <div className="loading">
          <Loader className="spinner" size={40} />
          <p>Carregando vagas...</p>
        </div>
      ) : (
        <ParkingMap
          spots={spots}
          userLocation={userLocation}
          onSelectSpot={setSelectedSpot}
          error={mapError}
          setError={setMapError}
          setSelectedSpot={setSelectedSpot}
          googleMapRef={googleMapRef}
          nearbySpotIds={nearbySpotIds}
        />
      )}

      {/* Spots list */}
      <ParkingSpotsList
        spots={filteredSpots}
        selectedSpot={selectedSpot}
        onSelect={setSelectedSpot}
        onViewRoute={userLocation ? drawRoute : undefined}
        onNavigate={userLocation
          ? (spot: ParkingSpot) => openExternalNavigation(userLocation, spot.latitude, spot.longitude)
          : undefined}
        userLocation={userLocation}
      />

      {/* Location error */}
      {locationError && (
        <div style={{
          margin: '1rem auto',
          maxWidth: 400,
          background: '#fef3c7',
          padding: '0.75rem 1rem',
          borderRadius: '8px',
          fontSize: '0.875rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          ⚠️ {locationError}
        </div>
      )}

      {/* Spots error (backend) */}
      {spotsError && (
        <div style={{
          margin: '1rem auto',
          maxWidth: 400,
          background: '#fef3c7',
          padding: '0.75rem 1rem',
          borderRadius: '8px',
          fontSize: '0.875rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          ⚠️ {spotsError}
        </div>
      )}
    </div>
  )
}

export default MapPage
