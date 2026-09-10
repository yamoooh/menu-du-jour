import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '@/context/LanguageContext'
import { SeoHead } from '@/components/public/SeoHead'
import { PublicHeader } from '@/components/public/PublicHeader'
import { PublicFooter } from '@/components/public/PublicFooter'
import { FloatingWhatsApp } from '@/components/public/FloatingWhatsApp'
import { Check, CheckCircle2, ShieldCheck, Store, ChevronDown, ChevronUp, Lock, ArrowRight, Zap, Utensils } from 'lucide-react'

export const PricingPage: React.FC = () => {
  const { t } = useLanguage()
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const faqItems = [
    {
      question: "Comment fonctionne la période d'essai de 7 jours pour les restaurants ?",
      answer: "Dès votre inscription comme établissement, vous disposez immédiatement d'un accès complet à toutes les options de Menu du Jour pendant 7 jours sans renseigner de moyen de paiement. Vous publiez vos menus, paramétrez vos horaires et testez les réservations. À l'issue des 7 jours, vous pouvez choisir de souscrire à 5 000 FCFA pour 30 jours via LeekPay."
    },
    {
      question: "Quels sont les modes de paiement pris en charge par LeekPay ?",
      answer: "LeekPay accepte nativement les paiements par Mobile Money (Orange Money Cameroun/Sénégal/Côte d'Ivoire, MTN Mobile Money, Moov Money) ainsi que les cartes de débit/crédit (Visa, Mastercard). Toutes les opérations s'effectuent directement en FCFA (XAF/XOF)."
    },
    {
      question: "Que se passe-t-il si mon abonnement de 30 jours arrive à échéance ?",
      answer: "Nous appliquons un principe de sauvegarde intégrale. Rien n'est effacé : vos cartes, photos, coordonnées et historiques restent stockés de façon sécurisée. Seule l'accessibilité publique de vos menus et le module de réservation sont temporairement mis en pause. Dès votre reconduction via LeekPay, votre vitrine redevient opérationnelle en quelques secondes."
    },
    {
      question: "Le compte Client est-il véritablement gratuit à 100% ?",
      answer: "Absolument. Un convive ou client ne paie jamais rien sur Menu du Jour. Vous découvrez les restaurants, lisez les menus, réservez votre table et recevez les confirmations par notification sans aucune commission ajoutée sur l'addition du restaurant."
    },
    {
      question: "Qu'apporte le module de réservation avec justification de refus ?",
      answer: "Lorsqu'un client effectue une demande de table, le restaurateur peut accepter d'un geste ou refuser en précisant le motif (ex. : salle complète, privatisation exclusive, fermeture exceptionnelle). Le client reçoit aussitôt l'explication, garantissant une relation de confiance et une clarté totale."
    }
  ]

  return (
    <div className="bg-surface font-body-md text-on-surface min-h-screen flex flex-col">
      <SeoHead
        title={t.meta.pricing.title}
        description={t.meta.pricing.description}
        path="/tarifs"
      />

      <PublicHeader />

      <main className="w-full pt-20 flex-1 bg-surface">
        <div className="flex flex-col w-full">
          {/* Subtle Ambient Glow */}
          <div className="relative w-full overflow-hidden">
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[350px] bg-gradient-to-b from-secondary/15 via-secondary-container/10 to-transparent blur-3xl pointer-events-none rounded-full" />

            {/* Editorial Header Section */}
            <section className="relative max-w-[1600px] mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop pt-space-xl pb-space-2xl">
              <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
                <div className="inline-flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-secondary-fixed text-on-secondary-fixed shadow-sm mb-space-md">
                  <span className="w-2 h-2 rounded-full bg-secondary" />
                  <span className="font-label-sm text-label-sm uppercase tracking-wider">Modèle Économique &amp; Transparence</span>
                </div>
                <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface tracking-tight mb-space-base">
                  Tarification simple, transparente et sans engagement
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
                  Une accessibilité totale pour les gourmets et un forfait opérationnel ultra-accessible calibré pour la croissance des restaurateurs en zone CEMAC / UEMOA.
                </p>

                {/* Dynamic Currency Bar */}
                <div className="mt-space-lg inline-flex items-center gap-space-base px-space-lg py-space-sm rounded-xl bg-surface-container-low shadow-sm">
                  <div className="flex items-center gap-space-xs">
                    <ShieldCheck className="text-secondary w-5 h-5" />
                    <span className="font-label-md text-label-md text-on-surface">
                      Devise Opérationnelle : <strong className="text-secondary font-data-mono">FCFA (XAF)</strong>
                    </span>
                  </div>
                  <span className="h-4 w-px bg-outline-variant" />
                  <div className="flex items-center gap-space-xs">
                    <Lock className="text-on-surface-variant w-4 h-4" />
                    <span className="font-label-md text-label-md text-on-surface-variant">Transaction LeekPay Sécurisée</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Pricing Comparison Bento Grid */}
            <section className="relative max-w-[1600px] mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop pb-space-3xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-stretch">
                {/* CARD 1: Offre Client (5 cols) */}
                <div className="lg:col-span-5 flex flex-col justify-between rounded-xl bg-surface-container-lowest p-space-xl md:p-space-2xl shadow-sm relative overflow-hidden border border-outline-variant/30">
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between gap-space-sm mb-space-md">
                      <span className="font-label-lg text-label-lg uppercase tracking-wider text-on-surface-variant">Pour les Gourmets &amp; Clients</span>
                      <span className="px-space-sm py-space-2xs rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm font-semibold">Accès Libre</span>
                    </div>
                    <h2 className="font-headline-lg text-headline-lg text-on-surface mb-space-xs">Compte Client</h2>
                    <p className="font-body-md text-body-md text-on-surface-variant mb-space-xl">
                      Explorez le meilleur de la scène culinaire locale sans le moindre frais d'utilisation.
                    </p>

                    {/* Price display */}
                    <div className="flex items-baseline gap-space-xs pb-space-xl">
                      <span className="font-display-lg text-display-lg text-on-surface tracking-tight">0</span>
                      <span className="font-headline-md text-headline-md text-on-surface font-semibold">FCFA</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant ml-space-xs">/ pour toujours</span>
                    </div>

                    {/* Perks */}
                    <div className="space-y-space-md pb-space-xl">
                      <div className="flex items-start gap-space-sm">
                        <CheckCircle2 className="text-secondary w-5 h-5 shrink-0 fill-secondary/10" />
                        <span className="font-body-md text-body-md text-on-surface">Recherche et découverte exhaustive de tous les restaurants répertoriés</span>
                      </div>
                      <div className="flex items-start gap-space-sm">
                        <CheckCircle2 className="text-secondary w-5 h-5 shrink-0 fill-secondary/10" />
                        <span className="font-body-md text-body-md text-on-surface">Consultation libre des menus officiels et suggestions du jour</span>
                      </div>
                      <div className="flex items-start gap-space-sm">
                        <CheckCircle2 className="text-secondary w-5 h-5 shrink-0 fill-secondary/10" />
                        <span className="font-body-md text-body-md text-on-surface">Visualisation haute définition des photos de plats et fichiers PDF officiels</span>
                      </div>
                      <div className="flex items-start gap-space-sm">
                        <CheckCircle2 className="text-secondary w-5 h-5 shrink-0 fill-secondary/10" />
                        <span className="font-body-md text-body-md text-on-surface">Suivi en temps réel de vos établissements et chefs favoris</span>
                      </div>
                      <div className="flex items-start gap-space-sm">
                        <CheckCircle2 className="text-secondary w-5 h-5 shrink-0 fill-secondary/10" />
                        <span className="font-body-md text-body-md text-on-surface">Réservation de tables en ligne sans commission cachée</span>
                      </div>
                      <div className="flex items-start gap-space-sm">
                        <CheckCircle2 className="text-secondary w-5 h-5 shrink-0 fill-secondary/10" />
                        <span className="font-body-md text-body-md text-on-surface">Réception immédiate des notifications de statut (validée, en attente)</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom CTA */}
                  <div className="pt-space-md">
                    <Link
                      to="/inscription?role=client"
                      className="w-full inline-flex items-center justify-center gap-space-xs py-space-md px-space-xl rounded-xl bg-surface-container-high text-on-surface font-label-lg text-label-lg hover:bg-surface-container-highest transition-all duration-200"
                    >
                      <span>Créer un compte Client gratuit</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* CARD 2: Offre Restaurant (7 cols - Spotlight / Premium Accent) */}
                <div className="lg:col-span-7 flex flex-col justify-between rounded-xl bg-primary-container text-on-primary p-space-xl md:p-space-2xl shadow-xl relative overflow-hidden">
                  <div className="absolute -top-24 -right-24 w-72 h-72 bg-secondary-container/20 rounded-full blur-3xl pointer-events-none" />
                  <div className="relative z-10 flex flex-col">
                    <div className="flex flex-wrap items-center justify-between gap-space-sm mb-space-md">
                      <span className="font-label-lg text-label-lg uppercase tracking-wider text-secondary-fixed">Professionnels de la Restauration</span>
                      <div className="flex items-center gap-space-xs px-space-sm py-space-2xs rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm shadow-sm">
                        <Zap className="w-3.5 h-3.5" />
                        <span>7 Jours d'essai 100% gratuits</span>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-base pb-space-lg">
                      <div>
                        <h2 className="font-headline-lg text-headline-lg text-on-primary">Abonnement Partenaire</h2>
                        <p className="font-body-md text-body-md text-on-primary-container max-w-md mt-space-xs">
                          Gestion intégrale, visibilité amplifiée et réservations directes sans préavis.
                        </p>
                      </div>
                      {/* Big Price Tag */}
                      <div className="flex flex-col items-start md:items-end">
                        <div className="flex items-baseline gap-space-xs">
                          <span className="font-display-lg text-display-lg text-on-primary tracking-tight font-bold">5 000</span>
                          <span className="font-headline-md text-headline-md text-secondary-container font-bold">FCFA</span>
                        </div>
                        <span className="font-label-sm text-label-sm text-on-primary-container">Facturation fixe pour 30 jours</span>
                      </div>
                    </div>

                    {/* Badges Bar for trial + leekpay */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm p-space-md rounded-xl bg-surface-container-lowest/5 mb-space-xl">
                      <div className="flex items-center gap-space-xs">
                        <span className="w-2.5 h-2.5 rounded-full bg-secondary-container shrink-0" />
                        <span className="font-body-sm text-body-sm text-on-primary">Période d'essai : <strong>7 jours offerts</strong> sans carte</span>
                      </div>
                      <div className="flex items-center gap-space-xs">
                        <span className="w-2.5 h-2.5 rounded-full bg-secondary-fixed shrink-0" />
                        <span className="font-body-sm text-body-sm text-on-primary">Paiement : <strong>LeekPay exclusivement</strong> (Mobile Money &amp; Cartes)</span>
                      </div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-space-lg gap-y-space-md pb-space-xl">
                      <div className="flex items-start gap-space-sm">
                        <Store className="text-secondary-container w-5 h-5 shrink-0" />
                        <div>
                          <h4 className="font-label-md text-label-md text-on-primary font-semibold">Fiche Établissement Exhaustive</h4>
                          <p className="font-body-sm text-body-sm text-on-primary-container">Logo, galerie photo, contacts directs et horaires de service hebdomadaires.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-space-sm">
                        <ShieldCheck className="text-secondary-container w-5 h-5 shrink-0" />
                        <div>
                          <h4 className="font-label-md text-label-md text-on-primary font-semibold">Géolocalisation Précise</h4>
                          <p className="font-body-sm text-body-sm text-on-primary-container">Intégration OpenStreetMap pour diriger les clients sans friction géographique.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-space-sm">
                        <Utensils className="text-secondary-container w-5 h-5 shrink-0" />
                        <div>
                          <h4 className="font-label-md text-label-md text-on-primary font-semibold">Éditeur de Menus Dynamiques</h4>
                          <p className="font-body-sm text-body-sm text-on-primary-container">Statuts brouillon/publié, catégorisation, suggestions du jour et photos.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-space-sm">
                        <Lock className="text-secondary-container w-5 h-5 shrink-0" />
                        <div>
                          <h4 className="font-label-md text-label-md text-on-primary font-semibold">Upload PDF &amp; Médias (10 Mo)</h4>
                          <p className="font-body-sm text-body-sm text-on-primary-container">Téléversement direct de cartes graphiques et cartes des vins haute résolution.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-space-sm">
                        <CheckCircle2 className="text-secondary-container w-5 h-5 shrink-0" />
                        <div>
                          <h4 className="font-label-md text-label-md text-on-primary font-semibold">Gestionnaire de Réservations</h4>
                          <p className="font-body-sm text-body-sm text-on-primary-container">Confirmation en un clic ou refus motivé (explication personnalisée au client).</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-space-sm">
                        <Zap className="text-secondary-container w-5 h-5 shrink-0" />
                        <div>
                          <h4 className="font-label-md text-label-md text-on-primary font-semibold">Notifications Temps Réel</h4>
                          <p className="font-body-sm text-body-sm text-on-primary-container">Alertes instantanées de nouvelles tables, modifications et interactions.</p>
                        </div>
                      </div>
                    </div>

                    {/* Expiration Policy Micro-Banner */}
                    <div className="p-space-md rounded-xl bg-surface-container-lowest/10 mb-space-lg flex items-start gap-space-sm">
                      <ShieldCheck className="text-secondary-fixed w-5 h-5 shrink-0" />
                      <p className="font-body-sm text-body-sm text-on-primary">
                        <strong>Règle d'expiration bienveillante :</strong> Vos données, menus et configurations sont intégralement conservés après expiration. Votre compte se réactive immédiatement dès le règlement LeekPay de 5 000 FCFA.
                      </p>
                    </div>
                  </div>

                  {/* Bottom Action */}
                  <div className="relative z-10 pt-space-md flex flex-col sm:flex-row items-center gap-space-md">
                    <Link
                      to="/inscription?role=restaurant_manager"
                      className="w-full sm:flex-1 inline-flex items-center justify-center gap-space-xs py-space-md px-space-xl rounded-xl bg-secondary-container text-on-secondary-container font-label-lg text-label-lg hover:bg-secondary transition-all duration-200 shadow-md font-bold"
                    >
                      <span>Démarrer mes 7 jours d'essai</span>
                      <Zap className="w-4 h-4" />
                    </Link>
                    <span className="font-body-sm text-body-sm text-on-primary-container text-center sm:text-left">
                      Activation sans engagement • Sans préavis
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Visual Infographic Strip: LeekPay Verification Process */}
            <section className="relative max-w-[1600px] mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop pb-space-3xl">
              <div className="rounded-xl bg-surface-container-low p-space-xl md:p-space-2xl shadow-sm border border-outline-variant/30">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-base mb-space-2xl">
                  <div>
                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">Protocole LeekPay</span>
                    <h3 className="font-headline-lg text-headline-lg text-on-surface mt-space-2xs">
                      Vérification serveur &amp; Activation automatisée
                    </h3>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
                    Chaque souscription de 5 000 FCFA est validée par échange sécurisé de webhook entre l'infrastructure LeekPay et le cœur applicatif de Menu du Jour.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-space-lg">
                  <div className="flex flex-col bg-surface-container-lowest p-space-lg rounded-xl shadow-sm relative">
                    <div className="w-10 h-10 rounded-lg bg-surface-container-high text-on-surface flex items-center justify-center font-headline-sm text-headline-sm mb-space-base font-bold">
                      01
                    </div>
                    <h4 className="font-headline-sm text-headline-sm text-on-surface mb-space-xs">Initiation</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Sélection de l'abonnement mensuel (5 000 FCFA) depuis votre espace d'administration restaurant.
                    </p>
                  </div>
                  <div className="flex flex-col bg-surface-container-lowest p-space-lg rounded-xl shadow-sm relative">
                    <div className="w-10 h-10 rounded-lg bg-surface-container-high text-on-surface flex items-center justify-center font-headline-sm text-headline-sm mb-space-base font-bold">
                      02
                    </div>
                    <h4 className="font-headline-sm text-headline-sm text-on-surface mb-space-xs">Paiement Mobile</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Règlement fluide via Orange Money, MTN Mobile Money, Moov ou carte bancaire certifiée 3D-Secure.
                    </p>
                  </div>
                  <div className="flex flex-col bg-surface-container-lowest p-space-lg rounded-xl shadow-sm relative">
                    <div className="w-10 h-10 rounded-lg bg-surface-container-high text-on-surface flex items-center justify-center font-headline-sm text-headline-sm mb-space-base font-bold">
                      03
                    </div>
                    <h4 className="font-headline-sm text-headline-sm text-on-surface mb-space-xs">Confirmation Serveur</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Le webhook LeekPay certifie l'encaissement avec signature chiffrée sans intervention humaine.
                    </p>
                  </div>
                  <div className="flex flex-col bg-secondary-fixed p-space-lg rounded-xl shadow-sm relative">
                    <div className="w-10 h-10 rounded-lg bg-secondary text-on-secondary flex items-center justify-center font-headline-sm text-headline-sm mb-space-base font-bold">
                      04
                    </div>
                    <h4 className="font-headline-sm text-headline-sm text-on-secondary-fixed mb-space-xs">Accès Débloqué</h4>
                    <p className="font-body-sm text-body-sm text-on-secondary-fixed-variant">
                      Extension immédiate de 30 jours. Vos menus redeviennent instantanément visibles aux convives.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Detailed Feature Comparison Matrix */}
            <section className="max-w-[1600px] mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop pb-space-3xl">
              <div className="text-center max-w-2xl mx-auto mb-space-xl">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">Tableau Précis</span>
                <h3 className="font-headline-lg text-headline-lg text-on-surface mt-space-2xs">
                  Comparaison détaillée des prestations
                </h3>
              </div>
              <div className="rounded-xl bg-surface-container-lowest shadow-sm overflow-hidden border border-outline-variant/30">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
                        <th className="py-space-md px-space-lg">Fonctionnalité &amp; Module</th>
                        <th className="py-space-md px-space-lg w-1/4">Offre Client</th>
                        <th className="py-space-md px-space-lg w-1/3 bg-surface-container text-on-surface">Offre Restaurant</th>
                      </tr>
                    </thead>
                    <tbody className="font-body-md text-body-md">
                      <tr className="hover:bg-surface-container-low transition-colors border-b border-outline-variant/15">
                        <td className="py-space-md px-space-lg font-semibold text-on-surface">Coût d'accès récurrent</td>
                        <td className="py-space-md px-space-lg text-secondary font-semibold">0 FCFA / Toujours</td>
                        <td className="py-space-md px-space-lg bg-surface-container-low/50 font-data-mono font-bold text-secondary">5 000 FCFA / 30j</td>
                      </tr>
                      <tr className="hover:bg-surface-container-low transition-colors border-b border-outline-variant/15">
                        <td className="py-space-md px-space-lg text-on-surface">Période d'évaluation sans engagement</td>
                        <td className="py-space-md px-space-lg text-on-surface-variant">Illimitée</td>
                        <td className="py-space-md px-space-lg bg-surface-container-low/50 font-semibold text-on-surface">7 jours complets gratuits</td>
                      </tr>
                      <tr className="hover:bg-surface-container-low transition-colors border-b border-outline-variant/15">
                        <td className="py-space-md px-space-lg text-on-surface">Consultation des cartes &amp; Menus du jour</td>
                        <td className="py-space-md px-space-lg flex items-center gap-1.5"><Check className="text-secondary w-5 h-5 shrink-0" /> Accès illimité</td>
                        <td className="py-space-md px-space-lg bg-surface-container-low/50"><div className="flex items-center gap-1.5"><Check className="text-secondary w-5 h-5 shrink-0" /> Publication illimitée</div></td>
                      </tr>
                      <tr className="hover:bg-surface-container-low transition-colors border-b border-outline-variant/15">
                        <td className="py-space-md px-space-lg text-on-surface">Affichage des fichiers PDF &amp; Galeries photos</td>
                        <td className="py-space-md px-space-lg flex items-center gap-1.5"><Check className="text-secondary w-5 h-5 shrink-0" /> Haute résolution</td>
                        <td className="py-space-md px-space-lg bg-surface-container-low/50"><div className="flex items-center gap-1.5"><Check className="text-secondary w-5 h-5 shrink-0" /> Upload jusqu'à 10 Mo / fichier</div></td>
                      </tr>
                      <tr className="hover:bg-surface-container-low transition-colors border-b border-outline-variant/15">
                        <td className="py-space-md px-space-lg text-on-surface">Gestion des statuts de plats (Brouillon / Publié)</td>
                        <td className="py-space-md px-space-lg text-on-surface-variant">—</td>
                        <td className="py-space-md px-space-lg bg-surface-container-low/50"><div className="flex items-center gap-1.5"><Check className="text-secondary w-5 h-5 shrink-0" /> Bascule instantanée</div></td>
                      </tr>
                      <tr className="hover:bg-surface-container-low transition-colors border-b border-outline-variant/15">
                        <td className="py-space-md px-space-lg text-on-surface">Réservation de table en ligne</td>
                        <td className="py-space-md px-space-lg flex items-center gap-1.5"><Check className="text-secondary w-5 h-5 shrink-0" /> Demande gratuite</td>
                        <td className="py-space-md px-space-lg bg-surface-container-low/50"><div className="flex items-center gap-1.5"><Check className="text-secondary w-5 h-5 shrink-0" /> Module avec motif de refus</div></td>
                      </tr>
                      <tr className="hover:bg-surface-container-low transition-colors border-b border-outline-variant/15">
                        <td className="py-space-md px-space-lg text-on-surface">Géolocalisation interactive (OpenStreetMap)</td>
                        <td className="py-space-md px-space-lg flex items-center gap-1.5"><Check className="text-secondary w-5 h-5 shrink-0" /> Itinéraire direct</td>
                        <td className="py-space-md px-space-lg bg-surface-container-low/50"><div className="flex items-center gap-1.5"><Check className="text-secondary w-5 h-5 shrink-0" /> Marqueur dynamique précis</div></td>
                      </tr>
                      <tr className="hover:bg-surface-container-low transition-colors">
                        <td className="py-space-md px-space-lg text-on-surface">Conservation des configurations après expiration</td>
                        <td className="py-space-md px-space-lg text-on-surface-variant">Permanent</td>
                        <td className="py-space-md px-space-lg bg-surface-container-low/50"><div className="flex items-center gap-1.5"><Check className="text-secondary w-5 h-5 shrink-0" /> Sauvegarde totale &amp; reprise à chaud</div></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* FAQ Interactive Accordion Section */}
            <section className="max-w-[1600px] mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop pb-space-3xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
                <div className="lg:col-span-4 flex flex-col">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">Foire aux Questions</span>
                  <h3 className="font-headline-lg text-headline-lg text-on-surface mt-space-2xs mb-space-base">
                    Toutes les réponses sur les paiements et abonnements
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mb-space-lg">
                    Une question technique sur vos règlements LeekPay ou l'utilisation du service ? Contactez notre support disponible en continu.
                  </p>
                  <a
                    className="inline-flex items-center gap-space-xs py-space-sm px-space-md rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors self-start font-label-md text-label-md"
                    href="https://wa.me/237658352129"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <span className="text-secondary font-bold text-lg">💬</span>
                    <span>Assistance WhatsApp (+237 658 35 21 29)</span>
                  </a>
                </div>
                <div className="lg:col-span-8 space-y-space-base">
                  {faqItems.map((item, index) => {
                    const isOpen = openFaq === index
                    return (
                      <div
                        key={index}
                        className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm border border-outline-variant/30 transition-all duration-200"
                      >
                        <button
                          onClick={() => toggleFaq(index)}
                          className="w-full flex items-center justify-between text-left gap-space-md focus:outline-none cursor-pointer"
                          type="button"
                        >
                          <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">{item.question}</span>
                          {isOpen ? (
                            <ChevronUp className="w-5 h-5 text-on-surface-variant shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-on-surface-variant shrink-0" />
                          )}
                        </button>
                        {isOpen && (
                          <div className="mt-space-md pt-space-md border-t border-outline-variant/20">
                            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                              {item.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </section>

            {/* Final Reassurance Banner */}
            <section className="max-w-[1600px] mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop pb-space-3xl">
              <div className="rounded-xl bg-gradient-to-r from-primary-container via-surface-container-high to-surface-container-low p-space-xl md:p-space-2xl flex flex-col md:flex-row items-center justify-between gap-space-xl border border-outline-variant/30">
                <div className="max-w-xl">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">Sans Carte Bancaire • Sans Frais Cachés</span>
                  <h3 className="font-headline-lg text-headline-lg text-on-surface mt-space-xs font-bold">
                    Prêt à digitaliser votre établissement ?
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs">
                    Rejoignez des centaines de restaurants partenaires au Cameroun et en Afrique Francophone dès aujourd'hui.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-space-sm w-full md:w-auto">
                  <Link
                    to="/inscription?role=restaurant_manager"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-space-xs py-space-md px-space-xl rounded-xl bg-secondary text-on-secondary hover:bg-secondary-container transition-all font-label-lg text-label-lg shadow-md font-bold"
                  >
                    <span>Commencer 7 jours gratuits</span>
                    <Zap className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/inscription?role=client"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-space-xs py-space-md px-space-base rounded-xl bg-surface-container-lowest text-on-surface hover:bg-surface-container-highest transition-all font-label-lg text-label-lg font-medium"
                  >
                    Créer un compte Client
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <PublicFooter />
      <FloatingWhatsApp />
    </div>
  )
}
