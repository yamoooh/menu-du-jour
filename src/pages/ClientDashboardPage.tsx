import React, { useEffect, useState, useCallback } from 'react'
import { Header } from '@/components/Header'
import { SeoHead } from '@/components/public/SeoHead'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { supabase } from '@/lib/supabase'
import { restaurantService } from '@/services/restaurantService'
import { discoveryService } from '@/services/discoveryService'
import { followerService } from '@/services/followerService'
import { reservationService } from '@/services/reservationService'
import { notificationService } from '@/services/notificationService'
import type { Restaurant } from '@/types/restaurant.types'
import type { ReservationWithDetails } from '@/types/reservation.types'
import { ClientReservationsList } from '@/components/reservation/ClientReservationsList'
import { FollowedRestaurantsList } from '@/components/follow/FollowedRestaurantsList'
import { RestaurantCard } from '@/components/discovery/RestaurantCard'
import { RestaurantSearch } from '@/components/discovery/RestaurantSearch'
import { ReservationModal } from '@/components/reservation/ReservationModal'
import { NotificationList } from '@/components/notification/NotificationList'
import { PushSubscriptionToggle } from '@/components/notification/PushSubscriptionToggle'
import {
  LayoutDashboard,
  Utensils,
  Heart,
  Calendar,
  Bell,
  UserCheck,
  UtensilsCrossed,
  Store,
  RefreshCw,
  LogOut,
  Menu as MenuIcon,
  X,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Phone,
  User,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react'

export type ClientTab =
  | 'dashboard'
  | 'discover'
  | 'followed'
  | 'reservations'
  | 'notifications'
  | 'profile'

export const ClientDashboardPage: React.FC = () => {
  const { user, profile, signOut, refreshProfile } = useAuth()
  const { t, language } = useLanguage()

  const [activeTab, setActiveTab] = useState<ClientTab>('dashboard')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loadingRestaurants, setLoadingRestaurants] = useState<boolean>(true)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  // Real Stats Counters
  const [followedCount, setFollowedCount] = useState<number>(0)
  const [reservationsCount, setReservationsCount] = useState<number>(0)
  const [unreadNotifsCount, setUnreadNotifsCount] = useState<number>(0)
  const [recentReservations, setRecentReservations] = useState<ReservationWithDetails[]>([])

  // Profile Form State
  const [fullName, setFullName] = useState<string>(profile?.full_name || '')
  const [phone, setPhone] = useState<string>(profile?.phone || '')
  const [updatingProfile, setUpdatingProfile] = useState<boolean>(false)
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null)
  const [profileError, setProfileError] = useState<string | null>(null)

  // Synchroniser le formulaire quand le profil change
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '')
      setPhone(profile.phone || '')
    }
  }, [profile])

  // Charger les statistiques réelles depuis Supabase
  const loadClientStats = useCallback(async () => {
    try {
      if (!user) return
      const [followedRes, resasRes, notifsRes] = await Promise.all([
        followerService.fetchFollowedRestaurants(),
        reservationService.fetchClientReservations(),
        notificationService.getUserNotifications(user.id),
      ])

      setFollowedCount(followedRes.data?.length || 0)
      const resas = resasRes.data || []
      setReservationsCount(resas.length)
      setRecentReservations(resas.slice(0, 3))

      const notifs = notifsRes.data || []
      setUnreadNotifsCount(notifs.filter((n: any) => !n.is_read).length)
    } catch (err) {
      console.error('Erreur chargement stats client:', err)
    }
  }, [user])

  // Charger les restaurants actifs
  const loadActiveRestaurants = useCallback(async (query?: string) => {
    setLoadingRestaurants(true)
    const { data } = await discoveryService.fetchActiveRestaurants(query)
    setRestaurants(data || [])
    setLoadingRestaurants(false)
  }, [])

  useEffect(() => {
    loadClientStats()
  }, [loadClientStats])

  useEffect(() => {
    const timer = setTimeout(() => {
      loadActiveRestaurants(searchQuery)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery, loadActiveRestaurants])

  useEffect(() => {
    restaurantService.fetchActiveRestaurants().then((res) => {
      if (res.data) setRestaurants(res.data)
    })
  }, [])

  // Sauvegarder les modifications du profil client
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setUpdatingProfile(true)
    setProfileSuccess(null)
    setProfileError(null)

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName.trim(),
          phone: phone.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (error) throw error

      await refreshProfile()
      setProfileSuccess(t.client.profile.saveSuccess)
    } catch (err: any) {
      setProfileError(err.message || 'Erreur lors de la mise à jour du profil.')
    } finally {
      setUpdatingProfile(false)
    }
  }

  // Configuration de la navigation sidebar
  const navItems = [
    {
      id: 'dashboard' as ClientTab,
      label: t.client.nav.dashboard,
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'discover' as ClientTab,
      label: t.client.nav.discover,
      icon: Utensils,
      badge: restaurants.length > 0 ? restaurants.length : null,
    },
    {
      id: 'followed' as ClientTab,
      label: t.client.nav.followed,
      icon: Heart,
      badge: followedCount > 0 ? followedCount : null,
      badgeColor: 'bg-red-100 text-red-700',
    },
    {
      id: 'reservations' as ClientTab,
      label: t.client.nav.reservations,
      icon: Calendar,
      badge: reservationsCount > 0 ? reservationsCount : null,
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'notifications' as ClientTab,
      label: t.client.nav.notifications,
      icon: Bell,
      badge: unreadNotifsCount > 0 ? unreadNotifsCount : null,
      badgeColor: 'bg-orange-600 text-white',
    },
    {
      id: 'profile' as ClientTab,
      label: t.client.nav.profile,
      icon: UserCheck,
      badge: null,
    },
  ]

  // Formater la date en français
  const formatDateFr = (dateStr: string) => {
    try {
      const date = new Date(dateStr + 'T00:00:00')
      return date.toLocaleDateString(language === 'en' ? 'en-US' : 'fr-FR', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      })
    } catch {
      return dateStr
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans antialiased">
      <SeoHead
        title={`${t.client.title} — Menu du Jour`}
        description="Espace personnel gourmet pour réserver des tables et suivre vos restaurants favoris."
        path="/espace-client"
        noindex={true}
      />

      {/* Header global */}
      <Header />

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        {/* ================= 1. SIDEBAR LATÉRALE DESKTOP ================= */}
        <aside className="hidden md:flex flex-col w-64 shrink-0 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-6 sticky top-24">
            {/* Tag Espace Client */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="space-y-0.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-orange-600">
                  {t.client.badge}
                </span>
                <h2 className="font-extrabold text-slate-900 text-base">Espace Gourmet</h2>
              </div>
              <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-xs border border-orange-100">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
            </div>

            {/* Menu de navigation */}
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = activeTab === item.id

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 ${
                          isActive
                            ? 'text-orange-400'
                            : item.id === 'followed'
                            ? 'text-red-500'
                            : 'text-slate-400'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.badge !== null && item.badge !== undefined && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                          item.badgeColor || (isActive ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-700')
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                )
              })}
            </nav>

            {/* Profil & Déconnexion en bas de la sidebar */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                  {profile?.full_name?.charAt(0).toUpperCase() || 'C'}
                </div>
                <div className="overflow-hidden space-y-0.5">
                  <span className="font-bold text-slate-900 text-xs block truncate">
                    {profile?.full_name || 'Gourmet'}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold block">
                    Client (Accès Gratuit)
                  </span>
                </div>
              </div>

              <button
                onClick={() => signOut()}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer border border-transparent hover:border-red-100"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        </aside>

        {/* ================= 2. DRAWER / MENU MOBILE ================= */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop */}
            <div
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            />

            {/* Menu Coulissant */}
            <div className="relative flex-1 max-w-xs w-full bg-white h-full shadow-2xl p-6 flex flex-col justify-between z-10 space-y-6 overflow-y-auto">
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-orange-600">
                      Menu du Jour
                    </span>
                    <h2 className="font-extrabold text-slate-900 text-base">Espace Client</h2>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = activeTab === item.id

                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id)
                          setMobileMenuOpen(false)
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isActive
                            ? 'bg-slate-900 text-white shadow-xs'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </div>

                        {item.badge !== null && item.badge !== undefined && (
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                              item.badgeColor || 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </nav>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-3">
                <button
                  onClick={() => {
                    signOut()
                    setMobileMenuOpen(false)
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Déconnexion</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= 3. CONTENU PRINCIPAL CLIENT ================= */}
        <main className="flex-1 space-y-6 min-w-0">
          {/* Topbar Interne Mobile & Action Rapide */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 overflow-hidden">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer shrink-0"
              >
                <MenuIcon className="w-5 h-5" />
              </button>

              <div className="overflow-hidden">
                <h1 className="text-base sm:text-lg font-extrabold text-slate-900 truncate">
                  {activeTab === 'dashboard' && t.client.nav.dashboard}
                  {activeTab === 'discover' && t.client.nav.discover}
                  {activeTab === 'followed' && t.client.nav.followed}
                  {activeTab === 'reservations' && t.client.nav.reservations}
                  {activeTab === 'notifications' && t.client.nav.notifications}
                  {activeTab === 'profile' && t.client.nav.profile}
                </h1>
                <p className="text-[11px] text-slate-500 truncate hidden sm:block">
                  Plateforme gratuite de découverte et de réservation de tables
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all cursor-pointer shrink-0"
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span className="hidden sm:inline">Réserver une table</span>
              <span className="sm:hidden">Réserver</span>
            </button>
          </div>

          {/* ================= VUE 1 : TABLEAU DE BORD (DASHBOARD) ================= */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Banner de bienvenue */}
              <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-amber-500 rounded-2xl p-6 sm:p-8 text-white shadow-lg shadow-orange-500/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden">
                <div className="relative z-10 space-y-2 max-w-xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-md">
                    <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                    <span>Espace Client Gourmet (Accès Gratuit)</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    {t.client.dashboard.welcome}, {profile?.full_name || 'Cher gourmet'} !
                  </h2>
                  <p className="text-orange-100 text-xs sm:text-sm leading-relaxed">
                    {t.client.dashboard.subtitle}
                  </p>
                </div>

                <div className="relative z-10 flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => setActiveTab('discover')}
                    className="px-5 py-2.5 rounded-xl bg-white text-orange-600 hover:bg-orange-50 font-bold text-xs shadow-md transition-colors cursor-pointer"
                  >
                    {t.client.dashboard.discoverCta}
                  </button>
                </div>
              </div>

              {/* Cartes KPI réelles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">
                      {t.client.dashboard.followedCount}
                    </span>
                    <div className="p-2 rounded-xl bg-red-50 text-red-500">
                      <Heart className="w-4 h-4 fill-red-500" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-900">{followedCount}</span>
                    <span className="text-[11px] text-slate-400">établissements</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">
                      {t.client.dashboard.upcomingReservations}
                    </span>
                    <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                      <Calendar className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-900">{reservationsCount}</span>
                    <span className="text-[11px] text-slate-400">réservations</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">
                      {t.client.dashboard.unreadNotifications}
                    </span>
                    <div className="p-2 rounded-xl bg-orange-50 text-orange-600">
                      <Bell className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-900">{unreadNotifsCount}</span>
                    <span className="text-[11px] text-slate-400">non lues</span>
                  </div>
                </div>
              </div>

              {/* Prochaines réservations réelles */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-orange-600" />
                    {t.client.dashboard.recentReservationsTitle}
                  </h3>
                  <button
                    onClick={() => setActiveTab('reservations')}
                    className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Voir tout</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {recentReservations.length === 0 ? (
                  <div className="py-8 text-center space-y-2">
                    <Calendar className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-xs font-semibold text-slate-600">
                      {t.client.dashboard.noUpcomingReservations}
                    </p>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="mt-2 text-xs font-bold text-orange-600 hover:underline cursor-pointer"
                    >
                      Réserver une table dès maintenant
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentReservations.map((res) => (
                      <div
                        key={res.id}
                        className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1">
                          <span className="font-bold text-slate-900 text-sm block">
                            {res.restaurant?.name || 'Restaurant'}
                          </span>
                          <div className="flex items-center gap-3 text-slate-500 font-medium flex-wrap">
                            <span>📅 {formatDateFr(res.reservation_date)}</span>
                            <span>⏰ {res.reservation_time.slice(0, 5)}</span>
                            <span>👥 {res.party_size} pers.</span>
                          </div>
                        </div>

                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold border shrink-0 ${
                            res.status === 'confirmed'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : res.status === 'pending'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          {res.status === 'confirmed'
                            ? 'Confirmée'
                            : res.status === 'pending'
                            ? 'En attente'
                            : res.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= VUE 2 : DÉCOUVRIR ================= */}
          {activeTab === 'discover' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                      <Store className="w-5 h-5 text-orange-600" />
                      {t.client.discover.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {t.client.discover.subtitle}
                    </p>
                  </div>

                  <button
                    onClick={() => loadActiveRestaurants(searchQuery)}
                    disabled={loadingRestaurants}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingRestaurants ? 'animate-spin' : ''}`} />
                    <span>Actualiser</span>
                  </button>
                </div>

                <RestaurantSearch value={searchQuery} onChange={setSearchQuery} />
              </div>

              {loadingRestaurants ? (
                <div className="py-12 bg-white rounded-2xl border border-slate-200/80 text-center space-y-3 shadow-xs">
                  <div className="w-8 h-8 border-3 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto" />
                  <p className="text-xs font-medium text-slate-500">Chargement des restaurants...</p>
                </div>
              ) : restaurants.length === 0 ? (
                <div className="py-12 bg-white rounded-2xl border border-slate-200/80 text-center space-y-3 p-6 shadow-xs">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                    <Store className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">
                    {searchQuery
                      ? t.client.discover.noSearchResults
                      : t.client.discover.noRestaurants}
                  </h4>
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

          {/* ================= VUE 3 : RESTAURANTS SUIVIS ================= */}
          {activeTab === 'followed' && (
            <FollowedRestaurantsList />
          )}

          {/* ================= VUE 4 : MES RÉSERVATIONS ================= */}
          {activeTab === 'reservations' && (
            <ClientReservationsList onOpenReservationModal={() => setIsModalOpen(true)} />
          )}

          {/* ================= VUE 5 : NOTIFICATIONS ================= */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <NotificationList />
              <PushSubscriptionToggle />
            </div>
          )}

          {/* ================= VUE 6 : MON PROFIL ================= */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-6 shadow-xs">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-orange-600" />
                  {t.client.profile.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {t.client.profile.subtitle}
                </p>
              </div>

              {profileSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{profileSuccess}</span>
                </div>
              )}

              {profileError && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{profileError}</span>
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-lg text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">
                    {t.client.profile.fullName}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-xs text-slate-900 font-semibold outline-hidden transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">
                    {t.client.profile.phone}
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+237 6XX XXX XXX"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-xs text-slate-900 font-semibold outline-hidden transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">
                    {t.client.profile.email}
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 font-medium text-xs cursor-not-allowed"
                  />
                  <span className="text-[10px] text-slate-400">
                    L'adresse email est associée à votre compte d'authentification Supabase.
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">
                    {t.client.profile.role}
                  </label>
                  <div className="px-3.5 py-2.5 rounded-xl border border-emerald-200 bg-emerald-50/60 text-emerald-800 font-extrabold text-xs flex items-center justify-between">
                    <span>{t.client.profile.roleClient}</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={updatingProfile}
                    className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {updatingProfile ? 'Enregistrement...' : t.client.profile.saveChanges}
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* Modal de réservation de table */}
      <ReservationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        restaurants={restaurants}
      />
    </div>
  )
}
