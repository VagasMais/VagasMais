import { useState } from 'react'
import { MapPin, Info, Menu, X } from 'lucide-react'
import Home from './pages/Home'
import Sobre from './pages/Sobre'
import './App.css'

function App() {
  const [paginaAtual, setPaginaAtual] = useState<'home' | 'sobre'>('home')
  const [menuAberto, setMenuAberto] = useState(false)

  const toggleMenu = () => setMenuAberto(!menuAberto)

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <MapPin size={32} className="logo-icon" />
            <h1>Vagas+</h1>
          </div>
          
          <button 
            className="menu-button"
            onClick={toggleMenu}
            aria-label="Menu"
          >
            {menuAberto ? <X size={24} /> : <Menu size={24} />}
          </button>

          <nav className={`nav ${menuAberto ? 'nav-open' : ''}`}>
            <button
              className={`nav-button ${paginaAtual === 'home' ? 'active' : ''}`}
              onClick={() => {
                setPaginaAtual('home')
                setMenuAberto(false)
              }}
            >
              <MapPin size={20} />
              Mapa
            </button>
            <button
              className={`nav-button ${paginaAtual === 'sobre' ? 'active' : ''}`}
              onClick={() => {
                setPaginaAtual('sobre')
                setMenuAberto(false)
              }}
            >
              <Info size={20} />
              Sobre
            </button>
          </nav>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="main-content">
        {paginaAtual === 'home' ? <Home /> : <Sobre />}
      </main>

      {/* Overlay do menu mobile */}
      {menuAberto && (
        <div 
          className="menu-overlay"
          onClick={() => setMenuAberto(false)}
        />
      )}
    </div>
  )
}

export default App
