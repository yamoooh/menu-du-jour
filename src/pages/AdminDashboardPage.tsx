import React, { useEffect, useState, useCallback } from 'react'
import { Header } from '@/components/Header'
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
  const { profile, signOut } = useAuth()
  const { t } = useLanguage()

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
    const [statsRes, actRes] = await Promise.all([
      adminService.fetchGlobalStats(),
      adminService.fetchRecentActivity(),
    ])
    setStats(statsRes.data)
    setActivity(actRes.data)
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
    <div className="min-h-screen flex flex-col bg-slate-100 font-sans text-slate-900">
      <SeoHead
        title="Console Administrateur — Menu du Jour"
        description="Back office d'administration globale Menu du Jour"
        path="/admin"
        noindex={true}
      />

      <Header />

      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col md:flex-row">
        {/* Sidebar Desktop Admin */}
        <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white p-4 space-y-6 shrink-0 min-h-[calc(100vh-4rem)] border-r border-slate-800">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 px-3 py-2 bg-slate-800/90 rounded-xl border border-slate-700">
              <ShieldCheck className="w-5 h-5 text-purple-400 shrink-0" />
              <div>
                <span className="text-[11px] font-bold text-purple-300 block leading-tight">
                  ADMINISTRATION
                </span>
                <span className="text-xs font-extrabold text-white block truncate">
                  {profile?.full_name || 'Admin Global'}
                </span>
              </div>
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = activeTab === item.id || (activeTab === 'restaurant-detail' && item.id === 'restaurants')

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id)
                      setSelectedRestaurantDetail(null)
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-md'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          <div className="mt-auto pt-4 border-t border-slate-800 space-y-3">
            <div className="px-3 py-2 bg-slate-800/50 rounded-xl text-[11px] text-slate-400 flex items-center justify-between">
              <span>SaaS Version :</span>
              <span className="font-mono text-white font-bold">v1.3.0 PWA</span>
            </div>

            <button
              onClick={() => signOut()}
              className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Déconnexion</span>
            </button>
          </div>
        </aside>

        {/* Topbar Mobile Admin Toggle */}
        <div className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-purple-400" />
            <span className="font-bold text-sm">Console Admin</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>

        {/* Drawer Navigation Mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900 text-white p-4 space-y-1 border-b border-slate-800 animate-fadeIn">
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
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                    isActive ? 'bg-orange-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4.5 h-4.5" />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>
        )}

        {/* Contenu Principal Admin */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl">
          {/* Header de section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[11px] font-bold border border-purple-200">
                  Administration Global SaaS
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
                {activeTab === 'dashboard' && t.admin.nav.dashboard}
                {activeTab === 'users' && t.admin.users.title}
                {activeTab === 'restaurants' && t.admin.restaurants.title}
                {activeTab === 'restaurant-detail' && t.admin.restaurants.detailTitle}
                {activeTab === 'menus' && t.admin.menus.title}
                {activeTab === 'reservations' && t.admin.reservations.title}
                {activeTab === 'subscriptions' && t.admin.subscriptions.title}
                {activeTab === 'payments' && t.admin.payments.title}
                {activeTab === 'notifications' && t.admin.notifications.title}
                {activeTab === 'settings' && t.admin.nav.settings}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">{t.admin.subtitle}</p>
            </div>

            <button
              onClick={() => {
                setRefreshing(true)
                loadDashboardData().then(() => setRefreshing(false))
              }}
              disabled={loading || refreshing}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Actualiser</span>
            </button>
          </div>

          {/* Alert Erreur */}
          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4.5 h-4.5 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* ================= 1. TABLEAU DE BORD (DASHBOARD OVERVIEW) ================= */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {loading ? (
                <div className="py-16 text-center text-xs text-slate-400 animate-pulse bg-white rounded-2xl border border-slate-200">
                  Chargement des indicateurs SaaS...
                </div>
              ) : (
                <>
                  {/* Cartes KPI réelles */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                      <div className="flex items-center justify-between text-slate-500">
                        <span className="text-xs font-bold uppercase tracking-wider">{t.admin.stats.totalUsers}</span>
                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                          <Users className="w-4.5 h-4.5" />
                        </div>
                      </div>
                      <div className="text-2xl font-black text-slate-900">{stats?.totalUsers || 0}</div>
                      <p className="text-xs text-slate-400">
                        {stats?.clientsCount || 0} clients • {stats?.managersCount || 0} restos
                      </p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                      <div className="flex items-center justify-between text-slate-500">
                        <span className="text-xs font-bold uppercase tracking-wider">{t.admin.stats.totalRestaurants}</span>
                        <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                          <Store className="w-4.5 h-4.5" />
                        </div>
                      </div>
                      <div className="text-2xl font-black text-slate-900">{stats?.totalRestaurants || 0}</div>
                      <p className="text-xs text-slate-400">
                        {stats?.activeRestaurants || 0} actifs • {stats?.trialRestaurants || 0} essais
                      </p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                      <div className="flex items-center justify-between text-slate-500">
                        <span className="text-xs font-bold uppercase tracking-wider">{t.admin.stats.publishedMenus}</span>
                        <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                          <Utensils className="w-4.5 h-4.5" />
                        </div>
                      </div>
                      <div className="text-2xl font-black text-slate-900">{stats?.publishedMenusCount || 0}</div>
                      <p className="text-xs text-slate-400">Menus du jour visibles</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                      <div className="flex items-center justify-between text-slate-500">
                        <span className="text-xs font-bold uppercase tracking-wider">{t.admin.stats.totalRevenue}</span>
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                          <Receipt className="w-4.5 h-4.5" />
                        </div>
                      </div>
                      <div className="text-2xl font-black text-slate-900">
                        {(stats?.totalRevenueFCFA || 0).toLocaleString('fr-FR')} FCFA
                      </div>
                      <p className="text-xs text-slate-400">{stats?.confirmedPaymentsCount || 0} paiements LeekPay</p>
                    </div>
                  </div>

                  {/* Section Activité récente */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                        <Activity className="w-5 h-5 text-orange-600" />
                        {t.admin.activity.title}
                      </h3>
                      <span className="text-xs text-slate-400">Événements réels en BDD</span>
                    </div>

                    {activity.length === 0 ? (
                      <p className="text-xs text-slate-500 text-center py-6">
                        {t.admin.activity.noActivity}
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {activity.map((item) => (
                          <div
                            key={item.id}
                            className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 flex items-start justify-between gap-3 text-xs"
                          >
                            <div className="space-y-1">
                              <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border ${item.badgeColor}`}>
                                {item.title}
                              </span>
                              <p className="text-slate-800 font-semibold">{item.description}</p>
                            </div>
                            <span className="text-[11px] text-slate-400 shrink-0 font-medium">
                              {formatDate(item.timestamp)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
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
              <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">
                Configuration de la plateforme SaaS
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-slate-400 font-medium block">Nom du SaaS</span>
                  <span className="text-slate-900 font-extrabold text-sm block">Menu du Jour</span>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-slate-400 font-medium block">Environnement Supabase</span>
                  <span className="text-orange-700 font-mono font-semibold block">neqnbrhmacperiinpstp.supabase.co</span>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-slate-400 font-medium block">Support Officiel WhatsApp</span>
                  <span className="text-slate-900 font-bold block">+237 658 35 21 29</span>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-slate-400 font-medium block">Pointeur de paiement</span>
                  <span className="text-emerald-700 font-mono font-bold block">https://leekpay.me/menu-du-jour</span>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
