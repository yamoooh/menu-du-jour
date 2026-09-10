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
  Clock,
  Utensils,
  ChevronLeft,
  Sparkles,
  Maximize2,
  AlertTriangle,
  Star,
  Verified,
  FileText,
  Calendar,
  Flame,
  CheckCircle2,
  Info
} from 'lucide-react'

export const RestaurantDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [menu, setMenu] = useState<MenuWithDetails | null>(null)
  const [hours, setHours] = useState<RestaurantHours[] | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [notFound, setNotFound] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<'menu' | 'info'>('menu')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

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

  const getPhotoUrl = (storagePath: string) => {
    const { data } = supabase.storage.from('menu-photos').getPublicUrl(storagePath)
    return data.publicUrl
  }

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
  const defaultCover =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBzLDrclvdg5LvrZitQwZ-CbG7v_GmYSpWhG5dvKmRfMokskIV69sosJAa3do3wlpY6JOKK_4GiDMSCvKuzicJibbTubvYmCP0npvZwR2inxzDc0D_8ksyq2Wym5RZmDUuJkL8rjoEpsTMBu0U-0EPZ88RQhcLmAWbvyJDypYKyny004NqpCzkABSvmi3aeH0uqh9LgZkVKS3KcNhsvgWfLKPSMNGZAjy7dCTul_jf3L1MV8F2zfitT'

  const restaurantTitle = restaurant
    ? `${restaurant.name} — Menu du Jour & Carte à ${restaurant.city || 'Cameroun'}`
    : 'Restaurant — Menu du Jour'

  return (
    <div className="min-h-screen flex flex-col bg-surface font-body-md text-on-surface antialiased selection:bg-secondary-container selection:text-white">
      <SeoHead
        title={restaurantTitle}
        description={restaurant?.description || 'Découvrez les ardoises du jour et réservez votre table.'}
        path={`/restaurant/${slug || ''}`}
      />
      <Header />

      {loading ? (
        <div className="flex-1 flex items-center justify-center py-32">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-4 border-orange-200 border-t-secondary-container rounded-full animate-spin mx-auto" />
            <p className="text-xs font-semibold text-slate-500">Chargement de l'établissement...</p>
          </div>
        </div>
      ) : notFound || !restaurant ? (
        <div className="flex-1 max-w-lg mx-auto px-4 py-24 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 mx-auto flex items-center justify-center font-bold">
            <Store className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 font-display">Restaurant introuvable</h2>
          <p className="text-xs text-slate-500">
            L'établissement demandé n'existe pas ou n'est plus accessible sur la plateforme.
          </p>
          <Link
            to="/decouvrir"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary-container text-white font-bold text-xs shadow-md transition-colors"
          >
            Découvrir d'autres adresses
          </Link>
        </div>
      ) : (
        <>
          {/* Immersive Restaurant Showcase Cover (Stitch Specification) */}
          <div className="relative w-full overflow-hidden bg-primary-container min-h-[320px] md:min-h-[380px] flex items-end">
            <div
              className="absolute inset-0 bg-cover bg-center mix-blend-luminosity opacity-40"
              style={{ backgroundImage: `url('${restaurant.cover_image_url || defaultCover}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-container via-primary-container/70 to-transparent" />
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#bec6e0_1px,transparent_1px)] [background-size:16px_16px]" />

            {/* Back button top overlay */}
            <div className="absolute top-4 left-4 z-20">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-black/40 hover:bg-black/60 backdrop-blur-md text-white text-xs font-semibold transition-colors cursor-pointer border border-white/15"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Retour aux découvertes</span>
              </button>
            </div>

            {/* Header Meta Content */}
            <div className="relative w-full max-w-7xl mx-auto px-4 md:px-8 pb-8 pt-20 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 z-10">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
                {/* Logo Profile Avatar with Glow */}
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-surface-container-lowest shadow-xl p-1 shrink-0 flex items-center justify-center border border-white/20">
                  {restaurant.logo_url ? (
                    <img
                      src={restaurant.logo_url}
                      alt={restaurant.name}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <div className="w-full h-full rounded-xl bg-surface-container-high flex flex-col items-center justify-center text-center p-1 overflow-hidden">
                      <Utensils className="text-secondary w-7 h-7" />
                      <span className="font-headline-sm text-on-surface uppercase tracking-tight text-[10px] font-bold mt-0.5 truncate max-w-full">
                        {restaurant.name}
                      </span>
                    </div>
                  )}
                  <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-secondary-container text-white flex items-center justify-center shadow-md">
                    <Verified className="w-3.5 h-3.5" />
                  </span>
                </div>

                {/* Name & Primary Identifiers */}
                <div className="flex flex-col gap-1 text-on-primary">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-0.5 rounded-full bg-secondary-container/90 text-white font-label-sm text-[11px] font-bold uppercase tracking-wider backdrop-blur-sm">
                      {restaurant.cuisine_type || 'Table Gastronomique & Grill'}
                    </span>
                    <span className="flex items-center gap-1 font-label-sm text-xs text-secondary-fixed">
                      <Star className="w-3.5 h-3.5 fill-secondary-fixed text-secondary-fixed" />
                      <span className="font-bold text-white">4.9</span> (180+ avis)
                    </span>
                  </div>
                  <h1 className="font-display-lg text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-white font-display">
                    {restaurant.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-300 font-body-md text-xs mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-secondary-fixed-dim" />
                      {restaurant.address || 'Bonanjo, Douala, Cameroun'}
                    </span>
                    {restaurant.phone && (
                      <>
                        <span className="text-slate-500">•</span>
                        <a href={`tel:${restaurant.phone}`} className="flex items-center gap-1 hover:text-white transition-colors">
                          <Phone className="w-3.5 h-3.5" />
                          {restaurant.phone}
                        </a>
                      </>
                    )}
                    <span className="text-slate-500">•</span>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md text-white font-label-sm text-[11px]">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Ouvert actuellement (11h30 - 23h00)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Quick Stats Counter Card */}
              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl text-white border border-white/10 shrink-0">
                <div className="flex flex-col">
                  <span className="font-headline-sm text-base text-secondary-fixed font-bold">342</span>
                  <span className="font-label-sm text-[10px] text-slate-300 uppercase tracking-wider">Abonnés fidèles</span>
                </div>
                <div className="h-7 w-px bg-white/20" />
                <div className="flex flex-col">
                  <span className="font-headline-sm text-base text-primary-fixed font-bold">98%</span>
                  <span className="font-label-sm text-[10px] text-slate-300 uppercase tracking-wider">Réservations honorées</span>
                </div>
              </div>
            </div>
          </div>

          {/* Operational Floating Action Hub */}
          <div className="w-full bg-surface-container-lowest shadow-sm z-20 border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
              {/* Nav Tabs */}
              <div className="flex items-center bg-surface-container rounded-lg p-1 gap-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('menu')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-label-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'menu'
                      ? 'bg-surface-container-lowest shadow-xs text-on-surface'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <Utensils className={`w-4 h-4 ${activeTab === 'menu' ? 'text-secondary' : ''}`} />
                  <span>Menu du Jour & Carte</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('info')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-label-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'info'
                      ? 'bg-surface-container-lowest shadow-xs text-on-surface'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <Clock className={`w-4 h-4 ${activeTab === 'info' ? 'text-secondary' : ''}`} />
                  <span>Horaires & Localisation</span>
                </button>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 ml-auto">
                <FollowButton restaurantId={restaurant.id} />

                {menu?.photos && menu.photos.some((p) => p.storage_path.toLowerCase().endsWith('.pdf')) && (
                  <button
                    type="button"
                    onClick={() => {
                      const pdfIndex = menu.photos.findIndex((p) => p.storage_path.toLowerCase().endsWith('.pdf'))
                      if (pdfIndex >= 0) openMediaModal(pdfIndex)
                    }}
                    className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-colors cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-secondary" />
                    <span>Carte PDF</span>
                  </button>
                )}

                {restaurant.accepts_reservations !== false ? (
                  <button
                    type="button"
                    onClick={() => setIsReservationModalOpen(true)}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-secondary-container hover:bg-orange-600 text-white font-label-lg text-xs font-bold shadow-md transition-all cursor-pointer"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Réserver une table</span>
                  </button>
                ) : (
                  <span className="px-3 py-2 rounded-lg bg-slate-100 text-slate-500 font-semibold text-xs flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                    Réservations complètes
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Main Viewport Canvas */}
          <div className="max-w-7xl w-full mx-auto px-4 md:px-8 py-8">
            {activeTab === 'menu' && (
              <div className="flex flex-col gap-8">
                {/* Chef's Daily Special Banner (Stitch Specification) */}
                <div className="relative w-full rounded-2xl bg-surface-container-high p-6 md:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 overflow-hidden border border-slate-200/80 shadow-xs">
                  <div className="flex flex-col gap-2 z-10 max-w-xl">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed w-fit font-label-sm text-[11px] font-bold uppercase tracking-wider">
                      <Flame className="w-3.5 h-3.5 text-secondary" />
                      <span>Sélection du Marché des Halles • Ce Midi</span>
                    </div>
                    <h2 className="font-headline-lg text-xl md:text-2xl text-on-surface font-bold font-display">
                      {menu ? menu.title : 'Ardoise & Formules Exécutives'}
                    </h2>
                    <p className="font-body-md text-xs text-on-surface-variant leading-relaxed">
                      {menu?.description ||
                        "Produits frais acheminés quotidiennement des côtes maritimes et des hauts plateaux de l'Ouest. Recettes traditionnelles revisitées au feu de bois."}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 pt-1 font-data-mono text-xs text-secondary font-bold">
                      <span>Service en 40 min garanti</span>
                      <span className="text-slate-300">•</span>
                      <span>Paiement par Mobile Money & Espèces</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 z-10 shrink-0">
                    <div className="text-right">
                      <span className="font-label-sm text-[10px] text-on-surface-variant block uppercase tracking-wider font-semibold">
                        Fraîcheur vérifiée
                      </span>
                      <span className="font-headline-sm text-sm text-on-surface font-bold">
                        Ardoise du Jour
                      </span>
                    </div>
                    <div className="w-11 h-11 rounded-xl bg-surface-container-lowest flex items-center justify-center text-secondary shadow-xs border border-slate-200">
                      <Verified className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                {/* Categories Filter Chips */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('all')}
                    className={`px-4 py-1.5 rounded-full font-semibold whitespace-nowrap shadow-xs transition-colors cursor-pointer ${
                      selectedCategory === 'all'
                        ? 'bg-primary text-white'
                        : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface border border-slate-200'
                    }`}
                  >
                    Tous les mets ({menu?.items ? menu.items.length : 0})
                  </button>
                  {['entree', 'plat', 'dessert', 'boisson', 'formule'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-1.5 rounded-full font-semibold whitespace-nowrap shadow-xs transition-colors cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-secondary-container text-white'
                          : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface border border-slate-200'
                      }`}
                    >
                      {MENU_ITEM_CATEGORY_LABELS[cat as MenuItemCategory] || cat}
                    </button>
                  ))}
                </div>

                {/* Dishes Grid */}
                {!menu || !menu.items || menu.items.length === 0 ? (
                  <div className="py-16 text-center space-y-3 p-6 bg-surface-container-lowest rounded-2xl border border-slate-200">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center font-bold">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-800 text-sm">
                      Ardoise en cours de préparation
                    </h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Ce restaurant n'a pas encore publié son menu aujourd'hui. Suivez l'établissement pour recevoir une notification dès sa parution.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {menu.items
                      .filter((i) => selectedCategory === 'all' || i.category === selectedCategory)
                      .map((item) => (
                        <div
                          key={item.id}
                          className="relative bg-surface-container-lowest rounded-xl p-5 shadow-xs border border-slate-200/80 hover:shadow-md transition-all flex flex-col justify-between gap-3 group"
                        >
                          <div className="flex flex-col gap-1">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-headline-sm text-sm font-bold text-on-surface truncate">
                                {item.name}
                              </h4>
                              <span className="font-data-mono text-sm text-secondary font-bold whitespace-nowrap">
                                {item.price.toLocaleString('fr-FR')} FCFA
                              </span>
                            </div>
                            {item.description && (
                              <p className="font-body-sm text-xs text-on-surface-variant line-clamp-2">
                                {item.description}
                              </p>
                            )}
                            {item.accompaniment && (
                              <span className="font-body-sm text-[11px] text-amber-800 font-medium flex items-center gap-1 mt-1">
                                <Info className="w-3 h-3 text-amber-600" />
                                Accompagnement : {item.accompaniment}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-label-sm text-[10px] font-semibold">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>En stock / Disponible</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setIsReservationModalOpen(true)}
                              className="text-secondary hover:text-orange-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <span>Réserver</span>
                              <ChevronLeft className="w-3.5 h-3.5 rotate-180" />
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}

                {/* Photos and PDF gallery if any */}
                {menu?.photos && menu.photos.length > 0 && (
                  <div className="pt-4 border-t border-slate-200 space-y-4">
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-secondary" />
                      Visuels & Carte Imprimée
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {menu.photos.map((photo, idx) => {
                        const url = getPhotoUrl(photo.storage_path)
                        const isPdf = photo.storage_path.toLowerCase().endsWith('.pdf')
                        return (
                          <div
                            key={photo.id}
                            onClick={() => openMediaModal(idx)}
                            className="aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group shadow-xs cursor-pointer relative flex flex-col items-center justify-center"
                          >
                            {isPdf ? (
                              <div className="w-full h-full p-4 bg-slate-900 text-white flex flex-col items-center justify-center text-center space-y-1">
                                <FileText className="w-8 h-8 text-secondary" />
                                <span className="text-xs font-bold truncate max-w-full">
                                  {photo.alt_text || 'Carte PDF'}
                                </span>
                                <span className="text-[10px] text-secondary font-bold underline">
                                  Consulter PDF
                                </span>
                              </div>
                            ) : (
                              <>
                                <img
                                  src={url}
                                  alt={photo.alt_text || 'Photo de plat'}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                  <Maximize2 className="w-5 h-5" />
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

            {/* Tab 2: Horaires & Localisation */}
            {activeTab === 'info' && (
              <div className="flex flex-col gap-8">
                {/* Google Map Section */}
                <div className="bg-surface-container-lowest rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                  <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2 border-b border-slate-100 pb-3">
                    <MapPin className="w-5 h-5 text-secondary" />
                    Localisation de l'établissement
                  </h3>
                  <GoogleMap
                    latitude={restaurant.latitude}
                    longitude={restaurant.longitude}
                    address={restaurant.formatted_address || restaurant.address}
                    restaurantName={restaurant.name}
                    interactive={true}
                  />
                </div>

                {/* Practical info cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Coordonnées */}
                  <div className="bg-surface-container-lowest rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
                    <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
                      <Store className="w-4 h-4 text-secondary" />
                      Coordonnées directes
                    </h3>
                    <div className="space-y-3 text-xs">
                      {restaurant.phone && (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-orange-50 text-secondary flex items-center justify-center shrink-0">
                            <Phone className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[11px]">Téléphone direct</span>
                            <a href={`tel:${restaurant.phone}`} className="font-bold text-slate-900 hover:text-secondary">
                              {restaurant.phone}
                            </a>
                          </div>
                        </div>
                      )}
                      {restaurant.address && (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                            <MapPin className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[11px]">Adresse physique</span>
                            <span className="font-bold text-slate-900">
                              {restaurant.address} {restaurant.city ? `, ${restaurant.city}` : ''}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Horaires d'ouverture */}
                  <div className="bg-surface-container-lowest rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
                    <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-secondary" />
                      Horaires d'ouverture
                    </h3>
                    {hours && hours.length > 0 ? (
                      <div className="space-y-2 text-xs">
                        {daysLabel.map((dayName, idx) => {
                          const hourRow = hours.find((h) => h.day_of_week === idx)
                          return (
                            <div key={dayName} className="flex items-center justify-between py-1 border-b border-slate-100 last:border-0">
                              <span className="font-medium text-slate-700">{dayName}</span>
                              {hourRow && !hourRow.is_closed && hourRow.open_time && hourRow.close_time ? (
                                <span className="font-data-mono font-bold text-slate-900">
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
                        Horaires standards : 11h30 — 15h00 & 19h00 — 23h00
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
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
    </div>
  )
}
