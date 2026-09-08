import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { followerService } from '@/services/followerService'
import { Heart, Check, UserPlus } from 'lucide-react'

interface FollowButtonProps {
  restaurantId: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
  onFollowChange?: (isFollowing: boolean) => void
}

export const FollowButton: React.FC<FollowButtonProps> = ({
  restaurantId,
  size = 'md',
  className = '',
  onFollowChange,
}) => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [isFollowing, setIsFollowing] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [actionLoading, setActionLoading] = useState<boolean>(false)
  const [hovered, setHovered] = useState<boolean>(false)

  useEffect(() => {
    let isMounted = true
    if (user && restaurantId) {
      followerService.isFollowing(restaurantId).then((res) => {
        if (isMounted) {
          setIsFollowing(res)
          setLoading(false)
        }
      })
    } else {
      setLoading(false)
    }
    return () => {
      isMounted = false
    }
  }, [user, restaurantId])

  const handleToggleFollow = async (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()

    if (!user) {
      if (
        window.confirm(
          'Vous devez être connecté pour suivre un restaurant. Souhaitez-vous vous connecter ?'
        )
      ) {
        navigate('/connexion')
      }
      return
    }

    setActionLoading(true)

    if (isFollowing) {
      const { success } = await followerService.unfollowRestaurant(restaurantId)
      if (success) {
        setIsFollowing(false)
        onFollowChange?.(false)
      }
    } else {
      const { success } = await followerService.followRestaurant(restaurantId)
      if (success) {
        setIsFollowing(true)
        onFollowChange?.(true)
      }
    }

    setActionLoading(false)
  }

  if (loading) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-400 text-xs font-semibold animate-pulse">
        <div className="w-3.5 h-3.5 bg-slate-300 rounded-full" />
        <span>Chargement...</span>
      </div>
    )
  }

  const sizeStyles = {
    sm: 'px-2.5 py-1 text-[11px]',
    md: 'px-3.5 py-1.5 text-xs',
    lg: 'px-5 py-2.5 text-sm font-bold',
  }[size]

  if (isFollowing) {
    return (
      <button
        onClick={handleToggleFollow}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        disabled={actionLoading}
        title="Cliquer pour ne plus suivre ce restaurant"
        className={`inline-flex items-center justify-center gap-1.5 rounded-xl font-semibold transition-all cursor-pointer border ${
          hovered
            ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
        } ${sizeStyles} ${className}`}
      >
        {actionLoading ? (
          <div className="w-3.5 h-3.5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        ) : hovered ? (
          <>
            <Heart className="w-3.5 h-3.5 fill-red-600 text-red-600" />
            <span>Ne plus suivre</span>
          </>
        ) : (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>Suivi</span>
          </>
        )}
      </button>
    )
  }

  return (
    <button
      onClick={handleToggleFollow}
      disabled={actionLoading}
      className={`inline-flex items-center justify-center gap-1.5 rounded-xl font-bold transition-all cursor-pointer bg-slate-900 hover:bg-slate-800 text-white shadow-xs hover:shadow-md ${sizeStyles} ${className}`}
    >
      {actionLoading ? (
        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          <UserPlus className="w-3.5 h-3.5 text-orange-400" />
          <span>Suivre</span>
        </>
      )}
    </button>
  )
}
