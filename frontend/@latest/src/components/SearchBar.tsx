import { Search, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onClear?: () => void
  placeholder?: string
  onSelectAddress?: (address: string, coordinates: { lat: number; lng: number }) => void
}

const SearchBar = ({ value, onChange, onClear, placeholder, onSelectAddress }: SearchBarProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<any>(null)
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [debugInfo, setDebugInfo] = useState<string>('')

  useEffect(() => {
    const initAutocomplete = () => {
      const w = window as any

      // Validação mais robusta
      if (!w.google?.maps?.places?.AutocompleteService) {
        console.log('Google Maps Places AutocompleteService ainda não disponível')
        setDebugInfo('⏳ Aguardando Google Maps...')
        return false
      }

      // Configurar Google Places Autocomplete
      if (!autocompleteRef.current) {
        try {
          console.log('Inicializando AutocompleteService')
          autocompleteRef.current = new w.google.maps.places.AutocompleteService()
          setDebugInfo('✅ Autocomplete pronto')
          console.log('AutocompleteService inicializado com sucesso')
          return true
        } catch (error) {
          console.error('Erro ao inicializar AutocompleteService:', error)
          setDebugInfo('❌ Erro ao inicializar')
          return false
        }
      }
      return true
    }

    // Tentar inicializar imediatamente
    initAutocomplete()

    // Escutar evento de carregamento do Google Maps
    const handleGoogleMapsLoaded = () => {
      console.log('Evento google-maps-loaded recebido, tentando inicializar...')
      // Tentar algumas vezes com delay
      let attempts = 0
      const tryInit = () => {
        if (initAutocomplete() || attempts >= 5) {
          return
        }
        attempts++
        console.log(`Tentativa ${attempts} de inicialização...`)
        setTimeout(tryInit, 200)
      }
      tryInit()
    }

    window.addEventListener('google-maps-loaded', handleGoogleMapsLoaded)

    // Cleanup ao desmontar
    return () => {
      autocompleteRef.current = null
      window.removeEventListener('google-maps-loaded', handleGoogleMapsLoaded)
    }
  }, [])

  const handleInputChange = async (texto: string) => {
    onChange(texto)

    if (!texto || texto.length < 3) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    const w = window as any
    if (!w.google?.maps?.places?.AutocompleteService) {
      console.warn('Google Maps Places API não carregada ainda')
      setDebugInfo('⚠️ API não carregada')
      return
    }

    if (!autocompleteRef.current) {
      console.warn('AutocompleteService não inicializado, tentando criar...')
      try {
        autocompleteRef.current = new w.google.maps.places.AutocompleteService()
        setDebugInfo('✅ Autocomplete pronto')
      } catch (error) {
        console.error('Erro ao criar AutocompleteService:', error)
        setDebugInfo('❌ Erro de inicialização')
        return
      }
    }

    // Buscar sugestões
    try {
      autocompleteRef.current.getPlacePredictions(
        {
          input: texto,
          componentRestrictions: { country: 'br' } // Restrito ao Brasil
        },
        (predictions: any, status: string) => {
          console.log('Autocomplete status:', status)
          if (predictions) {
            console.log('Predictions recebidas:', predictions.length)
          }

          if (status === w.google.maps.places.PlacesServiceStatus.OK && predictions) {
            setSuggestions(predictions)
            setShowSuggestions(true)
            setDebugInfo(`✅ ${predictions.length} sugestões`)
          } else if (status === 'ZERO_RESULTS') {
            console.log('Nenhum resultado encontrado')
            setSuggestions([])
            setShowSuggestions(false)
            setDebugInfo('ℹ️ Sem resultados')
          } else {
            console.warn('Status de erro:', status)
            setSuggestions([])
            setShowSuggestions(false)
            setDebugInfo(`⚠️ ${status}`)
          }
        }
      )
    } catch (error) {
      console.error('Erro ao buscar sugestões:', error)
      setDebugInfo('❌ Erro na busca')
    }
  }

  const handleSelectSuggestion = (suggestion: any) => {
    onChange(suggestion.description)
    setShowSuggestions(false)
    setSuggestions([])

    // Geocodificar o endereço selecionado
    const w = window as any
    if (!w.google) return

    const geocoder = new w.google.maps.Geocoder()
    geocoder.geocode({ placeId: suggestion.place_id }, (results: any, status: string) => {
      if (status === 'OK' && results[0]) {
        const location = results[0].geometry.location
        onSelectAddress?.(suggestion.description, {
          lat: location.lat(),
          lng: location.lng()
        })
      }
    })
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
        {debugInfo && (
          <div style={{
            position: 'absolute',
            right: value ? '45px' : '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '12px',
            color: '#6b7280'
          }}>
            {debugInfo}
          </div>
        )}
      </div>

      {/* Lista de sugestões */}
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

export default SearchBar
