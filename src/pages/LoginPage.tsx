import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Header } from '@/components/Header'
import { Logo } from '@/components/common/Logo'
import { Mail, Lock, AlertCircle, ArrowRight, CheckCircle2, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { SeoHead } from '@/components/public/SeoHead'

export const LoginPage: React.FC = () => {
  const { signIn, user, profile, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Message transmis depuis l'inscription ou la confirmation d'email
  const searchParams = new URLSearchParams(location.search)
  const isEmailConfirmed = searchParams.get('confirmed') === '1'
  const isPasswordReset = searchParams.get('reset') === '1'
  const infoMessage =
    location.state?.message ||
    (isEmailConfirmed
      ? 'Votre adresse email a été confirmée avec succès. Vous pouvez maintenant vous connecter.'
      : isPasswordReset
      ? 'Votre mot de passe a été réinitialisé avec succès. Connectez-vous avec votre nouveau mot de passe.'
      : null)

  // Si déjà connecté, rediriger automatiquement vers son espace
  React.useEffect(() => {
    if (!authLoading && user && profile) {
      if (profile.role === 'client') navigate('/espace-client', { replace: true })
      else if (profile.role === 'restaurant_manager') navigate('/espace-restaurant', { replace: true })
      else if (profile.role === 'admin') navigate('/admin', { replace: true })
    }
  }, [user, profile, authLoading, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email.trim() || !password) {
      setError('Veuillez renseigner votre email et votre mot de passe.')
      return
    }

    setLoading(true)
    const { error: signInError } = await signIn({
      email: email.trim(),
      password,
    })

    setLoading(false)

    if (signInError) {
      setError(signInError.message)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      <SeoHead
        title="Connexion — Menu du Jour"
        description="Espace de connexion sécurisé Menu du Jour pour restaurateurs et gourmets."
        path="/connexion"
        noindex={true}
      />
      <Header />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 py-12 sm:py-16">
        <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6">
          {/* Header de la carte */}
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <Logo size="lg" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight font-display">
              Connexion à votre compte
            </h1>
            <p className="text-xs text-slate-500">
              Accédez à votre espace restaurateur ou gourmet au Cameroun
            </p>
          </div>

          {/* Message d'information (ex: email confirmé) */}
          {infoMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>{infoMessage}</span>
            </div>
          )}

          {/* Alert d'erreur */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4.5 h-4.5 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Adresse email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre.email@exemple.com"
                  required
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 font-medium text-xs focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors disabled:bg-slate-50"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 block">
                  Mot de passe
                </label>
                <Link
                  to="/mot-de-passe-oublie"
                  className="text-xs text-orange-600 hover:text-orange-700 font-bold cursor-pointer"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-300 font-medium text-xs focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors disabled:bg-slate-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-hidden transition-colors p-1 cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs shadow-md shadow-orange-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Connexion en cours...
                </>
              ) : (
                <>
                  Se connecter
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Reassurance */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] text-slate-500 text-center flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Connexion sécurisée SSL • Données cryptées Supabase</span>
          </div>

          {/* Footer de la carte */}
          <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-600">
            Vous n'avez pas encore de compte ?{' '}
            <Link
              to="/inscription"
              className="text-orange-600 hover:text-orange-700 font-extrabold inline-flex items-center gap-0.5 cursor-pointer"
            >
              Créer un compte
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
