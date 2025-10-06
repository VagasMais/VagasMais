import { MapPin, Heart, Navigation, Smartphone } from 'lucide-react'

function Sobre() {
  return (
    <div className="sobre">
      <div className="sobre-container">
        <div className="sobre-hero">
          <MapPin size={64} className="sobre-logo" />
          <h1 className="sobre-title">Vagas+</h1>
          <p className="sobre-subtitle">
            Facilitando o acesso a vagas especiais na sua cidade
          </p>
        </div>

        <div className="sobre-content">
          <section className="sobre-section">
            <h2 className="section-title">Nossa Missão</h2>
            <p className="section-text">
              O Vagas+ foi criado para facilitar a vida de pessoas com deficiência e 
              mobilidade reduzida, oferecendo uma forma rápida e prática de localizar 
              vagas de estacionamento especiais na cidade.
            </p>
            <p className="section-text">
              Acreditamos que a tecnologia pode e deve ser usada para promover 
              inclusão e acessibilidade para todos.
            </p>
          </section>

          <section className="sobre-section">
            <h2 className="section-title">Funcionalidades</h2>
            <div className="features-grid">
              <div className="feature-card">
                <MapPin size={32} className="feature-icon" />
                <h3 className="feature-title">Mapa Interativo</h3>
                <p className="feature-text">
                  Visualize todas as vagas especiais através de 
                  um mapa interativo e intuitivo.
                </p>
              </div>

              <div className="feature-card">
                <Navigation size={32} className="feature-icon" />
                <h3 className="feature-title">Rotas Inteligentes</h3>
                <p className="feature-text">
                  Traçamos a melhor rota da sua localização até a vaga 
                  desejada, economizando seu tempo.
                </p>
              </div>

              <div className="feature-card">
                <Heart size={32} className="feature-icon" />
                <h3 className="feature-title">Colabore com a Comunidade</h3>
                <p className="feature-text">
                  Indique se uma vaga está ocupada ou livre, sugira a adição de novas vagas e ajude a remover vagas inexistentes. Juntos, mantemos o mapa sempre atualizado!
                </p>
              </div>

              <div className="feature-card">
                <Smartphone size={32} className="feature-icon" />
                <h3 className="feature-title">PWA - Funciona Offline</h3>
                <p className="feature-text">
                  Instale como app no seu celular e acesse mesmo sem 
                  conexão com a internet.
                </p>
              </div>
            </div>
          </section>

          <section className="sobre-section">
            <h2 className="section-title">Como Usar</h2>
            <div className="steps">
              <div className="step" style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div className="step-number" style={{ minWidth: 36, height: 36, borderRadius: '50%', background: '#007bff', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 18, marginRight: 16 }}>
                  1
                </div>
                <div className="step-content">
                  <h3 className="step-title">Permita a Localização</h3>
                  <p className="step-text">
                    Autorize o acesso à sua localização para encontrar vagas próximas a você.
                  </p>
                </div>
              </div>
              <div className="step" style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div className="step-number" style={{ minWidth: 36, height: 36, borderRadius: '50%', background: '#007bff', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 18, marginRight: 16 }}>
                  2
                </div>
                <div className="step-content">
                  <h3 className="step-title">Explore o Mapa</h3>
                  <p className="step-text">
                    Navegue pelo mapa e veja todas as vagas especiais disponíveis. Verde indica vagas livres, vermelho indica ocupadas.
                  </p>
                </div>
              </div>
              <div className="step" style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div className="step-number" style={{ minWidth: 36, height: 36, borderRadius: '50%', background: '#007bff', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 18, marginRight: 16 }}>
                  3
                </div>
                <div className="step-content">
                  <h3 className="step-title">Escolha e Navegue</h3>
                  <p className="step-text">
                    Selecione a vaga desejada e clique em "Ver rota" para abrir a navegação no Google Maps.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="sobre-section">
            <h2 className="section-title">Contato</h2>
            <p className="section-text">
              Tem alguma sugestão ou encontrou um problema? Entre em contato conosco:
            </p>
            <p className="contact-email">
              <strong>Email:</strong> contato@vagasmais.com.br
            </p>
          </section>

          <footer className="sobre-footer">
            <p>© 2025 Vagas+ - Todos os direitos reservados</p>
            <p className="footer-note">
              Desenvolvido com ❤️ para promover acessibilidade
            </p>
          </footer>
        </div>
      </div>
    </div>
  )
}

export default Sobre