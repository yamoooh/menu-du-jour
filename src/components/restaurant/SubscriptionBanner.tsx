import React from 'react'
import type { Subscription } from '@/types/restaurant.types'
import { subscriptionService } from '@/services/subscriptionService'
import { useLanguage } from '@/context/LanguageContext'
import { AlertTriangle, CheckCircle2, Clock, CreditCard, Sparkles } from 'lucide-react'

interface SubscriptionBannerProps {
  subscription: Subscription | null
  restaurantId?: string
  onRenewClick?: () => void
}

export const SubscriptionBanner: React.FC<SubscriptionBannerProps> = ({
  subscription,
  restaurantId,
  onRenewClick,
}) => {
  const { t } = useLanguage()
  const info = subscriptionService.getSubscriptionInfo(subscription)

  const [loading, setLoading] = React.useState(false)

  const handleRenew = async () => {
    if (onRenewClick) {
      onRenewClick()
      return
    }
    if (!restaurantId) return

    setLoading(true)
    const { checkoutUrl } = await subscriptionService.createCheckoutSession(restaurantId)
    setLoading(false)

    if (checkoutUrl) {
      window.open(checkoutUrl, '_blank', 'noopener,noreferrer')
    } else {
      // Fallback si l'Edge Function serveur n'est pas encore provisionnée
      const fallbackUrl = subscriptionService.getLeekPayPaymentUrl(restaurantId)
      window.open(fallbackUrl, '_blank', 'noopener,noreferrer')
    }
  }

  if (info.isExpired) {
    return (
      <div className="bg-gradient-to-r from-red-900 via-red-800 to-rose-950 rounded-2xl p-5 sm:p-6 text-white shadow-md border border-red-700 space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-300 flex items-center justify-center font-bold shrink-0 border border-red-400/30">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-red-500/30 text-red-200 text-[11px] font-bold uppercase tracking-wider border border-red-400/30">
                  {t.subscription.subscriptionExpired}
                </span>
              </div>
              <h3 className="font-extrabold text-white text-base sm:text-lg mt-1">
                {t.subscription.subscriptionExpired}
              </h3>
              <p className="text-xs sm:text-sm text-red-100 mt-1 max-w-2xl leading-relaxed">
                {t.subscription.expiredMessage}
              </p>
            </div>
          </div>

          <button
            onClick={handleRenew}
            disabled={loading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-red-50 text-red-900 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer shrink-0 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-red-600/30 border-t-red-600 rounded-full animate-spin" />
            ) : (
              <CreditCard className="w-4 h-4 text-red-600" />
            )}
            {t.subscription.renewButton}
          </button>
        </div>
      </div>
    )
  }

  // Bientôt expiré (<= 3 jours)
  if (info.remainingDays <= 3 && info.remainingDays >= 0) {
    return (
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-orange-950 rounded-2xl p-5 sm:p-6 text-white shadow-md border border-amber-700 space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold shrink-0 border border-amber-400/30">
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/30 text-amber-200 text-[11px] font-bold uppercase tracking-wider border border-amber-400/30">
                  {t.subscription.expiresSoon}
                </span>
              </div>
              <h3 className="font-extrabold text-white text-base sm:text-lg mt-1">
                {t.subscription.expiresSoon} — {info.remainingDays}{' '}
                {info.remainingDays > 1 ? t.subscription.daysRemaining : t.subscription.dayRemaining}
              </h3>
              <p className="text-xs sm:text-sm text-amber-100 mt-1 max-w-2xl">
                Votre accès professionnel expire le <strong>{info.formattedExpirationDate}</strong>. Renouvelez dès maintenant pour ne subir aucune interruption.
              </p>
            </div>
          </div>

          <button
            onClick={handleRenew}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer shrink-0"
          >
            <CreditCard className="w-4 h-4 text-slate-900" />
            {t.subscription.renewButton}
          </button>
        </div>
      </div>
    )
  }

  // Période d'essai valide
  if (subscription?.status === 'trialing') {
    return (
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 rounded-2xl p-5 sm:p-6 text-white shadow-md border border-emerald-800 space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold shrink-0 border border-emerald-400/30">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 text-[11px] font-bold uppercase tracking-wider border border-emerald-400/30">
                  {t.subscription.freeTrial}
                </span>
                <span className="text-xs text-emerald-200 font-semibold">
                  • {info.remainingDays} {info.remainingDays > 1 ? t.subscription.daysRemaining : t.subscription.dayRemaining}
                </span>
              </div>
              <h3 className="font-extrabold text-white text-base sm:text-lg mt-1">
                {t.subscription.freeTrial} ({t.subscription.sevenDaysFree})
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-2xl">
                Accès complet aux fonctionnalités de Menu du Jour jusqu'au <strong>{info.formattedExpirationDate}</strong>.
              </p>
            </div>
          </div>

          <button
            onClick={handleRenew}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all cursor-pointer shrink-0"
          >
            <CreditCard className="w-4 h-4 text-emerald-400" />
            {t.subscription.renewButton}
          </button>
        </div>
      </div>
    )
  }

  // Abonnement actif
  return (
    <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-2xl p-5 sm:p-6 text-white shadow-md border border-emerald-900 space-y-3">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0 border border-emerald-400/30">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 text-[11px] font-bold uppercase tracking-wider border border-emerald-400/30">
                {t.subscription.activeSubscription}
              </span>
            </div>
            <h3 className="font-extrabold text-white text-base sm:text-lg mt-1">
              {t.subscription.activeSubscription}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              {t.subscription.expiresInDays} <strong>{info.remainingDays} {info.remainingDays > 1 ? t.subscription.daysRemaining : t.subscription.dayRemaining}</strong> ({info.formattedExpirationDate})
            </p>
          </div>
        </div>

        <button
          onClick={handleRenew}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md transition-all cursor-pointer shrink-0"
        >
          <CreditCard className="w-4 h-4" />
          {t.subscription.renewButton}
        </button>
      </div>
    </div>
  )
}
