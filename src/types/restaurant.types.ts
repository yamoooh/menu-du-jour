import type { Database } from './database.types'

export type Restaurant = Database['public']['Tables']['restaurants']['Row']
export type RestaurantInsert = Database['public']['Tables']['restaurants']['Insert']
export type RestaurantUpdate = Database['public']['Tables']['restaurants']['Update']

export type RestaurantHours = Database['public']['Tables']['restaurant_hours']['Row']
export type Subscription = Database['public']['Tables']['subscriptions']['Row']
export type SubscriptionStatus = Database['public']['Enums']['subscription_status']
export type Payment = Database['public']['Tables']['payments']['Row']
export type PaymentStatus = Database['public']['Enums']['payment_status']

export interface DayHoursInput {
  day_of_week: number // 0 = Lundi, ..., 6 = Dimanche
  day_label: string
  is_closed: boolean
  open_time: string // HH:mm
  close_time: string // HH:mm
}

export interface RestaurantStats {
  publishedMenusCount: number
  reservationsCount: number
  followersCount: number
}

export interface SubscriptionInfo {
  subscription: Subscription | null
  status: SubscriptionStatus | 'expired'
  isExpired: boolean
  isActive: boolean
  remainingDays: number
  expiresAt: Date | null
  formattedExpirationDate: string
}

export const DAYS_OF_WEEK = [
  { day: 0, label: 'Lundi' },
  { day: 1, label: 'Mardi' },
  { day: 2, label: 'Mercredi' },
  { day: 3, label: 'Jeudi' },
  { day: 4, label: 'Vendredi' },
  { day: 5, label: 'Samedi' },
  { day: 6, label: 'Dimanche' },
] as const

export const LEEKPAY_PAYMENT_URL = 'https://leekpay.me/menu-du-jour'
export const SUBSCRIPTION_PRICE_FCFA = 5000
export const SUBSCRIPTION_DURATION_DAYS = 30
export const TRIAL_DURATION_DAYS = 7
