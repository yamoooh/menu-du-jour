import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Header } from '@/components/Header'
import { Mail, Lock, User, Phone, Store, UserCheck, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react'
import { SeoHead } from '@/components/public/SeoHead'

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
        <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 p-6 sm:p-8 space-y-6">
          {/* Header de la carte */}
          <div className="text-center space-y-2">
            <img src="/logo.png" alt="Menu du Jour" className="h-16 w-auto mx-auto object-contain mb-1" />
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Créer votre compte
            </h2>
            <p className="text-xs text-slate-500">
              Rejoignez la plateforme Menu du Jour
            </p>
          </div>

          {/* Choix du rôle */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 block text-center">
              Je m'inscris en tant que :
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('client')}
                className={`p-3.5 rounded-xl border text-left flex flex-col items-center justify-center gap-2 transition-all ${
                  role === 'client'
                    ? 'border-orange-500 bg-orange-50/60 text-orange-900 ring-2 ring-orange-500/20 font-semibold'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <UserCheck className={`w-5 h-5 ${role === 'client' ? 'text-orange-600' : 'text-slate-400'}`} />
                <span className="text-xs font-medium">Client</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('restaurant_manager')}
                className={`p-3.5 rounded-xl border text-left flex flex-col items-center justify-center gap-2 transition-all ${
                  role === 'restaurant_manager'
                    ? 'border-orange-500 bg-orange-50/60 text-orange-900 ring-2 ring-orange-500/20 font-semibold'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <Store className={`w-5 h-5 ${role === 'restaurant_manager' ? 'text-orange-600' : 'text-slate-400'}`} />
                <span className="text-xs font-medium text-center leading-tight">
                  Gestionnaire de restaurant
                </span>
              </button>
            </div>
          </div>

          {/* Alert d'erreur */}
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
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
                <label className="text-xs font-semibold text-slate-700 block">
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
              <label className="text-xs font-semibold text-slate-700 block">
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
              <label className="text-xs font-semibold text-slate-700 block">
                Numéro de téléphone
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+225 0700000000"
                  required
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors disabled:bg-slate-50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
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
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors p-1"
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
                <label className="text-xs font-semibold text-slate-700 block">
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
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors p-1"
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
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-semibold text-sm shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Création du compte...
                </>
              ) : (
                <>
                  S'inscrire
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer de la carte */}
          <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-600">
            Vous avez déjà un compte ?{' '}
            <Link
              to="/connexion"
              className="text-orange-600 hover:text-orange-700 font-semibold inline-flex items-center gap-0.5"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
