import { useState, useEffect, useRef } from 'react'
import { Loader } from 'lucide-react'
import { type Vaga } from '../components/VagaCard'
import MapContainer from '../components/MapContainer'
import SearchBar from '../components/SearchBar'
import VagasList from '../components/VagasList'
import { useVagas } from '../hooks/useVagas'
import { useLocalizacao } from '../hooks/useLocalizacao'

// Interface Vaga agora importada do componente

const API_URL = import.meta.env.VITE_BACKEND_URL

function Home() {
  const { vagas, carregando, erro: erroVagas } = useVagas()
  const { localizacao: localizacaoUsuario, erro: erroLocalizacao } = useLocalizacao()
  const [vagaSelecionada, setVagaSelecionada] = useState<Vaga | null>(null)
  const [busca, setBusca] = useState('')
  const [erroMapa, setErroMapa] = useState('')
  const googleMapRef = useRef<any>(null);
  const directionsRendererRef = useRef<any>(null);


  // ...existing code...

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

  const vagasFiltradas = vagas.filter(vaga =>
    vaga.nome.toLowerCase().includes(busca.toLowerCase()) ||
    vaga.endereco.toLowerCase().includes(busca.toLowerCase())
  )

  return (
    <div className="home">
      {/* Barra de busca modularizada */}
      <SearchBar
        value={busca}
        onChange={setBusca}
        onClear={() => setBusca('')}
        placeholder="Buscar por local..."
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
        />
      )}

      {/* Lista de vagas modularizada */}
      <VagasList
        vagas={vagasFiltradas}
        vagaSelecionada={vagaSelecionada}
        onSelect={setVagaSelecionada}
        onVerRota={localizacaoUsuario ? tracarRota : undefined}
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