import React, { useEffect, useState, useCallback } from 'react'
import { reservationService } from '@/services/reservationService'
import {
  type ReservationStatus,
  type ReservationWithDetails,
  RESERVATION_STATUS_MAP,
} from '@/types/reservation.types'
import {
  Calendar,
  Users,
  User,
  Phone,
  MessageSquare,
  CheckCircle,
  XCircle,
  CheckCheck,
  UserX,
  RefreshCw,
  Utensils,
  Filter,
} from 'lucide-react'

interface RestaurantReservationsListProps {
  restaurantId: string
  restaurantName: string
}

type FilterStatus = ReservationStatus | 'all'

export const RestaurantReservationsList: React.FC<RestaurantReservationsListProps> = ({
  restaurantId,
  restaurantName,
}) => {
  const [reservations, setReservations] = useState<ReservationWithDetails[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all')

  // Modal de motif de refus
  const [rejectingReservationId, setRejectingReservationId] = useState<string | null>(null)
  const [rejectionReason, setRejectionReason] = useState<string>('')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const loadReservations = useCallback(async () => {
    setLoading(true)
    const { data } = await reservationService.fetchRestaurantReservations(restaurantId, statusFilter)
    setReservations(data || [])
    setLoading(false)
  }, [restaurantId, statusFilter])

  useEffect(() => {
    loadReservations()
  }, [loadReservations])

  const handleUpdateStatus = async (
    reservationId: string,
    newStatus: ReservationStatus,
    reason?: string
  ) => {
    setUpdatingId(reservationId)
    const { error } = await reservationService.updateReservationStatus(
      reservationId,
      newStatus,
      reason
    )
    setUpdatingId(null)

    if (!error) {
      setRejectingReservationId(null)
      setRejectionReason('')
      loadReservations()
    } else {
      alert('Erreur lors de la mise à jour de la réservation.')
    }
  }

  const filters: { id: FilterStatus; label: string }[] = [
    { id: 'all', label: 'Toutes' },
    { id: 'pending', label: 'En attente' },
    { id: 'confirmed', label: 'Confirmées' },
    { id: 'rejected', label: 'Refusées' },
    { id: 'completed', label: 'Terminées' },
    { id: 'no_show', label: 'Absents' },
    { id: 'cancelled', label: 'Annulées' },
  ]

  // Formater la date en français (ex: "Lundi 15 Septembre 2026")
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
    <div className="space-y-6">
      {/* En-tête avec rafraîchissement */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5 text-orange-600" />
            Gestion des Réservations
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Réservations reçues pour <strong>{restaurantName}</strong>
          </p>
        </div>

        <button
          onClick={loadReservations}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Actualiser
        </button>
      </div>

      {/* Barre de filtres */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-xs overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-max">
          <span className="px-2.5 py-1 text-slate-400 text-xs font-semibold flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Filtrer par :
          </span>
          {filters.map((f) => {
            const isActive = statusFilter === f.id
            return (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {f.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Liste des cartes de réservation */}
      {loading ? (
        <div className="py-12 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto" />
          <p className="text-xs font-medium text-slate-500">Chargement des réservations...</p>
        </div>
      ) : reservations.length === 0 ? (
        <div className="py-12 bg-white rounded-2xl border border-slate-200 text-center space-y-3 p-6">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-slate-800 text-sm">Aucune réservation trouvée</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {statusFilter === 'all'
              ? 'Aucune réservation n\'a encore été enregistrée pour cet établissement.'
              : `Aucune réservation avec le statut "${RESERVATION_STATUS_MAP[statusFilter as ReservationStatus]?.label || statusFilter}".`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reservations.map((res) => {
            const statusConfig = RESERVATION_STATUS_MAP[res.status]
            const isUpdating = updatingId === res.id

            return (
              <div
                key={res.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
              >
                {/* En-tête de carte */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-extrabold px-2.5 py-1 rounded-lg bg-slate-900 text-white">
                        {res.reservation_time.slice(0, 5)}
                      </span>
                      <span className="text-xs font-bold text-slate-800">
                        {formatDateFr(res.reservation_date)}
                      </span>
                    </div>

                    {/* Badge de statut */}
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusConfig.badgeColor} ${statusConfig.textColor} ${statusConfig.borderColor}`}
                    >
                      {statusConfig.label}
                    </span>
                  </div>

                  {/* Infos client */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                        <User className="w-4 h-4 text-orange-600 shrink-0" />
                        {res.customer_name}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-extrabold text-[11px] flex items-center gap-1">
                        <Users className="w-3 h-3 text-slate-500" />
                        {res.party_size} pers.
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-600 font-medium">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <a
                        href={`tel:${res.customer_phone}`}
                        className="hover:text-orange-600 underline decoration-slate-300"
                      >
                        {res.customer_phone}
                      </a>
                    </div>

                    {/* Menu réservé si applicable */}
                    {res.menu && (
                      <div className="flex items-center gap-2 text-slate-700 bg-amber-50/70 p-2 rounded-xl border border-amber-200/60 font-medium text-[11px]">
                        <Utensils className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>
                          Menu : <strong>{res.menu.title}</strong>
                        </span>
                      </div>
                    )}

                    {/* Remarque ou message */}
                    {res.message && (
                      <div className="flex items-start gap-2 text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] italic">
                        <MessageSquare className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span>"{res.message}"</span>
                      </div>
                    )}

                    {/* Raison du refus */}
                    {res.status === 'rejected' && res.rejection_reason && (
                      <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-[11px]">
                        <strong className="font-bold">Motif du refus :</strong> {res.rejection_reason}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions selon le statut */}
                <div className="pt-2 border-t border-slate-100">
                  {res.status === 'pending' && (
                    <div className="space-y-2">
                      {rejectingReservationId === res.id ? (
                        <div className="space-y-2 bg-red-50 p-3 rounded-xl border border-red-200">
                          <label className="block text-[11px] font-bold text-red-900">
                            Motif du refus :
                          </label>
                          <input
                            type="text"
                            placeholder="ex: Complet pour ce service"
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-red-300 text-xs font-medium outline-hidden"
                          />
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setRejectingReservationId(null)
                                setRejectionReason('')
                              }}
                              className="px-2.5 py-1 rounded-lg text-slate-600 hover:bg-slate-200 text-xs font-semibold cursor-pointer"
                            >
                              Annuler
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(res.id, 'rejected', rejectionReason)}
                              disabled={isUpdating}
                              className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                            >
                              Confirmer le refus
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleUpdateStatus(res.id, 'confirmed')}
                            disabled={isUpdating}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Confirmer
                          </button>
                          <button
                            onClick={() => {
                              setRejectingReservationId(res.id)
                              setRejectionReason('')
                            }}
                            disabled={isUpdating}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
                          >
                            <XCircle className="w-4 h-4" />
                            Refuser
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {res.status === 'confirmed' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateStatus(res.id, 'completed')}
                        disabled={isUpdating}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <CheckCheck className="w-4 h-4" />
                        Repas terminé
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(res.id, 'no_show')}
                        disabled={isUpdating}
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-700 font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <UserX className="w-4 h-4" />
                        Client absent
                      </button>
                    </div>
                  )}

                  {['completed', 'rejected', 'cancelled', 'no_show'].includes(res.status) && (
                    <div className="text-center text-[11px] font-semibold text-slate-400 py-1">
                      Aucune action requise
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
