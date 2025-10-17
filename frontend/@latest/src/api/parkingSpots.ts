import type { ParkingSpot } from '../types/parking'
import { API_URL } from '../constants/defaults'

/**
 * API service for parking spots
 */

export async function fetchParkingSpots(): Promise<ParkingSpot[]> {
  const response = await fetch(`${API_URL}/vagas`)
  if (!response.ok) {
    throw new Error(`Failed to fetch parking spots: ${response.status} ${response.statusText}`)
  }

  // Get response text first for debugging
  const responseText = await response.text()

  // Try to parse as JSON
  let data
  try {
    data = JSON.parse(responseText)
  } catch (error) {
    console.error('Failed to parse JSON. Response text:', responseText)
    console.error('API URL:', `${API_URL}/vagas`)
    throw new Error('Server returned invalid JSON. Check console for details.')
  }

  // Transform API response to match our type
  return data.map((spot: {
    _id: string
    nome: string
    endereco: string
    latitude: number
    longitude: number
    total_vagas: number
    vagas_disponiveis: number
    acessivel: boolean
    vaga_gestante?: boolean
    vaga_idoso?: boolean
    vaga_pcd?: boolean
  }) => ({
    _id: spot._id,
    name: spot.nome,
    address: spot.endereco,
    latitude: spot.latitude,
    longitude: spot.longitude,
    totalSpots: spot.total_vagas,
    availableSpots: spot.vagas_disponiveis,
    accessible: spot.acessivel,
    parking_pregnant: spot.vaga_gestante ?? false,
    parking_elderly: spot.vaga_idoso ?? false,
    parking_disabled: spot.vaga_pcd ?? false,
  }))
}
