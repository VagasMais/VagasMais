import { useEffect, useRef } from 'react'


interface MapContainerProps {
  vagas: any[]
  localizacaoUsuario: { lat: number; lng: number } | null
  onSelectVaga: (vaga: any) => void
  erro: string
  setErro: (erro: string) => void
  setVagaSelecionada: (vaga: any) => void
  googleMapRef: React.RefObject<any>
  vagasProximas?: string[] // IDs das vagas próximas ao endereço buscado
}

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

const MapContainer = ({ vagas, localizacaoUsuario, onSelectVaga, erro, setErro, setVagaSelecionada, googleMapRef, vagasProximas = [] }: MapContainerProps) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const markersRef = useRef<any[]>([])

  useEffect(() => {
    if (!mapRef.current || vagas.length === 0) return

    const initMap = () => {
      const w = window as any
      if (!w.google) {
        setErro('Google Maps não carregado')
        return
      }
      const center = localizacaoUsuario || { lat: vagas[0].latitude, lng: vagas[0].longitude }
      const map = new w.google.maps.Map(mapRef.current, {
        center,
        zoom: 14,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      })
      // Atualiza a referência do mapa no objeto recebido por prop
      if (googleMapRef) {
        googleMapRef.current = map
      }
      // Adicionar marcador da localização do usuário
      if (localizacaoUsuario) {
        new w.google.maps.Marker({
          position: localizacaoUsuario,
          map,
          icon: {
            path: w.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#4285F4',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2
          },
          title: 'Sua localização'
        })
      }
      // Limpar marcadores antigos
      markersRef.current.forEach(marker => marker.setMap(null))
      markersRef.current = []
      // Adicionar marcadores das vagas
      vagas.forEach(vaga => {
        const isProxima = vagasProximas.includes(vaga._id)
        const marker = new w.google.maps.Marker({
          position: { lat: vaga.latitude, lng: vaga.longitude },
          map,
          icon: {
            path: w.google.maps.SymbolPath.CIRCLE,
            scale: isProxima ? 12 : 10, // Vagas próximas são maiores
            fillColor: vaga.vagas_disponiveis > 0 ? '#10b981' : '#ef4444',
            fillOpacity: isProxima ? 1 : 0.7, // Vagas próximas mais visíveis
            strokeColor: isProxima ? '#facc15' : '#ffffff', // Borda amarela para vagas próximas
            strokeWeight: isProxima ? 3 : 2
          },
          title: vaga.nome,
          zIndex: isProxima ? 1000 : 1 // Vagas próximas aparecem por cima
        })
        marker.addListener('click', () => {
          setVagaSelecionada(vaga)
          map.panTo({ lat: vaga.latitude, lng: vaga.longitude })
          onSelectVaga(vaga)
        })
        markersRef.current.push(marker)
      })
    }
    const w = window as any
    if (w.google) {
      initMap()
    } else {
      // Verificar se já existe script do Google Maps
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]')
      if (existingScript) {
        console.log('Script do Google Maps já existe, não recarregar')
        return
      }

      // Carregar Google Maps API
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&v=weekly`
      script.async = true
      script.defer = true
      script.onload = () => {
        console.log('Google Maps API carregada com sucesso')
        // Esperar um pouco para garantir que as bibliotecas estejam prontas
        setTimeout(() => {
          initMap()
          // Disparar evento customizado para notificar outros componentes
          window.dispatchEvent(new Event('google-maps-loaded'))
        }, 100)
      }
      script.onerror = () => {
        setErro('Erro ao carregar o mapa. Verifique a chave da API.')
      }
      document.head.appendChild(script)
    }
  }, [vagas, localizacaoUsuario, setErro, setVagaSelecionada, onSelectVaga, googleMapRef, vagasProximas])

  return (
    <div className="map-container">
      <div ref={mapRef} className="map" />
      {erro && (
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
          ⚠️ {erro}
        </div>
      )}
    </div>
  )
}

export default MapContainer
