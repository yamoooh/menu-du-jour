import React, { useState, useMemo } from 'react'
import type { MenuWithDetails } from '@/types/menu.types'
import type { Subscription } from '@/types/restaurant.types'
import { subscriptionService } from '@/services/subscriptionService'
import { menuService } from '@/services/menuService'
import {
  Plus,
  Edit,
  Trash2,
  AlertTriangle,
  Upload,
  QrCode,
  Eye,
  FileText,
  Copy,
  ArrowRight,
} from 'lucide-react'

interface MenuListProps {
  menus: MenuWithDetails[]
  subscription?: Subscription | null
  restaurantId?: string
  onSelectMenuToEdit: (menu: MenuWithDetails) => void
  onCreateNewMenu: () => void
  onRefresh: () => void
}

type MenuFilterTab = 'all' | 'active' | 'draft' | 'archived'

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
  const [filterTab, setFilterTab] = useState<MenuFilterTab>('all')
  const [sortBy, setSortBy] = useState<'updated' | 'date' | 'title'>('updated')

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
      setError(
        'Votre abonnement a expiré. Renouvelez votre abonnement pour continuer à utiliser les fonctionnalités professionnelles de Menu du Jour.'
      )
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

  const todayStr = new Date().toISOString().split('T')[0]

  const filteredMenus = useMemo(() => {
    let list = [...menus]
    if (filterTab === 'active') {
      list = list.filter((m) => m.status === 'published')
    } else if (filterTab === 'draft') {
      list = list.filter((m) => m.status === 'draft')
    } else if (filterTab === 'archived') {
      list = list.filter((m) => m.menu_date < todayStr)
    }
    return list
  }, [menus, filterTab, todayStr])

  const publishedCount = menus.filter((m) => m.status === 'published').length
  const draftCount = menus.filter((m) => m.status === 'draft').length
  const archivedCount = menus.filter((m) => m.menu_date < todayStr).length

  const activeMenu = menus.find((m) => m.status === 'published') || menus[0] || null

  return (
    <div className="flex flex-col gap-space-xl">
      {/* Top Banner & Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg">
        <div className="flex flex-col gap-space-2xs max-w-3xl">
          <div className="flex items-center gap-space-xs">
            <span className="inline-flex items-center gap-1.5 px-space-xs py-space-2xs rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              Édition Directe Restaurant
            </span>
            <span className="font-data-mono text-data-mono text-on-surface-variant text-xs">
              ID: WOURI-MNU-2026
            </span>
          </div>
          <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight font-bold">
            Gestion des Menus & Cartes Digitales
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Créez vos formules du jour, structurez vos plats par catégories ou téléversez votre carte au format PDF (max 10 Mo).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-space-sm">
          <button
            onClick={onCreateNewMenu}
            disabled={isExpired}
            className="inline-flex items-center gap-space-xs px-space-md py-space-sm rounded-xl bg-secondary text-on-secondary font-label-lg text-label-lg shadow-md hover:bg-secondary-container hover:text-on-secondary-container transition-all cursor-pointer disabled:opacity-50 font-bold"
            type="button"
          >
            <Plus className="w-4 h-4" />
            <span>+ Créer un Menu</span>
          </button>
          <button
            onClick={() => {
              const el = document.getElementById('upload-section')
              el?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="inline-flex items-center gap-space-xs px-space-md py-space-sm rounded-xl bg-primary-container text-on-primary font-label-lg text-label-lg hover:bg-surface-tint transition-all cursor-pointer font-bold"
            type="button"
          >
            <Upload className="w-4 h-4" />
            <span>Uploader un PDF de Menu</span>
          </button>
          <button
            onClick={() => {
              window.print()
            }}
            className="inline-flex items-center gap-space-xs px-space-md py-space-sm rounded-xl bg-surface-container-lowest text-on-surface font-label-lg text-label-lg shadow-sm hover:bg-surface-container transition-all cursor-pointer font-bold border border-surface-container"
            type="button"
          >
            <QrCode className="w-4 h-4 text-secondary" />
            <span>Télécharger les QR Codes de table (PDF)</span>
          </button>
        </div>
      </div>

      {/* Subscription Alert if Expired */}
      {isExpired && (
        <div className="p-space-lg rounded-xl bg-error-container text-on-error-container flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md shadow-sm">
          <div className="flex items-center gap-space-sm">
            <AlertTriangle className="w-6 h-6 text-error shrink-0" />
            <div>
              <h4 className="font-headline-sm text-headline-sm font-bold">
                Abonnement expiré — Édition suspendue
              </h4>
              <p className="font-body-sm text-body-sm text-on-error-container/80">
                Vos cartes restent enregistrées. Renouvelez l'abonnement pour continuer à modifier et diffuser vos menus.
              </p>
            </div>
          </div>
          <button
            onClick={handleRenew}
            className="px-space-md py-space-xs rounded-xl bg-error text-on-error font-label-md text-label-md font-bold shadow-sm hover:opacity-90 transition-all cursor-pointer"
          >
            Renouveler (5 000 FCFA)
          </button>
        </div>
      )}

      {renewError && (
        <div className="p-space-sm rounded-xl bg-error-container text-on-error-container font-label-sm text-label-sm">
          {renewError}
        </div>
      )}

      {error && (
        <div className="p-space-sm rounded-xl bg-error-container text-on-error-container font-label-sm text-label-sm">
          {error}
        </div>
      )}

      {/* Filter Tabs and Sort Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-base pb-space-xs">
        <div className="flex items-center gap-space-2xs bg-surface-container-low p-space-2xs rounded-xl overflow-x-auto w-full sm:w-auto border border-surface-container/60">
          <button
            onClick={() => setFilterTab('all')}
            className={`px-space-md py-space-xs rounded-lg font-label-md text-label-md transition-all flex items-center gap-1.5 cursor-pointer ${
              filterTab === 'all'
                ? 'bg-surface-container-lowest text-on-surface font-bold shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
            type="button"
          >
            <span>Tous les menus</span>
            <span className="px-1.5 py-0.5 rounded-full bg-surface-container font-data-mono text-label-sm text-xs">
              {menus.length}
            </span>
          </button>
          <button
            onClick={() => setFilterTab('active')}
            className={`px-space-md py-space-xs rounded-lg font-label-md text-label-md transition-all flex items-center gap-1.5 cursor-pointer ${
              filterTab === 'active'
                ? 'bg-surface-container-lowest text-on-surface font-bold shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
            type="button"
          >
            <span>Menu du Jour Actif</span>
            <span className="px-1.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-data-mono text-label-sm text-xs font-bold">
              {publishedCount}
            </span>
          </button>
          <button
            onClick={() => setFilterTab('draft')}
            className={`px-space-md py-space-xs rounded-lg font-label-md text-label-md transition-all flex items-center gap-1.5 cursor-pointer ${
              filterTab === 'draft'
                ? 'bg-surface-container-lowest text-on-surface font-bold shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
            type="button"
          >
            <span>Brouillons</span>
            <span className="px-1.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-data-mono text-label-sm text-xs">
              {draftCount}
            </span>
          </button>
          <button
            onClick={() => setFilterTab('archived')}
            className={`px-space-md py-space-xs rounded-lg font-label-md text-label-md transition-all flex items-center gap-1.5 cursor-pointer ${
              filterTab === 'archived'
                ? 'bg-surface-container-lowest text-on-surface font-bold shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
            type="button"
          >
            <span>Archives</span>
            <span className="px-1.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-data-mono text-label-sm text-xs">
              {archivedCount}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-space-sm self-end sm:self-auto">
          <span className="font-label-sm text-label-sm text-on-surface-variant">Trier par :</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-surface-container-lowest text-on-surface font-label-md text-label-md px-space-sm py-space-xs rounded-lg shadow-sm outline-none cursor-pointer border border-surface-container"
          >
            <option value="updated">Dernière modification</option>
            <option value="date">Date de service</option>
            <option value="title">Titre alphabétique</option>
          </select>
        </div>
      </div>

      {/* Main Grid: 8 Cols Active Showcase & List + 4 Cols PDF & QR Hub */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-xl">
        {/* Left Column (8 cols) */}
        <div className="xl:col-span-8 flex flex-col gap-space-xl">
          {/* Active Featured Menu Showcase */}
          <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-lg relative overflow-hidden border border-surface-container/40">
            <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-secondary-fixed/40 blur-2xl pointer-events-none"></div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
              <div className="flex flex-col gap-space-2xs">
                <div className="flex items-center gap-space-sm flex-wrap">
                  <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
                    {activeMenu?.title || 'Menu Déjeuner du Marché'}
                  </h2>
                  <span className="inline-flex items-center gap-1.5 px-space-sm py-space-2xs rounded-full bg-surface-container-low text-on-surface font-label-sm text-label-sm font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    Publié & Diffusé
                  </span>
                  <span className="font-data-mono text-data-mono text-on-surface-variant text-xs">
                    Mis à jour à 09:30
                  </span>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  {activeMenu?.description ||
                    'Formule bilingue servie de 12h00 à 15h30. Synchronisée avec les ardoises QR code des tables en terrasse et salle VIP.'}
                </p>
              </div>

              <div className="flex items-center gap-space-xs">
                {activeMenu && (
                  <button
                    onClick={() => onSelectMenuToEdit(activeMenu)}
                    className="inline-flex items-center gap-1 px-space-sm py-space-xs rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container font-label-md text-label-md transition-colors cursor-pointer font-semibold"
                    type="button"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Modifier la formule</span>
                  </button>
                )}
                <button
                  onClick={onCreateNewMenu}
                  className="inline-flex items-center gap-1 px-space-sm py-space-xs rounded-lg bg-secondary text-on-secondary hover:bg-on-secondary-container font-label-md text-label-md transition-colors cursor-pointer font-bold"
                  type="button"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter un plat</span>
                </button>
              </div>
            </div>

            {/* Categorized Dishes Grid */}
            <div className="flex flex-col gap-space-lg">
              {/* Category 1: Entrées */}
              <div className="flex flex-col gap-space-sm">
                <div className="flex items-center justify-between py-space-xs px-space-sm rounded-lg bg-surface-container-low border border-surface-container/60">
                  <div className="flex items-center gap-space-sm">
                    <span className="w-2 h-2 rounded-full bg-secondary"></span>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface uppercase tracking-wider font-bold">
                      Entrées Fraîcheur & Soupes
                    </h3>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">(2 plats)</span>
                  </div>
                  <span className="font-data-mono text-label-sm text-on-surface-variant text-xs">
                    Sous-total : 8 000 FCFA
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                  {/* Dish 1 */}
                  <div className="p-space-md rounded-xl bg-surface-bright shadow-sm hover:shadow-md transition-all flex gap-space-md group relative border border-surface-container/40">
                    <img
                      className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                      alt="Carpaccio de Capitaine aux agrumes"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1wYHqcDrO1gA5nn_2po_-H0H5OS5Sr7lwK64vdN_E-8zL97ng59mEeXcELDFjZnNaFYsnJ_IEEjJfFjH5Vxv4LlQVtCSPPivhndNTYH2rW6H4_l-Zgin1wvjEBV0wTJ7YRqugNGwfscmG94cdjYqGQOHO8_yu7UqKaPG6MDU8xCz9Tj_h6HFRrcKbWyhxNd8KRkQJMhuwULBbo6ljEO1tb0PM4Wk81ET_mEFS1ErnOW8N5isjYWl4"
                    />
                    <div className="flex flex-col justify-between flex-1 min-w-0">
                      <div className="flex flex-col">
                        <div className="flex items-start justify-between gap-space-xs">
                          <span className="font-label-lg text-label-lg text-on-surface truncate font-bold">
                            Carpaccio de Capitaine aux agrumes
                          </span>
                          <span className="font-data-mono text-data-mono text-secondary font-bold whitespace-nowrap">
                            4 500 FCFA
                          </span>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mt-space-2xs text-xs">
                          Poisson capitaine de rivière mariné au citron vert de Penja, huile d'olive vierge et graines de coriandre.
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-space-xs pt-space-xs border-t border-surface-container-low">
                        <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-emerald-700 font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> Disponible
                        </span>
                        <div className="flex items-center gap-1">
                          {activeMenu && (
                            <button
                              onClick={() => onSelectMenuToEdit(activeMenu)}
                              className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                              title="Modifier"
                              type="button"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dish 2 */}
                  <div className="p-space-md rounded-xl bg-surface-bright shadow-sm hover:shadow-md transition-all flex gap-space-md group relative border border-surface-container/40">
                    <img
                      className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                      alt="Velouté de potiron et patates douces"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgVuHs1E0npbYcGwRed4SHN7Xx496SMhqMU460ZOTBoDWJPOOV4ePxvv-wwn9GkAYRfk1wQFy5l3ZwUMfd-HA1jNb98A-iUwoDlPJjZ_uIVl2uwjxCQF90sgtP11Wz9L2CKAbVFxjl32LKrE3xQDGI0Ql2_kYloWRfRge7KzIVmO1cx0zFzq0-Ydre_in9Te4rOrGUQfBYXjyCOwb9f0OEAS4OIFgELGh5lEU3DcjJ20OenLTehvFv"
                    />
                    <div className="flex flex-col justify-between flex-1 min-w-0">
                      <div className="flex flex-col">
                        <div className="flex items-start justify-between gap-space-xs">
                          <span className="font-label-lg text-label-lg text-on-surface truncate font-bold">
                            Velouté de potiron et patates douces
                          </span>
                          <span className="font-data-mono text-data-mono text-secondary font-bold whitespace-nowrap">
                            3 500 FCFA
                          </span>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mt-space-2xs text-xs">
                          Potiron local velouté, touche de lait de coco et éclats de graines torréfiées de l'Ouest.
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-space-xs pt-space-xs border-t border-surface-container-low">
                        <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-emerald-700 font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> Disponible
                        </span>
                        <div className="flex items-center gap-1">
                          {activeMenu && (
                            <button
                              onClick={() => onSelectMenuToEdit(activeMenu)}
                              className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                              title="Modifier"
                              type="button"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Category 2: Plats */}
              <div className="flex flex-col gap-space-sm">
                <div className="flex items-center justify-between py-space-xs px-space-sm rounded-lg bg-surface-container-low border border-surface-container/60">
                  <div className="flex items-center gap-space-sm">
                    <span className="w-2 h-2 rounded-full bg-secondary"></span>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface uppercase tracking-wider font-bold">
                      Plats de Résistance & Braisés
                    </h3>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">(2 plats)</span>
                  </div>
                  <span className="font-data-mono text-label-sm text-on-surface-variant text-xs">
                    Signature du Chef
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                  {/* Dish 3 */}
                  <div className="p-space-md rounded-xl bg-surface-bright shadow-sm hover:shadow-md transition-all flex gap-space-md group relative border border-surface-container/40">
                    <img
                      className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                      alt="Ndolé Royal aux crevettes et miondo"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAaXBqdmNZ2En12FGAwjqZED5PMH0MLE0wI9f-Chg68a0NjZ1Lc3JsKIMgEd4QqFTEO-2DHTkQZ37bEi-GilQeJWuGMbpO1ZVXKMsXMTWqW8fHoUo_joiEEE5czA4ZPdfnNDV26A3p3zv2g4fcjDFdHIlSwGcvs7KkLvUNaVWJRSHywJ6zlw7GGa4SIddtCk56vvyrgQYOVaqZoOapS4jX9njJqFxIS4hoKQlkMma92fRW5Z1M8hRYJ"
                    />
                    <div className="flex flex-col justify-between flex-1 min-w-0">
                      <div className="flex flex-col">
                        <div className="flex items-start justify-between gap-space-xs">
                          <span className="font-label-lg text-label-lg text-on-surface truncate font-bold">
                            Ndolé Royal aux crevettes et miondo
                          </span>
                          <span className="font-data-mono text-data-mono text-secondary font-bold whitespace-nowrap">
                            7 500 FCFA
                          </span>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mt-space-2xs text-xs">
                          Feuilles de ndolé amères blanchies, pâte d'arachides fraîches, gambas de Kribi et miondo vapeur.
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-space-xs pt-space-xs border-t border-surface-container-low">
                        <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-emerald-700 font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> Disponible
                        </span>
                        <div className="flex items-center gap-1">
                          {activeMenu && (
                            <button
                              onClick={() => onSelectMenuToEdit(activeMenu)}
                              className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                              title="Modifier"
                              type="button"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dish 4 */}
                  <div className="p-space-md rounded-xl bg-surface-bright shadow-sm hover:shadow-md transition-all flex gap-space-md group relative border border-surface-container/40">
                    <img
                      className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                      alt="Filet de Bar braisé sauce kankankan"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbq4IRwot5DX12xoxh_o3rqyHv-oREE8hFkOVZSjSe61yHVf0LNeF--7pczALdi0LlF_2m-CyQZVHDCuH6dMT6oLQaXvtR8M9t8w0wQMEmCT-O4d7SHulcEogYo0jLPIb9D5mxBkUB-zWu_KFNVYczrepBgrdrGz7or99WSW6qw6fGme0b8MXvPKxhRsTmTbtS6U_vojs6p-azuM4eqlDbMR-yzXMjAQBZJBp7w5JF_sv7INkGc0t-"
                    />
                    <div className="flex flex-col justify-between flex-1 min-w-0">
                      <div className="flex flex-col">
                        <div className="flex items-start justify-between gap-space-xs">
                          <span className="font-label-lg text-label-lg text-on-surface truncate font-bold">
                            Filet de Bar braisé sauce kankankan
                          </span>
                          <span className="font-data-mono text-data-mono text-secondary font-bold whitespace-nowrap">
                            6 500 FCFA
                          </span>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mt-space-2xs text-xs">
                          Pêche du littoral atlantique, réduction d'épices douces camerounaises, alloco d'aloko mûr caramélisé.
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-space-xs pt-space-xs border-t border-surface-container-low">
                        <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-emerald-700 font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> Disponible
                        </span>
                        <div className="flex items-center gap-1">
                          {activeMenu && (
                            <button
                              onClick={() => onSelectMenuToEdit(activeMenu)}
                              className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                              title="Modifier"
                              type="button"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Menus (Drafts / Archives Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
            <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between border border-surface-container/40">
              <div className="flex flex-col gap-space-xs">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold">
                    Menu Dîner Étoilé
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm font-semibold">
                    Brouillon
                  </span>
                </div>
                <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Carte du Soir & Dégustation
                </h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Prévu pour le lancement du week-end. 8 plats saisis, en attente de validation du Chef.
                </p>
              </div>
              <div className="flex items-center justify-between mt-space-md pt-space-md border-t border-surface-container-low">
                <span className="font-data-mono text-data-mono text-on-surface-variant text-xs">
                  8 créations
                </span>
                <button
                  onClick={onCreateNewMenu}
                  className="font-label-md text-label-md text-secondary hover:text-on-secondary-container flex items-center gap-1 cursor-pointer font-semibold"
                  type="button"
                >
                  <span>Finaliser le menu</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between border border-surface-container/40">
              <div className="flex flex-col gap-space-xs">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold">
                    Brunch du Dimanche
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm font-semibold">
                    Archivé
                  </span>
                </div>
                <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Buffet & Grillades Ouest
                </h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Dernière diffusion le 28 Avril 2024. Modèle réutilisable pour les prochains dimanches festifs.
                </p>
              </div>
              <div className="flex items-center justify-between mt-space-md pt-space-md border-t border-surface-container-low">
                <span className="font-data-mono text-data-mono text-on-surface-variant text-xs">
                  14 formules
                </span>
                <button
                  onClick={onCreateNewMenu}
                  className="font-label-md text-label-md text-secondary hover:text-on-secondary-container flex items-center gap-1 cursor-pointer font-semibold"
                  type="button"
                >
                  <span>Restaurer / Dupliquer</span>
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* List of Other User Menus */}
          {filteredMenus.length > 0 && (
            <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg border border-surface-container/40 flex flex-col gap-space-md">
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Historique Complet de vos Menus
              </h3>
              <div className="divide-y divide-surface-container-low">
                {filteredMenus.map((menu) => (
                  <div key={menu.id} className="py-space-md flex items-center justify-between gap-space-md">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-label-lg text-label-lg text-on-surface font-bold">
                          {menu.title}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            menu.status === 'published'
                              ? 'bg-emerald-50 text-emerald-800'
                              : 'bg-amber-50 text-amber-800'
                          }`}
                        >
                          {menu.status === 'published' ? 'Publié' : 'Brouillon'}
                        </span>
                      </div>
                      <span className="font-body-sm text-body-sm text-on-surface-variant text-xs">
                        {formatDate(menu.menu_date)} • {menu.items.length} plats
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleTogglePublish(menu)}
                        className="px-space-sm py-1 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container font-label-sm text-label-sm font-semibold cursor-pointer"
                      >
                        {menu.status === 'published' ? 'Passer en brouillon' : 'Publier'}
                      </button>
                      <button
                        onClick={() => onSelectMenuToEdit(menu)}
                        className="px-space-sm py-1 rounded-lg bg-secondary text-on-secondary font-label-sm text-label-sm font-semibold cursor-pointer"
                      >
                        Éditer
                      </button>
                      <button
                        onClick={() => setMenuToDelete(menu)}
                        className="p-1 text-on-surface-variant hover:text-error rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (4 cols): PDF Upload & Physical QR Codes */}
        <div className="xl:col-span-4 flex flex-col gap-space-xl">
          {/* PDF Section */}
          <div
            className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-md border border-surface-container/40"
            id="upload-section"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <Upload className="w-5 h-5 text-secondary" />
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Carte PDF & Médias
                </h3>
              </div>
              <span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-semibold">
                Document HD
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Téléversez un document PDF conçu en graphisme ou une photo HD pour permettre aux clients de consulter votre menu original.
            </p>

            {/* Dropzone */}
            <div className="p-space-lg rounded-xl bg-surface-container-low flex flex-col items-center justify-center text-center gap-space-sm cursor-pointer hover:bg-surface-container transition-colors border-2 border-dashed border-surface-container-high">
              <div className="w-12 h-12 rounded-full bg-surface-container-lowest flex items-center justify-center shadow-sm text-secondary">
                <Upload className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-on-surface font-semibold">
                  Glissez-déposez votre carte ici
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  ou <span className="text-secondary underline font-semibold">parcourez vos fichiers</span>
                </span>
              </div>
              <div className="flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant text-xs">
                <span>JPG, PNG, WebP ou PDF</span>
                <span>•</span>
                <span className="font-data-mono font-semibold">Max 10 MB</span>
              </div>
            </div>

            {/* Attached Document Card */}
            <div className="flex flex-col gap-space-xs">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                Document rattaché au restaurant
              </span>
              <div className="p-space-md rounded-xl bg-surface-bright flex flex-col gap-space-sm shadow-sm border border-surface-container/60">
                <div className="flex items-start gap-space-sm">
                  <div className="w-10 h-10 rounded-lg bg-error-container text-error flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-label-md text-label-md text-on-surface truncate font-semibold">
                      Carte_Des_Vins_et_Grillades_2026.pdf
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-emerald-700 font-semibold text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> PDF Validé
                      </span>
                      <span className="font-data-mono text-label-sm text-on-surface-variant text-xs">4.8 Mo</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-space-xs pt-space-xs">
                  <button
                    onClick={() => window.print()}
                    className="flex-1 py-space-xs px-space-sm rounded-lg bg-surface-container-high text-on-surface font-label-sm text-label-sm hover:bg-surface-variant transition-colors flex items-center justify-center gap-1 font-semibold cursor-pointer"
                    type="button"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Aperçu Plein Écran</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Physical QR Code Generation Box */}
          <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-md border border-surface-container/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <QrCode className="w-5 h-5 text-secondary" />
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  QR Codes de Table
                </h3>
              </div>
              <span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-surface-container text-on-surface font-semibold">
                Planches A4
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Générez les chevalets et autocollants de tables avec le QR code direct vers votre ardoise du jour.
            </p>
            <div className="p-space-base rounded-xl bg-surface-container-low flex items-center justify-center py-6 border border-surface-container/60">
              <div className="w-32 h-32 bg-white p-2 rounded-xl shadow-sm flex items-center justify-center border border-surface-container">
                <QrCode className="w-24 h-24 text-on-surface" />
              </div>
            </div>
            <button
              onClick={() => window.print()}
              className="w-full py-space-sm rounded-xl bg-primary-container text-on-primary font-label-lg text-label-lg hover:bg-surface-tint transition-all flex items-center justify-center gap-2 cursor-pointer font-bold"
              type="button"
            >
              <QrCode className="w-4 h-4 text-secondary" />
              <span>Imprimer la planche de QR Codes</span>
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {menuToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary-container/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-2xl border border-surface-container shadow-2xl w-full max-w-sm p-6 space-y-4 text-center">
            <h4 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              Supprimer ce menu ?
            </h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Êtes-vous sûr de vouloir supprimer le menu du{' '}
              <strong>{formatDate(menuToDelete.menu_date)}</strong> ? Tous ses plats associés seront définitivement effacés.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setMenuToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-surface-container text-on-surface hover:bg-surface-container-high cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={loading}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-error text-on-error hover:opacity-90 shadow-sm cursor-pointer"
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

