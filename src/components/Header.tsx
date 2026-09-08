import { Link, useNavigate } from 'react-router-dom'
import { UtensilsCrossed, LogOut, User as UserIcon, LogIn, UserPlus } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { NotificationBell } from '@/components/notification/NotificationBell'
import { ROLE_LABELS, type UserRole } from '@/types/auth.types'

export const Header = () => {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/connexion')
  }

  const roleLabel = profile?.role ? ROLE_LABELS[profile.role as UserRole] || '' : ''

  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 md:h-24 flex items-center justify-between">
        {/* Logo (Agrandi pour une lisibilité optimale) */}
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="/logo.png"
            alt="Menu du Jour"
            className="h-14 sm:h-16 md:h-18 w-auto object-contain group-hover:scale-105 transition-transform"
          />
        </Link>

        {/* Actions utilisateur / Navigation */}
        <div className="flex items-center gap-4">
          <Link
            to="/decouvrir"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-slate-800 hover:text-orange-600 hover:bg-orange-50 transition-colors"
          >
            <UtensilsCrossed className="w-4 h-4 text-orange-500" />
            <span className="hidden sm:inline">Découvrir</span>
          </Link>
          {user ? (
            <div className="flex items-center gap-3">
              <NotificationBell />
              <div className="hidden sm:flex flex-col items-end text-right">
                <span className="text-sm font-semibold text-slate-900 leading-none">
                  {profile?.full_name || user.email}
                </span>
                <span className="text-xs font-medium text-orange-600 mt-1">
                  {roleLabel}
                </span>
              </div>

              <div className="sm:hidden w-8 h-8 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-xs">
                <UserIcon className="w-4 h-4" />
              </div>

              <button
                onClick={handleSignOut}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
                title="Se déconnecter"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/connexion"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <LogIn className="w-3.5 h-3.5 text-slate-500" />
                Se connecter
              </Link>
              <Link
                to="/inscription"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-sm shadow-orange-500/20 hover:opacity-95 transition-opacity"
              >
                <UserPlus className="w-3.5 h-3.5" />
                S'inscrire
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
