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

/**
 * Search bar with Google Places autocomplete
 * Allows users to search for addresses and get coordinates
 */
const AddressSearchBar = ({
  value,
  onChange,
  onClear,
  placeholder,
  onSelectAddress
}: AddressSearchBarProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<google.maps.places.AutocompleteService | null>(null)
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Create a local alias for the google namespace type using globalThis to avoid self-reference
  type GoogleNamespace = typeof globalThis.google
  const google = typeof window !== 'undefined'
    ? (globalThis as unknown as { google?: GoogleNamespace }).google
    : undefined

  useEffect(() => {
    const initAutocomplete = () => {
      // Robust validation
      if (typeof google === 'undefined' || !google?.maps?.places?.AutocompleteService) {
        return false
      }

      // Setup Google Places Autocomplete
      if (!autocompleteRef.current) {
        try {
          autocompleteRef.current = new google.maps.places.AutocompleteService()
          return true
        } catch (error) {
          console.error('Error initializing AutocompleteService:', error)
          return false
        }
      }
      return true
    }

    // Try to initialize immediately
    initAutocomplete()

    // Listen for Google Maps loaded event
    const handleGoogleMapsLoaded = () => {
      // Try several times with delay
      let attempts = 0
      const tryInit = () => {
        if (initAutocomplete() || attempts >= 5) {
          return
        }
        attempts++
        setTimeout(tryInit, 200)
      }
      tryInit()
    }

    window.addEventListener('google-maps-loaded', handleGoogleMapsLoaded)

    // Cleanup on unmount
    return () => {
      autocompleteRef.current = null
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

    if (typeof google === 'undefined' || !google?.maps?.places?.AutocompleteService) {
      console.warn('Google Maps Places API not loaded yet')
      return
    }

    if (!autocompleteRef.current) {
      console.warn('AutocompleteService not initialized, trying to create...')
      try {
        autocompleteRef.current = new google.maps.places.AutocompleteService()
      } catch (error) {
        console.error('Error creating AutocompleteService:', error)
        return
      }
    }

    // Fetch suggestions
    try {
      autocompleteRef.current!.getPlacePredictions(
        {
          input: text,
          componentRestrictions: { country: 'br' } // Restricted to Brazil
        },
        (predictions, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
            setSuggestions(predictions)
            setShowSuggestions(true)
          } else {
            setSuggestions([])
            setShowSuggestions(false)
          }
        }
      )
    } catch (err) {
      console.error('Error fetching suggestions:', err)
    }
  }

  const handleSelectSuggestion = (suggestion: google.maps.places.AutocompletePrediction) => {
    onChange(suggestion.description)
    setShowSuggestions(false)
    setSuggestions([])

    // Geocode the selected address
    if (typeof google === 'undefined') return

    const geocoder = new google.maps.Geocoder()
    geocoder.geocode(
      { placeId: suggestion.place_id },
      (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
        if (status === 'OK' && results && results[0]) {
          const location = results[0].geometry.location
          onSelectAddress?.(suggestion.description, {
            lat: location.lat(),
            lng: location.lng(),
          })
        }
      }
    )
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
              key={suggestion.place_id}
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
                {suggestion.structured_formatting.main_text}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                {suggestion.structured_formatting.secondary_text}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AddressSearchBar
