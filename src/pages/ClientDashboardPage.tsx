import React, { useEffect, useState } from 'react'
import { Header } from '@/components/Header'
import { useAuth } from '@/context/AuthContext'
import { restaurantService } from '@/services/restaurantService'
import { discoveryService } from '@/services/discoveryService'
import type { Restaurant } from '@/types/restaurant.types'
import { ClientReservationsList } from '@/components/reservation/ClientReservationsList'
import { FollowedRestaurantsList } from '@/components/follow/FollowedRestaurantsList'
import { RestaurantCard } from '@/components/discovery/RestaurantCard'
import { RestaurantSearch } from '@/components/discovery/RestaurantSearch'
import { ReservationModal } from '@/components/reservation/ReservationModal'
import { NotificationList } from '@/components/notification/NotificationList'
import { PushSubscriptionToggle } from '@/components/notification/PushSubscriptionToggle'
import {
  UserCheck,
  Heart,
  Calendar,
  Utensils,
  UtensilsCrossed,
  Store,
  RefreshCw,
  Bell,
} from 'lucide-react'

type ClientTab = 'discover' | 'followed' | 'reservations' | 'notifications' | 'profile'

export const ClientDashboardPage: React.FC = () => {
  const { profile } = useAuth()
  const [activeTab, setActiveTab] = useState<ClientTab>('discover')
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loadingRestaurants, setLoadingRestaurants] = useState<boolean>(true)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  // Charger tous les restaurants actifs
  const loadActiveRestaurants = async (query?: string) => {
    setLoadingRestaurants(true)
    const { data } = await discoveryService.fetchActiveRestaurants(query)
    setRestaurants(data || [])
    setLoadingRestaurants(false)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      loadActiveRestaurants(searchQuery)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    restaurantService.fetchActiveRestaurants().then((res) => {
      if (res.data) setRestaurants(res.data)
    })
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Banner de bienvenue */}
        <div className="bg-gradient-to-r from-orange-600 to-amber-500 rounded-2xl p-6 sm:p-8 text-white shadow-lg shadow-orange-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-md">
                Espace Client
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Bienvenue, {profile?.full_name || 'Cher client'} !
            </h2>
            <p className="text-orange-100 text-sm mt-1 max-w-xl">
              Découvrez les menus du jour des restaurants de votre région, gérez vos réservations et suivez vos établissements favoris.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-orange-600 hover:bg-orange-50 font-bold text-xs shadow-md transition-all cursor-pointer shrink-0"
          >
            <UtensilsCrossed className="w-4 h-4" />
            Réserver une table
          </button>
        </div>

        {/* Navigation par onglets client */}
        <div className="bg-white rounded-2xl border border-slate-200 p-1.5 shadow-xs overflow-x-auto">
          <nav className="flex items-center gap-1 min-w-max">
            <button
              onClick={() => setActiveTab('discover')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'discover'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Utensils className={`w-4 h-4 ${activeTab === 'discover' ? 'text-orange-400' : 'text-slate-400'}`} />
              <span>Découvrir</span>
            </button>

            <button
              onClick={() => setActiveTab('followed')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'followed'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Heart className={`w-4 h-4 ${activeTab === 'followed' ? 'text-red-400' : 'text-slate-400'}`} />
              <span>Restaurants suivis</span>
            </button>

            <button
              onClick={() => setActiveTab('reservations')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'reservations'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Calendar className={`w-4 h-4 ${activeTab === 'reservations' ? 'text-amber-400' : 'text-slate-400'}`} />
              <span>Mes réservations</span>
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'notifications'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Bell className={`w-4 h-4 ${activeTab === 'notifications' ? 'text-orange-400' : 'text-slate-400'}`} />
              <span>Notifications</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <UserCheck className={`w-4 h-4 ${activeTab === 'profile' ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span>Mon profil</span>
            </button>
          </nav>
        </div>

        {/* Contenu selon l'onglet actif */}

        {/* Onglet 1 : Découvrir */}
        {activeTab === 'discover' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                    <Store className="w-5 h-5 text-orange-600" />
                    Découvrir les restaurants
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Parcourez les établissements disponibles et leurs menus du jour
                  </p>
                </div>

                <button
                  onClick={() => loadActiveRestaurants(searchQuery)}
                  disabled={loadingRestaurants}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingRestaurants ? 'animate-spin' : ''}`} />
                  Actualiser
                </button>
              </div>

              <RestaurantSearch value={searchQuery} onChange={setSearchQuery} />
            </div>

            {loadingRestaurants ? (
              <div className="py-12 bg-white rounded-2xl border border-slate-200 text-center space-y-3 shadow-xs">
                <div className="w-8 h-8 border-3 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto" />
                <p className="text-xs font-medium text-slate-500">Chargement des restaurants...</p>
              </div>
            ) : restaurants.length === 0 ? (
              <div className="py-12 bg-white rounded-2xl border border-slate-200 text-center space-y-3 p-6 shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                  <Store className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-800 text-sm">
                  {searchQuery
                    ? 'Aucun restaurant ne correspond à votre recherche.'
                    : 'Aucun restaurant disponible pour le moment.'}
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {searchQuery
                    ? 'Essayez avec un autre nom d\'établissement ou une autre ville.'
                    : 'Revenez plus tard pour découvrir de nouveaux établissements.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {restaurants.map((r) => (
                  <RestaurantCard key={r.id} restaurant={r} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Onglet 2 : Restaurants suivis */}
        {activeTab === 'followed' && <FollowedRestaurantsList />}

        {/* Onglet 3 : Mes réservations */}
        {activeTab === 'reservations' && (
          <ClientReservationsList onOpenReservationModal={() => setIsModalOpen(true)} />
        )}

        {/* Onglet 4 : Notifications */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <NotificationList />
            <PushSubscriptionToggle />
          </div>
        )}

        {/* Onglet 4 : Profil */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <UserCheck className="w-4 h-4 text-orange-600" />
              Vos informations de profil
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block font-medium">Nom complet</span>
                <span className="text-slate-900 font-semibold text-sm mt-0.5 block">
                  {profile?.full_name || 'Non renseigné'}
                </span>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block font-medium">Téléphone</span>
                <span className="text-slate-900 font-semibold text-sm mt-0.5 block">
                  {profile?.phone || 'Non renseigné'}
                </span>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block font-medium">Rôle d'accès</span>
                <span className="text-emerald-700 font-semibold text-sm mt-0.5 block">
                  Client
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Modal de réservation */}
        <ReservationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          restaurants={restaurants}
        />
      </main>
    </div>
  )
}
