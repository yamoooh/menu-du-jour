import { supabase } from '@/lib/supabase'
import type {
  Menu,
  MenuItem,
  MenuPhoto,
  MenuWithDetails,
  MenuItemCategory,
} from '@/types/menu.types'

export const menuService = {
  // Récupérer la liste des menus d'un restaurant (triés du plus récent au plus ancien)
  async fetchMenusByRestaurant(
    restaurantId: string
  ): Promise<{ data: MenuWithDetails[] | null; error: Error | null }> {
    if (!supabase) return { data: null, error: new Error('Client Supabase non initialisé') }

    try {
      const { data: menus, error: menusErr } = await supabase
        .from('menus')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('menu_date', { ascending: false })

      if (menusErr) return { data: null, error: new Error(translateDbError(menusErr.message)) }
      if (!menus || menus.length === 0) return { data: [], error: null }

      const menuIds = menus.map((m) => m.id)

      const [itemsRes, photosRes] = await Promise.all([
        supabase
          .from('menu_items')
          .select('*')
          .in('menu_id', menuIds)
          .order('display_order', { ascending: true }),
        supabase
          .from('menu_photos')
          .select('*')
          .in('menu_id', menuIds)
          .order('display_order', { ascending: true }),
      ])

      const items = itemsRes.data || []
      const photos = photosRes.data || []

      const result: MenuWithDetails[] = menus.map((menu) => ({
        ...menu,
        items: items.filter((item) => item.menu_id === menu.id),
        photos: photos.filter((photo) => photo.menu_id === menu.id),
      }))

      return { data: result, error: null }
    } catch (err) {
      return { data: null, error: new Error('Erreur de chargement des menus') }
    }
  },

  // Récupérer un menu spécifique par son ID avec ses éléments et ses photos
  async fetchMenuById(
    menuId: string
  ): Promise<{ data: MenuWithDetails | null; error: Error | null }> {
    if (!supabase) return { data: null, error: new Error('Client Supabase non initialisé') }

    try {
      const { data: menu, error: menuErr } = await supabase
        .from('menus')
        .select('*')
        .eq('id', menuId)
        .single()

      if (menuErr || !menu) return { data: null, error: new Error('Menu introuvable') }

      const [itemsRes, photosRes] = await Promise.all([
        supabase
          .from('menu_items')
          .select('*')
          .eq('menu_id', menuId)
          .order('display_order', { ascending: true }),
        supabase
          .from('menu_photos')
          .select('*')
          .eq('menu_id', menuId)
          .order('display_order', { ascending: true }),
      ])

      return {
        data: {
          ...menu,
          items: itemsRes.data || [],
          photos: photosRes.data || [],
        },
        error: null,
      }
    } catch (err) {
      return { data: null, error: new Error('Erreur de chargement du menu') }
    }
  },

  // Créer un nouveau menu
  async createMenu(payload: {
    restaurant_id: string
    title: string
    description?: string
    menu_date: string
    status?: 'draft' | 'published'
  }): Promise<{ data: Menu | null; error: Error | null }> {
    if (!supabase) return { data: null, error: new Error('Client Supabase non initialisé') }

    try {
      const { data, error } = await supabase
        .from('menus')
        .insert({
          restaurant_id: payload.restaurant_id,
          title: payload.title.trim(),
          description: payload.description?.trim() || null,
          menu_date: payload.menu_date,
          status: payload.status || 'draft',
        })
        .select('*')
        .single()

      if (error) return { data: null, error: new Error(translateDbError(error.message)) }
      return { data, error: null }
    } catch (err) {
      return { data: null, error: new Error('Erreur lors de la création du menu') }
    }
  },

  // Mettre à jour un menu existant (titre, description, date, statut)
  async updateMenu(
    menuId: string,
    payload: {
      title?: string
      description?: string
      menu_date?: string
      status?: 'draft' | 'published'
    }
  ): Promise<{ data: Menu | null; error: Error | null }> {
    if (!supabase) return { data: null, error: new Error('Client Supabase non initialisé') }

    try {
      const { data, error } = await supabase
        .from('menus')
        .update({
          ...(payload.title && { title: payload.title.trim() }),
          description: payload.description !== undefined ? payload.description?.trim() || null : undefined,
          ...(payload.menu_date && { menu_date: payload.menu_date }),
          ...(payload.status && { status: payload.status }),
        })
        .eq('id', menuId)
        .select('*')
        .single()

      if (error) return { data: null, error: new Error(translateDbError(error.message)) }
      return { data, error: null }
    } catch (err) {
      return { data: null, error: new Error('Erreur lors de la modification du menu') }
    }
  },

  // Supprimer un menu
  async deleteMenu(menuId: string): Promise<{ error: Error | null }> {
    if (!supabase) return { error: new Error('Client Supabase non initialisé') }

    try {
      const { error } = await supabase.from('menus').delete().eq('id', menuId)
      if (error) return { error: new Error(translateDbError(error.message)) }
      return { error: null }
    } catch (err) {
      return { error: new Error('Erreur lors de la suppression du menu') }
    }
  },

  // Ajouter un élément (plat) au menu
  async addMenuItem(payload: {
    menu_id: string
    restaurant_id: string
    name: string
    description?: string
    price: number
    category?: MenuItemCategory
    accompaniment?: string
    display_order?: number
  }): Promise<{ data: MenuItem | null; error: Error | null }> {
    if (!supabase) return { data: null, error: new Error('Client Supabase non initialisé') }

    try {
      const { data, error } = await supabase
        .from('menu_items')
        .insert({
          menu_id: payload.menu_id,
          restaurant_id: payload.restaurant_id,
          name: payload.name.trim(),
          description: payload.description?.trim() || null,
          price: payload.price,
          category: payload.category || 'plat',
          accompaniment: payload.accompaniment?.trim() || null,
          display_order: payload.display_order || 0,
        })
        .select('*')
        .single()

      if (error) return { data: null, error: new Error(translateDbError(error.message)) }
      return { data, error: null }
    } catch (err) {
      return { data: null, error: new Error('Erreur lors de l\'ajout du plat') }
    }
  },

  // Mettre à jour un élément de menu
  async updateMenuItem(
    itemId: string,
    payload: {
      name?: string
      description?: string
      price?: number
      category?: MenuItemCategory
      accompaniment?: string
      display_order?: number
      is_available?: boolean
    }
  ): Promise<{ data: MenuItem | null; error: Error | null }> {
    if (!supabase) return { data: null, error: new Error('Client Supabase non initialisé') }

    try {
      const { data, error } = await supabase
        .from('menu_items')
        .update({
          ...(payload.name && { name: payload.name.trim() }),
          description: payload.description !== undefined ? payload.description?.trim() || null : undefined,
          ...(payload.price !== undefined && { price: payload.price }),
          ...(payload.category && { category: payload.category }),
          accompaniment: payload.accompaniment !== undefined ? payload.accompaniment?.trim() || null : undefined,
          ...(payload.display_order !== undefined && { display_order: payload.display_order }),
          ...(payload.is_available !== undefined && { is_available: payload.is_available }),
        })
        .eq('id', itemId)
        .select('*')
        .single()

      if (error) return { data: null, error: new Error(translateDbError(error.message)) }
      return { data, error: null }
    } catch (err) {
      return { data: null, error: new Error('Erreur de modification du plat') }
    }
  },

  // Supprimer un élément de menu
  async deleteMenuItem(itemId: string): Promise<{ error: Error | null }> {
    if (!supabase) return { error: new Error('Client Supabase non initialisé') }

    try {
      const { error } = await supabase.from('menu_items').delete().eq('id', itemId)
      if (error) return { error: new Error(translateDbError(error.message)) }
      return { error: null }
    } catch (err) {
      return { error: new Error('Erreur lors de la suppression du plat') }
    }
  },

  // Réorganiser l'ordre des plats
  async reorderMenuItems(
    items: { id: string; display_order: number }[]
  ): Promise<{ error: Error | null }> {
    if (!supabase) return { error: new Error('Client Supabase non initialisé') }

    try {
      const updates = items.map((item) =>
        supabase.from('menu_items').update({ display_order: item.display_order }).eq('id', item.id)
      )
      await Promise.all(updates)
      return { error: null }
    } catch (err) {
      return { error: new Error('Erreur de réorganisation des plats') }
    }
  },

  // Upload d'une photo ou document PDF de menu dans Supabase Storage et insertion dans menu_photos (BLOC 4)
  async uploadMenuPhoto(
    restaurantId: string,
    menuId: string,
    file: File,
    altText?: string
  ): Promise<{ data: MenuPhoto | null; error: Error | null }> {
    if (!supabase) return { data: null, error: new Error('Client Supabase non initialisé') }

    // Validation de la taille (max 10 Mo)
    if (file.size > 10 * 1024 * 1024) {
      return { data: null, error: new Error('Le fichier dépasse la taille maximale autorisée (10 Mo).') }
    }

    // Validation des formats autorisés (JPG, PNG, WebP, PDF)
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp']

    if (!isPdf && !allowedImageTypes.includes(file.type)) {
      return { data: null, error: new Error('Format de fichier non supporté. Seuls les formats JPG, PNG, WebP et PDF sont autorisés.') }
    }

    try {
      const fileExt = file.name.split('.').pop() || (isPdf ? 'pdf' : 'jpg')
      const fileName = `${restaurantId}/${menuId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

      // 1. Upload dans le bucket 'menu-photos'
      const { error: uploadErr } = await supabase.storage
        .from('menu-photos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type || (isPdf ? 'application/pdf' : 'image/jpeg'),
        })

      if (uploadErr) return { data: null, error: new Error(`Erreur d'upload : ${uploadErr.message}`) }

      // 2. Enregistrer la ligne dans menu_photos
      const { data, error: dbErr } = await supabase
        .from('menu_photos')
        .insert({
          menu_id: menuId,
          restaurant_id: restaurantId,
          storage_path: fileName,
          alt_text: altText || file.name,
        })
        .select('*')
        .single()

      if (dbErr) return { data: null, error: new Error(translateDbError(dbErr.message)) }
      return { data, error: null }
    } catch (err) {
      return { data: null, error: new Error('Erreur lors du transfert de la photo') }
    }
  },

  // Supprimer une photo de menu (Storage + BDD)
  async deleteMenuPhoto(
    photoId: string,
    storagePath: string
  ): Promise<{ error: Error | null }> {
    if (!supabase) return { error: new Error('Client Supabase non initialisé') }

    try {
      // 1. Supprimer du Storage
      await supabase.storage.from('menu-photos').remove([storagePath])

      // 2. Supprimer de la BDD
      const { error } = await supabase.from('menu_photos').delete().eq('id', photoId)
      if (error) return { error: new Error(translateDbError(error.message)) }

      return { error: null }
    } catch (err) {
      return { error: new Error('Erreur lors de la suppression de la photo') }
    }
  },

  // Helper URL publique de photo
  getPhotoPublicUrl(storagePath: string): string {
    if (!supabase) return ''
    const { data } = supabase.storage.from('menu-photos').getPublicUrl(storagePath)
    return data.publicUrl
  },
}

function translateDbError(message: string): string {
  const lower = message.toLowerCase()
  if (
    lower.includes('unique') ||
    lower.includes('idx_one_published_menu_per_day') ||
    lower.includes('duplicate key')
  ) {
    return 'Un menu est déjà publié pour cette date. Modifiez le menu existant plutôt que d\'en créer un nouveau.'
  }
  if (lower.includes('permission denied') || lower.includes('row-level security')) {
    return 'Votre abonnement a expiré ou vous n\'avez pas les autorisations nécessaires pour modifier ce menu.'
  }
  return 'Une erreur est survenue lors de l\'enregistrement du menu.'
}
