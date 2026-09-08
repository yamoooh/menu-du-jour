import React from 'react'
import { Link } from 'react-router-dom'
import type { Restaurant } from '@/types/restaurant.types'
import { FollowButton } from '@/components/follow/FollowButton'
import { Store, MapPin, Phone, Utensils, ChevronRight } from 'lucide-react'

interface RestaurantCardProps {
  restaurant: Restaurant
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group">
      <div className="space-y-3">
        {/* En-tête avec nom et badge ville */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <h3 className="font-extrabold text-slate-900 text-base group-hover:text-orange-600 transition-colors flex items-center gap-2">
              <Store className="w-4 h-4 text-orange-600 shrink-0" />
              {restaurant.name}
            </h3>
            {restaurant.cuisine_type && (
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 font-semibold text-[11px] border border-orange-200/60">
                {restaurant.cuisine_type}
              </span>
            )}
          </div>

          <FollowButton restaurantId={restaurant.id} size="sm" />
        </div>

        {/* Coordonnées & Localisation */}
        <div className="space-y-1.5 text-xs text-slate-600">
          {(restaurant.address || restaurant.city) && (
            <div className="flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span className="font-medium">
                {restaurant.address ? `${restaurant.address}, ` : ''}
                {restaurant.city ? <strong>{restaurant.city}</strong> : restaurant.country}
              </span>
            </div>
          )}

          {restaurant.phone && (
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="font-medium">{restaurant.phone}</span>
            </div>
          )}

          {restaurant.description && (
            <p className="text-slate-500 text-[11px] line-clamp-2 pt-1">
              {restaurant.description}
            </p>
          )}
        </div>
      </div>

      {/* Pied de carte avec action */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
          <Utensils className="w-3 h-3 text-slate-400" />
          Menu du Jour disponible
        </span>

        <Link
          to={`/restaurants/${restaurant.slug}`}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-900 text-slate-700 hover:text-white font-bold text-xs transition-colors cursor-pointer"
        >
          <span>Consulter</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  )
}
