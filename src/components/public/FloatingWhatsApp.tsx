import React from 'react'
import { MessageCircle } from 'lucide-react'

export const WHATSAPP_NUMBER = '+237 658 35 21 29'
export const WHATSAPP_URL = 'https://wa.me/237658352129'

export const FloatingWhatsApp: React.FC = () => {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Discuter avec l'équipe Menu du Jour sur WhatsApp"
      className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 hover:scale-105 transition-all cursor-pointer group"
    >
      <MessageCircle className="w-5 h-5 fill-white text-emerald-600 group-hover:rotate-12 transition-transform" />
      <span className="hidden sm:inline">WhatsApp Support</span>
    </a>
  )
}
