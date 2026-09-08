import React, { useEffect, useState } from 'react'
import { Header } from '@/components/Header'
import { useAuth } from '@/context/AuthContext'
import { restaurantService } from '@/services/restaurantService'
import type { Restaurant } from '@/types/restaurant.types'
import { ClientReservationsList } from '@/components/reservation/ClientReservationsList'
import { ReservationModal } from '@/components/reservation/ReservationModal'
import { UserCheck, Heart, Calendar, Bell, UtensilsCrossed } from 'lucide-react'

export const ClientDashboardPage: React.FC = () => {
  const { profile } = useAuth()
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  useEffect(() => {
    restaurantService.fetchActiveRestaurants().then((res) => {
      if (res.data) setRestaurants(res.data)
    })
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Banner de bienvenue */}
        <div className="bg-gradient-to-r from-orange-600 to-amber-500 rounded-2xl p-6 sm:p-8 text-white shadow-lg shadow-orange-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-md">
                Espace Client
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Bienvenue, {profile?.full_name || 'Cher client'} !
            </h2>
            <p className="text-orange-100 text-sm mt-1 max-w-xl">
              Découvrez les menus du jour des restaurants de votre région, gérez vos réservations et consultez vos établissements suivis.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-orange-600 hover:bg-orange-50 font-bold text-xs shadow-md transition-all cursor-pointer shrink-0"
          >
            <UtensilsCrossed className="w-4 h-4" />
            Réserver une table
          </button>
        </div>

        {/* Section rapide */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Restaurants suivis</h3>
            <p className="text-xs text-slate-500">
              Retrouvez la liste des établissements que vous suivez pour ne manquer aucun nouveau menu.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Mes Réservations</h3>
            <p className="text-xs text-slate-500">
              Suivez l'état de vos demandes de réservation et consultez votre historique.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              <Bell className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Notifications</h3>
            <p className="text-xs text-slate-500">
              Soyez alerté en temps réel dès qu'un restaurant suivi publie son menu du jour.
            </p>
          </div>
        </div>

        {/* Liste des réservations client */}
        <ClientReservationsList onOpenReservationModal={() => setIsModalOpen(true)} />

        {/* Info profil */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-orange-600" />
            Vos informations de profil
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 block font-medium">Nom complet</span>
              <span className="text-slate-900 font-semibold mt-0.5 block">
                {profile?.full_name || 'Non renseigné'}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 block font-medium">Téléphone</span>
              <span className="text-slate-900 font-semibold mt-0.5 block">
                {profile?.phone || 'Non renseigné'}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 block font-medium">Rôle d'accès</span>
              <span className="text-emerald-700 font-semibold mt-0.5 block">Client</span>
            </div>
          </div>
        </div>

        {/* Modal de réservation */}
        <ReservationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          restaurants={restaurants}
        />
      </main>
    </div>
  )
}
