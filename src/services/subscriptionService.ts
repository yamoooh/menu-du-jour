import { supabase } from '@/lib/supabase'
import type { Subscription, Payment, SubscriptionInfo } from '@/types/restaurant.types'

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

  // Créer une session de paiement officielle via l'Edge Function serveur create-leekpay-checkout
  async createCheckoutSession(
    restaurantId: string,
    planType: 'monthly' | 'annual' = 'monthly'
  ): Promise<{ checkoutUrl: string | null; error: Error | null }> {
    if (!supabase) return { checkoutUrl: null, error: new Error('Client Supabase non initialisé') }

    try {
      const { data, error } = await supabase.functions.invoke('create-leekpay-checkout', {
        body: { restaurant_id: restaurantId, plan_type: planType },
      })

      if (error) {
        return { checkoutUrl: null, error: new Error(error.message || 'Erreur lors de la génération de la session LeekPay') }
      }

      if (data?.error) {
        return { checkoutUrl: null, error: new Error(data.error) }
      }

      const checkoutUrl = data?.checkout_url
      if (!checkoutUrl) {
        return { checkoutUrl: null, error: new Error('URL de paiement LeekPay manquante dans la réponse serveur') }
      }

      return { checkoutUrl, error: null }
    } catch (err: any) {
      return { checkoutUrl: null, error: new Error(err.message || 'Erreur de connexion à l Edge Function LeekPay') }
    }
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
