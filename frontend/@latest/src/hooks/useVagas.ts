import { useState, useEffect } from 'react'
import { type Vaga } from '../components/VagaCard'
import { fetchVagas } from '../api/vagas'

export function useVagas() {
  const [vagas, setVagas] = useState<Vaga[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    buscarVagas()
  }, [])

  const buscarVagas = async () => {
    try {
      setCarregando(true)
      const data = await fetchVagas()
      setVagas(data)
      setErro('')
    } catch (error) {
      console.error('Erro:', error)
      setErro('Não foi possível carregar as vagas. Tente novamente mais tarde.')
    } finally {
      setCarregando(false)
    }
  }

  return { vagas, carregando, erro, buscarVagas }
}
