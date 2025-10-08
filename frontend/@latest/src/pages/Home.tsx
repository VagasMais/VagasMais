import { useState, useEffect, useRef } from 'react'
import { MapPin, Navigation, Search, X, Loader } from 'lucide-react'

interface Vaga {
  _id: string
  nome: string
  endereco: string
  latitude: number
  longitude: number
  total_vagas: number
  vagas_disponiveis: number
  tipo: 'publica' | 'privada'
}

// URL do backend - ajuste conforme necessário
const API_URL = 'http://localhost:8000'

function Home() {
  const [vagas, setVagas] = useState<Vaga[]>([])
  const [vagaSelecionada, setVagaSelecionada] = useState<Vaga | null>(null)
  const [localizacaoUsuario, setLocalizacaoUsuario] = useState<{ lat: number; lng: number } | null>(null)
  const [busca, setBusca] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const mapRef = useRef<HTMLDivElement>(null)
  const googleMapRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const directionsRendererRef = useRef<any>(null);

  // Buscar vagas do backend
  useEffect(() => {
    buscarVagas()
    obterLocalizacao()
  }, [])

  const buscarVagas = async () => {
    try {
      setCarregando(true)
  const response = await fetch(`${API_URL}/vagas`)
      
      if (!response.ok) {
        throw new Error('Erro ao buscar vagas')
      }
      
      const data = await response.json()
      setVagas(data)
      setErro('')
    } catch (error) {
      console.error('Erro:', error)
      setErro('Não foi possível carregar as vagas. Tente novamente mais tarde.')
    } finally {
      setCarregando(false)
    }
  }

  const obterLocalizacao = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocalizacaoUsuario({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.error('Erro ao obter localização:', error)
          setErro('Não foi possível obter sua localização. Tente novamente mais tarde.')
          // Usar localização padrão (Rio de Janeiro)
          setLocalizacaoUsuario({
            lat: -22.9068,
            lng: -43.1729
          })
        }
      )
    } else {
      setErro('Não foi possível obter sua localização. Tente novamente mais tarde.')
      setLocalizacaoUsuario({
        lat: -22.9068,
        lng: -43.1729
      })
    }
  }

  // Inicializar Google Maps
  useEffect(() => {
    if (!mapRef.current || vagas.length === 0) return

    const initMap = () => {
      const w = window as any
      
      if (!w.google) {
        console.error('Google Maps não carregado')
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

      googleMapRef.current = map

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
        const marker = new w.google.maps.Marker({
          position: { lat: vaga.latitude, lng: vaga.longitude },
          map,
          icon: {
            path: w.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: vaga.vagas_disponiveis > 0 ? '#10b981' : '#ef4444',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2
          },
          title: vaga.nome
        })

        marker.addListener('click', () => {
          setVagaSelecionada(vaga)
          map.panTo({ lat: vaga.latitude, lng: vaga.longitude })
        })

        markersRef.current.push(marker)
      })
    }

    const w = window as any
    
    if (w.google) {
      initMap()
    } else {
      // Carregar Google Maps API
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`
      script.async = true
      script.onload = initMap
      script.onerror = () => {
        console.error('Erro ao carregar Google Maps')
        setErro('Erro ao carregar o mapa. Verifique a chave da API.')
      }
      document.head.appendChild(script)
    }
  }, [vagas, localizacaoUsuario])

  const tracarRota = (vaga: Vaga) => {
    if (!localizacaoUsuario) {
      alert('Permita o acesso à sua localização para traçar rotas');
      return;
    }
    const w = window as any;
    if (!w.google || !googleMapRef.current) {
      setErro('Google Maps não carregado');
      return;
    }
    // Limpa rota anterior
    if (directionsRendererRef.current) {
      directionsRendererRef.current.setMap(null);
      directionsRendererRef.current = null;
    }
    const directionsService = new w.google.maps.DirectionsService();
    const directionsRenderer = new w.google.maps.DirectionsRenderer({ suppressMarkers: false });
    directionsRenderer.setMap(googleMapRef.current);
    directionsRendererRef.current = directionsRenderer;
    directionsService.route(
      {
        origin: { lat: localizacaoUsuario.lat, lng: localizacaoUsuario.lng },
        destination: { lat: vaga.latitude, lng: vaga.longitude },
        travelMode: w.google.maps.TravelMode.DRIVING
      },
      (result: any, status: string) => {
        console.log('DirectionsService status:', status, result);
        console.log('Origem:', localizacaoUsuario, 'Destino:', vaga);
        if (status === 'OK') {
          directionsRenderer.setDirections(result);
        } else {
          setErro('Não foi possível traçar a rota.');
        }
      }
    );
  }

  const vagasFiltradas = vagas.filter(vaga =>
    vaga.nome.toLowerCase().includes(busca.toLowerCase()) ||
    vaga.endereco.toLowerCase().includes(busca.toLowerCase())
  )

  return (
    <div className="home">
      {/* Barra de busca */}
      <div className="search-bar">
        <Search size={20} className="search-icon" />
        <input
          type="text"
          placeholder="Buscar por local..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="search-input"
        />
        {busca && (
          <button onClick={() => setBusca('')} className="clear-button">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Mapa */}
      <div className="map-container">
        {carregando ? (
          <div className="loading">
            <Loader className="spinner" size={40} />
            <p>Carregando vagas...</p>
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>

      {/* Lista de vagas */}
      <div className="vagas-list">
        <h2 className="list-title">
          Vagas Disponíveis ({vagasFiltradas.length})
        </h2>
        <div className="vagas-grid">
          {vagasFiltradas.map(vaga => (
            <div
              key={vaga._id}
              className={`vaga-card ${vagaSelecionada?._id === vaga._id ? 'selected' : ''}`}
              onClick={() => setVagaSelecionada(vaga)}
            >
              <div className="vaga-header">
                <MapPin size={20} className="vaga-icon" />
                <h3 className="vaga-nome">{vaga.nome}</h3>
              </div>
              <p className="vaga-endereco">{vaga.endereco}</p>
              <div className="vaga-info">
                <span className={`vaga-status ${vaga.vagas_disponiveis > 0 ? 'disponivel' : 'ocupado'}`}>
                  {vaga.vagas_disponiveis > 0 ? 'Disponível' : 'Ocupado'}
                </span>
                <span className="vaga-count">
                  {vaga.vagas_disponiveis}/{vaga.total_vagas} vagas
                </span>
              </div>
              {localizacaoUsuario && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    tracarRota(vaga)
                  }}
                  className="rota-button"
                >
                  <Navigation size={16} />
                  Ver rota
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home