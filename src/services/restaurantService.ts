import { supabase } from '@/lib/supabase'
import type {
  Restaurant,
  RestaurantHours,
  Subscription,
  DayHoursInput,
  RestaurantStats,
} from '@/types/restaurant.types'

export const restaurantService = {
  // Récupère tous les restaurants appartenant à l'utilisateur connecté
  async fetchMyRestaurants(): Promise<{ data: Restaurant[] | null; error: Error | null }> {
    if (!supabase) return { data: null, error: new Error('Client Supabase non initialisé') }

    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) return { data: null, error: new Error(translateDbError(error.message)) }
      return { data, error: null }
    } catch (err) {
      return { data: null, error: new Error('Erreur de chargement des restaurants') }
    }
  },

  // Créer un nouveau restaurant (slug & subscription créés automatiquement en DB)
  async createRestaurant(payload: {
    name: string
    phone?: string
    email?: string
    address?: string
    city?: string
    description?: string
    cuisine_type?: string
    capacity?: number
  }): Promise<{ data: Restaurant | null; error: Error | null }> {
    if (!supabase) return { data: null, error: new Error('Client Supabase non initialisé') }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { data: null, error: new Error('Utilisateur non connecté') }

    try {
      const { data, error } = await supabase
        .from('restaurants')
        .insert({
          owner_id: user.id,
          name: payload.name.trim(),
          phone: payload.phone?.trim() || null,
          email: payload.email?.trim() || null,
          address: payload.address?.trim() || null,
          city: payload.city?.trim() || null,
          description: payload.description?.trim() || null,
          cuisine_type: payload.cuisine_type?.trim() || null,
          capacity: payload.capacity || 20,
        })
        .select('*')
        .single()

      if (error) return { data: null, error: new Error(translateDbError(error.message)) }
      return { data, error: null }
    } catch (err) {
      return { data: null, error: new Error('Erreur lors de la création du restaurant') }
    }
  },

  // Mettre à jour les informations d'un restaurant
  async updateRestaurant(
    id: string,
    payload: {
      name?: string
      phone?: string
      email?: string
      address?: string
      city?: string
      description?: string
      cuisine_type?: string
      capacity?: number
      is_active?: boolean
    }
  ): Promise<{ data: Restaurant | null; error: Error | null }> {
    if (!supabase) return { data: null, error: new Error('Client Supabase non initialisé') }

    try {
      const { data, error } = await supabase
        .from('restaurants')
        .update({
          ...(payload.name && { name: payload.name.trim() }),
          phone: payload.phone !== undefined ? payload.phone?.trim() || null : undefined,
          email: payload.email !== undefined ? payload.email?.trim() || null : undefined,
          address: payload.address !== undefined ? payload.address?.trim() || null : undefined,
          city: payload.city !== undefined ? payload.city?.trim() || null : undefined,
          description: payload.description !== undefined ? payload.description?.trim() || null : undefined,
          cuisine_type: payload.cuisine_type !== undefined ? payload.cuisine_type?.trim() || null : undefined,
          capacity: payload.capacity !== undefined ? payload.capacity : undefined,
          is_active: payload.is_active !== undefined ? payload.is_active : undefined,
        })
        .eq('id', id)
        .select('*')
        .single()

      if (error) return { data: null, error: new Error(translateDbError(error.message)) }
      return { data, error: null }
    } catch (err) {
      return { data: null, error: new Error('Erreur lors de la mise à jour du restaurant') }
    }
  },

  // Récupérer les horaires d'un restaurant
  async fetchRestaurantHours(
    restaurantId: string
  ): Promise<{ data: RestaurantHours[] | null; error: Error | null }> {
    if (!supabase) return { data: null, error: new Error('Client Supabase non initialisé') }

    try {
      const { data, error } = await supabase
        .from('restaurant_hours')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('day_of_week', { ascending: true })

      if (error) return { data: null, error: new Error(translateDbError(error.message)) }
      return { data, error: null }
    } catch (err) {
      return { data: null, error: new Error('Erreur lors du chargement des horaires') }
    }
  },

  // Sauvegarder/mettre à jour les horaires (7 jours)
  async saveRestaurantHours(
    restaurantId: string,
    hours: DayHoursInput[]
  ): Promise<{ error: Error | null }> {
    if (!supabase) return { error: new Error('Client Supabase non initialisé') }

    try {
      const recordsToUpsert = hours.map((h) => ({
        restaurant_id: restaurantId,
        day_of_week: h.day_of_week,
        is_closed: h.is_closed,
        open_time: h.is_closed ? null : h.open_time || '08:00',
        close_time: h.is_closed ? null : h.close_time || '22:00',
      }))

      const { error } = await supabase
        .from('restaurant_hours')
        .upsert(recordsToUpsert, { onConflict: 'restaurant_id,day_of_week' })

      if (error) return { error: new Error(translateDbError(error.message)) }
      return { error: null }
    } catch (err) {
      return { error: new Error('Erreur lors de l\'enregistrement des horaires') }
    }
  },

  // Récupérer l'abonnement du restaurant
  async fetchSubscription(
    restaurantId: string
  ): Promise<{ data: Subscription | null; error: Error | null }> {
    if (!supabase) return { data: null, error: new Error('Client Supabase non initialisé') }

    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .maybeSingle()

      if (error) return { data: null, error: new Error(translateDbError(error.message)) }
      return { data, error: null }
    } catch (err) {
      return { data: null, error: new Error('Erreur lors du chargement de l\'abonnement') }
    }
  },

  // Récupérer les statistiques globales du restaurant
  async fetchRestaurantStats(
    restaurantId: string
  ): Promise<{ data: RestaurantStats | null; error: Error | null }> {
    if (!supabase) return { data: null, error: new Error('Client Supabase non initialisé') }

    try {
      const [menusRes, resRes, followersRes] = await Promise.all([
        supabase
          .from('menus')
          .select('id', { count: 'exact', head: true })
          .eq('restaurant_id', restaurantId)
          .eq('status', 'published'),
        supabase
          .from('reservations')
          .select('id', { count: 'exact', head: true })
          .eq('restaurant_id', restaurantId),
        supabase
          .from('restaurant_followers')
          .select('id', { count: 'exact', head: true })
          .eq('restaurant_id', restaurantId),
      ])

      return {
        data: {
          publishedMenusCount: menusRes.count || 0,
          reservationsCount: resRes.count || 0,
          followersCount: followersRes.count || 0,
        },
        error: null,
      }
    } catch (err) {
      return {
        data: { publishedMenusCount: 0, reservationsCount: 0, followersCount: 0 },
        error: null,
      }
    }
  },
}

function translateDbError(message: string): string {
  const lower = message.toLowerCase()
  if (lower.includes('unique constraint') || lower.includes('duplicate key')) {
    return 'Un enregistrement avec cette valeur existe déjà.'
  }
  if (lower.includes('permission denied') || lower.includes('row-level security')) {
    return 'Vous n\'avez pas les autorisations nécessaires pour cette action.'
  }
  return 'Une erreur est survenue lors de la communication avec la base de données.'
}
