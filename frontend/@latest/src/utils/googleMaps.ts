import { GOOGLE_MAPS_API_KEY } from '../constants/defaults'

type GoogleWindow = Window & { google?: { maps?: unknown } }

/**
 * Loads the Google Maps JavaScript API
 * Ensures the script is only loaded once and handles multiple simultaneous requests
 */
export function loadGoogleMaps(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Use feature detection instead of unsafe casts
    const gw = window as unknown as GoogleWindow
    if (typeof gw.google !== 'undefined' && gw.google?.maps) {
      resolve()
      return
    }

    // Prevent multiple loadings
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]') as HTMLScriptElement | null
    if (existingScript) {
      // Script may already be loading; listen for event
      const onLoaded = () => {
        window.removeEventListener('google-maps-loaded', onLoaded)
        resolve()
      }
      window.addEventListener('google-maps-loaded', onLoaded)
      return
    }

    const script = document.createElement('script')
    // Use v=weekly for latest features including new Places API
    // loading=async is recommended for better performance
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&v=weekly&loading=async&callback=Function.prototype`
    script.async = true
    script.defer = true
    script.onload = () => {
      console.log('Google Maps API loaded successfully')
      window.dispatchEvent(new Event('google-maps-loaded'))
      resolve()
    }
    script.onerror = (error) => {
      console.error('Failed to load Google Maps API:', error)
      console.error('API Key being used:', GOOGLE_MAPS_API_KEY ? 'Key present' : 'Key missing')
      console.error('Script URL:', script.src)
      reject(new Error('Failed to load Google Maps API. Please check your API key and permissions.'))
    }
    document.head.appendChild(script)
  })
}
