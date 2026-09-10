import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Header } from '@/components/Header'
import { Mail, AlertCircle, CheckCircle2, ArrowLeft, KeyRound } from 'lucide-react'
import { SeoHead } from '@/components/public/SeoHead'
import { Logo } from '@/components/common/Logo'

export const ForgotPasswordPage: React.FC = () => {
  const { resetPassword } = useAuth()

  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccessMessage(null)

    if (!email.trim()) {
      setError('Veuillez renseigner votre adresse email.')
      return
    }

    setLoading(true)
    const { error: resetError } = await resetPassword(email.trim())
    setLoading(false)

    if (resetError) {
      setError(resetError.message)
    } else {
      setSuccessMessage(
        'Si cette adresse email existe dans notre système, un lien de réinitialisation vous a été envoyé par email.'
      )
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <SeoHead
        title="Mot de passe oublié - Menu du Jour"
        description="Réinitialisation de mot de passe Menu du Jour."
        path="/mot-de-passe-oublie"
        noindex={true}
      />
      <Header />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 py-12">
        <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <Logo size="lg" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold mb-2">
                <KeyRound className="w-3.5 h-3.5" />
                Sécurité Compte
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight font-display">
                Mot de passe oublié
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Saisissez votre email pour recevoir le lien de réinitialisation.
              </p>
            </div>
          </div>

          {successMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {error && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

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
                  placeholder="nom@exemple.com"
                  required
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors disabled:bg-slate-50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-bold text-sm shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Envoi du lien...
                </>
              ) : (
                'Envoyer le lien de réinitialisation'
              )}
            </button>
          </form>

          <div className="text-center pt-3 border-t border-slate-100">
            <Link
              to="/connexion"
              className="text-xs text-slate-600 hover:text-orange-600 font-bold inline-flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Retour à la connexion
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

