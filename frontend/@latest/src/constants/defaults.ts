/**
 * Default constants for the application
 */

// Search radius in kilometers
export const SEARCH_RADIUS_KM = 3
export const NEARBY_RADIUS_KM = 0.5

// Map configuration
export const DEFAULT_ZOOM = 14
export const FOCUSED_ZOOM = 15

// API configuration
export const API_URL = import.meta.env.VITE_BACKEND_URL
export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

// UI Text (in Portuguese for users)
export const ERROR_MESSAGES = {
  LOCATION_UNAVAILABLE: 'Não foi possível obter sua localização. Tente novamente mais tarde.',
  FETCH_SPOTS_FAILED: 'Não foi possível carregar as vagas. Tente novamente mais tarde.',
  MAPS_NOT_LOADED: 'Google Maps não carregado',
  ROUTE_NOT_AVAILABLE: 'Não foi possível obter informações de rota',
  ADDRESS_NOT_FOUND: 'Endereço não encontrado',
  GEOCODING_ERROR: 'Erro ao buscar endereço',
  DRAW_ROUTE_FAILED: 'Não foi possível traçar a rota',
  ALLOW_LOCATION_ACCESS: 'Permita o acesso à sua localização para traçar rotas'
}

export const SUCCESS_MESSAGES = {
  LOCATION_FOUND: 'Localização encontrada com sucesso'
}
