import type { ParkingSpot } from '../types/parking'
import { API_URL } from '../constants/defaults'

/**
 * API service for parking spots
 */

export async function fetchParkingSpots(): Promise<ParkingSpot[]> {
  const response = await fetch(`${API_URL}/vagas`)
  if (!response.ok) {
    throw new Error('Failed to fetch parking spots')
  }
  const data = await response.json()

  // Transform API response to match our type
  return data.map((spot: {
    _id: string
    nome: string
    endereco: string
    latitude: number
    longitude: number
    total_vagas: number
    vagas_disponiveis: number
    tipo: 'publica' | 'privada'
  }) => ({
    _id: spot._id,
    name: spot.nome,
    address: spot.endereco,
    latitude: spot.latitude,
    longitude: spot.longitude,
    totalSpots: spot.total_vagas,
    availableSpots: spot.vagas_disponiveis,
    type: spot.tipo === 'publica' ? 'public' : 'private'
  }))
}
