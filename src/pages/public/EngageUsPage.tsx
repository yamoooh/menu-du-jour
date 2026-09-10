import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '@/context/LanguageContext'
import { SeoHead } from '@/components/public/SeoHead'
import { PublicHeader } from '@/components/public/PublicHeader'
import { PublicFooter } from '@/components/public/PublicFooter'
import { FloatingWhatsApp, WHATSAPP_NUMBER, WHATSAPP_URL } from '@/components/public/FloatingWhatsApp'
import { CheckCircle2, ShieldCheck, ArrowRight, MessageSquare, Eye, FileText, CalendarCheck, CreditCard, Send } from 'lucide-react'

export const EngageUsPage: React.FC = () => {
  const { t } = useLanguage()

  const [managerName, setManagerName] = useState('')
  const [restaurantName, setRestaurantName] = useState('')
  const [location, setLocation] = useState('')
  const [phone, setPhone] = useState('')
  const [cuisineType, setCuisineType] = useState('Gastronomie Camerounaise & Africaine')
  const [capacity, setCapacity] = useState('Moyenne brigade (30 à 70 couverts)')
  const [onsiteAdvisor, setOnsiteAdvisor] = useState(false)
  const [termsAgree, setTermsAgree] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!managerName || !restaurantName || !location || !phone || !termsAgree) return
    setSubmitted(true)
  }

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen flex flex-col">
      <SeoHead
        title={t.meta.engage.title}
        description={t.meta.engage.description}
        path="/engagez-nous"
      />

      <PublicHeader />

      <main className="w-full pt-20 bg-surface flex-1">
        <div className="flex flex-col w-full">
          {/* HERO SECTION */}
          <section className="relative w-full overflow-hidden bg-surface-container-lowest py-space-3xl border-b border-outline-variant/20">
            <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-secondary-fixed/40 blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 -left-20 w-80 h-80 rounded-full bg-surface-variant/50 blur-2xl pointer-events-none" />
            <div className="max-w-7xl mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-2xl items-center">
                <div className="lg:col-span-7 space-y-space-lg">
                  <div className="inline-flex items-center gap-space-xs bg-secondary-fixed text-on-secondary-fixed px-space-md py-space-2xs rounded-full shadow-sm">
                    <ShieldCheck className="w-4 h-4 text-secondary" />
                    <span className="font-label-sm text-label-sm uppercase tracking-wider font-bold">Programme Partenaire Restauration &amp; Hôtellerie</span>
                  </div>
                  <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight leading-tight font-bold">
                    Propulsez votre table dans l'ère numérique. Rejoignez le réseau <span className="text-secondary">Menu du Jour</span>.
                  </h1>
                  <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed max-w-2xl">
                    Préservez votre indépendance commerciale et votre souveraineté technologique. Diffusez vos formules du jour en temps réel sur les smartphones de vos convives, sans prélever la moindre commission sur vos assiettes.
                  </p>
                  <div className="flex flex-wrap items-center gap-space-md pt-space-xs">
                    <a
                      className="inline-flex items-center justify-center gap-space-sm bg-secondary text-on-secondary px-space-xl py-space-md rounded-lg font-label-lg text-label-lg shadow-md hover:bg-secondary-container transition-all font-bold"
                      href="#formulaire-onboarding"
                    >
                      <span>Rejoindre le Réseau Partenaires</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                    <a
                      className="inline-flex items-center justify-center gap-space-sm bg-surface-container text-on-surface px-space-lg py-space-md rounded-lg font-label-lg text-label-lg hover:bg-surface-container-high transition-colors font-semibold"
                      href={WHATSAPP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageSquare className="w-5 h-5 text-secondary" />
                      <span>Ligne Directe Restos (+237)</span>
                    </a>
                  </div>
                  {/* Micro Proof Banner */}
                  <div className="pt-space-md flex items-center gap-space-lg">
                    <div className="flex -space-x-3">
                      <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-secondary font-bold font-label-sm shadow-sm">DW</div>
                      <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed font-bold font-label-sm shadow-sm">YB</div>
                      <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center text-on-surface font-bold font-label-sm shadow-sm">KB</div>
                    </div>
                    <div className="text-on-surface-variant">
                      <span className="font-label-md text-label-md text-on-surface font-bold block">+140 restaurateurs connectés</span>
                      <span className="font-body-sm text-body-sm">À Douala (Akwa, Bonanjo, Bonamoussadi) &amp; Yaoundé (Bastos)</span>
                    </div>
                  </div>
                </div>

                {/* Visual Hero Mosaic */}
                <div className="lg:col-span-5 relative">
                  <div className="relative mx-auto max-w-md lg:max-w-none">
                    <div className="bg-surface-container rounded-xl overflow-hidden shadow-xl p-space-sm border border-outline-variant/30">
                      <img
                        className="w-full h-80 object-cover rounded-lg shadow-sm"
                        alt="Restaurant gastronomique au Cameroun"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuB14Ti4aM8MXV3lZbVgcDZ9AUDLtQebmr-vING4qdk4Xk5HhZBybqYrKk121yJWr8N-q-zuUix3f-Ap1RfuiYVfUqRMvWTsJ5pN_VzPA0YcHK9pEV0R6Eu0loLE_NKdtV_2r6aZXx_FjCYUrI8MyhOW9h5MIvvJvr2KiCG0ybnK1asvahAgtj8mB2fDTMkvVmn5SZeFsq-aV8LYlQkUkAmQhXbrhiyruQM5RaPy9p_-yPgYcryucdnq"
                      />
                    </div>
                    {/* Overlapping Float Card */}
                    <div className="absolute -bottom-8 -left-6 bg-surface-container-lowest p-space-md rounded-xl shadow-xl max-w-xs flex items-center gap-space-md border border-outline-variant/30">
                      <div className="w-12 h-12 rounded-lg bg-secondary-fixed flex items-center justify-center text-secondary shrink-0 font-bold">
                        <span className="text-xl font-bold">%</span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-label-sm text-label-sm text-secondary uppercase font-bold tracking-wider">Zéro Prélèvement</p>
                        <p className="font-headline-sm text-headline-sm text-on-surface font-bold leading-tight">0% Commission</p>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">Sur vos commandes directes &amp; tables</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 4 PILIERS DU PARTENARIAT */}
          <section className="w-full py-space-3xl bg-surface">
            <div className="max-w-7xl mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop">
              <div className="text-center max-w-3xl mx-auto mb-space-2xl space-y-space-xs">
                <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider font-bold">Valeur Ajoutée Restaurateur</span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">Les 4 piliers technologiques de votre indépendance</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">Conçu sur mesure pour la réalité opérationnelle et énergétique des cuisines d'Afrique subsaharienne.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-lg">
                {/* Pilier 1 */}
                <div className="bg-surface-container-lowest p-space-xl rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between border border-outline-variant/20">
                  <div className="space-y-space-md">
                    <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-secondary">
                      <Eye className="w-6 h-6" />
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface leading-snug font-bold">Visibilité locale sans intermédiaire</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Vos clients accèdent directement à votre carte via OpenStreetMap et QR Code sans passer par des plateformes de livraison qui amputent 25% à 30% de vos marges brutes.
                    </p>
                  </div>
                  <div className="pt-space-md">
                    <span className="inline-flex items-center gap-space-xs font-label-sm text-label-sm text-secondary font-semibold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Propriété directe de vos convives</span>
                    </span>
                  </div>
                </div>

                {/* Pilier 2 */}
                <div className="bg-surface-container-lowest p-space-xl rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between border border-outline-variant/20">
                  <div className="space-y-space-md">
                    <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-secondary">
                      <FileText className="w-6 h-6" />
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface leading-snug font-bold">Ardoise instantanée &amp; PDF HD 10 Mo</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Modifiez votre plat du jour en 30 secondes depuis le smartphone du chef ou téléversez vos maquettes de menus graphiques complexes jusqu'à 10 Mo avec affichage ultra-fluide.
                    </p>
                  </div>
                  <div className="pt-space-md">
                    <span className="inline-flex items-center gap-space-xs font-label-sm text-label-sm text-secondary font-semibold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Synchronisation synchrone 4G/5G</span>
                    </span>
                  </div>
                </div>

                {/* Pilier 3 */}
                <div className="bg-surface-container-lowest p-space-xl rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between border border-outline-variant/20">
                  <div className="space-y-space-md">
                    <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-secondary">
                      <CalendarCheck className="w-6 h-6" />
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface leading-snug font-bold">Réservations maîtrisées &amp; anti-no-show</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Validez ou refusez les demandes de couverts avec motif explicite obligatoire (salle comble, événement privé). Vos clients sont informés instantanément sur WhatsApp.
                    </p>
                  </div>
                  <div className="pt-space-md">
                    <span className="inline-flex items-center gap-space-xs font-label-sm text-label-sm text-secondary font-semibold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Zéro surprise de dernière minute</span>
                    </span>
                  </div>
                </div>

                {/* Pilier 4 */}
                <div className="bg-surface-container-lowest p-space-xl rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between border border-outline-variant/20">
                  <div className="space-y-space-md">
                    <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-secondary">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface leading-snug font-bold">Tarification claire &amp; Mobile Money</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      7 jours d'essai gratuit sans carte bancaire requise. Puis seulement 5 000 FCFA / 30 jours payable simplement par LeekPay (MTN MoMo et Orange Money Cameroun).
                    </p>
                  </div>
                  <div className="pt-space-md">
                    <span className="inline-flex items-center gap-space-xs font-label-sm text-label-sm text-secondary font-semibold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Sans engagement ni frais cachés</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* PROCESSUS D'ENGAGEMENT EN 3 ETAPES */}
          <section className="w-full py-space-3xl bg-surface-container-low border-y border-outline-variant/20">
            <div className="max-w-7xl mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop">
              <div className="text-center max-w-2xl mx-auto mb-space-2xl space-y-space-xs">
                <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider font-bold">Onboarding Accompagné</span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">Votre établissement digitalisé en moins de 24h chrono</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">Un accompagnement humain de terrain sans rupture avec votre service habituel.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-xl">
                <div className="bg-surface-container-lowest p-space-xl rounded-xl shadow-sm relative border border-outline-variant/20">
                  <div className="w-10 h-10 rounded-full bg-primary text-on-primary font-bold flex items-center justify-center mb-space-md font-headline-sm text-headline-sm">
                    1
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-space-xs font-bold">Profil &amp; Candidature</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Remplissez le formulaire en ligne ci-dessous avec les spécificités de votre table : quartier d'implantation, type de gastronomie et coordonnées WhatsApp de gérance.
                  </p>
                </div>
                <div className="bg-surface-container-lowest p-space-xl rounded-xl shadow-sm relative border border-outline-variant/20">
                  <div className="w-10 h-10 rounded-full bg-secondary text-on-secondary font-bold flex items-center justify-center mb-space-md font-headline-sm text-headline-sm">
                    2
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-space-xs font-bold">Numérisation Assistée</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Notre équipe d'experts basée à Douala et Yaoundé convertit vos menus papiers en carte interactive tactile haute performance sous 24 heures ouvrées.
                  </p>
                </div>
                <div className="bg-surface-container-lowest p-space-xl rounded-xl shadow-sm relative border border-outline-variant/20">
                  <div className="w-10 h-10 rounded-full bg-surface-tint text-on-primary font-bold flex items-center justify-center mb-space-md font-headline-sm text-headline-sm">
                    3
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-space-xs font-bold">Déploiement &amp; Activation</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Recevez vos chevalets QR Codes prêts à poser sur tables, votre lien public sécurisé et l'épinglage de votre point de vente sur OpenStreetMap.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* FORMULAIRE ONBOARDING & ENGAGEMENT */}
          <section className="w-full py-space-3xl bg-surface" id="formulaire-onboarding">
            <div className="max-w-7xl mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-2xl">
                {/* Colonne Informationnelle / Réassurance */}
                <div className="lg:col-span-5 space-y-space-xl">
                  <div>
                    <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider font-bold">Engagement Direct</span>
                    <h2 className="font-headline-lg text-headline-lg text-on-surface mt-space-2xs font-bold">Candidatez à l'activation de votre restaurant</h2>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm leading-relaxed">
                      Que vous dirigiez un bistrot gastronomique à Bonanjo, un bar-grill réputé à Bastos ou une table d'hôtes à Kribi, l'équipe Menu du Jour configure votre compte en direct.
                    </p>
                  </div>

                  {/* Direct WhatsApp Hotline Card */}
                  <div className="bg-surface-container-low p-space-lg rounded-xl shadow-sm space-y-space-md border border-outline-variant/20">
                    <div className="flex items-center gap-space-sm text-secondary">
                      <MessageSquare className="w-6 h-6" />
                      <span className="font-headline-sm text-headline-sm text-on-surface font-bold">Urgence Commerciale &amp; Démo</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Besoin d'une activation dans l'heure pour votre service de midi ? Échangez directement avec notre coordinateur commercial régional :
                    </p>
                    <div className="p-space-md bg-surface-container-lowest rounded-lg flex items-center justify-between border border-outline-variant/15">
                      <div>
                        <span className="font-label-sm text-label-sm text-on-surface-variant block uppercase font-semibold">Ligne WhatsApp Restaurateurs</span>
                        <span className="font-data-mono text-data-mono text-secondary font-bold text-[15px]">{WHATSAPP_NUMBER}</span>
                      </div>
                      <a
                        className="bg-secondary text-on-secondary px-space-md py-space-xs rounded-lg font-label-sm text-label-sm shadow-sm hover:bg-secondary-container transition-all font-bold"
                        href={WHATSAPP_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Discuter
                      </a>
                    </div>
                    <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm">
                      <span className="text-secondary font-bold">●</span>
                      <span>Réponse garantie en moins de 15 minutes</span>
                    </div>
                  </div>

                  {/* Visual culinary proof */}
                  <div className="rounded-xl overflow-hidden shadow-sm bg-surface-container border border-outline-variant/20">
                    <img
                      className="w-full h-56 object-cover"
                      alt="Table de restaurant africain avec menu digitalisé"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnv526m_RPxKCKmT2sI-iYLkEGC5aN_pVBb2gO-8DYNRmq7PYaA_naQ-kMH0hYcPzA9fPN9cZanQwB5xMwA_Lnj_xRrF6hdAdrNiQrgSklM-3q7HM2BZ_NgpV6IrKMqAn8jzW4hY_ZrZZ5E3fiq9FD5t3aX-jLyc-6j6eFeUnLvrGdfv91KwEu1D686V33zP-V0jNEPPW6TeMcNJBNYCRoNvhy1YPLXcfdlOU5noNKlpiLDCaAf8DD"
                    />
                  </div>
                </div>

                {/* Colonne Formulaire */}
                <div className="lg:col-span-7">
                  <div className="bg-surface-container-lowest p-space-xl md:p-space-2xl rounded-xl shadow-md border border-outline-variant/20">
                    {submitted ? (
                      <div className="p-space-xl bg-surface-container-highest text-on-surface rounded-xl space-y-space-md border border-outline-variant/30">
                        <div className="flex items-center gap-space-xs text-secondary font-bold">
                          <CheckCircle2 className="w-8 h-8" />
                          <span className="font-headline-md text-headline-md">Candidature enregistrée avec succès !</span>
                        </div>
                        <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                          Merci <strong>{managerName}</strong> pour l'établissement <strong>{restaurantName}</strong>. Notre équipe commerciale examine vos éléments et vous contactera sur WhatsApp au <strong>+237 {phone}</strong> d'ici 2 heures ouvrées pour paramétrer vos menus.
                        </p>
                        <div className="pt-2">
                          <Link
                            to="/inscription?role=restaurant_manager"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-secondary text-on-secondary font-label-md font-bold hover:bg-secondary-container transition-all"
                          >
                            <span>Créer directement mon compte restaurant</span>
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <form className="space-y-space-lg" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                          <div className="space-y-space-2xs">
                            <label className="font-label-md text-label-md text-on-surface block font-semibold">Nom complet du gérant / chef *</label>
                            <input
                              className="w-full bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/60 font-body-md text-body-md px-space-md h-11 rounded-lg border border-outline-variant/40 shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                              placeholder="Ex: Jean-Marc Eboule"
                              required
                              type="text"
                              value={managerName}
                              onChange={(e) => setManagerName(e.target.value)}
                            />
                          </div>
                          <div className="space-y-space-2xs">
                            <label className="font-label-md text-label-md text-on-surface block font-semibold">Nom de l'établissement *</label>
                            <input
                              className="w-full bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/60 font-body-md text-body-md px-space-md h-11 rounded-lg border border-outline-variant/40 shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                              placeholder="Ex: Le Wouri Bistrot"
                              required
                              type="text"
                              value={restaurantName}
                              onChange={(e) => setRestaurantName(e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                          <div className="space-y-space-2xs">
                            <label className="font-label-md text-label-md text-on-surface block font-semibold">Ville &amp; Quartier d'implantation *</label>
                            <input
                              className="w-full bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/60 font-body-md text-body-md px-space-md h-11 rounded-lg border border-outline-variant/40 shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                              placeholder="Ex: Douala - Bonanjo"
                              required
                              type="text"
                              value={location}
                              onChange={(e) => setLocation(e.target.value)}
                            />
                          </div>
                          <div className="space-y-space-2xs">
                            <label className="font-label-md text-label-md text-on-surface block font-semibold">Numéro WhatsApp direct *</label>
                            <div className="flex">
                              <span className="inline-flex items-center px-space-sm bg-surface-container text-on-surface-variant font-data-mono text-data-mono rounded-l-lg border border-r-0 border-outline-variant/40 shadow-sm">
                                +237
                              </span>
                              <input
                                className="w-full bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/60 font-body-md text-body-md px-space-md h-11 rounded-r-lg border border-outline-variant/40 shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                                placeholder="6XX XX XX XX"
                                required
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                          <div className="space-y-space-2xs">
                            <label className="font-label-md text-label-md text-on-surface block font-semibold">Type de cuisine / Concept *</label>
                            <select
                              className="w-full bg-surface-container-lowest text-on-surface font-body-md text-body-md px-space-md h-11 rounded-lg border border-outline-variant/40 shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                              value={cuisineType}
                              onChange={(e) => setCuisineType(e.target.value)}
                            >
                              <option value="Gastronomie Camerounaise & Africaine">Gastronomie Camerounaise &amp; Africaine</option>
                              <option value="Grillades, Braises & Rôtisseries">Grillades, Braises &amp; Rôtisseries</option>
                              <option value="Bistronomie & Cuisine Fusion">Bistronomie &amp; Cuisine Fusion</option>
                              <option value="Pâtisserie, Brunch & Salon de thé">Pâtisserie, Brunch &amp; Salon de thé</option>
                              <option value="Hôtellerie & Complexe Touristique">Hôtellerie &amp; Complexe Touristique</option>
                              <option value="Autre concept culinaire">Autre concept culinaire</option>
                            </select>
                          </div>
                          <div className="space-y-space-2xs">
                            <label className="font-label-md text-label-md text-on-surface block font-semibold">Capacité approximative (couverts) *</label>
                            <select
                              className="w-full bg-surface-container-lowest text-on-surface font-body-md text-body-md px-space-md h-11 rounded-lg border border-outline-variant/40 shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                              value={capacity}
                              onChange={(e) => setCapacity(e.target.value)}
                            >
                              <option value="Boutique & Intimiste (< 30 couverts)">Boutique &amp; Intimiste (&lt; 30 couverts)</option>
                              <option value="Moyenne brigade (30 à 70 couverts)">Moyenne brigade (30 à 70 couverts)</option>
                              <option value="Grande capacité (70 à 150 couverts)">Grande capacité (70 à 150 couverts)</option>
                              <option value="Complexe d'envergure (> 150 couverts)">Complexe d'envergure (&gt; 150 couverts)</option>
                            </select>
                          </div>
                        </div>

                        {/* Option de déplacement sur place */}
                        <div className="p-space-md bg-surface-container-low rounded-xl flex items-start gap-space-sm border border-outline-variant/20">
                          <input
                            className="mt-1 w-4 h-4 text-secondary rounded focus:ring-secondary accent-secondary cursor-pointer"
                            id="onsite-advisor"
                            type="checkbox"
                            checked={onsiteAdvisor}
                            onChange={(e) => setOnsiteAdvisor(e.target.checked)}
                          />
                          <label className="font-body-md text-body-md text-on-surface cursor-pointer select-none" htmlFor="onsite-advisor">
                            <span className="font-bold text-on-surface">Option Déplacement Terrain :</span> J'ai besoin qu'un conseiller vienne digitaliser mes menus et former mon équipe en salle directement dans mon restaurant (Douala &amp; Yaoundé).
                          </label>
                        </div>

                        {/* Engagement & Conditions */}
                        <div className="flex items-start gap-space-sm">
                          <input
                            className="mt-1 w-4 h-4 text-secondary rounded focus:ring-secondary accent-secondary cursor-pointer"
                            id="terms-agree"
                            required
                            type="checkbox"
                            checked={termsAgree}
                            onChange={(e) => setTermsAgree(e.target.checked)}
                          />
                          <label className="font-body-sm text-body-sm text-on-surface-variant cursor-pointer select-none" htmlFor="terms-agree">
                            Je souhaite bénéficier des 7 jours d'essai gratuit sans carte bancaire et confirme être habilité à engager mon établissement culinaire.
                          </label>
                        </div>

                        {/* Bouton d'action */}
                        <div>
                          <button
                            className="w-full bg-secondary text-on-secondary py-space-md rounded-lg font-label-lg text-label-lg shadow-md hover:bg-secondary-container transition-opacity flex items-center justify-center gap-space-sm font-bold cursor-pointer"
                            type="submit"
                          >
                            <span>Soumettre ma candidature d'adhésion</span>
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* TEMOIGNAGES DE GERANTS PARTENAIRES */}
          <section className="w-full py-space-3xl bg-surface-container-low border-t border-outline-variant/20">
            <div className="max-w-7xl mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop">
              <div className="text-center max-w-2xl mx-auto mb-space-2xl space-y-space-xs">
                <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider font-bold">Retours d'Expérience</span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">Ils ont repris le contrôle de leur salle</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">Découvrez les témoignages de ceux qui font rayonner la cuisine locale chaque jour.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-xl">
                <div className="bg-surface-container-lowest p-space-xl rounded-xl shadow-sm space-y-space-md flex flex-col justify-between border border-outline-variant/20">
                  <p className="font-body-lg text-body-lg text-on-surface italic leading-relaxed">
                    « Avec l'ardoise connectée Menu du Jour, nous mettons à jour notre poisson braisé du jour selon les arrivages du port en direct depuis le téléphone du chef. Les touristes et les habitués scannent le QR code à table et adorent la rapidité d'affichage. »
                  </p>
                  <div className="flex items-center gap-space-md pt-space-sm">
                    <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center font-bold text-secondary font-headline-sm">
                      LW
                    </div>
                    <div>
                      <h3 className="font-label-lg text-label-lg text-on-surface font-bold">Chef Armand N.</h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">Le Wouri Bistrot • Douala, Bonanjo</p>
                    </div>
                  </div>
                </div>
                <div className="bg-surface-container-lowest p-space-xl rounded-xl shadow-sm space-y-space-md flex flex-col justify-between border border-outline-variant/20">
                  <p className="font-body-lg text-body-lg text-on-surface italic leading-relaxed">
                    « Le système de confirmation de réservations nous a sauvé nos services du weekend. Plus de no-show imprévu : quand la salle est pleine, on refuse poliment avec un mot explicite pré-rédigé. Le coût de 5 000 FCFA/mois est rentabilisé en une seule table. »
                  </p>
                  <div className="flex items-center gap-space-md pt-space-sm">
                    <div className="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center font-bold text-on-secondary-fixed font-headline-sm">
                      ST
                    </div>
                    <div>
                      <h3 className="font-label-lg text-label-lg text-on-surface font-bold">Clarisse M.</h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">Saveurs du Terroir • Yaoundé, Bastos</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* BANDEAU D'APPEL FINAL */}
          <section className="w-full bg-primary py-space-2xl text-on-primary">
            <div className="max-w-7xl mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop flex flex-col md:flex-row items-center justify-between gap-space-lg">
              <div className="space-y-space-2xs text-center md:text-left">
                <h2 className="font-headline-lg text-headline-lg font-bold">Prêt à moderniser le service de votre table ?</h2>
                <p className="font-body-md text-body-md text-on-primary/80">Rejoignez la communauté de référence des chefs et restaurateurs indépendants.</p>
              </div>
              <div className="flex items-center gap-space-md shrink-0">
                <a
                  className="bg-secondary text-on-secondary px-space-xl py-space-md rounded-lg font-label-lg text-label-lg shadow-md hover:bg-secondary-container transition-all font-bold"
                  href="#formulaire-onboarding"
                >
                  Commencer l'Onboarding
                </a>
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

