import React, { useState, useEffect } from 'react'
import type { Restaurant } from '@/types/restaurant.types'
import { restaurantService } from '@/services/restaurantService'
import { Store, Phone, Mail, MapPin, Building, Utensils, X, Check, AlertCircle } from 'lucide-react'

interface RestaurantFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (restaurant: Restaurant) => void
  restaurantToEdit?: Restaurant | null
}

export const RestaurantFormModal: React.FC<RestaurantFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  restaurantToEdit,
}) => {
  const isEditing = Boolean(restaurantToEdit)

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [cuisineType, setCuisineType] = useState('')
  const [description, setDescription] = useState('')
  const [capacity, setCapacity] = useState<number>(20)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (restaurantToEdit) {
      setName(restaurantToEdit.name || '')
      setPhone(restaurantToEdit.phone || '')
      setEmail(restaurantToEdit.email || '')
      setAddress(restaurantToEdit.address || '')
      setCity(restaurantToEdit.city || '')
      setCuisineType(restaurantToEdit.cuisine_type || '')
      setDescription(restaurantToEdit.description || '')
      setCapacity(restaurantToEdit.capacity || 20)
    } else {
      setName('')
      setPhone('')
      setEmail('')
      setAddress('')
      setCity('')
      setCuisineType('')
      setDescription('')
      setCapacity(20)
    }
    setError(null)
  }, [restaurantToEdit, isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('Le nom du restaurant est obligatoire.')
      return
    }

    setLoading(true)

    if (isEditing && restaurantToEdit) {
      const { data, error: updateErr } = await restaurantService.updateRestaurant(restaurantToEdit.id, {
        name,
        phone,
        email,
        address,
        city,
        cuisine_type: cuisineType,
        description,
        capacity,
      })

      setLoading(false)

      if (updateErr) {
        setError(updateErr.message)
      } else if (data) {
        onSuccess(data)
        onClose()
      }
    } else {
      const { data, error: createErr } = await restaurantService.createRestaurant({
        name,
        phone,
        email,
        address,
        city,
        cuisine_type: cuisineType,
        description,
        capacity,
      })

      setLoading(false)

      if (createErr) {
        setError(createErr.message)
      } else if (data) {
        onSuccess(data)
        onClose()
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
              <Store className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              {isEditing ? 'Modifier les informations' : 'Créer un nouveau restaurant'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">
              Nom du restaurant <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Store className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Le Petit Abidjan"
                required
                disabled={loading}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">
                Téléphone du restaurant
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+225 0700000000"
                  disabled={loading}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">
                Email professionnel
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@restaurant.com"
                  disabled={loading}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">
                Ville
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Abidjan (Cocody)"
                  disabled={loading}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">
                Spécialité / Type de cuisine
              </label>
              <div className="relative">
                <Utensils className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={cuisineType}
                  onChange={(e) => setCuisineType(e.target.value)}
                  placeholder="Africaine, Grillades..."
                  disabled={loading}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">
              Adresse complète
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Rue des Jardins, face à la banque"
                disabled={loading}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">
              Capacité maximale d'accueil (couverts)
            </label>
            <input
              type="number"
              min="1"
              max="500"
              value={capacity}
              onChange={(e) => setCapacity(parseInt(e.target.value) || 20)}
              disabled={loading}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">
              Description / Présentation
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Présentez votre restaurant en quelques phrases..."
              disabled={loading}
              className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors"
            />
          </div>

          {/* Modal Footer */}
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
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-md shadow-orange-500/20 flex items-center gap-1.5 hover:opacity-95 transition-all disabled:opacity-60"
            >
              {loading ? (
                'Enregistrement...'
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  {isEditing ? 'Enregistrer les modifications' : 'Créer le restaurant'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
