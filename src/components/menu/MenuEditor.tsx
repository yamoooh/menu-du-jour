import React, { useState, useEffect } from 'react'
import type { MenuWithDetails, MenuItem, MenuItemCategory } from '@/types/menu.types'
import { MENU_ITEM_CATEGORY_LABELS } from '@/types/menu.types'
import { menuService } from '@/services/menuService'
import { MenuItemModal } from '@/components/menu/MenuItemModal'
import { MenuPhotoUploader } from '@/components/menu/MenuPhotoUploader'
import {
  Calendar,
  Utensils,
  Plus,
  ArrowUp,
  ArrowDown,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Save,
  Send,
  ArrowLeft,
} from 'lucide-react'

import type { Subscription } from '@/types/restaurant.types'
import { subscriptionService } from '@/services/subscriptionService'
import { AlertTriangle, ExternalLink } from 'lucide-react'

interface MenuEditorProps {
  restaurantId: string
  subscription?: Subscription | null
  menuToEdit?: MenuWithDetails | null
  onBack: () => void
  onSaved: (updatedMenuId: string) => void
}

export const MenuEditor: React.FC<MenuEditorProps> = ({
  restaurantId,
  subscription = null,
  menuToEdit,
  onBack,
  onSaved,
}) => {
  const isEditing = Boolean(menuToEdit)
  const subInfo = subscriptionService.getSubscriptionInfo(subscription)
  const isExpired = subInfo.isExpired

  // Champs du menu principal
  const [title, setTitle] = useState('Menu du jour')
  const [description, setDescription] = useState('')
  const [menuDate, setMenuDate] = useState(new Date().toISOString().split('T')[0])
  const [status, setStatus] = useState<'draft' | 'published'>('draft')

  // Menu créé ou en cours d'édition
  const [activeMenuId, setActiveMenuId] = useState<string | null>(menuToEdit?.id || null)
  const [items, setItems] = useState<MenuItem[]>(menuToEdit?.items || [])
  const [photos, setPhotos] = useState(menuToEdit?.photos || [])

  // Modals & états
  const [isItemModalOpen, setIsItemModalOpen] = useState(false)
  const [itemToEdit, setItemToEdit] = useState<MenuItem | null>(null)
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    if (menuToEdit) {
      setTitle(menuToEdit.title || 'Menu du jour')
      setDescription(menuToEdit.description || '')
      setMenuDate(menuToEdit.menu_date)
      setStatus(menuToEdit.status)
      setActiveMenuId(menuToEdit.id)
      setItems(menuToEdit.items || [])
      setPhotos(menuToEdit.photos || [])
    }
  }, [menuToEdit])

  // Recharger le menu complet
  const refreshActiveMenu = async (mId: string) => {
    const { data } = await menuService.fetchMenuById(mId)
    if (data) {
      setTitle(data.title)
      setDescription(data.description || '')
      setMenuDate(data.menu_date)
      setStatus(data.status)
      setItems(data.items || [])
      setPhotos(data.photos || [])
    }
  }

  // Assurer la création initiale du menu si pas encore créé en BDD
  const ensureMenuExists = async (): Promise<string | null> => {
    if (activeMenuId) return activeMenuId

    if (!title.trim() || !menuDate) {
      setError('Veuillez renseigner un titre et une date pour le menu.')
      return null
    }

    setLoading(true)
    const { data, error: createErr } = await menuService.createMenu({
      restaurant_id: restaurantId,
      title,
      description,
      menu_date: menuDate,
      status: 'draft',
    })
    setLoading(false)

    if (createErr) {
      setError(createErr.message)
      return null
    }

    if (data) {
      setActiveMenuId(data.id)
      return data.id
    }
    return null
  }

  // Enregistrer ou Publier
  const handleSaveMenu = async (targetStatus: 'draft' | 'published') => {
    if (isExpired) {
      setError('Votre abonnement a expiré. Renouvelez votre abonnement pour continuer à utiliser les fonctionnalités professionnelles de Menu du Jour.')
      return
    }

    setError(null)
    setSuccessMessage(null)

    let mId = activeMenuId

    if (!mId) {
      mId = await ensureMenuExists()
      if (!mId) return
    }

    if (targetStatus === 'published' && items.length === 0) {
      setError('Veuillez ajouter au moins un plat avant de publier le menu.')
      return
    }

    setLoading(true)
    const { data, error: updateErr } = await menuService.updateMenu(mId, {
      title,
      description,
      menu_date: menuDate,
      status: targetStatus,
    })
    setLoading(false)

    if (updateErr) {
      setError(updateErr.message)
    } else if (data) {
      setStatus(data.status)
      setSuccessMessage(
        targetStatus === 'published'
          ? 'Votre menu du jour a été publié avec succès !'
          : 'Votre menu a été enregistré en brouillon.'
      )
      onSaved(data.id)
    }
  }

  // Ajouter / Modifier un plat
  const handleSaveItem = async (itemData: {
    name: string
    description?: string
    price: number
    category: MenuItemCategory
    accompaniment?: string
  }) => {
    let mId = activeMenuId
    if (!mId) {
      mId = await ensureMenuExists()
      if (!mId) return
    }

    if (itemToEdit) {
      const { error: updateErr } = await menuService.updateMenuItem(itemToEdit.id, itemData)
      if (updateErr) throw updateErr
    } else {
      const { error: addErr } = await menuService.addMenuItem({
        menu_id: mId,
        restaurant_id: restaurantId,
        ...itemData,
        display_order: items.length,
      })
      if (addErr) throw addErr
    }

    await refreshActiveMenu(mId)
  }

  // Supprimer un plat
  const handleDeleteItem = async () => {
    if (!itemToDelete || !activeMenuId) return

    const { error: delErr } = await menuService.deleteMenuItem(itemToDelete.id)
    setItemToDelete(null)

    if (delErr) {
      setError(delErr.message)
    } else {
      await refreshActiveMenu(activeMenuId)
    }
  }

  // Monter / Descendre un plat
  const handleMoveItem = async (index: number, direction: 'up' | 'down') => {
    if (!activeMenuId) return
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= items.length) return

    const newItems = [...items]
    const temp = newItems[index]
    newItems[index] = newItems[targetIndex]
    newItems[targetIndex] = temp

    const reordered = newItems.map((it, idx) => ({ id: it.id, display_order: idx }))
    setItems(newItems)

    await menuService.reorderMenuItems(reordered)
  }

  return (
    <div className="space-y-6">
      {/* Alerte si abonnement expiré */}
      {isExpired && (
        <div className="p-5 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs space-y-3 shadow-xs">
          <div className="font-bold flex items-center gap-2 text-sm text-red-900">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
            Abonnement expiré — Édition suspendue
          </div>
          <p className="text-red-700 leading-relaxed">
            Votre abonnement a expiré. Renouvelez votre abonnement pour continuer à utiliser les fonctionnalités professionnelles de Menu du Jour.
          </p>
          <button
            onClick={async () => {
              const { checkoutUrl, error: checkoutError } = await subscriptionService.createCheckoutSession(restaurantId)
              if (checkoutError || !checkoutUrl) {
                alert(checkoutError?.message || 'Impossible de créer la session de paiement LeekPay. Veuillez réessayer.')
                return
              }
              window.open(checkoutUrl, '_blank', 'noopener,noreferrer')
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
            Renouveler mon abonnement
          </button>
        </div>
      )}

      {/* Header Éditeur */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux menus
        </button>

        <div className="flex items-center gap-2">
          {status === 'published' ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Publié
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Brouillon
            </span>
          )}
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Formulaire principal Menu */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">
          {isEditing ? 'Éditer le menu du jour' : 'Nouveau menu du jour'}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">
              Date du menu <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="date"
                value={menuDate}
                onChange={(e) => setMenuDate(e.target.value)}
                required
                disabled={loading}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">
              Titre du menu <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Menu Spécial du Jour"
              required
              disabled={loading}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-semibold"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 block">
            Description / Remarque du chef (Optionnel)
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ex: Formule disponible jusqu'à 15h00. Ingrédients frais du marché."
            disabled={loading}
            className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          />
        </div>
      </div>

      {/* Section Éléments (Plats) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
              <Utensils className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Plats et Formules du menu</h4>
              <p className="text-xs text-slate-500">Ajoutez les propositions gourmandes du jour</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setItemToEdit(null)
              setIsItemModalOpen(true)
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Ajouter un plat
          </button>
        </div>

        {items.length === 0 ? (
          <div className="p-8 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400 space-y-2">
            <p>Aucun plat n'a encore été ajouté à ce menu.</p>
            <button
              type="button"
              onClick={() => {
                setItemToEdit(null)
                setIsItemModalOpen(true)
              }}
              className="text-orange-600 hover:underline font-semibold"
            >
              + Ajouter le premier plat
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item, idx) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3 flex-1">
                  <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 text-sm">{item.name}</span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-orange-100 text-orange-800 border border-orange-200">
                        {MENU_ITEM_CATEGORY_LABELS[item.category] || item.category}
                      </span>
                      <span className="font-extrabold text-xs text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                        {item.price.toLocaleString('fr-FR')} FCFA
                      </span>
                    </div>

                    {item.accompaniment && (
                      <p className="text-xs text-slate-600 font-medium">
                        Accompagnement : <span className="text-slate-800">{item.accompaniment}</span>
                      </p>
                    )}

                    {item.description && (
                      <p className="text-xs text-slate-500 italic">{item.description}</p>
                    )}
                  </div>
                </div>

                {/* Actions sur l'élément */}
                <div className="flex items-center gap-1 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => handleMoveItem(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded-lg hover:bg-slate-200"
                    title="Déplacer vers le haut"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMoveItem(idx, 'down')}
                    disabled={idx === items.length - 1}
                    className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded-lg hover:bg-slate-200"
                    title="Déplacer vers le bas"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setItemToEdit(item)
                      setIsItemModalOpen(true)
                    }}
                    className="p-1.5 text-slate-600 hover:text-orange-600 rounded-lg hover:bg-orange-50"
                    title="Modifier le plat"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setItemToDelete(item)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                    title="Supprimer le plat"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section Photos (uniquement si le menu existe en BDD) */}
      {activeMenuId && (
        <MenuPhotoUploader
          restaurantId={restaurantId}
          menuId={activeMenuId}
          photos={photos}
          onPhotosUpdated={() => refreshActiveMenu(activeMenuId)}
        />
      )}

      {/* Barre d'actions d'enregistrement / publication */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors w-full sm:w-auto"
        >
          Annuler / Retour
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={() => handleSaveMenu('draft')}
            disabled={loading}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 text-xs font-semibold transition-colors disabled:opacity-60 cursor-pointer"
          >
            <Save className="w-4 h-4 text-slate-500" />
            Enregistrer en brouillon
          </button>

          <button
            type="button"
            onClick={() => handleSaveMenu('published')}
            disabled={loading}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all disabled:opacity-60 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            {loading ? 'Publication...' : 'Publier le menu'}
          </button>
        </div>
      </div>

      {/* Modal Ajout/Édition de plat */}
      <MenuItemModal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        onSave={handleSaveItem}
        itemToEdit={itemToEdit}
      />

      {/* Modal Confirmation Suppression de plat */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-sm p-6 space-y-4 text-center">
            <h4 className="font-bold text-slate-900 text-base">Supprimer ce plat ?</h4>
            <p className="text-xs text-slate-600">
              Êtes-vous sûr de vouloir retirer <strong>{itemToDelete.name}</strong> de ce menu ?
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleDeleteItem}
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
