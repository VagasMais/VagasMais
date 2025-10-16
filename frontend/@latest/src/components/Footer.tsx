import { MapPin, Mail, Instagram, Facebook, MessageCircle } from 'lucide-react'

/**
 * Footer component
 * App footer with links and information
 */
function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-grid">
          {/* Brand Section */}
          <div className="footer-section">
            <div className="footer-brand">
              <MapPin size={32} className="footer-logo-icon" />
              <h3 className="footer-brand-name">Vagas+</h3>
            </div>
            <p className="footer-description">
              Conectando pessoas a vagas de estacionamento acessíveis,
              promovendo inclusão e respeito.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="footer-section-title">Links Rápidos</h4>
            <ul className="footer-links">
              <li><a href="#home" className="footer-link">Início</a></li>
              <li><a href="#map" className="footer-link">Mapa</a></li>
              <li><a href="#about" className="footer-link">Sobre</a></li>
              <li><a href="#how-it-works" className="footer-link">Como Funciona</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-section">
            <h4 className="footer-section-title">Contato</h4>
            <ul className="footer-links">
              <li className="footer-contact-item">
                <Mail size={16} />
                <a href="mailto:contato@vagasmais.com" className="footer-link">
                  contato@vagasmais.app
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="footer-section">
            <h4 className="footer-section-title">Redes Sociais</h4>
            <div className="footer-social">
              <a
                href="https://wa.me/5511999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                aria-label="WhatsApp"
              >
                <MessageCircle size={20} />
              </a>
              <a
                href="https://instagram.com/vagasmais"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://facebook.com/vagasmais"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            &copy; {currentYear} Vagas+. Todos os direitos reservados.
          </p>
          <div className="footer-legal">
            <a href="#privacy" className="footer-legal-link">Política de Privacidade</a>
            <span className="footer-separator">•</span>
            <a href="#terms" className="footer-legal-link">Termos de Uso</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
