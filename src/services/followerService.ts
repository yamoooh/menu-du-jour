import { supabase } from '@/lib/supabase'
import type { Restaurant } from '@/types/restaurant.types'

export interface FollowedRestaurantItem {
  id: string // id de la ligne restaurant_followers
  created_at: string
  restaurant: Restaurant
}

export const followerService = {
  /**
   * Vérifie si l'utilisateur connecté suit un restaurant donné.
   */
  async isFollowing(restaurantId: string): Promise<boolean> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return false

      const { data, error } = await supabase
        .from('restaurant_followers')
        .select('id')
        .eq('restaurant_id', restaurantId)
        .eq('client_id', user.id)
        .maybeSingle()

      if (error) return false
      return !!data
    } catch {
      return false
    }
  },

  /**
   * Permet au client connecté de suivre un restaurant (gratuit).
   */
  async followRestaurant(
    restaurantId: string
  ): Promise<{ success: boolean; error: Error | null }> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error('Vous devez être connecté pour suivre un restaurant.')
      }

      // Vérification préalable pour éviter les doublons
      const alreadyFollowing = await this.isFollowing(restaurantId)
      if (alreadyFollowing) {
        return { success: true, error: null }
      }

      const { error } = await supabase.from('restaurant_followers').insert({
        restaurant_id: restaurantId,
        client_id: user.id,
      })

      if (error) throw error
      return { success: true, error: null }
    } catch (err: any) {
      console.error('Erreur lors du suivi du restaurant:', err)
      return { success: false, error: err }
    }
  },

  /**
   * Permet au client connecté de ne plus suivre un restaurant.
   */
  async unfollowRestaurant(
    restaurantId: string
  ): Promise<{ success: boolean; error: Error | null }> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error('Vous devez être connecté.')
      }

      const { error } = await supabase
        .from('restaurant_followers')
        .delete()
        .eq('restaurant_id', restaurantId)
        .eq('client_id', user.id)

      if (error) throw error
      return { success: true, error: null }
    } catch (err: any) {
      console.error('Erreur lors de la suppression du suivi:', err)
      return { success: false, error: err }
    }
  },

  /**
   * Récupère la liste des restaurants suivis par le client connecté.
   */
  async fetchFollowedRestaurants(): Promise<{
    data: FollowedRestaurantItem[] | null
    error: Error | null
  }> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        return { data: [], error: null }
      }

      const { data, error } = await supabase
        .from('restaurant_followers')
        .select(
          `
          id,
          created_at,
          restaurant:restaurants (*)
        `
        )
        .eq('client_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Filtrer au cas où le restaurant est désactivé
      const result: FollowedRestaurantItem[] = []
      if (data) {
        data.forEach((item: any) => {
          if (item.restaurant && item.restaurant.is_active) {
            result.push({
              id: item.id,
              created_at: item.created_at,
              restaurant: item.restaurant as Restaurant,
            })
          }
        })
      }

      return { data: result, error: null }
    } catch (err: any) {
      console.error('Erreur lors de la récupération des restaurants suivis:', err)
      return { data: null, error: err }
    }
  },
}
