import React from 'react'
import { Header } from '@/components/Header'
import { useAuth } from '@/context/AuthContext'
import { Store, Utensils, CalendarCheck, CreditCard } from 'lucide-react'

export const RestaurantDashboardPage: React.FC = () => {
  const { profile } = useAuth()

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Banner de bienvenue */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-orange-950 rounded-2xl p-6 sm:p-8 text-white shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 text-xs font-semibold backdrop-blur-md border border-orange-500/30">
              Espace Gestionnaire
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Espace Professionnel — {profile?.full_name || 'Restaurateur'}
          </h2>
          <p className="text-slate-300 text-sm mt-1 max-w-xl">
            Gérez la fiche de votre restaurant, publiez vos menus du jour, consultez vos réservations et suivez votre statut d'abonnement.
          </p>
        </div>

        {/* Briques principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
              <Utensils className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Menus du Jour</h3>
            <p className="text-xs text-slate-500">
              Publiez vos plats, tarifs et photos du jour en quelques clics.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Réservations</h3>
            <p className="text-xs text-slate-500">
              Traitez et validez les demandes de réservation reçues de vos clients.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Abonnement LeekPay</h3>
            <p className="text-xs text-slate-500">
              7 jours d'essai gratuit puis 5 000 FCFA / 30 jours. Conservez l'accès à vos fonctions pro.
            </p>
          </div>
        </div>

        {/* Fiche Profil */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Store className="w-4 h-4 text-orange-600" />
            Profil Gestionnaire
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 block font-medium">Gestionnaire</span>
              <span className="text-slate-900 font-semibold mt-0.5 block">{profile?.full_name || 'Non renseigné'}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 block font-medium">Téléphone pro</span>
              <span className="text-slate-900 font-semibold mt-0.5 block">{profile?.phone || 'Non renseigné'}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 block font-medium">Statut du compte</span>
              <span className="text-orange-700 font-semibold mt-0.5 block">Gestionnaire de restaurant</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
