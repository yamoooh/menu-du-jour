import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { notificationService } from '@/services/notificationService'
import type { NotificationItem } from '@/types/notification.types'
import { Bell, CheckCheck, Utensils, Calendar, AlertCircle, Info, ExternalLink } from 'lucide-react'

export const NotificationBell: React.FC = () => {
  const { user } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()

  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter((n) => !n.is_read).length

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

    return () => {
      sub.unsubscribe()
    }
  }, [user?.id])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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

    setIsOpen(false)

    if (notif.data?.restaurant_slug) {
      navigate(`/restaurants/${notif.data.restaurant_slug}`)
    } else if (notif.type.startsWith('reservation')) {
      if (user) {
        navigate('/espace-client')
      }
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'new_menu':
        return <Utensils className="w-4 h-4 text-orange-600" />
      case 'reservation_confirmed':
      case 'reservation_completed':
        return <Calendar className="w-4 h-4 text-emerald-600" />
      case 'reservation_rejected':
      case 'reservation_cancelled':
        return <AlertCircle className="w-4 h-4 text-red-600" />
      case 'subscription_expiring':
      case 'subscription_expired':
        return <AlertCircle className="w-4 h-4 text-amber-600" />
      default:
        return <Info className="w-4 h-4 text-blue-600" />
    }
  }

  if (!user) return null

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer focus:outline-none"
        title={t.notifications.title}
        aria-label={t.notifications.title}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-extrabold text-white shadow-xs animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-orange-600" />
              <h3 className="font-bold text-sm text-slate-900">{t.notifications.title}</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 font-bold text-[11px]">
                  {unreadCount} {t.notifications.unreadBadge}
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>{t.notifications.markAllAsRead}</span>
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
            {loading ? (
              <div className="p-8 text-center text-xs text-slate-400">Chargement...</div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <Bell className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-semibold text-slate-600">
                  {t.notifications.noNotifications}
                </p>
                <p className="text-[11px] text-slate-400">
                  {t.notifications.emptyStateDesc}
                </p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-3.5 flex items-start gap-3 hover:bg-slate-50 transition-colors cursor-pointer ${
                    !notif.is_read ? 'bg-orange-50/40 font-medium' : ''
                  }`}
                >
                  <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs shrink-0 mt-0.5">
                    {getIcon(notif.type)}
                  </div>

                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {notif.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {new Date(notif.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {notif.body}
                    </p>
                    {notif.data?.restaurant_slug && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-orange-600 hover:underline pt-0.5">
                        {t.notifications.viewDetails}
                        <ExternalLink className="w-3 h-3" />
                      </span>
                    )}
                  </div>

                  {!notif.is_read && (
                    <button
                      onClick={(e) => handleMarkAsRead(notif.id, e)}
                      title={t.notifications.markAsRead}
                      className="w-2.5 h-2.5 rounded-full bg-orange-600 shrink-0 mt-1 hover:scale-125 transition-transform"
                    />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}