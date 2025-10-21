import { useState, useEffect } from 'react'
import type { ParkingSpot } from '../types/parking'
import { fetchParkingSpots } from '../api/parkingSpots'
import { getLatestStatusReport } from '../api/statusReports'
import { ERROR_MESSAGES } from '../constants/defaults'

export interface ParkingSpotWithReport extends ParkingSpot {
  latestReport?: {
    vagas_disponiveis: number
    minutes_ago: number
  } | null
}

/**
 * Hook to fetch parking spots and merge with latest status reports
 */
export function useParkingSpotsWithReports() {
  const [spots, setSpots] = useState<ParkingSpotWithReport[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchSpots()
  }, [])

  const fetchSpots = async () => {
    try {
      setLoading(true)

      // Fetch parking spots
      const parkingSpots = await fetchParkingSpots()

      // Fetch latest reports for each spot
      const spotsWithReports = await Promise.all(
        parkingSpots.map(async (spot) => {
          try {
            const report = await getLatestStatusReport(spot._id)

            if (report && report.minutes_ago !== undefined) {
              return {
                ...spot,
                latestReport: {
                  vagas_disponiveis: report.vagas_disponiveis,
                  minutes_ago: report.minutes_ago
                }
              }
            }

            return {
              ...spot,
              latestReport: null
            }
          } catch (err) {
            // If fetching report fails, just use spot without report
            console.warn(`Failed to fetch report for spot ${spot._id}:`, err)
            return {
              ...spot,
              latestReport: null
            }
          }
        })
      )

      setSpots(spotsWithReports)
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
