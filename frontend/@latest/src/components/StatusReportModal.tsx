import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, AlertCircle, CheckCircle } from 'lucide-react'
import type { ParkingSpot, StatusOption } from '../types/parking'
import { useStatusReport } from '../hooks/useStatusReport'
import '../styles/StatusReport.css'

interface StatusReportModalProps {
  isOpen: boolean
  onClose: () => void
  spot: ParkingSpot
  onSuccess?: () => void
}

const StatusReportModal = ({ isOpen, onClose, spot, onSuccess }: StatusReportModalProps) => {
  // Se tem <= 2 vagas, inicia com 'available', senão 'partially_occupied'
  const getInitialOption = () => spot.totalSpots <= 2 ? 'available' : 'partially_occupied'

  const [statusOption, setStatusOption] = useState<StatusOption>(getInitialOption())
  const [availableSpots, setAvailableSpots] = useState(Math.floor(spot.totalSpots / 2))
  const [observacoes, setObservacoes] = useState('')
  const [confirmLocation, setConfirmLocation] = useState(false)

  const { submit, loading, error, success, reset } = useStatusReport()

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setStatusOption(getInitialOption())
      setAvailableSpots(Math.floor(spot.totalSpots / 2))
      setObservacoes('')
      setConfirmLocation(false)
      reset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, spot.totalSpots])

  // Auto-close after success
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        onSuccess?.()
        onClose()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [success, onClose, onSuccess])

  // Prevenir scroll do body quando modal está aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!confirmLocation) {
      return
    }

    let vagas_disponiveis = 0
    if (statusOption === 'all_occupied') {
      vagas_disponiveis = 0
    } else if (statusOption === 'available') {
      vagas_disponiveis = spot.totalSpots
    } else {
      vagas_disponiveis = availableSpots
    }

    const result = await submit(spot._id, {
      vagas_disponiveis,
      total_vagas: spot.totalSpots,
      observacoes: observacoes.trim() || undefined
    })

    if (result) {
      // Success handled by useEffect
    }
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const modalContent = (
    <div className="status-modal-overlay" onClick={handleOverlayClick}>
      <div className="status-modal" onClick={(e) => e.stopPropagation()}>
        <button
          className="status-modal-close"
          onClick={onClose}
          aria-label="Fechar"
        >
          <X size={20} />
        </button>

        <h2 className="status-modal-title">Reportar Status Atual</h2>
        <p className="status-modal-subtitle">{spot.name}</p>

        {success ? (
          <div className="status-success-message">
            <CheckCircle size={48} className="success-icon" />
            <p>Report enviado com sucesso!</p>
            <small>Obrigado por ajudar a comunidade</small>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="status-form">
            <div className="form-group">
              <label className="form-label">Status atual das vagas:</label>

              <label className={`status-radio-option ${statusOption === 'all_occupied' ? 'checked' : ''}`}>
                <input
                  type="radio"
                  name="status"
                  value="all_occupied"
                  checked={statusOption === 'all_occupied'}
                  onChange={() => setStatusOption('all_occupied')}
                />
                <span className="radio-label">
                  <strong>Todas ocupadas</strong> (0 disponíveis)
                </span>
              </label>

              {spot.totalSpots > 2 && (
                <>
                  <label className={`status-radio-option ${statusOption === 'partially_occupied' ? 'checked' : ''}`}>
                    <input
                      type="radio"
                      name="status"
                      value="partially_occupied"
                      checked={statusOption === 'partially_occupied'}
                      onChange={() => setStatusOption('partially_occupied')}
                    />
                    <span className="radio-label">
                      <strong>Parcialmente ocupado</strong>
                    </span>
                  </label>

                  {statusOption === 'partially_occupied' && (
                    <div className="spots-input-container">
                      <label htmlFor="available-spots" className="spots-label">
                        Quantas vagas disponíveis?
                      </label>
                      <div className="spots-input-group">
                        <input
                          id="available-spots"
                          type="number"
                          min="1"
                          max={spot.totalSpots - 1}
                          value={availableSpots}
                          onChange={e => setAvailableSpots(parseInt(e.target.value) || 0)}
                          className="spots-input"
                        />
                        <span className="spots-total">de {spot.totalSpots}</span>
                      </div>
                    </div>
                  )}
                </>
              )}

              <label className={`status-radio-option ${statusOption === 'available' ? 'checked' : ''}`}>
                <input
                  type="radio"
                  name="status"
                  value="available"
                  checked={statusOption === 'available'}
                  onChange={() => setStatusOption('available')}
                />
                <span className="radio-label">
                  <strong>Disponível</strong> (muitas vagas)
                </span>
              </label>
            </div>

            <div className="form-group">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={confirmLocation}
                  onChange={e => setConfirmLocation(e.target.checked)}
                />
                <span className="checkbox-label">Estou no local agora</span>
              </label>
            </div>

            <div className="form-group">
              <label htmlFor="observacoes" className="form-label">
                Observações (opcional)
              </label>
              <textarea
                id="observacoes"
                value={observacoes}
                onChange={e => setObservacoes(e.target.value)}
                placeholder="Ex: Vaga temporariamente interditada, reforma em andamento..."
                className="form-textarea"
                rows={3}
                maxLength={200}
              />
              <small className="char-count">{observacoes.length}/200</small>
            </div>

            {error && (
              <div className="error-message">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <div className="modal-actions">
              <button
                type="button"
                onClick={onClose}
                className="btn-cancel"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-submit"
                disabled={loading || !confirmLocation}
              >
                {loading ? 'Enviando...' : 'Enviar Report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )

  // Renderiza o modal diretamente no body, fora da hierarquia do componente pai
  return createPortal(modalContent, document.body)
}

export default StatusReportModal
