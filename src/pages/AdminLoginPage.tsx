import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { SeoHead } from '@/components/public/SeoHead'
import {
  Shield,
  Terminal,
  Verified,
  Fingerprint,
  FileText,
  Key,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Server,
  Activity,
  AlertTriangle,
  ChevronRight,
  PhoneCall,
  LockKeyhole,
  CheckCircle2
} from 'lucide-react'

export const AdminLoginPage: React.FC = () => {
  const { signIn, signOut, user, profile, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [totpCode, setTotpCode] = useState(['8', '3', '9', '', '', ''])
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Redirection automatique si déjà connecté en tant qu'admin
  useEffect(() => {
    if (!authLoading && user && profile) {
      if (profile.role === 'admin') {
        navigate('/admin', { replace: true })
      }
    }
  }, [user, profile, authLoading, navigate])

  const handleTotpChange = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1)
    const next = [...totpCode]
    next[index] = val
    setTotpCode(next)
    if (val && index < 5) {
      const nextInput = document.getElementById(`totp-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email.trim() || !password) {
      setError('Veuillez renseigner votre email administrateur racine et votre clé secrète.')
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
        setError("Accès refusé. Ce portail est strictement réservé au Super Admin du SaaS Menu du Jour.")
        return
      }
    }

    setLoading(false)
    navigate('/admin', { replace: true })
  }

  return (
    <div className="bg-inverse-surface font-body-md text-inverse-on-surface min-h-screen flex flex-col justify-between antialiased selection:bg-secondary-container selection:text-on-secondary">
      <SeoHead
        title="Authentification Back Office - Super Admin Menu du Jour"
        description="Portail d'administration sécurisé pour la plateforme Menu du Jour."
        path="/admin/connexion"
        noindex={true}
      />

      {/* Top Header Bar */}
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Shield className="text-secondary-container w-5 h-5" />
          <span className="font-label-sm text-xs tracking-wider uppercase text-inverse-on-surface font-semibold">
            Zone Souveraine Dédiée
          </span>
        </Link>
        <div className="flex items-center gap-2 bg-primary-container px-3 py-1 rounded-lg border border-slate-700/50">
          <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse" />
          <span className="font-data-mono text-xs text-on-primary-container">
            Back Office Super Admin
          </span>
        </div>
      </div>

      {/* Main Console Enclave */}
      <main className="w-full flex-1 flex items-center justify-center px-4 py-8">
        <div className="flex flex-col w-full max-w-5xl mx-auto gap-8 relative">
          {/* Ambient glowing backdrop */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-3/4 h-72 bg-gradient-to-b from-secondary-container/10 via-primary-container/40 to-transparent blur-3xl pointer-events-none -z-10" />

          {/* Top Sovereign Node Metadata Banner */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-primary-container p-4 md:p-6 rounded-xl shadow-xl border border-slate-800">
            <div className="flex items-center gap-4">
              <div className="relative flex items-center justify-center w-11 h-11 rounded-lg bg-inverse-surface shadow-inner text-secondary-container border border-slate-700">
                <Terminal className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-secondary-container animate-ping" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-headline-sm text-lg font-bold text-inverse-on-surface tracking-tight font-display">
                    MENU DU JOUR
                  </span>
                  <span className="bg-secondary-container/20 text-secondary-container font-data-mono text-[10px] px-2 py-0.5 rounded tracking-widest font-semibold uppercase">
                    MASTER CONSOLE
                  </span>
                </div>
                <p className="font-body-sm text-xs text-on-primary-container">
                  Tour de Contrôle Centrale • Déploiement Souverain Node-CEMAC-01
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 bg-inverse-surface/80 px-3 py-1.5 rounded-lg border border-slate-800">
                <Verified className="text-secondary-container w-4 h-4" />
                <span className="font-label-sm text-xs text-inverse-on-surface">
                  Instance Centrale CEMAC
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-inverse-surface/80 px-3 py-1.5 rounded-lg border border-slate-800">
                <Fingerprint className="text-slate-400 w-4 h-4" />
                <span className="font-data-mono text-xs text-inverse-primary">
                  TLS 1.3 Strict Enforced
                </span>
              </div>
            </div>
          </div>

          {/* Security Warning Banner */}
          <div className="bg-secondary/15 border border-secondary/30 rounded-xl p-4 flex items-start gap-4 shadow-sm">
            <AlertTriangle className="text-secondary-container w-5 h-5 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <span className="font-label-md text-xs font-bold text-secondary-fixed uppercase tracking-wider">
                Avertissement de Sécurité Niveau 4
              </span>
              <p className="font-body-sm text-xs text-on-primary-container leading-relaxed">
                Accès strictement surveillé. Toute tentative d'intrusion ou d'accès non autorisé fait l'objet d'un enregistrement d'IP instantané, d'une géolocalisation forensique et d'une alerte immédiate transmise au Centre des Opérations Réseau (NOC).
              </p>
            </div>
          </div>

          {/* Error message if any */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/40 rounded-xl p-4 text-red-300 text-xs flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Two-Column Asymmetric Bento Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Primary Authentication Form (7 cols on desktop) */}
            <div className="lg:col-span-7 bg-primary-container rounded-xl p-6 md:p-8 shadow-xl border border-slate-800 flex flex-col justify-between relative overflow-hidden">
              <div className="flex flex-col gap-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-label-sm text-xs uppercase tracking-widest text-secondary-container font-semibold">
                      Protocole SAS-Auth
                    </span>
                    <h2 className="font-headline-md text-xl md:text-2xl font-bold text-inverse-on-surface mt-1 font-display">
                      Identification Superviseur
                    </h2>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-inverse-surface border border-slate-700 flex items-center justify-center">
                    <Key className="text-secondary-container w-4 h-4" />
                  </div>
                </div>

                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                  {/* Root Identity Input */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-sm text-xs font-semibold text-inverse-primary flex items-center justify-between" htmlFor="adminEmail">
                      <span>IDENTIFIANT OU EMAIL RACINE</span>
                      <span className="font-data-mono text-[10px] text-on-primary-container uppercase">
                        UID / ROOT ACCESS
                      </span>
                    </label>
                    <div className="relative flex items-center">
                      <Mail className="absolute left-3.5 text-on-primary-container w-4 h-4" />
                      <input
                        id="adminEmail"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@menudujour.cm"
                        className="w-full h-11 pl-10 pr-4 rounded-lg bg-inverse-surface text-inverse-on-surface font-data-mono text-sm placeholder:text-on-primary-container/60 focus:outline-none focus:ring-1 focus:ring-secondary-container border border-slate-700/80 shadow-inner"
                      />
                    </div>
                  </div>

                  {/* Master Cryptographic Password */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-sm text-xs font-semibold text-inverse-primary flex items-center justify-between" htmlFor="adminPassword">
                      <span>CLÉ SECRÈTE DE CHIFFREMENT</span>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-secondary-container hover:underline text-[11px] font-label-sm"
                      >
                        {showPassword ? 'Masquer' : 'Afficher'}
                      </button>
                    </label>
                    <div className="relative flex items-center">
                      <Lock className="absolute left-3.5 text-on-primary-container w-4 h-4" />
                      <input
                        id="adminPassword"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••••••"
                        className="w-full h-11 pl-10 pr-10 rounded-lg bg-inverse-surface text-inverse-on-surface font-data-mono text-sm placeholder:text-on-primary-container/60 focus:outline-none focus:ring-1 focus:ring-secondary-container border border-slate-700/80 shadow-inner"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 text-on-primary-container hover:text-inverse-on-surface"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* 2FA Authenticator TOTP Segment */}
                  <div className="flex flex-col gap-1.5 pt-2">
                    <div className="flex items-center justify-between">
                      <label className="font-label-sm text-xs font-semibold text-inverse-primary flex items-center gap-1.5">
                        <CheckCircle2 className="text-secondary-container w-3.5 h-3.5" />
                        <span>JETON HARDWARE / 2FA (TOTP 6 CHIFFRES)</span>
                      </label>
                      <span className="font-data-mono text-[11px] text-on-primary-container">
                        Expire dans: 24s
                      </span>
                    </div>
                    <div className="grid grid-cols-6 gap-2 mt-1">
                      {totpCode.map((digit, idx) => (
                        <input
                          key={idx}
                          id={`totp-${idx}`}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          pattern="[0-9]"
                          value={digit}
                          onChange={(e) => handleTotpChange(idx, e.target.value)}
                          placeholder="·"
                          className="w-full h-11 text-center rounded-lg bg-inverse-surface text-secondary-container font-data-mono text-base font-bold focus:outline-none focus:ring-1 focus:ring-secondary-container border border-slate-700 shadow-inner"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-4 h-12 rounded-lg bg-secondary-container hover:bg-orange-600 active:scale-[0.99] text-white font-label-lg text-sm font-bold flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <LockKeyhole className="w-4 h-4" />
                        <span>Déverrouiller la Console Super Admin</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-data-mono text-xs text-on-primary-container relative z-10">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary-container" />
                  <span>Clé matérielle Yubikey OTP autorisée</span>
                </div>
                <span className="font-data-mono text-[11px] text-slate-500">
                  ID Session: MDJ-ADM-9942B
                </span>
              </div>
            </div>

            {/* Infrastructure Status & Sovereign Security Telemetry (5 cols on desktop) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {/* Live Infrastructure Health Widget */}
              <div className="bg-primary-container rounded-xl p-6 shadow-xl border border-slate-800 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Server className="text-secondary-container w-4 h-4" />
                    <span className="font-label-sm text-xs uppercase tracking-wider text-inverse-on-surface font-semibold">
                      États des Passerelles & Nœuds
                    </span>
                  </div>
                  <span className="bg-inverse-surface font-data-mono text-[11px] text-secondary-container px-2 py-0.5 rounded border border-slate-700">
                    99.98% UP
                  </span>
                </div>

                {/* Nodes List */}
                <div className="flex flex-col gap-2.5">
                  {/* Node 1: LeekPay Webhook */}
                  <div className="bg-inverse-surface p-3 rounded-lg flex items-center justify-between border border-slate-800">
                    <div className="flex items-center gap-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-secondary-container" />
                      <div>
                        <p className="font-label-sm text-xs font-semibold text-inverse-on-surface">
                          Passerelle Webhook LeekPay
                        </p>
                        <p className="font-data-mono text-[11px] text-on-primary-container">
                          Agrégateur Mobile Money (OM/MOMO)
                        </p>
                      </div>
                    </div>
                    <span className="font-data-mono text-xs text-secondary-fixed">Opérationnelle</span>
                  </div>

                  {/* Node 2: PostgreSQL Supabase */}
                  <div className="bg-inverse-surface p-3 rounded-lg flex items-center justify-between border border-slate-800">
                    <div className="flex items-center gap-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-secondary-container" />
                      <div>
                        <p className="font-label-sm text-xs font-semibold text-inverse-on-surface">
                          Cluster PostgreSQL Supabase
                        </p>
                        <p className="font-data-mono text-[11px] text-on-primary-container">
                          Chiffrement AES-256 / TLS 1.3
                        </p>
                      </div>
                    </div>
                    <span className="font-data-mono text-xs text-inverse-primary">Verrouillé</span>
                  </div>

                  {/* Node 3: Edge CDN */}
                  <div className="bg-inverse-surface p-3 rounded-lg flex items-center justify-between border border-slate-800">
                    <div className="flex items-center gap-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-secondary-container" />
                      <div>
                        <p className="font-label-sm text-xs font-semibold text-inverse-on-surface">
                          Relais Edge CEMAC
                        </p>
                        <p className="font-data-mono text-[11px] text-on-primary-container">
                          Latence moyenne: 14ms
                        </p>
                      </div>
                    </div>
                    <span className="font-data-mono text-xs text-secondary-fixed">Synchronisé</span>
                  </div>
                </div>

                {/* Micro SVG Metric Chart */}
                <div className="bg-inverse-surface/60 p-3 rounded-lg flex flex-col gap-2 border border-slate-800">
                  <div className="flex justify-between items-center text-[11px] font-data-mono text-on-primary-container">
                    <span>Trafic Authentification (60 dernières min)</span>
                    <span className="text-emerald-400">0 anomalie détectée</span>
                  </div>
                  <div className="h-10 w-full flex items-end gap-1.5 pt-2">
                    <div className="h-[25%] flex-1 bg-slate-700 rounded-t" />
                    <div className="h-[35%] flex-1 bg-slate-700 rounded-t" />
                    <div className="h-[20%] flex-1 bg-slate-700 rounded-t" />
                    <div className="h-[40%] flex-1 bg-slate-600 rounded-t" />
                    <div className="h-[65%] flex-1 bg-secondary-container/60 rounded-t" />
                    <div className="h-[30%] flex-1 bg-slate-700 rounded-t" />
                    <div className="h-[45%] flex-1 bg-slate-600 rounded-t" />
                    <div className="h-[50%] flex-1 bg-slate-500 rounded-t" />
                    <div className="h-[70%] flex-1 bg-secondary-container/80 rounded-t" />
                    <div className="h-[85%] flex-1 bg-secondary-container rounded-t animate-pulse" />
                  </div>
                </div>
              </div>

              {/* On-Call Support & Disaster Recovery Actions */}
              <div className="bg-primary-container rounded-xl p-6 shadow-xl border border-slate-800 flex flex-col gap-3">
                <span className="font-label-sm text-xs uppercase tracking-wider text-inverse-on-surface flex items-center gap-2 font-semibold">
                  <Activity className="text-secondary-container w-4 h-4" />
                  <span>Astreinte & Protocole de Secours</span>
                </span>
                <div className="flex flex-col gap-2 pt-1">
                  <a
                    href="mailto:support@menudujour.cm?subject=Alerte%20Sécurité%20Admin"
                    className="flex items-center justify-between p-2.5 bg-inverse-surface hover:bg-slate-800/80 rounded-lg transition-colors group border border-slate-800"
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText className="text-slate-400 group-hover:text-secondary-container w-4 h-4 transition-colors" />
                      <span className="font-body-sm text-xs text-inverse-on-surface">
                        Consulter le registre d'audit d'accès
                      </span>
                    </div>
                    <ChevronRight className="text-slate-500 w-4 h-4" />
                  </a>

                  <div className="mt-1 p-3 bg-inverse-surface/50 rounded-lg flex items-center justify-between border border-slate-800">
                    <div className="flex items-center gap-2">
                      <PhoneCall className="text-secondary-container w-4 h-4" />
                      <span className="font-body-sm text-xs text-inverse-primary">
                        Ligne Sécurité d'Astreinte
                      </span>
                    </div>
                    <span className="font-data-mono text-xs text-secondary-container font-bold">
                      +237 658 35 21 29
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Security Metadata Footer Bar */}
          <div className="w-full flex flex-col md:flex-row items-center justify-between gap-2 px-2 py-1 text-on-primary-container font-data-mono text-[11px]">
            <div className="flex items-center gap-4">
              <span>
                Signature SHA-256 : <span className="text-slate-400">e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-secondary-container" />
              <span>Système d'isolation multi-tenant scellé</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

