import { type Vaga } from '../components/VagaCard'

const API_URL = import.meta.env.VITE_BACKEND_URL

export async function fetchVagas(): Promise<Vaga[]> {
  const response = await fetch(`${API_URL}/vagas`)
  if (!response.ok) {
    throw new Error('Erro ao buscar vagas')
  }
  return response.json()
}

// Aqui você pode adicionar outras funções de API, como criar, editar, remover vagas
