import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { Header } from '@/components/Header'
import { Mail, Lock, AlertCircle, ArrowRight, Shield, Eye, EyeOff } from 'lucide-react'
import { SeoHead } from '@/components/public/SeoHead'
import { Logo } from '@/components/common/Logo'

export const AdminLoginPage: React.FC = () => {
  const { signIn, signOut, user, profile, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Redirection automatique si déjà connecté en tant qu'admin
  React.useEffect(() => {
    if (!authLoading && user && profile) {
      if (profile.role === 'admin') {
        navigate('/admin', { replace: true })
      }
    }
  }, [user, profile, authLoading, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email.trim() || !password) {
      setError('Veuillez renseigner votre email administrateur et mot de passe.')
      return
    }

    setLoading(true)
    const { error: signInError } = await signIn({ email: email.trim(), password })

    if (signInError) {
      setLoading(false)
      setError(signInError.message)
      return
    }

    // Vérifier strictement le rôle admin auprès du profil Supabase
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .maybeSingle()

      if (userProfile?.role !== 'admin') {
        await signOut()
        setLoading(false)
        setError('Accès refusé. Ce portail est réservé exclusivement aux administrateurs de la plateforme Menu du Jour.')
        return
      }
    }

    setLoading(false)
    navigate('/admin', { replace: true })
  }


  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <SeoHead
        title="Connexion Administration System - Menu du Jour"
        description="Portail d'administration sécurisé pour la plateforme Menu du Jour."
        path="/admin/connexion"
        noindex={true}
      />
      <Header />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 py-12">
        <div className="w-full max-w-md bg-slate-900/90 rounded-3xl border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
          {/* Accent glow line top */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-600 to-amber-500" />

          {/* Badge & Logo Header */}
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <Logo size="lg" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold mb-2">
                <Shield className="w-3.5 h-3.5" />
                Portail Administration Système
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight font-display">
                Connexion Super Admin
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Authentification forte requise pour l'accès aux commandes plateforme
              </p>
            </div>
          </div>

          {/* Alert Erreur */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Formulaire Admin */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">
                Email Administrateur
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@menudujour.cm"
                  required
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-colors disabled:opacity-50"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  disabled={loading}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-colors disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-sm shadow-lg shadow-orange-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer mt-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Vérification des droits...
                </>
              ) : (
                <>
                  Accéder à la console Admin
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer retour public */}
          <div className="text-center pt-3 border-t border-slate-800 text-xs text-slate-500">
            Portail réservé.{' '}
            <Link to="/connexion" className="text-orange-400 hover:text-orange-300 font-bold">
              Connexion Utilisateur standard
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

