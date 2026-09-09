import React, { useState } from 'react'
import type { MenuWithDetails } from '@/types/menu.types'
import type { Subscription } from '@/types/restaurant.types'
import { subscriptionService } from '@/services/subscriptionService'
import { menuService } from '@/services/menuService'
import { Utensils, Plus, Calendar, Image, Edit, Trash2, Send, AlertCircle, AlertTriangle, ExternalLink } from 'lucide-react'

interface MenuListProps {
  menus: MenuWithDetails[]
  subscription?: Subscription | null
  restaurantId?: string
  onSelectMenuToEdit: (menu: MenuWithDetails) => void
  onCreateNewMenu: () => void
  onRefresh: () => void
}

export const MenuList: React.FC<MenuListProps> = ({
  menus,
  subscription = null,
  restaurantId,
  onSelectMenuToEdit,
  onCreateNewMenu,
  onRefresh,
}) => {
  const [menuToDelete, setMenuToDelete] = useState<MenuWithDetails | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const subInfo = subscriptionService.getSubscriptionInfo(subscription)
  const isExpired = subInfo.isExpired

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

  const handleTogglePublish = async (menu: MenuWithDetails) => {
    if (isExpired) {
      setError('Votre abonnement a expiré. Renouvelez votre abonnement pour continuer à utiliser les fonctionnalités professionnelles de Menu du Jour.')
      return
    }

    setError(null)
    const newStatus = menu.status === 'published' ? 'draft' : 'published'

    setLoading(true)
    const { error: updateErr } = await menuService.updateMenu(menu.id, { status: newStatus })
    setLoading(false)

    if (updateErr) {
      setError(updateErr.message)
    } else {
      onRefresh()
    }
  }

  const handleDeleteConfirm = async () => {
    if (!menuToDelete) return

    setError(null)
    setLoading(true)
    const { error: delErr } = await menuService.deleteMenu(menuToDelete.id)
    setLoading(false)
    setMenuToDelete(null)

    if (delErr) {
      setError(delErr.message)
    } else {
      onRefresh()
    }
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      {/* Alerte abonnement expiré */}
      {isExpired && (
        <div className="p-5 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs space-y-3 shadow-xs">
          <div className="font-bold flex items-center gap-2 text-sm text-red-900">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
            Abonnement expiré — Fonctionnalités de création et édition suspendues
          </div>
          <p className="text-red-700 leading-relaxed">
            Votre abonnement a expiré. Renouvelez votre abonnement pour continuer à utiliser les fonctionnalités professionnelles de Menu du Jour. Vos menus existants et données restent intégralement conservés.
          </p>
          <button
            onClick={handleRenew}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
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

      {/* Header section menus */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Historique des menus</h3>
            <p className="text-xs text-slate-500">
              Consultez, modifiez et publiez vos menus du jour
            </p>
          </div>
        </div>

        <button
          onClick={onCreateNewMenu}
          disabled={isExpired}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all cursor-pointer w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          Créer un nouveau menu
        </button>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Liste des menus */}
      {menus.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 mx-auto flex items-center justify-center font-bold">
            <Utensils className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 text-base">Aucun menu enregistré</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Vous n'avez pas encore créé de menu du jour pour cet établissement.
            </p>
          </div>
          <button
            onClick={onCreateNewMenu}
            disabled={isExpired}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-semibold text-xs shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Créer le premier menu
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {menus.map((menu) => (
            <div
              key={menu.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-slate-300 transition-colors"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h4 className="font-bold text-slate-900 text-base">{menu.title}</h4>

                  {menu.status === 'published' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Publié
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      Brouillon
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                  <span className="flex items-center gap-1 font-medium text-slate-700 capitalize">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {formatDate(menu.menu_date)}
                  </span>
                  <span>•</span>
                  <span>{menu.items.length} {menu.items.length > 1 ? 'plats' : 'plat'}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Image className="w-3.5 h-3.5 text-slate-400" />
                    {menu.photos.length} photo(s)
                  </span>
                  {menu.published_at && (
                    <>
                      <span>•</span>
                      <span className="text-emerald-700 font-medium">
                        Publié le {new Date(menu.published_at).toLocaleDateString('fr-FR')}
                      </span>
                    </>
                  )}
                </div>

                {menu.description && (
                  <p className="text-xs text-slate-600 line-clamp-1 italic">{menu.description}</p>
                )}
              </div>

              {/* Actions sur le menu */}
              <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 border-slate-100 pt-3 md:pt-0">
                <button
                  type="button"
                  onClick={() => handleTogglePublish(menu)}
                  disabled={loading || isExpired}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50 ${
                    menu.status === 'published'
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                  }`}
                >
                  {menu.status === 'published' ? (
                    'Brouillon'
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" /> Publier
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => onSelectMenuToEdit(menu)}
                  disabled={isExpired}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200 disabled:opacity-50 transition-colors cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" />
                  Éditer
                </button>

                <button
                  type="button"
                  onClick={() => setMenuToDelete(menu)}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                  title="Supprimer le menu"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Confirmation de suppression */}
      {menuToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-sm p-6 space-y-4 text-center">
            <h4 className="font-bold text-slate-900 text-base">Supprimer ce menu ?</h4>
            <p className="text-xs text-slate-600">
              Êtes-vous sûr de vouloir supprimer le menu du{' '}
              <strong>{formatDate(menuToDelete.menu_date)}</strong> ? Tous ses plats et photos associés seront définitivement effacés.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setMenuToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={loading}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-700 text-white shadow-sm"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
