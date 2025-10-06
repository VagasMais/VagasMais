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
      // Se não conseguir buscar do backend, usar dados de exemplo
      setVagas([
        {
          _id: '1',
          nome: 'Shopping Center',
          endereco: 'Av. Principal, 1000',
          latitude: -22.9068,
          longitude: -43.1729,
          total_vagas: 10,
          vagas_disponiveis: 3,
          tipo: 'privada'
        },
        {
          _id: '2',
          nome: 'Hospital Municipal',
          endereco: 'Rua da Saúde, 500',
          latitude: -22.9108,
          longitude: -43.1789,
          total_vagas: 8,
          vagas_disponiveis: 0,
          tipo: 'publica'
        },
        {
          _id: '3',
          nome: 'Parque Central',
          endereco: 'Av. dos Parques, 200',
          latitude: -22.9028,
          longitude: -43.1669,
          total_vagas: 5,
          vagas_disponiveis: 5,
          tipo: 'publica'
        }
      ])
      setErro('Usando dados de exemplo. Verifique o backend.')
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
          // Usar localização padrão (Rio de Janeiro)
          setLocalizacaoUsuario({
            lat: -22.9068,
            lng: -43.1729
          })
        }
      )
    } else {
      // Usar localização padrão
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
      // IMPORTANTE: Substitua YOUR_API_KEY pela sua chave real do Google Maps
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
      alert('Permita o acesso à sua localização para traçar rotas')
      return
    }

    const origem = `${localizacaoUsuario.lat},${localizacaoUsuario.lng}`
    const destino = `${vaga.latitude},${vaga.longitude}`
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origem}&destination=${destino}&travelmode=driving`
    window.open(url, '_blank')
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