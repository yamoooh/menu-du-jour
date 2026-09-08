import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import type { UserRole } from '@/types/auth.types'
import { UtensilsCrossed } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { user, profile, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-md animate-pulse">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-slate-600">Chargement de votre session...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/connexion" state={{ from: location }} replace />
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = profile?.role

    if (!userRole || !allowedRoles.includes(userRole)) {
      // Redirection vers sa zone autorisée
      if (userRole === 'client') {
        return <Navigate to="/espace-client" replace />
      }
      if (userRole === 'restaurant_manager') {
        return <Navigate to="/espace-restaurant" replace />
      }
      if (userRole === 'admin') {
        return <Navigate to="/admin" replace />
      }
      return <Navigate to="/connexion" replace />
    }
  }

  return <>{children}</>
}
