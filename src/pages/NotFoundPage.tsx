import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '@/context/LanguageContext'
import { SeoHead } from '@/components/public/SeoHead'
import { PublicHeader } from '@/components/public/PublicHeader'
import { PublicFooter } from '@/components/public/PublicFooter'
import { FloatingWhatsApp } from '@/components/public/FloatingWhatsApp'
import { AlertTriangle, ArrowLeft } from 'lucide-react'

export const NotFoundPage: React.FC = () => {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      <SeoHead
        title={t.notFound.title}
        description={t.notFound.subtitle}
      />

      <PublicHeader />

      <main className="flex-1 flex items-center justify-center p-6 py-20">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center space-y-6 shadow-xl max-w-md w-full">
          <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-600 mx-auto flex items-center justify-center font-bold">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">{t.notFound.title}</h1>
            <p className="text-xs text-slate-500 leading-relaxed">{t.notFound.subtitle}</p>
          </div>

          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.notFound.backHome}</span>
            </Link>
          </div>
        </div>
      </main>

      <FloatingWhatsApp />
      <PublicFooter />
    </div>
  )
}
