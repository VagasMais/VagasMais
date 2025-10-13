import VagaCard, { type Vaga } from './VagaCard'

interface VagasListProps {
  vagas: Vaga[]
  vagaSelecionada: Vaga | null
  onSelect: (vaga: Vaga) => void
  onVerRota?: (vaga: Vaga) => void
  onNavegar?: (vaga: Vaga) => void
  localizacaoUsuario: { lat: number; lng: number } | null
}

const VagasList = ({ vagas, vagaSelecionada, onSelect, onVerRota, onNavegar, localizacaoUsuario }: VagasListProps) => {
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
            onVerRota={localizacaoUsuario ? () => onVerRota?.(vaga) : undefined}
            onNavegar={localizacaoUsuario ? () => onNavegar?.(vaga) : undefined}
            localizacaoUsuario={localizacaoUsuario}
          />
        ))}
      </div>
    </div>
  )
}

export default VagasList
