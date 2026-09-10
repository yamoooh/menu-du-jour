import React, { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import { restaurantService } from '@/services/restaurantService'
import { subscriptionService } from '@/services/subscriptionService'
import { menuService } from '@/services/menuService'
import { reservationService } from '@/services/reservationService'
import type {
  Restaurant,
  RestaurantHours,
  Subscription,
  RestaurantStats as StatsType,
} from '@/types/restaurant.types'
import type { MenuWithDetails } from '@/types/menu.types'
import type { ReservationWithDetails } from '@/types/reservation.types'
import { RestaurantFormModal } from '@/components/restaurant/RestaurantFormModal'
import { SubscriptionCard } from '@/components/restaurant/SubscriptionCard'
import { MenuList } from '@/components/menu/MenuList'
import { MenuEditor } from '@/components/menu/MenuEditor'
import { RestaurantReservationsList } from '@/components/reservation/RestaurantReservationsList'
import { NotificationList } from '@/components/notification/NotificationList'
import { PushSubscriptionToggle } from '@/components/notification/PushSubscriptionToggle'
import { RestaurantProfileSettings } from '@/components/restaurant/RestaurantProfileSettings'
import { PwaInstallPromptModal } from '@/components/notification/PwaInstallPromptModal'
import { SeoHead } from '@/components/public/SeoHead'
import {
  LayoutDashboard,
  Store,
  Utensils,
  Calendar,
  MapPin,
  Receipt,
  Bell,
  Settings,
  Plus,
  X,
  Menu as MenuIcon,
  LogOut,
  ShieldCheck,
  Check,
  Zap,
  Clock,
  Eye,
  QrCode,
  FileText,
  ChevronRight,
  TrendingUp,
  User,
} from 'lucide-react'

export type SidebarTab =
  | 'dashboard'
  | 'restaurants'
  | 'menus'
  | 'reservations'
  | 'localisation'
  | 'subscription'
  | 'notifications'
  | 'profile'

export const RestaurantDashboardPage: React.FC = () => {
  const { profile, signOut } = useAuth()

  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const [hours, setHours] = useState<RestaurantHours[] | null>(null)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [stats, setStats] = useState<StatsType | null>(null)
  const [urgentReservations, setUrgentReservations] = useState<ReservationWithDetails[]>([])

  // Menus
  const [menus, setMenus] = useState<MenuWithDetails[]>([])
  const [isEditingMenu, setIsEditingMenu] = useState(false)
  const [menuToEdit, setMenuToEdit] = useState<MenuWithDetails | null>(null)

  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<SidebarTab>('dashboard')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [waitlistEnabled, setWaitlistEnabled] = useState(true)

  // Modal de création/édition de restaurant
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [restaurantToEdit, setRestaurantToEdit] = useState<Restaurant | null>(null)

  // Notification après redirection LeekPay
  const [paymentNotice, setPaymentNotice] = useState<{
    type: 'pending' | 'confirmed'
    title: string
    message: string
  } | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const paymentParam = params.get('payment')

    if (paymentParam) {
      setPaymentNotice({
        type: 'pending',
        title: 'Paiement transmis — Vérification serveur en cours',
        message:
          'Votre demande de paiement LeekPay a été transmise. L activation/prolongation automatique de l abonnement s effectuera dès validation par le webhook serveur.',
      })
    }
  }, [])

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
    const [hoursRes, subRes, statsRes, menusRes, resasRes] = await Promise.all([
      restaurantService.fetchRestaurantHours(restaurantId),
      subscriptionService.fetchSubscription(restaurantId),
      restaurantService.fetchRestaurantStats(restaurantId),
      menuService.fetchMenusByRestaurant(restaurantId),
      reservationService.fetchRestaurantReservations(restaurantId, 'pending'),
    ])

    setHours(hoursRes.data)
    setSubscription(subRes.data)
    setStats(statsRes.data)
    setMenus(menusRes.data || [])
    setUrgentReservations(resasRes.data || [])
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
      setUrgentReservations([])
    }
  }, [selectedRestaurant?.id, loadRestaurantData])

  const handleOpenCreateModal = () => {
    setRestaurantToEdit(null)
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

  // Action rapide sur réservation urgente
  const handleQuickReservationAction = async (id: string, newStatus: 'confirmed' | 'rejected') => {
    const { error } = await reservationService.updateReservationStatus(id, newStatus)
    if (!error) {
      setUrgentReservations((prev) => prev.filter((r) => r.id !== id))
    } else {
      alert('Erreur lors de la mise à jour de la réservation.')
    }
  }

  // Déclencheur LeekPay
  const handleQuickLeekPayCheckout = async () => {
    if (!selectedRestaurant) return
    const { checkoutUrl, error } = await subscriptionService.createCheckoutSession(selectedRestaurant.id)
    if (error || !checkoutUrl) {
      alert(error?.message || 'Impossible de créer la session de paiement LeekPay.')
      return
    }
    window.open(checkoutUrl, '_blank', 'noopener,noreferrer')
  }

  const subInfo = subscriptionService.getSubscriptionInfo(subscription)
  const isTrial = subscription?.status === 'trialing'
  const isActiveSub = subscription?.status === 'active'

  const activeMenu = menus.find((m) => m.status === 'published') || menus[0] || null

  const navItems = [
    { id: 'dashboard' as SidebarTab, label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'restaurants' as SidebarTab, label: 'Profil & Établissement', icon: Store },
    { id: 'menus' as SidebarTab, label: 'Menus & Cartes', icon: Utensils },
    { id: 'reservations' as SidebarTab, label: 'Réservations', icon: Calendar },
    { id: 'localisation' as SidebarTab, label: 'Localisation & Horaires', icon: MapPin },
    { id: 'subscription' as SidebarTab, label: 'Abonnement & Facturation', icon: Receipt },
    { id: 'notifications' as SidebarTab, label: 'Notifications', icon: Bell, badge: 3 },
    { id: 'profile' as SidebarTab, label: 'Paramètres', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-background font-body-md text-on-surface antialiased flex flex-col">
      <SeoHead
        title={`${selectedRestaurant?.name || 'Portail Restaurateur'} — Tableau de Bord`}
        description="Gestion complète des cartes, menus du jour et réservations professionnelles."
        path="/espace-restaurant"
        noindex={true}
      />
      <PwaInstallPromptModal />

      {/* ========================================================================= */}
      {/* 1. LEFT SIDEBAR (Google Stitch Desktop Layout w-72)                       */}
      {/* ========================================================================= */}
      <aside className="fixed left-0 top-0 h-full w-72 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 hidden md:flex flex-col justify-between overflow-y-auto">
        <div className="flex flex-col">
          {/* Brand header */}
          <div className="h-16 px-space-base flex items-center justify-between bg-surface-container-lowest border-b border-surface-container-low">
            <div className="flex items-center gap-space-sm">
              <img
                alt="Brand logo"
                className="h-8 w-auto object-contain"
                src="https://lh3.googleusercontent.com/aida/AEtjO1UTt-dNa22cOeXEs7v8x9kOXhf2TxxgJonsL9_Oz5pDK6exz46Abxlmk4aUjK6aMeQRY1FFDioZKZP0kw7opI2le25btUY1uLfxKvHQhg4X3EZbh7VOEARmjDnC66zmZg0__BNzLHIi10bixPDXHyAl4D-Y0z1X_X3AFBpIazoPOEkhVVJID4rB4uYDKC48ourRAOOrQOhFzanyXMH7k66usylb-1s8WQxnS034eNhV2C6lvKgE5MQ3sDI"
              />
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm tracking-tight text-on-surface leading-none font-bold">
                  Menu du Jour
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant leading-none mt-space-2xs">
                  Portail Restaurateur
                </span>
              </div>
            </div>
          </div>

          {/* Active Venue Pill */}
          <div className="px-space-base py-space-sm">
            <div className="p-space-sm rounded-xl bg-surface-container-low flex flex-col gap-space-xs border border-surface-container/60">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                  Établissement
                </span>
                <span className="inline-flex items-center gap-1 px-space-xs py-space-2xs rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  {isTrial
                    ? `Essai J-${subInfo.remainingDays || 3}`
                    : isActiveSub
                    ? 'Abonné'
                    : 'Expiré'}
                </span>
              </div>
              <div className="flex items-center gap-space-xs">
                <Store className="w-4 h-4 text-secondary shrink-0" />
                <span className="font-label-lg text-label-lg text-on-surface truncate font-semibold">
                  {selectedRestaurant?.name || 'Sélectionner un restaurant'}
                </span>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                {selectedRestaurant?.city || 'Douala'} — {selectedRestaurant?.address || 'Bonanjo'}
              </span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 px-space-base py-space-sm flex flex-col gap-space-2xs">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id)
                    if (item.id === 'menus') setIsEditingMenu(false)
                  }}
                  className={`w-full flex items-center justify-between px-space-md py-space-sm rounded-xl transition-all cursor-pointer text-left ${
                    isActive
                      ? 'bg-primary-container text-on-primary font-label-lg shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-lg'
                  }`}
                >
                  <div className="flex items-center gap-space-md">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-secondary' : 'text-on-surface-variant'}`} />
                    <span className="font-label-lg text-label-lg">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-space-xs py-space-2xs rounded-full bg-secondary-container text-on-secondary font-label-sm text-label-sm font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-space-base flex flex-col gap-space-sm border-t border-surface-container-low">
          <div className="p-space-sm rounded-xl bg-surface-container flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold">
                LeekPay Sécurisé
              </span>
              <span className="font-data-mono text-data-mono text-on-surface font-semibold">
                5 000 FCFA / mois
              </span>
            </div>
            <ShieldCheck className="w-5 h-5 text-secondary" />
          </div>
          <button
            onClick={() => signOut()}
            className="flex items-center gap-space-sm px-space-md py-space-sm rounded-xl text-error hover:bg-error-container transition-colors cursor-pointer w-full text-left"
          >
            <LogOut className="w-4 h-4" />
            <span className="font-label-md text-label-md font-semibold">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. TOPBAR (Stitch Header with Blur & Elevation)                           */}
      {/* ========================================================================= */}
      <div className="pl-0 md:pl-72 flex-1 flex flex-col">
        <header className="fixed top-0 left-0 md:left-72 right-0 h-16 bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-4 sm:px-space-xl border-b border-surface-container-low">
          <div className="flex items-center gap-space-md">
            {/* Mobile Burger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-space-xs">
              <span className="font-headline-sm text-headline-sm text-on-surface font-bold truncate max-w-[200px] sm:max-w-md">
                {selectedRestaurant?.name || 'Le Wouri Bistrot & Grill'}
              </span>
              <span className="inline-flex items-center gap-1.5 px-space-sm py-space-2xs rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold shrink-0">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>
                {isTrial ? `Période d'essai (J-${subInfo.remainingDays || 3})` : 'Abonné actif'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-space-base">
            {/* Language Switcher */}
            <div className="inline-flex items-center rounded-xl bg-surface-container-low p-space-2xs">
              <button
                className="px-space-sm py-space-2xs rounded-lg bg-surface-container-lowest text-on-surface font-label-sm text-label-sm shadow-[0_1px_3px_rgba(15,23,42,0.05)] font-bold"
                type="button"
              >
                FR
              </button>
              <button
                className="px-space-sm py-space-2xs rounded-lg text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm"
                type="button"
              >
                EN
              </button>
            </div>

            {/* Notifications icon */}
            <button
              onClick={() => setActiveTab('notifications')}
              className="relative p-space-xs rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors flex items-center justify-center cursor-pointer"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-secondary-container ring-2 ring-surface"></span>
            </button>

            {/* Manager profile pill */}
            <div className="flex items-center gap-space-sm pl-space-sm border-l border-surface-container">
              <div className="hidden sm:flex flex-col text-right">
                <span className="font-label-md text-label-md text-on-surface font-semibold">
                  {profile?.full_name || 'Marc Ndongo'}
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">Gérant</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold">
                <User className="w-4 h-4" />
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Navigation Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-x-0 top-16 bg-surface-container-lowest border-b border-surface-container p-4 space-y-1 z-50 shadow-lg">
            {navItems.map((item) => {
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
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-label-lg text-sm transition-all ${
                    isActive
                      ? 'bg-primary-container text-on-primary font-bold'
                      : 'text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary font-bold text-xs">
                      {item.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. MAIN DASHBOARD CONTENT AREA                                            */}
        {/* ========================================================================= */}
        <main className="w-full pt-16 bg-surface min-h-screen">
          <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-gutter-desktop py-space-xl flex flex-col gap-space-xl">
            {/* Payment Notice banner */}
            {paymentNotice && (
              <div className="p-space-base rounded-2xl bg-surface-container-low border border-secondary/30 flex items-start justify-between gap-space-base shadow-sm">
                <div className="flex items-start gap-space-sm">
                  <Clock className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                      {paymentNotice.title}
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-2xs">
                      {paymentNotice.message}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setPaymentNotice(null)}
                  className="p-1 text-on-surface-variant hover:text-on-surface cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Loading state */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 bg-surface-container-lowest rounded-2xl border border-surface-container shadow-xs space-y-4">
                <div className="w-10 h-10 border-4 border-surface-container border-t-secondary rounded-full animate-spin" />
                <p className="font-label-lg text-label-lg text-on-surface-variant">
                  Chargement de votre portail restaurateur...
                </p>
              </div>
            ) : restaurants.length === 0 ? (
              /* If no restaurant created yet */
              <div className="bg-surface-container-lowest rounded-2xl border border-surface-container shadow-sm p-8 text-center max-w-xl mx-auto space-y-6 my-10">
                <div className="w-16 h-16 rounded-2xl bg-secondary-fixed text-secondary mx-auto flex items-center justify-center font-bold">
                  <Store className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">
                    Bienvenue sur Menu du Jour !
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    Vous n'avez pas encore créé de restaurant. Créez la fiche de votre établissement dès maintenant
                    pour bénéficier immédiatement de <strong>7 jours d'essai gratuit</strong>.
                  </p>
                </div>

                <button
                  onClick={handleOpenCreateModal}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary text-on-secondary hover:bg-secondary-container hover:text-on-secondary-container font-label-lg text-label-lg shadow-md transition-all cursor-pointer"
                >
                  <Plus className="w-5 h-5" />
                  Créer mon premier restaurant
                </button>
              </div>
            ) : (
              <>
                {/* ------------------------------------------------------------- */}
                {/* TAB 1: TABLEAU DE BORD (Stitch 99242f28467c4f22beea151f3a64df8f) */}
                {/* ------------------------------------------------------------- */}
                {activeTab === 'dashboard' && (
                  <div className="flex flex-col gap-space-xl">
                    {/* Header Section with Culinary Flair & Quick CTAs */}
                    <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg">
                      <div className="flex flex-col gap-space-2xs">
                        <div className="flex items-center gap-space-xs text-on-surface-variant">
                          <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
                            {selectedRestaurant?.city || 'Douala'}, {selectedRestaurant?.address || 'Bonanjo'}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                          <span className="font-data-mono text-data-mono text-on-surface-variant">
                            ID: {selectedRestaurant?.slug?.toUpperCase() || 'WOURI-BISTROT-237'}
                          </span>
                        </div>
                        <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight font-bold">
                          Tableau de Bord Établissement
                        </h1>
                        <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                          Supervision du service, alertes réservations en temps réel et statut de votre abonnement.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-space-sm">
                        <button
                          onClick={() => setActiveTab('menus')}
                          className="h-10 px-space-md bg-surface-container-lowest text-on-surface hover:bg-surface-container-high rounded-xl font-label-lg text-label-lg shadow-sm flex items-center gap-space-xs transition-all cursor-pointer"
                          type="button"
                        >
                          <Utensils className="w-4 h-4 text-on-surface-variant" />
                          <span>Modifier la Carte</span>
                        </button>
                        <button
                          onClick={() => setActiveTab('reservations')}
                          className="h-10 px-space-md bg-surface-container-lowest text-on-surface hover:bg-surface-container-high rounded-xl font-label-lg text-label-lg shadow-sm flex items-center gap-space-xs transition-all cursor-pointer"
                          type="button"
                        >
                          <Calendar className="w-4 h-4 text-on-surface-variant" />
                          <span>Gérer mes Réservations</span>
                        </button>
                        <button
                          onClick={handleCreateNewMenu}
                          className="h-10 px-space-md bg-secondary text-on-secondary hover:bg-secondary-container hover:text-on-secondary-container rounded-xl font-label-lg text-label-lg shadow-md flex items-center gap-space-xs transition-all cursor-pointer"
                          type="button"
                        >
                          <Plus className="w-4 h-4" />
                          <span>+ Nouveau Menu</span>
                        </button>
                      </div>
                    </section>

                    {/* Subscription Alert Banner: Warm Tactile Precision & LeekPay Focus */}
                    <section className="relative overflow-hidden rounded-xl bg-surface-container-low shadow-sm p-space-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-space-lg border border-surface-container/60">
                      <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-secondary-fixed/40 blur-2xl pointer-events-none"></div>
                      <div className="flex items-start gap-space-md max-w-3xl z-10">
                        <div className="w-12 h-12 rounded-xl bg-secondary-fixed flex items-center justify-center text-secondary shrink-0 shadow-sm">
                          <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div className="flex flex-col gap-space-2xs">
                          <div className="flex items-center gap-space-xs">
                            <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                              {isTrial
                                ? `Période d'essai gratuite : ${subInfo.remainingDays || 3} jours restants`
                                : isActiveSub
                                ? 'Abonnement Professionnel Actif'
                                : 'Abonnement expiré — Réactivation requise'}
                            </span>
                            <span className="inline-flex items-center gap-1 px-space-xs py-space-2xs rounded-full bg-surface-container-lowest text-on-surface font-label-sm text-label-sm shadow-sm font-semibold">
                              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> 100% Active
                            </span>
                          </div>
                          <p className="font-body-md text-body-md text-on-surface-variant">
                            Votre vitrine et vos réservations sont 100% actives. Passez à l'abonnement standard (
                            <span className="font-data-mono text-data-mono font-semibold text-on-surface">
                              5 000 FCFA / 30 jours via LeekPay
                            </span>
                            ) pour garantir la continuité opérationnelle de votre établissement sans coupure.
                          </p>
                        </div>
                      </div>
                      <div className="shrink-0 z-10 w-full md:w-auto">
                        <button
                          onClick={handleQuickLeekPayCheckout}
                          className="w-full md:w-auto h-11 px-space-lg bg-primary-container text-on-primary hover:bg-on-background rounded-xl font-label-lg text-label-lg shadow-md flex items-center justify-center gap-space-sm transition-all group cursor-pointer"
                          type="button"
                        >
                          <Zap className="w-5 h-5 text-secondary group-hover:rotate-12 transition-transform" />
                          <span>Activer mon abonnement LeekPay (5 000 FCFA)</span>
                        </button>
                      </div>
                    </section>

                    {/* Key Metrics Grid (4 Bento Cards with Distinct Typographic Weights) */}
                    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-base">
                      {/* KPI 1: Reservations Today */}
                      <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between h-48 relative overflow-hidden group border border-surface-container/40">
                        <div className="flex items-start justify-between">
                          <div className="flex flex-col">
                            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                              Réservations Aujourd'hui
                            </span>
                            <div className="flex items-baseline gap-space-xs mt-space-xs">
                              <span className="font-display-lg text-display-lg text-on-surface leading-none font-bold">
                                {stats ? stats.reservationsCount : 14}
                              </span>
                              <span className="font-label-md text-label-md text-on-surface-variant">demandes</span>
                            </div>
                          </div>
                          <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-on-surface">
                            <Calendar className="w-5 h-5" />
                          </div>
                        </div>
                        <div className="flex flex-col gap-space-xs">
                          <div className="flex items-center justify-between font-label-sm text-label-sm">
                            <span className="text-on-surface-variant">8 confirmées • 4 attente • 2 traitées</span>
                            <span className="font-data-mono text-data-mono text-secondary font-semibold">
                              92% accept.
                            </span>
                          </div>
                          <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden flex">
                            <div className="bg-primary-container h-full" style={{ width: '57%' }}></div>
                            <div className="bg-secondary h-full" style={{ width: '29%' }}></div>
                            <div className="bg-outline-variant h-full" style={{ width: '14%' }}></div>
                          </div>
                        </div>
                      </div>

                      {/* KPI 2: Couverts Prévus */}
                      <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between h-48 relative overflow-hidden group border border-surface-container/40">
                        <div className="flex items-start justify-between">
                          <div className="flex flex-col">
                            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                              Couverts Prévus
                            </span>
                            <div className="flex items-baseline gap-space-xs mt-space-xs">
                              <span className="font-display-lg text-display-lg text-secondary leading-none font-bold">
                                38
                              </span>
                              <span className="font-label-md text-label-md text-on-surface-variant">personnes</span>
                            </div>
                          </div>
                          <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-secondary">
                            <Utensils className="w-5 h-5" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-space-xs border-t border-surface-container-low">
                          <div className="flex flex-col">
                            <span className="font-label-sm text-label-sm text-on-surface-variant">
                              Midi (11h30-15h00)
                            </span>
                            <span className="font-label-lg text-label-lg text-on-surface font-bold">22 couverts</span>
                          </div>
                          <div className="w-px h-8 bg-surface-container"></div>
                          <div className="flex flex-col text-right">
                            <span className="font-label-sm text-label-sm text-on-surface-variant">
                              Soir (18h30-23h00)
                            </span>
                            <span className="font-label-lg text-label-lg text-on-surface font-bold">16 couverts</span>
                          </div>
                        </div>
                      </div>

                      {/* KPI 3: Vues de la Carte */}
                      <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between h-48 relative overflow-hidden border border-surface-container/40">
                        <div className="flex items-start justify-between">
                          <div className="flex flex-col">
                            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                              Vues Carte & Menus
                            </span>
                            <div className="flex items-baseline gap-space-xs mt-space-xs">
                              <span className="font-display-lg text-display-lg text-on-surface leading-none font-bold">
                                640
                              </span>
                              <span className="font-label-md text-label-md text-secondary font-bold flex items-center gap-1">
                                <TrendingUp className="w-3.5 h-3.5" /> +18% hier
                              </span>
                            </div>
                          </div>
                          <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-on-surface">
                            <Eye className="w-5 h-5" />
                          </div>
                        </div>
                        <div className="flex items-end justify-between gap-space-sm pt-space-xs border-t border-surface-container-low">
                          <div className="flex flex-col">
                            <span className="font-body-sm text-body-sm text-on-surface-variant">
                              Consultations QR Code & Direct
                            </span>
                            <span className="font-data-mono text-data-mono text-on-surface text-xs font-semibold">
                              Douala Centre & Banlieue
                            </span>
                          </div>
                          <svg className="w-24 h-8 shrink-0 overflow-visible text-secondary" fill="none" viewBox="0 0 100 30">
                            <path
                              d="M0 24 Q 20 28, 40 18 T 75 12 T 100 4"
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeWidth="2.5"
                            ></path>
                            <circle cx="100" cy="4" fill="currentColor" r="3"></circle>
                          </svg>
                        </div>
                      </div>

                      {/* KPI 4: Statut Carte en Ligne */}
                      <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between h-48 relative overflow-hidden border border-surface-container/40">
                        <div className="flex items-start justify-between">
                          <div className="flex flex-col">
                            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                              Statut Carte en Ligne
                            </span>
                            <div className="flex items-center gap-space-xs mt-space-xs">
                              <span className="inline-flex items-center gap-1 px-space-xs py-space-2xs rounded-full bg-surface-container text-on-surface font-label-md text-label-md font-bold">
                                <span className="w-2 h-2 rounded-full bg-secondary"></span> Actif & Diffusé
                              </span>
                            </div>
                          </div>
                          <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-on-surface">
                            <QrCode className="w-5 h-5" />
                          </div>
                        </div>
                        <div className="flex flex-col gap-space-2xs p-space-xs rounded-lg bg-surface-container-low">
                          <span className="font-label-sm text-label-sm text-on-surface font-semibold">
                            Menu du Jour Actif
                          </span>
                          <span className="font-data-mono text-data-mono text-on-surface-variant text-[11px]">
                            Synchro auto : 11h15 aujourd'hui
                          </span>
                        </div>
                      </div>
                    </section>

                    {/* Main Dual Grid Section: Urgent Reservations & Operational Status */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
                      {/* Left Column (8 Cols): Urgent Reservations to Process */}
                      <div className="lg:col-span-8 flex flex-col gap-space-base">
                        <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col gap-space-md border border-surface-container/40">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
                            <div className="flex items-center gap-space-sm">
                              <div className="w-3 h-3 rounded-full bg-secondary-container animate-ping"></div>
                              <div>
                                <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
                                  Réservations Urgentes à Traiter
                                </h2>
                                <p className="font-body-sm text-body-sm text-on-surface-variant">
                                  {urgentReservations.length > 0
                                    ? `${urgentReservations.length} demande(s) de table nécessitent une confirmation immédiate`
                                    : 'Toutes les réservations sont à jour pour le service en cours'}
                                </p>
                              </div>
                            </div>
                            <span className="font-data-mono text-data-mono px-space-sm py-space-2xs rounded-full bg-secondary-fixed text-on-secondary-fixed font-semibold self-start sm:self-auto text-xs">
                              Temps moyen réponse : 6 min
                            </span>
                          </div>

                          {/* Tabular Reservations Management */}
                          <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="bg-surface-container-low h-9 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                                  <th className="px-space-md rounded-l-lg">Heure & Date</th>
                                  <th className="px-space-md">Client</th>
                                  <th className="px-space-md text-center">Couverts</th>
                                  <th className="px-space-md">Contact</th>
                                  <th className="px-space-md">Demande Spéciale</th>
                                  <th className="px-space-md text-right rounded-r-lg">Décision</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-surface-container text-body-md">
                                {urgentReservations.length > 0 ? (
                                  urgentReservations.map((resa) => (
                                    <tr key={resa.id} className="hover:bg-surface-container-low/60 transition-colors h-14">
                                      <td className="px-space-md font-data-mono text-data-mono font-semibold text-on-surface whitespace-nowrap">
                                        {resa.reservation_time}{' '}
                                        <span className="text-on-surface-variant text-[11px] block font-normal">
                                          {resa.reservation_date}
                                        </span>
                                      </td>
                                      <td className="px-space-md font-label-lg text-label-lg text-on-surface whitespace-nowrap font-bold">
                                        {resa.customer_name}
                                      </td>
                                      <td className="px-space-md text-center whitespace-nowrap">
                                        <span className="px-space-xs py-space-2xs rounded-full bg-surface-container font-data-mono text-data-mono font-bold text-on-surface text-xs">
                                          {resa.party_size} pers
                                        </span>
                                      </td>
                                      <td className="px-space-md font-data-mono text-data-mono text-on-surface-variant whitespace-nowrap text-xs">
                                        {resa.customer_phone || '+237 ...'}
                                      </td>
                                      <td className="px-space-md text-on-surface max-w-xs truncate text-xs">
                                        {resa.message ? (
                                          <span className="inline-flex items-center gap-1 text-on-surface bg-surface-container-high/60 px-space-xs py-space-2xs rounded-md text-body-sm">
                                            {resa.message}
                                          </span>
                                        ) : (
                                          <span className="text-on-surface-variant italic">Aucune note particulière</span>
                                        )}
                                      </td>
                                      <td className="px-space-md text-right whitespace-nowrap">
                                        <div className="inline-flex items-center gap-space-xs justify-end">
                                          <button
                                            onClick={() => handleQuickReservationAction(resa.id, 'confirmed')}
                                            className="h-8 px-space-sm bg-primary text-on-primary hover:bg-surface-tint rounded-lg font-label-sm text-label-sm shadow-sm transition-all flex items-center gap-1 cursor-pointer font-semibold"
                                            type="button"
                                          >
                                            <Check className="w-3.5 h-3.5" /> Confirmer
                                          </button>
                                          <button
                                            onClick={() => handleQuickReservationAction(resa.id, 'rejected')}
                                            className="h-8 px-space-sm bg-surface-container text-error hover:bg-error-container rounded-lg font-label-sm text-label-sm transition-all flex items-center gap-1 cursor-pointer font-semibold"
                                            type="button"
                                          >
                                            <X className="w-3.5 h-3.5" /> Refuser
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <>
                                    {/* Default Stitch Reference Rows */}
                                    <tr className="hover:bg-surface-container-low/60 transition-colors h-14">
                                      <td className="px-space-md font-data-mono text-data-mono font-semibold text-on-surface whitespace-nowrap">
                                        12:45 <span className="text-on-surface-variant text-[11px] block font-normal">Aujourd'hui (Midi)</span>
                                      </td>
                                      <td className="px-space-md font-label-lg text-label-lg text-on-surface whitespace-nowrap font-bold">
                                        Samuel Eboa
                                      </td>
                                      <td className="px-space-md text-center whitespace-nowrap">
                                        <span className="px-space-xs py-space-2xs rounded-full bg-surface-container font-data-mono text-data-mono font-bold text-on-surface text-xs">
                                          4 pers
                                        </span>
                                      </td>
                                      <td className="px-space-md font-data-mono text-data-mono text-on-surface-variant whitespace-nowrap text-xs">
                                        +237 699 44 21 00
                                      </td>
                                      <td className="px-space-md text-on-surface max-w-xs truncate text-xs">
                                        <span className="inline-flex items-center gap-1 text-on-surface bg-surface-container-high/60 px-space-xs py-space-2xs rounded-md text-body-sm">
                                          Table terrasse ombragée
                                        </span>
                                      </td>
                                      <td className="px-space-md text-right whitespace-nowrap">
                                        <div className="inline-flex items-center gap-space-xs justify-end">
                                          <button
                                            onClick={() => setActiveTab('reservations')}
                                            className="h-8 px-space-sm bg-primary text-on-primary hover:bg-surface-tint rounded-lg font-label-sm text-label-sm shadow-sm transition-all flex items-center gap-1 cursor-pointer font-semibold"
                                            type="button"
                                          >
                                            <Check className="w-3.5 h-3.5" /> Confirmer
                                          </button>
                                          <button
                                            onClick={() => setActiveTab('reservations')}
                                            className="h-8 px-space-sm bg-surface-container text-error hover:bg-error-container rounded-lg font-label-sm text-label-sm transition-all flex items-center gap-1 cursor-pointer font-semibold"
                                            type="button"
                                          >
                                            <X className="w-3.5 h-3.5" /> Refuser
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                    <tr className="hover:bg-surface-container-low/60 transition-colors h-14">
                                      <td className="px-space-md font-data-mono text-data-mono font-semibold text-on-surface whitespace-nowrap">
                                        13:15 <span className="text-on-surface-variant text-[11px] block font-normal">Aujourd'hui (Midi)</span>
                                      </td>
                                      <td className="px-space-md font-label-lg text-label-lg text-on-surface whitespace-nowrap font-bold">
                                        Claire Kamdem
                                      </td>
                                      <td className="px-space-md text-center whitespace-nowrap">
                                        <span className="px-space-xs py-space-2xs rounded-full bg-surface-container font-data-mono text-data-mono font-bold text-on-surface text-xs">
                                          2 pers
                                        </span>
                                      </td>
                                      <td className="px-space-md font-data-mono text-data-mono text-on-surface-variant whitespace-nowrap text-xs">
                                        +237 677 12 88 43
                                      </td>
                                      <td className="px-space-md text-on-surface max-w-xs truncate text-xs">
                                        <span className="text-body-sm text-on-surface-variant italic">Déjeuner pro / Coin calme</span>
                                      </td>
                                      <td className="px-space-md text-right whitespace-nowrap">
                                        <div className="inline-flex items-center gap-space-xs justify-end">
                                          <button
                                            onClick={() => setActiveTab('reservations')}
                                            className="h-8 px-space-sm bg-primary text-on-primary hover:bg-surface-tint rounded-lg font-label-sm text-label-sm shadow-sm transition-all flex items-center gap-1 cursor-pointer font-semibold"
                                            type="button"
                                          >
                                            <Check className="w-3.5 h-3.5" /> Confirmer
                                          </button>
                                          <button
                                            onClick={() => setActiveTab('reservations')}
                                            className="h-8 px-space-sm bg-surface-container text-error hover:bg-error-container rounded-lg font-label-sm text-label-sm transition-all flex items-center gap-1 cursor-pointer font-semibold"
                                            type="button"
                                          >
                                            <X className="w-3.5 h-3.5" /> Refuser
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  </>
                                )}
                              </tbody>
                            </table>
                          </div>

                          <div className="flex items-center justify-between pt-space-xs font-label-sm text-label-sm text-on-surface-variant border-t border-surface-container-low">
                            <span>
                              {urgentReservations.length > 0
                                ? `${urgentReservations.length} réservation(s) en attente`
                                : 'Affichage des réservations en attente'}
                            </span>
                            <button
                              onClick={() => setActiveTab('reservations')}
                              className="text-secondary hover:text-on-surface font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              Voir l'historique complet <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Active Daily Menus & Physical PDF Synchronisation */}
                        <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col gap-space-base border border-surface-container/40">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
                            <div>
                              <div className="flex items-center gap-space-xs">
                                <span className="font-headline-md text-headline-md text-on-surface font-bold">
                                  Menus & Cartes Actifs
                                </span>
                                <span className="px-space-xs py-space-2xs rounded-full bg-surface-container font-label-sm text-label-sm text-on-surface font-semibold">
                                  {activeMenu ? 'Publié' : 'Actif'}
                                </span>
                              </div>
                              <p className="font-body-sm text-body-sm text-on-surface-variant">
                                {activeMenu?.title || 'Menu du Jour - Semaine en cours (Diffusion QR Code & Web)'}
                              </p>
                            </div>
                            <div className="flex items-center gap-space-xs">
                              <button
                                onClick={() => setActiveTab('menus')}
                                className="h-9 px-space-sm bg-surface-container text-on-surface hover:bg-surface-container-high rounded-lg font-label-sm text-label-sm flex items-center gap-space-xs transition-colors cursor-pointer font-semibold"
                                type="button"
                              >
                                <QrCode className="w-4 h-4 text-secondary" />
                                <span>QR Code de table</span>
                              </button>
                            </div>
                          </div>

                          {/* Menu Items Showcase (Dish Cards with Rich Data) */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-base">
                            {/* Entrée */}
                            <div className="bg-surface-container-low rounded-xl p-space-base flex flex-col justify-between gap-space-md border border-surface-container/60">
                              <div className="flex flex-col gap-space-xs">
                                <div className="flex items-center justify-between">
                                  <span className="font-label-sm text-label-sm text-secondary uppercase font-bold tracking-wider">
                                    Entrée du Jour
                                  </span>
                                  <span className="w-2 h-2 rounded-full bg-secondary"></span>
                                </div>
                                <div className="h-28 rounded-lg overflow-hidden relative">
                                  <img
                                    className="w-full h-full object-cover"
                                    alt="Carpaccio de Bar Sauvage Fumé"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBz7b98FpcYawj0kyPfErhaGderA-qpPipMcCfDL32FWcuekAeWf0OFYDpY_ROptvj4qZc-ACFaNLlCxQ9q2MHXNE_i5rsaxU4jwq9c7KPQPtIIUY6MKlOkvp_PZ1n0gbYT2_2WR0NuHzZHdmjZSUBXFmz0UDvo19eSMYvH4ibYma6nv1VkNDgOZpdG-TEnosBiCBsf_qOQmD6NfUJcmdHYduwm-BJ9g4UyPrU9kcJNC3tHfDRCML91"
                                  />
                                  <span className="absolute bottom-2 left-2 px-space-xs py-space-2xs rounded bg-primary-container/80 text-on-primary font-data-mono text-data-mono text-[11px] backdrop-blur-sm">
                                    Stock: 18 restants
                                  </span>
                                </div>
                                <h3 className="font-label-lg text-label-lg text-on-surface font-bold pt-space-xs">
                                  Carpaccio de Bar Sauvage Fumé
                                </h3>
                                <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                                  Agrumes de Penja, poivre blanc moulu frais, huile d'olive vierge de Nyamboya.
                                </p>
                              </div>
                              <div className="flex items-center justify-between pt-space-xs border-t border-surface-container">
                                <span className="font-data-mono text-data-mono font-bold text-on-surface">
                                  4 500 FCFA
                                </span>
                                <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
                                  Disponible
                                </span>
                              </div>
                            </div>

                            {/* Plat */}
                            <div className="bg-surface-container-low rounded-xl p-space-base flex flex-col justify-between gap-space-md border border-surface-container/60">
                              <div className="flex flex-col gap-space-xs">
                                <div className="flex items-center justify-between">
                                  <span className="font-label-sm text-label-sm text-secondary uppercase font-bold tracking-wider">
                                    Plat Signature
                                  </span>
                                  <span className="w-2 h-2 rounded-full bg-secondary"></span>
                                </div>
                                <div className="h-28 rounded-lg overflow-hidden relative">
                                  <img
                                    className="w-full h-full object-cover"
                                    alt="Pavé de Capitaine Braisé & Alloco"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkdMEku278MrtB4gTtCI9DePp9V5cy4Qz0Ljfekx4mfIC508D0Hc8ULftikDwv1mBw63BG9nc-OSH0h3i7oo4Yw_GuWqDMmfMFxM37kx-Rg42vrUvluk10BRQ_ADg8LoqOlTVGSB7-qDDpMEegOJFAKDXITi9pFydPlScD7Doni0XAVjUCF3gCeh7te8HnI4ZbN9G-2rocTlxvTqDp1a7SRmmH2Ot69bXO9r5MXs7xRbTq2XqFG8lb"
                                  />
                                  <span className="absolute bottom-2 left-2 px-space-xs py-space-2xs rounded bg-primary-container/80 text-on-primary font-data-mono text-data-mono text-[11px] backdrop-blur-sm">
                                    Stock: 24 restants
                                  </span>
                                </div>
                                <h3 className="font-label-lg text-label-lg text-on-surface font-bold pt-space-xs">
                                  Pavé de Capitaine Braisé & Alloco
                                </h3>
                                <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                                  Sauce vierge aux échalotes locales, bananes plantains dorées et émulsion ndolè doux.
                                </p>
                              </div>
                              <div className="flex items-center justify-between pt-space-xs border-t border-surface-container">
                                <span className="font-data-mono text-data-mono font-bold text-on-surface">
                                  8 500 FCFA
                                </span>
                                <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
                                  Disponible
                                </span>
                              </div>
                            </div>

                            {/* Dessert */}
                            <div className="bg-surface-container-low rounded-xl p-space-base flex flex-col justify-between gap-space-md border border-surface-container/60">
                              <div className="flex flex-col gap-space-xs">
                                <div className="flex items-center justify-between">
                                  <span className="font-label-sm text-label-sm text-secondary uppercase font-bold tracking-wider">
                                    Dessert Douceur
                                  </span>
                                  <span className="w-2 h-2 rounded-full bg-secondary"></span>
                                </div>
                                <div className="h-28 rounded-lg overflow-hidden relative">
                                  <img
                                    className="w-full h-full object-cover"
                                    alt="Tartelette Passion & Noix de Coco"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-aqIhjX80M3qIeSZJJYxISoySoSU350PAadPmRFV7eiKGv-9XD1DxATMokniwAwBKK86ytZ1RJjMFpRHQJiiUw2WsNnB3BJ9Snn6P4jBpMQBlamY5tKuOsH10KW5QwGlbGb9Kc6aJFVn3KFipBLj8x4LHQmC4Y_qOCeLw0fzxXpnxxRltdkjETMd-8yE2NvCaHr7cIV5CENQymFcsTxi34soWh_FvhcEw8b9oMIi3ggiuM_e1rZHx"
                                  />
                                  <span className="absolute bottom-2 left-2 px-space-xs py-space-2xs rounded bg-primary-container/80 text-on-primary font-data-mono text-data-mono text-[11px] backdrop-blur-sm">
                                    Stock: 12 restants
                                  </span>
                                </div>
                                <h3 className="font-label-lg text-label-lg text-on-surface font-bold pt-space-xs">
                                  Tartelette Passion & Noix de Coco
                                </h3>
                                <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                                  Crème onctueuse au fruit de la passion de Kribi, copeaux de coco torréfiés.
                                </p>
                              </div>
                              <div className="flex items-center justify-between pt-space-xs border-t border-surface-container">
                                <span className="font-data-mono text-data-mono font-bold text-on-surface">
                                  3 000 FCFA
                                </span>
                                <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
                                  Disponible
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Attached Physical PDF Card */}
                          <div className="p-space-md rounded-xl bg-surface-container flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
                            <div className="flex items-center gap-space-md">
                              <div className="w-10 h-10 rounded-lg bg-surface-container-lowest flex items-center justify-center text-secondary shrink-0 shadow-sm">
                                <FileText className="w-5 h-5" />
                              </div>
                              <div className="flex flex-col">
                                <span className="font-label-lg text-label-lg text-on-surface font-semibold">
                                  Menu_Wouri_Octobre.pdf
                                </span>
                                <span className="font-data-mono text-data-mono text-on-surface-variant text-xs">
                                  3.2 Mo / max 10 Mo • Accessible par les clients via QR Code
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-space-xs">
                              <button
                                onClick={() => setActiveTab('menus')}
                                className="h-8 px-space-sm bg-surface-container-lowest text-on-surface hover:bg-surface-container-high rounded-lg font-label-sm text-label-sm transition-colors cursor-pointer font-semibold"
                                type="button"
                              >
                                Remplacer le PDF
                              </button>
                              <button
                                onClick={() => setActiveTab('menus')}
                                className="h-8 px-space-sm bg-surface-container-lowest text-on-surface hover:bg-surface-container-high rounded-lg font-label-sm text-label-sm transition-colors flex items-center gap-1 cursor-pointer font-semibold"
                                type="button"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Consulter</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Column (4 Cols): Live Operational Service & Shift Supervision */}
                      <div className="lg:col-span-4 flex flex-col gap-space-base">
                        {/* Live Service Status Widget */}
                        <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col gap-space-lg border border-surface-container/40">
                          <div className="flex items-center justify-between">
                            <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                              Horaires & Service en Direct
                            </h2>
                            <Clock className="w-5 h-5 text-secondary" />
                          </div>

                          {/* Live Indicator Box */}
                          <div className="p-space-base rounded-xl bg-surface-container-low flex flex-col gap-space-sm border border-surface-container/60">
                            <div className="flex items-center justify-between">
                              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                                Service Actuel
                              </span>
                              <span className="inline-flex items-center gap-1.5 px-space-xs py-space-2xs rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold">
                                <span className="w-2 h-2 rounded-full bg-secondary animate-ping"></span> En direct
                              </span>
                            </div>
                            <div className="flex flex-col gap-space-2xs">
                              <span className="font-headline-md text-headline-md text-on-surface font-bold">
                                Ouvert - Midi
                              </span>
                              <span className="font-data-mono text-data-mono text-secondary font-semibold text-xs">
                                11h30 - 15h00 (Clôture dans 1h45)
                              </span>
                            </div>
                            {/* Progress through current shift */}
                            <div className="flex flex-col gap-space-2xs pt-space-xs">
                              <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
                                <div className="bg-secondary h-full rounded-full" style={{ width: '50%' }}></div>
                              </div>
                              <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant text-xs">
                                <span>11h30</span>
                                <span>Créneau : 13h15</span>
                                <span>15h00</span>
                              </div>
                            </div>
                          </div>

                          {/* Next Service Shift */}
                          <div className="p-space-base rounded-xl bg-surface-container flex items-center justify-between">
                            <div className="flex flex-col">
                              <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                                Prochain créneau aujourd'hui
                              </span>
                              <span className="font-label-lg text-label-lg text-on-surface font-bold">
                                Service du Soir
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="font-data-mono text-data-mono font-bold text-on-surface text-sm">
                                18h30 - 23h00
                              </span>
                              <span className="block font-label-sm text-label-sm text-on-surface-variant">
                                16 couverts réservés
                              </span>
                            </div>
                          </div>

                          {/* Kitchen & Floor Operational Snapshot */}
                          <div className="flex flex-col gap-space-sm">
                            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                              Supervision Salle & Tables
                            </span>
                            <div className="grid grid-cols-2 gap-space-sm">
                              <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col border border-surface-container/60">
                                <span className="font-label-sm text-label-sm text-on-surface-variant">
                                  Tables Occupées
                                </span>
                                <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                                  7 / 12
                                </span>
                                <span className="font-label-sm text-label-sm text-secondary font-semibold">
                                  58% d'occupation
                                </span>
                              </div>
                              <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col border border-surface-container/60">
                                <span className="font-label-sm text-label-sm text-on-surface-variant">
                                  File d'attente
                                </span>
                                <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                                  0
                                </span>
                                <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                                  Flux fluide
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Quick Toggle Action for Shift Extension */}
                          <div className="flex items-center justify-between pt-space-xs border-t border-surface-container-low">
                            <div className="flex flex-col">
                              <span className="font-label-md text-label-md text-on-surface font-bold">
                                Accepter réservations sans table
                              </span>
                              <span className="font-body-sm text-body-sm text-on-surface-variant text-xs">
                                Activer la file d'attente digitale
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setWaitlistEnabled(!waitlistEnabled)}
                              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                                waitlistEnabled ? 'bg-secondary' : 'bg-surface-container'
                              }`}
                            >
                              <span
                                className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                                  waitlistEnabled ? 'translate-x-5' : 'translate-x-0.5'
                                }`}
                              />
                            </button>
                          </div>
                        </div>

                        {/* Location Quick Mini Card */}
                        <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col gap-space-sm border border-surface-container/40">
                          <div className="flex items-center justify-between">
                            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                              Localisation Établissement
                            </span>
                            <MapPin className="w-4 h-4 text-on-surface-variant" />
                          </div>
                          <div
                            className="w-full h-28 rounded-lg bg-cover bg-center overflow-hidden flex items-end p-space-xs shadow-inner"
                            style={{
                              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDI9-HihbjeYNqmRFzhEn0SUDUcJUBqJbuQRDDWg5iPiQ7gjKQMqS_TXhG97hIVy7vFC30e5CPOtOkREZwhAgkFBGg8xtA2m2HTsjhVfPA_kNZNYTVrxIHnwbn7iFIwRU1VONuDYkyuNKx12yZIyIu9vs9xXN2GNUpyBe0AHSaVL6RAdibHOIuSjVaA6YXyzsE43izkR0adNsGKECvFHpSlt4hcxeftfSDeuq46KkKt7vyUifG-nsUB')`,
                            }}
                          >
                            <span className="px-space-xs py-space-2xs rounded bg-primary-container/85 text-on-primary font-data-mono text-data-mono text-[11px] backdrop-blur-sm">
                              {selectedRestaurant?.address || 'Rue Tokoto, Face Ancien Port'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between pt-space-2xs">
                            <span className="font-label-sm text-label-sm text-on-surface-variant">
                              Code Postal : {selectedRestaurant?.city || 'Douala'} 1er
                            </span>
                            <button
                              onClick={() => setActiveTab('restaurants')}
                              className="font-label-sm text-label-sm text-secondary font-bold hover:underline cursor-pointer"
                            >
                              Modifier l'adresse
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* TAB 2: PROFIL & ÉTABLISSEMENT                                 */}
                {/* ------------------------------------------------------------- */}
                {activeTab === 'restaurants' && selectedRestaurant && (
                  <RestaurantProfileSettings
                    restaurant={selectedRestaurant}
                    hours={hours}
                    onRefresh={() => loadRestaurantData(selectedRestaurant.id)}
                  />
                )}

                {/* ------------------------------------------------------------- */}
                {/* TAB 3: MENUS & CARTES                                         */}
                {/* ------------------------------------------------------------- */}
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

                {/* ------------------------------------------------------------- */}
                {/* TAB 4: RÉSERVATIONS                                           */}
                {/* ------------------------------------------------------------- */}
                {activeTab === 'reservations' && selectedRestaurant && (
                  <RestaurantReservationsList
                    restaurantId={selectedRestaurant.id}
                    restaurantName={selectedRestaurant.name}
                  />
                )}

                {/* ------------------------------------------------------------- */}
                {/* TAB 5: LOCALISATION & HORAIRES                                */}
                {/* ------------------------------------------------------------- */}
                {activeTab === 'localisation' && selectedRestaurant && (
                  <RestaurantProfileSettings
                    restaurant={selectedRestaurant}
                    hours={hours}
                    onRefresh={() => loadRestaurantData(selectedRestaurant.id)}
                  />
                )}

                {/* ------------------------------------------------------------- */}
                {/* TAB 6: ABONNEMENT & FACTURATION                               */}
                {/* ------------------------------------------------------------- */}
                {activeTab === 'subscription' && (
                  <SubscriptionCard
                    subscription={subscription}
                    restaurantId={selectedRestaurant?.id}
                    onRefresh={() => selectedRestaurant && loadRestaurantData(selectedRestaurant.id)}
                  />
                )}

                {/* ------------------------------------------------------------- */}
                {/* TAB 7: NOTIFICATIONS                                          */}
                {/* ------------------------------------------------------------- */}
                {activeTab === 'notifications' && (
                  <div className="space-y-6">
                    <NotificationList />
                    <PushSubscriptionToggle />
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* TAB 8: PARAMÈTRES / PROFIL                                    */}
                {/* ------------------------------------------------------------- */}
                {activeTab === 'profile' && (
                  <div className="bg-surface-container-lowest rounded-2xl border border-surface-container p-6 space-y-6 shadow-sm">
                    <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface border-b border-surface-container pb-3">
                      Profil du gestionnaire
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div className="p-4 bg-surface-container-low rounded-xl border border-surface-container">
                        <span className="text-on-surface-variant block font-medium">Nom complet</span>
                        <span className="text-on-surface font-semibold text-sm mt-0.5 block">
                          {profile?.full_name || 'Marc Ndongo'}
                        </span>
                      </div>
                      <div className="p-4 bg-surface-container-low rounded-xl border border-surface-container">
                        <span className="text-on-surface-variant block font-medium">Téléphone</span>
                        <span className="text-on-surface font-semibold text-sm mt-0.5 block">
                          {profile?.phone || '+237 699 00 00 00'}
                        </span>
                      </div>
                      <div className="p-4 bg-surface-container-low rounded-xl border border-surface-container">
                        <span className="text-on-surface-variant block font-medium">Rôle</span>
                        <span className="text-secondary font-semibold text-sm mt-0.5 block">
                          Gestionnaire de restaurant
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-surface-container flex items-center justify-between">
                      <button
                        onClick={() => handleOpenCreateModal()}
                        className="px-4 py-2.5 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high font-semibold text-xs inline-flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        Ajouter un autre restaurant
                      </button>
                      <button
                        onClick={() => signOut()}
                        className="px-4 py-2.5 rounded-xl bg-error-container text-error hover:opacity-90 font-semibold text-xs inline-flex items-center gap-2 transition-colors cursor-pointer"
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
          </div>
        </main>
      </div>
    </div>
  )
}


