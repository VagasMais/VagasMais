import { useState } from 'react'

export interface Coordenadas {
  lat: number
  lng: number
}

export function useGeocoding() {
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')

  const geocodificar = async (endereco: string): Promise<Coordenadas | null> => {
    setCarregando(true)
    setErro('')

    try {
      if (typeof ((globalThis as unknown as { google?: unknown }).google) === 'undefined') {
        setErro('Google Maps não carregado')
        return null
      }

      type GoogleNamespace = typeof globalThis.google
      const google = (globalThis as unknown as { google?: GoogleNamespace }).google!
      const geocoder = new google.maps.Geocoder()

      return new Promise((resolve, reject) => {
        geocoder.geocode(
          { address: endereco },
          (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
            setCarregando(false)

            if (status === 'OK' && results && results[0]) {
              const location = results[0].geometry.location
              resolve({
                lat: location.lat(),
                lng: location.lng(),
              })
            } else {
              setErro('Endereço não encontrado')
              reject(new Error('Endereço não encontrado'))
            }
          }
        )
      })
    } catch {
      setCarregando(false)
      setErro('Erro ao buscar endereço')
      return null
    }
  }

  const calcularDistancia = (
    coord1: Coordenadas,
    coord2: Coordenadas
  ): number => {
    const R = 6371 // Raio da Terra em km
    const dLat = (coord2.lat - coord1.lat) * Math.PI / 180
    const dLng = (coord2.lng - coord1.lng) * Math.PI / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(coord1.lat * Math.PI / 180) *
      Math.cos(coord2.lat * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c // Distância em km
  }

  return { geocodificar, calcularDistancia, carregando, erro }
}
