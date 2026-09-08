import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { notificationService } from '@/services/notificationService'
import type { NotificationItem } from '@/types/notification.types'
import { Bell, CheckCheck, Utensils, Calendar, AlertCircle, Info, ExternalLink } from 'lucide-react'

export const NotificationList: React.FC = () => {
  const { user } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()

  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const [loading, setLoading] = useState(true)

  const loadNotifications = async () => {
    if (!user) return
    setLoading(true)
    const { data } = await notificationService.getUserNotifications(user.id)
    setNotifications(data)
    setLoading(false)
  }

  useEffect(() => {
    if (!user) return

    loadNotifications()

    const sub = notificationService.subscribeToRealtimeNotifications(user.id, (newNotif) => {
      setNotifications((prev) => [newNotif, ...prev])
    })

    return () => sub.unsubscribe()
  }, [user?.id])

  const handleMarkAsRead = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    await notificationService.markNotificationAsRead(id)
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true, read_at: new Date().toISOString() } : n))
    )
  }

  const handleMarkAllAsRead = async () => {
    if (!user) return
    await notificationService.markAllNotificationsAsRead(user.id)
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, is_read: true, read_at: new Date().toISOString() }))
    )
  }

  const handleNotificationClick = async (notif: NotificationItem) => {
    if (!notif.is_read) {
      await handleMarkAsRead(notif.id)
    }

    if (notif.data?.restaurant_slug) {
      navigate(`/restaurants/${notif.data.restaurant_slug}`)
    } else if (notif.type.startsWith('reservation')) {
      if (user) {
        navigate('/espace-client')
      }
    }
  }

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.is_read
    return true
  })

  const unreadCount = notifications.filter((n) => !n.is_read).length

  const getIcon = (type: string) => {
    switch (type) {
      case 'new_menu':
        return <Utensils className="w-5 h-5 text-orange-600" />
      case 'reservation_confirmed':
      case 'reservation_completed':
        return <Calendar className="w-5 h-5 text-emerald-600" />
      case 'reservation_rejected':
      case 'reservation_cancelled':
        return <AlertCircle className="w-5 h-5 text-red-600" />
      case 'subscription_expiring':
      case 'subscription_expired':
        return <AlertCircle className="w-5 h-5 text-amber-600" />
      default:
        return <Info className="w-5 h-5 text-blue-600" />
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Bell className="w-5 h-5 text-orange-600" />
            {t.notifications.title}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {t.notifications.emptyStateDesc}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filter === 'all' ? 'bg-white text-orange-600 shadow-xs' : 'text-slate-600'
              }`}
            >
              {t.notifications.tabAll} ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filter === 'unread' ? 'bg-white text-orange-600 shadow-xs' : 'text-slate-600'
              }`}
            >
              {t.notifications.tabUnread} ({unreadCount})
            </button>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="px-3.5 py-1.5 rounded-xl bg-orange-50 text-orange-700 hover:bg-orange-100 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <CheckCheck className="w-4 h-4" />
              <span>{t.notifications.markAllAsRead}</span>
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400">Chargement de vos notifications...</div>
      ) : filteredNotifications.length === 0 ? (
        <div className="py-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 mx-auto flex items-center justify-center">
            <Bell className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-700">{t.notifications.noNotifications}</p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {t.notifications.emptyStateDesc}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleNotificationClick(notif)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-4 ${
                !notif.is_read
                  ? 'border-orange-200 bg-orange-50/30 shadow-xs'
                  : 'border-slate-100 bg-white hover:border-slate-200'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs shrink-0 mt-0.5">
                {getIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-slate-900 truncate">{notif.title}</h3>
                  <span className="text-xs text-slate-400 shrink-0">
                    {new Date(notif.created_at).toLocaleDateString([], {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{notif.body}</p>

                {notif.data?.restaurant_slug && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:underline pt-1">
                    {t.notifications.viewDetails}
                    <ExternalLink className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>

              {!notif.is_read && (
                <button
                  onClick={(e) => handleMarkAsRead(notif.id, e)}
                  className="px-2.5 py-1 rounded-lg bg-orange-100 text-orange-800 text-[11px] font-bold hover:bg-orange-200 transition-colors shrink-0"
                >
                  {t.notifications.markAsRead}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}