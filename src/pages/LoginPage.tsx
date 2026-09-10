import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { PublicHeader } from '@/components/public/PublicHeader'
import { PublicFooter } from '@/components/public/PublicFooter'
import { FloatingWhatsApp, WHATSAPP_NUMBER } from '@/components/public/FloatingWhatsApp'
import { Mail, Lock, AlertCircle, ArrowRight, CheckCircle2, Eye, EyeOff, ShieldCheck, User, Store, Zap, QrCode, Wallet, HelpCircle } from 'lucide-react'
import { SeoHead } from '@/components/public/SeoHead'

export const LoginPage: React.FC = () => {
  const { signIn, user, profile, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [activeTab, setActiveTab] = useState<'client' | 'restaurant'>('client')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Message transmis depuis l'inscription ou la confirmation d'email
  const searchParams = new URLSearchParams(location.search)
  const isEmailConfirmed = searchParams.get('confirmed') === '1'
  const isPasswordReset = searchParams.get('reset') === '1'
  const initialRoleParam = searchParams.get('role')

  React.useEffect(() => {
    if (initialRoleParam === 'restaurant_manager') {
      setActiveTab('restaurant')
    } else if (initialRoleParam === 'client') {
      setActiveTab('client')
    }
  }, [initialRoleParam])

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
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen flex flex-col">
      <SeoHead
        title="Connexion — Menu du Jour"
        description="Espace de connexion sécurisé Menu du Jour pour restaurateurs et gourmets."
        path="/connexion"
        noindex={true}
      />
      <PublicHeader />

      <main className="w-full pt-20 bg-surface flex-1">
        <div className="flex flex-col w-full">
          <section className="relative w-full overflow-hidden py-space-xl lg:py-space-3xl">
            <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-secondary-fixed opacity-40 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-[28rem] h-[28rem] rounded-full bg-surface-container-high opacity-60 blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop relative z-10">
              {/* Top Operational Status Bar */}
              <div className="mb-space-lg flex flex-wrap items-center justify-between gap-space-sm">
                <div className="flex items-center gap-space-xs">
                  <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-secondary" />
                  <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider font-semibold">Portail Unifié Sécurisé</span>
                  <span className="text-outline-variant px-space-2xs">•</span>
                  <span className="font-data-mono text-data-mono text-on-surface-variant">Auth V2.4 - Node Douala/Yaoundé</span>
                </div>
                <div className="flex items-center gap-space-xs bg-surface-container-low px-space-sm py-space-2xs rounded-full shadow-sm border border-outline-variant/20">
                  <Lock className="w-4 h-4 text-on-surface-variant" />
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Chiffrement AES-256 bits</span>
                </div>
              </div>

              {/* Two columns layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl lg:gap-space-2xl items-stretch">
                {/* Left Column: Form & Role Switcher (7 cols) */}
                <div className="lg:col-span-7 flex flex-col justify-between">
                  {/* Role Switcher Pill Tabs */}
                  <div className="bg-surface-container-lowest rounded-full p-space-xs shadow-sm mb-space-lg flex items-center max-w-lg border border-outline-variant/30">
                    <button
                      className={`flex-1 py-space-sm px-space-md rounded-full font-label-lg text-label-lg transition-all flex items-center justify-center gap-space-xs cursor-pointer ${
                        activeTab === 'client'
                          ? 'bg-primary text-on-primary shadow-sm font-bold'
                          : 'text-on-surface-variant hover:text-on-surface font-medium'
                      }`}
                      onClick={() => setActiveTab('client')}
                      type="button"
                    >
                      <User className="w-4 h-4" />
                      <span>Espace Client / Gourmet</span>
                    </button>
                    <button
                      className={`flex-1 py-space-sm px-space-md rounded-full font-label-lg text-label-lg transition-all flex items-center justify-center gap-space-xs cursor-pointer ${
                        activeTab === 'restaurant'
                          ? 'bg-primary text-on-primary shadow-sm font-bold'
                          : 'text-on-surface-variant hover:text-on-surface font-medium'
                      }`}
                      onClick={() => setActiveTab('restaurant')}
                      type="button"
                    >
                      <Store className="w-4 h-4" />
                      <span>Espace Restaurant</span>
                    </button>
                  </div>

                  {/* Form Container Card */}
                  <div className="bg-surface-container-lowest p-space-xl md:p-space-2xl rounded-xl shadow-md relative overflow-hidden border border-outline-variant/20">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-secondary transition-all" />

                    <div className="mb-space-lg">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-space-2xs font-label-sm text-label-sm text-secondary bg-secondary-fixed/50 px-space-sm py-space-2xs rounded-full font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                          {activeTab === 'client' ? 'Portail Gourmet Particulier' : 'Cockpit Restauration Pro'}
                        </span>
                        <span className="font-data-mono text-data-mono text-on-surface-variant">Accès direct PWA</span>
                      </div>
                      <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-space-sm font-bold">
                        {activeTab === 'client'
                          ? 'Bienvenue sur votre table gourmande'
                          : 'Accédez au Cockpit de votre Restaurant'}
                      </h1>
                      <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs leading-relaxed">
                        {activeTab === 'client'
                          ? 'Consultez instantanément vos favoris, gérez vos réservations et activez les alertes pour vos plats préférés du jour.'
                          : 'Pilotez vos cartes digitales, vos réservations en salle et surveillez vos transactions LeekPay.'}
                      </p>
                    </div>

                    {/* Notice for Restaurant Pro */}
                    {activeTab === 'restaurant' && (
                      <div className="mb-space-lg p-space-md bg-surface-container-low rounded-lg shadow-sm border border-outline-variant/20">
                        <div className="flex items-start gap-space-sm">
                          <Store className="text-secondary w-6 h-6 shrink-0" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface font-semibold">Plateforme Restaurateur Pro</span>
                              <span className="font-data-mono text-data-mono bg-secondary-fixed text-on-secondary-fixed px-space-xs py-space-2xs rounded font-bold">5 000 FCFA / mois</span>
                            </div>
                            <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-2xs">
                              Mettez à jour votre ardoise du jour, visualisez le plan de salle et gérez vos encaissements intégrés via LeekPay.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Information message banner */}
                    {infoMessage && (
                      <div className="mb-space-md p-space-md rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start gap-2.5">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{infoMessage}</span>
                      </div>
                    )}

                    {/* Error alert banner */}
                    {error && (
                      <div className="mb-space-md p-space-md rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 animate-fadeIn">
                        <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                        <span>{error}</span>
                      </div>
                    )}

                    {/* Auth Form */}
                    <form className="space-y-space-md" onSubmit={handleSubmit}>
                      <div className="space-y-space-xs">
                        <label className="font-label-md text-label-md text-on-surface flex items-center justify-between font-semibold" htmlFor="login-identifier">
                          <span>Adresse email</span>
                          <span className="font-data-mono text-body-sm text-on-surface-variant">Ex: nom@domaine.cm</span>
                        </label>
                        <div className="relative flex items-center">
                          <Mail className="absolute left-space-md text-on-surface-variant w-5 h-5 pointer-events-none" />
                          <input
                            className="w-full bg-surface-container-low text-on-surface pl-11 pr-space-md py-space-sm rounded-lg font-body-md text-body-md outline-none focus:bg-surface-container transition-all border border-outline-variant/30 focus:border-secondary"
                            id="login-identifier"
                            placeholder={activeTab === 'restaurant' ? 'direction@restaurant.cm' : 'gourmet@exemple.cm'}
                            required
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                          />
                        </div>
                      </div>

                      <div className="space-y-space-xs">
                        <div className="flex items-center justify-between">
                          <label className="font-label-md text-label-md text-on-surface font-semibold" htmlFor="login-password">
                            Mot de passe
                          </label>
                          <Link className="font-label-md text-label-md text-secondary hover:underline transition-all" to="/mot-de-passe-oublie">
                            Mot de passe oublié ?
                          </Link>
                        </div>
                        <div className="relative flex items-center">
                          <Lock className="absolute left-space-md text-on-surface-variant w-5 h-5 pointer-events-none" />
                          <input
                            className="w-full bg-surface-container-low text-on-surface pl-11 pr-12 py-space-sm rounded-lg font-body-md text-body-md outline-none focus:bg-surface-container transition-all border border-outline-variant/30 focus:border-secondary"
                            id="login-password"
                            placeholder="••••••••••••"
                            required
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                          />
                          <button
                            className="absolute right-space-md text-on-surface-variant hover:text-on-surface flex items-center justify-center p-space-2xs focus:outline-none cursor-pointer"
                            onClick={() => setShowPassword(!showPassword)}
                            type="button"
                            aria-label={showPassword ? 'Masquer' : 'Afficher'}
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-space-2xs">
                        <label className="flex items-center gap-space-xs cursor-pointer select-none">
                          <input
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="w-4 h-4 rounded text-secondary focus:ring-0 focus:ring-offset-0 bg-surface-container-low cursor-pointer accent-secondary"
                            type="checkbox"
                          />
                          <span className="font-body-md text-body-md text-on-surface-variant">Se souvenir de moi sur cet appareil</span>
                        </label>
                        <span className="hidden sm:inline-flex items-center gap-space-2xs font-data-mono text-body-sm text-on-surface-variant">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-secondary-container" />
                          Session persistante
                        </span>
                      </div>

                      <div className="pt-space-sm">
                        <button
                          className="w-full bg-secondary text-on-secondary py-space-md px-space-lg rounded-lg font-label-lg text-label-lg font-bold shadow-md hover:bg-secondary-container active:scale-[0.99] transition-all flex items-center justify-center gap-space-sm cursor-pointer disabled:opacity-60"
                          disabled={loading}
                          type="submit"
                        >
                          {loading ? (
                            <>
                              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              <span>Connexion en cours...</span>
                            </>
                          ) : (
                            <>
                              <span>{activeTab === 'client' ? 'Se connecter à mon Espace Client' : 'Se connecter au Cockpit Restaurant'}</span>
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </div>
                    </form>

                    {/* Bottom Registration Switcher Bar */}
                    <div className="mt-space-xl pt-space-lg bg-surface-container-low/60 -mx-space-xl md:-mx-space-2xl -mb-space-xl md:-mb-space-2xl p-space-lg flex flex-col sm:flex-row items-center justify-between gap-space-md border-t border-outline-variant/20">
                      <div>
                        <span className="font-body-sm text-body-sm text-on-surface-variant block">Vous n'avez pas encore de compte ?</span>
                        <span className="font-label-md text-label-md text-on-surface font-semibold">
                          {activeTab === 'client' ? 'Rejoignez gratuitement la communauté des gourmets' : 'Créez votre établissement en 2 minutes'}
                        </span>
                      </div>
                      <div className="flex items-center gap-space-sm w-full sm:w-auto">
                        <Link
                          className="flex-1 sm:flex-initial text-center bg-surface-container-lowest text-on-surface hover:text-secondary px-space-md py-space-xs rounded-lg font-label-md text-label-md shadow-sm transition-colors border border-outline-variant/30 font-medium"
                          to="/inscription?role=client"
                        >
                          Créer un compte Gourmet
                        </Link>
                        <Link
                          className="flex-1 sm:flex-initial text-center bg-primary text-on-primary px-space-md py-space-xs rounded-lg font-label-md text-label-md shadow-sm transition-all hover:opacity-90 flex items-center justify-center gap-space-2xs font-bold"
                          to="/inscription?role=restaurant_manager"
                        >
                          <span>Inscrire un resto</span>
                          <span className="bg-secondary-container text-on-secondary text-[10px] px-1.5 py-0.5 rounded font-black">7j offerts</span>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Micro reassurance badges */}
                  <div className="mt-space-md flex flex-wrap items-center justify-between gap-space-sm px-space-xs text-on-surface-variant">
                    <div className="flex items-center gap-space-xs">
                      <ShieldCheck className="w-4 h-4 text-secondary" />
                      <span className="font-body-sm text-body-sm">Protection anti-fraude LeekPay certifiée</span>
                    </div>
                    <div className="flex items-center gap-space-xs font-body-sm text-body-sm">
                      <span>Besoin d'aide ?</span>
                      <a className="text-secondary font-bold hover:underline inline-flex items-center gap-space-2xs" href="https://wa.me/237658352129" target="_blank" rel="noopener noreferrer">
                        <span>WhatsApp Pro : {WHATSAPP_NUMBER}</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Right Column: Editorial Visual & Platform Presentation (5 cols) */}
                <div className="lg:col-span-5 flex flex-col justify-between space-y-space-lg">
                  <div className="bg-surface-container-lowest p-space-xl rounded-xl shadow-md relative overflow-hidden flex flex-col justify-between flex-1 border border-outline-variant/20">
                    <div className="space-y-space-lg">
                      <div className="flex items-center justify-between">
                        <img
                          alt="Menu du Jour Logo"
                          className="h-9 w-auto object-contain"
                          src="https://lh3.googleusercontent.com/aida/AEtjO1UTt-dNa22cOeXEs7v8x9kOXhf2TxxgJonsL9_Oz5pDK6exz46Abxlmk4aUjK6aMeQRY1FFDioZKZP0kw7opI2le25btUY1uLfxKvHQhg4X3EZbh7VOEARmjDnC66zmZg0__BNzLHIi10bixPDXHyAl4D-Y0z1X_X3AFBpIazoPOEkhVVJID4rB4uYDKC48ourRAOOrQOhFzanyXMH7k66usylb-1s8WQxnS034eNhV2C6lvKgE5MQ3sDI"
                        />
                        <span className="font-label-sm text-label-sm bg-surface-container text-on-surface px-space-sm py-space-2xs rounded font-semibold uppercase">Édition 2024</span>
                      </div>
                      <div className="space-y-space-xs">
                        <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">Gastronomie &amp; Digital</span>
                        <h2 className="font-headline-md text-headline-md text-on-surface tracking-tight font-bold">
                          L'excellence culinaire à portée de clic
                        </h2>
                        <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                          Conçu spécialement pour valoriser les saveurs africaines authentiques et les grandes tables internationales. Une expérience fluide et réactive de la découverte au règlement en salle.
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-space-sm">
                        <div className="p-space-sm bg-surface-container-low rounded-lg border border-outline-variant/20">
                          <div className="flex items-center gap-space-2xs text-secondary mb-space-2xs">
                            <Zap className="w-4 h-4" />
                            <span className="font-label-md text-label-md font-bold">Ardoises Live</span>
                          </div>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">
                            Menus mis à jour en direct chaque matin à 11h30.
                          </p>
                        </div>
                        <div className="p-space-sm bg-surface-container-low rounded-lg border border-outline-variant/20">
                          <div className="flex items-center gap-space-2xs text-secondary mb-space-2xs">
                            <QrCode className="w-4 h-4" />
                            <span className="font-label-md text-label-md font-bold">Sans contact</span>
                          </div>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">
                            Scannez, commandez et payez en FCFA sans délai.
                          </p>
                        </div>
                      </div>
                      <div className="p-space-md bg-surface-container rounded-lg space-y-space-xs border border-outline-variant/20">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-space-xs">
                            <Wallet className="text-secondary w-5 h-5" />
                            <span className="font-label-md text-label-md text-on-surface font-semibold">Paiement Souverain LeekPay</span>
                          </div>
                          <span className="font-label-sm text-label-sm bg-surface-container-lowest text-on-surface px-space-xs py-space-2xs rounded font-semibold">OM &amp; MoMo</span>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Intégration bancaire locale certifiée pour le Cameroun et l'Afrique centrale. Virements instantanés vers les restaurateurs partenaires.
                        </p>
                      </div>
                    </div>

                    <div className="pt-space-lg mt-space-lg bg-surface-container-low -mx-space-xl -mb-space-xl p-space-md flex items-center justify-between border-t border-outline-variant/20">
                      <div className="flex items-center gap-space-xs">
                        <HelpCircle className="text-secondary w-5 h-5" />
                        <div>
                          <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface font-semibold block">Assistance Technique Directe</span>
                          <span className="font-data-mono text-data-mono text-on-surface-variant">Lun - Dim : 07h00 à 23h00 (GMT+1)</span>
                        </div>
                      </div>
                      <a
                        className="bg-secondary-container text-on-secondary px-space-sm py-space-xs rounded font-label-sm text-label-sm font-semibold hover:opacity-95 transition-opacity shadow-sm"
                        href="https://wa.me/237658352129"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Aide WhatsApp
                      </a>
                    </div>
                  </div>

                  {/* Network Status Card */}
                  <div className="bg-surface-container p-space-lg rounded-xl shadow-sm space-y-space-sm border border-outline-variant/20">
                    <div className="flex items-center justify-between">
                      <span className="font-label-md text-label-md text-on-surface uppercase tracking-wider font-semibold">Disponibilité du Réseau</span>
                      <span className="font-data-mono text-data-mono text-secondary font-bold">99.98% Uptime</span>
                    </div>
                    <div className="w-full bg-surface-container-lowest rounded-full h-2 overflow-hidden">
                      <div className="bg-secondary h-full rounded-full w-[99%]" />
                    </div>
                    <div className="flex items-center justify-between text-on-surface-variant font-data-mono text-body-sm pt-space-2xs">
                      <span className="flex items-center gap-space-2xs">
                        <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
                        <span>Serveur Douala Akwa : Opérationnel</span>
                      </span>
                      <span>Latence : 14ms</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <PublicFooter />
      <FloatingWhatsApp />
    </div>
  )
}

