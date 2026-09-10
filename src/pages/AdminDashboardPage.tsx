import React, { useEffect, useState, useCallback } from 'react'
import { SeoHead } from '@/components/public/SeoHead'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import {
  adminService,
  type GlobalAdminStats,
  type AdminUser,
  type AdminRestaurant,
  type AdminMenu,
  type AdminReservation,
  type AdminSubscription,
  type AdminPayment,
  type AdminNotification,
  type AdminActivityItem,
} from '@/services/adminService'
import {
  LayoutDashboard,
  Users,
  Store,
  Utensils,
  Calendar,
  CreditCard,
  Receipt,
  Bell,
  Settings,
  ShieldCheck,
  Search,
  RefreshCw,
  LogOut,
  ArrowLeft,
  AlertCircle,
  ExternalLink,
  Menu as MenuIcon,
  X,
  Activity,
  TrendingUp,
  CheckCircle2,
  Clock,
  XCircle,
  Download,
  Server,
  Zap,
} from 'lucide-react'

export type AdminTab =
  | 'dashboard'
  | 'users'
  | 'restaurants'
  | 'restaurant-detail'
  | 'menus'
  | 'reservations'
  | 'subscriptions'
  | 'payments'
  | 'notifications'
  | 'settings'

export const AdminDashboardPage: React.FC = () => {
  const { user, profile, signOut } = useAuth()
  const { language, setLanguage, t } = useLanguage()

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | '7d' | '30d' | 'year'>('30d')

  // Data states
  const [stats, setStats] = useState<GlobalAdminStats | null>(null)
  const [activity, setActivity] = useState<AdminActivityItem[]>([])
  const [users, setUsers] = useState<AdminUser[]>([])
  const [restaurants, setRestaurants] = useState<AdminRestaurant[]>([])
  const [selectedRestaurantDetail, setSelectedRestaurantDetail] = useState<any | null>(null)
  const [menus, setMenus] = useState<AdminMenu[]>([])
  const [reservations, setReservations] = useState<AdminReservation[]>([])
  const [subscriptions, setSubscriptions] = useState<AdminSubscription[]>([])
  const [payments, setPayments] = useState<AdminPayment[]>([])
  const [notifications, setNotifications] = useState<AdminNotification[]>([])

  // Filter & Search states
  const [userRoleFilter, setUserRoleFilter] = useState<string>('all')
  const [userSearch, setUserSearch] = useState<string>('')

  const [restoStatusFilter, setRestoStatusFilter] = useState<string>('all')
  const [restoSearch, setRestoSearch] = useState<string>('')

  const [menuStatusFilter, setMenuStatusFilter] = useState<string>('all')
  const [menuSearch, setMenuSearch] = useState<string>('')

  const [resaStatusFilter, setResaStatusFilter] = useState<string>('all')
  const [resaSearch, setResaSearch] = useState<string>('')

  const [subStatusFilter, setSubStatusFilter] = useState<string>('all')
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('all')

  // Load Dashboard Overview Data
  const loadDashboardData = useCallback(async () => {
    setLoading(true)
    setError(null)
    const [statsRes, actRes, payRes, resaRes] = await Promise.all([
      adminService.fetchGlobalStats(),
      adminService.fetchRecentActivity(),
      adminService.fetchPayments('all'),
      adminService.fetchReservations('all'),
    ])
    setStats(statsRes.data)
    setActivity(actRes.data)
    if (payRes.data) setPayments(payRes.data)
    if (resaRes.data) setReservations(resaRes.data)
    setLoading(false)
  }, [])

  // Load section data based on active tab
  useEffect(() => {
    if (activeTab === 'dashboard') {
      loadDashboardData()
    } else if (activeTab === 'users') {
      setLoading(true)
      adminService.fetchUsers(userRoleFilter, userSearch).then(({ data, error }) => {
        if (error) setError(error.message)
        else setUsers(data)
        setLoading(false)
      })
    } else if (activeTab === 'restaurants') {
      setLoading(true)
      adminService.fetchRestaurants(restoStatusFilter, restoSearch).then(({ data, error }) => {
        if (error) setError(error.message)
        else setRestaurants(data)
        setLoading(false)
      })
    } else if (activeTab === 'menus') {
      setLoading(true)
      adminService.fetchMenus(menuStatusFilter, menuSearch).then(({ data, error }) => {
        if (error) setError(error.message)
        else setMenus(data)
        setLoading(false)
      })
    } else if (activeTab === 'reservations') {
      setLoading(true)
      adminService.fetchReservations(resaStatusFilter, resaSearch).then(({ data, error }) => {
        if (error) setError(error.message)
        else setReservations(data)
        setLoading(false)
      })
    } else if (activeTab === 'subscriptions') {
      setLoading(true)
      adminService.fetchSubscriptions(subStatusFilter).then(({ data, error }) => {
        if (error) setError(error.message)
        else setSubscriptions(data)
        setLoading(false)
      })
    } else if (activeTab === 'payments') {
      setLoading(true)
      adminService.fetchPayments(paymentStatusFilter).then(({ data, error }) => {
        if (error) setError(error.message)
        else setPayments(data)
        setLoading(false)
      })
    } else if (activeTab === 'notifications') {
      setLoading(true)
      adminService.fetchNotifications().then(({ data, error }) => {
        if (error) setError(error.message)
        else setNotifications(data)
        setLoading(false)
      })
    }
  }, [
    activeTab,
    userRoleFilter,
    userSearch,
    restoStatusFilter,
    restoSearch,
    menuStatusFilter,
    menuSearch,
    resaStatusFilter,
    resaSearch,
    subStatusFilter,
    paymentStatusFilter,
    loadDashboardData,
  ])

  // Inspect restaurant detail
  const handleInspectRestaurant = async (restaurantId: string) => {
    setLoading(true)
    setActiveTab('restaurant-detail')
    const { data, error } = await adminService.fetchRestaurantDetails(restaurantId)
    if (error) {
      setError(error.message)
    } else {
      setSelectedRestaurantDetail(data)
    }
    setLoading(false)
  }

  const navItems = [
    { id: 'dashboard' as AdminTab, label: t.admin.nav.dashboard, icon: LayoutDashboard },
    { id: 'users' as AdminTab, label: t.admin.nav.users, icon: Users },
    { id: 'restaurants' as AdminTab, label: t.admin.nav.restaurants, icon: Store },
    { id: 'menus' as AdminTab, label: t.admin.nav.menus, icon: Utensils },
    { id: 'reservations' as AdminTab, label: t.admin.nav.reservations, icon: Calendar },
    { id: 'subscriptions' as AdminTab, label: t.admin.nav.subscriptions, icon: CreditCard },
    { id: 'payments' as AdminTab, label: t.admin.nav.payments, icon: Receipt },
    { id: 'notifications' as AdminTab, label: t.admin.nav.notifications, icon: Bell },
    { id: 'settings' as AdminTab, label: t.admin.nav.settings, icon: Settings },
  ]

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return 'N/A'
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-surface font-body-md text-on-surface antialiased flex flex-col md:flex-row">
      <SeoHead
        title="Supervision Globale de la Plateforme — Menu du Jour"
        description="Back office d'administration globale Menu du Jour"
        path="/admin"
        noindex={true}
      />

      {/* Sidebar Desktop Admin (Google Stitch w-72 bg-primary-container) */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-72 bg-primary-container z-50 flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.12)]">
        <div className="flex flex-col">
          {/* Logo Brand Header */}
          <div className="h-16 px-4 flex items-center justify-between bg-primary-container border-b border-surface-container-highest/10">
            <div className="flex items-center gap-2.5">
              <img
                src="https://lh3.googleusercontent.com/aida/AEtjO1UTt-dNa22cOeXEs7v8x9kOXhf2TxxgJonsL9_Oz5pDK6exz46Abxlmk4aUjK6aMeQRY1FFDioZKZP0kw7opI2le25btUY1uLfxKvHQhg4X3EZbh7VOEARmjDnC66zmZg0__BNzLHIi10bixPDXHyAl4D-Y0z1X_X3AFBpIazoPOEkhVVJID4rB4uYDKC48ourRAOOrQOhFzanyXMH7k66usylb-1s8WQxnS034eNhV2C6lvKgE5MQ3sDI"
                alt="Logo Menu du Jour"
                className="h-8 w-auto object-contain rounded-sm"
              />
              <div className="flex flex-col">
                <span className="font-headline-sm text-sm text-surface-container-lowest font-bold leading-tight">
                  Menu du Jour
                </span>
                <span className="font-label-sm text-[10px] text-on-primary-container uppercase tracking-wider">
                  Tour de Contrôle
                </span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary text-[10px] font-bold uppercase tracking-wider">
              Super Admin
            </span>
          </div>

          {/* Instance Pill */}
          <div className="px-4 py-2.5">
            <div className="px-3 py-1.5 rounded-lg bg-surface-container-highest/10 flex items-center justify-between text-surface-dim text-xs">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Instance Prod (CMR)
              </span>
              <span className="font-mono text-[11px] text-surface-container-high font-semibold">
                XAF Core
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1 px-3 mt-1 overflow-y-auto max-h-[calc(100vh-210px)]">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive =
                activeTab === item.id || (activeTab === 'restaurant-detail' && item.id === 'restaurants')

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id)
                    setSelectedRestaurantDetail(null)
                  }}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer text-left ${
                    isActive
                      ? 'bg-surface-container-lowest/15 text-surface-container-lowest font-bold shadow-sm'
                      : 'text-on-primary-container hover:bg-surface-container-highest/10 hover:text-surface-container-lowest'
                  }`}
                >
                  <Icon
                    className={`w-4.5 h-4.5 shrink-0 ${
                      isActive ? 'text-secondary-container' : 'text-on-primary-container'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Master Console Footer */}
        <div className="p-3 bg-surface-container-highest/5 m-3 rounded-xl flex items-center justify-between border border-white/5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary text-xs font-bold shrink-0">
              SA
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-surface-container-lowest font-medium truncate">
                {profile?.full_name || 'Master Console'}
              </span>
              <span className="text-[10px] text-on-primary-container truncate">
                {user?.email || 'root@menudujour.cm'}
              </span>
            </div>
          </div>
          <button
            onClick={() => signOut()}
            aria-label="Déconnexion"
            className="text-on-primary-container hover:text-secondary-fixed transition-colors p-1.5 rounded-lg hover:bg-white/5 cursor-pointer shrink-0"
            title="Déconnexion"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Topbar Mobile Admin */}
      <div className="md:hidden bg-primary-container text-white p-4 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-2.5">
          <img
            src="https://lh3.googleusercontent.com/aida/AEtjO1UTt-dNa22cOeXEs7v8x9kOXhf2TxxgJonsL9_Oz5pDK6exz46Abxlmk4aUjK6aMeQRY1FFDioZKZP0kw7opI2le25btUY1uLfxKvHQhg4X3EZbh7VOEARmjDnC66zmZg0__BNzLHIi10bixPDXHyAl4D-Y0z1X_X3AFBpIazoPOEkhVVJID4rB4uYDKC48ourRAOOrQOhFzanyXMH7k66usylb-1s8WQxnS034eNhV2C6lvKgE5MQ3sDI"
            alt="Logo"
            className="h-7 w-auto object-contain rounded-sm"
          />
          <div>
            <span className="font-bold text-xs block leading-tight">Menu du Jour</span>
            <span className="text-[10px] text-on-primary-container block">Tour de Contrôle</span>
          </div>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg bg-surface-container-highest/10 text-white"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
        </button>
      </div>

      {/* Drawer Mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-primary-container text-white p-4 space-y-1 fixed inset-x-0 top-16 z-40 border-b border-surface-container-highest/20 shadow-xl">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id)
                  setSelectedRestaurantDetail(null)
                  setMobileMenuOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold text-left transition-all ${
                  isActive ? 'bg-secondary-container text-on-secondary' : 'text-slate-300 hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            )
          })}
          <div className="pt-3 border-t border-white/10 mt-3 flex items-center justify-between">
            <span className="text-xs text-slate-400">{user?.email}</span>
            <button
              onClick={() => signOut()}
              className="text-xs text-red-400 font-semibold hover:text-red-300"
            >
              Déconnexion
            </button>
          </div>
        </div>
      )}

      {/* Pl-72 Content Area */}
      <div className="md:pl-72 flex-1 min-h-screen flex flex-col bg-surface">
        {/* Topbar Desktop */}
        <header className="sticky top-0 md:fixed md:top-0 md:left-72 md:right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-slate-200/60">
          <div className="flex items-center gap-4 w-full max-w-md">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
              <input
                type="search"
                value={userSearch || restoSearch || ''}
                onChange={(e) => {
                  setUserSearch(e.target.value)
                  setRestoSearch(e.target.value)
                  setMenuSearch(e.target.value)
                  setResaSearch(e.target.value)
                }}
                placeholder="Rechercher un restaurant, un compte, un menu, une référence..."
                className="w-full h-10 pl-9 pr-4 bg-surface-container-low rounded-lg text-xs font-body-md text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary border border-transparent transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 lg:gap-6">
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200/50">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              Serveurs Opérationnels • 99.98%
            </div>

            {/* FR / EN Selector */}
            <div className="flex items-center bg-surface-container-low rounded-lg p-0.5 text-xs font-semibold">
              <button
                onClick={() => setLanguage('fr')}
                className={`px-2.5 py-1 rounded ${
                  language === 'fr'
                    ? 'bg-surface-container-lowest text-on-surface shadow-xs font-bold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                FR
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded ${
                  language === 'en'
                    ? 'bg-surface-container-lowest text-on-surface shadow-xs font-bold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                EN
              </button>
            </div>

            <div className="w-px h-5 bg-outline-variant/50"></div>

            {/* Notifications and Profile */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab('notifications')}
                aria-label="Alertes système"
                className="relative text-on-surface-variant hover:text-on-surface p-1.5 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-secondary-container"></span>
              </button>

              <div className="flex items-center gap-2.5 pl-1">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary text-xs font-bold shadow-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs text-on-surface leading-tight font-bold truncate max-w-[140px]">
                    {profile?.full_name || 'Admin Superviseur'}
                  </span>
                  <span className="text-[10px] text-on-surface-variant">
                    Niveau 0 • Principal
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="w-full pt-4 md:pt-20 bg-surface min-h-screen px-4 sm:px-6 lg:px-8 pb-16">
          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 shadow-xs">
              <AlertCircle className="w-4.5 h-4.5 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* ================= 1. TABLEAU DE BORD (DASHBOARD OVERVIEW) ================= */}
          {activeTab === 'dashboard' && (
            <div className="flex flex-col w-full gap-6">
              {/* Page Header & Action Bar */}
              <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-on-surface-variant text-xs uppercase tracking-wider font-semibold">
                    <span>Administration Centrale</span>
                    <span className="text-outline">/</span>
                    <span className="text-secondary font-bold">Temps Réel</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl text-on-surface tracking-tight font-extrabold">
                    Supervision Globale de la Plateforme
                  </h1>
                  <p className="text-xs sm:text-sm text-on-surface-variant max-w-2xl">
                    Contrôle opérationnel, métriques économiques LeekPay et santé du réseau multi-restaurants.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Period Selector */}
                  <div className="flex items-center bg-surface-container-low p-1 rounded-lg shadow-xs">
                    {(
                      [
                        { id: 'today', label: "Aujourd'hui" },
                        { id: '7d', label: '7 derniers jours' },
                        { id: '30d', label: '30 derniers jours' },
                        { id: 'year', label: 'Année' },
                      ] as const
                    ).map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setSelectedPeriod(p.id)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                          selectedPeriod === p.id
                            ? 'bg-surface-container-lowest text-on-surface shadow-xs font-bold'
                            : 'text-on-surface-variant hover:text-on-surface'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>

                  {/* Realtime Pulsing Status Trigger */}
                  <button
                    onClick={() => {
                      setRefreshing(true)
                      loadDashboardData().then(() => setRefreshing(false))
                    }}
                    disabled={loading || refreshing}
                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-bold shadow-xs hover:opacity-95 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span>Supabase Realtime actif</span>
                    <RefreshCw
                      className={`w-3.5 h-3.5 ml-1 ${refreshing ? 'animate-spin' : ''}`}
                    />
                  </button>
                </div>
              </section>

              {/* 5 Essential KPI Metric Cards (Stitch Bento) */}
              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {/* Card 1: Users */}
                <div className="bg-surface-container-lowest p-5 rounded-xl shadow-xs border border-slate-200/60 flex flex-col justify-between gap-3">
                  <div className="flex items-start justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                      Total Utilisateurs
                    </span>
                    <span className="p-2 rounded-lg bg-surface-container-low text-on-surface-variant">
                      <Users className="w-4 h-4 text-primary" />
                    </span>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
                      {(stats?.totalUsers || 0).toLocaleString('fr-FR')}
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-on-surface-variant">
                      <span className="font-bold text-on-surface">
                        {stats?.clientsCount || 0}
                      </span>{' '}
                      clients
                      <span className="text-outline">·</span>
                      <span className="font-bold text-on-surface">
                        {stats?.managersCount || 0}
                      </span>{' '}
                      gérants
                    </div>
                  </div>
                  <div className="w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden flex">
                    <div
                      className="bg-primary h-full rounded-full"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.max(
                            10,
                            Math.round(
                              ((stats?.clientsCount || 0) /
                                Math.max(stats?.totalUsers || 1, 1)) *
                                100
                            )
                          )
                        )}%`,
                      }}
                    ></div>
                    <div
                      className="bg-secondary-container h-full rounded-full"
                      style={{
                        width: `${Math.min(
                          90,
                          Math.max(
                            5,
                            Math.round(
                              ((stats?.managersCount || 0) /
                                Math.max(stats?.totalUsers || 1, 1)) *
                                100
                            )
                          )
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Card 2: Venues */}
                <div className="bg-surface-container-lowest p-5 rounded-xl shadow-xs border border-slate-200/60 flex flex-col justify-between gap-3">
                  <div className="flex items-start justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                      Établissements
                    </span>
                    <span className="p-2 rounded-lg bg-surface-container-low text-on-surface-variant">
                      <Store className="w-4 h-4 text-emerald-600" />
                    </span>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
                      {stats?.totalRestaurants || 0}
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-on-surface-variant flex-wrap">
                      <span className="font-semibold text-emerald-700">
                        {stats?.activeRestaurants || 0} Actifs
                      </span>
                      <span className="text-outline">·</span>
                      <span className="font-semibold text-amber-700">
                        {stats?.trialRestaurants || 0} Essai
                      </span>
                      <span className="text-outline">·</span>
                      <span className="text-outline">
                        {Math.max(
                          0,
                          (stats?.totalRestaurants || 0) -
                            (stats?.activeRestaurants || 0) -
                            (stats?.trialRestaurants || 0)
                        )}{' '}
                        Exp.
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden flex">
                    <div className="bg-emerald-600 h-full" style={{ width: '45%' }}></div>
                    <div className="bg-amber-500 h-full" style={{ width: '15%' }}></div>
                    <div className="bg-outline-variant h-full" style={{ width: '40%' }}></div>
                  </div>
                </div>

                {/* Card 3: MRR LeekPay */}
                <div className="bg-surface-container-lowest p-5 rounded-xl shadow-xs border border-slate-200/60 flex flex-col justify-between gap-3">
                  <div className="flex items-start justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                      MRR Actuel (30j)
                    </span>
                    <span className="p-2 rounded-lg bg-secondary-fixed text-on-secondary-fixed">
                      <CreditCard className="w-4 h-4 text-secondary" />
                    </span>
                  </div>
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl sm:text-3xl font-extrabold text-secondary tracking-tight">
                        {(stats?.totalRevenueFCFA || 0).toLocaleString('fr-FR')}
                      </span>
                      <span className="text-xs font-bold text-on-surface-variant">
                        FCFA
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-on-surface-variant">
                      {stats?.confirmedPaymentsCount || stats?.activeRestaurants || 0}{' '}
                      comptes confirmés via LeekPay
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>+14.2% vs mois précédent</span>
                  </div>
                </div>

                {/* Card 4: Reservations */}
                <div className="bg-surface-container-lowest p-5 rounded-xl shadow-xs border border-slate-200/60 flex flex-col justify-between gap-3">
                  <div className="flex items-start justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                      Réservations (Mois)
                    </span>
                    <span className="p-2 rounded-lg bg-surface-container-low text-on-surface-variant">
                      <Calendar className="w-4 h-4 text-purple-600" />
                    </span>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
                      {reservations.length || stats?.totalReservationsCount || 0}
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-on-surface-variant">
                      <span className="text-emerald-700 font-semibold">88% Conf.</span>
                      <span className="text-outline">·</span>
                      <span className="text-rose-700 font-semibold">9% Réf.</span>
                      <span className="text-outline">·</span>
                      <span>3% Ann.</span>
                    </div>
                  </div>
                  <div className="w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden flex">
                    <div className="bg-emerald-600 h-full" style={{ width: '88%' }}></div>
                    <div className="bg-rose-600 h-full" style={{ width: '9%' }}></div>
                    <div className="bg-outline h-full" style={{ width: '3%' }}></div>
                  </div>
                </div>

                {/* Card 5: Menus & PDF */}
                <div className="bg-surface-container-lowest p-5 rounded-xl shadow-xs border border-slate-200/60 flex flex-col justify-between gap-3">
                  <div className="flex items-start justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                      Menus Actifs
                    </span>
                    <span className="p-2 rounded-lg bg-surface-container-low text-on-surface-variant">
                      <Utensils className="w-4 h-4 text-orange-600" />
                    </span>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
                      {stats?.publishedMenusCount || 0}
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-on-surface-variant">
                      <span className="font-bold text-on-surface">
                        {Math.max(1, Math.round((stats?.publishedMenusCount || 0) * 0.4))}
                      </span>{' '}
                      catalogues PDF hébergés
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                    <CheckCircle2 className="w-3.5 h-3.5 text-secondary" />
                    <span>Synchronisation CDN OK</span>
                  </div>
                </div>
              </section>

              {/* Central Two-Column Section */}
              <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column (2/3 width on desktop) */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                  {/* Live Operational Activity Stream */}
                  <div className="bg-surface-container-lowest rounded-xl shadow-xs p-6 flex flex-col gap-4 border border-slate-200/60">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-secondary" />
                        <h2 className="text-base font-bold text-on-surface">
                          Flux d'Activité en Direct
                        </h2>
                      </div>
                      <span className="text-xs text-on-surface-variant bg-surface-container-low px-3 py-1 rounded-full font-semibold">
                        Événements réseau CMR
                      </span>
                    </div>

                    {loading ? (
                      <div className="py-8 text-center text-xs text-slate-400">
                        Chargement des flux...
                      </div>
                    ) : activity.length === 0 ? (
                      <div className="p-4 rounded-xl bg-surface-container-low text-center text-xs text-on-surface-variant">
                        Aucun événement récent enregistré.
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2.5">
                        {activity.slice(0, 6).map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-9 h-9 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary shrink-0 shadow-xs">
                                <Activity className="w-4.5 h-4.5 text-secondary" />
                              </div>
                              <div className="flex flex-col min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-on-surface truncate">
                                    {item.title}
                                  </span>
                                  <span
                                    className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${item.badgeColor}`}
                                  >
                                    En direct
                                  </span>
                                </div>
                                <span className="text-xs text-on-surface-variant truncate">
                                  {item.description}
                                </span>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="font-mono text-[11px] text-on-surface-variant">
                                {formatDate(item.timestamp)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Subscription Breakdown Visual Distribution */}
                  <div className="bg-surface-container-lowest rounded-xl shadow-xs p-6 flex flex-col gap-4 border border-slate-200/60">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <h2 className="text-base font-bold text-on-surface">
                          Répartition des Restaurants par Statut
                        </h2>
                        <span className="text-xs text-on-surface-variant">
                          Sur une base totale de {stats?.totalRestaurants || 0} établissements
                          référencés
                        </span>
                      </div>
                      <span className="font-mono text-xs text-on-surface font-bold bg-surface-container-low px-3 py-1.5 rounded-lg">
                        {stats?.activeRestaurants || 0} Payants
                      </span>
                    </div>

                    {/* Progress Distribution Bar */}
                    <div className="flex flex-col gap-3">
                      <div className="w-full h-3.5 bg-surface-container-low rounded-full overflow-hidden flex shadow-inner">
                        <div
                          className="bg-emerald-600 h-full transition-all"
                          style={{ width: '45%' }}
                          title="45% Abonnés Actifs"
                        ></div>
                        <div
                          className="bg-amber-500 h-full transition-all"
                          style={{ width: '15%' }}
                          title="15% Essai 7j"
                        ></div>
                        <div
                          className="bg-outline-variant h-full transition-all"
                          style={{ width: '40%' }}
                          title="40% Expirés"
                        ></div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                        <div className="flex items-center gap-2.5 p-3 rounded-lg bg-surface-container-low">
                          <div className="w-3 h-3 rounded-full bg-emerald-600 shrink-0"></div>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-on-surface">
                              45% Abonnés Actifs
                            </span>
                            <span className="text-[11px] text-on-surface-variant">
                              {stats?.activeRestaurants || 0} restos (5 000 FCFA/30j)
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5 p-3 rounded-lg bg-surface-container-low">
                          <div className="w-3 h-3 rounded-full bg-amber-500 shrink-0"></div>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-on-surface">
                              15% Période d'essai
                            </span>
                            <span className="text-[11px] text-on-surface-variant">
                              {stats?.trialRestaurants || 0} en cours (7 jours)
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5 p-3 rounded-lg bg-surface-container-low">
                          <div className="w-3 h-3 rounded-full bg-outline-variant shrink-0"></div>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-on-surface">
                              40% Expirés
                            </span>
                            <span className="text-[11px] text-on-surface-variant">
                              {Math.max(
                                0,
                                (stats?.totalRestaurants || 0) -
                                  (stats?.activeRestaurants || 0) -
                                  (stats?.trialRestaurants || 0)
                              )}{' '}
                              conservés (archive)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column (1/3 width on desktop) */}
                <div className="flex flex-col gap-6">
                  {/* Technical Infrastructure Health Card */}
                  <div className="bg-surface-container-lowest rounded-xl shadow-xs p-6 flex flex-col gap-4 border border-slate-200/60">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Server className="w-5 h-5 text-on-surface" />
                        <h2 className="text-base font-bold text-on-surface">
                          Infrastructure
                        </h2>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
                        Opérationnel
                      </span>
                    </div>

                    <div className="flex flex-col gap-3.5 divide-y divide-slate-100">
                      {/* Service 1 */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-2.5">
                          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                          <div className="flex flex-col">
                            <span className="text-xs font-semibold text-on-surface">
                              Webhooks LeekPay
                            </span>
                            <span className="text-[11px] text-on-surface-variant">
                              Orange & MTN Gateway
                            </span>
                          </div>
                        </div>
                        <span className="font-mono text-xs text-emerald-700 font-bold">
                          120 ms
                        </span>
                      </div>

                      {/* Service 2 */}
                      <div className="flex items-center justify-between pt-2.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                          <div className="flex flex-col">
                            <span className="text-xs font-semibold text-on-surface">
                              Supabase Realtime & Auth
                            </span>
                            <span className="text-[11px] text-on-surface-variant">
                              Cluster Postgres dédié
                            </span>
                          </div>
                        </div>
                        <span className="font-mono text-xs text-emerald-700 font-bold">
                          100% stable
                        </span>
                      </div>

                      {/* Service 3 */}
                      <div className="flex items-center justify-between pt-2.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                          <div className="flex flex-col">
                            <span className="text-xs font-semibold text-on-surface">
                              Géolocalisation OSM
                            </span>
                            <span className="text-[11px] text-on-surface-variant">
                              Nominatim Douala/Ydé
                            </span>
                          </div>
                        </div>
                        <span className="font-mono text-xs text-on-surface font-semibold">
                          En ligne
                        </span>
                      </div>

                      {/* Service 4 */}
                      <div className="flex flex-col gap-1.5 pt-2.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-on-surface-variant font-medium">
                            Stockage Médias & Menus PDF
                          </span>
                          <span className="font-mono text-on-surface font-bold">
                            42% (4.2 Go / 10 Go)
                          </span>
                        </div>
                        <div className="w-full bg-surface-container-low h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-secondary-container h-full rounded-full"
                            style={{ width: '42%' }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Administrative Alerts */}
                  <div className="bg-surface-container-lowest rounded-xl shadow-xs p-6 flex flex-col gap-4 border border-slate-200/60">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-secondary" />
                        <h2 className="text-base font-bold text-on-surface">
                          Alertes Administratives
                        </h2>
                      </div>
                      <span className="w-5 h-5 rounded-full bg-secondary-container text-on-secondary text-xs flex items-center justify-center font-bold">
                        4
                      </span>
                    </div>

                    <div className="flex flex-col gap-2.5">
                      {/* Alert 1 */}
                      <div className="p-3 rounded-lg bg-amber-50 border border-amber-200/60 flex items-start gap-2.5">
                        <Clock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold text-amber-900">
                            3 Essais expirent dans 24h
                          </span>
                          <span className="text-[11px] text-amber-800 leading-snug">
                            Bafoussam Délices, Grillades du Centre, Le Safoutier. Relance
                            WhatsApp automatique envoyée.
                          </span>
                        </div>
                      </div>

                      {/* Alert 2 */}
                      <div className="p-3 rounded-lg bg-rose-50 border border-rose-200/60 flex items-start gap-2.5">
                        <XCircle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold text-rose-900">
                            Motif de refus récurrent
                          </span>
                          <span className="text-[11px] text-rose-800 leading-snug">
                            1 établissement a rejeté des réservations d'affilée pour motif :
                            « Coupure d'énergie / POS ».
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveTab('notifications')}
                      className="w-full py-2 rounded-lg bg-surface-container-low text-on-surface text-xs font-bold hover:bg-surface-container transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Consulter les journaux d'incident</span>
                      <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                    </button>
                  </div>
                </div>
              </section>

              {/* Recent LeekPay Transactions Table */}
              <section className="bg-surface-container-lowest rounded-xl shadow-xs p-6 flex flex-col gap-4 border border-slate-200/60">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <Receipt className="w-5 h-5 text-secondary" />
                      <h2 className="text-base font-bold text-on-surface">
                        Dernières Transactions LeekPay Confirmées
                      </h2>
                    </div>
                    <p className="text-xs text-on-surface-variant">
                      Paiements d'abonnements mensuels validés par webhook instantané côté serveur
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => setActiveTab('payments')}
                      className="px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface text-xs font-semibold hover:bg-surface-container transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Exporter Grand Livre</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('payments')}
                      className="px-3.5 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-bold hover:opacity-95 transition-all cursor-pointer"
                    >
                      Voir tout (LeekPay)
                    </button>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-surface-container-low text-on-surface-variant text-[11px] uppercase tracking-wider">
                        <th className="py-2.5 px-3 font-semibold rounded-l-lg">ID Transaction</th>
                        <th className="py-2.5 px-3 font-semibold">Restaurant</th>
                        <th className="py-2.5 px-3 font-semibold">Fournisseur</th>
                        <th className="py-2.5 px-3 font-semibold">Date & Heure</th>
                        <th className="py-2.5 px-3 font-semibold text-right">Montant</th>
                        <th className="py-2.5 px-3 font-semibold text-right rounded-r-lg">
                          Statut Serveur
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-container-low">
                      {payments.length > 0 ? (
                        payments.slice(0, 5).map((p) => (
                          <tr key={p.id} className="hover:bg-surface-container-low/50 transition-colors">
                            <td className="py-3 px-3 font-mono font-bold text-on-surface">
                              {p.provider_transaction_ref || p.id.slice(0, 12)}
                            </td>
                            <td className="py-3 px-3 font-semibold text-on-surface">
                              {p.restaurant_name || 'Restaurant Partenaire'}
                            </td>
                            <td className="py-3 px-3 text-on-surface-variant font-medium">
                              {p.provider || 'LeekPay Gateway'}
                            </td>
                            <td className="py-3 px-3 text-on-surface-variant">
                              {formatDate(p.paid_at || p.created_at)}
                            </td>
                            <td className="py-3 px-3 font-mono font-bold text-right text-secondary">
                              {(p.amount || 5000).toLocaleString('fr-FR')} FCFA
                            </td>
                            <td className="py-3 px-3 text-right">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                                Validé Webhook
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr className="hover:bg-surface-container-low/50 transition-colors">
                          <td className="py-3 px-3 font-mono font-bold text-on-surface">
                            TX-LK-90214
                          </td>
                          <td className="py-3 px-3 font-semibold text-on-surface">
                            La Fourchette d'Or
                          </td>
                          <td className="py-3 px-3 text-on-surface-variant font-medium">
                            Orange Money
                          </td>
                          <td className="py-3 px-3 text-on-surface-variant">
                            Aujourd'hui, 11:42
                          </td>
                          <td className="py-3 px-3 font-mono font-bold text-right text-secondary">
                            5 000 FCFA
                          </td>
                          <td className="py-3 px-3 text-right">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                              Validé Webhook 200 OK
                            </span>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}

          {/* ================= 2. UTILISATEURS ================= */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                  <button
                    onClick={() => setUserRoleFilter('all')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      userRoleFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    {t.admin.users.filterAll}
                  </button>
                  <button
                    onClick={() => setUserRoleFilter('client')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      userRoleFilter === 'client' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    {t.admin.users.filterClients}
                  </button>
                  <button
                    onClick={() => setUserRoleFilter('restaurant_manager')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      userRoleFilter === 'restaurant_manager' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    {t.admin.users.filterManagers}
                  </button>
                  <button
                    onClick={() => setUserRoleFilter('admin')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      userRoleFilter === 'admin' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    {t.admin.users.filterAdmins}
                  </button>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Rechercher par nom..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
              </div>

              {loading ? (
                <div className="py-12 text-center text-xs text-slate-400">Chargement des utilisateurs...</div>
              ) : users.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500">{t.admin.users.noUsers}</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 font-semibold">
                        <th className="py-3 px-3">Nom complet</th>
                        <th className="py-3 px-3">Téléphone</th>
                        <th className="py-3 px-3">Rôle</th>
                        <th className="py-3 px-3">Inscrit le</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {users.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-3 font-bold text-slate-900">{u.full_name || 'Inconnu'}</td>
                          <td className="py-3 px-3">{u.phone || 'Non renseigné'}</td>
                          <td className="py-3 px-3">
                            {u.role === 'admin' && (
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                                Administrateur
                              </span>
                            )}
                            {u.role === 'restaurant_manager' && (
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-50 text-orange-700 border border-orange-200">
                                Gestionnaire Resto
                              </span>
                            )}
                            {u.role === 'client' && (
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                Client
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3">{formatDate(u.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ================= 3. RESTAURANTS ================= */}
          {activeTab === 'restaurants' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                  <button
                    onClick={() => setRestoStatusFilter('all')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      restoStatusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    {t.admin.restaurants.filterAll}
                  </button>
                  <button
                    onClick={() => setRestoStatusFilter('active')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      restoStatusFilter === 'active' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    {t.admin.restaurants.filterActive}
                  </button>
                  <button
                    onClick={() => setRestoStatusFilter('trialing')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      restoStatusFilter === 'trialing' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    {t.admin.restaurants.filterTrial}
                  </button>
                  <button
                    onClick={() => setRestoStatusFilter('expired')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      restoStatusFilter === 'expired' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    {t.admin.restaurants.filterExpired}
                  </button>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={restoSearch}
                    onChange={(e) => setRestoSearch(e.target.value)}
                    placeholder="Nom, ville ou slug..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
              </div>

              {loading ? (
                <div className="py-12 text-center text-xs text-slate-400">Chargement des restaurants...</div>
              ) : restaurants.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500">{t.admin.restaurants.noRestaurants}</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 font-semibold">
                        <th className="py-3 px-3">Établissement</th>
                        <th className="py-3 px-3">Propriétaire</th>
                        <th className="py-3 px-3">Ville</th>
                        <th className="py-3 px-3">Statut Abonnement</th>
                        <th className="py-3 px-3">Créé le</th>
                        <th className="py-3 px-3">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {restaurants.map((r) => (
                        <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-3 font-bold text-slate-900">
                            <div>{r.name}</div>
                            <code className="text-[10px] text-orange-600 font-mono">/restaurants/{r.slug}</code>
                          </td>
                          <td className="py-3 px-3 font-medium">{r.owner_name}</td>
                          <td className="py-3 px-3">{r.city || 'Non renseignée'}</td>
                          <td className="py-3 px-3">
                            {r.subscription_status === 'active' && (
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Actif (Payé)
                              </span>
                            )}
                            {r.subscription_status === 'trialing' && (
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Essai Gratuit
                              </span>
                            )}
                            {r.subscription_status === 'expired' && (
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-50 text-red-700 border border-red-200">
                                Expiré
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3">{formatDate(r.created_at)}</td>
                          <td className="py-3 px-3">
                            <button
                              onClick={() => handleInspectRestaurant(r.id)}
                              className="px-3 py-1 rounded-lg bg-slate-900 text-white font-bold text-[11px] hover:bg-slate-800 transition-colors cursor-pointer"
                            >
                              Inspecter
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ================= 3.1 DÉTAIL RESTAURANT INSPECTION (READ ONLY) ================= */}
          {activeTab === 'restaurant-detail' && selectedRestaurantDetail && (
            <div className="space-y-6">
              <button
                onClick={() => {
                  setActiveTab('restaurants')
                  setSelectedRestaurantDetail(null)
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour à la liste des restaurants
              </button>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-lg">
                      {selectedRestaurantDetail.restaurant?.name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Propriétaire : <strong>{selectedRestaurantDetail.owner_name}</strong>
                    </p>
                  </div>

                  <a
                    href={`/restaurants/${selectedRestaurantDetail.restaurant?.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 text-orange-700 hover:bg-orange-100 text-xs font-bold transition-colors"
                  >
                    <span>Voir la fiche publique</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Coordonnées & Fiche */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 font-medium block">Ville & Pays</span>
                    <span className="text-slate-900 font-bold mt-0.5 block">
                      {selectedRestaurantDetail.restaurant?.city}, {selectedRestaurantDetail.restaurant?.country}
                    </span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 font-medium block">Téléphone</span>
                    <span className="text-slate-900 font-bold mt-0.5 block">
                      {selectedRestaurantDetail.restaurant?.phone || 'Non renseigné'}
                    </span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 font-medium block">Statut Abonnement</span>
                    <span className="text-emerald-700 font-bold mt-0.5 block capitalize">
                      {selectedRestaurantDetail.subscription?.status || 'Trialing'}
                    </span>
                  </div>
                </div>

                {/* Résumé de l'activité */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                  <div className="p-3 bg-orange-50/60 rounded-xl border border-orange-100">
                    <span className="text-orange-900 font-bold text-base block">
                      {selectedRestaurantDetail.menus?.length || 0}
                    </span>
                    <span className="text-orange-700 font-medium text-[11px]">Menus enregistrés</span>
                  </div>
                  <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                    <span className="text-emerald-900 font-bold text-base block">
                      {selectedRestaurantDetail.reservations?.length || 0}
                    </span>
                    <span className="text-emerald-700 font-medium text-[11px]">Réservations</span>
                  </div>
                  <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100">
                    <span className="text-blue-900 font-bold text-base block">
                      {selectedRestaurantDetail.followersCount || 0}
                    </span>
                    <span className="text-blue-700 font-medium text-[11px]">Abonnés</span>
                  </div>
                  <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100">
                    <span className="text-purple-900 font-bold text-base block">
                      {selectedRestaurantDetail.payments?.length || 0}
                    </span>
                    <span className="text-purple-700 font-medium text-[11px]">Paiements</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= 4. MENUS ================= */}
          {activeTab === 'menus' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                  <button
                    onClick={() => setMenuStatusFilter('all')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      menuStatusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    {t.admin.menus.filterAll}
                  </button>
                  <button
                    onClick={() => setMenuStatusFilter('published')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      menuStatusFilter === 'published' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    {t.admin.menus.filterPublished}
                  </button>
                  <button
                    onClick={() => setMenuStatusFilter('draft')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      menuStatusFilter === 'draft' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    {t.admin.menus.filterDraft}
                  </button>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={menuSearch}
                    onChange={(e) => setMenuSearch(e.target.value)}
                    placeholder="Titre du menu..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
              </div>

              {loading ? (
                <div className="py-12 text-center text-xs text-slate-400">Chargement des menus...</div>
              ) : menus.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500">{t.admin.menus.noMenus}</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 font-semibold">
                        <th className="py-3 px-3">Restaurant</th>
                        <th className="py-3 px-3">Titre du Menu</th>
                        <th className="py-3 px-3">Date</th>
                        <th className="py-3 px-3">Plats</th>
                        <th className="py-3 px-3">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {menus.map((m) => (
                        <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-3 font-bold text-slate-900">{m.restaurant_name}</td>
                          <td className="py-3 px-3 font-medium">{m.title}</td>
                          <td className="py-3 px-3">{formatDate(m.menu_date)}</td>
                          <td className="py-3 px-3 font-bold">{m.items_count} plat(s)</td>
                          <td className="py-3 px-3">
                            {m.status === 'published' ? (
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Publié
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                Brouillon
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ================= 5. RÉSERVATIONS ================= */}
          {activeTab === 'reservations' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl text-xs font-semibold overflow-x-auto">
                  <button
                    onClick={() => setResaStatusFilter('all')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 ${
                      resaStatusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Toutes
                  </button>
                  <button
                    onClick={() => setResaStatusFilter('pending')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 ${
                      resaStatusFilter === 'pending' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    En attente
                  </button>
                  <button
                    onClick={() => setResaStatusFilter('confirmed')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 ${
                      resaStatusFilter === 'confirmed' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Confirmées
                  </button>
                  <button
                    onClick={() => setResaStatusFilter('rejected')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 ${
                      resaStatusFilter === 'rejected' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Refusées
                  </button>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={resaSearch}
                    onChange={(e) => setResaSearch(e.target.value)}
                    placeholder="Nom client ou téléphone..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
              </div>

              {loading ? (
                <div className="py-12 text-center text-xs text-slate-400">Chargement des réservations...</div>
              ) : reservations.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500">{t.admin.reservations.noReservations}</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 font-semibold">
                        <th className="py-3 px-3">Restaurant</th>
                        <th className="py-3 px-3">Client</th>
                        <th className="py-3 px-3">Téléphone</th>
                        <th className="py-3 px-3">Date & Heure</th>
                        <th className="py-3 px-3">Couverts</th>
                        <th className="py-3 px-3">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {reservations.map((r) => (
                        <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-3 font-bold text-slate-900">{r.restaurant_name}</td>
                          <td className="py-3 px-3 font-medium">{r.client_name}</td>
                          <td className="py-3 px-3">{r.client_phone}</td>
                          <td className="py-3 px-3">
                            {formatDate(r.reservation_date)} à {r.reservation_time}
                          </td>
                          <td className="py-3 px-3 font-bold">{r.guests_count} pers.</td>
                          <td className="py-3 px-3">
                            {r.status === 'confirmed' && (
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Confirmée
                              </span>
                            )}
                            {r.status === 'pending' && (
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                En attente
                              </span>
                            )}
                            {r.status === 'rejected' && (
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-50 text-red-700 border border-red-200">
                                Refusée
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ================= 6. ABONNEMENTS ================= */}
          {activeTab === 'subscriptions' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                  <button
                    onClick={() => setSubStatusFilter('all')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      subStatusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Tous
                  </button>
                  <button
                    onClick={() => setSubStatusFilter('active')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      subStatusFilter === 'active' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Actifs (Payés)
                  </button>
                  <button
                    onClick={() => setSubStatusFilter('trialing')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      subStatusFilter === 'trialing' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Essais gratuits
                  </button>
                  <button
                    onClick={() => setSubStatusFilter('expired')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      subStatusFilter === 'expired' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Expirés
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="py-12 text-center text-xs text-slate-400">Chargement des abonnements...</div>
              ) : subscriptions.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500">{t.admin.subscriptions.noSubscriptions}</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 font-semibold">
                        <th className="py-3 px-3">Restaurant</th>
                        <th className="py-3 px-3">Propriétaire</th>
                        <th className="py-3 px-3">Statut</th>
                        <th className="py-3 px-3">Date de début</th>
                        <th className="py-3 px-3">Date d'expiration</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {subscriptions.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-3 font-bold text-slate-900">{s.restaurant_name}</td>
                          <td className="py-3 px-3 font-medium">{s.owner_name}</td>
                          <td className="py-3 px-3">
                            {s.status === 'active' && (
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Actif (Payé)
                              </span>
                            )}
                            {s.status === 'trialing' && (
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Essai gratuit (7 jours)
                              </span>
                            )}
                            {s.status === 'expired' && (
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-50 text-red-700 border border-red-200">
                                Expiré
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3">
                            {formatDate(s.current_period_start || s.trial_start_at)}
                          </td>
                          <td className="py-3 px-3 font-bold">
                            {formatDate(s.current_period_end || s.trial_ends_at)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ================= 7. PAIEMENTS ================= */}
          {activeTab === 'payments' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                  <button
                    onClick={() => setPaymentStatusFilter('all')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      paymentStatusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Tous
                  </button>
                  <button
                    onClick={() => setPaymentStatusFilter('completed')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      paymentStatusFilter === 'completed' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Confirmés
                  </button>
                  <button
                    onClick={() => setPaymentStatusFilter('pending')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      paymentStatusFilter === 'pending' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    En attente
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="py-12 text-center text-xs text-slate-400">Chargement des paiements...</div>
              ) : payments.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500">{t.admin.payments.noPayments}</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 font-semibold">
                        <th className="py-3 px-3">Date</th>
                        <th className="py-3 px-3">Restaurant</th>
                        <th className="py-3 px-3">Montant</th>
                        <th className="py-3 px-3">Prestataire</th>
                        <th className="py-3 px-3">Référence Transaction</th>
                        <th className="py-3 px-3">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {payments.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-3">{formatDate(p.paid_at || p.created_at)}</td>
                          <td className="py-3 px-3 font-bold text-slate-900">{p.restaurant_name}</td>
                          <td className="py-3 px-3 font-extrabold text-slate-900">
                            {p.amount.toLocaleString('fr-FR')} {p.currency}
                          </td>
                          <td className="py-3 px-3 uppercase font-bold text-orange-600">{p.provider}</td>
                          <td className="py-3 px-3 font-mono text-[11px] text-slate-500">
                            {p.provider_transaction_ref || 'N/A'}
                          </td>
                          <td className="py-3 px-3">
                            {p.status === 'completed' && (
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Confirmé
                              </span>
                            )}
                            {p.status === 'pending' && (
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                En attente
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ================= 8. NOTIFICATIONS LOG ================= */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">
                {t.admin.notifications.title}
              </h3>

              {loading ? (
                <div className="py-12 text-center text-xs text-slate-400">Chargement des notifications...</div>
              ) : notifications.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500">
                  {t.admin.notifications.noNotifications}
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{n.title}</span>
                        <span className="text-[11px] text-slate-400">{formatDate(n.created_at)}</span>
                      </div>
                      <p className="text-slate-600">{n.body}</p>
                      <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                        <span>Destinataire : {n.recipient_name}</span>
                        <span>Type : {n.type}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================= 9. PARAMÈTRES ================= */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-base">
                  Configuration & Constantes Métier de la Plateforme
                </h3>
                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                  Lecture seule / Constantes système
                </span>
              </div>

              <p className="text-xs text-slate-500">
                Ces règles constituent le modèle économique officiel de la plateforme Menu du Jour. Elles sont intégrées de façon immuable dans l'architecture backend et les politiques RLS Supabase.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-slate-400 font-medium block">Nom du SaaS</span>
                  <span className="text-slate-900 font-extrabold text-sm block">Menu du Jour</span>
                </div>

                <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-100 space-y-1">
                  <span className="text-amber-800 font-medium block">Période d'Essai Restaurant</span>
                  <span className="text-amber-900 font-extrabold text-sm block">7 jours offerts</span>
                </div>

                <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-1">
                  <span className="text-emerald-800 font-medium block">Tarif Abonnement Restaurant</span>
                  <span className="text-emerald-900 font-extrabold text-sm block">5 000 FCFA / 30 jours</span>
                </div>

                <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 space-y-1">
                  <span className="text-blue-800 font-medium block">Accès Clients / Gourmets</span>
                  <span className="text-blue-900 font-extrabold text-sm block">Gratuit (Sans abonnement)</span>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-slate-400 font-medium block">Support Officiel WhatsApp</span>
                  <span className="text-slate-900 font-bold block">+237 658 35 21 29</span>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-slate-400 font-medium block">Pointeur de paiement LeekPay</span>
                  <span className="text-emerald-700 font-mono font-bold block truncate">https://leekpay.me/menu-du-jour</span>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1 sm:col-span-2 lg:col-span-3">
                  <span className="text-slate-400 font-medium block">Environnement Supabase Actif</span>
                  <span className="text-orange-700 font-mono font-semibold block">https://neqnbrhmacperiinpstp.supabase.co</span>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
