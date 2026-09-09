import React, { useState } from 'react'
import type { Restaurant, RestaurantHours } from '@/types/restaurant.types'
import { restaurantService } from '@/services/restaurantService'
import { RestaurantHoursForm } from './RestaurantHoursForm'
import { GoogleMap } from '@/components/common/GoogleMap'
import {
  Store,
  Upload,
  MapPin,
  Calendar,
  Save,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
} from 'lucide-react'

interface RestaurantProfileSettingsProps {
  restaurant: Restaurant
  hours: RestaurantHours[] | null
  onRefresh: () => void
}

export const RestaurantProfileSettings: React.FC<RestaurantProfileSettingsProps> = ({
  restaurant,
  hours,
  onRefresh,
}) => {
  const [activeSection, setActiveSection] = useState<'general' | 'assets' | 'location' | 'reservations' | 'hours'>('general')

  // Formulaire général
  const [name, setName] = useState(restaurant.name || '')
  const [description, setDescription] = useState(restaurant.description || '')
  const [phone, setPhone] = useState(restaurant.phone || '')
  const [email, setEmail] = useState(restaurant.email || '')
  const [address, setAddress] = useState(restaurant.address || '')
  const [city, setCity] = useState(restaurant.city || '')
  const [cuisineType, setCuisineType] = useState(restaurant.cuisine_type || '')

  // Paramètres de réservation (BLOC 7)
  const [acceptsReservations, setAcceptsReservations] = useState<boolean>(restaurant.accepts_reservations ?? true)
  const [maxPartySize, setMaxPartySize] = useState<number>(restaurant.max_party_size ?? 10)
  const [capacity, setCapacity] = useState<number>(restaurant.capacity ?? 20)
  const [reservationInstructions, setReservationInstructions] = useState<string>(restaurant.reservation_instructions || '')

  // Géolocalisation (BLOC 5)
  const [latitude, setLatitude] = useState<number | null>(restaurant.latitude)
  const [longitude, setLongitude] = useState<number | null>(restaurant.longitude)
  const [formattedAddress, setFormattedAddress] = useState<string>(restaurant.formatted_address || restaurant.address || '')
  const [googlePlaceId, setGooglePlaceId] = useState<string | null>(restaurant.google_place_id || null)

  // Uploads (BLOC 2)
  const [logoUrl, setLogoUrl] = useState<string | null>(restaurant.logo_url)
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(restaurant.cover_image_url)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)

  // États globaux de soumission
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Sauvegarder les informations générales
  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccessMessage(null)
    setErrorMessage(null)

    const { error } = await restaurantService.updateRestaurant(restaurant.id, {
      name,
      description,
      phone,
      email,
      address,
      city,
      cuisine_type: cuisineType,
      capacity,
    })

    setLoading(false)
    if (error) {
      setErrorMessage(error.message)
    } else {
      setSuccessMessage('Informations du restaurant sauvegardées avec succès.')
      onRefresh()
    }
  }

  // Upload du Logo
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingLogo(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    const { url, error } = await restaurantService.uploadRestaurantAsset(restaurant.id, file, 'logo')
    setUploadingLogo(false)

    if (error) {
      setErrorMessage(error.message)
    } else if (url) {
      setLogoUrl(url)
      setSuccessMessage('Logo du restaurant mis à jour avec succès.')
      onRefresh()
    }
  }

  // Upload de l'Image de Couverture
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingCover(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    const { url, error } = await restaurantService.uploadRestaurantAsset(restaurant.id, file, 'cover')
    setUploadingCover(false)

    if (error) {
      setErrorMessage(error.message)
    } else if (url) {
      setCoverImageUrl(url)
      setSuccessMessage('Photo de couverture mise à jour avec succès.')
      onRefresh()
    }
  }

  // Sauvegarder la Géolocalisation
  const handleSaveLocation = async () => {
    if (latitude === null || longitude === null) {
      setErrorMessage('Veuillez sélectionner ou positionner le marker du restaurant sur la carte.')
      return
    }

    setLoading(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    const { error } = await restaurantService.updateRestaurantLocation(restaurant.id, {
      latitude,
      longitude,
      address: address || formattedAddress,
      formatted_address: formattedAddress,
      google_place_id: googlePlaceId || undefined,
    })

    setLoading(false)
    if (error) {
      setErrorMessage(error.message)
    } else {
      setSuccessMessage('Position GPS et coordonnées Google Maps enregistrées.')
      onRefresh()
    }
  }

  // Sauvegarder les paramètres de Réservation (BLOC 7)
  const handleSaveReservations = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    const { error } = await restaurantService.updateRestaurantReservationSettings(restaurant.id, {
      accepts_reservations: acceptsReservations,
      max_party_size: maxPartySize,
      reservation_instructions: reservationInstructions,
      capacity,
    })

    setLoading(false)
    if (error) {
      setErrorMessage(error.message)
    } else {
      setSuccessMessage('Paramètres de réservation mis à jour avec succès.')
      onRefresh()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Fiche Restaurant */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {logoUrl ? (
            <img src={logoUrl} alt={name} className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-xs" />
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xl border border-orange-200">
              <Store className="w-7 h-7" />
            </div>
          )}
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">{name}</h2>
            <p className="text-xs text-slate-500">{city ? `${city} • ${cuisineType || 'Cuisine variée'}` : 'Configuration du profil et coordonnées'}</p>
          </div>
        </div>

        {/* Tabs de section */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1.5 rounded-xl text-xs font-bold w-full sm:w-auto">
          <button
            onClick={() => setActiveSection('general')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${activeSection === 'general' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Général
          </button>
          <button
            onClick={() => setActiveSection('assets')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${activeSection === 'assets' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Images & Logo
          </button>
          <button
            onClick={() => setActiveSection('location')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${activeSection === 'location' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Localisation
          </button>
          <button
            onClick={() => setActiveSection('reservations')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${activeSection === 'reservations' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Réservations
          </button>
          <button
            onClick={() => setActiveSection('hours')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${activeSection === 'hours' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Horaires
          </button>
        </div>
      </div>

      {/* Alerte Messages */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* SECTION 1 : INFORMATIONS GÉNÉRALES */}
      {activeSection === 'general' && (
        <form onSubmit={handleSaveGeneral} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center gap-2 text-slate-900 font-extrabold text-base pb-3 border-b border-slate-100">
            <Store className="w-5 h-5 text-orange-600" />
            <span>Informations du Restaurant</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Nom de l'établissement *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Type de cuisine</label>
              <input
                type="text"
                value={cuisineType}
                onChange={(e) => setCuisineType(e.target.value)}
                placeholder="ex: Ivoirienne, Grillades, Africaine..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Téléphone officiel</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+225 0700000000"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Adresse email de contact</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contact@restaurant.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Ville</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Abidjan, Yamoussoukro, Bouaké..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Adresse physique</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="ex: Rue des Jardins, Cocody Deux-Plateaux"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Description & Histoire de l'établissement</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Présentez les spécialités et le cadre de votre restaurant..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Sauvegarde en cours...' : 'Sauvegarder le profil'}
            </button>
          </div>
        </form>
      )}

      {/* SECTION 2 : UPLOAD DES IMAGES (LOGO & COUVERTURE) - BLOC 2 */}
      {activeSection === 'assets' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center gap-2 text-slate-900 font-extrabold text-base pb-3 border-b border-slate-100">
            <ImageIcon className="w-5 h-5 text-orange-600" />
            <span>Images Officielles du Restaurant (Supabase Storage)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Upload Logo */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 text-center">
              <h4 className="font-extrabold text-slate-900 text-sm">Logo du Restaurant</h4>
              <div className="relative w-24 h-24 mx-auto rounded-2xl overflow-hidden border-2 border-slate-300 bg-white shadow-xs flex items-center justify-center">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <Store className="w-10 h-10 text-slate-300" />
                )}
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Recommandé : Image carrée JPG, PNG ou WebP (max 5 Mo).
              </p>

              <label className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer w-full">
                <Upload className="w-4 h-4" />
                {uploadingLogo ? 'Téléchargement...' : 'Téléverser un logo'}
                <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleLogoUpload} disabled={uploadingLogo} className="hidden" />
              </label>
            </div>

            {/* 2. Upload Couverture */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 text-center">
              <h4 className="font-extrabold text-slate-900 text-sm">Photo de Couverture</h4>
              <div className="relative w-full h-24 rounded-2xl overflow-hidden border-2 border-slate-300 bg-white shadow-xs flex items-center justify-center">
                {coverImageUrl ? (
                  <img src={coverImageUrl} alt="Couverture" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-10 h-10 text-slate-300" />
                )}
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Recommandé : Image panoramique HD (max 5 Mo).
              </p>

              <label className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer w-full">
                <Upload className="w-4 h-4 text-orange-400" />
                {uploadingCover ? 'Téléchargement...' : 'Téléverser une couverture'}
                <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleCoverUpload} disabled={uploadingCover} className="hidden" />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3 : LOCALISATION & GOOGLE MAPS - BLOC 5 */}
      {activeSection === 'location' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center gap-2 text-slate-900 font-extrabold text-base pb-3 border-b border-slate-100">
            <MapPin className="w-5 h-5 text-orange-600" />
            <span>Localisation Google Maps & GPS</span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Positionnez exactement votre établissement sur la carte afin de permettre à vos clients de trouver l'itinéraire en 1 clic.
          </p>

          <GoogleMap
            latitude={latitude}
            longitude={longitude}
            address={formattedAddress || address}
            restaurantName={name}
            interactive={true}
            onLocationChange={(loc) => {
              setLatitude(loc.latitude)
              setLongitude(loc.longitude)
              if (loc.address) setFormattedAddress(loc.address)
              if (loc.google_place_id) setGooglePlaceId(loc.google_place_id)
            }}
          />

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={handleSaveLocation}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Enregistrement...' : 'Enregistrer les coordonnées GPS'}
            </button>
          </div>
        </div>
      )}

      {/* SECTION 4 : PARAMÈTRES DE RÉSERVATION - BLOC 7 */}
      {activeSection === 'reservations' && (
        <form onSubmit={handleSaveReservations} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center gap-2 text-slate-900 font-extrabold text-base pb-3 border-b border-slate-100">
            <Calendar className="w-5 h-5 text-orange-600" />
            <span>Paramètres des Réservations en Ligne</span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-orange-50/60 border border-orange-200">
              <div className="space-y-0.5">
                <span className="font-extrabold text-slate-900 text-sm block">Accepter les réservations en ligne</span>
                <span className="text-xs text-slate-600 block">Active ou désactive la possibilité pour les clients de faire des demandes de tables.</span>
              </div>
              <input
                type="checkbox"
                checked={acceptsReservations}
                onChange={(e) => setAcceptsReservations(e.target.checked)}
                className="w-5 h-5 text-orange-600 rounded-md focus:ring-orange-500 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Nombre max de personnes par réservation</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={maxPartySize}
                  onChange={(e) => setMaxPartySize(parseInt(e.target.value, 10) || 10)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Capacité totale de la salle (couverts)</label>
                <input
                  type="number"
                  min={1}
                  value={capacity}
                  onChange={(e) => setCapacity(parseInt(e.target.value, 10) || 20)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Instructions ou consignes particulières pour les clients</label>
              <textarea
                rows={3}
                value={reservationInstructions}
                onChange={(e) => setReservationInstructions(e.target.value)}
                placeholder="ex: Les réservations sont maintenues 15 minutes. Merci de nous contacter en cas de retard."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Enregistrement...' : 'Enregistrer les paramètres'}
            </button>
          </div>
        </form>
      )}

      {/* SECTION 5 : HORAIRES D'OUVERTURE */}
      {activeSection === 'hours' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <RestaurantHoursForm restaurantId={restaurant.id} existingHours={hours} onSaved={onRefresh} />
        </div>
      )}
    </div>
  )
}
