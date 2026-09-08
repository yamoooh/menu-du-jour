import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '@/context/LanguageContext'
import { SeoHead } from '@/components/public/SeoHead'
import { PublicHeader } from '@/components/public/PublicHeader'
import { PublicFooter } from '@/components/public/PublicFooter'
import { FloatingWhatsApp } from '@/components/public/FloatingWhatsApp'
import { CheckCircle2, ShieldCheck, CreditCard } from 'lucide-react'

export const PricingPage: React.FC = () => {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      <SeoHead
        title={t.meta.pricing.title}
        description={t.meta.pricing.description}
        path="/tarifs"
      />

      <PublicHeader />

      <main className="flex-1 space-y-16 pb-16">
        {/* Hero Tarifs */}
        <section className="bg-gradient-to-b from-slate-900 to-slate-800 text-white py-16 sm:py-20 text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <CreditCard className="w-3.5 h-3.5" />
              <span>{t.pricing.tag}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight">{t.pricing.title}</h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              {t.pricing.subtitle}
            </p>
          </div>
        </section>

        {/* Carte de tarification */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl border-2 border-orange-500 p-8 sm:p-12 shadow-2xl space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-gradient-to-l from-orange-600 to-amber-500 text-white font-extrabold text-xs px-6 py-2 rounded-bl-2xl uppercase tracking-wider">
              {t.pricing.trialText}
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">{t.pricing.planName}</h2>
              <p className="text-xs sm:text-sm text-slate-600">{t.pricing.trialDesc}</p>

              <div className="flex items-baseline gap-2 pt-4">
                <span className="text-4xl sm:text-6xl font-black text-slate-900">{t.pricing.price}</span>
                <span className="text-slate-500 font-bold text-base">{t.pricing.period}</span>
              </div>
            </div>

            <div className="space-y-4 border-t border-slate-100 pt-6">
              <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                {t.pricing.includesTitle}
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-700 font-medium">
                {t.pricing.features.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4">
              <Link
                to="/inscription"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-extrabold text-sm text-center block shadow-lg shadow-orange-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                {t.pricing.cta}
              </Link>
            </div>
          </div>
        </section>

        {/* Garanties */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-around gap-4 text-xs font-semibold text-slate-700">
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              7 jours offerts sans carte bancaire
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Sans aucun engagement de durée
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Zéro commission sur vos réservations
            </span>
          </div>
        </section>
      </main>

      <FloatingWhatsApp />
      <PublicFooter />
    </div>
  )
}
