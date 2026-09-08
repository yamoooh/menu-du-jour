import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { Menu as MenuIcon, X, Globe, UserPlus, LogIn, LayoutDashboard } from 'lucide-react'

export const PublicHeader: React.FC = () => {
  const { t, language, setLanguage } = useLanguage()
  const { user, profile } = useAuth()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { path: '/', label: t.nav.home },
    { path: '/a-propos', label: t.nav.about },
    { path: '/engagez-nous', label: t.nav.engage },
    { path: '/tarifs', label: t.nav.pricing },
    { path: '/contact', label: t.nav.contact },
  ]

  const getDashboardPath = () => {
    if (!profile) return '/connexion'
    if (profile.role === 'client') return '/espace-client'
    if (profile.role === 'restaurant_manager') return '/espace-restaurant'
    if (profile.role === 'admin') return '/admin'
    return '/connexion'
  }

  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-2xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="/logo.png"
            alt="Menu du Jour"
            className="h-12 w-auto object-contain group-hover:scale-105 transition-transform"
          />
        </Link>

        {/* Navigation Principale Desktop */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`text-xs font-bold transition-colors ${
                  isActive
                    ? 'text-orange-600 border-b-2 border-orange-600 pb-1'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Droite du Header : FR/EN, Auth, CTA */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Sélecteur de Langue FR / EN */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold border border-slate-200">
            <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
            <button
              onClick={() => setLanguage('fr')}
              className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                language === 'fr' ? 'bg-white text-orange-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              FR
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                language === 'en' ? 'bg-white text-orange-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              EN
            </button>
          </div>

          {user ? (
            <Link
              to={getDashboardPath()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-sm hover:bg-slate-800 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-orange-400" />
              <span>{t.nav.dashboard}</span>
            </Link>
          ) : (
            <>
              <Link
                to="/connexion"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <LogIn className="w-3.5 h-3.5 text-slate-400" />
                {t.nav.signIn}
              </Link>
              <Link
                to="/inscription"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5 text-slate-400" />
                {t.nav.signUp}
              </Link>
            </>
          )}

          <Link
            to="/inscription"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-extrabold text-xs shadow-md shadow-orange-500/20 transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            {t.nav.startFree}
          </Link>
        </div>

        {/* Bouton Menu Mobile */}
        <div className="flex items-center gap-2 lg:hidden">
          {/* Sélecteur rapide de langue mobile */}
          <button
            onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
            className="p-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs uppercase"
          >
            {language}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Off-canvas Menu Mobile */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-6 space-y-4 shadow-lg animate-in slide-in-from-top duration-150">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm font-bold py-2 border-b border-slate-100 ${
                  location.pathname === link.path ? 'text-orange-600' : 'text-slate-700'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="pt-2 space-y-3">
            {user ? (
              <Link
                to={getDashboardPath()}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4 text-orange-400" />
                {t.nav.dashboard}
              </Link>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/connexion"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 rounded-xl border border-slate-200 text-center font-bold text-xs text-slate-700"
                >
                  {t.nav.signIn}
                </Link>
                <Link
                  to="/inscription"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 rounded-xl bg-orange-600 text-center font-bold text-xs text-white"
                >
                  {t.nav.signUp}
                </Link>
              </div>
            )}

            <Link
              to="/inscription"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 text-white font-extrabold text-xs text-center block shadow-md"
            >
              {t.nav.startFree}
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
