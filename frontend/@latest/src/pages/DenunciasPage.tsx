import { AlertTriangle, FileText, Camera, MapPin } from 'lucide-react'

/**
 * Denuncias page for reporting misuse of accessible parking spots
 */
function DenunciasPage() {
  return (
    <div className="sobre">
      <div className="sobre-container">
        <div className="sobre-hero">
          <AlertTriangle size={64} className="sobre-logo" />
          <h1 className="sobre-title">Denúncias</h1>
          <p className="sobre-subtitle">
            Ajude a combater o uso irregular de vagas inclusivas
          </p>
        </div>

        <div className="sobre-content">
          <section className="sobre-section">
            <h2 className="section-title">Por que denunciar?</h2>
            <p className="section-text">
              As vagas inclusivas são essenciais para garantir a mobilidade e autonomia de
              pessoas com deficiência e mobilidade reduzida. O uso irregular dessas vagas
              é uma infração grave que prejudica quem realmente precisa delas.
            </p>
            <p className="section-text">
              Sua denúncia ajuda a fiscalização a agir de forma mais eficiente e contribui
              para um espaço urbano mais justo e acessível para todos.
            </p>
          </section>

          <section className="sobre-section">
            <h2 className="section-title">Como denunciar</h2>
            <div className="features-grid">
              <div className="feature-card">
                <MapPin size={32} className="feature-icon" />
                <h3 className="feature-title">1. Identifique o Local</h3>
                <p className="feature-text">
                  Anote o endereço exato da vaga e, se possível, pontos de referência próximos.
                </p>
              </div>

              <div className="feature-card">
                <Camera size={32} className="feature-icon" />
                <h3 className="feature-title">2. Documente</h3>
                <p className="feature-text">
                  Tire fotos que mostrem claramente a placa do veículo, a sinalização
                  da vaga e a ausência de credencial de estacionamento.
                </p>
              </div>

              <div className="feature-card">
                <FileText size={32} className="feature-icon" />
                <h3 className="feature-title">3. Registre a Ocorrência</h3>
                <p className="feature-text">
                  Entre em contato com os órgãos de fiscalização da sua cidade através
                  dos canais oficiais.
                </p>
              </div>
            </div>
          </section>

          <section className="sobre-section">
            <h2 className="section-title">Canais de Denúncia</h2>
            <div className="steps">
              <div className="step" style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div className="step-content">
                  <h3 className="step-title">Disque Denúncia (Nacional)</h3>
                  <p className="step-text">
                    <strong>Telefone:</strong> 181<br />
                    Disponível em vários estados brasileiros, gratuitamente.
                  </p>
                </div>
              </div>

              <div className="step" style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div className="step-content">
                  <h3 className="step-title">Ouvidoria Municipal</h3>
                  <p className="step-text">
                    Entre em contato com a ouvidoria ou secretaria de trânsito da sua cidade.
                    Muitos municípios têm aplicativos ou sites específicos para esse tipo de denúncia.
                  </p>
                </div>
              </div>

              <div className="step" style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div className="step-content">
                  <h3 className="step-title">Órgãos de Trânsito</h3>
                  <p className="step-text">
                    DETRAN ou órgão municipal de trânsito também podem receber denúncias
                    de estacionamento irregular em vagas especiais.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="sobre-section">
            <h2 className="section-title">Informações Importantes</h2>
            <p className="section-text">
              <strong>O que caracteriza uso irregular:</strong>
            </p>
            <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
              <li className="section-text">Veículos sem credencial de estacionamento para pessoa com deficiência</li>
              <li className="section-text">Veículos estacionados em vagas sinalizadas sem autorização</li>
              <li className="section-text">Obstrução de rampas de acesso ou faixas de circulação</li>
            </ul>
            <p className="section-text">
              <strong>Penalidades:</strong> O uso irregular de vagas especiais pode resultar em
              multa e pontos na carteira de habilitação, além de remoção do veículo.
            </p>
          </section>

          <section className="sobre-section">
            <h2 className="section-title">Contato</h2>
            <p className="section-text">
              Dúvidas sobre como denunciar ou sugestões para melhorar esta seção?
            </p>
            <p className="contact-email">
              <strong>Email:</strong>{' '}
              <a href="mailto:contato@vagasmais.app">contato@vagasmais.app</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default DenunciasPage
