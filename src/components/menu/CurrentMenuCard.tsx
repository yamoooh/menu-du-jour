import React, { useState } from 'react'
import type { MenuWithDetails } from '@/types/menu.types'
import { subscriptionService } from '@/services/subscriptionService'
import type { Subscription } from '@/types/restaurant.types'
import { Utensils, Calendar, Plus, Edit, AlertTriangle, ExternalLink } from 'lucide-react'

interface CurrentMenuCardProps {
  menus: MenuWithDetails[]
  subscription: Subscription | null
  restaurantId?: string
  onCreateNewMenu: () => void
  onEditMenu: (menu: MenuWithDetails) => void
}

export const CurrentMenuCard: React.FC<CurrentMenuCardProps> = ({
  menus,
  subscription,
  restaurantId,
  onCreateNewMenu,
  onEditMenu,
}) => {
  const subInfo = subscriptionService.getSubscriptionInfo(subscription)
  const isExpired = subInfo.isExpired

  const todayStr = new Date().toISOString().split('T')[0]
  const todayMenu = menus.find((m) => m.menu_date === todayStr) || menus[0]
  const isToday = todayMenu?.menu_date === todayStr

  const [renewError, setRenewError] = useState<string | null>(null)

  const handleRenew = async () => {
    if (!restaurantId) return
    setRenewError(null)
    const { checkoutUrl, error: checkoutError } = await subscriptionService.createCheckoutSession(restaurantId)
    if (checkoutError || !checkoutUrl) {
      setRenewError(checkoutError?.message || 'Impossible de créer la session de paiement LeekPay. Veuillez réessayer.')
      return
    }
    window.open(checkoutUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white font-bold shadow-xs">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Menu du Jour actuel</h3>
            <p className="text-xs text-slate-500">
              {isToday ? "Menu enregistré pour aujourd'hui" : "Dernier menu disponible"}
            </p>
          </div>
        </div>

        {todayMenu ? (
          todayMenu.status === 'published' ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Menu Publié
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              En Brouillon
            </span>
          )
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            Non encore créé
          </span>
        )}
      </div>

      {isExpired && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs space-y-2">
          <div className="font-bold flex items-center gap-2 text-sm text-red-900">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            Abonnement expiré
          </div>
          <p className="text-red-700">
            Votre abonnement a expiré. Renouvelez votre abonnement pour continuer à utiliser les fonctionnalités professionnelles de Menu du Jour.
          </p>
          <button
            onClick={handleRenew}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Renouveler mon abonnement
          </button>
        </div>
      )}

      {renewError && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{renewError}</span>
        </div>
      )}

      {todayMenu ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900 text-sm">{todayMenu.title}</span>
            <span className="text-slate-500 font-medium flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {new Date(todayMenu.menu_date).toLocaleDateString('fr-FR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </span>
          </div>

          {todayMenu.items.length > 0 ? (
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Aperçu des plats ({todayMenu.items.length})
              </span>
              <div className="space-y-1 text-xs text-slate-700">
                {todayMenu.items.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center justify-between font-medium">
                    <span>• {item.name} {item.accompaniment ? `(${item.accompaniment})` : ''}</span>
                    <span className="font-bold text-slate-900">{item.price.toLocaleString('fr-FR')} FCFA</span>
                  </div>
                ))}
                {todayMenu.items.length > 3 && (
                  <p className="text-[11px] text-orange-600 font-medium pt-1">
                    + {todayMenu.items.length - 3} autre(s) plat(s)...
                  </p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">Aucun plat ajouté dans ce menu.</p>
          )}

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              disabled={isExpired}
              onClick={() => onEditMenu(todayMenu)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-semibold text-xs shadow-sm transition-colors cursor-pointer"
            >
              <Edit className="w-4 h-4" />
              Modifier le menu du jour
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-6 space-y-3">
          <p className="text-xs text-slate-500">
            Vous n'avez pas encore publié le menu du jour pour votre établissement.
          </p>
          <button
            type="button"
            disabled={isExpired}
            onClick={onCreateNewMenu}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Créer le menu du jour
          </button>
        </div>
      )}
    </div>
  )
}
