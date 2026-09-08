import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '@/context/LanguageContext'
import { SeoHead } from '@/components/public/SeoHead'
import { PublicHeader } from '@/components/public/PublicHeader'
import { PublicFooter } from '@/components/public/PublicFooter'
import { FloatingWhatsApp } from '@/components/public/FloatingWhatsApp'
import { UtensilsCrossed, Target, Eye, ArrowRight } from 'lucide-react'

export const AboutPage: React.FC = () => {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      <SeoHead
        title={t.meta.about.title}
        description={t.meta.about.description}
        path="/a-propos"
      />

      <PublicHeader />

      <main className="flex-1 space-y-16 pb-16">
        {/* Banner Hero Page À Propos */}
        <section className="bg-gradient-to-b from-slate-900 to-slate-800 text-white py-16 sm:py-20 text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/20 text-orange-300 text-xs font-bold border border-orange-500/30">
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>SaaS Menu du Jour</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight">{t.aboutPage.title}</h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              {t.aboutPage.subtitle}
            </p>
          </div>
        </section>

        {/* Mission et Vision */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                <Target className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900">{t.aboutPage.missionTitle}</h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t.aboutPage.missionText}
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                <Eye className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900">{t.aboutPage.visionTitle}</h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t.aboutPage.visionText}
              </p>
            </div>
          </div>
        </section>

        {/* Valeurs Fondamentales */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t.aboutPage.valuesTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {t.aboutPage.values.map((v, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-orange-400 flex items-center justify-center font-bold text-xs">
                  0{idx + 1}
                </div>
                <h3 className="font-extrabold text-slate-900 text-base">{v.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to action */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="bg-gradient-to-r from-orange-600 to-amber-500 rounded-3xl p-8 sm:p-10 text-white space-y-4 shadow-lg">
            <h2 className="text-2xl sm:text-3xl font-extrabold">Rejoignez l'aventure Menu du Jour</h2>
            <p className="text-xs sm:text-sm text-orange-100 max-w-lg mx-auto">
              Inscrivez votre restaurant en 1 minute et profitez immédiatement de 7 jours d'essai gratuit.
            </p>
            <div className="pt-2">
              <Link
                to="/inscription"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-orange-600 hover:bg-orange-50 font-bold text-xs shadow-md transition-all"
              >
                <span>Commencer gratuitement</span>
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
