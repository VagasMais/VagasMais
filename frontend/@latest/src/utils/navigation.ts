export function abrirNavegacao(origin: { lat: number; lng: number } | null, destLat: number, destLng: number) {
  const dest = `${destLat},${destLng}`
  const originStr = origin ? `${origin.lat},${origin.lng}` : ''
  const ua = navigator.userAgent || ''
  const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream
  const isAndroid = /Android/.test(ua)

  const googleIntent = `intent://google.navigation?q=${encodeURIComponent(dest)}#Intent;package=com.google.android.apps.maps;end`
  const googleNavScheme = `google.navigation:q=${encodeURIComponent(dest)}`
  const comGoogleMaps = originStr
    ? `comgooglemaps://?saddr=${encodeURIComponent(originStr)}&daddr=${encodeURIComponent(dest)}&directionsmode=driving&navigate=yes`
    : `comgooglemaps://?daddr=${encodeURIComponent(dest)}&directionsmode=driving&navigate=yes`
  const appleMaps = originStr
    ? `maps://?saddr=${encodeURIComponent(originStr)}&daddr=${encodeURIComponent(dest)}&dirflg=d`
    : `maps://?daddr=${encodeURIComponent(dest)}&dirflg=d`
  const googleWeb = originStr
    ? `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(originStr)}&destination=${encodeURIComponent(dest)}&travelmode=driving&dir_action=navigate`
    : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dest)}&travelmode=driving&dir_action=navigate`

  try {
    if (isAndroid) {
      window.location.href = googleIntent
      setTimeout(() => { window.location.href = googleNavScheme }, 700)
      setTimeout(() => { window.location.href = googleWeb }, 1400)
      return
    }

    if (isIOS) {
      window.location.href = comGoogleMaps
      setTimeout(() => { window.location.href = appleMaps }, 700)
      setTimeout(() => { window.location.href = googleWeb }, 1400)
      return
    }

    window.open(googleWeb, '_blank')
  } catch (err) {
    window.open(googleWeb, '_blank')
  }
}
