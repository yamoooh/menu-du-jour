import React from 'react'
import type { Restaurant } from '@/types/restaurant.types'
import { Store, Plus, ChevronDown } from 'lucide-react'

interface RestaurantSelectorProps {
  restaurants: Restaurant[]
  selectedRestaurant: Restaurant | null
  onSelect: (restaurant: Restaurant) => void
  onOpenCreateModal: () => void
}

export const RestaurantSelector: React.FC<RestaurantSelectorProps> = ({
  restaurants,
  selectedRestaurant,
  onSelect,
  onOpenCreateModal,
}) => {
  if (restaurants.length === 0) return null

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold shrink-0">
          <Store className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <span className="text-xs text-slate-500 font-medium block">
            Restaurant actuellement géré :
          </span>
          {restaurants.length === 1 ? (
            <span className="text-base font-bold text-slate-900 block">
              {selectedRestaurant?.name}
            </span>
          ) : (
            <div className="relative inline-block mt-0.5">
              <select
                value={selectedRestaurant?.id || ''}
                onChange={(e) => {
                  const target = restaurants.find((r) => r.id === e.target.value)
                  if (target) onSelect(target)
                }}
                className="appearance-none bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-8 py-1 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 cursor-pointer"
              >
                {restaurants.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.city || 'Sans ville'})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          )}
        </div>
      </div>

      <button
        onClick={onOpenCreateModal}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200 transition-colors w-full sm:w-auto justify-center cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        Ajouter un restaurant
      </button>
    </div>
  )
}
