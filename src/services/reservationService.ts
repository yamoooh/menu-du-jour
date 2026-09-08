import { supabase } from '@/lib/supabase'
import type {
  ReservationInsert,
  ReservationStatus,
  ReservationUpdate,
  ReservationWithDetails,
} from '@/types/reservation.types'
import type { RestaurantHours } from '@/types/restaurant.types'

export const reservationService = {
  /**
   * Récupère les réservations pour un restaurant donné, triées de la plus récente à la plus ancienne.
   */
  async fetchRestaurantReservations(
    restaurantId: string,
    statusFilter?: ReservationStatus | 'all'
  ): Promise<{ data: ReservationWithDetails[] | null; error: Error | null }> {
    try {
      let query = supabase
        .from('reservations')
        .select(
          `
          *,
          menu:menus ( id, title, menu_date )
        `
        )
        .eq('restaurant_id', restaurantId)
        .order('reservation_date', { ascending: false })
        .order('reservation_time', { ascending: false })

      if (statusFilter && statusFilter !== 'all') {
        query = query.eq('status', statusFilter)
      }

      const { data, error } = await query

      if (error) throw error
      return { data: data as ReservationWithDetails[], error: null }
    } catch (err: any) {
      console.error('Erreur lors de la récupération des réservations du restaurant:', err)
      return { data: null, error: err }
    }
  },

  /**
   * Récupère les réservations du client connecté.
   */
  async fetchClientReservations(): Promise<{
    data: ReservationWithDetails[] | null
    error: Error | null
  }> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error('Utilisateur non authentifié')
      }

      const { data, error } = await supabase
        .from('reservations')
        .select(
          `
          *,
          restaurant:restaurants ( id, name, slug, phone, address, city ),
          menu:menus ( id, title, menu_date )
        `
        )
        .eq('client_id', user.id)
        .order('reservation_date', { ascending: false })
        .order('reservation_time', { ascending: false })

      if (error) throw error
      return { data: data as ReservationWithDetails[], error: null }
    } catch (err: any) {
      console.error('Erreur lors de la récupération des réservations client:', err)
      return { data: null, error: err }
    }
  },

  /**
   * Crée une nouvelle réservation.
   */
  async createReservation(
    payload: ReservationInsert
  ): Promise<{ data: ReservationWithDetails | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .insert({
          ...payload,
          status: 'pending',
        })
        .select()
        .single()

      if (error) throw error
      return { data: data as ReservationWithDetails, error: null }
    } catch (err: any) {
      console.error('Erreur lors de la création de la réservation:', err)
      return { data: null, error: err }
    }
  },

  /**
   * Met à jour le statut d'une réservation (Confirmer, Refuser, Terminer, Absence, Annuler).
   */
  async updateReservationStatus(
    reservationId: string,
    status: ReservationStatus,
    rejectionReason?: string
  ): Promise<{ data: ReservationWithDetails | null; error: Error | null }> {
    try {
      const updateData: ReservationUpdate = { status }

      if (status === 'rejected') {
        updateData.rejection_reason = rejectionReason || 'Créneau non disponible'
      }

      const { data, error } = await supabase
        .from('reservations')
        .update(updateData)
        .eq('id', reservationId)
        .select()
        .single()

      if (error) throw error
      return { data: data as ReservationWithDetails, error: null }
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour du statut de réservation:', err)
      return { data: null, error: err }
    }
  },

  /**
   * Génère les créneaux horaires disponibles à partir d'un horaire d'ouverture/fermeture.
   * ex: "12:00:00" -> "14:30:00" avec un pas de 30min -> ["12:00", "12:30", "13:00", "13:30", "14:00"]
   */
  generateTimeSlots(
    hoursForDay: RestaurantHours | null,
    stepMinutes = 30
  ): string[] {
    if (!hoursForDay || hoursForDay.is_closed || !hoursForDay.open_time || !hoursForDay.close_time) {
      return []
    }

    const parseTime = (tStr: string) => {
      const parts = tStr.split(':')
      return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10)
    }

    const openMin = parseTime(hoursForDay.open_time)
    const closeMin = parseTime(hoursForDay.close_time)

    if (openMin >= closeMin) return []

    const slots: string[] = []
    // On s'arrête 30 min avant la fermeture pour laisser le temps de manger
    for (let current = openMin; current <= closeMin - stepMinutes; current += stepMinutes) {
      const h = Math.floor(current / 60)
      const m = current % 60
      const formatted = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
      slots.push(formatted)
    }

    return slots
  },
}
