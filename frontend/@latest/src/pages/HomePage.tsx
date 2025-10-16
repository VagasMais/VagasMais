import { ArrowRight } from 'lucide-react'
import '../App.css'

interface HomePageProps {
  onNavigateToMap: () => void
}

/**
 * Home page component
 * Landing page with app introduction and features
 */
function HomePage({ onNavigateToMap }: HomePageProps) {
  return (
    <div className="home-page-new">
      {/* Hero Section with Video Background */}
      <section className="hero-video-section">
        <div className="video-background">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="background-video"
          >
            <source src="/background2.mp4" type="video/mp4" />
            {/* Fallback para navegadores que não suportam o vídeo */}
          </video>
          <div className="video-overlay"></div>
        </div>

        <div className="hero-content-new">
          <h1 className="hero-title-gradient">
            <span className="gradient-line">
              <span className="value-text">Vagas</span> <span className="plus-symbol">+</span> <span className="highlight-text">Inclusão</span>
            </span>
            <span className="gradient-line">
              <span className="value-text">Vagas</span> <span className="plus-symbol">+</span> <span className="highlight-text">Acessibilidade</span>
            </span>
            <span className="gradient-line">
              <span className="value-text">Vagas</span> <span className="plus-symbol">+</span> <span className="highlight-text">Respeito</span>
            </span>
          </h1>

          <button className="cta-button-large" onClick={onNavigateToMap}>
            Começar Agora
            <ArrowRight size={24} className="cta-icon" />
          </button>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <h2 className="section-title-main">Como Funciona</h2>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3 className="step-title">Busque por Endereço</h3>
              <p className="step-description">
                Digite o endereço ou local onde você deseja encontrar vagas de estacionamento acessíveis valpróximas a você.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">2</div>
              <h3 className="step-title">Visualize no Mapa</h3>
              <p className="step-description">
                Veja todas as vagas disponíveis em um mapa interativo, com informações sobre acessibilidade e disponibilidade.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">3</div>
              <h3 className="step-title">Navegue até o Local</h3>
              <p className="step-description">
                Escolha a vaga ideal e obtenha rotas de navegação diretamente no seu aplicativo de mapas favorito.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-detailed-section">
        <div className="container">
          <h2 className="section-title-main">Recursos do Vagas+</h2>

          <div className="features-detailed-grid">
            <div className="feature-detailed-card">
              <div className="feature-icon-wrapper">
                <svg className="feature-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="feature-detailed-title">Vagas Acessíveis</h3>
              <p className="feature-detailed-description">
                Encontre vagas exclusivas para pessoas com deficiência ou mobilidade reduzida, com informações detalhadas sobre acessibilidade.
              </p>
            </div>

            <div className="feature-detailed-card">
              <div className="feature-icon-wrapper">
                <svg className="feature-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="feature-detailed-title">Informações em Tempo Real</h3>
              <p className="feature-detailed-description">
                Veja a disponibilidade atual das vagas e planeje melhor o seu trajeto com informações sempre atualizadas.
              </p>
            </div>

            <div className="feature-detailed-card">
              <div className="feature-icon-wrapper">
                <svg className="feature-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="feature-detailed-title">Navegação Integrada</h3>
              <p className="feature-detailed-description">
                Obtenha rotas otimizadas e navegue diretamente com Google Maps, Waze ou Apple Maps.
              </p>
            </div>

            <div className="feature-detailed-card">
              <div className="feature-icon-wrapper">
                <svg className="feature-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="feature-detailed-title">Fácil de Usar</h3>
              <p className="feature-detailed-description">
                Interface intuitiva e responsiva, funciona perfeitamente em qualquer dispositivo móvel ou desktop.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-final-section">
        <div className="container">
          <h2 className="cta-final-title">Pronto para encontrar sua vaga?</h2>
          <p className="cta-final-subtitle">
            Comece agora e descubra vagas acessíveis próximas a você
          </p>
          <button className="cta-button-large" onClick={onNavigateToMap}>
            Começar Agora
            <ArrowRight size={24} className="cta-icon" />
          </button>
        </div>
      </section>
    </div>
  )
}

export default HomePage
