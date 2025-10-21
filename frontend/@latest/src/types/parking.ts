/**
 * Core types for the parking spots application
 * This application helps people with special needs find accessible parking spots
 */

export interface ParkingSpot {
  _id: string
  name: string
  address: string
  latitude: number
  longitude: number
  totalSpots: number
  availableSpots: number
  parking_pregnant: boolean
  parking_elderly: boolean
  parking_disabled: boolean
}

export interface Coordinates {
  lat: number
  lng: number
}

export interface RouteInfo {
  distance: string
  duration: string
}

export type PageType = 'home' | 'map' | 'about' | 'denuncias'

export type SpotType = 'pregnant' | 'elderly' | 'disabled'

export type ViolationType = 'no_credential' | 'blocking_access' | 'misuse' | 'other'

export interface ReportFormData {
  address: string
  latitude: number | null
  longitude: number | null
  spotType: SpotType
  violationType: ViolationType
  description: string
  media: File[]
}

export interface StatusReport {
  _id: string
  vaga_id: string
  vagas_disponiveis: number
  total_vagas: number
  timestamp: string
  ip_address: string
  observacoes?: string
  minutes_ago?: number
}

export interface StatusReportSubmission {
  vagas_disponiveis: number
  total_vagas: number
  observacoes?: string
}

export type StatusOption = 'all_occupied' | 'partially_occupied' | 'available'
