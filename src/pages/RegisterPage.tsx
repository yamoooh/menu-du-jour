import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Header } from '@/components/Header'
import { Mail, Lock, User, Phone, Store, UserCheck, AlertCircle, ArrowRight, Eye, EyeOff, ShieldCheck, Sparkles } from 'lucide-react'
import { SeoHead } from '@/components/public/SeoHead'
import { Logo } from '@/components/common/Logo'

export const RegisterPage: React.FC = () => {
  const { signUp, user, profile, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  const [role, setRole] = useState<'client' | 'restaurant_manager'>('client')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Si déjà connecté, rediriger automatiquement
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

    // Validation des champs
    if (!firstName.trim() || !lastName.trim()) {
      setError('Veuillez renseigner votre prénom et votre nom.')
      return
    }

    if (!email.trim() || !email.includes('@')) {
      setError('Veuillez renseigner une adresse email valide.')
      return
    }

    if (!phone.trim()) {
      setError('Veuillez renseigner un numéro de téléphone.')
      return
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.')
      return
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }

    setLoading(true)

    const { error: signUpError, needsEmailConfirmation } = await signUp({
      email: email.trim(),
      password,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim(),
      role,
    })

    setLoading(false)

    if (signUpError) {
      setError(signUpError.message)
      return
    }

    if (needsEmailConfirmation) {
      navigate('/connexion', {
        state: {
          message: 'Votre compte a été créé avec succès ! Un email de confirmation vous a été envoyé. Veuillez cliquer sur le lien pour activer votre compte puis vous connecter.',
        },
      })
    } else {
      // Si la session est immédiatement disponible
      if (role === 'client') navigate('/espace-client', { replace: true })
      else navigate('/espace-restaurant', { replace: true })
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <SeoHead
        title="Inscription - Menu du Jour"
        description="Créez votre compte client ou restaurant sur Menu du Jour."
        path="/inscription"
        noindex={true}
      />
      <Header />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 py-8 sm:py-12">
        <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6">
          {/* Header de la carte */}
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <Logo size="lg" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-display">
                Créer votre compte
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Rejoignez la communauté des gourmets & restaurateurs au Cameroun
              </p>
            </div>
          </div>

          {/* Choix du rôle */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block text-center">
              Je m'inscris en tant que :
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('client')}
                className={`p-3.5 rounded-2xl border text-left flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                  role === 'client'
                    ? 'border-orange-600 bg-orange-50/80 text-orange-950 ring-2 ring-orange-600/20 font-bold shadow-xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className={`p-2 rounded-xl ${role === 'client' ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  <UserCheck className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-900">Client / Gourmet</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('restaurant_manager')}
                className={`p-3.5 rounded-2xl border text-left flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                  role === 'restaurant_manager'
                    ? 'border-orange-600 bg-orange-50/80 text-orange-950 ring-2 ring-orange-600/20 font-bold shadow-xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className={`p-2 rounded-xl ${role === 'restaurant_manager' ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  <Store className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-900 text-center leading-tight">
                  Gestionnaire Restaurant
                </span>
              </button>
            </div>
          </div>

          {/* Banner d'information dynamic selon role */}
          <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/70 text-amber-900 text-xs flex items-center gap-3">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="font-medium">
              {role === 'client'
                ? 'Accès 100% gratuit pour découvrir et enregistrer vos plats du jour favoris.'
                : 'Période d\'essai gratuit de 30 jours pour diffuser le menu de votre établissement.'}
            </span>
          </div>

          {/* Alert d'erreur */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Prénom
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Jean"
                    required
                    disabled={loading}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors disabled:bg-slate-50"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Nom
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Kouassi"
                    required
                    disabled={loading}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors disabled:bg-slate-50"
                  />
                </div>
              </div>
            </div>

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
                  placeholder="nom@exemple.com"
                  required
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors disabled:bg-slate-50"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Numéro de téléphone (WhatsApp recommandé)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+237 6XX XX XX XX"
                  required
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors disabled:bg-slate-50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={loading}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors disabled:bg-slate-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors p-1 cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Confirmation
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={loading}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors disabled:bg-slate-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors p-1 cursor-pointer"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-bold text-sm shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Création du compte...
                </>
              ) : (
                <>
                  S'inscrire et commencer
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Rassurance sécurisée */}
          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Données protégées & cryptées selon les normes Supabase Security</span>
          </div>

          {/* Footer de la carte */}
          <div className="text-center pt-3 border-t border-slate-100 text-xs text-slate-600">
            Vous avez déjà un compte ?{' '}
            <Link
              to="/connexion"
              className="text-orange-600 hover:text-orange-700 font-bold inline-flex items-center gap-0.5"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
