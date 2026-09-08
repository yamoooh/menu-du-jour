import type { Database } from './database.types'

export type Menu = Database['public']['Tables']['menus']['Row']
export type MenuInsert = Database['public']['Tables']['menus']['Insert']
export type MenuUpdate = Database['public']['Tables']['menus']['Update']

export type MenuItem = Database['public']['Tables']['menu_items']['Row']
export type MenuItemInsert = Database['public']['Tables']['menu_items']['Insert']
export type MenuItemUpdate = Database['public']['Tables']['menu_items']['Update']

export type MenuPhoto = Database['public']['Tables']['menu_photos']['Row']

export type MenuStatus = Database['public']['Enums']['menu_status']
export type MenuItemCategory = Database['public']['Enums']['menu_item_category']

export interface MenuWithDetails extends Menu {
  items: MenuItem[]
  photos: MenuPhoto[]
}

export const MENU_ITEM_CATEGORY_LABELS: Record<MenuItemCategory, string> = {
  entree: 'Entrée',
  plat: 'Plat',
  dessert: 'Dessert',
  boisson: 'Boisson',
  formule: 'Formule',
  autre: 'Autre',
}
