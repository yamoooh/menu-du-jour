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
  RefreshCw,
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
  onRefresh,
}) => {
  const { t } = useLanguage()
  const [payments, setPayments] = useState<Payment[]>([])
  const [loadingPayments, setLoadingPayments] = useState(false)
  const [testingPayment, setTestingPayment] = useState(false)
  const [testMessage, setTestMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

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

  const handleRenewLeekPay = () => {
    if (restaurantId) {
      const url = subscriptionService.getLeekPayPaymentUrl(restaurantId)
      window.open(url, '_blank', 'noopener,noreferrer')
    } else {
      window.open('https://leekpay.me/menu-du-jour', '_blank', 'noopener,noreferrer')
    }
  }

  const handleTestRenewal = async () => {
    if (!restaurantId) return
    setTestingPayment(true)
    setTestMessage(null)

    const { error } = await subscriptionService.confirmPaymentForTest(restaurantId)
    setTestingPayment(false)

    if (error) {
      setTestMessage({ type: 'error', text: `Échec du test : ${error.message}` })
    } else {
      setTestMessage({
        type: 'success',
        text: 'Paiement de test confirmé ! L\'abonnement a été prolongé de 30 jours avec succès.',
      })
      if (onRefresh) onRefresh()
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

      {/* CTA principal LeekPay */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-5 border border-orange-200/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="font-bold text-slate-900 text-sm">
            Renouveler via LeekPay
          </h4>
          <p className="text-xs text-slate-600">
            Tarif unique : <strong>5 000 FCFA pour 30 jours d'accès</strong>. Redirection sécurisée vers LeekPay.
          </p>
        </div>

        <button
          onClick={handleRenewLeekPay}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-500/20 transition-all cursor-pointer shrink-0"
        >
          <ExternalLink className="w-4 h-4" />
          {t.subscription.renewButton}
        </button>
      </div>

      {/* Section Mode Test / Démo */}
      <div className="p-4 rounded-xl bg-slate-100/80 border border-slate-200 space-y-3 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-800 flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-slate-500" />
            {t.subscription.testPaymentButton}
          </span>
          <button
            onClick={handleTestRenewal}
            disabled={testingPayment || !restaurantId}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white font-semibold transition-colors cursor-pointer"
          >
            {testingPayment ? 'Traitement...' : 'Exécuter le test +30 jours'}
          </button>
        </div>
        <p className="text-slate-500">
          {t.subscription.testPaymentNote}
        </p>

        {testMessage && (
          <div
            className={`p-3 rounded-lg font-medium text-xs ${
              testMessage.type === 'success'
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}
          >
            {testMessage.text}
          </div>
        )}
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
