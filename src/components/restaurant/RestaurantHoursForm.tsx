import React, { useState, useEffect } from 'react'
import type { RestaurantHours, DayHoursInput } from '@/types/restaurant.types'
import { DAYS_OF_WEEK } from '@/types/restaurant.types'
import { restaurantService } from '@/services/restaurantService'
import { Clock, Check, AlertCircle, Save } from 'lucide-react'

interface RestaurantHoursFormProps {
  restaurantId: string
  existingHours: RestaurantHours[] | null
  onSaved?: () => void
}

export const RestaurantHoursForm: React.FC<RestaurantHoursFormProps> = ({
  restaurantId,
  existingHours,
  onSaved,
}) => {
  const [hoursState, setHoursState] = useState<DayHoursInput[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    // Initialiser les 7 jours de la semaine (0 à 6)
    const initialHours: DayHoursInput[] = DAYS_OF_WEEK.map((d) => {
      const found = existingHours?.find((h) => h.day_of_week === d.day)
      return {
        day_of_week: d.day,
        day_label: d.label,
        is_closed: found ? found.is_closed : false,
        open_time: found?.open_time ? found.open_time.slice(0, 5) : '08:00',
        close_time: found?.close_time ? found.close_time.slice(0, 5) : '22:00',
      }
    })
    setHoursState(initialHours)
    setError(null)
    setSuccess(null)
  }, [existingHours])

  const handleToggleClosed = (dayOfWeek: number) => {
    setHoursState((prev) =>
      prev.map((item) =>
        item.day_of_week === dayOfWeek ? { ...item, is_closed: !item.is_closed } : item
      )
    )
  }

  const handleTimeChange = (
    dayOfWeek: number,
    field: 'open_time' | 'close_time',
    value: string
  ) => {
    setHoursState((prev) =>
      prev.map((item) =>
        item.day_of_week === dayOfWeek ? { ...item, [field]: value } : item
      )
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    // Validation des heures
    for (const h of hoursState) {
      if (!h.is_closed) {
        if (!h.open_time || !h.close_time) {
          setError(`Veuillez renseigner les heures d'ouverture et de fermeture pour le ${h.day_label}.`)
          return
        }
        if (h.open_time >= h.close_time) {
          setError(
            `Pour le ${h.day_label}, l'heure de fermeture (${h.close_time}) doit être strictement postérieure à l'heure d'ouverture (${h.open_time}).`
          )
          return
        }
      }
    }

    setLoading(true)
    const { error: saveErr } = await restaurantService.saveRestaurantHours(restaurantId, hoursState)
    setLoading(false)

    if (saveErr) {
      setError(saveErr.message)
    } else {
      setSuccess('Vos horaires d\'ouverture ont été enregistrés avec succès !')
      if (onSaved) onSaved()
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Horaires d'ouverture</h3>
            <p className="text-xs text-slate-500">
              Définissez les jours et créneaux d'ouverture de votre restaurant
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        {hoursState.map((h) => (
          <div
            key={h.day_of_week}
            className={`p-3.5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-colors ${
              h.is_closed
                ? 'bg-slate-50 border-slate-200 text-slate-400'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between w-full sm:w-40">
              <span className="font-semibold text-sm">{h.day_label}</span>

              {/* Toggle Ouvert/Fermé */}
              <button
                type="button"
                onClick={() => handleToggleClosed(h.day_of_week)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                  h.is_closed
                    ? 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                    : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    h.is_closed ? 'bg-slate-400' : 'bg-emerald-500'
                  }`}
                />
                {h.is_closed ? 'Fermé' : 'Ouvert'}
              </button>
            </div>

            {/* Inputs Heure d'ouverture et fermeture */}
            {!h.is_closed ? (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="time"
                  value={h.open_time}
                  onChange={(e) => handleTimeChange(h.day_of_week, 'open_time', e.target.value)}
                  disabled={loading}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
                <span className="text-xs text-slate-400 font-medium">à</span>
                <input
                  type="time"
                  value={h.close_time}
                  onChange={(e) => handleTimeChange(h.day_of_week, 'close_time', e.target.value)}
                  disabled={loading}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
            ) : (
              <span className="text-xs italic text-slate-400">Établissement fermé ce jour</span>
            )}
          </div>
        ))}

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-semibold text-xs shadow-md shadow-orange-500/20 transition-all disabled:opacity-60 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Enregistrement...' : 'Enregistrer les horaires'}
          </button>
        </div>
      </form>
    </div>
  )
}
