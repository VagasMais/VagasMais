import { useState, useEffect } from 'react'

export function useLocalizacao() {
  const [localizacao, setLocalizacao] = useState<{ lat: number; lng: number } | null>(null)
  const [erro, setErro] = useState('')

  useEffect(() => {
    obterLocalizacao()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const obterLocalizacao = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocalizacao({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.error('Erro ao obter localização:', error)
          setErro('Não foi possível obter sua localização. Tente novamente mais tarde.')
          // Usar localização padrão (Rio de Janeiro)
          setLocalizacao({
            lat: -22.9068,
            lng: -43.1729
          })
        }
      )
    } else {
      setErro('Não foi possível obter sua localização. Tente novamente mais tarde.')
      setLocalizacao({
        lat: -22.9068,
        lng: -43.1729
      })
    }
  }

  return { localizacao, erro, obterLocalizacao }
}
