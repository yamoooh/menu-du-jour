import type { Database } from './database.types'

export type NotificationType = Database['public']['Enums']['notification_type']

export interface NotificationItem {
  id: string
  user_id: string
  type: NotificationType
  title: string
  body: string
  data: Record<string, any>
  is_read: boolean
  read_at: string | null
  created_at: string
}

export interface PushSubscriptionData {
  id?: string
  user_id: string
  endpoint: string
  p256dh: string
  auth: string
  user_agent?: string
  created_at?: string
  updated_at?: string
}