import React, { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Header } from '@/components/Header'
import { discoveryService } from '@/services/discoveryService'
import { supabase } from '@/lib/supabase'
import type { Restaurant, RestaurantHours } from '@/types/restaurant.types'
import type { MenuWithDetails, MenuItemCategory } from '@/types/menu.types'
import { MENU_ITEM_CATEGORY_LABELS } from '@/types/menu.types'
import { FollowButton } from '@/components/follow/FollowButton'
import { ReservationModal } from '@/components/reservation/ReservationModal'
import { SeoHead } from '@/components/public/SeoHead'
import { GoogleMap } from '@/components/common/GoogleMap'
import { MediaViewerModal, type MediaItem } from '@/components/common/MediaViewerModal'
import {
  Store,
  MapPin,
  Phone,
  Mail,
  Clock,
  Utensils,
  Calendar,
  ChevronLeft,
  Image as ImageIcon,
  Sparkles,
  Maximize2,
  AlertTriangle,
} from 'lucide-react'

export const RestaurantDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [menu, setMenu] = useState<MenuWithDetails | null>(null)
  const [hours, setHours] = useState<RestaurantHours[] | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [notFound, setNotFound] = useState<boolean>(false)

  // Lightbox Media Modal
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false)
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0)

  // Modal de réservation
  const [isReservationModalOpen, setIsReservationModalOpen] = useState<boolean>(false)

  const loadData = useCallback(async () => {
    if (!slug) return
    setLoading(true)
    setNotFound(false)

    const { data: restData } = await discoveryService.fetchRestaurantBySlug(slug)

    if (!restData) {
      setNotFound(true)
      setLoading(false)
      return
    }

    setRestaurant(restData)

    const [menuRes, hoursRes] = await Promise.all([
      discoveryService.fetchPublishedMenu(restData.id),
      discoveryService.fetchRestaurantHours(restData.id),
    ])

    setMenu(menuRes.data)
    setHours(hoursRes.data)
    setLoading(false)
  }, [slug])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Obtenir l'URL publique des photos du menu
  const getPhotoUrl = (storagePath: string) => {
    const { data } = supabase.storage.from('menu-photos').getPublicUrl(storagePath)
    return data.publicUrl
  }

  // Préparer la liste des médias pour la visionneuse
  const mediaItems: MediaItem[] = (menu?.photos || []).map((p) => {
    const url = getPhotoUrl(p.storage_path)
    const isPdf = p.storage_path.toLowerCase().endsWith('.pdf')
    return {
      url,
      title: p.alt_text || (isPdf ? 'Document PDF' : 'Photo de plat'),
      type: isPdf ? 'pdf' : 'image',
    }
  })

  const openMediaModal = (index: number) => {
    setSelectedMediaIndex(index)
    setIsMediaModalOpen(true)
  }

  const daysLabel = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']

  const restaurantTitle = restaurant ? `${restaurant.name} - Menu du Jour & Carte à ${restaurant.city || 'Côte d\'Ivoire'}` : 'Restaurant - Menu du Jour'
  const restaurantDesc = restaurant?.description || `Découvrez les menus du jour et spécialités de ${restaurant?.name || 'ce restaurant'} en temps réel sur Menu du Jour.`
  const restaurantSchema = restaurant ? {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    'name': restaurant.name,
    'description': restaurant.description || '',
    'telephone': restaurant.phone || '',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': restaurant.address || '',
      'addressLocality': restaurant.city || ''
    },
    'url': window.location.href,
    'hasMenu': menu ? {
      '@type': 'Menu',
      'name': menu.title,
      'description': menu.description || ''
    } : undefined
  } : undefined

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <SeoHead
        title={restaurantTitle}
        description={restaurantDesc}
        path={`/restaurants/${slug || ''}`}
        schema={restaurantSchema}
      />
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Bouton retour */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors cursor-pointer shadow-xs"
        >
          <ChevronLeft className="w-4 h-4" />
          Retour
        </button>

        {loading ? (
          <div className="py-20 bg-white rounded-2xl border border-slate-200 text-center space-y-4 shadow-xs">
            <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto" />
            <p className="text-sm font-medium text-slate-600">Chargement du restaurant...</p>
          </div>
        ) : notFound || !restaurant ? (
          <div className="py-16 bg-white rounded-2xl border border-slate-200 text-center space-y-4 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 mx-auto flex items-center justify-center font-bold">
              <Store className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Restaurant introuvable</h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              L'établissement que vous recherchez n'existe pas ou n'est plus disponible sur Menu du Jour.
            </p>
            <Link
              to="/decouvrir"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-xs transition-colors"
            >
              Découvrir d'autres restaurants
            </Link>
          </div>
        ) : (
          <>
            {/* Header Fiche Restaurant */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden space-y-6">
              {/* Photo de couverture */}
              <div className="h-48 sm:h-64 bg-slate-900 relative">
                {restaurant.cover_image_url ? (
                  <img
                    src={restaurant.cover_image_url}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-slate-900 via-slate-800 to-orange-950 flex items-center justify-center text-white/20">
                    <Store className="w-20 h-20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              </div>

              {/* Contenu Header */}
              <div className="px-6 pb-6 -mt-16 sm:-mt-20 relative z-10 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div className="flex items-end gap-4">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white p-1.5 border-2 border-white shadow-xl shrink-0 overflow-hidden">
                      {restaurant.logo_url ? (
                        <img
                          src={restaurant.logo_url}
                          alt={restaurant.name}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        <div className="w-full h-full bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center font-bold text-2xl">
                          <Store className="w-10 h-10" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-1 text-slate-900">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 text-[10px] font-extrabold uppercase tracking-wider">
                          {restaurant.cuisine_type || 'Cuisine variée'}
                        </span>
                      </div>
                      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                        {restaurant.name}
                      </h1>
                      {restaurant.city && (
                        <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-orange-600" />
                          {restaurant.city} {restaurant.address ? `• ${restaurant.address}` : ''}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions Suivi & Réservation */}
                  <div className="flex items-center gap-3 pt-2 sm:pt-0">
                    <FollowButton restaurantId={restaurant.id} />

                    {restaurant.accepts_reservations !== false ? (
                      <button
                        onClick={() => setIsReservationModalOpen(true)}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 flex items-center gap-2 transition-all cursor-pointer"
                      >
                        <Calendar className="w-4 h-4" />
                        Réserver une table
                      </button>
                    ) : (
                      <span className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-500 font-bold text-xs flex items-center gap-1.5 border border-slate-200">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                        Réservations en ligne désactivées
                      </span>
                    )}
                  </div>
                </div>

                {restaurant.description && (
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                    {restaurant.description}
                  </p>
                )}
              </div>
            </div>

            {/* Menu du Jour Publié */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Utensils className="w-5 h-5 text-orange-600" />
                    <h2 className="text-lg font-extrabold text-slate-900">Menu du Jour</h2>
                  </div>
                  <p className="text-xs text-slate-500">
                    {menu ? `Proposé aujourd'hui par ${restaurant.name}` : 'Menu non disponible pour le moment'}
                  </p>
                </div>

                {menu && (
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                    Menu disponible
                  </span>
                )}
              </div>

              {!menu || !menu.items || menu.items.length === 0 ? (
                <div className="py-12 text-center space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 mx-auto flex items-center justify-center font-bold">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-base">
                    Ce restaurant n'a pas encore publié son menu du jour.
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Suivez cet établissement pour ne manquer aucune publication ou repassez un peu plus tard.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Titre & Description du menu */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                    <h3 className="font-extrabold text-slate-900 text-base">{menu.title}</h3>
                    {menu.description && (
                      <p className="text-xs text-slate-600 italic">{menu.description}</p>
                    )}
                  </div>

                  {/* Plats du menu par catégories */}
                  <div className="space-y-4">
                    {['entree', 'plat', 'dessert', 'boisson', 'formule', 'autre'].map((cat) => {
                      const categoryItems = menu.items.filter((i) => i.category === cat)
                      if (categoryItems.length === 0) return null

                      return (
                        <div key={cat} className="space-y-3">
                          <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-orange-600 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-600" />
                            {MENU_ITEM_CATEGORY_LABELS[cat as MenuItemCategory] || cat}
                          </h4>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {categoryItems.map((item) => (
                              <div
                                key={item.id}
                                className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between space-y-2"
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <h5 className="font-bold text-slate-900 text-sm">{item.name}</h5>
                                    {item.description && (
                                      <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                                    )}
                                    {item.accompaniment && (
                                      <p className="text-[11px] text-amber-700 font-medium mt-1">
                                        Accompagnement : {item.accompaniment}
                                      </p>
                                    )}
                                  </div>

                                  <span className="font-mono font-extrabold text-slate-900 text-sm shrink-0 bg-slate-100 px-2.5 py-1 rounded-lg">
                                    {item.price.toLocaleString('fr-FR')} FCFA
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Photos et Documents PDF du menu */}
                  {menu.photos && menu.photos.length > 0 && (
                    <div className="space-y-3 pt-4 border-t border-slate-100">
                      <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4 text-orange-600" />
                        Visuels et Carte PDF du menu
                      </h4>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {menu.photos.map((photo, idx) => {
                          const url = getPhotoUrl(photo.storage_path)
                          const isPdf = photo.storage_path.toLowerCase().endsWith('.pdf')

                          return (
                            <div
                              key={photo.id}
                              onClick={() => openMediaModal(idx)}
                              className="aspect-square rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 group shadow-xs cursor-pointer relative flex flex-col items-center justify-center"
                            >
                              {isPdf ? (
                                <div className="w-full h-full p-4 bg-slate-900 text-white flex flex-col items-center justify-center text-center space-y-2">
                                  <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
                                    PDF
                                  </div>
                                  <span className="text-xs font-bold truncate max-w-full px-2">
                                    {photo.alt_text || 'Carte PDF'}
                                  </span>
                                  <span className="text-[10px] text-orange-400 font-bold underline">
                                    Ouvrir le document
                                  </span>
                                </div>
                              ) : (
                                <>
                                  <img
                                    src={url}
                                    alt={photo.alt_text || 'Photo de plat'}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                  />
                                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                    <Maximize2 className="w-6 h-6" />
                                  </div>
                                </>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Localisation Google Maps & Infos pratiques */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-md">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2 border-b border-slate-100 pb-3">
                <MapPin className="w-5 h-5 text-orange-600" />
                Localisation & Itinéraire Google Maps
              </h3>

              <GoogleMap
                latitude={restaurant.latitude}
                longitude={restaurant.longitude}
                address={restaurant.formatted_address || restaurant.address}
                restaurantName={restaurant.name}
                interactive={false}
              />
            </div>

            {/* Infos pratiques & Horaires */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Coordonnées */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
                <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
                  <Store className="w-4 h-4 text-orange-600" />
                  Coordonnées & Contact
                </h3>

                <div className="space-y-3 text-xs">
                  {restaurant.phone && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Téléphone</span>
                        <a href={`tel:${restaurant.phone}`} className="font-bold text-slate-900 hover:text-orange-600">
                          {restaurant.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {restaurant.email && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Email</span>
                        <a href={`mailto:${restaurant.email}`} className="font-bold text-slate-900 hover:text-orange-600">
                          {restaurant.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {restaurant.address && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Adresse</span>
                        <span className="font-bold text-slate-900">
                          {restaurant.address} {restaurant.city ? `, ${restaurant.city}` : ''}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Horaires d'ouverture */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
                <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-600" />
                  Horaires d'ouverture
                </h3>

                {hours && hours.length > 0 ? (
                  <div className="space-y-2 text-xs">
                    {daysLabel.map((dayName, idx) => {
                      const hourRow = hours.find((h) => h.day_of_week === idx)
                      return (
                        <div
                          key={dayName}
                          className="flex items-center justify-between py-1 border-b border-slate-50 last:border-0"
                        >
                          <span className="font-semibold text-slate-700">{dayName}</span>
                          {hourRow && !hourRow.is_closed && hourRow.open_time && hourRow.close_time ? (
                            <span className="font-mono font-bold text-slate-900">
                              {hourRow.open_time.slice(0, 5)} — {hourRow.close_time.slice(0, 5)}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">Fermé</span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic py-4 text-center">
                    Les horaires de cet établissement ne sont pas renseignés.
                  </p>
                )}
              </div>
            </div>

            {/* Modal Lightbox Images / PDF */}
            <MediaViewerModal
              isOpen={isMediaModalOpen}
              onClose={() => setIsMediaModalOpen(false)}
              items={mediaItems}
              initialIndex={selectedMediaIndex}
            />

            {/* Modal de réservation */}
            {isReservationModalOpen && (
              <ReservationModal
                isOpen={isReservationModalOpen}
                onClose={() => setIsReservationModalOpen(false)}
                restaurant={restaurant}
                menus={menu ? [menu] : []}
              />
            )}
          </>
        )}
      </main>
    </div>
  )
}
