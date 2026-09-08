import React from 'react'
import { Header } from '@/components/Header'
import { useAuth } from '@/context/AuthContext'
import { ShieldCheck, Users, Store, Activity } from 'lucide-react'

export const AdminDashboardPage: React.FC = () => {
  const { profile } = useAuth()

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Banner Admin */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold backdrop-blur-md border border-purple-500/30">
              Espace Administrateur
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Console Administration — {profile?.full_name || 'Admin'}
          </h2>
          <p className="text-slate-300 text-sm mt-1 max-w-xl">
            Vision globale sur la plateforme Menu du Jour : utilisateurs, restaurants enregistrés, abonnements et performances.
          </p>
        </div>

        {/* Statistiques globales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Utilisateurs</h3>
            <p className="text-xs text-slate-500">
              Gestion globale des profils clients, gestionnaires et administrateurs.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              <Store className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Restaurants</h3>
            <p className="text-xs text-slate-500">
              Modération et vérification des fiches d'établissements.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Abonnements & Paiements</h3>
            <p className="text-xs text-slate-500">
              Suivi des essais gratuits, renouvellements et transactions LeekPay.
            </p>
          </div>
        </div>

        {/* Info profil */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            Privilèges d'accès
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 block font-medium">Nom</span>
              <span className="text-slate-900 font-semibold mt-0.5 block">{profile?.full_name || 'Admin'}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 block font-medium">Niveau d'accès</span>
              <span className="text-purple-700 font-semibold mt-0.5 block">Administrateur Global</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 block font-medium">Sécurité RLS</span>
              <span className="text-emerald-700 font-semibold mt-0.5 block">Active (is_admin = true)</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
