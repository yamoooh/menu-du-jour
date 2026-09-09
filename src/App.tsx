import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { LanguageProvider } from '@/context/LanguageContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { HomePage } from '@/pages/public/HomePage'
import { AboutPage } from '@/pages/public/AboutPage'
import { EngageUsPage } from '@/pages/public/EngageUsPage'
import { PricingPage } from '@/pages/public/PricingPage'
import { ContactPage } from '@/pages/public/ContactPage'
import { ClientDiscoveryPage } from '@/pages/ClientDiscoveryPage'
import { RestaurantDetailPage } from '@/pages/RestaurantDetailPage'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage'
import { AuthCallbackPage } from '@/pages/AuthCallbackPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

// Lazy Loading des espaces de gestion lourds pour optimiser la taille du bundle principal
const ClientDashboardPage = lazy(() =>
  import('@/pages/ClientDashboardPage').then((m) => ({ default: m.ClientDashboardPage }))
)
const RestaurantDashboardPage = lazy(() =>
  import('@/pages/RestaurantDashboardPage').then((m) => ({ default: m.RestaurantDashboardPage }))
)
const AdminDashboardPage = lazy(() =>
  import('@/pages/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage }))
)

const PageFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin" />
  </div>
)

export const App = () => {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <Suspense fallback={<PageFallback />}>
            <Routes>
              {/* Public SaaS Pages */}
              <Route path="/" element={<HomePage />} />
              <Route path="/a-propos" element={<AboutPage />} />
              <Route path="/engagez-nous" element={<EngageUsPage />} />
              <Route path="/tarifs" element={<PricingPage />} />
              <Route path="/contact" element={<ContactPage />} />

              {/* Public Discovery & Restaurant Pages */}
              <Route path="/decouvrir" element={<ClientDiscoveryPage />} />
              <Route path="/restaurants/:slug" element={<RestaurantDetailPage />} />

              {/* Authentication Pages */}
              <Route path="/connexion" element={<LoginPage />} />
              <Route path="/inscription" element={<RegisterPage />} />
              <Route path="/mot-de-passe-oublie" element={<ForgotPasswordPage />} />
              <Route path="/auth/callback" element={<AuthCallbackPage />} />

              {/* Protected Routes by Role */}
              <Route
                path="/espace-client/*"
                element={
                  <ProtectedRoute allowedRoles={['client']}>
                    <ClientDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/espace-restaurant/*"
                element={
                  <ProtectedRoute allowedRoles={['restaurant_manager']}>
                    <RestaurantDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                }
              />

              {/* 404 Catch-all */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  )
}

export default App
