import React from 'react'
import { Link } from 'react-router-dom'

export const PublicFooter: React.FC = () => {
  const logoUrl =
    'https://lh3.googleusercontent.com/aida/AEtjO1UTt-dNa22cOeXEs7v8x9kOXhf2TxxgJonsL9_Oz5pDK6exz46Abxlmk4aUjK6aMeQRY1FFDioZKZP0kw7opI2le25btUY1uLfxKvHQhg4X3EZbh7VOEARmjDnC66zmZg0__BNzLHIi10bixPDXHyAl4D-Y0z1X_X3AFBpIazoPOEkhVVJID4rB4uYDKC48ourRAOOrQOhFzanyXMH7k66usylb-1s8WQxnS034eNhV2C6lvKgE5MQ3sDI'

  return (
    <footer className="w-full bg-surface-container-low mt-auto border-t border-outline-variant/30">
      <div className="max-w-[1600px] mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop py-space-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-space-xl">
          {/* Colonne 1 & 2 : Marque & WhatsApp */}
          <div className="lg:col-span-2 flex flex-col gap-space-md">
            <div className="flex items-center gap-space-sm">
              <img
                alt="Menu du Jour Logo"
                className="h-8 w-auto object-contain"
                src={logoUrl}
              />
              <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-display">
                Menu du Jour
              </span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
              Plateforme SaaS de gestion et de publication de menus digitaux pour restaurants d'Afrique Francophone et internationaux. Précision opérationnelle, QR codes dynamiques et commande fluide en FCFA (XAF).
            </p>
            <div className="flex items-center gap-space-sm pt-space-xs">
              <span className="material-symbols-outlined text-secondary text-[20px]">chat</span>
              <span className="font-label-md text-label-md text-on-surface">WhatsApp Officiel :</span>
              <a
                className="font-data-mono text-data-mono text-secondary hover:underline font-semibold"
                href="https://wa.me/237658352129"
                rel="noopener noreferrer"
                target="_blank"
              >
                +237 658 35 21 29
              </a>
            </div>
          </div>

          {/* Colonne 3 : Navigation */}
          <div className="flex flex-col gap-space-sm">
            <h4 className="font-label-lg text-label-lg text-on-surface uppercase tracking-wider font-semibold">
              Navigation
            </h4>
            <Link className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors" to="/">
              Accueil
            </Link>
            <Link className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors" to="/a-propos">
              À propos
            </Link>
            <Link className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors" to="/engagez-nous">
              Engagez-nous
            </Link>
            <Link className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors" to="/tarifs">
              Tarifs &amp; Devis
            </Link>
            <Link className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors" to="/contact">
              Contact
            </Link>
          </div>

          {/* Colonne 4 : Portails & Espaces */}
          <div className="flex flex-col gap-space-sm">
            <h4 className="font-label-lg text-label-lg text-on-surface uppercase tracking-wider font-semibold">
              Portails &amp; Espaces
            </h4>
            <Link className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors" to="/espace-client">
              Espace Client &amp; Commandes
            </Link>
            <Link className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors" to="/espace-restaurant">
              Espace Restaurant &amp; Admin
            </Link>
            <Link className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors" to="/decouvrir">
              Carte Interactive &amp; QR
            </Link>
            <Link className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors" to="/connexion">
              Accès Collaborateur
            </Link>
          </div>

          {/* Colonne 5 : Légal & Support */}
          <div className="flex flex-col gap-space-sm">
            <h4 className="font-label-lg text-label-lg text-on-surface uppercase tracking-wider font-semibold">
              Légal &amp; Support
            </h4>
            <Link className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors" to="/a-propos">
              Mentions Légales
            </Link>
            <Link className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors" to="/a-propos">
              Politique de Confidentialité
            </Link>
            <Link className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors" to="/tarifs">
              CGU &amp; CGV
            </Link>
            <span className="font-body-sm text-body-sm text-on-surface-variant mt-space-sm">
              Douala &amp; Yaoundé, Cameroun
            </span>
          </div>
        </div>

        {/* Ligne inférieure */}
        <div className="mt-space-2xl pt-space-lg flex flex-col md:flex-row items-center justify-between gap-space-md border-t border-outline-variant/30">
          <p className="font-body-sm text-body-sm text-on-surface-variant text-center md:text-left">
            © 2024 Menu du Jour. Tous droits réservés. Conçu pour la gastronomie africaine et internationale.
          </p>
          <div className="flex items-center gap-space-base">
            <span className="inline-flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant">
              <span className="w-2 h-2 rounded-full bg-secondary-container"></span>
              Systèmes Opérationnels (XAF)
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
