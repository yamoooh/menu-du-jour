import { supabase } from '@/lib/supabase'

export interface GlobalAdminStats {
  totalUsers: number
  clientsCount: number
  managersCount: number
  adminsCount: number
  totalRestaurants: number
  activeRestaurants: number
  trialRestaurants: number
  expiredRestaurants: number
  publishedMenusCount: number
  totalReservationsCount: number
  activeSubscriptionsCount: number
  confirmedPaymentsCount: number
  totalRevenueFCFA: number
}

export interface AdminUser {
  id: string
  full_name: string | null
  phone: string | null
  role: 'client' | 'restaurant_manager' | 'admin'
  created_at: string
}

export interface AdminRestaurant {
  id: string
  owner_id: string
  name: string
  slug: string
  city: string | null
  country: string | null
  address: string | null
  phone: string | null
  email: string | null
  created_at: string
  owner_name?: string
  subscription_status?: string
  current_period_end?: string
}

export interface AdminMenu {
  id: string
  restaurant_id: string
  title: string
  menu_date: string
  status: 'draft' | 'published'
  published_at: string | null
  created_at: string
  restaurant_name?: string
  items_count?: number
}

export interface AdminReservation {
  id: string
  restaurant_id: string
  client_id: string | null
  client_name: string
  client_phone: string
  reservation_date: string
  reservation_time: string
  guests_count: number
  status: 'pending' | 'confirmed' | 'rejected' | 'cancelled' | 'completed' | 'no_show'
  created_at: string
  restaurant_name?: string
}

export interface AdminSubscription {
  id: string
  restaurant_id: string
  status: 'trialing' | 'active' | 'expired' | 'cancelled'
  trial_start_at: string
  trial_ends_at: string
  current_period_start: string | null
  current_period_end: string | null
  created_at: string
  restaurant_name?: string
  owner_name?: string
}

export interface AdminPayment {
  id: string
  restaurant_id: string
  subscription_id: string | null
  amount: number
  currency: string
  provider: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  provider_transaction_ref: string | null
  paid_at: string | null
  created_at: string
  restaurant_name?: string
}

export interface AdminNotification {
  id: string
  user_id: string
  type: string
  title: string
  body: string
  is_read: boolean
  created_at: string
  recipient_name?: string
}

export interface AdminActivityItem {
  id: string
  type: 'user' | 'restaurant' | 'menu' | 'reservation' | 'payment'
  title: string
  description: string
  timestamp: string
  badgeColor?: string
}

export const adminService = {
  // Fetch global platform KPI statistics
  async fetchGlobalStats(): Promise<{ data: GlobalAdminStats; error: any }> {
    try {
      const [
        profilesRes,
        restaurantsRes,
        subscriptionsRes,
        menusRes,
        reservationsRes,
        paymentsRes,
      ] = await Promise.all([
        supabase.from('profiles').select('role'),
        supabase.from('restaurants').select('id'),
        supabase.from('subscriptions').select('status'),
        supabase.from('menus').select('id').eq('status', 'published'),
        supabase.from('reservations').select('id'),
        supabase.from('payments').select('amount, status').eq('status', 'completed'),
      ])

      const profiles = profilesRes.data || []
      const restaurants = restaurantsRes.data || []
      const subscriptions = subscriptionsRes.data || []
      const menus = menusRes.data || []
      const reservations = reservationsRes.data || []
      const payments = paymentsRes.data || []

      const stats: GlobalAdminStats = {
        totalUsers: profiles.length,
        clientsCount: profiles.filter((p) => p.role === 'client').length,
        managersCount: profiles.filter((p) => p.role === 'restaurant_manager').length,
        adminsCount: profiles.filter((p) => p.role === 'admin').length,
        totalRestaurants: restaurants.length,
        activeRestaurants: subscriptions.filter((s) => s.status === 'active').length,
        trialRestaurants: subscriptions.filter((s) => s.status === 'trialing').length,
        expiredRestaurants: subscriptions.filter((s) => s.status === 'expired').length,
        publishedMenusCount: menus.length,
        totalReservationsCount: reservations.length,
        activeSubscriptionsCount: subscriptions.filter((s) => s.status === 'active' || s.status === 'trialing').length,
        confirmedPaymentsCount: payments.length,
        totalRevenueFCFA: payments.reduce((acc, p) => acc + (p.amount || 0), 0),
      }

      return { data: stats, error: null }
    } catch (err: any) {
      return {
        data: {
          totalUsers: 0,
          clientsCount: 0,
          managersCount: 0,
          adminsCount: 0,
          totalRestaurants: 0,
          activeRestaurants: 0,
          trialRestaurants: 0,
          expiredRestaurants: 0,
          publishedMenusCount: 0,
          totalReservationsCount: 0,
          activeSubscriptionsCount: 0,
          confirmedPaymentsCount: 0,
          totalRevenueFCFA: 0,
        },
        error: err,
      }
    }
  },

  // Fetch users with filters
  async fetchUsers(
    roleFilter: string = 'all',
    searchQuery: string = ''
  ): Promise<{ data: AdminUser[]; error: any }> {
    try {
      let query = supabase.from('profiles').select('*').order('created_at', { ascending: false })

      if (roleFilter !== 'all') {
        query = query.eq('role', roleFilter as any)
      }

      if (searchQuery.trim()) {
        query = query.ilike('full_name', `%${searchQuery.trim()}%`)
      }

      const { data, error } = await query
      return { data: data || [], error }
    } catch (err) {
      return { data: [], error: err }
    }
  },

  // Fetch restaurants with owner & subscription status
  async fetchRestaurants(
    statusFilter: string = 'all',
    searchQuery: string = ''
  ): Promise<{ data: AdminRestaurant[]; error: any }> {
    try {
      let query = supabase
        .from('restaurants')
        .select(`
          *,
          subscriptions ( status, current_period_end )
        `)
        .order('created_at', { ascending: false })

      if (searchQuery.trim()) {
        const q = `%${searchQuery.trim()}%`
        query = query.or(`name.ilike.${q},city.ilike.${q},slug.ilike.${q}`)
      }

      const { data, error } = await query
      if (error) return { data: [], error }

      // Fetch owner profile names
      const ownerIds = Array.from(new Set((data || []).map((r) => r.owner_id)))
      let ownerMap: Record<string, string> = {}

      if (ownerIds.length > 0) {
        const { data: owners } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', ownerIds)

        if (owners) {
          owners.forEach((o) => {
            ownerMap[o.id] = o.full_name || 'Inconnu'
          })
        }
      }

      let result: AdminRestaurant[] = (data || []).map((r: any) => {
        const sub = Array.isArray(r.subscriptions) ? r.subscriptions[0] : r.subscriptions
        return {
          id: r.id,
          owner_id: r.owner_id,
          name: r.name,
          slug: r.slug,
          city: r.city,
          country: r.country,
          address: r.address,
          phone: r.phone,
          email: r.email,
          created_at: r.created_at,
          owner_name: ownerMap[r.owner_id] || 'Non renseigné',
          subscription_status: sub?.status || 'trialing',
          current_period_end: sub?.current_period_end || null,
        }
      })

      if (statusFilter !== 'all') {
        result = result.filter((r) => r.subscription_status === statusFilter)
      }

      return { data: result, error: null }
    } catch (err) {
      return { data: [], error: err }
    }
  },

  // Fetch full single restaurant admin inspection details
  async fetchRestaurantDetails(restaurantId: string): Promise<{ data: any; error: any }> {
    try {
      const [
        restoRes,
        subRes,
        hoursRes,
        menusRes,
        reservationsRes,
        paymentsRes,
        followersRes,
      ] = await Promise.all([
        supabase.from('restaurants').select('*').eq('id', restaurantId).single(),
        supabase.from('subscriptions').select('*').eq('restaurant_id', restaurantId).single(),
        supabase.from('restaurant_hours').select('*').eq('restaurant_id', restaurantId),
        supabase.from('menus').select('*, menu_items(id)').eq('restaurant_id', restaurantId).order('menu_date', { ascending: false }),
        supabase.from('reservations').select('*').eq('restaurant_id', restaurantId).order('created_at', { ascending: false }),
        supabase.from('payments').select('*').eq('restaurant_id', restaurantId).order('created_at', { ascending: false }),
        supabase.from('restaurant_followers').select('id', { count: 'exact' }).eq('restaurant_id', restaurantId),
      ])

      if (restoRes.error) return { data: null, error: restoRes.error }

      let ownerName = 'Inconnu'
      if (restoRes.data?.owner_id) {
        const { data: owner } = await supabase
          .from('profiles')
          .select('full_name, phone')
          .eq('id', restoRes.data.owner_id)
          .single()
        if (owner) ownerName = owner.full_name || 'Inconnu'
      }

      return {
        data: {
          restaurant: restoRes.data,
          owner_name: ownerName,
          subscription: subRes.data,
          hours: hoursRes.data || [],
          menus: menusRes.data || [],
          reservations: reservationsRes.data || [],
          payments: paymentsRes.data || [],
          followersCount: followersRes.count || 0,
        },
        error: null,
      }
    } catch (err) {
      return { data: null, error: err }
    }
  },

  // Fetch platform menus
  async fetchMenus(
    statusFilter: string = 'all',
    searchQuery: string = ''
  ): Promise<{ data: AdminMenu[]; error: any }> {
    try {
      let query = supabase
        .from('menus')
        .select(`
          *,
          restaurants ( name ),
          menu_items ( id )
        `)
        .order('menu_date', { ascending: false })

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter as any)
      }

      if (searchQuery.trim()) {
        query = query.ilike('title', `%${searchQuery.trim()}%`)
      }

      const { data, error } = await query
      if (error) return { data: [], error }

      const result: AdminMenu[] = (data || []).map((m: any) => ({
        id: m.id,
        restaurant_id: m.restaurant_id,
        title: m.title,
        menu_date: m.menu_date,
        status: m.status,
        published_at: m.published_at,
        created_at: m.created_at,
        restaurant_name: m.restaurants?.name || 'Restaurant inconnu',
        items_count: Array.isArray(m.menu_items) ? m.menu_items.length : 0,
      }))

      return { data: result, error: null }
    } catch (err) {
      return { data: [], error: err }
    }
  },

  // Fetch platform reservations
  async fetchReservations(
    statusFilter: string = 'all',
    searchQuery: string = ''
  ): Promise<{ data: AdminReservation[]; error: any }> {
    try {
      let query = supabase
        .from('reservations')
        .select(`
          *,
          restaurants ( name )
        `)
        .order('created_at', { ascending: false })

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter as any)
      }

      if (searchQuery.trim()) {
        const q = `%${searchQuery.trim()}%`
        query = query.or(`customer_name.ilike.${q},customer_phone.ilike.${q}`)
      }

      const { data, error } = await query
      if (error) return { data: [], error }

      const result: AdminReservation[] = (data || []).map((r: any) => ({
        id: r.id,
        restaurant_id: r.restaurant_id,
        client_id: r.client_id,
        client_name: r.customer_name,
        client_phone: r.customer_phone,
        reservation_date: r.reservation_date,
        reservation_time: r.reservation_time,
        guests_count: r.party_size,
        status: r.status,
        created_at: r.created_at,
        restaurant_name: r.restaurants?.name || 'Restaurant inconnu',
      }))

      return { data: result, error: null }
    } catch (err) {
      return { data: [], error: err }
    }
  },

  // Fetch global subscriptions
  async fetchSubscriptions(
    statusFilter: string = 'all'
  ): Promise<{ data: AdminSubscription[]; error: any }> {
    try {
      let query = supabase
        .from('subscriptions')
        .select(`
          *,
          restaurants ( name, owner_id )
        `)
        .order('updated_at', { ascending: false })

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter as any)
      }

      const { data, error } = await query
      if (error) return { data: [], error }

      const ownerIds = Array.from(
        new Set((data || []).map((s: any) => s.restaurants?.owner_id).filter(Boolean))
      )
      let ownerMap: Record<string, string> = {}

      if (ownerIds.length > 0) {
        const { data: owners } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', ownerIds)
        if (owners) {
          owners.forEach((o) => {
            ownerMap[o.id] = o.full_name || 'Inconnu'
          })
        }
      }

      const result: AdminSubscription[] = (data || []).map((s: any) => ({
        id: s.id,
        restaurant_id: s.restaurant_id,
        status: s.status,
        trial_start_at: s.trial_start_at,
        trial_ends_at: s.trial_end_at || s.trial_ends_at,
        current_period_start: s.current_period_start,
        current_period_end: s.current_period_end,
        created_at: s.created_at,
        restaurant_name: s.restaurants?.name || 'Restaurant inconnu',
        owner_name: ownerMap[s.restaurants?.owner_id] || 'Non renseigné',
      }))

      return { data: result, error: null }
    } catch (err) {
      return { data: [], error: err }
    }
  },

  // Fetch global payments
  async fetchPayments(
    statusFilter: string = 'all'
  ): Promise<{ data: AdminPayment[]; error: any }> {
    try {
      let query = supabase
        .from('payments')
        .select(`
          *,
          restaurants ( name )
        `)
        .order('created_at', { ascending: false })

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter as any)
      }

      const { data, error } = await query
      if (error) return { data: [], error }

      const result: AdminPayment[] = (data || []).map((p: any) => ({
        id: p.id,
        restaurant_id: p.restaurant_id,
        subscription_id: p.subscription_id,
        amount: p.amount,
        currency: p.currency,
        provider: p.provider,
        status: p.status,
        provider_transaction_ref: p.provider_transaction_ref,
        paid_at: p.paid_at,
        created_at: p.created_at,
        restaurant_name: p.restaurants?.name || 'Restaurant inconnu',
      }))

      return { data: result, error: null }
    } catch (err) {
      return { data: [], error: err }
    }
  },

  // Fetch admin notifications log
  async fetchNotifications(): Promise<{ data: AdminNotification[]; error: any }> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) return { data: [], error }

      const userIds = Array.from(new Set((data || []).map((n) => n.user_id)))
      let userMap: Record<string, string> = {}

      if (userIds.length > 0) {
        const { data: users } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', userIds)
        if (users) {
          users.forEach((u) => {
            userMap[u.id] = u.full_name || 'Utilisateur'
          })
        }
      }

      const result: AdminNotification[] = (data || []).map((n) => ({
        id: n.id,
        user_id: n.user_id,
        type: n.type,
        title: n.title,
        body: n.body,
        is_read: n.is_read,
        created_at: n.created_at,
        recipient_name: userMap[n.user_id] || 'Destinataire',
      }))

      return { data: result, error: null }
    } catch (err) {
      return { data: [], error: err }
    }
  },

  // Fetch recent activity feed built from real database entries
  async fetchRecentActivity(): Promise<{ data: AdminActivityItem[]; error: any }> {
    try {
      const [usersRes, restosRes, menusRes, resasRes, paymentsRes] = await Promise.all([
        supabase.from('profiles').select('id, full_name, created_at').order('created_at', { ascending: false }).limit(5),
        supabase.from('restaurants').select('id, name, created_at').order('created_at', { ascending: false }).limit(5),
        supabase.from('menus').select('id, title, created_at, status').order('created_at', { ascending: false }).limit(5),
        supabase.from('reservations').select('id, customer_name, created_at, status').order('created_at', { ascending: false }).limit(5),
        supabase.from('payments').select('id, amount, currency, created_at, status').order('created_at', { ascending: false }).limit(5),
      ])

      const feed: AdminActivityItem[] = []

      ;(usersRes.data || []).forEach((u) => {
        feed.push({
          id: `user-${u.id}`,
          type: 'user',
          title: 'Nouvel utilisateur inscrit',
          description: `${u.full_name || 'Utilisateur'} s'est inscrit sur la plateforme.`,
          timestamp: u.created_at,
          badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
        })
      })

      ;(restosRes.data || []).forEach((r) => {
        feed.push({
          id: `resto-${r.id}`,
          type: 'restaurant',
          title: 'Nouveau restaurant créé',
          description: `Établissement « ${r.name} » ajouté.`,
          timestamp: r.created_at,
          badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
        })
      })

      ;(menusRes.data || []).forEach((m) => {
        feed.push({
          id: `menu-${m.id}`,
          type: 'menu',
          title: m.status === 'published' ? 'Menu du jour publié' : 'Nouveau brouillon de menu',
          description: `« ${m.title} » créé sur la plateforme.`,
          timestamp: m.created_at,
          badgeColor: m.status === 'published' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200',
        })
      })

      ;(resasRes.data || []).forEach((res) => {
        feed.push({
          id: `resa-${res.id}`,
          type: 'reservation',
          title: 'Demande de réservation',
          description: `Réservation par ${res.customer_name} (statut : ${res.status}).`,
          timestamp: res.created_at,
          badgeColor: 'bg-orange-50 text-orange-700 border-orange-200',
        })
      })

      ;(paymentsRes.data || []).forEach((p) => {
        feed.push({
          id: `pay-${p.id}`,
          type: 'payment',
          title: 'Paiement d\'abonnement',
          description: `Paiement de ${p.amount.toLocaleString('fr-FR')} ${p.currency} (statut : ${p.status}).`,
          timestamp: p.created_at,
          badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        })
      })

      // Sort chronological descending
      feed.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

      return { data: feed.slice(0, 10), error: null }
    } catch (err) {
      return { data: [], error: err }
    }
  },
}
