import React, { useEffect, useState, useCallback } from 'react'
import { Header } from '@/components/Header'
import { useAuth } from '@/context/AuthContext'
import { restaurantService } from '@/services/restaurantService'
import { subscriptionService } from '@/services/subscriptionService'
import { menuService } from '@/services/menuService'
import type {
  Restaurant,
  RestaurantHours,
  Subscription,
  RestaurantStats as StatsType,
} from '@/types/restaurant.types'
import type { MenuWithDetails } from '@/types/menu.types'
import { RestaurantSelector } from '@/components/restaurant/RestaurantSelector'
import { RestaurantFormModal } from '@/components/restaurant/RestaurantFormModal'
import { RestaurantHoursForm } from '@/components/restaurant/RestaurantHoursForm'
import { SubscriptionCard } from '@/components/restaurant/SubscriptionCard'
import { SubscriptionBanner } from '@/components/restaurant/SubscriptionBanner'
import { RestaurantStats } from '@/components/restaurant/RestaurantStats'
import { CurrentMenuCard } from '@/components/menu/CurrentMenuCard'
import { MenuList } from '@/components/menu/MenuList'
import { MenuEditor } from '@/components/menu/MenuEditor'
import { RestaurantReservationsList } from '@/components/reservation/RestaurantReservationsList'
import { NotificationList } from '@/components/notification/NotificationList'
import { PushSubscriptionToggle } from '@/components/notification/PushSubscriptionToggle'
import { SeoHead } from '@/components/public/SeoHead'
import { useLanguage } from '@/context/LanguageContext'
import {
  LayoutDashboard,
  Store,
  Utensils,
  Calendar,
  Bell,
  CreditCard,
  User,
  Clock,
  Edit,
  Plus,
  CheckCircle2,
  X,
  Menu as MenuIcon,
  LogOut,
} from 'lucide-react'

export type SidebarTab =
  | 'dashboard'
  | 'restaurants'
  | 'menus'
  | 'reservations'
  | 'notifications'
  | 'subscription'
  | 'profile'

export const RestaurantDashboardPage: React.FC = () => {
  const { profile, signOut } = useAuth()
  const { t } = useLanguage()

  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const [hours, setHours] = useState<RestaurantHours[] | null>(null)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [stats, setStats] = useState<StatsType | null>(null)

  // Menus
  const [menus, setMenus] = useState<MenuWithDetails[]>([])
  const [isEditingMenu, setIsEditingMenu] = useState(false)
  const [menuToEdit, setMenuToEdit] = useState<MenuWithDetails | null>(null)

  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<SidebarTab>('dashboard')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Modal de création/édition de restaurant
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [restaurantToEdit, setRestaurantToEdit] = useState<Restaurant | null>(null)

  // Notification après redirection LeekPay
  const [paymentNotice, setPaymentNotice] = useState<{
    type: 'pending' | 'confirmed'
    title: string
    message: string
  } | null>(null)

  // Vérification de la redirection LeekPay dans l'URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const paymentParam = params.get('payment')

    if (paymentParam === 'pending') {
      setPaymentNotice({
        type: 'pending',
        title: 'Paiement en attente de confirmation',
        message: t.subscription.paymentReceivedPending,
      })
    } else if (paymentParam === 'success' || paymentParam === 'confirmed') {
      setPaymentNotice({
        type: 'confirmed',
        title: 'Paiement confirmé',
        message: t.subscription.paymentConfirmedActive,
      })
    }
  }, [t])

  // Charger tous les restaurants de l'utilisateur
  const loadMyRestaurants = useCallback(async () => {
    setLoading(true)
    const { data } = await restaurantService.fetchMyRestaurants()
    if (data && data.length > 0) {
      setRestaurants(data)
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
    const [hoursRes, subRes, statsRes, menusRes] = await Promise.all([
      restaurantService.fetchRestaurantHours(restaurantId),
      subscriptionService.fetchSubscription(restaurantId),
      restaurantService.fetchRestaurantStats(restaurantId),
      menuService.fetchMenusByRestaurant(restaurantId),
    ])

    setHours(hoursRes.data)
    setSubscription(subRes.data)
    setStats(statsRes.data)
    setMenus(menusRes.data || [])
  }, [])

  useEffect(() => {
    if (selectedRestaurant?.id) {
      loadRestaurantData(selectedRestaurant.id)
      setIsEditingMenu(false)
      setMenuToEdit(null)
    } else {
      setHours(null)
      setSubscription(null)
      setStats(null)
      setMenus([])
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

  // Handlers édition de menu
  const handleCreateNewMenu = () => {
    setMenuToEdit(null)
    setIsEditingMenu(true)
    setActiveTab('menus')
  }

  const handleEditMenu = (menu: MenuWithDetails) => {
    setMenuToEdit(menu)
    setIsEditingMenu(true)
    setActiveTab('menus')
  }

  const handleMenuSaved = (_updatedMenuId: string) => {
    if (selectedRestaurant?.id) {
      loadRestaurantData(selectedRestaurant.id)
    }
  }

  const sidebarItems = [
    { id: 'dashboard' as SidebarTab, label: t.restaurantNav.dashboard, icon: LayoutDashboard },
    { id: 'restaurants' as SidebarTab, label: t.restaurantNav.restaurants, icon: Store },
    { id: 'menus' as SidebarTab, label: t.restaurantNav.menus, icon: Utensils },
    { id: 'reservations' as SidebarTab, label: t.restaurantNav.reservations, icon: Calendar },
    { id: 'notifications' as SidebarTab, label: t.restaurantNav.notifications, icon: Bell },
    { id: 'subscription' as SidebarTab, label: t.restaurantNav.subscription, icon: CreditCard },
    { id: 'profile' as SidebarTab, label: t.restaurantNav.profile, icon: User },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <SeoHead
        title={`${t.restaurant.title} — Menu du Jour`}
        description="Espace professionnel pour les gestionnaires de restaurants."
        path="/espace-restaurant"
        noindex={true}
      />
      <Header />

      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col md:flex-row">
        {/* Sidebar Desktop */}
        <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 p-4 space-y-6 shrink-0 min-h-[calc(100vh-4rem)]">
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 py-1">
              Navigation Gestion
            </h3>
            <nav className="space-y-1">
              {sidebarItems.map((item) => {
                const Icon = item.icon
                const isActive = activeTab === item.id

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id)
                      if (item.id === 'menus') setIsEditingMenu(false)
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-orange-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {selectedRestaurant && (
            <div className="mt-auto p-4 rounded-xl bg-orange-50/80 border border-orange-100 space-y-2 text-xs">
              <span className="text-orange-800 font-bold block truncate">{selectedRestaurant.name}</span>
              <span className="text-orange-600 block text-[11px]">
                {subscription?.status === 'trialing'
                  ? 'Essai gratuit'
                  : subscription?.status === 'active'
                  ? 'Abonnement actif'
                  : 'Abonnement expiré'}
              </span>
            </div>
          )}
        </aside>

        {/* Topbar mobile navigation toggle */}
        <div className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-orange-600" />
            <span className="font-bold text-sm text-slate-900">
              {selectedRestaurant?.name || 'Espace Restaurant'}
            </span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Drawer Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 p-4 space-y-1 animate-fadeIn">
            {sidebarItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id)
                    setMobileMenuOpen(false)
                    if (item.id === 'menus') setIsEditingMenu(false)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                    isActive ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-orange-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>
        )}

        {/* Contenu principal */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl">
          {/* Banner notification paiement LeekPay */}
          {paymentNotice && (
            <div
              className={`p-4 sm:p-5 rounded-2xl border flex items-start justify-between gap-3 shadow-md animate-fadeIn ${
                paymentNotice.type === 'confirmed'
                  ? 'bg-emerald-900 text-white border-emerald-700'
                  : 'bg-amber-900 text-white border-amber-700'
              }`}
            >
              <div className="flex items-start gap-3">
                {paymentNotice.type === 'confirmed' ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <Clock className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="font-extrabold text-sm sm:text-base">{paymentNotice.title}</h4>
                  <p className="text-xs sm:text-sm text-slate-200 mt-0.5">{paymentNotice.message}</p>
                </div>
              </div>
              <button
                onClick={() => setPaymentNotice(null)}
                className="p-1 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Écran de chargement principal */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin" />
              <p className="text-sm font-medium text-slate-600">Chargement de votre espace restaurant...</p>
            </div>
          ) : restaurants.length === 0 ? (
            /* Écran si 0 restaurant */
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
            <>
              {/* Sélecteur de restaurant */}
              <RestaurantSelector
                restaurants={restaurants}
                selectedRestaurant={selectedRestaurant}
                onSelect={(r) => setSelectedRestaurant(r)}
                onOpenCreateModal={handleOpenCreateModal}
              />

              {/* Banner de l'abonnement si expirant ou expiré */}
              {selectedRestaurant && (
                <SubscriptionBanner
                  subscription={subscription}
                  restaurantId={selectedRestaurant.id}
                  onRenewClick={() => setActiveTab('subscription')}
                />
              )}

              {/* 1. Tableau de Bord (Overview) */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-orange-950 rounded-2xl p-6 sm:p-8 text-white shadow-md space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 text-[11px] font-semibold border border-orange-500/30">
                        Tableau de Bord
                      </span>
                    </div>
                    <h2 className="text-2xl font-extrabold tracking-tight">
                      Bonjour, {profile?.full_name || 'Restaurateur'} !
                    </h2>
                    <p className="text-slate-300 text-xs sm:text-sm">
                      Établissement actif : <strong className="text-orange-400">{selectedRestaurant?.name}</strong>
                    </p>
                  </div>

                  <RestaurantStats stats={stats} subscription={subscription} />

                  <CurrentMenuCard
                    menus={menus}
                    subscription={subscription}
                    restaurantId={selectedRestaurant?.id}
                    onCreateNewMenu={handleCreateNewMenu}
                    onEditMenu={handleEditMenu}
                  />

                  <SubscriptionCard
                    subscription={subscription}
                    restaurantId={selectedRestaurant?.id}
                    onRefresh={() => selectedRestaurant && loadRestaurantData(selectedRestaurant.id)}
                  />
                </div>
              )}

              {/* 2. Mes Restaurants */}
              {activeTab === 'restaurants' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      <div>
                        <h3 className="font-bold text-slate-900 text-base">Fiche de votre restaurant</h3>
                        <p className="text-xs text-slate-500">
                          Coordonnées, adresses et identifiant public
                        </p>
                      </div>
                      <button
                        onClick={handleOpenEditModal}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        Modifier la fiche
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
                        <span className="text-slate-400 font-medium block">Lien public (Slug)</span>
                        <code className="text-orange-700 font-mono font-semibold block">
                          /restaurants/{selectedRestaurant?.slug}
                        </code>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                        <span className="text-slate-400 font-medium block">Téléphone</span>
                        <span className="text-slate-900 font-semibold block">
                          {selectedRestaurant?.phone || 'Non renseigné'}
                        </span>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                        <span className="text-slate-400 font-medium block">Ville & Pays</span>
                        <span className="text-slate-900 font-semibold block">
                          {selectedRestaurant?.city ? `${selectedRestaurant.city}, ` : ''}
                          {selectedRestaurant?.country}
                        </span>
                      </div>
                    </div>
                  </div>

                  {selectedRestaurant && (
                    <RestaurantHoursForm
                      restaurantId={selectedRestaurant.id}
                      existingHours={hours}
                      onSaved={() => loadRestaurantData(selectedRestaurant.id)}
                    />
                  )}
                </div>
              )}

              {/* 3. Mes Menus */}
              {activeTab === 'menus' && selectedRestaurant && (
                isEditingMenu ? (
                  <MenuEditor
                    restaurantId={selectedRestaurant.id}
                    subscription={subscription}
                    menuToEdit={menuToEdit}
                    onBack={() => setIsEditingMenu(false)}
                    onSaved={handleMenuSaved}
                  />
                ) : (
                  <MenuList
                    menus={menus}
                    subscription={subscription}
                    restaurantId={selectedRestaurant.id}
                    onSelectMenuToEdit={handleEditMenu}
                    onCreateNewMenu={handleCreateNewMenu}
                    onRefresh={() => selectedRestaurant && loadRestaurantData(selectedRestaurant.id)}
                  />
                )
              )}

              {/* 4. Réservations */}
              {activeTab === 'reservations' && selectedRestaurant && (
                <RestaurantReservationsList
                  restaurantId={selectedRestaurant.id}
                  restaurantName={selectedRestaurant.name}
                />
              )}

              {/* 5. Notifications */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <NotificationList />
                  <PushSubscriptionToggle />
                </div>
              )}

              {/* 6. Abonnement */}
              {activeTab === 'subscription' && (
                <SubscriptionCard
                  subscription={subscription}
                  restaurantId={selectedRestaurant?.id}
                  onRefresh={() => selectedRestaurant && loadRestaurantData(selectedRestaurant.id)}
                />
              )}

              {/* 7. Profil */}
              {activeTab === 'profile' && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
                  <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                    Profil du gestionnaire
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
                      <span className="text-slate-400 block font-medium">Rôle</span>
                      <span className="text-orange-700 font-semibold text-sm mt-0.5 block">
                        Gestionnaire de restaurant
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <button
                      onClick={() => signOut()}
                      className="px-4 py-2.5 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 font-semibold text-xs inline-flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Se déconnecter
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Modal de création / édition de restaurant */}
          <RestaurantFormModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSuccess={handleModalSuccess}
            restaurantToEdit={restaurantToEdit}
          />
        </main>
      </div>
    </div>
  )
}

