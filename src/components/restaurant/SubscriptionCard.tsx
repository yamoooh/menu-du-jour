import React, { useState } from 'react'
import type { Subscription } from '@/types/restaurant.types'
import { CreditCard, Calendar, Clock, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react'

interface SubscriptionCardProps {
  subscription: Subscription | null
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ subscription }) => {
  const [showPaymentInfo, setShowPaymentInfo] = useState(false)

  if (!subscription) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs animate-pulse">
        <div className="h-4 bg-slate-200 rounded-md w-1/3 mb-2" />
        <div className="h-3 bg-slate-100 rounded-md w-2/3" />
      </div>
    )
  }

  const { status, trial_end_at, current_period_end } = subscription

  const now = new Date()
  const trialEnd = trial_end_at ? new Date(trial_end_at) : null
  const periodEnd = current_period_end ? new Date(current_period_end) : null

  let remainingDays = 0
  if (status === 'trialing' && trialEnd) {
    const diffMs = trialEnd.getTime() - now.getTime()
    remainingDays = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)))
  } else if (status === 'active' && periodEnd) {
    const diffMs = periodEnd.getTime() - now.getTime()
    remainingDays = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)))
  }

  const isExpired = status === 'expired' || (status === 'trialing' && remainingDays === 0)

  const formatDate = (d: Date | null) => {
    if (!d) return 'Non définie'
    return d.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5 relative">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Abonnement professionnel</h3>
            <p className="text-xs text-slate-500">
              Forfait d'accès aux fonctionnalités restaurant (5 000 FCFA / 30 jours)
            </p>
          </div>
        </div>

        {/* Badge de statut */}
        {status === 'trialing' && !isExpired && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Essai gratuit ({remainingDays} {remainingDays > 1 ? 'jours restants' : 'jour restant'})
          </span>
        )}

        {status === 'active' && !isExpired && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Abonnement actif
          </span>
        )}

        {isExpired && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
            <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
            Abonnement expiré
          </span>
        )}
      </div>

      {/* Alerte si expiré */}
      {isExpired && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs space-y-1">
          <div className="font-bold flex items-center gap-2 text-sm text-red-900">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            Accès professionnel suspendu
          </div>
          <p className="text-red-700">
            Votre période d'essai ou votre abonnement a expiré. Vos données et votre restaurant restent intégralement conservés, mais le renouvellement de votre abonnement est nécessaire pour continuer à utiliser les fonctions professionnelles.
          </p>
        </div>
      )}

      {/* Détails dates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
          <span className="text-slate-400 font-medium block flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            Période d'essai (7 jours)
          </span>
          <span className="text-slate-900 font-semibold block text-sm">
            Jusqu'au {formatDate(trialEnd)}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
          <span className="text-slate-400 font-medium block flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            Fin de validité actuelle
          </span>
          <span className="text-slate-900 font-semibold block text-sm">
            {periodEnd ? formatDate(periodEnd) : trialEnd ? formatDate(trialEnd) : 'Non défini'}
          </span>
        </div>
      </div>

      {/* Action renouvellement */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <p className="text-xs text-slate-500">
          Tarif forfaitaire : <strong className="text-slate-800">5 000 FCFA / 30 jours</strong> via LeekPay.
        </p>

        <button
          onClick={() => setShowPaymentInfo(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-semibold text-xs shadow-md shadow-orange-500/20 transition-all cursor-pointer"
        >
          <CreditCard className="w-4 h-4" />
          Renouveler mon abonnement
        </button>
      </div>

      {/* Information sur le paiement LeekPay (modal simple) */}
      {showPaymentInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                  <Info className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Paiement LeekPay</h4>
              </div>
              <button
                onClick={() => setShowPaymentInfo(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Le paiement de l'abonnement professionnel (<strong>5 000 FCFA pour 30 jours</strong> via LeekPay) sera disponible très prochainement lors de la prochaine étape.
            </p>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs">
              Pendant cette phase d'intégration, votre restaurant reste configuré et prêt pour la suite.
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowPaymentInfo(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Compris
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
