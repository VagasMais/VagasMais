import { MapPin, Mail, Instagram, Facebook, MessageCircle } from 'lucide-react'
import type { PageType } from '../types/parking'

interface FooterProps {
  onNavigate: (page: PageType) => void
}

function Footer({ onNavigate }: FooterProps) {
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
              <li>
                <button onClick={() => onNavigate('home')} className="footer-link">
                  Início
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('map')} className="footer-link">
                  Mapa
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('denuncias')} className="footer-link">
                  Denúncias
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="footer-link">
                  Sobre
                </button>
              </li>
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
                href="https://wa.me/5521999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                aria-label="WhatsApp"
              >
                <MessageCircle size={20} />
              </a>
              <a
                href="https://instagram.com/vagas_mais"
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
