import type { StatusReport, StatusReportSubmission } from '../types/parking'
import { API_URL } from '../constants/defaults'

/**
 * Submit a status report for a parking spot
 */
export async function submitStatusReport(
  vagaId: string,
  report: StatusReportSubmission
): Promise<{ id: string; message: string }> {
  const response = await fetch(`${API_URL}/vagas/${vagaId}/status`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(report)
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.detail || `Failed to submit report: ${response.status}`)
  }

  return response.json()
}

/**
 * Get the latest status report for a parking spot (valid for 2 hours)
 */
export async function getLatestStatusReport(vagaId: string): Promise<StatusReport | null> {
  const response = await fetch(`${API_URL}/vagas/${vagaId}/status/latest`)

  if (!response.ok) {
    throw new Error(`Failed to fetch status report: ${response.status}`)
  }

  const data = await response.json()
  return data || null
}
