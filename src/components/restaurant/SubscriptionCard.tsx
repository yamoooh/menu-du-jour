import React, { useState, useEffect } from 'react'
import type { Subscription, Payment } from '@/types/restaurant.types'
import { subscriptionService } from '@/services/subscriptionService'
import { useLanguage } from '@/context/LanguageContext'
import {
  CreditCard,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

interface SubscriptionCardProps {
  subscription: Subscription | null
  restaurantId?: string
  onRefresh?: () => void
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  subscription,
  restaurantId,
}) => {
  const { t } = useLanguage()
  const [payments, setPayments] = useState<Payment[]>([])
  const [loadingPayments, setLoadingPayments] = useState(false)

  const info = subscriptionService.getSubscriptionInfo(subscription)

  useEffect(() => {
    if (restaurantId) {
      setLoadingPayments(true)
      subscriptionService.fetchPayments(restaurantId).then(({ data }) => {
        setPayments(data || [])
        setLoadingPayments(false)
      })
    }
  }, [restaurantId, subscription?.updated_at])

  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [activePlanLoading, setActivePlanLoading] = useState<'monthly' | 'annual' | null>(null)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)

  const handleRenewLeekPay = async (planType: 'monthly' | 'annual' = 'monthly') => {
    if (!restaurantId) return
    setCheckoutLoading(true)
    setActivePlanLoading(planType)
    setCheckoutError(null)

    const { checkoutUrl, error } = await subscriptionService.createCheckoutSession(restaurantId, planType)
    setCheckoutLoading(false)
    setActivePlanLoading(null)

    if (error) {
      setCheckoutError(error.message || 'Erreur lors de la génération de la session LeekPay')
      return
    }

    if (checkoutUrl) {
      window.open(checkoutUrl, '_blank', 'noopener,noreferrer')
    }
  }

  const formatDate = (d: Date | null | string) => {
    if (!d) return 'Non définie'
    const dateObj = typeof d === 'string' ? new Date(d) : d
    return dateObj.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
      {/* En-tête de la carte */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold shadow-xs border border-orange-200">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg tracking-tight">
              {t.subscription.proPlan}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Accès complet aux fonctionnalités de Menu du Jour ({t.subscription.priceText})
            </p>
          </div>
        </div>

        {/* Badge de statut */}
        {subscription?.status === 'trialing' && !info.isExpired && (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            {t.subscription.freeTrial} ({info.remainingDays}{' '}
            {info.remainingDays > 1 ? t.subscription.daysRemaining : t.subscription.dayRemaining})
          </span>
        )}

        {subscription?.status === 'active' && !info.isExpired && (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {t.subscription.activeSubscription}
          </span>
        )}

        {info.isExpired && (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200 shadow-2xs">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            {t.subscription.subscriptionExpired}
          </span>
        )}
      </div>

      {/* Alerte explicative si expiré */}
      {info.isExpired && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs space-y-2">
          <div className="font-bold flex items-center gap-2 text-sm text-red-900">
            <AlertTriangle className="w-4.5 h-4.5 text-red-600 shrink-0" />
            {t.subscription.subscriptionExpired}
          </div>
          <p className="text-red-700 leading-relaxed">
            {t.subscription.expiredMessage}
          </p>
        </div>
      )}

      {/* Grille des dates & détails */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
          <span className="text-slate-500 font-medium block flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-400" />
            {t.subscription.startDate}
          </span>
          <span className="text-slate-900 font-bold text-sm block">
            {subscription?.current_period_start
              ? formatDate(subscription.current_period_start)
              : subscription?.trial_start_at
              ? formatDate(subscription.trial_start_at)
              : 'Non définie'}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
          <span className="text-slate-500 font-medium block flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-slate-400" />
            {t.subscription.expirationDate}
          </span>
          <span className="text-slate-900 font-bold text-sm block">
            {info.formattedExpirationDate}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
          <span className="text-slate-500 font-medium block flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-slate-400" />
            Temps restant
          </span>
          <span className="text-slate-900 font-bold text-sm block">
            {info.remainingDays} {info.remainingDays > 1 ? t.subscription.daysRemaining : t.subscription.dayRemaining}
          </span>
        </div>
      </div>

      {checkoutError && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{checkoutError}</span>
        </div>
      )}

      {/* Grille des Offres Restaurateur (Section F) */}
      <div className="space-y-3 pt-2">
        <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
          <Sparkles className="w-4 h-4 text-orange-600" />
          Formules d'Abonnement Restaurateur
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Offre Mensuelle Actuelle */}
          <div className="bg-gradient-to-br from-orange-50/90 via-amber-50/50 to-white rounded-2xl p-5 border-2 border-orange-500/40 shadow-xs flex flex-col justify-between space-y-4 relative overflow-hidden">
            <div className="absolute top-3 right-3">
              <span className="px-2.5 py-0.5 rounded-full bg-orange-600 text-white text-[10px] font-extrabold uppercase tracking-wider">
                Recommandé
              </span>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-orange-800 uppercase tracking-wider block">
                Pass Mensuel
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-900 font-display">5 000</span>
                <span className="text-xs font-bold text-slate-600">FCFA / mois</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Accès illimité pendant 30 jours à la publication de vos menus, à la gestion de vos réservations et aux alertes PWA.
              </p>
            </div>

            <button
              onClick={() => handleRenewLeekPay('monthly')}
              disabled={checkoutLoading}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {checkoutLoading && activePlanLoading === 'monthly' ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Génération du checkout...</span>
                </>
              ) : (
                <>
                  <ExternalLink className="w-4 h-4" />
                  Souscrire 5 000 FCFA (30 jours) via LeekPay
                </>
              )}
            </button>
          </div>

          {/* Offre Annuelle Actuelle */}
          <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                  Pass Annuel (12 Mois)
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                  Économisez 10 000 FCFA
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-900 font-display">50 000</span>
                <span className="text-xs font-bold text-slate-600">FCFA / an</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Profitez d'un an complet (365 jours) de visibilité sans interruption (soit 2 mois offerts par rapport au tarif mensuel).
              </p>
            </div>

            <button
              onClick={() => handleRenewLeekPay('annual')}
              disabled={checkoutLoading}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {checkoutLoading && activePlanLoading === 'annual' ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Génération du checkout...</span>
                </>
              ) : (
                <>
                  <ExternalLink className="w-4 h-4" />
                  Souscrire 50 000 FCFA (365 jours) via LeekPay
                </>
              )}
            </button>
          </div>
        </div>
      </div>


      {/* Tableau d'historique des paiements */}
      <div className="space-y-3 pt-2">
        <h4 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
          {t.subscription.paymentHistory}
        </h4>

        {loadingPayments ? (
          <div className="py-6 text-center text-xs text-slate-400 animate-pulse">
            Chargement de l'historique des paiements...
          </div>
        ) : payments.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-slate-100">
            {t.subscription.noPayments}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">{t.subscription.amountLabel}</th>
                  <th className="py-2.5 px-3">{t.subscription.providerLabel}</th>
                  <th className="py-2.5 px-3">{t.subscription.statusLabel}</th>
                  <th className="py-2.5 px-3">{t.subscription.referenceLabel}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-medium text-slate-900">
                      {formatDate(p.paid_at || p.created_at)}
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900">
                      {p.amount.toLocaleString('fr-FR')} {p.currency}
                    </td>
                    <td className="py-3 px-3 capitalize font-semibold text-slate-600">
                      {p.provider}
                    </td>
                    <td className="py-3 px-3">
                      {p.status === 'completed' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Payé
                        </span>
                      )}
                      {p.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          En attente
                        </span>
                      )}
                      {p.status === 'failed' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 text-red-700 border border-red-200">
                          Échoué
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-500">
                      {p.provider_transaction_ref || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
