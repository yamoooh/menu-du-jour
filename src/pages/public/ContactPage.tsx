import React, { useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { SeoHead } from '@/components/public/SeoHead'
import { PublicHeader } from '@/components/public/PublicHeader'
import { PublicFooter } from '@/components/public/PublicFooter'
import { FloatingWhatsApp, WHATSAPP_NUMBER, WHATSAPP_URL } from '@/components/public/FloatingWhatsApp'
import { Mail, MessageCircle, Send, CheckCircle2, Phone } from 'lucide-react'

export const ContactPage: React.FC = () => {
  const { t } = useLanguage()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !message) return
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      <SeoHead
        title={t.meta.contact.title}
        description={t.meta.contact.description}
        path="/contact"
      />

      <PublicHeader />

      <main className="flex-1 space-y-16 pb-16">
        {/* Hero Contact */}
        <section className="bg-gradient-to-b from-slate-900 to-slate-800 text-white py-16 sm:py-20 text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/20 text-orange-300 text-xs font-bold border border-orange-500/30">
              <Mail className="w-3.5 h-3.5" />
              <span>Contact & Support</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight">{t.contactPage.title}</h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              {t.contactPage.subtitle}
            </p>
          </div>
        </section>

        {/* Formulaire & WhatsApp */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Formulaire de contact */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <Mail className="w-5 h-5 text-orange-600" />
                {t.contactPage.formTitle}
              </h2>

              {submitted ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <p className="text-xs sm:text-sm font-bold text-emerald-900">
                    {t.contactPage.successMessage}
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false)
                      setName('')
                      setEmail('')
                      setSubject('')
                      setMessage('')
                    }}
                    className="text-xs font-bold text-emerald-700 underline"
                  >
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 block">{t.contactPage.nameLabel}</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Jean Dupont"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 block">{t.contactPage.emailLabel}</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="jean@exemple.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 block">{t.contactPage.subjectLabel}</label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Demande d'informations"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 block">{t.contactPage.messageLabel}</label>
                    <textarea
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      placeholder="Expliquez-nous votre besoin..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{t.contactPage.sendButton}</span>
                  </button>
                </form>
              )}
            </div>

            {/* Assistance WhatsApp officielle */}
            <div className="bg-gradient-to-br from-emerald-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-md flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <MessageCircle className="w-6 h-6 fill-emerald-400 text-emerald-950" />
                </div>
                <h2 className="text-xl font-extrabold">{t.contactPage.whatsappTitle}</h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {t.contactPage.whatsappDesc}
                </p>
                <div className="p-4 bg-emerald-900/40 rounded-2xl border border-emerald-500/30 text-emerald-200 text-xs font-mono font-bold flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>{WHATSAPP_NUMBER}</span>
                </div>
              </div>

              <div>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs text-center block shadow-lg shadow-emerald-600/30 transition-all"
                >
                  {t.contactPage.whatsappButton}
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <FloatingWhatsApp />
      <PublicFooter />
    </div>
  )
}
