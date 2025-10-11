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
      const w = window as any
      if (!w.google) {
        setErro('Google Maps não carregado')
        return null
      }

      const geocoder = new w.google.maps.Geocoder()

      return new Promise((resolve, reject) => {
        geocoder.geocode({ address: endereco }, (results: any, status: string) => {
          setCarregando(false)

          if (status === 'OK' && results[0]) {
            const location = results[0].geometry.location
            resolve({
              lat: location.lat(),
              lng: location.lng()
            })
          } else {
            setErro('Endereço não encontrado')
            reject(new Error('Endereço não encontrado'))
          }
        })
      })
    } catch (error) {
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
