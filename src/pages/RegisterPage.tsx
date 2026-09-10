import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { PublicHeader } from '@/components/public/PublicHeader'
import { PublicFooter } from '@/components/public/PublicFooter'
import { FloatingWhatsApp, WHATSAPP_NUMBER } from '@/components/public/FloatingWhatsApp'
import { Mail, Lock, User, Phone, Store, AlertCircle, ArrowRight, Eye, EyeOff, ShieldCheck, CheckCircle2, HelpCircle } from 'lucide-react'
import { SeoHead } from '@/components/public/SeoHead'

export const RegisterPage: React.FC = () => {
  const { signUp, user, profile, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const searchParams = new URLSearchParams(location.search)
  const initialRole = (searchParams.get('role') === 'restaurant_manager' ? 'restaurant_manager' : 'client') as 'client' | 'restaurant_manager'

  const [role, setRole] = useState<'client' | 'restaurant_manager'>(initialRole)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [cguAgreed, setCguAgreed] = useState(false)
  const [privacyAgreed, setPrivacyAgreed] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Password strength calculation
  const hasLength = password.length >= 8
  const hasCapital = /[A-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const strengthScore = (hasLength ? 1 : 0) + (hasCapital ? 1 : 0) + (hasNumber ? 1 : 0)

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

    if (!fullName.trim()) {
      setError('Veuillez renseigner votre nom complet.')
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

    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.')
      return
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }

    if (!cguAgreed || !privacyAgreed) {
      setError('Veuillez accepter les CGU et la Politique de Confidentialité.')
      return
    }

    setLoading(true)

    // Décomposer le nom complet en prénom et nom
    const parts = fullName.trim().split(' ')
    const firstName = parts[0] || ''
    const lastName = parts.slice(1).join(' ') || parts[0] || ''

    const { error: signUpError, needsEmailConfirmation } = await signUp({
      email: email.trim(),
      password,
      firstName,
      lastName,
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
      if (role === 'client') navigate('/espace-client', { replace: true })
      else navigate('/espace-restaurant', { replace: true })
    }
  }

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen flex flex-col">
      <SeoHead
        title="Inscription — Menu du Jour"
        description="Créez votre compte client ou restaurant sur Menu du Jour."
        path="/inscription"
        noindex={true}
      />
      <PublicHeader />

      <main className="w-full pt-20 bg-surface flex-1">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Header Context Tracker */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-outline-variant/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center shadow-sm">
                <Store className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <span className="font-headline-sm text-headline-sm text-on-surface block tracking-tight font-bold">Menu du Jour</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Portail d'enregistrement unifié</span>
              </div>
            </div>
            <Link
              to="/connexion"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface transition-colors shadow-sm font-medium"
            >
              <span className="font-label-md text-label-md">Déjà inscrit ?</span>
              <span className="font-label-md text-label-md text-secondary font-bold flex items-center gap-1">
                Se connecter
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>

          {/* Main Registration Split View Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Panel: Context, Trust Badges, Culinary Identity */}
            <div className="lg:col-span-5 flex flex-col gap-6 order-2 lg:order-1">
              <div className="relative overflow-hidden rounded-xl bg-primary-container text-on-primary p-8 shadow-xl">
                <div className="absolute -right-8 -bottom-8 w-48 h-48 rounded-full bg-secondary-container opacity-20 blur-2xl pointer-events-none" />
                <div className="relative z-10">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-lowest/10 text-tertiary-fixed font-label-sm text-label-sm uppercase tracking-wider mb-4 backdrop-blur-md font-semibold">
                    <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse" />
                    Plateforme Gastronomique &amp; SaaS
                  </span>
                  <h2 className="font-headline-lg text-headline-lg mb-3 font-bold text-on-primary">
                    {role === 'client'
                      ? 'Faites vibrer vos papilles au quotidien.'
                      : 'Digitalisez votre établissement en 2 minutes.'}
                  </h2>
                  <p className="font-body-md text-body-md text-primary-fixed-dim mb-6 leading-relaxed">
                    {role === 'client'
                      ? 'Explorez les meilleures cartes du midi à Yaoundé, Douala, Bafoussam et Kribi. Réservez votre table sans intermédiaire et accédez aux offres exclusives.'
                      : 'Publiez votre menu du jour, recevez vos réservations en salle et gérez vos abonnements sans commission via LeekPay.'}
                  </p>

                  <div className="space-y-3 font-body-sm text-body-sm">
                    {role === 'client' ? (
                      <>
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-surface-container-lowest/5 backdrop-blur-sm">
                          <CheckCircle2 className="text-secondary-container w-5 h-5 shrink-0" />
                          <span>Découverte instantanée des menus du jour géolocalisés.</span>
                        </div>
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-surface-container-lowest/5 backdrop-blur-sm">
                          <CheckCircle2 className="text-secondary-container w-5 h-5 shrink-0" />
                          <span>Réservation immédiate sans frais ni paiement préalable.</span>
                        </div>
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-surface-container-lowest/5 backdrop-blur-sm">
                          <CheckCircle2 className="text-secondary-container w-5 h-5 shrink-0" />
                          <span>Historique gourmand et alertes plats favoris en temps réel.</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-surface-container-lowest/5 backdrop-blur-sm">
                          <CheckCircle2 className="text-secondary-container w-5 h-5 shrink-0" />
                          <span>7 jours d'essai offerts sans carte bancaire requise.</span>
                        </div>
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-surface-container-lowest/5 backdrop-blur-sm">
                          <CheckCircle2 className="text-secondary-container w-5 h-5 shrink-0" />
                          <span>Upload PDF HD jusqu'à 10 Mo et ardoise connectée en temps réel.</span>
                        </div>
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-surface-container-lowest/5 backdrop-blur-sm">
                          <CheckCircle2 className="text-secondary-container w-5 h-5 shrink-0" />
                          <span>Gestion des tables avec motif explicite de refus pour zéro no-show.</span>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="mt-8 pt-6 flex items-center justify-between bg-surface-container-lowest/5 rounded-lg px-4 py-3 border border-surface-container-lowest/10">
                    <div>
                      <span className="font-headline-sm text-headline-sm block font-bold text-surface-container-lowest">+14 500</span>
                      <span className="font-label-sm text-label-sm text-primary-fixed-dim">Gourmets actifs</span>
                    </div>
                    <div className="w-px h-8 bg-surface-container-lowest/10" />
                    <div>
                      <span className="font-headline-sm text-headline-sm block font-bold text-surface-container-lowest">850+</span>
                      <span className="font-label-sm text-label-sm text-primary-fixed-dim">Tables référencées</span>
                    </div>
                    <div className="w-px h-8 bg-surface-container-lowest/10" />
                    <div>
                      <span className="font-headline-sm text-headline-sm block font-bold text-surface-container-lowest">99.2%</span>
                      <span className="font-label-sm text-label-sm text-primary-fixed-dim">Satisfaction</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Atmospheric Photo Card */}
              <div className="relative rounded-xl overflow-hidden shadow-md group border border-outline-variant/20">
                <img
                  className="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-500"
                  alt="Modern African restaurant bistro setup"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtcmVUOQOBiETpn9M2qIzG7v7hWJ4zjQtROG6EQ74Ap9jvbXXMIg-20ckXCpZF1mHC1_wpSfVEOPFGGh6pqYzaouUoJH6hOR_HAys01zBIEOlNfx-BymSc-AxLU_W-QHd9V5HEZ6Xz9FOs9PvTYtiE7besuvIT__DMas1tYTYsXoBwxpJuaIgw6UwpelBzYWmxpBiFOV3xAXzHuqRahxDnjVkYFqMf62J2_uAuJdMSqK8dKozdzQGK"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent p-6 flex flex-col justify-end">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary-fixed font-bold">Cuisine d'Auteur &amp; Traditions</span>
                  <p className="font-body-md text-body-md text-surface-container-lowest font-medium mt-1">« La vitrine numérique indispensable pour l'hôtellerie et la restauration en Afrique subsaharienne. »</p>
                </div>
              </div>

              {/* Security & Privacy Guarantee */}
              <div className="p-4 rounded-xl bg-surface-container-low flex items-center gap-3 border border-outline-variant/20">
                <ShieldCheck className="text-secondary w-6 h-6 shrink-0" />
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Données chiffrées selon les standards de sécurité bancaire PCI-DSS et conformes aux réglementations de protection de la vie privée.
                </p>
              </div>
            </div>

            {/* Right Panel: The Unified Enrollment Form */}
            <div className="lg:col-span-7 order-1 lg:order-2">
              <div className="bg-surface-container-lowest rounded-xl p-6 sm:p-8 md:p-10 shadow-xl relative border border-outline-variant/20">
                {/* Role Selector Header */}
                <div className="mb-8">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary block mb-2 font-bold">Étape 1 sur 2 : Votre Profil d'usage</span>
                  <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2 font-bold">Créez votre accès exclusif</h1>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Sélectionnez la nature de votre compte pour adapter votre expérience opérationnelle.
                  </p>

                  {/* Dual Role Switcher Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    {/* Role Option: Client */}
                    <button
                      className={`relative flex flex-col items-start text-left p-5 rounded-xl transition-all duration-200 border cursor-pointer ${
                        role === 'client'
                          ? 'bg-surface-container text-on-surface shadow-md border-secondary'
                          : 'bg-surface-container-low text-on-surface shadow-sm hover:shadow-md border-outline-variant/30'
                      }`}
                      onClick={() => setRole('client')}
                      type="button"
                    >
                      <div className="flex items-center justify-between w-full mb-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${role === 'client' ? 'bg-secondary text-on-secondary' : 'bg-surface-container-high text-on-surface-variant'}`}>
                          <User className="w-5 h-5" />
                        </div>
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center ${role === 'client' ? 'bg-secondary' : 'bg-surface-container-highest'}`}>
                          <span className={`w-2 h-2 rounded-full ${role === 'client' ? 'bg-on-secondary' : 'bg-transparent'}`} />
                        </span>
                      </div>
                      <span className="font-headline-sm text-headline-sm text-on-surface block mb-1 font-bold">Je suis un Client</span>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Je souhaite découvrir des restaurants, consulter les cartes du jour et réserver mes tables en temps réel.
                      </p>
                    </button>

                    {/* Role Option: Restaurant */}
                    <button
                      className={`relative flex flex-col items-start text-left p-5 rounded-xl transition-all duration-200 border cursor-pointer ${
                        role === 'restaurant_manager'
                          ? 'bg-surface-container text-on-surface shadow-md border-secondary'
                          : 'bg-surface-container-low text-on-surface shadow-sm hover:shadow-md border-outline-variant/30'
                      }`}
                      onClick={() => setRole('restaurant_manager')}
                      type="button"
                    >
                      <div className="flex items-center justify-between w-full mb-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${role === 'restaurant_manager' ? 'bg-secondary text-on-secondary' : 'bg-surface-container-high text-on-surface-variant'}`}>
                          <Store className="w-5 h-5" />
                        </div>
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center ${role === 'restaurant_manager' ? 'bg-secondary' : 'bg-surface-container-highest'}`}>
                          <span className={`w-2 h-2 rounded-full ${role === 'restaurant_manager' ? 'bg-on-secondary' : 'bg-transparent'}`} />
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-headline-sm text-headline-sm text-on-surface block font-bold">Je suis un Restaurant</span>
                        <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[10px] font-black uppercase tracking-wider">7j Offerts</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Je souhaite digitaliser mes menus, piloter mes commandes &amp; réservations avec 7 jours d'essai gratuit.
                      </p>
                    </button>
                  </div>
                </div>

                {/* Restaurant Trial Banner */}
                {role === 'restaurant_manager' && (
                  <div className="mb-5 p-4 rounded-xl bg-secondary-fixed text-on-secondary-fixed transition-all duration-300 border border-secondary/20">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="text-secondary w-6 h-6 shrink-0" />
                      <div>
                        <span className="font-label-md text-label-md block font-bold">Essai professionnel sans engagement</span>
                        <span className="font-body-sm text-body-sm">Bénéficiez de 7 jours complets pour publier vos cartes et synchroniser votre salle. Aucune carte bancaire requise à l'inscription.</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Banner */}
                {error && (
                  <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 animate-fadeIn">
                    <AlertCircle className="w-4.5 h-4.5 text-red-600 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Registration Form Body */}
                <form className="space-y-5" onSubmit={handleSubmit}>
                  {/* Full Name */}
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface mb-2 font-semibold" htmlFor="fullName">
                      <span>{role === 'client' ? 'Nom complet' : 'Nom complet du gérant / représentant'}</span>
                      <span className="text-error ml-1">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <User className="absolute left-3.5 text-on-surface-variant w-5 h-5 pointer-events-none" />
                      <input
                        className="w-full h-11 pl-11 pr-4 bg-surface-container-low focus:bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/50 rounded-lg outline-none transition-all font-body-md text-body-md border border-outline-variant/30 focus:border-secondary shadow-xs"
                        id="fullName"
                        placeholder="Ex. Jean-Paul Mbarga ou Aïcha Diallo"
                        required
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Email & Phone Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-label-md text-label-md text-on-surface mb-2 font-semibold" htmlFor="email">
                        <span>Adresse email</span>
                        <span className="text-error ml-1">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <Mail className="absolute left-3.5 text-on-surface-variant w-5 h-5 pointer-events-none" />
                        <input
                          className="w-full h-11 pl-11 pr-4 bg-surface-container-low focus:bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/50 rounded-lg outline-none transition-all font-body-md text-body-md border border-outline-variant/30 focus:border-secondary shadow-xs"
                          id="email"
                          placeholder="contact@domaine.com"
                          required
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={loading}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block font-label-md text-label-md text-on-surface mb-2 font-semibold" htmlFor="phone">
                        <span>Numéro de téléphone</span>
                        <span className="text-error ml-1">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <Phone className="absolute left-3.5 text-on-surface-variant w-5 h-5 pointer-events-none" />
                        <input
                          className="w-full h-11 pl-11 pr-4 bg-surface-container-low focus:bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/50 rounded-lg outline-none transition-all font-body-md text-body-md border border-outline-variant/30 focus:border-secondary shadow-xs"
                          id="phone"
                          placeholder="+237 6XX XX XX XX"
                          required
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          disabled={loading}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Password with Reveal & Strength Indicator */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="font-label-md text-label-md text-on-surface font-semibold" htmlFor="password">
                        Mot de passe <span className="text-error">*</span>
                      </label>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">
                        {password ? (strengthScore >= 3 ? 'Fort' : strengthScore === 2 ? 'Moyen' : 'Faible') : 'Non saisi'}
                      </span>
                    </div>
                    <div className="relative flex items-center">
                      <Lock className="absolute left-3.5 text-on-surface-variant w-5 h-5 pointer-events-none" />
                      <input
                        className="w-full h-11 pl-11 pr-11 bg-surface-container-low focus:bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/50 rounded-lg outline-none transition-all font-body-md text-body-md border border-outline-variant/30 focus:border-secondary shadow-xs"
                        id="password"
                        placeholder="••••••••••••"
                        required
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                      />
                      <button
                        className="absolute right-3 text-on-surface-variant hover:text-on-surface focus:outline-none cursor-pointer p-1"
                        onClick={() => setShowPassword(!showPassword)}
                        type="button"
                        aria-label="Afficher ou masquer"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>

                    {/* Strength bar */}
                    <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-2 overflow-hidden flex">
                      <div
                        className={`h-full transition-all duration-300 ${
                          strengthScore === 3 ? 'w-full bg-emerald-500' : strengthScore === 2 ? 'w-2/3 bg-amber-500' : password.length > 0 ? 'w-1/3 bg-red-500' : 'w-0'
                        }`}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-2 font-body-sm text-body-sm text-on-surface-variant">
                      <div className={`flex items-center gap-1 ${hasLength ? 'text-emerald-600 font-bold' : ''}`}>
                        <span>{hasLength ? '✓' : '•'}</span>
                        <span>8+ caractères</span>
                      </div>
                      <div className={`flex items-center gap-1 ${hasCapital ? 'text-emerald-600 font-bold' : ''}`}>
                        <span>{hasCapital ? '✓' : '•'}</span>
                        <span>1 majuscule</span>
                      </div>
                      <div className={`flex items-center gap-1 ${hasNumber ? 'text-emerald-600 font-bold' : ''}`}>
                        <span>{hasNumber ? '✓' : '•'}</span>
                        <span>1 chiffre</span>
                      </div>
                    </div>
                  </div>

                  {/* Password Confirmation */}
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface mb-2 font-semibold" htmlFor="passwordConfirm">
                      Confirmez votre mot de passe <span className="text-error">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <Lock className="absolute left-3.5 text-on-surface-variant w-5 h-5 pointer-events-none" />
                      <input
                        className="w-full h-11 pl-11 pr-11 bg-surface-container-low focus:bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/50 rounded-lg outline-none transition-all font-body-md text-body-md border border-outline-variant/30 focus:border-secondary shadow-xs"
                        id="passwordConfirm"
                        placeholder="••••••••••••"
                        required
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={loading}
                      />
                      <button
                        className="absolute right-3 text-on-surface-variant hover:text-on-surface focus:outline-none cursor-pointer p-1"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        type="button"
                        aria-label="Afficher ou masquer confirmation"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {confirmPassword && password !== confirmPassword && (
                      <p className="font-body-sm text-body-sm text-red-600 mt-1">Les mots de passe ne correspondent pas.</p>
                    )}
                  </div>

                  {/* Checkboxes: CGU & Privacy Policy */}
                  <div className="pt-2 space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer select-none">
                      <input
                        className="mt-1 w-4 h-4 rounded text-secondary focus:ring-0 cursor-pointer accent-secondary"
                        required
                        type="checkbox"
                        checked={cguAgreed}
                        onChange={(e) => setCguAgreed(e.target.checked)}
                      />
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        J'accepte sans réserve les <Link to="/conditions-generales" className="text-secondary font-medium hover:underline">Conditions Générales d'Utilisation</Link> de la plateforme Menu du Jour.
                      </span>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer select-none">
                      <input
                        className="mt-1 w-4 h-4 rounded text-secondary focus:ring-0 cursor-pointer accent-secondary"
                        required
                        type="checkbox"
                        checked={privacyAgreed}
                        onChange={(e) => setPrivacyAgreed(e.target.checked)}
                      />
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        Je reconnais avoir pris connaissance de la <Link to="/confidentialite" className="text-secondary font-medium hover:underline">Politique de Confidentialité</Link> et autorise le traitement de mes coordonnées.
                      </span>
                    </label>
                  </div>

                  {/* Submit Action */}
                  <div className="pt-4">
                    <button
                      className="w-full h-12 rounded-lg bg-secondary text-on-secondary font-label-lg text-label-lg flex items-center justify-center gap-3 shadow-lg hover:bg-secondary-container active:scale-[0.99] transition-all font-bold cursor-pointer disabled:opacity-60"
                      disabled={loading}
                      type="submit"
                    >
                      {loading ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Création en cours...</span>
                        </>
                      ) : (
                        <>
                          <span>{role === 'client' ? 'Créer mon compte Client' : 'Créer mon compte Restaurant (7j offerts)'}</span>
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>

                  {/* Flow Context Information Banner */}
                  <div className="mt-6 p-4 rounded-xl bg-surface-container-low flex items-start gap-3 border border-outline-variant/20">
                    <Mail className="text-on-surface-variant w-5 h-5 shrink-0 mt-0.5" />
                    <div className="font-body-sm text-body-sm text-on-surface-variant">
                      <strong className="text-on-surface block font-semibold mb-0.5">Prochaine étape importante :</strong>
                      Un email de validation d'adresse vous sera immédiatement expédié. Une fois confirmé, vous serez automatiquement redirigé vers votre <span className="font-semibold text-secondary">{role === 'client' ? 'Espace Client' : 'Espace Restaurant'}</span>.
                    </div>
                  </div>
                </form>

                {/* Alternative Quick Inscription Footer */}
                <div className="mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left border-t border-outline-variant/20">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Besoin d'assistance pour configurer votre établissement ?
                  </span>
                  <a className="font-label-sm text-label-sm text-secondary font-bold hover:underline flex items-center gap-1" href={`https://wa.me/237658352129`} target="_blank" rel="noopener noreferrer">
                    Contacter le support onboarding ({WHATSAPP_NUMBER})
                    <HelpCircle className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
      <FloatingWhatsApp />
    </div>
  )
}

