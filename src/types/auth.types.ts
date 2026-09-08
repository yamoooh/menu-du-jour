import type { Database } from './database.types'

export type UserRole = 'client' | 'restaurant_manager' | 'admin'

export type UserProfile = Database['public']['Tables']['profiles']['Row']

export interface SignUpParams {
  email: string
  password: string
  firstName: string
  lastName: string
  phone: string
  role: 'client' | 'restaurant_manager'
}

export interface SignInParams {
  email: string
  password: string
}

export const ROLE_LABELS: Record<UserRole, string> = {
  client: 'Client',
  restaurant_manager: 'Gestionnaire de restaurant',
  admin: 'Administrateur',
}
