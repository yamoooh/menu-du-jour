import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage'
import { ClientDashboardPage } from '@/pages/ClientDashboardPage'
import { RestaurantDashboardPage } from '@/pages/RestaurantDashboardPage'
import { AdminDashboardPage } from '@/pages/AdminDashboardPage'
import { Header } from '@/components/Header'
import { StatusCard } from '@/components/StatusCard'
import { Smartphone, Database, ShieldCheck } from 'lucide-react'

// Page d'accueil / Landing
const HomePage = () => {
  const { user, profile, loading } = useAuth()

  // Si l'utilisateur est déjà connecté, le diriger automatiquement vers son espace
  if (!loading && user && profile) {
    if (profile.role === 'client') return <Navigate to="/espace-client" replace />
    if (profile.role === 'restaurant_manager') return <Navigate to="/espace-restaurant" replace />
    if (profile.role === 'admin') return <Navigate to="/admin" replace />
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
        {/* Banner principal */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 border border-orange-200">
            <ShieldCheck className="w-3.5 h-3.5 text-orange-600" />
            Étape 2 : Authentification & Gestion des Rôles Opérationnelle
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Menu du Jour
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Plateforme PWA reliant les restaurants et leurs clients. Connectez-vous ou créez votre compte pour commencer.
          </p>
        </div>

        {/* Status des composants */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <StatusCard
            title="Authentification Supabase"
            subtitle="Auth & Profils"
            icon={ShieldCheck}
            status="ready"
            statusLabel="Fonctionnel"
            details={[
              'Supabase Auth connecté',
              'Trigger handle_new_user actif',
              'Gestion des profils synchronisée',
            ]}
          />

          <StatusCard
            title="Gestion des Rôles"
            subtitle="Client, Manager & Admin"
            icon={Database}
            status="ready"
            statusLabel="Fonctionnel"
            details={[
              'Rôle Client (client)',
              'Rôle Restaurateur (restaurant_manager)',
              'Rôle Admin (admin)',
            ]}
          />

          <StatusCard
            title="PWA & Stack Web"
            subtitle="React 19, TS & Tailwind v4"
            icon={Smartphone}
            status="ready"
            statusLabel="Opérationnel"
            details={[
              'Vite 8 & TypeScript strict',
              'Tailwind CSS v4',
              'Manifest & SW configurés',
            ]}
          />
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Menu du Jour — Plateforme PWA</p>
          <div className="flex items-center gap-4">
            <span>Supabase Auth</span>
            <span>•</span>
            <span>React Router</span>
            <span>•</span>
            <span>RLS Active</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/connexion" element={<LoginPage />} />
          <Route path="/inscription" element={<RegisterPage />} />
          <Route path="/mot-de-passe-oublie" element={<ForgotPasswordPage />} />

          {/* Protected Routes by Role */}
          <Route
            path="/espace-client"
            element={
              <ProtectedRoute allowedRoles={['client']}>
                <ClientDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/espace-restaurant"
            element={
              <ProtectedRoute allowedRoles={['restaurant_manager']}>
                <RestaurantDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
