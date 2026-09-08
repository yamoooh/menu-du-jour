import React, { useEffect, useState, useCallback } from 'react'
import { Header } from '@/components/Header'
import { discoveryService } from '@/services/discoveryService'
import type { Restaurant } from '@/types/restaurant.types'
import { RestaurantCard } from '@/components/discovery/RestaurantCard'
import { RestaurantSearch } from '@/components/discovery/RestaurantSearch'
import { Store, Utensils, RefreshCw } from 'lucide-react'

export const ClientDiscoveryPage: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [searchQuery, setSearchQuery] = useState<string>('')

  const loadRestaurants = useCallback(async (query?: string) => {
    setLoading(true)
    const { data } = await discoveryService.fetchActiveRestaurants(query)
    setRestaurants(data || [])
    setLoading(false)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      loadRestaurants(searchQuery)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery, loadRestaurants])

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Banner principal */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-orange-950 rounded-2xl p-6 sm:p-8 text-white shadow-md space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 text-xs font-semibold border border-orange-500/30">
            <Utensils className="w-3.5 h-3.5" />
            Découverte
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Découvrir les restaurants
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed">
            Trouvez les meilleurs établissements près de chez vous, découvrez leurs menus du jour en temps réel et suivez vos favoris.
          </p>

          <div className="pt-2 max-w-lg">
            <RestaurantSearch value={searchQuery} onChange={setSearchQuery} />
          </div>
        </div>

        {/* Liste des résultats */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Store className="w-4 h-4 text-orange-600" />
              {searchQuery ? (
                <>Résultats de la recherche ({restaurants.length})</>
              ) : (
                <>Tous les restaurants disponibles ({restaurants.length})</>
              )}
            </h2>

            <button
              onClick={() => loadRestaurants(searchQuery)}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold shadow-xs hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Actualiser
            </button>
          </div>

          {loading ? (
            <div className="py-16 bg-white rounded-2xl border border-slate-200 text-center space-y-3 shadow-xs">
              <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto" />
              <p className="text-xs font-medium text-slate-500">Chargement des restaurants...</p>
            </div>
          ) : restaurants.length === 0 ? (
            <div className="py-16 bg-white rounded-2xl border border-slate-200 text-center space-y-3 p-6 shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <Store className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-slate-800 text-base">
                {searchQuery
                  ? 'Aucun restaurant ne correspond à votre recherche.'
                  : 'Aucun restaurant disponible pour le moment.'}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {searchQuery
                  ? 'Essayez avec un autre nom d\'établissement ou une autre ville.'
                  : 'Revenez plus tard pour découvrir de nouveaux établissements inscrits sur Menu du Jour.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {restaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
