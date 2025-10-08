import { MapPin, Navigation } from 'lucide-react'

export interface Vaga {
  _id: string
  nome: string
  endereco: string
  latitude: number
  longitude: number
  total_vagas: number
  vagas_disponiveis: number
  tipo: 'publica' | 'privada'
}

interface VagaCardProps {
  vaga: Vaga
  selecionada: boolean
  onSelect: () => void
  onVerRota?: () => void
  localizacaoUsuario?: { lat: number; lng: number } | null
}

const VagaCard = ({ vaga, selecionada, onSelect, onVerRota, localizacaoUsuario }: VagaCardProps) => (
  <div
    className={`vaga-card ${selecionada ? 'selected' : ''}`}
    onClick={onSelect}
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
    {localizacaoUsuario && onVerRota && (
      <button
        onClick={e => {
          e.stopPropagation()
          onVerRota()
        }}
        className="rota-button"
      >
        <Navigation size={16} />
        Ver rota
      </button>
    )}
  </div>
)

export default VagaCard
