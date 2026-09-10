import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { Menu as MenuIcon, X } from 'lucide-react'

export const PublicHeader: React.FC = () => {
  const { language, setLanguage } = useLanguage()
  const { user, profile } = useAuth()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { path: '/', label: 'Accueil' },
    { path: '/a-propos', label: 'À propos' },
    { path: '/engagez-nous', label: 'Engagez-nous' },
    { path: '/tarifs', label: 'Tarifs' },
    { path: '/contact', label: 'Contact' },
  ]

  const getDashboardPath = () => {
    if (!profile) return '/connexion'
    if (profile.role === 'client') return '/espace-client'
    if (profile.role === 'restaurant_manager') return '/espace-restaurant'
    if (profile.role === 'admin') return '/admin'
    return '/connexion'
  }

  const logoUrl =
    'https://lh3.googleusercontent.com/aida/AEtjO1UTt-dNa22cOeXEs7v8x9kOXhf2TxxgJonsL9_Oz5pDK6exz46Abxlmk4aUjK6aMeQRY1FFDioZKZP0kw7opI2le25btUY1uLfxKvHQhg4X3EZbh7VOEARmjDnC66zmZg0__BNzLHIi10bixPDXHyAl4D-Y0z1X_X3AFBpIazoPOEkhVVJID4rB4uYDKC48ourRAOOrQOhFzanyXMH7k66usylb-1s8WQxnS034eNhV2C6lvKgE5MQ3sDI'

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-20 max-w-[1600px] mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop flex items-center justify-between gap-space-md">
        {/* Logo Stitch */}
        <div className="flex items-center gap-space-md">
          <Link className="flex items-center gap-space-sm focus:outline-none" to="/">
            <img
              alt="Menu du Jour Logo"
              className="h-8 w-auto object-contain"
              src={logoUrl}
            />
            <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight hidden sm:inline-block">
              Menu du Jour
            </span>
          </Link>
        </div>

        {/* Navigation Desktop */}
        <nav className="hidden lg:flex items-center gap-space-xs">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-space-md py-space-xs rounded-xl font-label-lg text-label-lg transition-colors ${
                  isActive
                    ? 'bg-surface-container text-on-surface font-semibold shadow-2xs'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Côté Droit : Sélecteur Langue, Connexion, Inscription */}
        <div className="flex items-center gap-space-sm">
          {/* FR / EN Switcher */}
          <div className="flex items-center bg-surface-container-low rounded-lg p-space-2xs">
            <button
              onClick={() => setLanguage('fr')}
              className={`px-space-xs py-space-2xs rounded-DEFAULT font-label-sm text-label-sm transition-all cursor-pointer ${
                language === 'fr'
                  ? 'bg-surface-container-lowest text-on-surface font-semibold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              type="button"
            >
              FR
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-space-xs py-space-2xs rounded-DEFAULT font-label-sm text-label-sm transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-surface-container-lowest text-on-surface font-semibold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              type="button"
            >
              EN
            </button>
          </div>

          <div className="h-6 w-px bg-outline-variant hidden sm:block"></div>

          {user ? (
            <Link
              to={getDashboardPath()}
              className="inline-flex items-center justify-center px-space-base py-space-xs rounded-xl font-label-md text-label-md bg-secondary text-on-secondary hover:bg-secondary-container transition-colors shadow-sm"
            >
              Mon Espace
            </Link>
          ) : (
            <>
              <Link
                to="/connexion"
                className="hidden sm:inline-flex items-center justify-center px-space-base py-space-xs rounded-xl font-label-md text-label-md text-on-surface hover:bg-surface-container-high transition-colors"
              >
                Connexion
              </Link>
              <Link
                to="/inscription"
                className="inline-flex items-center justify-center px-space-base py-space-xs rounded-xl font-label-md text-label-md bg-secondary text-on-secondary hover:bg-secondary-container transition-colors shadow-sm"
              >
                S'inscrire
              </Link>
            </>
          )}

          {/* User Icon Circle */}
          <Link
            to={user ? getDashboardPath() : '/connexion'}
            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center hover:opacity-85 transition-opacity"
          >
            <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-on-surface hover:bg-surface-container transition-colors"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Menu Mobile Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-outline-variant/30 bg-surface px-6 py-5 shadow-lg flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`py-2 px-3 rounded-lg font-label-lg text-label-lg ${
                location.pathname === link.path
                  ? 'bg-surface-container text-on-surface font-bold'
                  : 'text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-outline-variant/30 flex flex-col gap-2">
            {!user ? (
              <>
                <Link
                  to="/connexion"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center rounded-xl font-label-md text-label-md border border-outline-variant text-on-surface"
                >
                  Connexion
                </Link>
                <Link
                  to="/inscription"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center rounded-xl font-label-md text-label-md bg-secondary text-on-secondary"
                >
                  S'inscrire
                </Link>
              </>
            ) : (
              <Link
                to={getDashboardPath()}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center rounded-xl font-label-md text-label-md bg-secondary text-on-secondary"
              >
                Mon Espace
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
