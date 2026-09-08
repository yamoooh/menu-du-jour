import {
  Code2,
  Paintbrush,
  Smartphone,
  GitBranch,
  Database,
  CheckCircle2,
  Clock,
} from 'lucide-react'
import { Header } from '@/components/Header'
import { StatusCard } from '@/components/StatusCard'
import { isSupabaseConfigured } from '@/lib/supabase'

export const App = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
        {/* Section Titre / Présentation */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 border border-orange-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-orange-600" />
            Socle technique initialisé avec succès
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Menu du Jour
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Application Web Progressive (PWA) prête pour le développement des fonctionnalités restaurant et client.
          </p>
        </div>

        {/* Grille des briques techniques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <StatusCard
            title="React 19 & TypeScript"
            subtitle="Moteur applicatif moderne"
            icon={Code2}
            status="ready"
            statusLabel="Opérationnel"
            details={[
              'Vite 8 & TypeScript 6',
              'Typage strict activé',
              'Alias de chemins @/ configuré',
            ]}
          />

          <StatusCard
            title="Tailwind CSS"
            subtitle="Design system réactif"
            icon={Paintbrush}
            status="ready"
            statusLabel="Opérationnel"
            details={[
              'Tailwind CSS v4 intégré',
              'Classes utilitaires prêtes',
              'Palette gourmande (orange & ambre)',
            ]}
          />

          <StatusCard
            title="PWA & Offline"
            subtitle="Expérience mobile native"
            icon={Smartphone}
            status="ready"
            statusLabel="Opérationnel"
            details={[
              'Manifest Web App configuré',
              'Icônes adaptatives 192px & 512px',
              'Service Worker & Cache automatique',
            ]}
          />

          <StatusCard
            title="Dépôt GitHub"
            subtitle="Gestion de versions"
            icon={GitBranch}
            status="ready"
            statusLabel="Prêt à connecter"
            details={[
              'Git local initialisé',
              '.gitignore sécurisé (.env exclu)',
              'Commit initial prêt',
            ]}
          />

          <StatusCard
            title="Supabase"
            subtitle="Backend & Base de données"
            icon={Database}
            status={isSupabaseConfigured ? 'ready' : 'pending'}
            statusLabel={isSupabaseConfigured ? 'Connecté' : 'En attente de clés'}
            details={[
              'Client Supabase préparé (src/lib/supabase.ts)',
              '.env.example pré-rempli',
              'Aucune table ni auth créée (étape suivante)',
            ]}
          />
        </div>

        {/* Section Prochaines étapes */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Prochaines étapes recommandées
              </h3>
              <p className="text-xs text-slate-500">
                Préparation préalable avant le développement des fonctionnalités métier
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/60 space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-800 text-white text-xs font-bold">
                  1
                </span>
                Lier à GitHub
              </div>
              <p className="text-xs text-slate-600">
                Créer le dépôt distant sur GitHub et synchroniser avec :
              </p>
              <code className="block text-xs bg-slate-900 text-slate-100 p-2.5 rounded-lg overflow-x-auto font-mono">
                git remote add origin https://github.com/votre-compte/menu-du-jour.git
              </code>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/60 space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-800 text-white text-xs font-bold">
                  2
                </span>
                Connecter Supabase
              </div>
              <p className="text-xs text-slate-600">
                Créer un nouveau projet sur Supabase et renseigner les variables dans le fichier <code className="text-orange-600">.env</code> :
              </p>
              <code className="block text-xs bg-slate-900 text-slate-100 p-2.5 rounded-lg overflow-x-auto font-mono">
                VITE_SUPABASE_URL=...<br />
                VITE_SUPABASE_ANON_KEY=...
              </code>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Menu du Jour — Plateforme PWA</p>
          <div className="flex items-center gap-4">
            <span>React + TypeScript</span>
            <span>•</span>
            <span>Tailwind CSS</span>
            <span>•</span>
            <span>Vite PWA</span>
            <span>•</span>
            <span>Supabase Ready</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
