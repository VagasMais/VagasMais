import { useState } from 'react'
import { submitStatusReport } from '../api/statusReports'
import type { StatusReportSubmission } from '../types/parking'

export function useStatusReport() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const submit = async (vagaId: string, report: StatusReportSubmission) => {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      await submitStatusReport(vagaId, report)
      setSuccess(true)
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao enviar report'
      setError(errorMessage)
      return false
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setError(null)
    setSuccess(false)
    setLoading(false)
  }

  return {
    submit,
    loading,
    error,
    success,
    reset
  }
}
