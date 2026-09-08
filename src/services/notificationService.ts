import { supabase } from '@/lib/supabase'
import type { NotificationItem } from '@/types/notification.types'

export const notificationService = {
  /**
   * Récupère la liste des notifications pour un utilisateur donné
   */
  async getUserNotifications(userId: string): Promise<{ data: NotificationItem[]; error: Error | null }> {
    if (!supabase) return { data: [], error: new Error('Client Supabase non initialisé') }

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) return { data: [], error: new Error(error.message) }

      const items: NotificationItem[] = (data || []).map((row) => ({
        id: row.id,
        user_id: row.user_id,
        type: row.type,
        title: row.title,
        body: row.body,
        data: (row.data as Record<string, any>) || {},
        is_read: row.is_read,
        read_at: row.read_at,
        created_at: row.created_at,
      }))

      return { data: items, error: null }
    } catch (err) {
      return { data: [], error: err as Error }
    }
  },

  /**
   * S'abonne aux nouvelles notifications en temps réel pour l'utilisateur
   */
  subscribeToRealtimeNotifications(
    userId: string,
    onNotification: (notification: NotificationItem) => void
  ) {
    if (!supabase) return { unsubscribe: () => {} }

    const channel = supabase
      .channel(`user-notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const newRow = payload.new as any
          if (newRow) {
            const item: NotificationItem = {
              id: newRow.id,
              user_id: newRow.user_id,
              type: newRow.type,
              title: newRow.title,
              body: newRow.body,
              data: (newRow.data as Record<string, any>) || {},
              is_read: newRow.is_read,
              read_at: newRow.read_at,
              created_at: newRow.created_at,
            }
            onNotification(item)
          }
        }
      )
      .subscribe()

    return {
      unsubscribe: () => {
        supabase.removeChannel(channel)
      },
    }
  },

  /**
   * Marque une notification spécifique comme lue
   */
  async markNotificationAsRead(notificationId: string): Promise<{ error: Error | null }> {
    if (!supabase) return { error: new Error('Client Supabase non initialisé') }

    const { error } = await supabase
      .from('notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString(),
      })
      .eq('id', notificationId)

    if (error) return { error: new Error(error.message) }
    return { error: null }
  },

  /**
   * Marque toutes les notifications non lues d'un utilisateur comme lues
   */
  async markAllNotificationsAsRead(userId: string): Promise<{ error: Error | null }> {
    if (!supabase) return { error: new Error('Client Supabase non initialisé') }

    const { error } = await supabase
      .from('notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .eq('is_read', false)

    if (error) return { error: new Error(error.message) }
    return { error: null }
  },

  /**
   * Enregistre une souscription PWA Push en base de données (push_subscriptions)
   */
  async savePushSubscription(
    userId: string,
    sub: PushSubscriptionJSON
  ): Promise<{ error: Error | null }> {
    if (!supabase) return { error: new Error('Client Supabase non initialisé') }
    if (!sub.endpoint || !sub.keys?.p256dh || !sub.keys?.auth) {
      return { error: new Error('Clés de souscription PWA invalides') }
    }

    const { error } = await supabase.from('push_subscriptions').upsert(
      {
        user_id: userId,
        endpoint: sub.endpoint,
        p256dh: sub.keys.p256dh,
        auth: sub.keys.auth,
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'endpoint' }
    )

    if (error) return { error: new Error(error.message) }
    return { error: null }
  },

  /**
   * Supprime une souscription Push devenue invalide ou désactivée
   */
  async removePushSubscription(userId: string, endpoint: string): Promise<{ error: Error | null }> {
    if (!supabase) return { error: new Error('Client Supabase non initialisé') }

    const { error } = await supabase
      .from('push_subscriptions')
      .delete()
      .eq('user_id', userId)
      .eq('endpoint', endpoint)

    if (error) return { error: new Error(error.message) }
    return { error: null }
  },

  /**
   * Vérifie si une souscription Push est déjà enregistrée pour cet appareil
   */
  async isPushSubscriptionSaved(userId: string, endpoint: string): Promise<boolean> {
    if (!supabase) return false

    const { data } = await supabase
      .from('push_subscriptions')
      .select('id')
      .eq('user_id', userId)
      .eq('endpoint', endpoint)
      .maybeSingle()

    return Boolean(data)
  },
}