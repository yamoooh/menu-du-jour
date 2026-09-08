import React, { useEffect, useState, useCallback } from 'react'
import { reservationService } from '@/services/reservationService'
import {
  type ReservationWithDetails,
  RESERVATION_STATUS_MAP,
} from '@/types/reservation.types'
import {
  Calendar,
  Clock,
  Users,
  Store,
  Phone,
  MapPin,
  XCircle,
  RefreshCw,
  Utensils,
  AlertCircle,
  Plus,
} from 'lucide-react'

interface ClientReservationsListProps {
  onOpenReservationModal?: () => void
}

export const ClientReservationsList: React.FC<ClientReservationsListProps> = ({
  onOpenReservationModal,
}) => {
  const [reservations, setReservations] = useState<ReservationWithDetails[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [cancellingId, setCancellingId] = useState<string | null>(null)

  const loadReservations = useCallback(async () => {
    setLoading(true)
    const { data } = await reservationService.fetchClientReservations()
    setReservations(data || [])
    setLoading(false)
  }, [])

  useEffect(() => {
    loadReservations()
  }, [loadReservations])

  const handleCancelReservation = async (reservationId: string) => {
    if (!window.confirm('Voulez-vous vraiment annuler cette réservation ?')) {
      return
    }

    setCancellingId(reservationId)
    const { error } = await reservationService.updateReservationStatus(reservationId, 'cancelled')
    setCancellingId(null)

    if (!error) {
      loadReservations()
    } else {
      alert('Erreur lors de l\'annulation de la réservation.')
    }
  }

  // Formater la date en français
  const formatDateFr = (dateStr: string) => {
    try {
      const date = new Date(dateStr + 'T00:00:00')
      return date.toLocaleDateString('fr-FR', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    } catch {
      return dateStr
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
      {/* En-tête avec bouton de création */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-orange-600" />
            Mes Réservations
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Historique et état de vos demandes de réservations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadReservations}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {onOpenReservationModal && (
            <button
              onClick={onOpenReservationModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Réserver une table
            </button>
          )}
        </div>
      </div>

      {/* Liste des cartes */}
      {loading ? (
        <div className="py-12 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto" />
          <p className="text-xs font-medium text-slate-500">Chargement de vos réservations...</p>
        </div>
      ) : reservations.length === 0 ? (
        <div className="py-10 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 mx-auto flex items-center justify-center">
            <Utensils className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-slate-800 text-sm">Vous n'avez aucune réservation</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Réservez dès maintenant votre table auprès d'un restaurant partenaire de Menu du Jour.
          </p>

          {onOpenReservationModal && (
            <button
              onClick={onOpenReservationModal}
              className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Effectuer une réservation
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {reservations.map((res) => {
            const statusConfig = RESERVATION_STATUS_MAP[res.status]
            const isCancelling = cancellingId === res.id

            return (
              <div
                key={res.id}
                className="bg-slate-50/60 rounded-2xl border border-slate-200 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:bg-white hover:shadow-xs"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-slate-900 text-base flex items-center gap-1.5">
                      <Store className="w-4 h-4 text-orange-600" />
                      {res.restaurant?.name || 'Restaurant'}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${statusConfig.badgeColor} ${statusConfig.textColor} ${statusConfig.borderColor}`}
                    >
                      {statusConfig.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-600 flex-wrap font-medium">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatDateFr(res.reservation_date)}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-mono font-bold text-slate-800">
                        {res.reservation_time.slice(0, 5)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{res.party_size} personne{res.party_size > 1 ? 's' : ''}</span>
                    </div>
                  </div>

                  {/* Coordonnées resto */}
                  {(res.restaurant?.address || res.restaurant?.phone) && (
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 flex-wrap">
                      {res.restaurant.address && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {res.restaurant.address} {res.restaurant.city ? `(${res.restaurant.city})` : ''}
                        </span>
                      )}
                      {res.restaurant.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {res.restaurant.phone}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Refus */}
                  {res.status === 'rejected' && res.rejection_reason && (
                    <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <span>
                        <strong className="font-bold">Motif du refus :</strong> {res.rejection_reason}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action d'annulation par le client si pending */}
                {res.status === 'pending' && (
                  <button
                    onClick={() => handleCancelReservation(res.id)}
                    disabled={isCancelling}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    <XCircle className="w-4 h-4" />
                    Annuler
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
