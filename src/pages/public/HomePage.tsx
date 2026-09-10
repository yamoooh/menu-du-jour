import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '@/context/LanguageContext'
import { SeoHead } from '@/components/public/SeoHead'
import { PublicHeader } from '@/components/public/PublicHeader'
import { PublicFooter } from '@/components/public/PublicFooter'
import { FloatingWhatsApp } from '@/components/public/FloatingWhatsApp'
import {
  UtensilsCrossed,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Store,
  Calendar,
  Sparkles,
  Zap,
  ShieldCheck,
  Smartphone,
  BarChart3,
  Clock,
  Heart,
  UserPlus,
} from 'lucide-react'

export const HomePage: React.FC = () => {
  const { t } = useLanguage()
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const jsonLdSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Menu du Jour',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web, iOS, Android',
    offers: {
      '@type': 'Offer',
      price: '5000',
      priceCurrency: 'XAF',
    },
    description: t.meta.home.description,
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      <SeoHead
        title={t.meta.home.title}
        description={t.meta.home.description}
        path="/"
        schema={jsonLdSchema}
      />

      <PublicHeader />

      <main className="flex-1 space-y-20 pb-16">
        {/* ================= HERO SECTION ================= */}
        <section className="relative overflow-hidden bg-slate-900 text-white pt-12 sm:pt-20 pb-20 sm:pb-28">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ea580c_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-6">
              {/* Badge d'en-tête */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/20 text-orange-300 text-xs font-bold border border-orange-500/30 backdrop-blur-md animate-fade-in">
                <Sparkles className="w-4 h-4 text-orange-400" />
                <span>Plateforme SaaS Multi-Restaurants • Cameroun</span>
              </div>

              {/* Titre principal */}
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight sm:leading-none font-display">
                La solution SaaS n°1 pour booster la visibilité de votre restaurant
              </h1>

              {/* Sous-titre */}
              <p className="text-base sm:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
                Publiez votre menu du jour en 30 secondes, recevez des réservations directes sans aucune commission et fidélisez votre clientèle.
              </p>

              {/* Boutons CTA */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link
                  to="/inscription"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-sm shadow-xl shadow-orange-600/30 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <span>Créer mon restaurant (7 jours offerts)</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="#ecosysteme"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm backdrop-blur-md border border-white/20 transition-all cursor-pointer"
                >
                  <span>Découvrir la plateforme</span>
                </a>
              </div>

              {/* Badge essai gratuit */}
              <p className="text-xs text-orange-400 font-semibold pt-2 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                7 jours d'essai gratuit • Sans carte bancaire • 5 000 FCFA / mois
              </p>
            </div>

            {/* PRODUCT PREVIEW WIDGET (STITCH SAMPLE RESTAURANT) */}
            <div className="max-w-4xl mx-auto bg-slate-800/90 rounded-3xl p-3 sm:p-5 border border-white/10 shadow-2xl backdrop-blur-sm">
              <div className="bg-slate-900 rounded-2xl border border-slate-700 overflow-hidden shadow-inner p-4 sm:p-6 space-y-6">
                {/* Header Mockup */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-600 text-white font-black flex items-center justify-center text-sm shadow-md">
                      W
                    </div>
                    <div>
                      <h4 className="font-extrabold text-white text-base">Le Wouri Bistrot & Grill</h4>
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <span>Akwa, Douala</span> • <span className="text-amber-400 font-bold">4.9 ★ (128 avis)</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                      ● Ouvert • Menu actif
                    </span>
                  </div>
                </div>

                {/* Content preview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                  <div className="md:col-span-2 bg-slate-800/60 p-4 rounded-xl border border-slate-700/70 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-md bg-orange-500/20 text-orange-400 text-[11px] font-bold uppercase tracking-wider">
                        Spécialité du jour
                      </span>
                      <span className="text-xs text-slate-400">Servi de 11h30 à 15h00</span>
                    </div>
                    <h5 className="text-white font-extrabold text-lg">Ndolè Royal aux Crevettes & Plantains Frits</h5>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Ndolè frais préparé le matin même, crevettes sauvages sautées à l'ail, servi avec allocos dorés et miondo chaud.
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
                      <span className="text-xl font-black text-amber-400 tabular-nums">7 000 FCFA</span>
                      <span className="px-3 py-1.5 rounded-lg bg-orange-600 text-white font-bold text-xs">
                        Réserver ma table
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/70 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Entrée suggérée</span>
                      <h6 className="text-xs font-bold text-white">Salade de Papaye & Capitaine Fumé</h6>
                      <span className="text-xs font-bold text-amber-400 tabular-nums">3 500 FCFA</span>
                    </div>
                    <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/70 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Dessert maison</span>
                      <h6 className="text-xs font-bold text-white">Coupe Passion & Mangue Fraîche</h6>
                      <span className="text-xs font-bold text-amber-400 tabular-nums">2 500 FCFA</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= ECOSYSTÈME DOUBLE SECTION ================= */}
        <section id="ecosysteme" className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="px-3.5 py-1 rounded-full bg-orange-100 text-orange-900 text-xs font-bold uppercase tracking-wider">
              Une plateforme, deux espaces dédiés
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-display">
              Pensé pour les Restaurateurs et les Gourmets
            </h2>
            <p className="text-sm text-slate-600">
              Menu du Jour connecte directement les établissements de restauration avec les amoureux de bonne cuisine.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Carte Restaurateurs */}
            <div className="bg-white rounded-3xl p-8 border-2 border-orange-500/20 shadow-md space-y-6 flex flex-col justify-between hover:border-orange-500 transition-all">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-600 text-white flex items-center justify-center shadow-lg shadow-orange-600/20">
                  <Store className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 font-display">Espace Restaurateurs</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Gagnez du temps et augmentez votre taux d'occupation quotidien grâce à des outils simples et performants.
                </p>
                <ul className="space-y-2.5 text-xs text-slate-700 font-medium pt-2">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0" />
                    <span>Publication instantanée du Menu du Jour & Carte</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0" />
                    <span>Gestion des réservations en temps réel (WhatsApp / email)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0" />
                    <span>Abonnement fixe à 5 000 FCFA / mois (0 commission)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0" />
                    <span>Profil personnalisé et localisation Leaflet interactive</span>
                  </li>
                </ul>
              </div>
              <div className="pt-4">
                <Link
                  to="/inscription"
                  className="w-full py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs text-center block shadow-md transition-colors"
                >
                  Inscrire mon établissement
                </Link>
              </div>
            </div>

            {/* Carte Gourmets */}
            <div className="bg-white rounded-3xl p-8 border-2 border-slate-200 shadow-md space-y-6 flex flex-col justify-between hover:border-slate-400 transition-all">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg">
                  <Heart className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 font-display">Espace Clients & Gourmets</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Accédez gratuitement aux meilleurs repas frais autour de vous et réservez votre table sans intermédiaire.
                </p>
                <ul className="space-y-2.5 text-xs text-slate-700 font-medium pt-2">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Accès 100% gratuit à tous les menus du jour</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Réservation de table rapide sans enregistrement complexe</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Sauvegarde de vos restaurants favoris</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Alertes & notifications sur les nouveaux menus</span>
                  </li>
                </ul>
              </div>
              <div className="pt-4">
                <Link
                  to="/restaurants"
                  className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs text-center block shadow-md transition-colors"
                >
                  Explorer les restaurants
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ================= PRESENTATION SECTION ================= */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xs space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-100 text-orange-900 text-xs font-bold">
              <Store className="w-3.5 h-3.5" />
              {t.presentation.tag}
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight font-display">
              {t.presentation.title}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-600 leading-relaxed">
              <p className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                {t.presentation.text1}
              </p>
              <p className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                {t.presentation.text2}
              </p>
            </div>
          </div>
        </section>

        {/* ================= FONCTIONNALITÉS SECTION ================= */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="px-3.5 py-1 rounded-full bg-orange-100 text-orange-900 text-xs font-bold uppercase tracking-wider">
              {t.features.tag}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-display">
              {t.features.title}
            </h2>
            <p className="text-sm text-slate-600">{t.features.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.features.items.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all space-y-3 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                  {idx === 0 && <Store className="w-6 h-6" />}
                  {idx === 1 && <UtensilsCrossed className="w-6 h-6" />}
                  {idx === 2 && <Sparkles className="w-6 h-6" />}
                  {idx === 3 && <Heart className="w-6 h-6" />}
                  {idx === 4 && <Calendar className="w-6 h-6" />}
                  {idx === 5 && <BarChart3 className="w-6 h-6" />}
                </div>
                <h3 className="font-bold text-slate-900 text-base group-hover:text-orange-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= COMMENT ÇA MARCHE SECTION ================= */}
        <section id="comment-ca-marche" className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="px-3.5 py-1 rounded-full bg-slate-900 text-white text-xs font-bold uppercase tracking-wider">
              {t.howItWorks.tag}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-display">
              {t.howItWorks.title}
            </h2>
            <p className="text-sm text-slate-600">{t.howItWorks.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Côté restaurateur */}
            <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-xl border border-slate-800">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
                  <Store className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-black font-display">{t.howItWorks.restaurantTitle}</h3>
              </div>

              <div className="space-y-4">
                {t.howItWorks.restaurantSteps.map((s, idx) => (
                  <div key={idx} className="flex items-start gap-4 bg-slate-800/80 p-4 rounded-2xl border border-slate-700/60">
                    <span className="font-mono font-black text-orange-400 text-lg">{s.step}</span>
                    <div className="space-y-1 text-xs">
                      <h4 className="font-bold text-white text-sm">{s.title}</h4>
                      <p className="text-slate-300">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Côté client */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-6 shadow-xs">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                  <UserPlus className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-black text-slate-900 font-display">{t.howItWorks.clientTitle}</h3>
              </div>

              <div className="space-y-4">
                {t.howItWorks.clientSteps.map((s, idx) => (
                  <div key={idx} className="flex items-start gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <span className="font-mono font-black text-amber-600 text-lg">{s.step}</span>
                    <div className="space-y-1 text-xs">
                      <h4 className="font-bold text-slate-900 text-sm">{s.title}</h4>
                      <p className="text-slate-600">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ================= POURQUOI MENU DU JOUR SECTION ================= */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-r from-orange-600 to-amber-500 rounded-3xl p-8 sm:p-12 text-white shadow-xl shadow-orange-600/20 space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="px-3.5 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-md">
                {t.whyUs.tag}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight font-display">
                {t.whyUs.title}
              </h2>
              <p className="text-orange-100 text-sm">{t.whyUs.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {t.whyUs.reasons.map((r, idx) => (
                <div key={idx} className="bg-white/10 p-5 rounded-2xl backdrop-blur-md border border-white/20 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-white text-orange-600 flex items-center justify-center font-bold">
                    {idx === 0 && <Zap className="w-4 h-4" />}
                    {idx === 1 && <Clock className="w-4 h-4" />}
                    {idx === 2 && <ShieldCheck className="w-4 h-4 text-emerald-600" />}
                    {idx === 3 && <Smartphone className="w-4 h-4" />}
                  </div>
                  <h4 className="font-bold text-sm text-white">{r.title}</h4>
                  <p className="text-xs text-orange-100 leading-relaxed">{r.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= TARIFICATION SECTION ================= */}
        <section id="tarifs" className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              {t.pricing.tag}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-display">
              {t.pricing.title}
            </h2>
            <p className="text-sm text-slate-600">{t.pricing.subtitle}</p>
          </div>

          <div className="bg-white rounded-3xl border-2 border-orange-500 p-8 sm:p-10 shadow-xl space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-gradient-to-l from-orange-600 to-amber-500 text-white font-extrabold text-[11px] px-6 py-1.5 rounded-bl-2xl uppercase tracking-wider">
              {t.pricing.trialText}
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-black text-slate-900 font-display">{t.pricing.planName}</h3>
              <p className="text-xs text-slate-600">{t.pricing.trialDesc}</p>

              <div className="flex items-baseline gap-2 pt-2">
                <span className="text-4xl sm:text-5xl font-black text-slate-900 tabular-nums">5 000 FCFA</span>
                <span className="text-slate-500 font-bold text-sm">/ mois</span>
              </div>
            </div>

            <div className="space-y-3 border-t border-slate-100 pt-6">
              <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                {t.pricing.includesTitle}
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 font-medium">
                {t.pricing.features.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4">
              <Link
                to="/inscription"
                className="w-full py-4 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-sm text-center block shadow-lg shadow-orange-600/30 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                {t.pricing.cta}
              </Link>
            </div>
          </div>
        </section>

        {/* ================= FAQ SECTION ================= */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="px-3.5 py-1 rounded-full bg-slate-900 text-white text-xs font-bold uppercase tracking-wider">
              {t.faq.tag}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-display">
              {t.faq.title}
            </h2>
            <p className="text-sm text-slate-600">{t.faq.subtitle}</p>
          </div>

          <div className="space-y-3">
            {t.faq.items.map((item, idx) => {
              const isOpen = openFaq === idx
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-sm hover:text-orange-600 cursor-pointer"
                  >
                    <span>{item.q}</span>
                    {isOpen ? <ChevronUp className="w-5 h-5 text-orange-600 shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {item.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {/* ================= CTA FINAL SECTION ================= */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="bg-slate-900 rounded-3xl p-8 sm:p-14 text-white text-center space-y-6 shadow-2xl relative overflow-hidden border border-slate-800">
            <div className="space-y-3 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight font-display">
                {t.finalCta.title}
              </h2>
              <p className="text-slate-300 text-sm sm:text-base">{t.finalCta.subtitle}</p>
            </div>

            <div>
              <Link
                to="/inscription"
                className="inline-flex items-center gap-2 px-9 py-4 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-sm shadow-xl shadow-orange-600/30 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>{t.finalCta.cta}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <FloatingWhatsApp />
      <PublicFooter />
    </div>
  )
}
