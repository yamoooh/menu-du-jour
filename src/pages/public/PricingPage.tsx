import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '@/context/LanguageContext'
import { SeoHead } from '@/components/public/SeoHead'
import { PublicHeader } from '@/components/public/PublicHeader'
import { PublicFooter } from '@/components/public/PublicFooter'
import { FloatingWhatsApp } from '@/components/public/FloatingWhatsApp'
import { CheckCircle2, ShieldCheck, CreditCard, Store, Heart, ChevronDown, ChevronUp } from 'lucide-react'

export const PricingPage: React.FC = () => {
  const { t } = useLanguage()
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      <SeoHead
        title={t.meta.pricing.title}
        description={t.meta.pricing.description}
        path="/tarifs"
      />

      <PublicHeader />

      <main className="flex-1 space-y-16 pb-16">
        {/* ================= HERO TARIFS ================= */}
        <section className="bg-slate-900 text-white py-16 sm:py-24 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ea580c_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl" />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/20 text-orange-300 text-xs font-bold border border-orange-500/30 backdrop-blur-md">
              <CreditCard className="w-4 h-4 text-orange-400" />
              <span>{t.pricing.tag}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight font-display">
              Des tarifs simples, transparents et sans aucune commission
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Gratuit pour tous les gourmets. Un tarif fixe et abordable pour les établissements de restauration au Cameroun.
            </p>

            {/* Sélecteur de fréquence Mensuel / Annuel */}
            <div className="inline-flex items-center p-1.5 rounded-2xl bg-slate-800 border border-slate-700 shadow-inner gap-2 pt-2">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  billingCycle === 'monthly'
                    ? 'bg-orange-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Facturation Mensuelle
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('annual')}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  billingCycle === 'annual'
                    ? 'bg-orange-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Facturation Annuelle</span>
                <span className="px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black text-[10px] uppercase">
                  -10 000 FCFA
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* ================= CARTES DES OFFRES (DOUBLE ECOSYSTÈME STITCH) ================= */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Offre Restaurant */}
            <div className="bg-white rounded-3xl border-2 border-orange-500 p-8 sm:p-10 shadow-xl space-y-8 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 bg-gradient-to-l from-orange-600 to-amber-500 text-white font-extrabold text-[11px] px-6 py-1.5 rounded-bl-2xl uppercase tracking-wider">
                7 jours d'essai offerts
              </div>

              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                  <Store className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 font-display">Offre Restaurateur</h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Pour tous les restaurants, bistros, traiteurs et maquis souhaitant publier leur menu du jour et recevoir des réservations.
                </p>

                {billingCycle === 'monthly' ? (
                  <div className="flex items-baseline gap-2 pt-2">
                    <span className="text-4xl sm:text-5xl font-black text-slate-900 tabular-nums font-display">
                      5 000 FCFA
                    </span>
                    <span className="text-slate-500 font-bold text-sm">/ 30 jours</span>
                  </div>
                ) : (
                  <div className="space-y-1 pt-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl sm:text-5xl font-black text-slate-900 tabular-nums font-display">
                        50 000 FCFA
                      </span>
                      <span className="text-slate-500 font-bold text-sm">/ an</span>
                    </div>
                    <p className="text-xs text-emerald-600 font-bold">
                      💡 Vous économisez 10 000 FCFA par an (soit 2 mois offerts)
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-3 border-t border-slate-100 pt-6">
                <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                  Tout ce qui est inclus :
                </h3>
                <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
                  {t.pricing.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2.5">
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
                  Créer mon compte restaurant (7 jours offerts)
                </Link>
              </div>
            </div>

            {/* Offre Client / Gourmet */}
            <div className="bg-white rounded-3xl border-2 border-slate-200 p-8 sm:p-10 shadow-md space-y-8 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold">
                  <Heart className="w-6 h-6 text-amber-400" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 font-display">Espace Gourmet & Client</h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Accédez gratuitement à tous les menus du jour au Cameroun et réservez votre table en quelques clics sans intermédiaire.
                </p>

                <div className="flex items-baseline gap-2 pt-2">
                  <span className="text-4xl sm:text-5xl font-black text-slate-900 tabular-nums font-display">
                    0 FCFA
                  </span>
                  <span className="text-slate-500 font-bold text-sm">/ Gratuit à vie</span>
                </div>
              </div>

              <div className="space-y-3 border-t border-slate-100 pt-6">
                <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                  Avantages clients gratuits :
                </h3>
                <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Accès illimité et gratuit à tous les menus du jour</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Réservations de tables instantanées sans frais</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Suivi illimité de vos restaurants favoris</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Localisation interactive Leaflet et itinéraire Google Maps</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Notifications sur la parution des nouveaux menus</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4">
                <Link
                  to="/inscription"
                  className="w-full py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm text-center block shadow-md transition-all cursor-pointer"
                >
                  S'inscrire comme Gourmet (Gratuit)
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ================= GARANTIES & RASSURANCE ================= */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-xs font-bold text-slate-700">
            <div className="flex flex-col items-center gap-2 p-2">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
              <span>7 jours offerts sans carte bancaire</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-2">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
              <span>Sans aucun engagement ni reconduction forcée</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-2">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
              <span>Zéro commission sur vos réservations</span>
            </div>
          </div>
        </section>

        {/* ================= FAQ TARIFS ================= */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-3xl font-black text-slate-900 font-display">
              {t.faq.title}
            </h2>
            <p className="text-xs text-slate-600">{t.faq.subtitle}</p>
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
      </main>

      <FloatingWhatsApp />
      <PublicFooter />
    </div>
  )
}
