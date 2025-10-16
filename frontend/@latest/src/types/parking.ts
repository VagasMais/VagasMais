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
