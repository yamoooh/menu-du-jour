import type { Database } from './database.types'

export type Reservation = Database['public']['Tables']['reservations']['Row']
export type ReservationInsert = Database['public']['Tables']['reservations']['Insert']
export type ReservationUpdate = Database['public']['Tables']['reservations']['Update']
export type ReservationStatus = Database['public']['Enums']['reservation_status']

export interface ReservationWithDetails extends Reservation {
  restaurant?: {
    id: string
    name: string
    slug: string
    phone: string | null
    address: string | null
    city: string | null
  } | null
  menu?: {
    id: string
    title: string
    menu_date: string
  } | null
}

export interface ReservationStatusConfig {
  label: string
  badgeColor: string
  textColor: string
  borderColor: string
}

export const RESERVATION_STATUS_MAP: Record<ReservationStatus, ReservationStatusConfig> = {
  pending: {
    label: 'En attente',
    badgeColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-200',
  },
  confirmed: {
    label: 'Confirmée',
    badgeColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-200',
  },
  rejected: {
    label: 'Refusée',
    badgeColor: 'bg-red-50',
    textColor: 'text-red-700',
    borderColor: 'border-red-200',
  },
  cancelled: {
    label: 'Annulée',
    badgeColor: 'bg-slate-100',
    textColor: 'text-slate-600',
    borderColor: 'border-slate-300',
  },
  completed: {
    label: 'Terminée',
    badgeColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
  },
  no_show: {
    label: 'Client absent',
    badgeColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200',
  },
}
