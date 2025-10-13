const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

type GoogleWindow = Window & { google?: { maps?: unknown } }

export function loadGoogleMaps(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Use feature detection instead of unsafe casts
    const gw = window as unknown as GoogleWindow
    if (typeof gw.google !== 'undefined' && gw.google?.maps) {
      resolve()
      return
    }

    // Evitar múltiplos carregamentos
  const existingScript = document.querySelector('script[src*="maps.googleapis.com"]') as HTMLScriptElement | null
    if (existingScript) {
      // Pode já estar carregando; escutar evento
      const onLoaded = () => {
        window.removeEventListener('google-maps-loaded', onLoaded)
        resolve()
      }
      window.addEventListener('google-maps-loaded', onLoaded)
      return
    }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&v=weekly`
    script.async = true
    script.defer = true
    script.onload = () => {
      window.dispatchEvent(new Event('google-maps-loaded'))
      resolve()
    }
    script.onerror = () => {
      reject(new Error('Erro ao carregar Google Maps API'))
    }
    document.head.appendChild(script)
  })
}
