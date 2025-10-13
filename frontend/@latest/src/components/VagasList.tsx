import VagaCard, { type Vaga } from './VagaCard'

interface VagasListProps {
  vagas: Vaga[]
  vagaSelecionada: Vaga | null
  onSelect: (vaga: Vaga) => void
  onViewRoute?: (vaga: Vaga) => void
  onNavigate?: (vaga: Vaga) => void
  userLocation: { lat: number; lng: number } | null
}

const VagasList = ({ vagas, vagaSelecionada, onSelect, onViewRoute, onNavigate, userLocation }: VagasListProps) => {
  return (
    <div className="vagas-list">
      <h2 className="list-title">
        Vagas Disponíveis ({vagas.length})
      </h2>
      <div className="vagas-grid">
        {vagas.map(vaga => (
          <VagaCard
            key={vaga._id}
            vaga={vaga}
            selecionada={vagaSelecionada?._id === vaga._id}
            onSelect={() => onSelect(vaga)}
            onViewRoute={userLocation ? () => onViewRoute?.(vaga) : undefined}
            onNavigate={userLocation ? () => onNavigate?.(vaga) : undefined}
            userLocation={userLocation}
          />
        ))}
      </div>
    </div>
  )
}

export default VagasList
