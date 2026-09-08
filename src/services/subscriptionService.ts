import { supabase } from '@/lib/supabase'
import type { Subscription, Payment, SubscriptionInfo } from '@/types/restaurant.types'
import { LEEKPAY_PAYMENT_URL } from '@/types/restaurant.types'

export const subscriptionService = {
  // Calculer et structurer le statut complet d'un abonnement
  getSubscriptionInfo(subscription: Subscription | null): SubscriptionInfo {
    if (!subscription) {
      return {
        subscription: null,
        status: 'expired',
        isExpired: true,
        isActive: false,
        remainingDays: 0,
        expiresAt: null,
        formattedExpirationDate: 'Non définie',
      }
    }

    const now = new Date()
    const trialEnd = subscription.trial_end_at ? new Date(subscription.trial_end_at) : null
    const periodEnd = subscription.current_period_end ? new Date(subscription.current_period_end) : null

    let expiresAt: Date | null = null
    if (subscription.status === 'active') {
      expiresAt = periodEnd
    } else if (subscription.status === 'trialing') {
      expiresAt = trialEnd
    }

    let remainingDays = 0
    if (expiresAt) {
      const diffMs = expiresAt.getTime() - now.getTime()
      remainingDays = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)))
    }

    const isExpired =
      subscription.status === 'expired' ||
      (expiresAt !== null && expiresAt.getTime() <= now.getTime())

    const isActive = !isExpired && (subscription.status === 'active' || subscription.status === 'trialing')

    const formattedExpirationDate = expiresAt
      ? expiresAt.toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : 'Non définie'

    return {
      subscription,
      status: isExpired ? 'expired' : subscription.status,
      isExpired,
      isActive,
      remainingDays,
      expiresAt,
      formattedExpirationDate,
    }
  },

  // Récupérer l'abonnement du restaurant
  async fetchSubscription(
    restaurantId: string
  ): Promise<{ data: Subscription | null; error: Error | null }> {
    if (!supabase) return { data: null, error: new Error('Client Supabase non initialisé') }

    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .maybeSingle()

      if (error) return { data: null, error: new Error(error.message) }
      return { data, error: null }
    } catch (err: any) {
      return { data: null, error: new Error(err.message || 'Erreur chargement abonnement') }
    }
  },

  // Récupérer l'historique des paiements d'un restaurant
  async fetchPayments(
    restaurantId: string
  ): Promise<{ data: Payment[] | null; error: Error | null }> {
    if (!supabase) return { data: null, error: new Error('Client Supabase non initialisé') }

    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('created_at', { ascending: false })

      if (error) return { data: null, error: new Error(error.message) }
      return { data: data || [], error: null }
    } catch (err: any) {
      return { data: null, error: new Error(err.message || 'Erreur chargement paiements') }
    }
  },

  // Obtenir le lien LeekPay prérempli avec l'ID du restaurant
  getLeekPayPaymentUrl(restaurantId: string): string {
    const url = new URL(LEEKPAY_PAYMENT_URL)
    url.searchParams.set('restaurant_id', restaurantId)
    url.searchParams.set('amount', '5000')
    url.searchParams.set('currency', 'XOF')
    return url.toString()
  },

  // Simuler/tester la confirmation d'un paiement en mode TEST (sans exposer service_role)
  // Appelle la RPC confirm_payment_subscription exécutée de manière sécurisée en PostgreSQL
  async confirmPaymentForTest(
    restaurantId: string,
    providerRef?: string
  ): Promise<{ data: any; error: Error | null }> {
    if (!supabase) return { data: null, error: new Error('Client Supabase non initialisé') }

    try {
      const { data, error } = await supabase.rpc('confirm_payment_subscription', {
        p_restaurant_id: restaurantId,
        p_amount: 5000,
        p_provider_ref: providerRef || `TEST-${Date.now()}`,
        p_metadata: { source: 'test_simulation', timestamp: new Date().toISOString() },
      })

      if (error) return { data: null, error: new Error(error.message) }
      return { data, error: null }
    } catch (err: any) {
      return { data: null, error: new Error(err.message || 'Erreur confirmation paiement test') }
    }
  },
}
