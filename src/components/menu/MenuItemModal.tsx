import React, { useState, useEffect } from 'react'
import type { MenuItem, MenuItemCategory } from '@/types/menu.types'
import { MENU_ITEM_CATEGORY_LABELS } from '@/types/menu.types'
import { Utensils, X, Check, AlertCircle } from 'lucide-react'

interface MenuItemModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (itemData: {
    name: string
    description?: string
    price: number
    category: MenuItemCategory
    accompaniment?: string
  }) => Promise<void>
  itemToEdit?: MenuItem | null
}

export const MenuItemModal: React.FC<MenuItemModalProps> = ({
  isOpen,
  onClose,
  onSave,
  itemToEdit,
}) => {
  const isEditing = Boolean(itemToEdit)

  const [name, setName] = useState('')
  const [accompaniment, setAccompaniment] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState<number>(2500)
  const [category, setCategory] = useState<MenuItemCategory>('plat')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (itemToEdit) {
      setName(itemToEdit.name || '')
      setAccompaniment(itemToEdit.accompaniment || '')
      setDescription(itemToEdit.description || '')
      setPrice(itemToEdit.price || 0)
      setCategory(itemToEdit.category || 'plat')
    } else {
      setName('')
      setAccompaniment('')
      setDescription('')
      setPrice(2500)
      setCategory('plat')
    }
    setError(null)
  }, [itemToEdit, isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('Veuillez renseigner le nom du plat ou de la formule.')
      return
    }

    if (price < 0) {
      setError('Le prix ne peut pas être négatif.')
      return
    }

    setLoading(true)
    try {
      await onSave({
        name: name.trim(),
        accompaniment: accompaniment.trim() || undefined,
        description: description.trim() || undefined,
        price,
        category,
      })
      onClose()
    } catch (err) {
      setError('Erreur lors de l\'enregistrement de l\'élément.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
              <Utensils className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              {isEditing ? 'Modifier le plat' : 'Ajouter un élément au menu'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">
              Catégorie <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as MenuItemCategory)}
              disabled={loading}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            >
              {(Object.keys(MENU_ITEM_CATEGORY_LABELS) as MenuItemCategory[]).map((cat) => (
                <option key={cat} value={cat}>
                  {MENU_ITEM_CATEGORY_LABELS[cat]}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">
              Nom du plat / Intitulé <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Poulet Yassa / Poisson Braisé"
              required
              disabled={loading}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">
              Accompagnement (Optionnel)
            </label>
            <input
              type="text"
              value={accompaniment}
              onChange={(e) => setAccompaniment(e.target.value)}
              placeholder="Ex: Riz parfumé, Alloco, Attiéké, Frites..."
              disabled={loading}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">
              Prix (FCFA) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              step="500"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
              required
              disabled={loading}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors font-semibold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">
              Description complémentaire (Optionnel)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Servie avec sauce oignons et piment frais..."
              disabled={loading}
              className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-md shadow-orange-500/20 flex items-center gap-1.5 hover:opacity-95 transition-all disabled:opacity-60 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              {isEditing ? 'Enregistrer le plat' : 'Ajouter au menu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
