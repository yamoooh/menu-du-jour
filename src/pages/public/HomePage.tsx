import React from 'react'
import { Link } from 'react-router-dom'
import { SeoHead } from '@/components/public/SeoHead'
import { PublicHeader } from '@/components/public/PublicHeader'
import { PublicFooter } from '@/components/public/PublicFooter'

export const HomePage: React.FC = () => {
  const jsonLdSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Menu du Jour',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web, iOS, Android',
    offers: {
      '@type': 'Offer',
      price: '5000',
      priceCurrency: 'XAF',
    },
    description:
      'La plateforme SaaS pour digitaliser vos menus du jour, centraliser vos réservations et fidéliser vos clients — sans commission.',
  }

  // Photos haute résolution d'ambiance restauration (Unsplash CDN garanti sans erreur 403)
  const heroBgImg =
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2000&q=80'
  const chefActionImg =
    'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=1200&q=80'
  const terraceImg =
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80'
  const barWineImg =
    'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=2000&q=80'

  return (
    <div className="bg-background font-body-md text-on-surface min-h-screen flex flex-col antialiased selection:bg-secondary selection:text-white">
      <SeoHead
        title="Menu du Jour - Plateforme SaaS Multi-Restaurants & Menus Digitaux"
        description="La plateforme SaaS pour digitaliser vos menus du jour, centraliser vos réservations et fidéliser vos clients sans commission au Cameroun et en Afrique Centrale."
        path="/"
        schema={jsonLdSchema}
      />

      {/* HEADER NAVIGATION CENTRALISÉ */}
      <PublicHeader />

      <main className="w-full pt-24 md:pt-28 flex-1 bg-surface">
        <div className="flex flex-col w-full">
          {/* ========================================================================= */}
          {/* 1. HERO SECTION : IMMERSIVE AVEC ATMOSPHÈRE HAUT DE GAMME & PITCH SAAS   */}
          {/* ========================================================================= */}
          <section className="relative w-full overflow-hidden bg-slate-950 text-white min-h-[640px] lg:min-h-[720px] flex items-center">
            {/* Arrière-plan gastronomique haute définition */}
            <div className="absolute inset-0 z-0">
              <img
                alt="Salle de restaurant haut de gamme feutrée et contemporaine"
                className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out opacity-45"
                src={heroBgImg}
                onError={(e) => {
                  e.currentTarget.src =
                    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=2000&q=80'
                }}
              />
              {/* Gradients protecteurs calibrés pour une lisibilité totale */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/40"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/60"></div>
            </div>

            <div className="max-w-[1600px] mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop py-20 lg:py-24 relative z-10 w-full">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
                {/* Colonne Pitch & Réassurances */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 w-fit">
                    <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse"></span>
                    <span className="font-label-sm text-label-sm text-secondary-fixed uppercase tracking-wider font-semibold">
                      SaaS Restauration • Cameroun &amp; CEMAC • Zéro Commission
                    </span>
                  </div>

                  <h1 className="font-display-lg text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight max-w-3xl">
                    La plateforme SaaS pour digitaliser vos menus du jour, centraliser vos réservations et fidéliser vos clients — sans commission.
                  </h1>

                  <p className="font-body-lg text-base sm:text-lg text-slate-200 max-w-2xl font-light leading-relaxed">
                    <strong>Menu du Jour</strong> permet aux restaurants, bistrots et tables d'Afrique centrale de diffuser instantanément leur ardoise quotidienne par QR code et WhatsApp, de gérer leurs réservations en direct et d'encaisser via Mobile Money, le tout pour un tarif fixe de 5 000 FCFA/mois.
                  </p>

                  {/* CTAs avec contrastes percutants */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                    <Link
                      to="/inscription?role=restaurant_manager"
                      className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-label-lg text-label-lg bg-secondary text-white shadow-lg hover:bg-secondary-container transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                      <span className="material-symbols-outlined text-[20px]">add_business</span>
                      <span>Inscrire mon établissement (Essai 7j offert)</span>
                    </Link>

                    <Link
                      to="/decouvrir"
                      className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-label-lg text-label-lg bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 transition-all"
                    >
                      <span className="material-symbols-outlined text-[20px]">explore</span>
                      <span>Explorer les restaurants</span>
                    </Link>
                  </div>

                  {/* Piliers de confiance & Réassurance */}
                  <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/15 max-w-xl">
                    <div className="flex flex-col">
                      <span className="text-2xl lg:text-3xl font-bold text-secondary-fixed">0%</span>
                      <span className="text-xs text-slate-300 font-medium">Commission sur les couverts</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-2xl lg:text-3xl font-bold text-white">7 Jours</span>
                      <span className="text-xs text-slate-300 font-medium">Essai pro sans carte bancaire</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-2xl lg:text-3xl font-bold text-secondary-container">5 000 XAF</span>
                      <span className="text-xs text-slate-300 font-medium">Abonnement fixe via LeekPay</span>
                    </div>
                  </div>

                  {/* Badge officiel confiance locale */}
                  <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-secondary text-[16px]">verified</span>
                      Paiements MTN MoMo &amp; Orange Money
                    </span>
                    <span className="hidden sm:inline opacity-40">•</span>
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-secondary text-[16px]">support_agent</span>
                      Assistance dédiée Douala &amp; Yaoundé
                    </span>
                  </div>
                </div>

                {/* Colonne Droite : Carte Interactive d'Aperçu Vivant */}
                <div className="lg:col-span-4 relative mt-6 lg:mt-0">
                  <div className="bg-slate-900/80 backdrop-blur-xl border border-white/15 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 text-white">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                          En direct à Douala
                        </span>
                      </div>
                      <span className="font-data-mono text-xs text-secondary-fixed font-bold">
                        Aujourd'hui
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-sm text-white">Ndolè Royal aux Crevettes</p>
                          <p className="text-xs text-slate-400">Le Wouri Bistrot • Bonanjo</p>
                        </div>
                        <span className="font-bold text-secondary-fixed text-sm">7 500 XAF</span>
                      </div>

                      <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-sm text-white">Filet de Bar Braisé</p>
                          <p className="text-xs text-slate-400">La Terrasse Tropicale • Bastos</p>
                        </div>
                        <span className="font-bold text-secondary-fixed text-sm">6 000 XAF</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px] text-emerald-400">qr_code_2</span>
                        QR Code sur table actif
                      </span>
                      <Link to="/decouvrir" className="text-secondary-fixed hover:underline font-semibold">
                        Voir tout →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* 2. BARRE DE RÉASSURANCE TERRITORIALE                                      */}
          {/* ========================================================================= */}
          <section className="w-full bg-surface-container-lowest border-y border-slate-200/80 py-6">
            <div className="max-w-[1600px] mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-100"></span>
                <span className="font-label-md text-label-md font-bold text-on-surface">
                  Infrastructure CEMAC &amp; Afrique Centrale
                </span>
              </div>
              <div className="flex items-center gap-2 text-on-surface-variant font-body-sm">
                <span className="material-symbols-outlined text-secondary text-[20px]">account_balance_wallet</span>
                <span>Paiements sécurisés LeekPay (MTN MoMo &amp; Orange Money)</span>
              </div>
              <div className="flex items-center gap-2 text-on-surface font-body-sm">
                <span className="material-symbols-outlined text-emerald-600 text-[20px]">chat</span>
                <span>
                  Support direct WhatsApp :{' '}
                  <a
                    className="font-semibold text-secondary hover:underline"
                    href="https://wa.me/237658352129"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    +237 658 35 21 29
                  </a>
                </span>
              </div>
              <div className="flex items-center gap-2 text-on-surface-variant font-body-sm">
                <span className="material-symbols-outlined text-secondary text-[20px]">map</span>
                <span>OpenStreetMap &amp; Leaflet natif (Zéro frais d'API)</span>
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* 3. SECTION PARCOURS RESTAURATEUR : ÉCOSYSTÈME PRO                        */}
          {/* ========================================================================= */}
          <section className="w-full py-20 lg:py-24 bg-surface-container-low relative" id="ecosysteme-pro">
            <div className="max-w-[1600px] mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop flex flex-col gap-12">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex flex-col gap-2 max-w-2xl">
                  <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest font-bold">
                    Écosystème Restaurateurs
                  </span>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface font-extrabold">
                    Publiez votre ardoise du midi en 30 secondes et remplissez votre salle sans intermédiaire
                  </h2>
                  <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                    Zéro commission prélevée sur vos couverts, synchronisation instantanée sur les smartphones des clients du quartier d'affaires et contrôle total de vos tables.
                  </p>
                </div>
                <Link
                  className="inline-flex items-center gap-2 text-secondary font-label-md font-bold hover:gap-3 transition-all"
                  to="/tarifs"
                >
                  <span>Découvrir les fonctionnalités Pro</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
              </div>

              {/* Split Container avec Chef en Action et Carte des 4 Étapes */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                {/* Carte Visuelle Immersive du Chef en Action */}
                <div className="lg:col-span-5 relative rounded-2xl overflow-hidden shadow-lg min-h-[440px] flex flex-col justify-end p-8">
                  <img
                    alt="Chef exécutif dressant un plat gastronomique africain contemporain"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    src={chefActionImg}
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80'
                    }}
                  />
                  {/* Overlay pour contraste absolu */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
                  <div className="relative z-10 flex flex-col gap-3 text-white">
                    <span className="px-2.5 py-1 rounded bg-secondary text-white font-label-sm text-[11px] font-bold w-fit uppercase tracking-wider">
                      Contrôle Culinaire Immédiat
                    </span>
                    <blockquote className="font-headline-sm text-lg font-bold text-white leading-snug">
                      « En 30 secondes chaque matin, l'ardoise du marché est en ligne par QR code et WhatsApp. Les réservations tombent en direct et nous gardons 100% de notre marge. »
                    </blockquote>
                    <div className="flex items-center gap-3 pt-2 border-t border-white/20">
                      <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-white text-xs">
                        CT
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">Chef Christian T.</p>
                        <p className="text-[11px] text-slate-300">Maître Restaurateur • Douala</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Les 4 étapes fluides de l'expérience établissement */}
                <div className="lg:col-span-7 bg-surface-container-lowest rounded-2xl p-8 md:p-10 border border-slate-200/80 shadow-sm flex flex-col justify-between gap-8">
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-secondary-fixed flex items-center justify-center">
                          <span className="material-symbols-outlined text-secondary text-[22px]">restaurant</span>
                        </div>
                        <div>
                          <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                            Pilotez votre présence en 4 actions intuitives
                          </h3>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">
                            Conçu pour être manipulé depuis un smartphone en plein coup de feu
                          </p>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-surface-container text-on-surface font-data-mono text-xs font-bold">
                        Admin Mobile-First
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Étape 1 */}
                      <div className="flex gap-3.5 p-4 rounded-xl bg-surface-container-low border border-slate-200/60">
                        <span className="w-8 h-8 shrink-0 rounded-full bg-secondary text-white font-bold text-xs flex items-center justify-center">
                          01
                        </span>
                        <div className="flex flex-col gap-1">
                          <h4 className="font-label-lg font-bold text-on-surface">Configuration Rapide</h4>
                          <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                            Identité, photos HD de la salle, horaires de service et géolocalisation OpenStreetMap autonome.
                          </p>
                        </div>
                      </div>

                      {/* Étape 2 */}
                      <div className="flex gap-3.5 p-4 rounded-xl bg-surface-container-low border border-slate-200/60">
                        <span className="w-8 h-8 shrink-0 rounded-full bg-secondary text-white font-bold text-xs flex items-center justify-center">
                          02
                        </span>
                        <div className="flex flex-col gap-1">
                          <h4 className="font-label-lg font-bold text-on-surface">Édition des Menus</h4>
                          <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                            Saisie instantanée par rubriques ou simple téléversement d'affiches et PDF vectoriels haute résolution.
                          </p>
                        </div>
                      </div>

                      {/* Étape 3 */}
                      <div className="flex gap-3.5 p-4 rounded-xl bg-surface-container-low border border-slate-200/60">
                        <span className="w-8 h-8 shrink-0 rounded-full bg-secondary text-white font-bold text-xs flex items-center justify-center">
                          03
                        </span>
                        <div className="flex flex-col gap-1">
                          <h4 className="font-label-lg font-bold text-on-surface">Gestion Déterministe</h4>
                          <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                            Acceptation ou refus argumenté en un clic. Finis les appels manqués et tables réservées sans certitude.
                          </p>
                        </div>
                      </div>

                      {/* Étape 4 */}
                      <div className="flex gap-3.5 p-4 rounded-xl bg-surface-container-low border border-slate-200/60">
                        <span className="w-8 h-8 shrink-0 rounded-full bg-secondary text-white font-bold text-xs flex items-center justify-center">
                          04
                        </span>
                        <div className="flex flex-col gap-1">
                          <h4 className="font-label-lg font-bold text-on-surface">Abonnement LeekPay</h4>
                          <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                            7 jours gratuits puis 5 000 FCFA/mois sans engagement par MTN MoMo ou Orange Money.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                      <span className="material-symbols-outlined text-secondary text-[18px]">verified_user</span>
                      <span>Aucune commission sur vos réservations ou ventes sur place.</span>
                    </div>
                    <Link
                      to="/inscription?role=restaurant_manager"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-label-md font-bold bg-secondary text-white hover:bg-secondary-container transition-colors shadow-sm"
                    >
                      <span>Commencer l'essai 7 jours</span>
                      <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* 4. SECTION EXPÉRIENCE CONVIVE : DÉCOUVERTE & RÉSERVATION EN 1 CLIC       */}
          {/* ========================================================================= */}
          <section className="w-full py-20 lg:py-24 bg-surface-container-lowest relative overflow-hidden" id="parcours-client">
            <div className="max-w-[1600px] mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop flex flex-col gap-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Colonne Explicative Client */}
                <div className="lg:col-span-6 flex flex-col gap-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60 w-fit">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    <span className="font-label-sm text-label-sm font-bold uppercase tracking-wider">
                      100% Gratuit pour les Convives
                    </span>
                  </div>

                  <h2 className="font-headline-lg text-headline-lg text-on-surface font-extrabold">
                    Trouvez en direct les meilleures ardoises du jour et réservez votre table en 1 clic
                  </h2>

                  <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                    Consultez en temps réel sans téléchargement d'application lourde les ardoises du midi et spécialités mises à jour chaque matin à Bonanjo, Akwa, Bastos ou Kribi, puis réservez sans aucuns frais supplémentaires.
                  </p>

                  <div className="space-y-4 pt-2">
                    <div className="flex items-start gap-3.5">
                      <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0 text-secondary mt-0.5">
                        <span className="material-symbols-outlined text-[20px]">location_city</span>
                      </div>
                      <div>
                        <h4 className="font-label-lg font-bold text-on-surface">Exploration par Métropoles &amp; Quartiers</h4>
                        <p className="font-body-sm text-on-surface-variant">
                          Accédez aux tables de Bonanjo, Akwa, Bastos, Bonapriso ou Kribi avec les filtres par style culinaire.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5">
                      <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0 text-secondary mt-0.5">
                        <span className="material-symbols-outlined text-[20px]">menu_book</span>
                      </div>
                      <div>
                        <h4 className="font-label-lg font-bold text-on-surface">Menus du Jour &amp; Cartes PDF Plein Écran</h4>
                        <p className="font-body-sm text-on-surface-variant">
                          Visualisez les formules exactes du midi, les suggestions du sommelier et les tarifs en FCFA sans surprise.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5">
                      <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0 text-secondary mt-0.5">
                        <span className="material-symbols-outlined text-[20px]">notifications_active</span>
                      </div>
                      <div>
                        <h4 className="font-label-lg font-bold text-on-surface">Abonnement Direct aux Tables Favorites</h4>
                        <p className="font-body-sm text-on-surface-variant">
                          Recevez une notification discrète chaque matin lorsque votre bistrot fétiche dévoile son ardoise.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link
                      to="/inscription?role=client"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-label-md font-bold bg-primary text-on-primary hover:bg-primary-container transition-colors shadow-sm"
                    >
                      <span>Créer mon compte convive gratuit</span>
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </Link>
                  </div>
                </div>

                {/* Colonne Visuelle Immersive : Terrasse Élégante Bonanjo */}
                <div className="lg:col-span-6 relative rounded-2xl overflow-hidden shadow-xl min-h-[460px] flex flex-col justify-end p-8 group">
                  <img
                    alt="Terrasse de restaurant conviviale et lumineuse à Bonanjo"
                    className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    src={terraceImg}
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80'
                    }}
                  />
                  {/* Overlay texturé assurant une lisibilité maximale */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-slate-950/10"></div>
                  <div className="relative z-10 flex flex-col gap-3 text-white max-w-lg">
                    <span className="px-3 py-1 rounded bg-white/20 backdrop-blur-md text-white font-label-sm text-xs font-semibold w-fit border border-white/30">
                      Déjeuner d'Affaires &amp; Pause Gourmande
                    </span>
                    <h3 className="font-headline-sm text-xl font-bold text-white">
                      « Je découvre l'ardoise fraîche dès 11h sur mon smartphone et je bloque ma table à Bonanjo avant la ruée de midi. »
                    </h3>
                    <p className="text-xs text-slate-200">
                      Rejoignez plus de 15 000 gastronomes et cadres actifs qui choisissent leur table chaque midi en Afrique Centrale.
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-300 pt-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      <span>Confirmation de réservation transmise instantanément au gérant</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* 5. SECTION CARACTÉRISTIQUES & PERFORMANCE TECHNIQUE                       */}
          {/* ========================================================================= */}
          <section className="w-full py-20 lg:py-24 bg-surface" id="fonctionnalites">
            <div className="max-w-[1600px] mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop flex flex-col gap-12">
              <div className="flex flex-col gap-3 max-w-2xl">
                <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest font-bold">
                  Conception &amp; Fiabilité Technique
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-extrabold">
                  Des fonctionnalités pragmatiques, adaptées aux réalités du terrain
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  Menus PDF vectoriels et photos HD, réservations déterministes sans commission, géolocalisation OpenStreetMap sans frais d'API et alertes directes WhatsApp.
                </p>
              </div>

              {/* Bento Grid 4 Cartes Haut de Gamme */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
                {/* Carte 1 : Ardoises & PDF */}
                <div className="lg:col-span-6 bg-surface-container-lowest p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between gap-6">
                  <div className="flex flex-col gap-3">
                    <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-secondary">
                      <span className="material-symbols-outlined text-[26px]">auto_stories</span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                      Menus PDF Haute Résolution &amp; Ardoises du Jour
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                      Publication souple : structurez vos entrées, plats et desserts ligne par ligne ou diffusez vos visuels et cartes PDF vectorielles avec zoom natif haute fidélité.
                    </p>
                  </div>

                  {/* Visual Widget */}
                  <div className="bg-surface-container-low p-4 rounded-xl border border-slate-200/60 flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-secondary text-white rounded text-xs font-bold">Grillades</span>
                      <span className="px-2.5 py-1 bg-white text-on-surface-variant rounded text-xs font-medium border border-slate-200/80">
                        Spécialités Locales
                      </span>
                      <span className="px-2.5 py-1 bg-white text-on-surface-variant rounded text-xs font-medium border border-slate-200/80">
                        Cocktails
                      </span>
                    </div>
                    <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200/60">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-secondary text-[20px]">picture_as_pdf</span>
                        <span className="text-xs font-semibold text-slate-800">Menu_Semaine_Bonapriso.pdf</span>
                      </div>
                      <span className="text-xs text-secondary font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">zoom_in</span> Visualiser
                      </span>
                    </div>
                  </div>
                </div>

                {/* Carte 2 : Module de Réservation */}
                <div className="lg:col-span-6 bg-surface-container-lowest p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between gap-6">
                  <div className="flex flex-col gap-3">
                    <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-secondary">
                      <span className="material-symbols-outlined text-[26px]">event_seat</span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                      Réservations Déterministes Sans Commission
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                      Fini le chaos des messages vocaux WhatsApp éparpillés. Chaque demande précise le nombre de couverts et l'horaire : vous validez en 1 clic ou refusez avec motif instantané.
                    </p>
                  </div>

                  {/* Statuts Déterministes */}
                  <div className="bg-surface-container-low p-4 rounded-xl border border-slate-200/60 flex flex-col gap-2 text-xs">
                    <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-200/50">
                      <div className="flex items-center gap-2 font-medium">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span>Table 4 pers. • 13h00 (Salle climatisée)</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold">Validée</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-200/50">
                      <div className="flex items-center gap-2 font-medium">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        <span>Table 2 pers. • 20h00 (Terrasse)</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-bold">En attente</span>
                    </div>
                  </div>
                </div>

                {/* Carte 3 : Suivi & Push */}
                <div className="lg:col-span-6 bg-surface-container-lowest p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between gap-6">
                  <div className="flex flex-col gap-3">
                    <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-secondary">
                      <span className="material-symbols-outlined text-[26px]">favorite</span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                      Fidélisation Active &amp; Alertes Quotidiennes
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                      Vos clients réguliers s'abonnent à votre profil. Dès l'affichage de l'ardoise matinale, ils reçoivent directement le contenu de la formule sans spam.
                    </p>
                  </div>

                  <div className="bg-surface-container-low p-4 rounded-xl border border-slate-200/60 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary shrink-0">
                      <span className="material-symbols-outlined text-[22px]">notifications_active</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-on-surface">Nouvelle ardoise chez Bistrot Akwa</span>
                      <span className="text-[11px] text-on-surface-variant">
                        Publiée à 11h10 : Filet de bar rôti &amp; bananes plantains
                      </span>
                    </div>
                  </div>
                </div>

                {/* Carte 4 : OpenStreetMap & Leaflet */}
                <div className="lg:col-span-6 bg-surface-container-lowest p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between gap-6">
                  <div className="flex flex-col gap-3">
                    <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-secondary">
                      <span className="material-symbols-outlined text-[26px]">map</span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                      Cartographie Ouverte Leaflet &amp; OpenStreetMap
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                      Zéro dépendance à des clés d'API payantes de Google Maps. Vos établissements sont localisés avec précision sans surcoût d'infrastructure pour votre trésorerie.
                    </p>
                  </div>

                  <div className="bg-surface-container-low p-4 rounded-xl border border-slate-200/60 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="material-symbols-outlined text-secondary text-[20px]">explore</span>
                      <div>
                        <span className="font-bold text-on-surface block">Bastos, Yaoundé</span>
                        <span className="font-data-mono text-[11px] text-slate-500">Coordonnées GPS ouvertes</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-white font-label-sm text-[11px] text-on-surface font-semibold border border-slate-200/80">
                      100% Autonome
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* 6. SECTION TARIFS & MODÈLE ÉCONOMIQUE TRANSPARENT                         */}
          {/* ========================================================================= */}
          <section className="w-full py-20 lg:py-24 bg-surface-container-lowest border-y border-slate-200/80" id="tarifs">
            <div className="max-w-[1600px] mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop flex flex-col gap-12">
              <div className="flex flex-col items-center text-center gap-3 max-w-2xl mx-auto">
                <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest font-bold">
                  Tarification Claire &amp; Sans Surprise
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-extrabold">
                  5 000 FCFA / mois tout compris. Zéro commission, 7 jours d'essai gratuit.
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Aucun prélèvement sur vos additions, aucune commission sur vos couverts. Un abonnement logiciel fixe et accessible, payable facilement via Mobile Money.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto w-full">
                {/* Carte Offre Convives */}
                <div className="bg-surface-container-low rounded-2xl p-8 flex flex-col justify-between gap-8 border border-slate-200/80 shadow-sm">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="font-label-md text-label-md text-on-surface uppercase tracking-wider font-bold">
                        Convives &amp; Visiteurs
                      </span>
                      <span className="px-3 py-1 rounded-full bg-white font-label-sm text-xs text-on-surface font-bold border border-slate-200/80">
                        Accès Libre
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="font-display-lg text-4xl font-extrabold text-on-surface">0</span>
                      <span className="text-xl font-bold text-on-surface-variant">FCFA</span>
                      <span className="text-xs text-on-surface-variant ml-2 font-medium">/ Toujours gratuit</span>
                    </div>
                    <p className="font-body-sm text-on-surface-variant leading-relaxed">
                      Consultez toutes les ardoises du jour, découvrez les spécialités locales et réservez sans aucuns frais d'intermédiation ni pop-up invasif.
                    </p>

                    <div className="flex flex-col gap-2.5 pt-4 border-t border-slate-200/60 text-xs">
                      <div className="flex items-center gap-2 text-on-surface">
                        <span className="material-symbols-outlined text-secondary text-[18px]">check_circle</span>
                        <span>Accès complet aux cartes et photos HD</span>
                      </div>
                      <div className="flex items-center gap-2 text-on-surface">
                        <span className="material-symbols-outlined text-secondary text-[18px]">check_circle</span>
                        <span>Réservations de tables avec statut instantané</span>
                      </div>
                      <div className="flex items-center gap-2 text-on-surface">
                        <span className="material-symbols-outlined text-secondary text-[18px]">check_circle</span>
                        <span>Favoris et notifications de menus du midi</span>
                      </div>
                      <div className="flex items-center gap-2 text-on-surface">
                        <span className="material-symbols-outlined text-secondary text-[18px]">check_circle</span>
                        <span>Fonctionne sur tous les smartphones sans téléchargement</span>
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/decouvrir"
                    className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-label-md font-bold bg-white text-on-surface border border-slate-300 hover:bg-slate-50 transition-colors shadow-xs text-center"
                  >
                    Explorer les tables du moment
                  </Link>
                </div>

                {/* Carte Offre Restaurateur Pro */}
                <div className="bg-surface-container-lowest rounded-2xl p-8 flex flex-col justify-between gap-8 border-2 border-secondary/80 shadow-xl relative">
                  <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-secondary text-white font-label-sm text-[11px] font-bold tracking-wide uppercase shadow-md">
                    7 Jours d'essai gratuit offert
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="font-label-md text-label-md text-secondary uppercase tracking-wider font-extrabold">
                        Abonnement Restaurateur
                      </span>
                      <span className="px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-xs font-bold">
                        Via LeekPay
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="font-display-lg text-4xl font-extrabold text-on-surface">5 000</span>
                      <span className="text-xl font-bold text-on-surface-variant">FCFA</span>
                      <span className="text-xs text-on-surface-variant ml-2 font-medium">/ 30 jours (Sans engagement)</span>
                    </div>
                    <p className="font-body-sm text-on-surface-variant leading-relaxed">
                      Profitez de 7 jours complets pour paramétrer vos menus, générer vos QR codes et recevoir vos réservations. Renouvelez ensuite en 1 clic via Mobile Money.
                    </p>

                    <div className="flex flex-col gap-2.5 pt-4 border-t border-slate-100 text-xs">
                      <div className="flex items-center gap-2 text-on-surface font-medium">
                        <span className="material-symbols-outlined text-secondary text-[18px]">check_circle</span>
                        <span>Publication illimitée d'ardoises, photos et PDF</span>
                      </div>
                      <div className="flex items-center gap-2 text-on-surface font-medium">
                        <span className="material-symbols-outlined text-secondary text-[18px]">check_circle</span>
                        <span>Module de réservation complet (Acceptation / Refus motivé)</span>
                      </div>
                      <div className="flex items-center gap-2 text-on-surface font-medium">
                        <span className="material-symbols-outlined text-secondary text-[18px]">check_circle</span>
                        <span>Kit QR Code vitrine &amp; tables haute résolution</span>
                      </div>
                      <div className="flex items-center gap-2 text-on-surface font-medium">
                        <span className="material-symbols-outlined text-secondary text-[18px]">check_circle</span>
                        <span>Paiements LeekPay locaux (MTN Mobile Money, Orange Money)</span>
                      </div>
                      <div className="flex items-center gap-2 text-on-surface font-medium">
                        <span className="material-symbols-outlined text-secondary text-[18px]">check_circle</span>
                        <span>Support direct technicien par WhatsApp 7j/7</span>
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/inscription?role=restaurant_manager"
                    className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-label-md font-bold bg-secondary text-white hover:bg-secondary-container transition-all shadow-md active:scale-98 text-center"
                  >
                    Activer mes 7 jours d'essai gratuit
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* 7. SECTION PWA & ACCÈS RAPIDE                                             */}
          {/* ========================================================================= */}
          <section className="w-full py-20 bg-surface-container-low">
            <div className="max-w-[1600px] mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop">
              <div className="bg-surface-container-lowest rounded-2xl p-8 md:p-12 border border-slate-200/80 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-10">
                <div className="flex flex-col gap-4 max-w-xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-surface-container w-fit text-on-surface">
                    <span className="material-symbols-outlined text-[18px] text-secondary">install_mobile</span>
                    <span className="font-label-sm text-label-sm font-bold">Technologie Progressive Web App (PWA)</span>
                  </div>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                    Installez Menu du Jour en 1 clic sur votre écran d'accueil
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    Sans téléchargement sur les stores, sans mise à jour fastidieuse. Compatible avec tous les téléphones Android, iPhone, tablettes de service et ordinateurs de caisse.
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-on-surface pt-2">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-secondary text-[18px]">offline_pin</span>
                      Consultation hors-ligne partielle
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-secondary text-[18px]">speed</span>
                      Poids ultra-léger (&lt; 1 Mo)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-secondary text-[18px]">devices</span>
                      Fluidité tous formats
                    </span>
                  </div>
                </div>

                <div className="bg-surface-container p-6 rounded-xl flex flex-col gap-4 w-full lg:w-auto min-w-[320px] border border-slate-200/60">
                  <span className="font-label-md text-xs uppercase tracking-wider font-bold text-on-surface">
                    Installation ultra-simple :
                  </span>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-secondary text-white text-xs font-bold flex items-center justify-center shrink-0">
                      1
                    </span>
                    <p className="text-xs text-on-surface leading-snug">
                      Ouvrez le site dans Safari, Chrome ou Firefox sur votre mobile.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-secondary text-white text-xs font-bold flex items-center justify-center shrink-0">
                      2
                    </span>
                    <p className="text-xs text-on-surface leading-snug">
                      Appuyez sur le menu « Partager » ou les options de votre navigateur.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-secondary text-white text-xs font-bold flex items-center justify-center shrink-0">
                      3
                    </span>
                    <p className="text-xs text-on-surface leading-snug">
                      Sélectionnez « Sur l'écran d'accueil » pour l'utiliser comme une vraie app.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* 8. BANNIÈRE D'APPEL À L'ACTION FINALE : AVEC FOND BAR & VINS RAFFINÉ     */}
          {/* ========================================================================= */}
          <section className="w-full py-20 lg:py-24 bg-slate-950 relative overflow-hidden" id="contact">
            {/* Arrière-plan atmosphérique avec overlay feutré luxueux */}
            <div className="absolute inset-0 z-0">
              <img
                alt="Bar et comptoir raffiné en bois précieux d'un grand restaurant"
                className="w-full h-full object-cover object-center opacity-40"
                src={barWineImg}
                onError={(e) => {
                  e.currentTarget.src =
                    'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=2000&q=80'
                }}
              />
              {/* Overlay sombre élégant avec léger blur */}
              <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-[2px]"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/70"></div>
            </div>

            <div className="max-w-[1600px] mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop relative z-10">
              <div className="bg-slate-950/60 backdrop-blur-md rounded-2xl p-8 md:p-14 border border-white/15 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-10">
                <div className="flex flex-col gap-4 max-w-2xl text-white">
                  <span className="px-3 py-1 rounded bg-secondary text-white font-label-sm text-xs font-bold tracking-widest uppercase w-fit">
                    Déploiement Immédiat
                  </span>
                  <h2 className="font-display-lg text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                    Passez votre établissement à la vitesse supérieure dès aujourd'hui.
                  </h2>
                  <p className="font-body-md text-slate-200 text-base max-w-xl font-light leading-relaxed">
                    Activez vos 7 jours d'essai sans engagement ou échangez directement avec nos conseillers techniques à Douala pour une mise en ligne assistée de votre menu en moins d'une heure.
                  </p>
                  <div className="flex items-center gap-6 pt-2 text-xs text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-secondary-fixed text-[18px]">timer</span>
                      Configuration en 15 min
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-secondary-fixed text-[18px]">credit_card_off</span>
                      Sans carte bancaire requise
                    </span>
                  </div>
                </div>

                {/* Double CTA Percutant */}
                <div className="flex flex-col sm:flex-row lg:flex-col gap-3.5 w-full lg:w-auto shrink-0">
                  <Link
                    to="/inscription?role=restaurant_manager"
                    className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-label-lg text-label-lg font-bold bg-secondary text-white hover:bg-secondary-container transition-all shadow-lg text-center"
                  >
                    <span className="material-symbols-outlined text-[20px]">storefront</span>
                    <span>Démarrer mon essai de 7 jours</span>
                  </Link>

                  <a
                    className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-label-lg text-label-lg font-bold bg-white text-slate-950 hover:bg-slate-100 transition-all shadow-md text-center"
                    href="https://wa.me/237658352129"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <span className="material-symbols-outlined text-emerald-600 text-[20px]">chat</span>
                    <span>Support WhatsApp : +237 658 35 21 29</span>
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* FOOTER OFFICIEL AVEC LIENS LÉGAUX ET MARQUE */}
      <PublicFooter />
    </div>
  )
}
