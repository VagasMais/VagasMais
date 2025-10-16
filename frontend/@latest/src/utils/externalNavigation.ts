import type { Coordinates } from '../types/parking'

/**
 * Opens external navigation app (Google Maps or Apple Maps) for turn-by-turn directions
 * Automatically detects the platform (iOS, Android, Desktop) and uses the appropriate method
 *
 * @param origin - Starting coordinates (optional, uses current location if not provided)
 * @param destinationLat - Destination latitude
 * @param destinationLng - Destination longitude
 */
export function openExternalNavigation(
  origin: Coordinates | null,
  destinationLat: number,
  destinationLng: number
) {
  const dest = `${destinationLat},${destinationLng}`
  const originStr = origin ? `${origin.lat},${origin.lng}` : ''
  const ua = navigator.userAgent || ''

  // Feature-detect MSStream instead of using an unsafe any cast
  const isIOS = /iPad|iPhone|iPod/.test(ua) && !('MSStream' in window)
  const isAndroid = /Android/.test(ua)

  // Android deep links
  const googleIntent = `intent://google.navigation?q=${encodeURIComponent(dest)}#Intent;package=com.google.android.apps.maps;end`
  const googleNavScheme = `google.navigation:q=${encodeURIComponent(dest)}`

  // iOS deep links
  const comGoogleMaps = originStr
    ? `comgooglemaps://?saddr=${encodeURIComponent(originStr)}&daddr=${encodeURIComponent(dest)}&directionsmode=driving&navigate=yes`
    : `comgooglemaps://?daddr=${encodeURIComponent(dest)}&directionsmode=driving&navigate=yes`

  const appleMaps = originStr
    ? `maps://?saddr=${encodeURIComponent(originStr)}&daddr=${encodeURIComponent(dest)}&dirflg=d`
    : `maps://?daddr=${encodeURIComponent(dest)}&dirflg=d`

  // Web fallback
  const googleWeb = originStr
    ? `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(originStr)}&destination=${encodeURIComponent(dest)}&travelmode=driving&dir_action=navigate`
    : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dest)}&travelmode=driving&dir_action=navigate`

  try {
    if (isAndroid) {
      // Try Android Google Maps app first, then fallback to web
      window.location.href = googleIntent
      setTimeout(() => { window.location.href = googleNavScheme }, 700)
      setTimeout(() => { window.location.href = googleWeb }, 1400)
      return
    }

    if (isIOS) {
      // Try iOS Google Maps app, then Apple Maps, then fallback to web
      window.location.href = comGoogleMaps
      setTimeout(() => { window.location.href = appleMaps }, 700)
      setTimeout(() => { window.location.href = googleWeb }, 1400)
      return
    }

    // Desktop: open in new tab
    window.open(googleWeb, '_blank')
  } catch (err: unknown) {
    // Log the error and fallback to web navigation
    console.error('External navigation error:', err)
    window.open(googleWeb, '_blank')
  }
}
