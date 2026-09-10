import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '@/context/LanguageContext'
import { PwaInstallButton } from '@/components/public/PwaInstallButton'
import { WHATSAPP_NUMBER, WHATSAPP_URL } from '@/components/public/FloatingWhatsApp'
import { MessageCircle, Shield, Globe } from 'lucide-react'
import { Logo } from '@/components/common/Logo'

export const PublicFooter: React.FC = () => {
  const { t, language, setLanguage } = useLanguage()

  return (
    <footer className="border-t border-slate-800 bg-slate-900 text-slate-300 pt-12 pb-8">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Colonne 1 : Brand & Description */}
          <div className="space-y-4 md:col-span-1">
            <Logo lightMode={true} size="md" />
            <p className="text-xs text-slate-400 leading-relaxed">
              La solution digitale complète permettant aux restaurants de publier leurs menus quotidiens et de gérer leurs réservations en ligne sans commission.
            </p>
            <PwaInstallButton />
          </div>

          {/* Colonne 2 : Navigation */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-orange-400 transition-colors">
                  {t.nav.home}
                </Link>
              </li>
              <li>
                <Link to="/a-propos" className="hover:text-orange-400 transition-colors">
                  {t.nav.about}
                </Link>
              </li>
              <li>
                <Link to="/engagez-nous" className="hover:text-orange-400 transition-colors">
                  {t.nav.engage}
                </Link>
              </li>
              <li>
                <Link to="/tarifs" className="hover:text-orange-400 transition-colors">
                  {t.nav.pricing}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-orange-400 transition-colors">
                  {t.nav.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 3 : Espace Membres & Inscription */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">
              Accès Plateforme
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/connexion" className="hover:text-orange-400 transition-colors">
                  {t.nav.signIn}
                </Link>
              </li>
              <li>
                <Link to="/inscription" className="hover:text-orange-400 transition-colors">
                  {t.nav.signUp}
                </Link>
              </li>
              <li>
                <Link to="/inscription" className="text-orange-400 hover:underline font-bold">
                  {t.nav.startFree}
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 4 : Assistance & Contact */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">
              Support Officiel
            </h4>
            <div className="space-y-2 text-xs">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-emerald-400 font-bold hover:underline"
              >
                <MessageCircle className="w-4 h-4 fill-emerald-400 text-slate-900" />
                <span>WhatsApp : {WHATSAPP_NUMBER}</span>
              </a>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Notre équipe est disponible sur WhatsApp pour accompagner les restaurants dans leur inscription.
              </p>
            </div>

            {/* Sélecteur de Langue Footer */}
            <div className="pt-2 flex items-center gap-2 text-xs">
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-slate-400 text-[11px]">Langue :</span>
              <button
                onClick={() => setLanguage('fr')}
                className={`font-bold ${language === 'fr' ? 'text-orange-400 underline' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Français
              </button>
              <span className="text-slate-600">•</span>
              <button
                onClick={() => setLanguage('en')}
                className={`font-bold ${language === 'en' ? 'text-orange-400 underline' : 'text-slate-500 hover:text-slate-300'}`}
              >
                English
              </button>
            </div>
          </div>
        </div>

        {/* Ligne inférieure & Copyright */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Menu du Jour. Tous droits réservés. Plateforme SaaS PWA.</p>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-slate-400">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              Paiements & Données Sécurisés
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
