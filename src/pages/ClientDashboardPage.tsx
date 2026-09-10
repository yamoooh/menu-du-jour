import React, { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { SeoHead } from '@/components/public/SeoHead'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
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
import { ClientProfileSettings } from '@/components/client/ClientProfileSettings'
import { PwaInstallPromptModal } from '@/components/notification/PwaInstallPromptModal'
import {
  LayoutDashboard,
  Compass,
  Bookmark,
  CalendarCheck,
  Bell,
  User,
  LogOut,
  MapPin,
  Search,
  ArrowRight,
  ChevronRight,
  Clock,
  Users,
  Utensils,
  Star,
  Sparkles,
  Flame,
  ChefHat,
  Timer,
  Menu as MenuIcon,
  X,
  Navigation,
  FileText,
  Calendar
} from 'lucide-react'

export type ClientTab =
  | 'dashboard'
  | 'discover'
  | 'followed'
  | 'reservations'
  | 'notifications'
  | 'profile'

export const ClientDashboardPage: React.FC = () => {
  const { user, profile, signOut } = useAuth()
  const { language, setLanguage } = useLanguage()

  const [activeTab, setActiveTab] = useState<ClientTab>('dashboard')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loadingRestaurants, setLoadingRestaurants] = useState<boolean>(true)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedCity, setSelectedCity] = useState<string>('douala')
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  // Real Stats Counters
  const [followedCount, setFollowedCount] = useState<number>(0)
  const [reservationsCount, setReservationsCount] = useState<number>(0)
  const [unreadNotifsCount, setUnreadNotifsCount] = useState<number>(0)
  const [recentReservations, setRecentReservations] = useState<ReservationWithDetails[]>([])

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

  const navItems = [
    {
      id: 'dashboard' as ClientTab,
      label: 'Tableau de bord',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'discover' as ClientTab,
      label: 'Découvrir',
      icon: Compass,
      badge: restaurants.length > 0 ? restaurants.length : null,
    },
    {
      id: 'followed' as ClientTab,
      label: 'Restaurants suivis',
      icon: Bookmark,
      badge: followedCount > 0 ? followedCount : null,
    },
    {
      id: 'reservations' as ClientTab,
      label: 'Mes Réservations',
      icon: CalendarCheck,
      badge: reservationsCount > 0 ? reservationsCount : null,
    },
    {
      id: 'notifications' as ClientTab,
      label: 'Notifications',
      icon: Bell,
      badge: unreadNotifsCount > 0 ? unreadNotifsCount : null,
    },
    {
      id: 'profile' as ClientTab,
      label: 'Mon Profil',
      icon: User,
      badge: null,
    },
  ]

  // Formater date
  const formatDateFr = (dateStr: string) => {
    try {
      const date = new Date(dateStr + 'T00:00:00')
      return {
        day: date.toLocaleDateString('fr-FR', { day: '2-digit' }),
        month: date.toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase(),
        full: date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }),
      }
    } catch {
      return { day: '24', month: 'OCT', full: dateStr }
    }
  }

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setActiveTab('discover')
  }

  return (
    <div className="bg-background font-body-md text-body-md text-on-surface antialiased min-h-screen flex flex-col selection:bg-secondary-container selection:text-white">
      <SeoHead
        title="Espace Client — Tableau de bord | Menu du Jour"
        description="Espace personnel gourmet pour réserver des tables et suivre vos restaurants favoris."
        path="/espace-client"
        noindex={true}
      />
      <PwaInstallPromptModal />

      {/* ================= SIDEBAR DESKTOP (Stitch Specification) ================= */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-72 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex-col justify-between border-r border-slate-200/70">
        <div className="flex flex-col">
          {/* Logo Header */}
          <div className="h-16 px-4 flex items-center justify-between border-b border-slate-100">
            <Link to="/" className="flex items-center gap-3">
              <img
                src="https://lh3.googleusercontent.com/aida/AEtjO1UTt-dNa22cOeXEs7v8x9kOXhf2TxxgJonsL9_Oz5pDK6exz46Abxlmk4aUjK6aMeQRY1FFDioZKZP0kw7opI2le25btUY1uLfxKvHQhg4X3EZbh7VOEARmjDnC66zmZg0__BNzLHIi10bixPDXHyAl4D-Y0z1X_X3AFBpIazoPOEkhVVJID4rB4uYDKC48ourRAOOrQOhFzanyXMH7k66usylb-1s8WQxnS034eNhV2C6lvKgE5MQ3sDI"
                alt="Menu du Jour"
                className="h-8 w-auto object-contain"
              />
              <span className="font-headline-sm text-lg font-bold tracking-tight text-on-surface font-display">
                Menu du Jour
              </span>
            </Link>
          </div>

          {/* Role Badge */}
          <div className="px-4 py-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
              <span className="font-label-sm text-[11px] font-bold uppercase tracking-wider">
                Espace Client / Gourmet
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1 px-3 mt-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer text-left ${
                    isActive
                      ? 'bg-surface-container-high text-on-surface font-semibold shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-secondary-container' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== null && item.badge !== undefined && (
                    <span
                      className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                        item.id === 'notifications'
                          ? 'bg-secondary-container text-white'
                          : 'bg-surface-container text-on-surface-variant'
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

        {/* User Card & Logout Bottom */}
        <div className="p-4 flex flex-col gap-2 bg-surface-container-low/60 border-t border-slate-100">
          <div className="flex items-center gap-3 p-1 rounded-lg">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0 text-white font-bold text-sm">
              {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'C'}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-label-md text-xs font-bold text-on-surface truncate">
                {profile?.full_name || 'Client Gourmet'}
              </span>
              <span className="font-body-sm text-[11px] text-on-surface-variant truncate">
                {user?.email || 'client@domaine.cm'}
              </span>
            </div>
          </div>
          <button
            onClick={() => signOut()}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-error hover:bg-error-container hover:text-on-error-container transition-colors text-xs font-semibold cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* ================= MOBILE DRAWER ================= */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
          />
          <div className="relative flex-1 max-w-xs w-full bg-surface-container-lowest h-full shadow-2xl p-6 flex flex-col justify-between z-10">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <img
                    src="https://lh3.googleusercontent.com/aida/AEtjO1UTt-dNa22cOeXEs7v8x9kOXhf2TxxgJonsL9_Oz5pDK6exz46Abxlmk4aUjK6aMeQRY1FFDioZKZP0kw7opI2le25btUY1uLfxKvHQhg4X3EZbh7VOEARmjDnC66zmZg0__BNzLHIi10bixPDXHyAl4D-Y0z1X_X3AFBpIazoPOEkhVVJID4rB4uYDKC48ourRAOOrQOhFzanyXMH7k66usylb-1s8WQxnS034eNhV2C6lvKgE5MQ3sDI"
                    alt="Menu du Jour"
                    className="h-7 w-auto object-contain"
                  />
                  <span className="font-bold text-slate-900 text-sm">Menu du Jour</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-slate-500 hover:bg-slate-100"
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
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold cursor-pointer ${
                        isActive
                          ? 'bg-surface-container-high text-on-surface'
                          : 'text-on-surface-variant hover:bg-surface-container'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-secondary-container" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== null && item.badge !== undefined && (
                        <span className="px-2 py-0.5 text-[10px] rounded-full bg-secondary-container text-white font-bold">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  )
                })}
              </nav>
            </div>

            <button
              onClick={() => {
                signOut()
                setMobileMenuOpen(false)
              }}
              className="flex items-center gap-2 text-error text-xs font-bold pt-4 border-t border-slate-100"
            >
              <LogOut className="w-4 h-4" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      )}

      {/* ================= MAIN WRAPPER (Shifted by 72 on Desktop) ================= */}
      <div className="lg:pl-72 flex flex-col min-h-screen">
        {/* Top Header Bar */}
        <header className="sticky top-0 h-16 bg-surface-container-lowest/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 px-4 md:px-8 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-on-surface-variant"
            >
              <MenuIcon className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="font-label-sm text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
                Portail Convive
              </span>
              <span className="text-slate-300">•</span>
              <span className="font-data-mono text-xs text-secondary font-semibold">
                XAF Standard
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <div className="flex items-center bg-surface-container-high rounded-full p-0.5 text-on-surface text-xs">
              <button
                onClick={() => setLanguage('fr')}
                className={`px-2.5 py-1 rounded-full font-semibold transition-colors ${
                  language === 'fr' ? 'bg-surface-container-lowest text-on-surface shadow-xs' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                FR
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-full font-semibold transition-colors ${
                  language === 'en' ? 'bg-surface-container-lowest text-on-surface shadow-xs' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                EN
              </button>
            </div>

            {/* Notification Bell */}
            <button
              onClick={() => setActiveTab('notifications')}
              className="relative p-2 rounded-full hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifsCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-secondary-container rounded-full" />
              )}
            </button>

            <div className="h-6 w-px bg-slate-200 hidden sm:block" />

            {/* User Avatar */}
            <div
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'C'}
              </div>
              <span className="font-label-md text-xs font-semibold text-on-surface hidden md:inline-block">
                {profile?.full_name || 'Convive'}
              </span>
            </div>
          </div>
        </header>

        {/* Content Canvas */}
        <main className="flex-1 w-full bg-surface p-4 md:p-8 max-w-[1600px] mx-auto">
          {/* ================= TAB 1: DASHBOARD ================= */}
          {activeTab === 'dashboard' && (
            <div className="flex flex-col gap-8">
              {/* Hero Culinary Search Banner */}
              <div className="relative overflow-hidden rounded-2xl bg-primary-container text-on-primary shadow-xl p-6 md:p-10 flex flex-col justify-between min-h-[260px]">
                {/* Warm culinary glow */}
                <div className="absolute -right-16 -top-24 w-96 h-96 rounded-full bg-secondary-container opacity-20 blur-3xl pointer-events-none" />
                <div className="absolute right-1/3 -bottom-20 w-72 h-72 rounded-full bg-secondary opacity-15 blur-2xl pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md mb-4 text-xs">
                      <Utensils className="w-3.5 h-3.5 text-secondary-fixed" />
                      <span className="font-label-sm text-[11px] text-surface-variant uppercase tracking-wider font-semibold">
                        Service Midi & Soir • En direct
                      </span>
                    </div>
                    <h1 className="font-display-lg text-2xl md:text-3xl lg:text-4xl font-bold text-on-primary leading-tight tracking-tight font-display">
                      Bonjour {profile?.full_name ? profile.full_name.split(' ')[0] : 'Cher gourmet'}, que souhaitez-vous déguster aujourd'hui ?
                    </h1>
                    <p className="font-body-md text-sm text-slate-300 mt-2">
                      18 tables d'exception ont renouvelé leur ardoise ce matin à Douala et Yaoundé.
                    </p>
                  </div>

                  {/* Heure de pointe pill */}
                  <div className="flex items-center gap-4 shrink-0 bg-white/5 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10">
                    <div className="text-right">
                      <div className="font-label-sm text-[10px] text-slate-300 uppercase tracking-wider">Heure de pointe</div>
                      <div className="font-headline-sm text-sm text-white font-bold">12:30 - 14:00</div>
                    </div>
                    <div className="w-2.5 h-2.5 rounded-full bg-secondary-container animate-ping" />
                  </div>
                </div>

                {/* Live Search & City Selector Bar */}
                <form
                  onSubmit={handleHeroSearch}
                  className="relative z-10 mt-8 bg-surface-container-lowest text-on-surface rounded-xl shadow-md p-2 flex flex-col md:flex-row items-center gap-2"
                >
                  <div className="w-full md:w-56 flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-container-low/60 text-on-surface">
                    <MapPin className="text-secondary w-4 h-4 shrink-0" />
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full bg-transparent font-label-md text-xs text-on-surface focus:outline-none cursor-pointer font-medium"
                    >
                      <option value="douala">Douala (Littoral)</option>
                      <option value="yaounde">Yaoundé (Centre)</option>
                      <option value="kribi">Kribi (Océan)</option>
                      <option value="bafoussam">Bafoussam (Ouest)</option>
                    </select>
                  </div>

                  <div className="w-full flex-1 flex items-center gap-2 px-3 py-2">
                    <Search className="text-slate-400 w-4 h-4 shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Rechercher un plat, un chef, une formule midi ou une ambiance..."
                      className="w-full bg-transparent font-body-md text-xs text-on-surface placeholder:text-slate-400 focus:outline-none"
                    />
                  </div>

                  <div className="hidden lg:flex items-center gap-1.5 pr-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('Terrasse')
                        setActiveTab('discover')
                      }}
                      className="font-data-mono text-[11px] px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer"
                    >
                      Terrasse ombragée
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('Ndolé')
                        setActiveTab('discover')
                      }}
                      className="font-data-mono text-[11px] px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer"
                    >
                      Ndolé royal
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full md:w-auto px-6 py-2.5 rounded-lg bg-secondary-container hover:bg-orange-600 text-white font-label-lg text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <span>Trouver une table</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>

              {/* 4 Quick Summary KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {/* KPI 1: Upcoming Reservation */}
                <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col">
                      <span className="font-label-sm text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
                        Réservations à venir
                      </span>
                      <span className="font-headline-lg text-2xl font-bold text-on-surface mt-1">
                        {reservationsCount > 0 ? `${reservationsCount} table${reservationsCount > 1 ? 's' : ''}` : '0 table'}
                      </span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
                      <Calendar className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-4 pt-2 bg-surface-container-low/50 rounded-lg p-3">
                    {recentReservations.length > 0 ? (
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-secondary-container" />
                          <span className="font-label-md text-xs text-on-surface font-semibold truncate">
                            {recentReservations[0].restaurant?.name || 'Table réservée'}
                          </span>
                        </div>
                        <p className="font-body-sm text-[11px] text-on-surface-variant mt-1">
                          {formatDateFr(recentReservations[0].reservation_date).full} à {recentReservations[0].reservation_time.slice(0, 5)} • {recentReservations[0].party_size} couverts
                        </p>
                      </div>
                    ) : (
                      <p className="font-body-sm text-xs text-on-surface-variant">
                        Aucune réservation active ce soir
                      </p>
                    )}
                  </div>
                </div>

                {/* KPI 2: Followed Restaurants */}
                <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col">
                      <span className="font-label-sm text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
                        Restaurants suivis
                      </span>
                      <span className="font-headline-lg text-2xl font-bold text-on-surface mt-1">
                        {followedCount} favoris
                      </span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
                      <Bookmark className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-4 pt-2 bg-surface-container-low/50 rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-secondary font-semibold text-xs">
                      <Sparkles className="w-4 h-4" />
                      <span>2 nouveaux menus</span>
                    </div>
                    <span className="font-body-sm text-[11px] text-on-surface-variant">Publiés à 09h30</span>
                  </div>
                </div>

                {/* KPI 3: Alerts & Notifications */}
                <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col">
                      <span className="font-label-sm text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
                        Dernières alertes
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-headline-lg text-2xl font-bold text-on-surface">
                          {unreadNotifsCount}
                        </span>
                        <span className="font-label-sm text-[10px] px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-bold">
                          Non lues
                        </span>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
                      <Bell className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-4 pt-2 bg-surface-container-low/50 rounded-lg p-3">
                    <p className="font-body-sm text-xs text-on-surface truncate font-medium">
                      Notification de table en temps réel
                    </p>
                    <p className="font-label-sm text-[10px] text-on-surface-variant">
                      {unreadNotifsCount > 0 ? 'Mises à jour disponibles' : 'À jour'}
                    </p>
                  </div>
                </div>

                {/* KPI 4: Daily Gourmet Pick */}
                <div className="relative overflow-hidden bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col">
                      <span className="font-label-sm text-xs text-secondary uppercase tracking-wider font-bold">
                        Coup de cœur du jour
                      </span>
                      <span className="font-headline-sm text-base font-bold text-on-surface mt-1 truncate">
                        Menu Braisé Bonanjo
                      </span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary">
                      <Star className="w-5 h-5 fill-secondary" />
                    </div>
                  </div>
                  <div className="mt-4 pt-2 bg-surface-container-low/50 rounded-lg p-3 flex items-center justify-between">
                    <span className="font-data-mono text-xs text-on-surface font-bold">5 500 FCFA</span>
                    <button
                      onClick={() => setActiveTab('discover')}
                      className="font-label-sm text-xs text-secondary hover:underline cursor-pointer flex items-center gap-1 font-semibold"
                    >
                      <span>Voir l'ardoise</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Section: Mes Réservations Récentes & À Venir */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-secondary rounded-full" />
                    <h2 className="font-headline-md text-xl font-bold text-on-surface font-display">
                      Mes Réservations Récentes & À Venir
                    </h2>
                  </div>
                  <button
                    onClick={() => setActiveTab('reservations')}
                    className="font-label-md text-xs text-secondary hover:text-orange-700 flex items-center gap-1 transition-colors font-semibold cursor-pointer"
                  >
                    <span>Historique complet ({reservationsCount})</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {recentReservations.length > 0 ? (
                  <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col xl:flex-row xl:items-center justify-between gap-6 hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-center gap-6 min-w-0">
                      {/* Calendar date badge */}
                      <div className="w-16 h-20 shrink-0 rounded-lg bg-surface-container-high flex flex-col items-center justify-center text-center">
                        <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">
                          Date
                        </span>
                        <span className="font-display-lg text-2xl font-bold text-on-surface leading-none my-1 font-display">
                          {formatDateFr(recentReservations[0].reservation_date).day}
                        </span>
                        <span className="font-data-mono text-xs text-secondary font-bold">
                          {formatDateFr(recentReservations[0].reservation_date).month}
                        </span>
                      </div>

                      {/* Reservation Details */}
                      <div className="flex flex-col gap-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-headline-sm text-base font-bold text-on-surface">
                            {recentReservations[0].restaurant?.name || 'Restaurant Partenaire'}
                          </span>
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                            <span>
                              {recentReservations[0].status === 'confirmed' ? 'Confirmée' : recentReservations[0].status}
                            </span>
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-on-surface-variant font-body-sm text-xs mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {recentReservations[0].reservation_time.slice(0, 5)}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-slate-400" />
                            {recentReservations[0].party_size} convives
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {recentReservations[0].restaurant?.address || 'Douala / Yaoundé'}
                          </span>
                        </div>

                        {recentReservations[0].message && (
                          <p className="font-body-sm text-xs text-on-surface-variant italic mt-1">
                            Note : « {recentReservations[0].message} »
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 rounded-lg bg-surface-container-high hover:bg-surface-container text-on-surface font-label-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Navigation className="w-4 h-4" />
                        <span>Nouvelle réservation</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('reservations')}
                        className="px-4 py-2 rounded-lg bg-primary hover:bg-slate-800 text-white font-label-md text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                      >
                        <FileText className="w-4 h-4" />
                        <span>Gérer ma réservation</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-slate-100 p-8 text-center flex flex-col items-center justify-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-secondary">
                      <Utensils className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">Aucune réservation active pour le moment</h3>
                      <p className="text-xs text-slate-500 mt-1 max-w-md">
                        Découvrez les meilleures tables de Douala et Yaoundé et réservez votre couvert gratuitement en un clic.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="mt-2 px-5 py-2.5 rounded-xl bg-secondary-container hover:bg-orange-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Utensils className="w-4 h-4" />
                      <span>Réserver une table maintenant</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Section: Menus du Jour de vos Favoris (Stitch Showcase) */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-1">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-6 bg-secondary rounded-full" />
                      <h2 className="font-headline-md text-xl font-bold text-on-surface font-display">
                        Menus du Jour de vos Favoris
                      </h2>
                    </div>
                    <p className="font-body-md text-xs text-on-surface-variant mt-1">
                      Ardoises actualisées en direct par les chefs ce matin pour le service de midi et soir.
                    </p>
                  </div>
                  <span className="font-data-mono text-xs text-slate-400 font-medium">Actualisé il y a 22 min</span>
                </div>

                {/* 3-Column Card Grid with Google usercontent imagery */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Dish Card 1: Ndolé */}
                  <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-all flex flex-col group">
                    <div className="relative h-48 w-full overflow-hidden bg-surface-container-high">
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1no6M-BK-0EOai2Zse6tAiCEVQ-eC1ACXhEGlaS1I_4A5dqV5ToaD4548dcpdAJbs8X_JGK8w1xy--Iio9gW7NhPEro3_04TLreTtQzCnMlBpdfUrK8tlv1EhGIEKZQp8r-oZlX1zBPPJG2IPeUvEE80IRBejU6XdfcPuj7O6l_8JD3KUdj5OEl-Zy9OgZow-pDanzcgJd-x0U93gvOA-n0k8nhZ18p_4t9D96FOIeN8c8EiOEe5C"
                        alt="Ndolé Royal aux Gambas Sauvages"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-primary/80 backdrop-blur-md text-white px-2.5 py-1 rounded text-[10px] font-semibold uppercase tracking-wider">
                        Spécialité du Marché
                      </div>
                      <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded font-data-mono text-xs font-bold text-secondary shadow-sm">
                        6 500 FCFA
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-label-sm text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold">
                            La Villa Mandessi • Bonapriso
                          </span>
                          <div className="flex items-center gap-1 text-secondary text-xs font-bold">
                            <Star className="w-3.5 h-3.5 fill-secondary" />
                            <span>4.9</span>
                          </div>
                        </div>
                        <h3 className="font-headline-sm text-base font-bold text-on-surface mt-1">
                          Ndolé Royal aux Gambas Sauvages
                        </h3>
                        <p className="font-body-sm text-xs text-on-surface-variant mt-1.5 line-clamp-2">
                          Feuilles de vernonia fraîches pilées, arachides de Foumbot, gambas tigrées saisies au piment doux et morceaux de queue de bœuf braisée. Servi avec miondo tiède.
                        </p>
                      </div>
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-on-surface-variant font-label-sm text-[11px]">
                          <span className="w-2 h-2 rounded-full bg-emerald-600" />
                          <span>Disponible (14 portions)</span>
                        </div>
                        <button
                          onClick={() => setActiveTab('discover')}
                          className="px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-secondary hover:text-white text-on-surface font-label-md text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <span>Consulter</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Dish Card 2: Carpaccio */}
                  <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-all flex flex-col group">
                    <div className="relative h-48 w-full overflow-hidden bg-surface-container-high">
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWYDgEZB-IS__192XDeZ-iSXTZuW3Dv-nAGSh52umhsUAQMZnr-njWizXHTD9i1qA2j3D9FzvkPgxdEu8NREX6sbCzVBa2gzkZaaw_M6vOohBTYaluP8ExCq197PHFiKp1ONZaR86XLe7SVR20NpfVEEJ-pATwgxjs5rLfzjWZa9ZqEZhFuS9EE-fEd9nBAN5UtTdYWWTxJhcyJLjdJrybIJhjHmI-e4in4G1505-jCV4E23nRGvIC"
                        alt="Carpaccio de Capitaine au Poivre de Penja"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-primary/80 backdrop-blur-md text-white px-2.5 py-1 rounded text-[10px] font-semibold uppercase tracking-wider">
                        Entrée Fraîcheur
                      </div>
                      <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded font-data-mono text-xs font-bold text-secondary shadow-sm">
                        4 500 FCFA
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-label-sm text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold">
                            Le Grilladin Urbain • Akwa
                          </span>
                          <div className="flex items-center gap-1 text-secondary text-xs font-bold">
                            <Star className="w-3.5 h-3.5 fill-secondary" />
                            <span>4.8</span>
                          </div>
                        </div>
                        <h3 className="font-headline-sm text-base font-bold text-on-surface mt-1">
                          Carpaccio de Capitaine au Poivre de Penja
                        </h3>
                        <p className="font-body-sm text-xs text-on-surface-variant mt-1.5 line-clamp-2">
                          Pêche du jour de la Sanaga, émulsion d'agrumes de Nyombé, fleur de sel, baies roses et éclats de mangue verte saumurée.
                        </p>
                      </div>
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-on-surface-variant font-label-sm text-[11px]">
                          <span className="w-2 h-2 rounded-full bg-emerald-600" />
                          <span>Pour le déjeuner</span>
                        </div>
                        <button
                          onClick={() => setActiveTab('discover')}
                          className="px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-secondary hover:text-white text-on-surface font-label-md text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <span>Consulter</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Dish Card 3: Mérou */}
                  <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-all flex flex-col group">
                    <div className="relative h-48 w-full overflow-hidden bg-surface-container-high">
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuYM7AVShJkq4vGIpyfS3A_yLtV-alhdW9pU2kffUfEglMvmCZGTMOUg57iDLvQTROKcYFNYRYTSdjMc4nGamXMbNq0FvLbkuQUIkzmYGmRhKXN5O1bPlSGHVDu3cOCgg_gh86CYAY-e-sBbEy5h5kN8WqhNbvr_iN11hUDAHd0xoxTCc7M9eTwO_CZQbkYDJymy222_1aEgkHm2pnUgjHqjSfpLNdwCK34VlAFTQYyP40-UlqXpa8"
                        alt="Mérou Braisé aux Aromates"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-secondary-container text-white px-2.5 py-1 rounded text-[10px] font-semibold uppercase tracking-wider">
                        Formule Express Midi
                      </div>
                      <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded font-data-mono text-xs font-bold text-secondary shadow-sm">
                        7 000 FCFA
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-label-sm text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold">
                            L'Oasis Tropicale • Bastos
                          </span>
                          <div className="flex items-center gap-1 text-secondary text-xs font-bold">
                            <Star className="w-3.5 h-3.5 fill-secondary" />
                            <span>4.7</span>
                          </div>
                        </div>
                        <h3 className="font-headline-sm text-base font-bold text-on-surface mt-1">
                          Mérou Braisé aux Aromates
                        </h3>
                        <p className="font-body-sm text-xs text-on-surface-variant mt-1.5 line-clamp-2">
                          Tranche épaisse de mérou fumé minute aux copeaux de manguier, sauce vierge au njansan torréfié, écrasé de macabo au beurre noisette.
                        </p>
                      </div>
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-on-surface-variant font-label-sm text-[11px]">
                          <span className="w-2 h-2 rounded-full bg-emerald-600" />
                          <span>Entrée + Plat + Café</span>
                        </div>
                        <button
                          onClick={() => setActiveTab('discover')}
                          className="px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-secondary hover:text-white text-on-surface font-label-md text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <span>Consulter</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section: Explorer par Métropole & Envie Culinaire (Bento Grid) */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-6 bg-secondary rounded-full" />
                  <h2 className="font-headline-md text-xl font-bold text-on-surface font-display">
                    Explorer par Métropole & Envie Culinaire
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Card 1: Cuisine d'Auteur */}
                  <div
                    onClick={() => {
                      setSearchQuery("Cuisine d'Auteur")
                      setActiveTab('discover')
                    }}
                    className="group p-5 rounded-xl bg-surface-container-lowest shadow-sm border border-slate-100 hover:shadow-md transition-all flex flex-col justify-between cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="w-11 h-11 rounded-lg bg-surface-container-high flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                        <ChefHat className="w-5 h-5" />
                      </div>
                      <span className="font-label-sm text-[11px] text-on-surface-variant">12 Tables</span>
                    </div>
                    <div className="mt-4">
                      <h3 className="font-headline-sm text-sm font-bold text-on-surface group-hover:text-secondary transition-colors">
                        Cuisine d'Auteur
                      </h3>
                      <p className="font-body-sm text-[11px] text-on-surface-variant mt-1 leading-relaxed">
                        Chefs étoilés, accords mets & vins, réinventions contemporaines.
                      </p>
                    </div>
                    <div className="mt-4 flex items-center gap-1 text-secondary font-label-md text-xs font-bold">
                      <span>Découvrir</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Card 2: Grillades & Braises */}
                  <div
                    onClick={() => {
                      setSearchQuery('Grillades')
                      setActiveTab('discover')
                    }}
                    className="group p-5 rounded-xl bg-surface-container-lowest shadow-sm border border-slate-100 hover:shadow-md transition-all flex flex-col justify-between cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="w-11 h-11 rounded-lg bg-surface-container-high flex items-center justify-center text-primary group-hover:bg-secondary-container group-hover:text-white transition-colors">
                        <Flame className="w-5 h-5" />
                      </div>
                      <span className="font-label-sm text-[11px] text-on-surface-variant">28 Tables</span>
                    </div>
                    <div className="mt-4">
                      <h3 className="font-headline-sm text-sm font-bold text-on-surface group-hover:text-secondary transition-colors">
                        Grillades & Braises
                      </h3>
                      <p className="font-body-sm text-[11px] text-on-surface-variant mt-1 leading-relaxed">
                        Barbecue camerounais, poissons entiers braisés, viande maturée.
                      </p>
                    </div>
                    <div className="mt-4 flex items-center gap-1 text-secondary font-label-md text-xs font-bold">
                      <span>Découvrir</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Card 3: Spécialités Locales */}
                  <div
                    onClick={() => {
                      setSearchQuery('Traditionnel')
                      setActiveTab('discover')
                    }}
                    className="group p-5 rounded-xl bg-surface-container-lowest shadow-sm border border-slate-100 hover:shadow-md transition-all flex flex-col justify-between cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="w-11 h-11 rounded-lg bg-surface-container-high flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                        <Utensils className="w-5 h-5" />
                      </div>
                      <span className="font-label-sm text-[11px] text-on-surface-variant">34 Tables</span>
                    </div>
                    <div className="mt-4">
                      <h3 className="font-headline-sm text-sm font-bold text-on-surface group-hover:text-secondary transition-colors">
                        Spécialités Locales
                      </h3>
                      <p className="font-body-sm text-[11px] text-on-surface-variant mt-1 leading-relaxed">
                        Taro sauce jaune, Eru, Mbongo Tchobi, Koki authentique.
                      </p>
                    </div>
                    <div className="mt-4 flex items-center gap-1 text-secondary font-label-md text-xs font-bold">
                      <span>Découvrir</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Card 4: Formules Midi Express */}
                  <div
                    onClick={() => {
                      setSearchQuery('Midi')
                      setActiveTab('discover')
                    }}
                    className="group p-5 rounded-xl bg-surface-container-lowest shadow-sm border border-slate-100 hover:shadow-md transition-all flex flex-col justify-between cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="w-11 h-11 rounded-lg bg-surface-container-high flex items-center justify-center text-primary group-hover:bg-secondary-container group-hover:text-white transition-colors">
                        <Timer className="w-5 h-5" />
                      </div>
                      <span className="font-label-sm text-[11px] text-on-surface-variant">Dès 3 500 FCFA</span>
                    </div>
                    <div className="mt-4">
                      <h3 className="font-headline-sm text-sm font-bold text-on-surface group-hover:text-secondary transition-colors">
                        Formules Midi Business
                      </h3>
                      <p className="font-body-sm text-[11px] text-on-surface-variant mt-1 leading-relaxed">
                        Service garanti en 45 minutes pour vos déjeuners professionnels.
                      </p>
                    </div>
                    <div className="mt-4 flex items-center gap-1 text-secondary font-label-md text-xs font-bold">
                      <span>Découvrir</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>

                {/* Quick Location Pill Navigation */}
                <div className="p-4 bg-surface-container-lowest rounded-xl border border-slate-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-on-surface-variant text-xs">
                    <Compass className="w-4 h-4 text-secondary" />
                    <span className="font-label-md font-bold text-on-surface">Métropoles actives :</span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {['Douala', 'Yaoundé', 'Kribi', 'Bafoussam', 'Garoua', 'Limbe'].map((city) => (
                      <button
                        key={city}
                        onClick={() => {
                          setSelectedCity(city.toLowerCase())
                          setSearchQuery(city)
                          setActiveTab('discover')
                        }}
                        className="px-3 py-1 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant text-xs font-medium transition-colors cursor-pointer"
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 2: DÉCOUVRIR ================= */}
          {activeTab === 'discover' && (
            <div className="space-y-6">
              <div className="bg-surface-container-lowest rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2 font-display">
                      <Compass className="w-5 h-5 text-secondary" />
                      Explorer les Restaurants & Menus du Jour
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Retrouvez les meilleures ardoises du midi et du soir géolocalisées au Cameroun.
                    </p>
                  </div>
                </div>
                <RestaurantSearch value={searchQuery} onChange={setSearchQuery} />
              </div>

              {loadingRestaurants ? (
                <div className="py-12 bg-surface-container-lowest rounded-2xl border border-slate-100 text-center space-y-3 shadow-xs">
                  <div className="w-8 h-8 border-3 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto" />
                  <p className="text-xs font-medium text-slate-500">Chargement des tables gourmandes...</p>
                </div>
              ) : restaurants.length === 0 ? (
                <div className="py-12 bg-surface-container-lowest rounded-2xl border border-slate-100 text-center space-y-3 p-6 shadow-xs">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                    <Utensils className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">
                    {searchQuery ? `Aucun établissement ne correspond à "${searchQuery}"` : 'Aucun restaurant actif pour le moment.'}
                  </h4>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {restaurants.map((r) => (
                    <RestaurantCard key={r.id} restaurant={r} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 3: RESTAURANTS SUIVIS ================= */}
          {activeTab === 'followed' && <FollowedRestaurantsList />}

          {/* ================= TAB 4: MES RÉSERVATIONS ================= */}
          {activeTab === 'reservations' && (
            <ClientReservationsList onOpenReservationModal={() => setIsModalOpen(true)} />
          )}

          {/* ================= TAB 5: NOTIFICATIONS ================= */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <NotificationList />
              <PushSubscriptionToggle />
            </div>
          )}

          {/* ================= TAB 6: MON PROFIL ================= */}
          {activeTab === 'profile' && <ClientProfileSettings />}
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
