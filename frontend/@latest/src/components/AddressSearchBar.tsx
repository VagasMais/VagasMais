import { Search, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { Coordinates } from '../types/parking'

interface AddressSearchBarProps {
  value: string
  onChange: (value: string) => void
  onClear?: () => void
  placeholder?: string
  onSelectAddress?: (address: string, coordinates: Coordinates) => void
}

interface PlaceSuggestion {
  placeId: string
  text: string
  mainText: string
  secondaryText: string
}

/**
 * Search bar with Google Places autocomplete
 * Uses the new AutocompleteSuggestion API (replaces deprecated AutocompleteService)
 */
const AddressSearchBar = ({
  value,
  onChange,
  onClear,
  placeholder,
  onSelectAddress
}: AddressSearchBarProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const sessionTokenRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null)
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [placesLibrary, setPlacesLibrary] = useState<any>(null)

  // Create a local alias for the google namespace type using globalThis to avoid self-reference
  type GoogleNamespace = typeof globalThis.google
  const google = typeof window !== 'undefined'
    ? (globalThis as unknown as { google?: GoogleNamespace }).google
    : undefined

  useEffect(() => {
    let mounted = true
    let initTimer: number | null = null

    const initAutocomplete = async () => {
      // Robust validation
      if (!mounted || typeof google === 'undefined' || !google?.maps) {
        return false
      }

      // Check if importLibrary is available (new API)
      if (typeof google.maps.importLibrary === 'function') {
        try {
          console.log('Loading new Places API with importLibrary...')
          const placesLib = await google.maps.importLibrary("places") as any

          if (!mounted) return false

          const { Place, AutocompleteSessionToken, AutocompleteSuggestion } = placesLib

          setPlacesLibrary({ Place, AutocompleteSessionToken, AutocompleteSuggestion })

          // Create a session token for billing optimization
          sessionTokenRef.current = new AutocompleteSessionToken()
          console.log('New Places API loaded successfully')
          return true
        } catch (error) {
          console.warn('Error loading new Places library, falling back to legacy API:', error)
          // Fall through to legacy API
        }
      } else {
        console.log('importLibrary not available, using legacy API')
      }

      // Fallback to legacy AutocompleteService if new API is not available
      if (google.maps.places?.AutocompleteService) {
        console.log('Using legacy AutocompleteService API')
        setPlacesLibrary({ legacy: true })
        return true
      }

      return false
    }

    // Try to initialize immediately if google is already loaded
    if (typeof google !== 'undefined' && google?.maps) {
      initAutocomplete()
    }

    // Listen for Google Maps loaded event
    const handleGoogleMapsLoaded = () => {
      // Wait a bit for libraries to be fully loaded
      if (initTimer) clearTimeout(initTimer)

      initTimer = setTimeout(async () => {
        let attempts = 0
        const maxAttempts = 10

        while (attempts < maxAttempts && mounted) {
          const success = await initAutocomplete()

          if (success) {
            console.log('Places API initialized successfully')
            return
          }

          attempts++

          if (attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 500))
          }
        }

        if (mounted && attempts >= maxAttempts) {
          console.error('Failed to initialize Places API after', maxAttempts, 'attempts')
          console.error('Please check:')
          console.error('1. Google Maps API key is valid')
          console.error('2. Places API is enabled in Google Cloud Console')
          console.error('3. API key has no restrictions blocking this domain')
        }
      }, 500)
    }

    window.addEventListener('google-maps-loaded', handleGoogleMapsLoaded)

    // Cleanup on unmount
    return () => {
      mounted = false
      if (initTimer) clearTimeout(initTimer)
      sessionTokenRef.current = null
      window.removeEventListener('google-maps-loaded', handleGoogleMapsLoaded)
    }
  }, [google])

  const handleInputChange = async (text: string) => {
    onChange(text)

    if (!text || text.length < 3) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    if (!placesLibrary || typeof google === 'undefined') {
      console.warn('Google Maps Places API not loaded yet')
      return
    }

    try {
      // Check if using legacy API
      if (placesLibrary.legacy) {
        // Use legacy AutocompleteService
        const autocompleteService = new google.maps.places.AutocompleteService()

        autocompleteService.getPlacePredictions(
          {
            input: text,
            componentRestrictions: { country: 'br' }
          },
          (predictions, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
              const transformedSuggestions: PlaceSuggestion[] = predictions.map((prediction: any) => ({
                placeId: prediction.place_id,
                text: prediction.description,
                mainText: prediction.structured_formatting.main_text,
                secondaryText: prediction.structured_formatting.secondary_text || ''
              }))
              setSuggestions(transformedSuggestions)
              setShowSuggestions(true)
            } else {
              setSuggestions([])
              setShowSuggestions(false)
            }
          }
        )
      } else {
        // Use new AutocompleteSuggestion API
        const { AutocompleteSuggestion } = placesLibrary

        const request = {
          input: text,
          region: 'br',
          language: 'pt-BR',
          sessionToken: sessionTokenRef.current
        }

        const { suggestions: apiSuggestions } = await AutocompleteSuggestion.fetchAutocompleteSuggestions(request)

        if (apiSuggestions && apiSuggestions.length > 0) {
          const transformedSuggestions: PlaceSuggestion[] = apiSuggestions.map((suggestion: any) => ({
            placeId: suggestion.placePrediction.placeId,
            text: suggestion.placePrediction.text.text,
            mainText: suggestion.placePrediction.structuredFormat.mainText.text,
            secondaryText: suggestion.placePrediction.structuredFormat.secondaryText?.text || ''
          }))

          setSuggestions(transformedSuggestions)
          setShowSuggestions(true)
        } else {
          setSuggestions([])
          setShowSuggestions(false)
        }
      }
    } catch (err) {
      console.error('Error fetching suggestions:', err)
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  const handleSelectSuggestion = async (suggestion: PlaceSuggestion) => {
    onChange(suggestion.text)
    setShowSuggestions(false)
    setSuggestions([])

    if (!placesLibrary || typeof google === 'undefined') return

    try {
      if (placesLibrary.legacy) {
        // Use legacy Geocoder API
        const geocoder = new google.maps.Geocoder()
        geocoder.geocode(
          { placeId: suggestion.placeId },
          (results, status) => {
            if (status === 'OK' && results && results[0]) {
              const location = results[0].geometry.location
              onSelectAddress?.(suggestion.text, {
                lat: location.lat(),
                lng: location.lng(),
              })
            } else {
              console.error('Geocoder failed:', status)
            }
          }
        )
      } else {
        // Use new Place API
        const { Place, AutocompleteSessionToken } = placesLibrary

        // Create a new session token for the next search
        sessionTokenRef.current = new AutocompleteSessionToken()

        // Create a Place instance from the place ID
        const place = new Place({
          id: suggestion.placeId,
          requestedLanguage: 'pt-BR'
        })

        // Fetch location details
        await place.fetchFields({ fields: ['location', 'formattedAddress'] })

        if (place.location) {
          onSelectAddress?.(suggestion.text, {
            lat: place.location.lat(),
            lng: place.location.lng(),
          })
        }
      }
    } catch (error) {
      console.error('Error fetching place details:', error)
    }
  }

  const handleClear = () => {
    setSuggestions([])
    setShowSuggestions(false)
    onClear?.()
  }

  return (
    <div className="search-bar-container" style={{ position: 'relative' }}>
      <div className="search-bar">
        <Search size={20} className="search-icon" />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder || 'Buscar por endereço...'}
          value={value}
          onChange={e => handleInputChange(e.target.value)}
          className="search-input"
        />
        {value && (
          <button onClick={handleClear} className="clear-button">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Suggestions list */}
      {showSuggestions && suggestions.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          marginTop: '4px',
          maxHeight: '300px',
          overflowY: 'auto',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          zIndex: 1000
        }}>
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.placeId}
              onClick={() => handleSelectSuggestion(suggestion)}
              style={{
                padding: '12px 16px',
                cursor: 'pointer',
                borderBottom: '1px solid #f3f4f6',
                transition: 'background 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
              onMouseLeave={e => e.currentTarget.style.background = 'white'}
            >
              <div style={{ fontWeight: 500, fontSize: '14px', color: '#111827' }}>
                {suggestion.mainText}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                {suggestion.secondaryText}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AddressSearchBar
