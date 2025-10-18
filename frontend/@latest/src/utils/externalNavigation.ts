import type { Coordinates } from '../types/parking'

/**
 * Detects the user's platform (iOS, Android, Desktop)
 */
function getPlatform() {
  const ua = navigator.userAgent || ''
  const isIOS = /iPad|iPhone|iPod/.test(ua) && !('MSStream' in window)
  const isAndroid = /Android/.test(ua)
  return { isIOS, isAndroid }
}

/**
 * Opens Google Maps for navigation
 * @param origin - Starting coordinates (optional, uses current location if not provided)
 * @param destinationLat - Destination latitude
 * @param destinationLng - Destination longitude
 */
export function openGoogleMaps(
  origin: Coordinates | null,
  destinationLat: number,
  destinationLng: number
) {
  const dest = `${destinationLat},${destinationLng}`
  const originStr = origin ? `${origin.lat},${origin.lng}` : ''
  const { isIOS, isAndroid } = getPlatform()

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
    console.error('Google Maps navigation error:', err)
    window.open(googleWeb, '_blank')
  }
}

/**
 * Opens Waze for navigation
 * Waze automatically uses the user's current location as the starting point
 * @param _origin - Starting coordinates (not used by Waze, kept for API consistency)
 * @param destinationLat - Destination latitude
 * @param destinationLng - Destination longitude
 */
export function openWaze(
  _origin: Coordinates | null,
  destinationLat: number,
  destinationLng: number
) {
  const { isIOS, isAndroid } = getPlatform()

  // Waze deep link format: waze://?ll=latitude,longitude&navigate=yes
  const wazeDeepLink = `waze://?ll=${destinationLat},${destinationLng}&navigate=yes`

  // Web fallback (Waze LiveMap)
  const wazeWeb = `https://www.waze.com/ul?ll=${destinationLat}%2C${destinationLng}&navigate=yes&zoom=17`

  try {
    if (isAndroid || isIOS) {
      // Try to open Waze app first
      window.location.href = wazeDeepLink
      // Fallback to web if app is not installed (after 1.5s)
      setTimeout(() => { window.location.href = wazeWeb }, 1500)
      return
    }

    // Desktop: open Waze web in new tab
    window.open(wazeWeb, '_blank')
  } catch (err: unknown) {
    console.error('Waze navigation error:', err)
    window.open(wazeWeb, '_blank')
  }
}

/**
 * Opens external navigation app (Google Maps or Apple Maps) for turn-by-turn directions
 * Automatically detects the platform (iOS, Android, Desktop) and uses the appropriate method
 *
 * @deprecated Use openGoogleMaps or openWaze instead, with NavigationModal for user choice
 * @param origin - Starting coordinates (optional, uses current location if not provided)
 * @param destinationLat - Destination latitude
 * @param destinationLng - Destination longitude
 */
export function openExternalNavigation(
  origin: Coordinates | null,
  destinationLat: number,
  destinationLng: number
) {
  openGoogleMaps(origin, destinationLat, destinationLng)
}
