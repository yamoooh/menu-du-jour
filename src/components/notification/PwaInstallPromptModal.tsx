import React, { useState, useEffect } from 'react'
import { Download, X, Smartphone, Sparkles, CheckCircle2, Share } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export const PwaInstallPromptModal: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isIos, setIsIos] = useState(false)

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà fermé la popup récemment (7 jours)
    const dismissedAt = localStorage.getItem('pwa_prompt_dismissed_at')
    if (dismissedAt) {
      const daysSinceDismissed = (Date.now() - parseInt(dismissedAt, 10)) / (1000 * 60 * 60 * 24)
      if (daysSinceDismissed < 7) return
    }

    // Détecter iOS
    const userAgent = window.navigator.userAgent.toLowerCase()
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent)
    setIsIos(isIosDevice)

    // Écouter l'événement natif avant installation (Android/Chrome/Edge)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)

      // Afficher l'invitation avec un léger délai élégant (3s)
      setTimeout(() => {
        setIsVisible(true)
      }, 3000)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Si iOS et pas encore en mode standalone (PWA non installée)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    if (isIosDevice && !isStandalone) {
      setTimeout(() => {
        setIsVisible(true)
      }, 4000)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const choice = await deferredPrompt.userChoice
    if (choice.outcome === 'accepted') {
      setIsVisible(false)
    }
    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    setIsVisible(false)
    localStorage.setItem('pwa_prompt_dismissed_at', Date.now().toString())
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-5 right-5 left-5 sm:left-auto sm:w-96 z-50 animate-bounce-short">
      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-2xl border border-slate-800 space-y-4 relative">
        {/* Bouton fermer */}
        <button
          onClick={handleDismiss}
          className="absolute top-3.5 right-3.5 text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shrink-0 shadow-md">
            <Smartphone className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-orange-400 font-bold text-[11px] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Application PWA</span>
            </div>
            <h4 className="font-extrabold text-white text-sm">
              Installer Menu du Jour
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Consultez les menus et réservez en 1 clic directement depuis votre écran d'accueil.
            </p>
          </div>
        </div>

        {/* Avantages */}
        <div className="space-y-1.5 text-[11px] text-slate-300 bg-slate-800/80 p-3 rounded-xl border border-slate-700/80">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Accès instantané sans téléchargement lourd</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Consultation rapide même avec réseau faible</span>
          </div>
        </div>

        {/* Action ou instructions selon l'OS */}
        {deferredPrompt ? (
          <button
            onClick={handleInstallClick}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Installer sur mon téléphone
          </button>
        ) : isIos ? (
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200 flex items-center gap-2">
            <Share className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Sur iOS : Appuyez sur <strong>Partager</strong> ➔ <strong>Sur l'écran d'accueil</strong></span>
          </div>
        ) : (
          <button
            onClick={handleDismiss}
            className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
          >
            Compris !
          </button>
        )}
      </div>
    </div>
  )
}
