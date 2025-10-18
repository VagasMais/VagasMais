import { AlertTriangle, FileText, Camera, MapPin, CheckCircle } from 'lucide-react'
import { useState } from 'react'
import { ReportForm } from '../components/ReportForm'
import type { ReportFormData } from '../types/parking'
import { submitDenuncia } from '../api/denuncias'

function DenunciasPage() {
  const [showForm, setShowForm] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data: ReportFormData) => {
    setIsSubmitting(true)
    try {
      const result = await submitDenuncia(data)
      console.log('Denúncia criada com sucesso:', result)

      // Mostrar mensagem de sucesso
      setSubmitSuccess(true)
      setShowForm(false)

      // Resetar sucesso após 5 segundos
      setTimeout(() => {
        setSubmitSuccess(false)
      }, 5000)
    } catch (error) {
      console.error('Erro ao enviar denúncia:', error)
      alert('Erro ao enviar denúncia. Por favor, tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

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

        {submitSuccess && (
          <div style={{
            padding: '1rem',
            marginBottom: '2rem',
            backgroundColor: '#d1fae5',
            border: '2px solid #10b981',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#065f46'
          }}>
            <CheckCircle size={24} />
            <span style={{ fontWeight: 500 }}>Denúncia enviada com sucesso! Obrigado por contribuir.</span>
          </div>
        )}

        {!showForm && (
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <button
              onClick={() => setShowForm(true)}
              style={{
                padding: '1rem 2rem',
                fontSize: '1.1rem',
                fontWeight: 600,
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
            >
              Fazer uma Denúncia
            </button>
          </div>
        )}

        {showForm && (
          <div style={{ marginBottom: '3rem' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1a202c' }}>
                Formulário de Denúncia
              </h2>
              <button
                onClick={() => setShowForm(false)}
                disabled={isSubmitting}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#e2e8f0',
                  color: '#475569',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  fontWeight: 500,
                  opacity: isSubmitting ? 0.6 : 1
                }}
              >
                Cancelar
              </button>
            </div>
            <ReportForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
          </div>
        )}

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
                  Preencha as informações no formulário acima ou entre em contato com os órgãos de fiscalização da sua cidade através
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
                  <h3 className="step-title">Central de atendimento.</h3>
                  <p className="step-text">
                    <strong>Telefone:</strong> 153<br />
                    Disponível gratuitamente. Ligue e denuncie!
                  </p>
                </div>
              </div>

              <div className="step" style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div className="step-content">
                  <h3 className="step-title">Ouvidoria Municipal</h3>
                  <p className="step-text">
                    <strong>Telefone:</strong> (21) 98099-0692<br />
                    Entre em contato com a NITTRANS.<br />
                    
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
