import { useState } from 'react'
import { MapPin, Info, Menu, X, Home } from 'lucide-react'
import HomePage from './pages/HomePage'
import MapPage from './pages/MapPage'
import AboutPage from './pages/AboutPage'
import Footer from './components/Footer'
import type { PageType } from './types/parking'
import './App.css'

/**
 * Main App component
 * Handles navigation between Home and About pages
 */
function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home')
  const [menuOpen, setMenuOpen] = useState(false)

  const toggleMenu = () => setMenuOpen(!menuOpen)

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <MapPin size={40} className="logo-icon" />
            <h1>Vagas+</h1>
          </div>

          <button
            className="menu-button"
            onClick={toggleMenu}
            aria-label="Menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <nav className={`nav ${menuOpen ? 'nav-open' : ''}`}>
            <button
              className={`nav-button ${currentPage === 'home' ? 'active' : ''}`}
              onClick={() => {
                setCurrentPage('home')
                setMenuOpen(false)
              }}
            >
              <Home size={20} />
              Início
            </button>
            <button
              className={`nav-button ${currentPage === 'map' ? 'active' : ''}`}
              onClick={() => {
                setCurrentPage('map')
                setMenuOpen(false)
              }}
            >
              <MapPin size={20} />
              Mapa
            </button>
            <button
              className={`nav-button ${currentPage === 'about' ? 'active' : ''}`}
              onClick={() => {
                setCurrentPage('about')
                setMenuOpen(false)
              }}
            >
              <Info size={20} />
              Sobre
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {currentPage === 'home' && <HomePage onNavigateToMap={() => setCurrentPage('map')} />}
        {currentPage === 'map' && <MapPage />}
        {currentPage === 'about' && <AboutPage />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div
          className="menu-overlay"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </div>
  )
}

export default App
