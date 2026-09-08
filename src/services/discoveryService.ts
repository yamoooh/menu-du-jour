import { supabase } from '@/lib/supabase'
import type { Restaurant, RestaurantHours } from '@/types/restaurant.types'
import type { MenuWithDetails } from '@/types/menu.types'

export const discoveryService = {
  /**
   * Récupère les restaurants actifs pour la découverte.
   * Filtre optionnel par nom ou ville.
   */
  async fetchActiveRestaurants(
    searchQuery?: string
  ): Promise<{ data: Restaurant[] | null; error: Error | null }> {
    try {
      let query = supabase
        .from('restaurants')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true })

      if (searchQuery && searchQuery.trim().length > 0) {
        const q = `%${searchQuery.trim()}%`
        query = query.or(`name.ilike.${q},city.ilike.${q},address.ilike.${q},cuisine_type.ilike.${q}`)
      }

      const { data, error } = await query

      if (error) throw error
      return { data: data as Restaurant[], error: null }
    } catch (err: any) {
      console.error('Erreur lors du chargement des restaurants actifs:', err)
      return { data: null, error: err }
    }
  },

  /**
   * Récupère la fiche publique d'un restaurant par son slug.
   */
  async fetchRestaurantBySlug(
    slug: string
  ): Promise<{ data: Restaurant | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single()

      if (error) throw error
      return { data: data as Restaurant, error: null }
    } catch (err: any) {
      console.error('Erreur lors du chargement du restaurant par slug:', err)
      return { data: null, error: err }
    }
  },

  /**
   * Récupère le menu actuellement publié (le plus récent ou celui d'aujourd'hui) pour un restaurant.
   * Inclut ses menu_items et menu_photos.
   */
  async fetchPublishedMenu(
    restaurantId: string
  ): Promise<{ data: MenuWithDetails | null; error: Error | null }> {
    try {
      const today = new Date().toISOString().split('T')[0]

      // Chercher d'abord le menu du jour publié
      const { data: todayMenu, error: todayError } = await supabase
        .from('menus')
        .select(
          `
          *,
          items:menu_items(*),
          photos:menu_photos(*)
        `
        )
        .eq('restaurant_id', restaurantId)
        .eq('status', 'published')
        .eq('menu_date', today)
        .maybeSingle()

      if (!todayError && todayMenu) {
        // Trier les éléments du menu par display_order
        if (todayMenu.items) {
          todayMenu.items.sort((a: any, b: any) => a.display_order - b.display_order)
        }
        if (todayMenu.photos) {
          todayMenu.photos.sort((a: any, b: any) => a.display_order - b.display_order)
        }
        return { data: todayMenu as unknown as MenuWithDetails, error: null }
      }

      // Sinon, récupérer le dernier menu publié
      const { data: latestMenu, error: latestError } = await supabase
        .from('menus')
        .select(
          `
          *,
          items:menu_items(*),
          photos:menu_photos(*)
        `
        )
        .eq('restaurant_id', restaurantId)
        .eq('status', 'published')
        .order('menu_date', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (latestError) throw latestError

      if (latestMenu) {
        if (latestMenu.items) {
          latestMenu.items.sort((a: any, b: any) => a.display_order - b.display_order)
        }
        if (latestMenu.photos) {
          latestMenu.photos.sort((a: any, b: any) => a.display_order - b.display_order)
        }
      }

      return { data: (latestMenu as unknown as MenuWithDetails) || null, error: null }
    } catch (err: any) {
      console.error('Erreur lors de la récupération du menu publié:', err)
      return { data: null, error: err }
    }
  },

  /**
   * Récupère les horaires d'ouverture d'un restaurant pour l'affichage public.
   */
  async fetchRestaurantHours(
    restaurantId: string
  ): Promise<{ data: RestaurantHours[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('restaurant_hours')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('day_of_week', { ascending: true })

      if (error) throw error
      return { data: data as RestaurantHours[], error: null }
    } catch (err: any) {
      console.error('Erreur lors du chargement des horaires publics:', err)
      return { data: null, error: err }
    }
  },
}
