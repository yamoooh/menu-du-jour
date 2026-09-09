import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Header } from '@/components/Header'
import { supabase } from '@/lib/supabase'
import { CheckCircle2, ArrowRight, AlertCircle, Loader2 } from 'lucide-react'

export const AuthCallbackPage: React.FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const handleAuthCallback = async () => {
      try {
        // Traiter le hachage ou la session Supabase
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()

        if (sessionError) {
          if (isMounted) setError(sessionError.message)
        } else if (session) {
          // Session active
        } else {
          // Attendre un court instant si le changement d'état d'authentification est en cours
          const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
            if (currentSession && isMounted) {
              setLoading(false)
            }
          })

          setTimeout(() => {
            if (isMounted && loading) {
              setLoading(false)
            }
            subscription.unsubscribe()
          }, 1500)
          return
        }
      } catch (err: any) {
        if (isMounted) setError(err.message || 'Erreur lors de la confirmation')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    handleAuthCallback()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 py-12">
        <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 p-6 sm:p-8 space-y-6 text-center">
          <img src="/logo.png" alt="Menu du Jour" className="h-16 w-auto mx-auto object-contain mb-2" />

          {loading ? (
            <div className="py-8 space-y-4">
              <Loader2 className="w-10 h-10 text-orange-600 animate-spin mx-auto" />
              <p className="text-sm text-slate-600 font-medium">
                Validation de votre adresse email en cours...
              </p>
            </div>
          ) : error ? (
            <div className="space-y-4">
              <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto font-bold">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Erreur de confirmation</h2>
              <p className="text-xs text-slate-600">{error}</p>
              <Link
                to="/connexion"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors"
              >
                Aller à la page de connexion
              </Link>
            </div>
          ) : (
            <div className="space-y-5 animate-fadeIn">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto font-bold shadow-xs">
                <CheckCircle2 className="w-9 h-9 text-emerald-600" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Adresse email confirmée !
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Votre adresse email a été confirmée avec succès. Votre compte Menu du Jour est maintenant actif et prêt à l'emploi.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => navigate('/connexion', { state: { message: 'Adresse email confirmée avec succès ! Vous pouvez maintenant vous connecter.' } })}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-bold text-sm shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  Se connecter à mon compte
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
