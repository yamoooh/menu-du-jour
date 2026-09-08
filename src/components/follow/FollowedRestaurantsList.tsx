import React, { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { followerService, type FollowedRestaurantItem } from '@/services/followerService'
import { FollowButton } from '@/components/follow/FollowButton'
import { Heart, Store, MapPin, ChevronRight, RefreshCw } from 'lucide-react'

export const FollowedRestaurantsList: React.FC = () => {
  const [items, setItems] = useState<FollowedRestaurantItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const loadFollowed = useCallback(async () => {
    setLoading(true)
    const { data } = await followerService.fetchFollowedRestaurants()
    setItems(data || [])
    setLoading(false)
  }, [])

  useEffect(() => {
    loadFollowed()
  }, [loadFollowed])

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
      {/* En-tête avec rafraîchissement */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
            Restaurants suivis
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Établissements que vous suivez pour consulter facilement leurs menus
          </p>
        </div>

        <button
          onClick={loadFollowed}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Liste */}
      {loading ? (
        <div className="py-12 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto" />
          <p className="text-xs font-medium text-slate-500">Chargement de vos suivis...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="py-10 text-center space-y-3 p-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 mx-auto flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-slate-800 text-sm">Vous ne suivez encore aucun restaurant</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Découvrez les restaurants de votre région et cliquez sur "Suivre" pour retrouver facilement leurs prochains menus du jour.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map(({ id, restaurant }) => (
            <div
              key={id}
              className="bg-slate-50/60 rounded-2xl border border-slate-200 p-4 flex flex-col justify-between space-y-3 hover:bg-white hover:shadow-xs transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                    <Store className="w-4 h-4 text-orange-600 shrink-0" />
                    {restaurant.name}
                  </h4>
                  {restaurant.city && (
                    <div className="flex items-center gap-1 text-[11px] text-slate-500">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{restaurant.city}</span>
                    </div>
                  )}
                </div>

                <FollowButton
                  restaurantId={restaurant.id}
                  size="sm"
                  onFollowChange={(isFollowing) => {
                    if (!isFollowing) loadFollowed()
                  }}
                />
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-medium">
                  Ajouté à vos suivis
                </span>

                <Link
                  to={`/restaurants/${restaurant.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700 cursor-pointer"
                >
                  <span>Voir le menu</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
