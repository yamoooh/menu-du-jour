import React from 'react'
import { BellRing, Info } from 'lucide-react'

export const PushSubscriptionToggle: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-2xl bg-orange-100 text-orange-600 shrink-0">
          <BellRing className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="font-bold text-base text-slate-900">Notifications Push PWA</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Recevez les alertes instantanées de nouveaux menus et les confirmations de réservation sur votre appareil.
          </p>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-start gap-3">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block">Fonctionnalité en cours de préparation</span>
          <span className="text-blue-700 leading-relaxed block mt-0.5">
            Les notifications push en arrière-plan seront activées prochainement lors d'une mise à jour de la plateforme. En attendant, consultez vos notifications directement depuis cet espace.
          </span>
        </div>
      </div>
    </div>
  )
}