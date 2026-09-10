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
      'La plateforme centrale pour digitaliser, diffuser vos menus et gérer vos réservations en toute autonomie.',
  }

  const heroRestaurantImg =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAY93GF8QoHvo6kdFGKGPOM5WdaRmjhOQZ5BBWqcaN4plccoz2I0uXpq0W-ZI7_8zFwskcBYS_hLCMsTLZEKbwV7m8tHfG_NGNGgGOXeHnpodZcC_owZryvaqAxY45ksEAMu1maCdpGRXfLmJuZ1gpcxmTRvhbZq9_HOfRABm9ZKlhSt6EMwQkxfeJB8O7xMWdWBUNrE4CqsW_joeWJrNefpXYIh2VZAIK_pvZMQH4XZfX9_MyreNHw'

  return (
    <div className="bg-background font-body-md text-on-surface min-h-screen flex flex-col">
      <SeoHead
        title="Menu du Jour - Plateforme SaaS Multi-Restaurants"
        description="La plateforme centrale pour digitaliser, diffuser vos menus et gérer vos réservations en toute autonomie au Cameroun et en Afrique."
        path="/"
        schema={jsonLdSchema}
      />

      <PublicHeader />

      <main className="w-full pt-20 flex-1 bg-surface">
        <div className="flex flex-col w-full">
          {/* SECTION HERO : ARCHITECTURE SAAS MULTI-RESTAURANTS */}
          <section className="relative w-full bg-surface-container-lowest overflow-hidden">
            <div className="absolute -top-32 -right-24 w-96 h-96 rounded-full bg-secondary-container/10 blur-3xl pointer-events-none"></div>
            <div className="absolute top-1/2 -left-20 w-80 h-80 rounded-full bg-surface-dim/40 blur-2xl pointer-events-none"></div>

            <div className="max-w-[1600px] mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop pt-space-xl pb-space-3xl relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
                {/* Colonne Gauche : Pitch SaaS & Double CTA */}
                <div className="lg:col-span-7 flex flex-col gap-space-md">
                  <div className="inline-flex items-center gap-space-xs px-space-sm py-space-2xs rounded-full bg-surface-container w-fit">
                    <span className="w-2 h-2 rounded-full bg-secondary"></span>
                    <span className="font-label-sm text-label-sm text-on-surface uppercase tracking-wider font-semibold">
                      Solution Logicielle Restauration Afrique &amp; International
                    </span>
                  </div>

                  <h1 className="font-display-lg text-display-lg text-on-surface leading-tight tracking-tight">
                    La plateforme centrale pour digitaliser, diffuser vos menus et gérer vos réservations en toute autonomie.
                  </h1>

                  <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
                    <strong>Menu du Jour</strong> n'est pas un restaurant unique, mais l'infrastructure logicielle SaaS dédiée aux établissements culinaires et aux convives. Offrez une consultation immédiate de vos cartes (photos, PDF, catégories), pilotez vos demandes de table en temps réel et fidélisez votre clientèle locale.
                  </p>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-space-base pt-space-sm">
                    <Link
                      to="/decouvrir"
                      className="inline-flex items-center justify-center gap-space-xs px-space-lg py-space-md rounded-xl font-label-lg text-label-lg bg-primary text-on-primary shadow-sm hover:bg-primary-container transition-all"
                    >
                      <span className="material-symbols-outlined text-[20px]">restaurant_menu</span>
                      <span>Découvrir les restaurants</span>
                    </Link>

                    <Link
                      to="/inscription"
                      className="inline-flex items-center justify-center gap-space-xs px-space-lg py-space-md rounded-xl font-label-lg text-label-lg bg-secondary text-on-secondary shadow-sm hover:bg-secondary-container transition-all"
                    >
                      <span className="material-symbols-outlined text-[20px]">storefront</span>
                      <span>Inscrire mon restaurant (Essai 7j offert)</span>
                    </Link>
                  </div>

                  {/* Métriques & Réassurance Technique */}
                  <div className="grid grid-cols-3 gap-space-md pt-space-lg max-w-lg">
                    <div className="flex flex-col">
                      <span className="font-headline-md text-headline-md text-secondary font-bold">100%</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">Gratuit pour les clients</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-headline-md text-headline-md text-on-surface font-bold">7 Jours</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">Essai restaurant sans carte</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-headline-md text-headline-md text-on-surface font-bold">5 000 XAF</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">Par mois via LeekPay</span>
                    </div>
                  </div>
                </div>

                {/* Colonne Droite : Interface Produit Interactive Mockup */}
                <div className="lg:col-span-5 relative">
                  <div className="bg-surface-container rounded-xl p-space-base shadow-xl flex flex-col gap-space-md">
                    {/* Barre de contrôle supérieure */}
                    <div className="flex items-center justify-between bg-surface-container-lowest px-space-base py-space-xs rounded-lg">
                      <div className="flex items-center gap-space-xs">
                        <span className="w-3 h-3 rounded-full bg-secondary-fixed-dim"></span>
                        <span className="w-3 h-3 rounded-full bg-surface-container-high"></span>
                        <span className="w-3 h-3 rounded-full bg-surface-dim"></span>
                      </div>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">app.menudujour.io</span>
                      <span className="material-symbols-outlined text-[18px] text-on-surface-variant">sync</span>
                    </div>

                    {/* Carte interactive aperçu restaurant */}
                    <div className="relative bg-surface-container-lowest rounded-lg p-space-md shadow-sm flex flex-col gap-space-sm">
                      <div className="relative h-44 w-full rounded-lg overflow-hidden">
                        <img
                          className="w-full h-full object-cover"
                          alt="Vue intérieure élégante et chaleureuse d'un restaurant moderne à Douala"
                          src={heroRestaurantImg}
                        />
                        <div className="absolute top-space-xs right-space-xs px-space-xs py-space-2xs bg-surface-container-lowest/90 backdrop-blur-sm rounded font-label-sm text-label-sm text-secondary font-bold">
                          Menu du Jour Actif
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                            Le Wouri Bistrot &amp; Grill
                          </h3>
                          <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-space-2xs">
                            <span className="material-symbols-outlined text-[16px] text-secondary">location_on</span>
                            Bonanjo, Douala • Cameroun
                          </p>
                        </div>
                        <div className="flex items-center gap-space-2xs bg-surface-container-high px-space-xs py-space-2xs rounded text-on-surface font-label-sm text-label-sm font-bold">
                          <span className="material-symbols-outlined text-[16px] text-secondary">star</span>
                          4.8
                        </div>
                      </div>

                      {/* Badge statut réservation en temps réel */}
                      <div className="bg-surface-container-low p-space-sm rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-space-xs">
                          <span className="w-2 h-2 rounded-full bg-secondary"></span>
                          <span className="font-label-md text-label-md text-on-surface font-medium">Module Réservations</span>
                        </div>
                        <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container-lowest px-space-xs py-space-2xs rounded font-semibold">
                          3 en attente
                        </span>
                      </div>
                    </div>

                    {/* Mini aperçu fiche plat */}
                    <div className="grid grid-cols-2 gap-space-sm">
                      <div className="bg-surface-container-lowest p-space-sm rounded-lg shadow-sm flex flex-col">
                        <span className="font-label-sm text-label-sm text-secondary uppercase font-semibold">Entrée du jour</span>
                        <span className="font-body-md text-body-md text-on-surface font-medium truncate">Carpaccio de Capitaine</span>
                        <span className="font-data-mono text-data-mono text-on-surface-variant mt-space-2xs font-bold">4 500 FCFA</span>
                      </div>
                      <div className="bg-surface-container-lowest p-space-sm rounded-lg shadow-sm flex flex-col">
                        <span className="font-label-sm text-label-sm text-secondary uppercase font-semibold">Plat du chef</span>
                        <span className="font-body-md text-body-md text-on-surface font-medium truncate">Ndolè Royal &amp; Miondo</span>
                        <span className="font-data-mono text-data-mono text-on-surface-variant mt-space-2xs font-bold">7 000 FCFA</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION LE DOUBLE PARCOURS : PROPRIÉTAIRES VS CLIENTS */}
          <section className="w-full bg-surface-container-low py-space-3xl" id="parcours">
            <div className="max-w-[1600px] mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop flex flex-col gap-space-2xl">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
                <div className="flex flex-col gap-space-xs max-w-2xl">
                  <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider font-semibold">
                    Fonctionnement opérationnel
                  </span>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                    Deux écosystèmes interconnectés pour une fluidité sans rupture
                  </h2>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
                  Chaque acteur dispose d'un espace conçu sur mesure selon ses impératifs d'ergonomie et de rapidité d'exécution.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-xl">
                {/* PARCOURS RESTAURANT */}
                <div className="bg-surface-container-lowest rounded-xl p-space-xl shadow-sm flex flex-col justify-between gap-space-xl">
                  <div className="flex flex-col gap-space-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-space-sm">
                        <div className="w-12 h-12 rounded-xl bg-secondary-fixed flex items-center justify-center">
                          <span className="material-symbols-outlined text-secondary text-[24px]">storefront</span>
                        </div>
                        <div>
                          <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                            Parcours Établissement
                          </h3>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">
                            Pour les gérants, restaurateurs et chefs
                          </p>
                        </div>
                      </div>
                      <span className="px-space-xs py-space-2xs rounded bg-surface-container font-data-mono text-data-mono text-on-surface font-bold">
                        Admin &amp; POS
                      </span>
                    </div>

                    <div className="flex flex-col gap-space-base mt-space-sm">
                      {/* Étape 1 */}
                      <div className="flex gap-space-md">
                        <div className="flex flex-col items-center">
                          <span className="w-7 h-7 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm flex items-center justify-center font-bold">
                            1
                          </span>
                          <div className="w-0.5 h-full bg-surface-container mt-space-xs"></div>
                        </div>
                        <div className="flex flex-col pb-space-sm">
                          <h4 className="font-label-lg text-label-lg text-on-surface font-semibold">
                            Inscription &amp; Création de profil
                          </h4>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">
                            Définition de l'identité, contact, photos de la salle et description de vos spécialités culinaires.
                          </p>
                        </div>
                      </div>

                      {/* Étape 2 */}
                      <div className="flex gap-space-md">
                        <div className="flex flex-col items-center">
                          <span className="w-7 h-7 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm flex items-center justify-center font-bold">
                            2
                          </span>
                          <div className="w-0.5 h-full bg-surface-container mt-space-xs"></div>
                        </div>
                        <div className="flex flex-col pb-space-sm">
                          <h4 className="font-label-lg text-label-lg text-on-surface font-semibold">
                            Horaires &amp; Géolocalisation OpenStreetMap
                          </h4>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">
                            Positionnement précis sans licence d'API payante, indication des créneaux de service midi et soir.
                          </p>
                        </div>
                      </div>

                      {/* Étape 3 */}
                      <div className="flex gap-space-md">
                        <div className="flex flex-col items-center">
                          <span className="w-7 h-7 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm flex items-center justify-center font-bold">
                            3
                          </span>
                          <div className="w-0.5 h-full bg-surface-container mt-space-xs"></div>
                        </div>
                        <div className="flex flex-col pb-space-sm">
                          <h4 className="font-label-lg text-label-lg text-on-surface font-semibold">
                            Mise en ligne des Menus (Images &amp; PDF)
                          </h4>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">
                            Édition instantanée de la formule du jour, classement par rubriques et upload de supports visuels haute définition.
                          </p>
                        </div>
                      </div>

                      {/* Étape 4 */}
                      <div className="flex gap-space-md">
                        <div className="flex flex-col items-center">
                          <span className="w-7 h-7 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm flex items-center justify-center font-bold">
                            4
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <h4 className="font-label-lg text-label-lg text-on-surface font-semibold">
                            Gestion des réservations &amp; Souscription LeekPay
                          </h4>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">
                            Validation ou refus argumenté en 1 clic. Renouvellement transparent de votre licence via LeekPay.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/inscription"
                    className="inline-flex items-center justify-center gap-space-xs px-space-base py-space-sm rounded-xl font-label-md text-label-md bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors font-semibold"
                  >
                    <span>Démarrer l'essai restaurant</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </Link>
                </div>

                {/* PARCOURS CLIENT */}
                <div
                  className="bg-surface-container-lowest rounded-xl p-space-xl shadow-sm flex flex-col justify-between gap-space-xl"
                  id="parcours-client"
                >
                  <div className="flex flex-col gap-space-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-space-sm">
                        <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center">
                          <span className="material-symbols-outlined text-on-surface text-[24px]">person</span>
                        </div>
                        <div>
                          <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                            Parcours Client &amp; Visiteur
                          </h3>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">
                            Pour les gastronomes, professionnels en pause déjeuner et touristes
                          </p>
                        </div>
                      </div>
                      <span className="px-space-xs py-space-2xs rounded bg-surface-container-low font-data-mono text-data-mono text-secondary font-bold">
                        100% Gratuit
                      </span>
                    </div>

                    <div className="flex flex-col gap-space-base mt-space-sm">
                      {/* Étape 1 */}
                      <div className="flex gap-space-md">
                        <div className="flex flex-col items-center">
                          <span className="w-7 h-7 rounded-full bg-primary text-on-primary font-label-sm text-label-sm flex items-center justify-center font-bold">
                            1
                          </span>
                          <div className="w-0.5 h-full bg-surface-container mt-space-xs"></div>
                        </div>
                        <div className="flex flex-col pb-space-sm">
                          <h4 className="font-label-lg text-label-lg text-on-surface font-semibold">
                            Inscription gratuite et instantanée
                          </h4>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">
                            Accès immédiat sans carte bancaire ni configuration complexe, via e-mail ou compte rapide.
                          </p>
                        </div>
                      </div>

                      {/* Étape 2 */}
                      <div className="flex gap-space-md">
                        <div className="flex flex-col items-center">
                          <span className="w-7 h-7 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm flex items-center justify-center font-bold">
                            2
                          </span>
                          <div className="w-0.5 h-full bg-surface-container mt-space-xs"></div>
                        </div>
                        <div className="flex flex-col pb-space-sm">
                          <h4 className="font-label-lg text-label-lg text-on-surface font-semibold">
                            Exploration &amp; Filtrage territorial
                          </h4>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">
                            Recherche par métropoles (Douala, Yaoundé, Bafoussam, Kribi...), quartiers et styles de cuisine.
                          </p>
                        </div>
                      </div>

                      {/* Étape 3 */}
                      <div className="flex gap-space-md">
                        <div className="flex flex-col items-center">
                          <span className="w-7 h-7 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm flex items-center justify-center font-bold">
                            3
                          </span>
                          <div className="w-0.5 h-full bg-surface-container mt-space-xs"></div>
                        </div>
                        <div className="flex flex-col pb-space-sm">
                          <h4 className="font-label-lg text-label-lg text-on-surface font-semibold">
                            Consultation des fiches &amp; Zoom PDF
                          </h4>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">
                            Parcourez les menus du jour en temps réel avec détails des allergènes, prix en FCFA et visualisation plein écran.
                          </p>
                        </div>
                      </div>

                      {/* Étape 4 */}
                      <div className="flex gap-space-md">
                        <div className="flex flex-col items-center">
                          <span className="w-7 h-7 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm flex items-center justify-center font-bold">
                            4
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <h4 className="font-label-lg text-label-lg text-on-surface font-semibold">
                            Favoris &amp; Réservation notifiée
                          </h4>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">
                            Abonnez-vous aux alertes quotidiennes de vos tables préférées et réservez votre couvert avec confirmation directe.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/decouvrir"
                    className="inline-flex items-center justify-center gap-space-xs px-space-base py-space-sm rounded-xl font-label-md text-label-md bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors font-semibold"
                  >
                    <span>Explorer les fonctionnalités</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION CARACTÉRISTIQUES & FONCTIONNALITÉS CLÉS */}
          <section className="w-full bg-surface py-space-3xl" id="fonctionnalites">
            <div className="max-w-[1600px] mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop flex flex-col gap-space-2xl">
              <div className="flex flex-col gap-space-xs max-w-2xl">
                <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider font-semibold">
                  Conception technique &amp; utilitaire
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                  Des modules taillés pour les contraintes réelles du terrain
                </h2>
              </div>

              {/* Bento Grid 4 Piliers */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-space-lg">
                {/* Pilier 1 : Menus Interactifs */}
                <div className="lg:col-span-6 bg-surface-container-lowest p-space-xl rounded-xl shadow-sm flex flex-col justify-between gap-space-lg">
                  <div className="flex flex-col gap-space-sm">
                    <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-secondary text-[22px]">auto_stories</span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                      Menus du Jour Haute Performance
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                      Publication souple pour les restaurateurs : intégrez vos plats ligne par ligne avec étiquettes de catégories (Entrées, Plats de résistance, Desserts, Boissons) ou téléversez directement vos affiches scannées et fichiers PDF vectoriels avec visualiseur plein écran sans perte de netteté.
                    </p>
                  </div>

                  <div className="bg-surface-container-low p-space-md rounded-lg flex flex-col gap-space-sm">
                    <div className="flex items-center gap-space-xs flex-wrap">
                      <span className="px-space-xs py-space-2xs bg-secondary text-on-secondary rounded font-label-sm text-label-sm font-semibold">
                        Grillades
                      </span>
                      <span className="px-space-xs py-space-2xs bg-surface-container-lowest text-on-surface-variant rounded font-label-sm text-label-sm">
                        Spécialités Locales
                      </span>
                      <span className="px-space-xs py-space-2xs bg-surface-container-lowest text-on-surface-variant rounded font-label-sm text-label-sm">
                        Pâtisseries
                      </span>
                    </div>
                    <div className="flex items-center justify-between bg-surface-container-lowest p-space-sm rounded">
                      <div className="flex items-center gap-space-sm">
                        <span className="material-symbols-outlined text-secondary text-[20px]">picture_as_pdf</span>
                        <span className="font-body-sm text-body-sm text-on-surface font-medium">Carte_Semaine_Bonapriso.pdf</span>
                      </div>
                      <span className="font-label-sm text-label-sm text-secondary flex items-center gap-space-2xs font-semibold">
                        <span className="material-symbols-outlined text-[16px]">zoom_in</span> Zoom
                      </span>
                    </div>
                  </div>
                </div>

                {/* Pilier 2 : Gestion des Réservations */}
                <div className="lg:col-span-6 bg-surface-container-lowest p-space-xl rounded-xl shadow-sm flex flex-col justify-between gap-space-lg">
                  <div className="flex flex-col gap-space-sm">
                    <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-secondary text-[22px]">event_seat</span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                      Module de Réservations Déterministe
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                      Fini l'incertitude des messages éparpillés. Chaque demande est enregistrée avec le nombre de couverts, l'heure exacte et les requêtes spécifiques. Les restaurateurs valident ou rejettent en renseignant un motif explicite (salle complète, privatisation).
                    </p>
                  </div>

                  <div className="bg-surface-container-low p-space-md rounded-lg flex flex-col gap-space-xs">
                    <div className="flex items-center justify-between p-space-xs bg-surface-container-lowest rounded">
                      <div className="flex items-center gap-space-xs">
                        <span className="w-2 h-2 rounded-full bg-secondary"></span>
                        <span className="font-body-sm text-body-sm text-on-surface font-medium">Table 4 pers. • 13h00</span>
                      </div>
                      <span className="px-space-xs py-space-2xs rounded bg-surface-container text-on-surface font-label-sm text-label-sm font-semibold">
                        Confirmée
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-space-xs bg-surface-container-lowest rounded">
                      <div className="flex items-center gap-space-xs">
                        <span className="w-2 h-2 rounded-full bg-outline"></span>
                        <span className="font-body-sm text-body-sm text-on-surface font-medium">Table 2 pers. • 19h30</span>
                      </div>
                      <span className="px-space-xs py-space-2xs rounded bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm font-semibold">
                        En attente
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-space-xs bg-surface-container-lowest rounded">
                      <div className="flex items-center gap-space-xs">
                        <span className="w-2 h-2 rounded-full bg-error"></span>
                        <span className="font-body-sm text-body-sm text-on-surface font-medium">Table 8 pers. • 21h00</span>
                      </div>
                      <span className="px-space-xs py-space-2xs rounded bg-error-container text-on-error-container font-label-sm text-label-sm font-semibold">
                        Refusée (Complet)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Pilier 3 : Suivi & Notifications */}
                <div className="lg:col-span-6 bg-surface-container-lowest p-space-xl rounded-xl shadow-sm flex flex-col justify-between gap-space-lg">
                  <div className="flex flex-col gap-space-sm">
                    <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-secondary text-[22px]">favorite</span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                      Suivi d'Établissements &amp; Alertes
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                      Les clients ajoutent leurs restaurants favoris en un clic à leur carnet personnel. Dès que le gérant actualise son ardoise du midi, les abonnés reçoivent une alerte immédiate avec le contenu complet de la formule du jour.
                    </p>
                  </div>
                  <div className="bg-surface-container-low p-space-md rounded-lg flex items-center gap-space-md">
                    <div className="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary shrink-0">
                      <span className="material-symbols-outlined text-[24px]">notifications_active</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-md text-label-md text-on-surface font-bold">
                        Nouveau Menu chez La Fourchette d'Or
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        Publié à 11h15 : Saumon braisé &amp; Plantains tapés.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Pilier 4 : OpenStreetMap Indépendant */}
                <div className="lg:col-span-6 bg-surface-container-lowest p-space-xl rounded-xl shadow-sm flex flex-col justify-between gap-space-lg">
                  <div className="flex flex-col gap-space-sm">
                    <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-secondary text-[22px]">map</span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                      Cartographie Ouverte OpenStreetMap &amp; Leaflet
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                      Zéro dépendance à des clés API commerciales onéreuses ou instables. Vos restaurants sont positionnés via Leaflet et OpenStreetMap pour une navigation fluide, respectueuse des données personnelles et toujours accessible.
                    </p>
                  </div>
                  <div className="bg-surface-container-low p-space-md rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-space-sm">
                      <span className="material-symbols-outlined text-secondary text-[20px]">explore</span>
                      <div className="flex flex-col">
                        <span className="font-label-md text-label-md text-on-surface font-bold">
                          Yaoundé, Bastos • Coordonnées GPS
                        </span>
                        <span className="font-data-mono text-data-mono text-on-surface-variant">3.8872° N, 11.5174° E</span>
                      </div>
                    </div>
                    <span className="px-space-xs py-space-2xs bg-surface-container-lowest rounded font-label-sm text-label-sm text-on-surface font-semibold">
                      Sans frais API
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION MODÈLE ÉCONOMIQUE & TARIFICATION TRANSPARENTE */}
          <section className="w-full bg-surface-container-lowest py-space-3xl" id="tarifs">
            <div className="max-w-[1600px] mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop flex flex-col gap-space-2xl">
              <div className="flex flex-col items-center text-center gap-space-xs max-w-2xl mx-auto">
                <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider font-semibold">
                  Tarification Claire &amp; Sans Surprise
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                  Un modèle économique pensé pour la réalité des restaurateurs
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Aucun prélèvement sur vos ventes de repas. Les convives profitent de la plateforme sans débourser un centime.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-xl max-w-4xl mx-auto w-full">
                {/* Offre Client */}
                <div className="bg-surface-container-low rounded-xl p-space-xl flex flex-col justify-between gap-space-xl shadow-sm">
                  <div className="flex flex-col gap-space-md">
                    <div className="flex items-center justify-between">
                      <span className="font-label-lg text-label-lg text-on-surface uppercase tracking-wider font-bold">
                        Convives &amp; Visiteurs
                      </span>
                      <span className="px-space-xs py-space-2xs rounded bg-surface-container font-label-sm text-label-sm text-on-surface font-semibold">
                        Pour tous
                      </span>
                    </div>

                    <div className="flex items-baseline gap-space-xs">
                      <span className="font-display-lg text-display-lg text-on-surface font-extrabold">0</span>
                      <span className="font-headline-sm text-headline-sm text-on-surface-variant font-bold">FCFA</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">/ Toujours gratuit</span>
                    </div>

                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Recherchez, filtrez, consultez les ardoises du jour et réservez sans aucuns frais d'intermédiation ni publicité intrusive.
                    </p>

                    <div className="flex flex-col gap-space-xs pt-space-sm">
                      <div className="flex items-center gap-space-xs">
                        <span className="material-symbols-outlined text-secondary text-[18px]">check</span>
                        <span className="font-body-sm text-body-sm text-on-surface">Recherche par métropoles &amp; quartiers</span>
                      </div>
                      <div className="flex items-center gap-space-xs">
                        <span className="material-symbols-outlined text-secondary text-[18px]">check</span>
                        <span className="font-body-sm text-body-sm text-on-surface">Consultation des menus, photos &amp; PDF</span>
                      </div>
                      <div className="flex items-center gap-space-xs">
                        <span className="material-symbols-outlined text-secondary text-[18px]">check</span>
                        <span className="font-body-sm text-body-sm text-on-surface">Abonnement gratuit à vos restaurants favoris</span>
                      </div>
                      <div className="flex items-center gap-space-xs">
                        <span className="material-symbols-outlined text-secondary text-[18px]">check</span>
                        <span className="font-body-sm text-body-sm text-on-surface">Demandes de réservation avec suivi d'état</span>
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/inscription"
                    className="inline-flex items-center justify-center px-space-base py-space-md rounded-xl font-label-md text-label-md bg-surface-container-lowest text-on-surface shadow-sm hover:bg-surface-container transition-colors font-bold"
                  >
                    Créer mon profil client gratuit
                  </Link>
                </div>

                {/* Offre Restaurant Pro */}
                <div className="bg-surface-container-lowest rounded-xl p-space-xl flex flex-col justify-between gap-space-xl shadow-md relative border border-secondary/20">
                  <div className="absolute -top-3 right-space-base px-space-sm py-space-2xs rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm font-semibold tracking-wide uppercase shadow-sm">
                    7 Jours d'essai gratuit
                  </div>

                  <div className="flex flex-col gap-space-md">
                    <div className="flex items-center justify-between">
                      <span className="font-label-lg text-label-lg text-secondary uppercase tracking-wider font-bold">
                        Abonnement Restaurateur
                      </span>
                      <span className="px-space-xs py-space-2xs rounded bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-semibold">
                        Paiement LeekPay
                      </span>
                    </div>

                    <div className="flex items-baseline gap-space-xs">
                      <span className="font-display-lg text-display-lg text-on-surface font-extrabold">5 000</span>
                      <span className="font-headline-sm text-headline-sm text-on-surface-variant font-bold">FCFA</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">/ 30 jours</span>
                    </div>

                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Prenez en main la plateforme pendant 7 jours sans paiement. Poursuivez ensuite votre présence digitale pour 5 000 FCFA/mois sécurisés via LeekPay (Mobile Money / Cartes).
                    </p>

                    <div className="flex flex-col gap-space-xs pt-space-sm">
                      <div className="flex items-center gap-space-xs">
                        <span className="material-symbols-outlined text-secondary text-[18px]">check</span>
                        <span className="font-body-sm text-body-sm text-on-surface font-medium">Gestion illimitée des menus du jour</span>
                      </div>
                      <div className="flex items-center gap-space-xs">
                        <span className="material-symbols-outlined text-secondary text-[18px]">check</span>
                        <span className="font-body-sm text-body-sm text-on-surface font-medium">Module de réservation complet (acceptation/refus)</span>
                      </div>
                      <div className="flex items-center gap-space-xs">
                        <span className="material-symbols-outlined text-secondary text-[18px]">check</span>
                        <span className="font-body-sm text-body-sm text-on-surface font-medium">Support OpenStreetMap autonome</span>
                      </div>
                      <div className="flex items-center gap-space-xs">
                        <span className="material-symbols-outlined text-secondary text-[18px]">check</span>
                        <span className="font-body-sm text-body-sm text-on-surface font-medium">QR Code vitrine &amp; tables téléchargeable</span>
                      </div>
                      <div className="flex items-center gap-space-xs">
                        <span className="material-symbols-outlined text-secondary text-[18px]">check</span>
                        <span className="font-body-sm text-body-sm text-on-surface font-medium">Paiement localisé via LeekPay (MTN MoMo, Orange Money)</span>
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/inscription"
                    className="inline-flex items-center justify-center px-space-base py-space-md rounded-xl font-label-md text-label-md bg-secondary text-on-secondary shadow-sm hover:bg-secondary-container transition-colors font-bold"
                  >
                    Activer mes 7 jours offerts
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION PWA & ACCESSIBILITÉ MULTI-SUPPORTS */}
          <section className="w-full bg-surface-container-low py-space-3xl">
            <div className="max-w-[1600px] mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop">
              <div className="bg-surface-container-lowest rounded-xl p-space-xl md:p-space-2xl shadow-sm flex flex-col lg:flex-row items-center justify-between gap-space-xl">
                <div className="flex flex-col gap-space-sm max-w-xl">
                  <div className="inline-flex items-center gap-space-xs px-space-sm py-space-2xs rounded bg-surface-container w-fit">
                    <span className="material-symbols-outlined text-[18px] text-secondary">install_mobile</span>
                    <span className="font-label-sm text-label-sm text-on-surface font-semibold">
                      Technologie Progressive Web App (PWA)
                    </span>
                  </div>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                    Installez Menu du Jour directement sur votre écran d'accueil
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Sans passer par les magasins d'applications énergivores. Compatible avec tous les smartphones Android, iOS et postes de travail d'encaissement (PC, Mac, tablettes tactiles de caisse).
                  </p>
                  <div className="flex flex-wrap items-center gap-space-base pt-space-xs">
                    <div className="flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-secondary text-[20px]">offline_pin</span>
                      <span className="font-label-sm text-label-sm text-on-surface font-medium">Consultation hors-ligne partielle</span>
                    </div>
                    <div className="flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-secondary text-[20px]">speed</span>
                      <span className="font-label-sm text-label-sm text-on-surface font-medium">Chargement ultra-léger (&lt; 1 Mo)</span>
                    </div>
                    <div className="flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-secondary text-[20px]">devices</span>
                      <span className="font-label-sm text-label-sm text-on-surface font-medium">Responsive tous formats</span>
                    </div>
                  </div>
                </div>

                {/* Badge & Guide d'installation rapide */}
                <div className="bg-surface-container p-space-lg rounded-xl flex flex-col gap-space-md w-full lg:w-auto min-w-[320px]">
                  <span className="font-label-md text-label-md text-on-surface uppercase tracking-wider font-bold">
                    Comment l'installer ?
                  </span>
                  <div className="flex items-start gap-space-sm">
                    <span className="font-headline-sm text-headline-sm text-secondary font-bold">1</span>
                    <p className="font-body-sm text-body-sm text-on-surface">
                      Ouvrez le site sur votre navigateur mobile (Chrome, Safari, Firefox).
                    </p>
                  </div>
                  <div className="flex items-start gap-space-sm">
                    <span className="font-headline-sm text-headline-sm text-secondary font-bold">2</span>
                    <p className="font-body-sm text-body-sm text-on-surface">
                      Appuyez sur le bouton de partage ou le menu « Options ».
                    </p>
                  </div>
                  <div className="flex items-start gap-space-sm">
                    <span className="font-headline-sm text-headline-sm text-secondary font-bold">3</span>
                    <p className="font-body-sm text-body-sm text-on-surface">
                      Sélectionnez « Ajouter à l'écran d'accueil ».
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION CTA FINAL & CONTACT WHATSAPP OFFICIEL */}
          <section className="w-full bg-surface-container-lowest py-space-3xl" id="cta-final">
            <div className="max-w-[1600px] mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop">
              <div className="bg-primary text-on-primary rounded-xl p-space-xl md:p-space-2xl flex flex-col lg:flex-row items-center justify-between gap-space-xl shadow-lg relative overflow-hidden">
                <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-secondary/20 blur-2xl pointer-events-none"></div>
                <div className="flex flex-col gap-space-sm max-w-2xl relative z-10">
                  <span className="font-label-sm text-label-sm text-secondary-fixed uppercase tracking-wider font-semibold">
                    Rejoignez le réseau
                  </span>
                  <h2 className="font-display-lg text-display-lg text-on-primary font-bold">
                    Faites rayonner votre table ou trouvez votre prochain repas dès aujourd'hui
                  </h2>
                  <p className="font-body-md text-body-md text-on-primary-container max-w-lg">
                    Démarrez vos 7 jours d'essai sans engagement ou échangez directement avec notre équipe technique basée à Douala pour un accompagnement sur mesure.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row lg:flex-col gap-space-sm w-full lg:w-auto relative z-10">
                  <Link
                    to="/inscription"
                    className="inline-flex items-center justify-center gap-space-xs px-space-lg py-space-md rounded-xl font-label-lg text-label-lg bg-secondary text-on-secondary shadow-sm hover:bg-secondary-container transition-colors font-bold"
                  >
                    <span className="material-symbols-outlined text-[20px]">add_business</span>
                    <span>Inscrire mon établissement</span>
                  </Link>
                  <a
                    className="inline-flex items-center justify-center gap-space-xs px-space-lg py-space-md rounded-xl font-label-lg text-label-lg bg-surface-container-lowest text-primary shadow-sm hover:bg-surface-container-low transition-colors font-bold"
                    href="https://wa.me/237658352129"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <span className="material-symbols-outlined text-secondary text-[20px]">chat</span>
                    <span>WhatsApp : +237 658 35 21 29</span>
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}
