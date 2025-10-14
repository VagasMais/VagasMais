import { useEffect, useState } from 'react'

export function useRouteInfo(origin: {lat:number;lng:number} | null, dest: {lat:number;lng:number} | null) {
  const [loading, setLoading] = useState(false)
  const [distanceText, setDistanceText] = useState<string | null>(null)
  const [durationText, setDurationText] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!origin || !dest) return
    if (typeof globalThis.google === 'undefined') return

    let mounted = true
    setLoading(true)
    const directionsService = new google.maps.DirectionsService()
    directionsService.route({
      origin,
      destination: dest,
      travelMode: google.maps.TravelMode.DRIVING,
      drivingOptions: { departureTime: new Date() } // opcional: inclui trânsito se disponível e chave permite
    }, (result, status) => {
      if (!mounted) return
      setLoading(false)
      if (status === 'OK' && result && result.routes?.length) {
        const leg = result.routes[0].legs[0]
        setDistanceText(leg.distance?.text ?? null)
        setDurationText(leg.duration?.text ?? null)
      } else {
        setError('Não foi possível obter rota')
      }
    })

    return () => { mounted = false }
  }, [origin?.lat, origin?.lng, dest?.lat, dest?.lng])

  return { loading, distanceText, durationText, error }
}