import type { ReportFormData } from '../types/parking'
import { API_URL } from '../constants/defaults'

/**
 * API service for denuncias (parking violation reports)
 */

interface DenunciaResponse {
  id: string
  endereco: string
  latitude: number | null
  longitude: number | null
  tipo_vaga: string
  tipo_infracao: string
  descricao: string
  midias: string[]
  data_criacao: string
  status: string
}

/**
 * Convert File objects to base64 strings for API submission
 */
async function filesToBase64(files: File[]): Promise<string[]> {
  const promises = files.map(file => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result)
        } else {
          reject(new Error('Failed to convert file to base64'))
        }
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  })

  return Promise.all(promises)
}

/**
 * Submit a new parking violation report
 */
export async function submitDenuncia(formData: ReportFormData): Promise<DenunciaResponse> {
  // Convert files to base64
  const mediasBase64 = await filesToBase64(formData.media)

  // Prepare API payload
  const payload = {
    endereco: formData.address,
    latitude: formData.latitude,
    longitude: formData.longitude,
    tipo_vaga: formData.spotType,
    tipo_infracao: formData.violationType,
    descricao: formData.description,
    midias: mediasBase64
  }

  const response = await fetch(`${API_URL}/denuncias`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('API Error:', errorText)
    throw new Error(`Failed to submit report: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  return data
}

/**
 * Get all denuncias (optionally filtered by status)
 */
export async function fetchDenuncias(status?: string): Promise<DenunciaResponse[]> {
  const url = status
    ? `${API_URL}/denuncias?status=${encodeURIComponent(status)}`
    : `${API_URL}/denuncias`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to fetch reports: ${response.status} ${response.statusText}`)
  }

  return await response.json()
}

/**
 * Get a specific denúncia by ID
 */
export async function fetchDenuncia(id: string): Promise<DenunciaResponse> {
  const response = await fetch(`${API_URL}/denuncias/${id}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch report: ${response.status} ${response.statusText}`)
  }

  return await response.json()
}

/**
 * Update the status of a denúncia
 */
export async function updateDenunciaStatus(
  id: string,
  status: 'pendente' | 'em_analise' | 'resolvida' | 'arquivada'
): Promise<{ message: string; status: string }> {
  const response = await fetch(`${API_URL}/denuncias/${id}/status?status=${status}`, {
    method: 'PATCH',
  })

  if (!response.ok) {
    throw new Error(`Failed to update status: ${response.status} ${response.statusText}`)
  }

  return await response.json()
}

/**
 * Delete a denúncia
 */
export async function deleteDenuncia(id: string): Promise<{ message: string }> {
  const response = await fetch(`${API_URL}/denuncias/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error(`Failed to delete report: ${response.status} ${response.statusText}`)
  }

  return await response.json()
}
