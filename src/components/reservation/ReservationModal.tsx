import React, { useEffect, useState, useMemo } from 'react'
import { useAuth } from '@/context/AuthContext'
import { reservationService } from '@/services/reservationService'
import { restaurantService } from '@/services/restaurantService'
import type { Restaurant, RestaurantHours } from '@/types/restaurant.types'
import type { MenuWithDetails } from '@/types/menu.types'
import { X, Calendar, Clock, Users, User, Phone, MessageSquare, Utensils, AlertCircle, CheckCircle2 } from 'lucide-react'

interface ReservationModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  restaurant?: Restaurant | null
  restaurants?: Restaurant[]
  menus?: MenuWithDetails[]
}

export const ReservationModal: React.FC<ReservationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  restaurant: initialRestaurant,
  restaurants = [],
  menus = [],
}) => {
  const { user, profile } = useAuth()

  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(initialRestaurant || null)
  const [hours, setHours] = useState<RestaurantHours[] | null>(null)
  
  // Champs du formulaire
  const [reservationDate, setReservationDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  )
  const [reservationTime, setReservationTime] = useState<string>('')
  const [partySize, setPartySize] = useState<number>(2)
  const [customerName, setCustomerName] = useState<string>('')
  const [customerPhone, setCustomerPhone] = useState<string>('')
  const [menuId, setMenuId] = useState<string>('')
  const [message, setMessage] = useState<string>('')

  const [submitting, setSubmitting] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)

  // Remplissage automatique des infos client au chargement
  useEffect(() => {
    if (profile) {
      if (profile.full_name) setCustomerName(profile.full_name)
      if (profile.phone) setCustomerPhone(profile.phone)
    }
  }, [profile])

  // Mettre à jour le restaurant sélectionné si prop change
  useEffect(() => {
    if (initialRestaurant) {
      setSelectedRestaurant(initialRestaurant)
    } else if (restaurants.length > 0 && !selectedRestaurant) {
      setSelectedRestaurant(restaurants[0])
    }
  }, [initialRestaurant, restaurants])

  // Charger les horaires du restaurant sélectionné
  useEffect(() => {
    if (selectedRestaurant?.id) {
      restaurantService.fetchRestaurantHours(selectedRestaurant.id).then((res) => {
        if (res.data) setHours(res.data)
      })
    }
  }, [selectedRestaurant?.id])

  // Calcul du jour de la semaine pour la date sélectionnée (0 = Lundi, ..., 6 = Dimanche)
  const timeSlots = useMemo(() => {
    if (!reservationDate || !hours || hours.length === 0) return []

    // Date Javascript : 0 = Dimanche, 1 = Lundi ... 6 = Samedi
    const jsDay = new Date(reservationDate + 'T00:00:00').getDay()
    // Conversion vers schéma DB : 0 = Lundi, 1 = Mardi, ..., 6 = Dimanche
    const dbDay = jsDay === 0 ? 6 : jsDay - 1

    const hoursForDay = hours.find((h) => h.day_of_week === dbDay) || null
    return reservationService.generateTimeSlots(hoursForDay)
  }, [reservationDate, hours])

  // Si l'heure actuellement sélectionnée n'est pas dans les créneaux disponibles, réinitialiser
  useEffect(() => {
    if (timeSlots.length > 0 && !timeSlots.includes(reservationTime)) {
      setReservationTime(timeSlots[0])
    } else if (timeSlots.length === 0) {
      setReservationTime('')
    }
  }, [timeSlots, reservationTime])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!user) {
      setError('Vous devez être connecté pour réserver une table.')
      return
    }

    if (!selectedRestaurant) {
      setError('Veuillez sélectionner un restaurant.')
      return
    }

    if (!reservationDate) {
      setError('Veuillez choisir une date de réservation.')
      return
    }

    if (!reservationTime) {
      setError('Aucun créneau horaire sélectionné ou le restaurant est fermé ce jour-là.')
      return
    }

    if (!customerName.trim()) {
      setError('Veuillez indiquer votre nom complet.')
      return
    }

    if (!customerPhone.trim()) {
      setError('Veuillez indiquer un numéro de téléphone de contact.')
      return
    }

    setSubmitting(true)

    const { error: insertError } = await reservationService.createReservation({
      restaurant_id: selectedRestaurant.id,
      client_id: user.id,
      reservation_date: reservationDate,
      reservation_time: reservationTime,
      party_size: partySize,
      customer_name: customerName.trim(),
      customer_phone: customerPhone.trim(),
      menu_id: menuId || null,
      message: message.trim() || null,
    })

    setSubmitting(false)

    if (insertError) {
      setError('Impossible d\'enregistrer votre réservation. Veuillez réessayer.')
    } else {
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        onSuccess?.()
        onClose()
      }, 2000)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
        {/* En-tête modal */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400 border border-orange-500/30">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base tracking-tight">Réserver une table</h3>
              <p className="text-xs text-slate-300">
                {selectedRestaurant ? selectedRestaurant.name : 'Sélectionnez un établissement'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message de succès */}
        {success ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 text-lg">Demande envoyée avec succès !</h4>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                Votre réservation à <strong>{selectedRestaurant?.name}</strong> est en attente de confirmation par le restaurateur.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            {/* Sélection du restaurant si non pré-sélectionné */}
            {!initialRestaurant && restaurants.length > 0 && (
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 block">Restaurant</label>
                <select
                  value={selectedRestaurant?.id || ''}
                  onChange={(e) => {
                    const r = restaurants.find((item) => item.id === e.target.value) || null
                    setSelectedRestaurant(r)
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-hidden"
                >
                  {restaurants.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} {r.city ? `(${r.city})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Date & Heure */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-orange-600" />
                  Date souhaitée
                </label>
                <input
                  type="date"
                  value={reservationDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setReservationDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-orange-600" />
                  Créneau horaire
                </label>
                {timeSlots.length > 0 ? (
                  <select
                    value={reservationTime}
                    onChange={(e) => setReservationTime(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-hidden"
                  >
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="px-3 py-2 rounded-xl border border-amber-200 bg-amber-50 text-amber-800 font-medium text-[11px]">
                    Fermé ou aucun créneau disponible à cette date.
                  </div>
                )}
              </div>
            </div>

            {/* Instructions spécifiques du restaurateur s'il y en a */}
            {selectedRestaurant?.reservation_instructions && (
              <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 text-xs text-orange-900 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold block">Note du restaurant :</strong>
                  <span>{selectedRestaurant.reservation_instructions}</span>
                </div>
              </div>
            )}

            {/* Nombre de personnes */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-orange-600" />
                Nombre de personnes (convives - max {selectedRestaurant?.max_party_size || 10})
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={1}
                  max={selectedRestaurant?.max_party_size || 10}
                  value={partySize}
                  onChange={(e) => setPartySize(parseInt(e.target.value, 10))}
                  className="flex-1 accent-orange-600 cursor-pointer"
                />
                <span className="px-3 py-1.5 rounded-xl bg-orange-100 text-orange-700 font-extrabold text-xs min-w-[3.5rem] text-center border border-orange-200">
                  {partySize} {partySize > 1 ? 'pers.' : 'pers.'}
                </span>
              </div>
            </div>

            {/* Nom & Téléphone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-orange-600" />
                  Nom complet
                </label>
                <input
                  type="text"
                  placeholder="ex: Jean Dupont"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-orange-600" />
                  Téléphone de contact
                </label>
                <input
                  type="tel"
                  placeholder="ex: 06 12 34 56 78"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-hidden"
                />
              </div>
            </div>

            {/* Choix d'un menu si disponible */}
            {menus.length > 0 && (
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5 text-orange-600" />
                  Menu du Jour souhaité (Optionnel)
                </label>
                <select
                  value={menuId}
                  onChange={(e) => setMenuId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-hidden"
                >
                  <option value="">-- Aucun menu particulier --</option>
                  {menus.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.title} ({m.menu_date})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Message ou allergie */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-orange-600" />
                Message ou remarques (Optionnel)
              </label>
              <textarea
                rows={2}
                placeholder="ex: Allergie aux arachides, table près de la fenêtre..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-hidden resize-none"
              />
            </div>

            {/* Pied du modal */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold cursor-pointer transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={submitting || timeSlots.length === 0}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-bold shadow-md shadow-orange-500/20 transition-all cursor-pointer"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  'Confirmer la réservation'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
