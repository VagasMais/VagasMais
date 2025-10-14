import { useState, useEffect } from 'react'
import type { ParkingSpot } from '../types/parking'
import { fetchParkingSpots } from '../api/parkingSpots'
import { ERROR_MESSAGES } from '../constants/defaults'

/**
 * Hook to fetch and manage parking spots data
 */
export function useParkingSpots() {
  const [spots, setSpots] = useState<ParkingSpot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchSpots()
  }, [])

  const fetchSpots = async () => {
    try {
      setLoading(true)
      const data = await fetchParkingSpots()
      setSpots(data)
      setError('')
    } catch (error) {
      console.error('Error fetching parking spots:', error)
      setError(ERROR_MESSAGES.FETCH_SPOTS_FAILED)
    } finally {
      setLoading(false)
    }
  }

  return { spots, loading, error, refetch: fetchSpots }
}
