import React, { useEffect, useState, useCallback } from 'react'
import { Header } from '@/components/Header'
import { useAuth } from '@/context/AuthContext'
import { restaurantService } from '@/services/restaurantService'
import type {
  Restaurant,
  RestaurantHours,
  Subscription,
  RestaurantStats as StatsType,
} from '@/types/restaurant.types'
import { RestaurantSelector } from '@/components/restaurant/RestaurantSelector'
import { RestaurantFormModal } from '@/components/restaurant/RestaurantFormModal'
import { RestaurantHoursForm } from '@/components/restaurant/RestaurantHoursForm'
import { SubscriptionCard } from '@/components/restaurant/SubscriptionCard'
import { RestaurantStats } from '@/components/restaurant/RestaurantStats'
import { RestaurantNav, type TabType } from '@/components/restaurant/RestaurantNav'
import {
  Store,
  MapPin,
  Phone,
  Utensils,
  Edit,
  AlertTriangle,
  Sparkles,
  Plus,
} from 'lucide-react'

export const RestaurantDashboardPage: React.FC = () => {
  const { profile } = useAuth()

  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const [hours, setHours] = useState<RestaurantHours[] | null>(null)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [stats, setStats] = useState<StatsType | null>(null)

  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')

  // Modal de création/édition
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [restaurantToEdit, setRestaurantToEdit] = useState<Restaurant | null>(null)

  // Charger tous les restaurants de l'utilisateur
  const loadMyRestaurants = useCallback(async () => {
    setLoading(true)
    const { data } = await restaurantService.fetchMyRestaurants()
    if (data && data.length > 0) {
      setRestaurants(data)
      // Garder le même sélectionné s'il existe toujours, sinon prendre le premier
      setSelectedRestaurant((prev) => {
        if (prev) {
          const match = data.find((r) => r.id === prev.id)
          if (match) return match
        }
        return data[0]
      })
    } else {
      setRestaurants([])
      setSelectedRestaurant(null)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    loadMyRestaurants()
  }, [loadMyRestaurants])

  // Recharger les données relatives au restaurant sélectionné
  const loadRestaurantData = useCallback(async (restaurantId: string) => {
    const [hoursRes, subRes, statsRes] = await Promise.all([
      restaurantService.fetchRestaurantHours(restaurantId),
      restaurantService.fetchSubscription(restaurantId),
      restaurantService.fetchRestaurantStats(restaurantId),
    ])

    setHours(hoursRes.data)
    setSubscription(subRes.data)
    setStats(statsRes.data)
  }, [])

  useEffect(() => {
    if (selectedRestaurant?.id) {
      loadRestaurantData(selectedRestaurant.id)
    } else {
      setHours(null)
      setSubscription(null)
      setStats(null)
    }
  }, [selectedRestaurant?.id, loadRestaurantData])

  const handleOpenCreateModal = () => {
    setRestaurantToEdit(null)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = () => {
    setRestaurantToEdit(selectedRestaurant)
    setIsModalOpen(true)
  }

  const handleModalSuccess = (restaurant: Restaurant) => {
    loadMyRestaurants()
    setSelectedRestaurant(restaurant)
  }

  // Vérifier si l'abonnement est expiré
  const isSubscriptionExpired =
    subscription?.status === 'expired' ||
    (subscription?.status === 'trialing' &&
      subscription.trial_end_at &&
      new Date(subscription.trial_end_at).getTime() < Date.now())

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Écran de chargement principal */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin" />
            <p className="text-sm font-medium text-slate-600">Chargement de votre espace restaurant...</p>
          </div>
        ) : restaurants.length === 0 ? (
          /* Écran d'accueil si 0 restaurant */
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center max-w-xl mx-auto space-y-6 my-10">
            <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 mx-auto flex items-center justify-center font-bold">
              <Store className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Bienvenue sur Menu du Jour !
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Vous n'avez pas encore créé de restaurant. Créez la fiche de votre établissement dès maintenant pour bénéficier immédiatement de <strong>7 jours d'essai gratuit</strong>.
              </p>
            </div>

            <button
              onClick={handleOpenCreateModal}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-bold text-sm shadow-md shadow-orange-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              Créer mon premier restaurant
            </button>
          </div>
        ) : (
          /* Dashboard principal avec restaurant(s) */
          <>
            {/* Sélecteur si plusieurs restaurants */}
            <RestaurantSelector
              restaurants={restaurants}
              selectedRestaurant={selectedRestaurant}
              onSelect={(r) => setSelectedRestaurant(r)}
              onOpenCreateModal={handleOpenCreateModal}
            />

            {/* Banner de bienvenue & informations */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-orange-950 rounded-2xl p-6 sm:p-8 text-white shadow-md space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 text-[11px] font-semibold border border-orange-500/30">
                      Espace Gestionnaire
                    </span>
                    {selectedRestaurant?.city && (
                      <span className="text-xs text-slate-400 font-medium">
                        • {selectedRestaurant.city}
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    Bonjour, {profile?.full_name || 'Restaurateur'} 👋
                  </h2>
                  <p className="text-slate-300 text-xs sm:text-sm mt-1">
                    Gestion de : <strong className="text-orange-400">{selectedRestaurant?.name}</strong>
                  </p>
                </div>

                <button
                  onClick={handleOpenEditModal}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md border border-white/20 transition-colors cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" />
                  Modifier la fiche
                </button>
              </div>
            </div>

            {/* Alerte si abonnement expiré */}
            {isSubscriptionExpired && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-3 shadow-xs">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-red-900">Abonnement professionnel expiré</h4>
                  <p>
                    L'accès professionnel pour <strong>{selectedRestaurant?.name}</strong> a expiré. Vos menus, réservations et données restent entièrement conservés. Renouvelez votre abonnement pour continuer à publier et recevoir des réservations.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation par onglets */}
            <RestaurantNav activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab)} />

            {/* Onglet 1 : Tableau de bord (Dashboard) */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <RestaurantStats stats={stats} subscription={subscription} />
                <SubscriptionCard subscription={subscription} />

                {/* Résumé de l'établissement */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <Store className="w-4 h-4 text-orange-600" />
                      Fiche synthétique de l'établissement
                    </h3>
                    <button
                      onClick={() => setActiveTab('details')}
                      className="text-xs text-orange-600 hover:text-orange-700 font-semibold"
                    >
                      Voir détails complets →
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                      <span className="text-slate-400 font-medium block flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" /> Adresse
                      </span>
                      <span className="text-slate-900 font-semibold block">
                        {selectedRestaurant?.address || 'Non renseignée'}
                      </span>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                      <span className="text-slate-400 font-medium block flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-slate-500" /> Téléphone
                      </span>
                      <span className="text-slate-900 font-semibold block">
                        {selectedRestaurant?.phone || 'Non renseigné'}
                      </span>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                      <span className="text-slate-400 font-medium block flex items-center gap-1">
                        <Utensils className="w-3.5 h-3.5 text-slate-500" /> Spécialité
                      </span>
                      <span className="text-slate-900 font-semibold block">
                        {selectedRestaurant?.cuisine_type || 'Non spécifiée'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Onglet 2 : Mon restaurant (Détails) */}
            {activeTab === 'details' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Informations du restaurant</h3>
                    <p className="text-xs text-slate-500">
                      Coordonnées, adresses et capacité de votre établissement
                    </p>
                  </div>
                  <button
                    onClick={handleOpenEditModal}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    Modifier
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <span className="text-slate-400 font-medium block">Nom de l'établissement</span>
                    <span className="text-slate-900 font-bold text-sm block">
                      {selectedRestaurant?.name}
                    </span>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <span className="text-slate-400 font-medium block">Identifiant unique (Slug URL)</span>
                    <code className="text-orange-700 font-mono font-semibold block">
                      {selectedRestaurant?.slug}
                    </code>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <span className="text-slate-400 font-medium block">Téléphone</span>
                    <span className="text-slate-900 font-semibold block">
                      {selectedRestaurant?.phone || 'Non renseigné'}
                    </span>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <span className="text-slate-400 font-medium block">Email professionnel</span>
                    <span className="text-slate-900 font-semibold block">
                      {selectedRestaurant?.email || 'Non renseigné'}
                    </span>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <span className="text-slate-400 font-medium block">Ville & Pays</span>
                    <span className="text-slate-900 font-semibold block">
                      {selectedRestaurant?.city ? `${selectedRestaurant.city}, ` : ''}
                      {selectedRestaurant?.country}
                    </span>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <span className="text-slate-400 font-medium block">Adresse géographique</span>
                    <span className="text-slate-900 font-semibold block">
                      {selectedRestaurant?.address || 'Non renseignée'}
                    </span>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <span className="text-slate-400 font-medium block">Capacité maximale</span>
                    <span className="text-slate-900 font-semibold block">
                      {selectedRestaurant?.capacity} couverts
                    </span>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <span className="text-slate-400 font-medium block">Spécialité culinaire</span>
                    <span className="text-slate-900 font-semibold block">
                      {selectedRestaurant?.cuisine_type || 'Non spécifiée'}
                    </span>
                  </div>
                </div>

                {selectedRestaurant?.description && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1 text-xs">
                    <span className="text-slate-400 font-medium block">Description</span>
                    <p className="text-slate-700 leading-relaxed">
                      {selectedRestaurant.description}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Onglet 3 : Horaires */}
            {activeTab === 'hours' && selectedRestaurant && (
              <RestaurantHoursForm
                restaurantId={selectedRestaurant.id}
                existingHours={hours}
                onSaved={() => loadRestaurantData(selectedRestaurant.id)}
              />
            )}

            {/* Onglet 4 : Abonnement */}
            {activeTab === 'subscription' && <SubscriptionCard subscription={subscription} />}

            {/* Onglets Bientôt Disponibles (Menus, Réservations, Followers) */}
            {['menus', 'reservations', 'followers'].includes(activeTab) && (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3 shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 mx-auto flex items-center justify-center font-bold">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg">Fonctionnalité en cours de préparation</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  La gestion complète des menus du jour, des réservations et des abonnés au restaurant sera disponible lors de la prochaine étape.
                </p>
              </div>
            )}
          </>
        )}

        {/* Modal de création / édition */}
        <RestaurantFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleModalSuccess}
          restaurantToEdit={restaurantToEdit}
        />
      </main>
    </div>
  )
}
