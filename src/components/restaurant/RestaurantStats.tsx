import React from 'react'
import type { RestaurantStats as StatsType, Subscription } from '@/types/restaurant.types'
import { Utensils, CalendarCheck, Users, CreditCard } from 'lucide-react'

interface RestaurantStatsProps {
  stats: StatsType | null
  subscription: Subscription | null
  loading?: boolean
}

export const RestaurantStats: React.FC<RestaurantStatsProps> = ({
  stats,
  subscription,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs animate-pulse">
            <div className="h-4 bg-slate-200 rounded-md w-1/2 mb-3" />
            <div className="h-8 bg-slate-100 rounded-md w-1/3" />
          </div>
        ))}
      </div>
    )
  }

  const subscriptionStatusLabel = () => {
    if (!subscription) return 'Non disponible'
    if (subscription.status === 'trialing') return 'Essai gratuit'
    if (subscription.status === 'active') return 'Actif (Payé)'
    if (subscription.status === 'expired') return 'Expiré'
    return 'Suspendu'
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Carte 1 : Menus */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
        <div className="flex items-center justify-between text-slate-500">
          <span className="text-xs font-semibold uppercase tracking-wider">Menus publiés</span>
          <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
            <Utensils className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-slate-900">
          {stats ? stats.publishedMenusCount : 0}
        </div>
        <p className="text-xs text-slate-400">Menus visibles par les clients</p>
      </div>

      {/* Carte 2 : Réservations */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
        <div className="flex items-center justify-between text-slate-500">
          <span className="text-xs font-semibold uppercase tracking-wider">Réservations</span>
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
            <CalendarCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-slate-900">
          {stats ? stats.reservationsCount : 0}
        </div>
        <p className="text-xs text-slate-400">Demandes de réservation en cours</p>
      </div>

      {/* Carte 3 : Personnes qui suivent (Suivi client gratuit) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
        <div className="flex items-center justify-between text-slate-500">
          <span className="text-xs font-semibold uppercase tracking-wider">Abonnés au resto</span>
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-slate-900">
          {stats ? stats.followersCount : 0}
        </div>
        <p className="text-xs text-slate-400">Personnes qui suivent votre restaurant</p>
      </div>

      {/* Carte 4 : État abonnement */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
        <div className="flex items-center justify-between text-slate-500">
          <span className="text-xs font-semibold uppercase tracking-wider">Statut Abonnement</span>
          <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
            <CreditCard className="w-4 h-4" />
          </div>
        </div>
        <div className="text-lg font-bold text-slate-900 truncate">
          {subscriptionStatusLabel()}
        </div>
        <p className="text-xs text-slate-400">Accès aux fonctionnalités pro</p>
      </div>
    </div>
  )
}
