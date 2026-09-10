import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Header } from '@/components/Header'
import { discoveryService } from '@/services/discoveryService'
import type { Restaurant } from '@/types/restaurant.types'
import { SeoHead } from '@/components/public/SeoHead'
import { ReservationModal } from '@/components/reservation/ReservationModal'
import {
  Search,
  SlidersHorizontal,
  Bookmark,
  Star,
  Clock,
  MapPin,
  Utensils,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Locate,
  Layers,
  ArrowRight,
  Sparkles,
  Store
} from 'lucide-react'

export const ClientDiscoveryPage: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedCity, setSelectedCity] = useState<string>('all')
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('all')
  const [filterOpenNow, setFilterOpenNow] = useState<boolean>(false)
  const [filterActiveMenu, setFilterActiveMenu] = useState<boolean>(true)
  const [filterBudget, setFilterBudget] = useState<boolean>(false)
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [followedSet, setFollowedSet] = useState<Set<string>>(new Set())

  const loadRestaurants = useCallback(async (query?: string) => {
    setLoading(true)
    const { data } = await discoveryService.fetchActiveRestaurants(query)
    setRestaurants(data || [])
    if (data && data.length > 0 && !selectedRestaurantId) {
      setSelectedRestaurantId(data[0].id)
    }
    setLoading(false)
  }, [selectedRestaurantId])

  useEffect(() => {
    const timer = setTimeout(() => {
      loadRestaurants(searchQuery)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery, loadRestaurants])

  // Toggle bookmark
  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setFollowedSet((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // Filtered restaurants
  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((r) => {
      if (selectedCity !== 'all') {
        const cityMatch = (r.city || '').toLowerCase().includes(selectedCity.toLowerCase())
        if (!cityMatch) return false
      }
      if (selectedNeighborhood !== 'all') {
        const nMatch = (r.address || '').toLowerCase().includes(selectedNeighborhood.toLowerCase())
        if (!nMatch) return false
      }
      return true
    })
  }, [restaurants, selectedCity, selectedNeighborhood])

  const selectedRestaurant = useMemo(() => {
    return (
      restaurants.find((r) => r.id === selectedRestaurantId) ||
      restaurants[0] ||
      null
    )
  }, [restaurants, selectedRestaurantId])

  const defaultImages = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuB1rbD_K3yosV-Dyz2XJxtKUggVrCPFhN85nDGQWI4_au0KCvOsdLZw6-Sj3nlGiowtqVKcdEJt1aGVbsptLjGFZLgnRLDtGjaI5aCAgt3gwWAM-78pR5x-7AAh-k7vXg5efTYzunh-A96fahaGdFgbl7LVPwQ9J_wuFTMRPHeFdCqVNsD1_8bN6M_4fSOtg-dUtkqi_q2g_DBsaM68gOm_MUuPqn9mxrbaeunCrSJbYQviYeDJxKyZ',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAJWcTdq21c45yuiKUllftBFvfEyRJ-HF6ExuumOBJIqGJx86xjFbZvGh_iK1SxQio7L2eDu_U25ee80oKCMpXtGLvJUvlTCNikEnxuOw0P5pTHOAEmiuyqf6yR_O-gHghQlLr5rPCoJ_OQa3D508J1LSY8G5IH2HxhYXbQY3c3cOzZy0lI77v1ZDJuGubtakNcyr2cUxqmkOl4tHaC2fU5IjgOsuXhl-DVH47UjY3sIrZ-GYnUJfmq',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDXfd8RzkmNjVTceb32aub4jbVt_LCBJzBVabF-wh-Yv-ZZBMktwUzJ4tQxIW_AK7-euV8bTywl1fVc_sXwe00WShXvWC5f5233ZcekJtKfecDStqqjASYJGpsZ4pmi8tUjscWvgCpybLEVfV3XfVyp_2WCLV9pU3gnRnmMFelH1DUKVp85XUZhy1WlOJOKC2eDnyHws6fXvaHQ4rBYYdmxOzgJ6_R3swRNyjYoHfDRSe62kH-Gpi89',
  ]

  return (
    <div className="min-h-screen flex flex-col bg-surface font-body-md text-on-surface antialiased selection:bg-secondary-container selection:text-white">
      <SeoHead
        title="Espace Client — Découverte & Recherche | Menu du Jour"
        description="Recherchez et découvrez les tables gastronomiques et leurs menus du jour publiés en temps réel à Douala et Yaoundé."
        path="/decouvrir"
      />
      <Header />

      {/* Filter & Search Control Panel (Stitch Specification) */}
      <section className="sticky top-16 z-30 bg-surface-container-lowest/95 backdrop-blur-md px-4 md:px-8 py-3 shadow-xs border-b border-slate-200/70">
        <div className="max-w-[1600px] mx-auto flex flex-col gap-3">
          {/* Search row with Counter */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Search bar */}
            <div className="relative flex-1 max-w-3xl">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par nom de restaurant, plat ou quartier..."
                className="w-full h-11 pl-11 pr-28 bg-surface-container-low text-on-surface placeholder:text-slate-400 font-body-md text-xs sm:text-sm rounded-xl outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary-container transition-all"
              />
              <div className="absolute inset-y-1.5 right-1.5 flex items-center gap-1 pr-1">
                <button
                  type="button"
                  onClick={() => loadRestaurants(searchQuery)}
                  className="h-8 px-3 rounded-lg bg-secondary-container hover:bg-orange-600 text-white font-label-md text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Filtrer</span>
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Live Availability Counter Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-high/70 text-on-surface text-xs font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-container opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary-container" />
              </span>
              <p className="font-label-md">
                <span className="font-bold text-secondary">{filteredRestaurants.length} restaurants partenaires</span> disponibles aujourd'hui
              </p>
            </div>
          </div>

          {/* City Navigation Pills & Neighborhoods */}
          <div className="flex flex-col gap-1.5 pt-1">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
              <button
                type="button"
                onClick={() => {
                  setSelectedCity('all')
                  setSelectedNeighborhood('all')
                }}
                className={`px-3.5 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCity === 'all'
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                Toutes les villes
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedCity('douala')
                  setSelectedNeighborhood('all')
                }}
                className={`px-3.5 py-1.5 rounded-full font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                  selectedCity === 'douala'
                    ? 'bg-secondary-fixed text-on-secondary-fixed'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                <span>Douala</span>
                <span className="font-data-mono text-[10px] bg-white/70 px-1.5 py-0.5 rounded-full font-bold">
                  {restaurants.filter((r) => (r.city || '').toLowerCase().includes('douala')).length || 14}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedCity('yaounde')
                  setSelectedNeighborhood('all')
                }}
                className={`px-3.5 py-1.5 rounded-full font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                  selectedCity === 'yaounde'
                    ? 'bg-secondary-fixed text-on-secondary-fixed'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                <span>Yaoundé</span>
                <span className="font-data-mono text-[10px] bg-white/70 px-1.5 py-0.5 rounded-full font-bold">
                  {restaurants.filter((r) => (r.city || '').toLowerCase().includes('yaounde')).length || 7}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedCity('kribi')
                  setSelectedNeighborhood('all')
                }}
                className={`px-3.5 py-1.5 rounded-full font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCity === 'kribi'
                    ? 'bg-secondary-fixed text-on-secondary-fixed'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                Kribi
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedCity('bafoussam')
                  setSelectedNeighborhood('all')
                }}
                className={`px-3.5 py-1.5 rounded-full font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCity === 'bafoussam'
                    ? 'bg-secondary-fixed text-on-secondary-fixed'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                Bafoussam
              </button>

              {/* Neighborhood quick-jumps */}
              <div className="h-4 w-px bg-slate-300 mx-1 shrink-0" />
              <span className="font-label-sm text-[11px] uppercase tracking-wider text-slate-400 shrink-0 font-semibold">
                Quartiers :
              </span>

              {['Bonanjo', 'Akwa', 'Bonapriso', 'Bastos', 'Omnisports'].map((nb) => (
                <button
                  key={nb}
                  type="button"
                  onClick={() => setSelectedNeighborhood(nb.toLowerCase())}
                  className={`px-2.5 py-1 rounded-md text-[11px] whitespace-nowrap cursor-pointer transition-colors ${
                    selectedNeighborhood === nb.toLowerCase()
                      ? 'bg-surface-container-highest text-on-surface font-bold'
                      : 'hover:bg-surface-container text-on-surface-variant'
                  }`}
                >
                  {nb}
                </button>
              ))}
            </div>

            {/* Quick Criteria Filter Toggles */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 text-xs">
              <button
                type="button"
                onClick={() => setFilterOpenNow(!filterOpenNow)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                  filterOpenNow
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-surface-container-lowest text-on-surface shadow-xs hover:bg-surface-container'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                <span>Ouvert maintenant</span>
              </button>

              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-surface-container-lowest text-on-surface text-[11px] font-semibold shadow-xs hover:bg-surface-container transition-colors cursor-pointer"
              >
                <Utensils className="w-3.5 h-3.5 text-secondary" />
                <span>Réservations acceptées</span>
              </button>

              <button
                type="button"
                onClick={() => setFilterActiveMenu(!filterActiveMenu)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-semibold shadow-xs transition-colors cursor-pointer ${
                  filterActiveMenu
                    ? 'bg-secondary-fixed text-on-secondary-fixed'
                    : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-secondary" />
                <span>Menus du jour actifs</span>
              </button>

              <button
                type="button"
                onClick={() => setFilterBudget(!filterBudget)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-semibold shadow-xs transition-colors cursor-pointer ${
                  filterBudget
                    ? 'bg-orange-100 text-orange-800'
                    : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container'
                }`}
              >
                <span>Formule midi &lt; 5 000 FCFA</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Split Layout: Listing (7 cols) vs Interactive Map (5 cols) */}
      <main className="max-w-[1600px] w-full mx-auto px-4 md:px-8 py-6 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Restaurant Cards Stream */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Results Meta Bar */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="font-headline-sm text-base font-bold text-on-surface font-display">
                  Établissements sélectionnés
                </span>
                <span className="font-data-mono text-xs text-on-surface-variant">
                  / {filteredRestaurants.length} tables
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="font-label-sm text-on-surface-variant font-medium">Trier par :</span>
                <select className="bg-surface-container-lowest font-label-sm text-xs text-on-surface rounded-lg px-2.5 py-1 outline-none shadow-xs border border-slate-200 cursor-pointer">
                  <option>Pertinence gastronomique</option>
                  <option>Distance (plus proche)</option>
                  <option>Note des convives</option>
                  <option>Prix de la formule midi</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="py-16 bg-surface-container-lowest rounded-2xl border border-slate-200 text-center space-y-3 shadow-xs">
                <div className="w-8 h-8 border-3 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto" />
                <p className="text-xs font-medium text-slate-500">Chargement des tables gastronomiques...</p>
              </div>
            ) : filteredRestaurants.length === 0 ? (
              <div className="py-16 bg-surface-container-lowest rounded-2xl border border-slate-200 text-center space-y-3 p-6 shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                  <Store className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 text-base">
                  Aucun établissement trouvé
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Essayez d'élargir vos filtres ou de sélectionner une autre métropole.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {filteredRestaurants.map((restaurant, idx) => {
                  const isSelected = selectedRestaurantId === restaurant.id
                  const isFollowed = followedSet.has(restaurant.id)
                  const fallbackImg = defaultImages[idx % defaultImages.length]

                  return (
                    <article
                      key={restaurant.id}
                      onClick={() => setSelectedRestaurantId(restaurant.id)}
                      className={`bg-surface-container-lowest rounded-xl shadow-md border overflow-hidden flex flex-col sm:flex-row transition-all group cursor-pointer ${
                        isSelected
                          ? 'border-secondary-container ring-1 ring-secondary-container'
                          : 'border-slate-100 hover:-translate-y-0.5'
                      }`}
                    >
                      {/* Left Visual Block */}
                      <div className="relative sm:w-64 h-52 sm:h-auto shrink-0 overflow-hidden bg-surface-container">
                        <img
                          src={restaurant.cover_image_url || fallbackImg}
                          alt={restaurant.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 flex flex-col gap-1">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-container text-white font-label-sm text-[10px] font-bold shadow-sm backdrop-blur-sm uppercase tracking-wider">
                            <Sparkles className="w-3 h-3" /> Formule du Jour
                          </span>
                        </div>
                        <button
                          type="button"
                          aria-label="Ajouter aux favoris"
                          onClick={(e) => toggleBookmark(restaurant.id, e)}
                          className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-white/85 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-transform cursor-pointer ${
                            isFollowed ? 'text-secondary-container' : 'text-slate-500 hover:text-secondary-container'
                          }`}
                        >
                          <Bookmark className={`w-4 h-4 ${isFollowed ? 'fill-secondary-container' : ''}`} />
                        </button>
                      </div>

                      {/* Card Content Body */}
                      <div className="p-5 flex flex-col justify-between flex-1 min-w-0">
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 text-xs">
                                <span className="font-data-mono uppercase tracking-wider text-secondary font-bold text-[11px]">
                                  {restaurant.cuisine_type || 'Gastronomie & Terroir'}
                                </span>
                                <span className="text-slate-300">•</span>
                                <span className="font-label-sm text-on-surface-variant text-xs">
                                  {restaurant.city || 'Douala'} {restaurant.address ? `- ${restaurant.address.split(',')[0]}` : ''}
                                </span>
                              </div>
                              <h3 className="font-headline-sm text-base font-bold text-on-surface truncate mt-0.5">
                                {restaurant.name}
                              </h3>
                            </div>

                            {/* Rating pill */}
                            <div className="flex items-center gap-1 px-2 py-0.5 bg-surface-container-high rounded-full shrink-0 text-xs">
                              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                              <span className="font-data-mono font-bold text-on-surface">4.8</span>
                              <span className="text-slate-400 text-[10px]">(120+)</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-xs mb-3">
                            <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="text-on-surface font-medium">Ouvert :</span>
                            <span>11h30 - 23h00</span>
                            <span className="text-slate-300">•</span>
                            <span className="text-secondary font-data-mono font-semibold">À 1.5 km</span>
                          </div>

                          {/* Today's Special Teaser Box */}
                          <div className="p-3 rounded-lg bg-surface-container-low mb-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">
                                Ardoise de ce midi
                              </span>
                              <span className="font-data-mono text-xs font-bold text-secondary">
                                Dès 4 500 FCFA
                              </span>
                            </div>
                            <p className="font-body-sm text-xs text-on-surface line-clamp-1">
                              {restaurant.description || 'Spécialités de poissons braisés, viandes marinées aux épices locales et accompagnements du jour.'}
                            </p>
                          </div>

                          {/* Feature Tags Badges */}
                          <div className="flex flex-wrap items-center gap-1.5 mb-3">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-label-sm text-[11px] font-semibold">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                              Réservations ouvertes
                            </span>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-[11px]">
                              <Utensils className="w-3 h-3" />
                              Menu du jour en ligne
                            </span>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center justify-between pt-1 gap-2">
                          <Link
                            to={`/restaurant/${restaurant.slug}`}
                            className="px-3.5 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Utensils className="w-3.5 h-3.5" />
                            <span>Consulter la carte</span>
                          </Link>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedRestaurantId(restaurant.id)
                              setIsModalOpen(true)
                            }}
                            className="px-4 py-1.5 rounded-lg bg-secondary-container hover:bg-orange-600 text-white font-label-md text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>Réserver une table</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </article>
                  )
                })}

                {/* Pagination */}
                <div className="flex items-center justify-between p-3.5 bg-surface-container-lowest rounded-xl shadow-xs border border-slate-100">
                  <span className="font-body-sm text-xs text-on-surface-variant">
                    Affichage de {filteredRestaurants.length} sur {restaurants.length} adresses
                  </span>
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 rounded-lg bg-surface-container-high text-on-surface opacity-50 cursor-not-allowed">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="px-2 font-data-mono text-xs font-bold text-secondary">
                      Page 1 / 1
                    </span>
                    <button className="p-1.5 rounded-lg bg-surface-container-high text-on-surface opacity-50 cursor-not-allowed">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Interactive Map View (5 cols desktop, sticky) */}
          <div className="lg:col-span-5 sticky top-36 hidden lg:block">
            <div className="relative w-full h-[calc(100vh-170px)] min-h-[560px] rounded-2xl overflow-hidden shadow-lg border border-slate-200/80 bg-surface-container">
              {/* Map Canvas Background */}
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBKhIHxHbzdZI_PhzvIfOu9LYjRw0Ap4azyfO2PSyNt_9EARXGX8ssb-jpZMP-Go0ssOyAnQwQeuIQfojFgoc7KsdB8IwrAhXGfq8DZ5MvsCRDg8_HSzxXs2zc-n-ZJUpp6Gda3kDl5XdCmbDV8r3gwXkvpbEdvAKkXFi8hACDGAZ3bqYVtHbuo2kW19YDAEAOSYyKLYLLwak0M-nY05f9WhOuKYq-KSBGhB6zSOHJkUYqKaet8oN5W')",
                }}
              >
                {/* Cartography Layer Overlay */}
                <div className="absolute inset-0 bg-[#e6ebed]/80 pointer-events-none" />

                {/* SVG Lines mimicking Douala Wouri River */}
                <svg className="absolute inset-0 w-full h-full text-blue-200/40 pointer-events-none">
                  <path
                    d="M-50,180 C120,220 220,160 360,260 C440,320 500,450 600,480"
                    fill="none"
                    opacity="0.6"
                    stroke="#b0d5f0"
                    strokeWidth="32"
                  />
                  <path
                    d="M-30,220 C140,250 240,190 380,290 C460,350 520,480 620,510"
                    fill="none"
                    opacity="0.8"
                    stroke="#7ebce6"
                    strokeWidth="14"
                  />
                  <path
                    d="M 50,0 L 50,700 M 180,0 L 220,700 M 0,280 L 600,240 M 0,460 L 600,390"
                    fill="none"
                    stroke="#ffffff"
                    strokeOpacity="0.75"
                    strokeWidth="4"
                  />
                  <path
                    d="M 120,80 L 320,380 M 240,110 L 450,500"
                    fill="none"
                    stroke="#fce3c7"
                    strokeOpacity="0.9"
                    strokeWidth="3"
                  />
                </svg>

                {/* Map Controls */}
                <div className="absolute top-4 left-4 flex flex-col gap-1 z-20">
                  <div className="bg-surface-container-lowest/90 backdrop-blur-sm rounded-lg p-1 shadow-md flex flex-col">
                    <button
                      type="button"
                      className="w-7 h-7 flex items-center justify-center text-on-surface hover:bg-surface-container-high rounded transition-colors font-bold text-sm cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <div className="h-px bg-slate-200 mx-1" />
                    <button
                      type="button"
                      className="w-7 h-7 flex items-center justify-center text-on-surface hover:bg-surface-container-high rounded transition-colors font-bold text-sm cursor-pointer"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    type="button"
                    className="w-7 h-7 bg-surface-container-lowest/90 backdrop-blur-sm rounded-lg shadow-md flex items-center justify-center text-on-surface hover:text-secondary-container transition-colors cursor-pointer"
                  >
                    <Locate className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Layer Switcher */}
                <div className="absolute top-4 right-4 z-20">
                  <div className="bg-surface-container-lowest/90 backdrop-blur-sm rounded-lg px-3 py-1 shadow-md flex items-center gap-1.5 text-on-surface font-label-sm text-xs">
                    <Layers className="w-3.5 h-3.5 text-secondary" />
                    <span>Vue Quartiers Cameroun</span>
                  </div>
                </div>

                {/* Pins */}
                {/* Secondary Pin 1 */}
                <div className="absolute top-[28%] left-[64%] -translate-x-1/2 -translate-y-full z-10 cursor-pointer group">
                  <div className="relative flex flex-col items-center">
                    <span className="px-2 py-0.5 rounded-full bg-white shadow-md font-label-sm text-[10px] text-on-surface whitespace-nowrap mb-1 font-semibold">
                      Akwa • 3 800 F
                    </span>
                    <div className="w-7 h-7 rounded-full bg-secondary-container text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                      <Utensils className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>

                {/* Secondary Pin 2 */}
                <div className="absolute top-[72%] left-[45%] -translate-x-1/2 -translate-y-full z-10 cursor-pointer group">
                  <div className="relative flex flex-col items-center">
                    <span className="px-2 py-0.5 rounded-full bg-white shadow-md font-label-sm text-[10px] text-on-surface whitespace-nowrap mb-1 font-semibold">
                      Bonapriso • 6 500 F
                    </span>
                    <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                      <Utensils className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>

                {/* Primary ACTIVE Restaurant Pin & POPUP Card */}
                {selectedRestaurant && (
                  <div className="absolute top-[52%] left-[38%] -translate-x-1/2 -translate-y-full z-30">
                    <div className="relative flex flex-col items-center">
                      <div className="w-72 bg-surface-container-lowest rounded-xl shadow-2xl p-4 mb-2 text-on-surface border border-slate-100">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="font-data-mono text-[11px] font-bold text-secondary flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse" />
                            Sélectionné
                          </span>
                          <span className="font-data-mono text-[10px] font-bold text-on-surface bg-surface-container-high px-1.5 py-0.5 rounded">
                            À 1.2 km
                          </span>
                        </div>
                        <h4 className="font-headline-sm text-sm font-bold text-on-surface leading-snug">
                          {selectedRestaurant.name}
                        </h4>
                        <p className="font-body-sm text-[11px] text-on-surface-variant mb-2">
                          {selectedRestaurant.address || 'Douala Bonanjo, Cameroun'}
                        </p>
                        <div className="flex items-center justify-between py-1 px-2.5 rounded-lg bg-surface-container-low mb-3 text-xs">
                          <div className="flex items-center gap-1 font-bold">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                            <span>4.8</span>
                          </div>
                          <div className="font-data-mono text-xs text-secondary font-bold">
                            Midi dès 4 500 FCFA
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Link
                            to={`/restaurant/${selectedRestaurant.slug}`}
                            className="py-1.5 px-2 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-sm text-xs font-semibold transition-colors flex items-center justify-center gap-1 text-center"
                          >
                            <span>Détails</span>
                          </Link>
                          <button
                            type="button"
                            onClick={() => setIsModalOpen(true)}
                            className="py-1.5 px-2 rounded-lg bg-secondary-container hover:bg-orange-600 text-white font-label-sm text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <span>Réserver</span>
                          </button>
                        </div>
                      </div>

                      {/* Active Pin Dot */}
                      <div className="w-8 h-8 rounded-full bg-secondary-container text-white flex items-center justify-center shadow-xl border-2 border-white animate-bounce">
                        <MapPin className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Reservation Modal */}
      <ReservationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        restaurants={restaurants}
        restaurant={restaurants.find((r) => r.id === selectedRestaurantId) || null}
      />
    </div>
  )
}
