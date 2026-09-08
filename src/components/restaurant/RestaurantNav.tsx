import React from 'react'
import { LayoutDashboard, Store, Clock, Utensils, Calendar, Users, CreditCard } from 'lucide-react'

export type TabType =
  | 'dashboard'
  | 'details'
  | 'hours'
  | 'menus'
  | 'reservations'
  | 'followers'
  | 'subscription'

interface RestaurantNavProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

export const RestaurantNav: React.FC<RestaurantNavProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: LayoutDashboard, comingSoon: false },
    { id: 'details' as TabType, label: 'Mon restaurant', icon: Store, comingSoon: false },
    { id: 'hours' as TabType, label: 'Horaires', icon: Clock, comingSoon: false },
    { id: 'subscription' as TabType, label: 'Abonnement', icon: CreditCard, comingSoon: false },
    { id: 'menus' as TabType, label: 'Mes menus', icon: Utensils, comingSoon: true },
    { id: 'reservations' as TabType, label: 'Réservations', icon: Calendar, comingSoon: true },
    { id: 'followers' as TabType, label: 'Personnes qui suivent', icon: Users, comingSoon: true },
  ]

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-1.5 shadow-xs overflow-x-auto">
      <nav className="flex items-center gap-1 min-w-max">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-orange-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.comingSoon && (
                <span className="px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-amber-100 text-amber-800 border border-amber-200">
                  Bientôt
                </span>
              )}
            </button>
          )
        })}
      </nav>
    </div>
  )
}
