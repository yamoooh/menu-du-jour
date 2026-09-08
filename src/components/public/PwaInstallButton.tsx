import React, { useEffect, useState } from 'react'
import { Download } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

export const PwaInstallButton: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { t } = useLanguage()
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert('L\'application PWA peut être installée via le menu de votre navigateur (Chrome, Safari, Edge).')
      return
    }

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setDeferredPrompt(null)
    }
  }

  return (
    <button
      onClick={handleInstallClick}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-bold transition-all border border-orange-200 cursor-pointer ${className}`}
    >
      <Download className="w-4 h-4 text-orange-600" />
      <span>{t.nav.pwaInstall}</span>
    </button>
  )
}
