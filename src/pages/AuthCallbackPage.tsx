import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Header } from '@/components/Header'
import { supabase } from '@/lib/supabase'
import { CheckCircle2, ArrowRight, AlertCircle, Loader2 } from 'lucide-react'

export const AuthCallbackPage: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState('Validation de votre adresse email en cours...')

  useEffect(() => {
    let isMounted = true

    const redirectUserSpace = async (userId: string) => {
      try {
        if (isMounted) setStatusMessage('Redirection vers votre espace...')
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', userId)
          .single()

        if (!isMounted) return

        if (profile?.role === 'restaurant_manager') {
          navigate('/espace-restaurant', { replace: true })
        } else if (profile?.role === 'admin') {
          navigate('/admin', { replace: true })
        } else {
          navigate('/espace-client', { replace: true })
        }
      } catch {
        if (isMounted) {
          navigate('/connexion?confirmed=1', { replace: true })
        }
      }
    }

    const handleAuthCallback = async () => {
      try {
        const errorDesc = searchParams.get('error_description')
        if (errorDesc) {
          if (isMounted) {
            setError(errorDesc)
            setLoading(false)
          }
          return
        }

        const { data: { session }, error: sessionError } = await supabase.auth.getSession()

        if (sessionError) {
          if (isMounted) {
            setError(sessionError.message)
            setLoading(false)
          }
          return
        }

        if (session?.user) {
          await redirectUserSpace(session.user.id)
          return
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
          if (currentSession?.user && isMounted) {
            subscription.unsubscribe()
            await redirectUserSpace(currentSession.user.id)
          }
        })

        setTimeout(() => {
          subscription.unsubscribe()
          if (isMounted && loading) {
            navigate('/connexion?confirmed=1', { replace: true })
          }
        }, 1500)
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Erreur lors de la confirmation d\'adresse email')
          setLoading(false)
        }
      }
    }

    handleAuthCallback()

    return () => {
      isMounted = false
    }
  }, [navigate, searchParams])

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 py-12">
        <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 p-6 sm:p-8 space-y-6 text-center">
          <img src="/logo.png" alt="Menu du Jour" className="h-16 w-auto mx-auto object-contain mb-2" />

          {loading ? (
            <div className="py-8 space-y-4">
              <Loader2 className="w-10 h-10 text-orange-600 animate-spin mx-auto" />
              <p className="text-sm text-slate-600 font-medium">{statusMessage}</p>
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
                  Votre adresse email a été confirmée avec succès.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => navigate('/connexion?confirmed=1', { replace: true })}
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

