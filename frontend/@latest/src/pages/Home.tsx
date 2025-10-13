import { useState, useRef } from 'react'
import { Loader } from 'lucide-react'
import { type Vaga } from '../components/VagaCard'
import MapContainer from '../components/MapContainer'
import SearchBar from '../components/SearchBar'
import VagasList from '../components/VagasList'
import { useVagas } from '../hooks/useVagas'
import { useLocalizacao } from '../hooks/useLocalizacao'
import { useGeocoding } from '../hooks/useGeocoding'

function Home() {
  const { vagas, carregando, erro: erroVagas } = useVagas()
  const { localizacao: localizacaoUsuario, erro: erroLocalizacao } = useLocalizacao()
  const { calcularDistancia } = useGeocoding()
  const [vagaSelecionada, setVagaSelecionada] = useState<Vaga | null>(null)
  const [busca, setBusca] = useState('')
  const [erroMapa, setErroMapa] = useState('')
  const [enderecoSelecionado, setEnderecoSelecionado] = useState<{ lat: number; lng: number } | null>(null)
  const googleMapRef = useRef<any>(null);
  const directionsRendererRef = useRef<any>(null);
  const searchMarkerRef = useRef<any>(null);

  const tracarRota = (vaga: Vaga) => {
    if (!localizacaoUsuario) {
      alert('Permita o acesso à sua localização para traçar rotas');
      return;
    }
    const w = window as any;
    if (!w.google || !googleMapRef.current) {
      setErroMapa('Google Maps não carregado');
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
          setErroMapa('Não foi possível traçar a rota.');
        }
      }
    );
  }

  // Tenta abrir a navegação no app nativo (Android Intent / comgooglemaps / maps) e faz fallback para o Google Maps web
  const abrirNavegacao = (origin: { lat: number; lng: number } | null, destLat: number, destLng: number) => {
    const dest = `${destLat},${destLng}`
    const originStr = origin ? `${origin.lat},${origin.lng}` : ''
    const ua = navigator.userAgent || ''
  const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream
    const isAndroid = /Android/.test(ua)

    // URIs / esquemas
    const googleIntent = `intent://google.navigation?q=${encodeURIComponent(dest)}#Intent;package=com.google.android.apps.maps;end`
    const googleNavScheme = `google.navigation:q=${encodeURIComponent(dest)}`
    const comGoogleMaps = originStr
      ? `comgooglemaps://?saddr=${encodeURIComponent(originStr)}&daddr=${encodeURIComponent(dest)}&directionsmode=driving&navigate=yes`
      : `comgooglemaps://?daddr=${encodeURIComponent(dest)}&directionsmode=driving&navigate=yes`
    const appleMaps = originStr
      ? `maps://?saddr=${encodeURIComponent(originStr)}&daddr=${encodeURIComponent(dest)}&dirflg=d`
      : `maps://?daddr=${encodeURIComponent(dest)}&dirflg=d`
    const googleWeb = originStr
      ? `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(originStr)}&destination=${encodeURIComponent(dest)}&travelmode=driving&dir_action=navigate`
      : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dest)}&travelmode=driving&dir_action=navigate`

    try {
      if (isAndroid) {
        // Tenta Intent (provavelmente inicia navegação no app Google Maps)
        window.location.href = googleIntent
        // Se o intent não for tratado, tenta o esquema google.navigation e por fim web
        setTimeout(() => { window.location.href = googleNavScheme }, 700)
        setTimeout(() => { window.location.href = googleWeb }, 1400)
        return
      }

      if (isIOS) {
        // iOS: tenta Google Maps app (se instalado), depois Apple Maps, depois web
        window.location.href = comGoogleMaps
        setTimeout(() => { window.location.href = appleMaps }, 700)
        setTimeout(() => { window.location.href = googleWeb }, 1400)
        return
      }

      // Desktop / fallback universal: abre web em nova aba
      window.open(googleWeb, '_blank')
    } catch (err) {
      // fallback final
      window.open(googleWeb, '_blank')
    }
  }

  const handleSelectAddress = (_address: string, coordinates: { lat: number; lng: number }) => {
    setEnderecoSelecionado(coordinates)

    // Mover o mapa para o endereço selecionado
    if (googleMapRef.current) {
      googleMapRef.current.panTo(coordinates)
      googleMapRef.current.setZoom(15)

      // Adicionar marcador no endereço buscado
      const w = window as any
      if (w.google) {
        // Remover marcador anterior
        if (searchMarkerRef.current) {
          searchMarkerRef.current.setMap(null)
        }

        // Criar novo marcador
        searchMarkerRef.current = new w.google.maps.Marker({
          position: coordinates,
          map: googleMapRef.current,
          icon: {
            path: w.google.maps.SymbolPath.CIRCLE,
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
  }

  const handleClearSearch = () => {
    setBusca('')
    setEnderecoSelecionado(null)

    // Remover marcador de busca
    if (searchMarkerRef.current) {
      searchMarkerRef.current.setMap(null)
      searchMarkerRef.current = null
    }
  }

  // Filtrar vagas por texto OU por proximidade ao endereço selecionado
  const vagasFiltradas = vagas.filter(vaga => {
    // Filtro por texto (nome ou endereço)
    const matchTexto = vaga.nome.toLowerCase().includes(busca.toLowerCase()) ||
                       vaga.endereco.toLowerCase().includes(busca.toLowerCase())

    // Se há um endereço selecionado, filtrar por proximidade (raio de 3km)
    if (enderecoSelecionado) {
      const distancia = calcularDistancia(
        enderecoSelecionado,
        { lat: vaga.latitude, lng: vaga.longitude }
      )
      return distancia <= 3 // 3km de raio
    }

    return matchTexto
  })

  return (
    <div className="home">
      {/* Barra de busca modularizada */}
      <SearchBar
        value={busca}
        onChange={setBusca}
        onClear={handleClearSearch}
        onSelectAddress={handleSelectAddress}
        placeholder="Buscar por endereço..."
      />

      {/* Mapa modularizado */}
      {carregando ? (
        <div className="loading">
          <Loader className="spinner" size={40} />
          <p>Carregando vagas...</p>
        </div>
      ) : (
        <MapContainer
          vagas={vagas}
          localizacaoUsuario={localizacaoUsuario}
          onSelectVaga={setVagaSelecionada}
          erro={erroMapa}
          setErro={setErroMapa}
          setVagaSelecionada={setVagaSelecionada}
          googleMapRef={googleMapRef}
          // se houver um endereco selecionado, mostrar vagas próximas desse endereco
          vagasProximas={enderecoSelecionado ? vagas.filter(v => {
            const distancia = calcularDistancia(enderecoSelecionado, { lat: v.latitude, lng: v.longitude })
            return distancia <= 0.5
          }).map(v => v._id) : vagasFiltradas.map(v => v._id)}
        />
      )}

      {/* Lista de vagas modularizada */}
      <VagasList
        vagas={vagasFiltradas}
        vagaSelecionada={vagaSelecionada}
        onSelect={setVagaSelecionada}
        onVerRota={localizacaoUsuario ? tracarRota : undefined}
        onNavegar={localizacaoUsuario ? (vaga: Vaga) => abrirNavegacao(localizacaoUsuario, vaga.latitude, vaga.longitude) : undefined}
        localizacaoUsuario={localizacaoUsuario}
      />
      {/* Erro de localização */}
      {erroLocalizacao && (
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
          ⚠️ {erroLocalizacao}
        </div>
      )}
      {/* Erro de vagas (backend) */}
      {erroVagas && (
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
          ⚠️ {erroVagas}
        </div>
      )}
    </div>
  )
}

export default Home