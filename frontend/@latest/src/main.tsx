import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Registrar Service Worker para PWA
// Apenas registrar em produção. No modo dev (Vite) o arquivo sw.js normalmente não
// existe (é gerado no build) e isso causa errors como "Script .../sw.js load failed".
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(() => {
        console.info('SW registrado')
      })
      .catch(error => {
        console.error('Erro ao registrar SW:', error)
      })
  })
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)