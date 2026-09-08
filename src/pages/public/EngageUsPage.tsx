import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '@/context/LanguageContext'
import { SeoHead } from '@/components/public/SeoHead'
import { PublicHeader } from '@/components/public/PublicHeader'
import { PublicFooter } from '@/components/public/PublicFooter'
import { FloatingWhatsApp, WHATSAPP_URL } from '@/components/public/FloatingWhatsApp'
import { Store, ArrowRight, MessageCircle, ShieldCheck } from 'lucide-react'

export const EngageUsPage: React.FC = () => {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      <SeoHead
        title={t.meta.engage.title}
        description={t.meta.engage.description}
        path="/engagez-nous"
      />

      <PublicHeader />

      <main className="flex-1 space-y-16 pb-16">
        {/* Hero Engagez-nous */}
        <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-orange-950 text-white py-16 sm:py-24 text-center relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/20 text-orange-300 text-xs font-bold border border-orange-500/30">
              <Store className="w-3.5 h-3.5" />
              <span>Pour les Restaurateurs</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              {t.engagePage.title}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              {t.engagePage.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/inscription"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-extrabold text-sm shadow-xl shadow-orange-500/25 transition-all"
              >
                <span>{t.engagePage.ctaPrimary}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
                <span>{t.engagePage.ctaSecondary}</span>
              </a>
            </div>
          </div>
        </section>

        {/* Avantages Restaurateurs */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t.engagePage.whyTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {t.engagePage.benefits.map((b, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-base">{b.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Étapes d'intégration */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-sm space-y-6">
            <h2 className="text-2xl font-extrabold text-slate-900 text-center">
              {t.engagePage.stepsTitle}
            </h2>

            <div className="space-y-4">
              {t.engagePage.steps.map((stepText, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="w-8 h-8 rounded-xl bg-slate-900 text-orange-400 font-mono font-black text-sm flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium pt-1">
                    {stepText}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-4 text-center">
              <Link
                to="/inscription"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-sm shadow-md transition-all"
              >
                <span>Commencer mon essai gratuit 7 jours</span>
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
