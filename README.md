# 🍽️ Menu du Jour — Plateforme Web PWA

Application Web Progressive (PWA) permettant aux restaurateurs de publier leurs menus du jour et aux clients de les consulter en temps réel, de façon réactive et hors-ligne.

---

## 🚀 Stack Technique

- **Frontend & UI :** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool :** [Vite 8](https://vite.dev/)
- **Styles :** [Tailwind CSS v4](https://tailwindcss.com/)
- **PWA & Offline :** [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) (Service Worker, Web App Manifest, Cache Workbox)
- **Icônes :** [Lucide React](https://lucide.dev/)
- **Backend / BDD :** [Supabase](https://supabase.com/) (Socle client préparé dans `src/lib/supabase.ts`, prêt à être configuré)

---

## 📁 Structure du Projet

```text
menu-du-jour/
├── public/
│   ├── favicon.svg          # Favicon SVG
│   ├── pwa-192x192.svg      # Icône PWA 192x192
│   └── pwa-512x512.svg      # Icône PWA 512x512 (standard & maskable)
├── src/
│   ├── components/
│   │   ├── Header.tsx       # En-tête de l'application
│   │   └── StatusCard.tsx   # Carte de statut d'infrastructure
│   ├── lib/
│   │   └── supabase.ts      # Client Supabase avec détection des variables
│   ├── types/
│   │   └── database.types.ts # Placeholder types pour le schéma Supabase
│   ├── App.tsx              # Composant racine & tableau de bord du socle
│   ├── index.css            # Point d'entrée CSS (@import "tailwindcss")
│   └── main.tsx             # Point d'entrée React 19
├── .env.example             # Modèle de variables d'environnement Supabase
├── .gitignore               # Fichiers exclus (.env, dist, node_modules)
├── index.html               # Document HTML avec métadonnées PWA
├── package.json             # Dépendances & scripts npm
├── tsconfig.app.json        # Configuration TypeScript & alias @/
├── tsconfig.json            # Configuration TypeScript racine
└── vite.config.ts           # Configuration Vite + Tailwind + PWA
```

---

## 🛠️ Commandes Disponibles

```bash
# Lancer le serveur de développement
npm run dev

# Compiler pour la production (TypeScript check + Vite build + PWA service worker)
npm run build

# Prévisualiser la version de production en local
npm run preview
```

---

## 🔗 Prochaines Étapes

### 1. Connecter le dépôt GitHub
Créez un dépôt sur GitHub puis exécutez :
```bash
git remote add origin https://github.com/<votre-compte>/menu-du-jour.git
git push -u origin main
```

### 2. Connecter Supabase
1. Créez un projet sur le tableau de bord [Supabase](https://supabase.com).
2. Récupérez vos identifiants d'API dans **Project Settings > API**.
3. Renseignez-les dans votre fichier local `.env` :
   ```env
   VITE_SUPABASE_URL=https://<project-ref>.supabase.co
   VITE_SUPABASE_ANON_KEY=<anon-key>
   ```
4. Développez ensuite les schémas de tables (ex: restaurants, plats du jour, formules) et les règles de sécurité Row Level Security (RLS).
