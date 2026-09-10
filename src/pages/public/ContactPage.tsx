import React, { useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { SeoHead } from '@/components/public/SeoHead'
import { PublicHeader } from '@/components/public/PublicHeader'
import { PublicFooter } from '@/components/public/PublicFooter'
import { FloatingWhatsApp, WHATSAPP_NUMBER, WHATSAPP_URL } from '@/components/public/FloatingWhatsApp'
import { Mail, Send, CheckCircle2, MapPin, Clock, MessageSquare, ArrowRight, Lock, Sparkles, ShieldCheck } from 'lucide-react'

export const ContactPage: React.FC = () => {
  const { t } = useLanguage()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [dataConsent, setDataConsent] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName || !email || !message || !dataConsent) return
    setSubmitted(true)
  }

  return (
    <div className="bg-background font-body-md text-on-surface min-h-screen flex flex-col">
      <SeoHead
        title={t.meta.contact.title}
        description={t.meta.contact.description}
        path="/contact"
      />

      <PublicHeader />

      <main className="w-full pt-20 flex-1 bg-surface">
        <div className="flex flex-col w-full">
          {/* Subtle Ambient Glow Canvas */}
          <div className="relative w-full overflow-hidden bg-surface">
            <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-secondary-fixed opacity-40 blur-3xl pointer-events-none" />
            <div className="absolute top-80 -left-20 w-80 h-80 rounded-full bg-surface-container-highest opacity-50 blur-3xl pointer-events-none" />

            <div className="max-w-[1600px] mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop py-space-xl">
              {/* Top Service Operational Notice Banner */}
              <div className="w-full bg-surface-container-low rounded-xl p-space-md mb-space-xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-space-md border border-outline-variant/30">
                <div className="flex items-center gap-space-md min-w-0">
                  <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-surface-container-lowest shadow-sm flex-shrink-0">
                    <span className="w-3 h-3 rounded-full bg-secondary animate-pulse" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-space-xs flex-wrap">
                      <span className="font-label-md text-label-md text-secondary uppercase tracking-wider font-bold">Centre d'Assistance Opérationnel</span>
                      <span className="text-on-surface-variant font-label-sm text-label-sm">• Cameroun (GMT+1) &amp; International</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                      Prise en charge active des requêtes restaurateurs, réservations et incidents techniques.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-space-xs flex-shrink-0">
                  <span className="font-data-mono text-data-mono bg-surface-container-lowest px-space-sm py-space-2xs rounded-lg text-on-surface font-semibold border border-outline-variant/20">
                    Temps moyen : &lt; 15 min
                  </span>
                </div>
              </div>

              {/* Main Editorial Header & Impact Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
                {/* Left Column: Title & Key Contacts (5 cols) */}
                <div className="lg:col-span-5 flex flex-col gap-space-xl">
                  <div className="flex flex-col gap-space-sm">
                    <div className="inline-flex items-center gap-space-xs">
                      <span className="w-6 h-px bg-secondary" />
                      <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest font-bold">Guichet Unique &amp; Support Dédié</span>
                    </div>
                    <h1 className="font-display-lg text-display-lg text-on-surface font-bold tracking-tight">
                      Contactez l'équipe Menu du Jour
                    </h1>
                    <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                      Assistance technique, intégration de carte digitale en FCFA, onboarding restaurant ou partenariats stratégiques. Notre équipe dédiée vous répond avec précision.
                    </p>
                  </div>

                  {/* Featured Official Direct WhatsApp Box */}
                  <div className="relative overflow-hidden bg-primary text-on-primary rounded-xl p-space-xl shadow-xl">
                    <div className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-secondary opacity-20 blur-2xl pointer-events-none" />
                    <div className="flex items-start justify-between gap-space-md mb-space-lg">
                      <div className="flex items-center gap-space-sm">
                        <div className="w-12 h-12 rounded-xl bg-surface-container-lowest/10 flex items-center justify-center backdrop-blur-md">
                          <MessageSquare className="text-secondary-fixed w-6 h-6" />
                        </div>
                        <div>
                          <span className="font-label-sm text-label-sm text-on-primary-container block uppercase tracking-wider">Canal Direct Express</span>
                          <span className="font-headline-sm text-headline-sm text-on-primary font-bold">WhatsApp Officiel</span>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-space-xs py-space-2xs rounded-full bg-secondary/30 text-secondary-fixed font-label-sm text-label-sm font-semibold">
                        <span className="w-2 h-2 rounded-full bg-secondary-container animate-ping" /> En ligne
                      </span>
                    </div>
                    <p className="font-body-md text-body-md text-on-primary-container mb-space-lg leading-relaxed">
                      Pour une intervention urgente en salle, une activation express de QR code ou un contact commercial direct avec notre coordination locale :
                    </p>
                    <div className="bg-primary-container/80 rounded-lg p-space-md mb-space-lg border border-outline-variant/10">
                      <span className="font-label-sm text-label-sm text-on-primary-container uppercase block mb-1">Numéro vérifié exclusif</span>
                      <div className="font-data-mono text-headline-sm text-on-primary font-bold tracking-wider">
                        {WHATSAPP_NUMBER}
                      </div>
                    </div>
                    <a
                      className="group flex items-center justify-center gap-space-sm w-full py-space-md px-space-lg rounded-lg bg-secondary text-on-secondary font-label-lg text-label-lg hover:bg-secondary-container transition-all duration-200 shadow-md font-bold"
                      href={WHATSAPP_URL}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <MessageSquare className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                      <span>Discuter sur WhatsApp</span>
                    </a>
                    <div className="mt-space-md flex items-center justify-between text-on-primary-container font-label-sm text-label-sm">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" /> 7j/7 : 08h00 — 22h00
                      </span>
                      <span>Douala • Yaoundé</span>
                    </div>
                  </div>

                  {/* Direct Operational Channels Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                    <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between border border-outline-variant/20">
                      <div className="flex items-center gap-space-sm mb-space-sm">
                        <Mail className="text-secondary w-5 h-5" />
                        <span className="font-label-lg text-label-lg text-on-surface font-semibold">Courriel Officiel</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                        Documentation technique, contrats et facturation entreprises.
                      </p>
                      <a className="font-data-mono text-body-md text-secondary font-semibold hover:underline truncate" href="mailto:contact@menudujour.cm">
                        contact@menudujour.cm
                      </a>
                    </div>
                    <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between border border-outline-variant/20">
                      <div className="flex items-center gap-space-sm mb-space-sm">
                        <MapPin className="text-secondary w-5 h-5" />
                        <span className="font-label-lg text-label-lg text-on-surface font-semibold">Pôles Opérations</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                        Bureaux d'ingénierie et support terrain Afrique Centrale.
                      </p>
                      <span className="font-label-md text-label-md text-on-surface font-semibold">
                        Bonanjo (DLA) &amp; Bastos (YAO)
                      </span>
                    </div>
                  </div>

                  {/* Editorial Visual / Culture */}
                  <div className="relative rounded-xl overflow-hidden shadow-sm h-48 bg-surface-container border border-outline-variant/20">
                    <img
                      className="w-full h-full object-cover"
                      alt="Modern hospitality technology center in Douala"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuClmuBF8eKmN_8d4qmT0les7lnv6G_1UksiqX20bhBu0NXhHkD-_4TV7-h6SQQghG4Z4woqrZZFa5-63GgYzLjtFo9cPoKppDmS32trdwDkw2kPghU7Tq8LWX5DG3BHupNPmXSFdHHDNZ2vbGQZY-tCxR_9s67tXcEj6QeOfpw0DCg10EVzotARLaN7gnu2UcKXXSKEA3U15qXiFccFjKgy-uWCo7IoV5ZY07qQiwUQ4upmokF6HXf2"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent flex items-end p-space-md">
                      <span className="text-on-primary font-label-md text-label-md flex items-center gap-space-xs font-semibold">
                        <ShieldCheck className="w-4 h-4 text-secondary-fixed" /> Déploiement logiciel &amp; accompagnement sur site
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Structured Clean Contact Form (7 cols) */}
                <div className="lg:col-span-7 flex flex-col gap-space-md">
                  <div className="bg-surface-container-lowest rounded-xl p-space-xl md:p-space-2xl shadow-sm border border-outline-variant/20">
                    <div className="border-b-0 pb-space-lg mb-space-lg bg-surface-container-low -mx-space-xl -mt-space-xl p-space-xl rounded-t-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider block font-bold">Transmission Sécurisée</span>
                          <h2 className="font-headline-lg text-headline-lg text-on-surface font-semibold">Formulaire d'assistance &amp; partenariats</h2>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-surface-container-lowest flex items-center justify-center text-on-surface shadow-xs">
                          <Send className="w-5 h-5 text-secondary" />
                        </div>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs">
                        Renseignez les détails de votre établissement ou de votre demande. Nos spécialistes vous répondent sous 24 heures ouvrées.
                      </p>
                    </div>

                    {submitted ? (
                      <div className="mt-space-lg p-space-lg rounded-xl bg-surface-container-high text-on-surface shadow-md border border-outline-variant/30">
                        <div className="flex items-start gap-space-md">
                          <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary flex items-center justify-center flex-shrink-0">
                            <CheckCircle2 className="w-6 h-6" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-headline-sm text-headline-sm font-semibold text-on-surface">Message transmis avec succès</span>
                            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                              Merci. Notre équipe technique a bien réceptionné votre demande. Un accusé vous a été envoyé et un chargé de compte vous contactera sous peu.
                            </p>
                            <div className="mt-space-md">
                              <a className="inline-flex items-center gap-space-xs font-label-md text-label-md text-secondary hover:underline font-bold" href={WHATSAPP_URL}>
                                <MessageSquare className="w-4 h-4" /> Un imprévu urgent ? Rejoignez l'équipe sur WhatsApp ({WHATSAPP_NUMBER})
                              </a>
                            </div>
                            <button
                              onClick={() => {
                                setSubmitted(false)
                                setFullName('')
                                setEmail('')
                                setPhone('')
                                setSubject('')
                                setMessage('')
                                setDataConsent(false)
                              }}
                              className="mt-4 text-xs font-bold text-on-surface-variant hover:text-secondary underline text-left"
                            >
                              Envoyer un autre message
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <form className="flex flex-col gap-space-lg" onSubmit={handleSubmit}>
                        {/* Full Name */}
                        <div className="flex flex-col gap-space-xs">
                          <label className="font-label-md text-label-md text-on-surface flex items-center justify-between font-semibold" htmlFor="fullName">
                            <span>Nom complet &amp; Titre <span className="text-secondary">*</span></span>
                            <span className="font-body-sm text-body-sm text-on-surface-variant font-normal">Ex: Marc Ndongo, Gérant</span>
                          </label>
                          <div className="relative flex items-center">
                            <span className="material-symbols-outlined text-on-surface-variant text-[20px] absolute left-space-md pointer-events-none">person</span>
                            <input
                              className="w-full bg-surface-container-lowest text-on-surface font-body-md text-body-md pl-11 pr-space-md py-space-sm rounded-lg border border-outline-variant/40 shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                              id="fullName"
                              name="fullName"
                              placeholder="Votre nom et prénom"
                              required
                              type="text"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                            />
                          </div>
                        </div>

                        {/* Two columns: Email & Phone */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                          <div className="flex flex-col gap-space-xs">
                            <label className="font-label-md text-label-md text-on-surface font-semibold" htmlFor="email">
                              Adresse email professionnelle <span className="text-secondary">*</span>
                            </label>
                            <div className="relative flex items-center">
                              <span className="material-symbols-outlined text-on-surface-variant text-[20px] absolute left-space-md pointer-events-none">alternate_email</span>
                              <input
                                className="w-full bg-surface-container-lowest text-on-surface font-body-md text-body-md pl-11 pr-space-md py-space-sm rounded-lg border border-outline-variant/40 shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                                id="email"
                                name="email"
                                placeholder="direction@restaurant.cm"
                                required
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-space-xs">
                            <label className="font-label-md text-label-md text-on-surface font-semibold" htmlFor="phone">
                              Téléphone direct (WhatsApp conseillé) <span className="text-secondary">*</span>
                            </label>
                            <div className="relative flex items-center">
                              <span className="material-symbols-outlined text-on-surface-variant text-[20px] absolute left-space-md pointer-events-none">call</span>
                              <input
                                className="w-full bg-surface-container-lowest text-on-surface font-body-md text-body-md pl-11 pr-space-md py-space-sm rounded-lg border border-outline-variant/40 shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                                id="phone"
                                name="phone"
                                placeholder="+237 6XX XX XX XX"
                                required
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Subject dropdown */}
                        <div className="flex flex-col gap-space-xs">
                          <label className="font-label-md text-label-md text-on-surface font-semibold" htmlFor="subject">
                            Objet de la demande <span className="text-secondary">*</span>
                          </label>
                          <div className="relative flex items-center">
                            <span className="material-symbols-outlined text-on-surface-variant text-[20px] absolute left-space-md pointer-events-none">tune</span>
                            <select
                              className="w-full bg-surface-container-lowest text-on-surface font-body-md text-body-md pl-11 pr-space-xl py-space-sm rounded-lg border border-outline-variant/40 shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary appearance-none cursor-pointer transition-all"
                              id="subject"
                              name="subject"
                              required
                              value={subject}
                              onChange={(e) => setSubject(e.target.value)}
                            >
                              <option value="" disabled>Sélectionnez le motif exact...</option>
                              <option value="information">Demande d'information générale &amp; tarifs</option>
                              <option value="support">Support technique restaurant (menu digital, QR, synchronisation)</option>
                              <option value="partenariat">Partenariat &amp; Module "Engagez-nous"</option>
                              <option value="reservation">Problème de commande ou de réservation client</option>
                              <option value="autre">Autre demande institutionnelle</option>
                            </select>
                            <span className="material-symbols-outlined text-on-surface-variant text-[20px] absolute right-space-md pointer-events-none">expand_more</span>
                          </div>
                        </div>

                        {/* Detailed Message */}
                        <div className="flex flex-col gap-space-xs">
                          <div className="flex items-center justify-between">
                            <label className="font-label-md text-label-md text-on-surface font-semibold" htmlFor="message">
                              Message détaillé <span className="text-secondary">*</span>
                            </label>
                            <span className="font-body-sm text-body-sm text-on-surface-variant">Précisez le nom du restaurant s'il y a lieu</span>
                          </div>
                          <textarea
                            className="w-full bg-surface-container-lowest text-on-surface font-body-md text-body-md p-space-md rounded-lg border border-outline-variant/40 shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary transition-all resize-y"
                            id="message"
                            name="message"
                            placeholder="Détaillez ici votre besoin opérationnel, le nombre de tables ou le dysfonctionnement observé..."
                            required
                            rows={5}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                          />
                        </div>

                        {/* Consent Checkbox */}
                        <div className="bg-surface-container-low rounded-lg p-space-md flex items-start gap-space-md border border-outline-variant/20">
                          <input
                            className="mt-1 w-4 h-4 rounded text-secondary focus:ring-secondary accent-secondary cursor-pointer"
                            id="dataConsent"
                            name="dataConsent"
                            required
                            type="checkbox"
                            checked={dataConsent}
                            onChange={(e) => setDataConsent(e.target.checked)}
                          />
                          <label className="font-body-sm text-body-sm text-on-surface cursor-pointer select-none" htmlFor="dataConsent">
                            J'accepte le traitement de mes données par « Menu du Jour » aux strictes fins d'assistance, de gestion de devis et d'accompagnement de mon établissement, conformément à la politique de confidentialité.
                          </label>
                        </div>

                        {/* Submission CTA & Processing status */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-space-md pt-space-xs">
                          <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm">
                            <Lock className="w-4 h-4 text-on-surface-variant" />
                            <span>Données confidentielles et sécurisées</span>
                          </div>
                          <button
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-space-sm px-space-xl py-space-md rounded-xl bg-secondary text-on-secondary font-label-lg text-label-lg hover:bg-secondary-container transition-colors shadow-md cursor-pointer font-bold"
                            type="submit"
                          >
                            <span>Envoyer le message</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </form>
                    )}
                  </div>

                  {/* Secondary SLA & Transparency Micro-Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
                    <div className="bg-surface-container rounded-xl p-space-md flex items-center gap-space-md border border-outline-variant/20">
                      <Clock className="text-secondary w-6 h-6 shrink-0" />
                      <div className="flex flex-col">
                        <span className="font-label-sm text-label-sm text-on-surface uppercase font-bold">Réactivité 15 min</span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">Sur le WhatsApp officiel</span>
                      </div>
                    </div>
                    <div className="bg-surface-container rounded-xl p-space-md flex items-center gap-space-md border border-outline-variant/20">
                      <ShieldCheck className="text-secondary w-6 h-6 shrink-0" />
                      <div className="flex flex-col">
                        <span className="font-label-sm text-label-sm text-on-surface uppercase font-bold">Intégrité XAF</span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">Tarification transparente</span>
                      </div>
                    </div>
                    <div className="bg-surface-container rounded-xl p-space-md flex items-center gap-space-md border border-outline-variant/20">
                      <Sparkles className="text-secondary w-6 h-6 shrink-0" />
                      <div className="flex flex-col">
                        <span className="font-label-sm text-label-sm text-on-surface uppercase font-bold">Ingénierie Locale</span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">Support Douala &amp; YAO</span>
                      </div>
                    </div>
                  </div>
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

