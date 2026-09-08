export type Language = 'fr' | 'en'

export interface SeoMetadata {
  title: string
  description: string
}

export const translations = {
  fr: {
    meta: {
      home: {
        title: 'Menu du Jour — La Plateforme SaaS des Restaurants',
        description: 'Menu du Jour est la plateforme SaaS complète permettant aux restaurants de publier leurs menus du jour, gérer leurs réservations et fidéliser leurs clients.',
      },
      about: {
        title: 'À propos — Menu du Jour SaaS',
        description: 'Découvrez la mission de Menu du Jour : digitaliser l’expérience des restaurants et faciliter l’accès aux menus quotidiens.',
      },
      engage: {
        title: 'Rejoindre la plateforme — Menu du Jour pour Restaurateurs',
        description: 'Développez la visibilité et la fréquentation de votre restaurant grâce à Menu du Jour. Essayez gratuitement pendant 7 jours.',
      },
      pricing: {
        title: 'Tarifs professionnels — Menu du Jour SaaS',
        description: 'Tarif clair et accessible pour les restaurants : 7 jours d’essai gratuit puis 5 000 FCFA / 30 jours sans engagement.',
      },
      contact: {
        title: 'Contactez-nous — Menu du Jour SaaS',
        description: 'Une question ou besoin d’aide pour inscrire votre restaurant ? Contactez l’équipe Menu du Jour par formulaire ou WhatsApp.',
      },
    },
    nav: {
      home: 'Accueil',
      about: 'À propos',
      engage: 'Engagez-nous',
      pricing: 'Tarifs',
      contact: 'Contact',
      signUp: 'S\'inscrire',
      signIn: 'Connexion',
      startFree: 'Commencer gratuitement',
      dashboard: 'Mon espace',
      signOut: 'Déconnexion',
      pwaInstall: 'Installer l\'application',
    },
    hero: {
      badge: 'Plateforme SaaS pour Restaurants & Gastronomie',
      title: 'Le digital au service de votre restaurant',
      subtitle: 'Simplifiez la publication de vos menus quotidiens, attirez de nouveaux gourmets et gérez vos réservations en toute simplicité.',
      ctaPrimary: 'Commencer gratuitement',
      ctaSecondary: 'Découvrir comment ça marche',
      trialBadge: '7 jours d\'essai gratuit • Sans engagement',
    },
    presentation: {
      tag: 'Présentation',
      title: 'Qu’est-ce que Menu du Jour ?',
      text1: 'Menu du Jour est la solution logicielle clé en main conçue pour réinventer la communication quotidienne entre les restaurateurs et leurs clients.',
      text2: 'Fini les ardoises manuscrites illisibles et la mise à jour complexe de sites obsolètes. Menu du Jour vous permet de publier en quelques secondes vos suggestions quotidiennes, d\'ajouter des visuels attrayants et d\'offrir la réservation en ligne à vos convives.',
    },
    features: {
      tag: 'Fonctionnalités clés',
      title: 'Tout ce dont votre établissement a besoin',
      subtitle: 'Des outils pensés par et pour des professionnels de la restauration.',
      items: [
        {
          title: 'Gestion de l’établissement',
          description: 'Configurez la fiche de votre restaurant, vos horaires d’ouverture et vos coordonnées géographiques.',
        },
        {
          title: 'Publication instantanée des menus',
          description: 'Publiez votre menu du jour en quelques clics (entrées, plats, desserts, formules et prix).',
        },
        {
          title: 'Galerie de photos haute définition',
          description: 'Mettez l’eau à la bouche de vos clients en ajoutant des photos représentatives de vos créations.',
        },
        {
          title: 'Suivi privilégié par les clients',
          description: 'Permettez aux amateurs de bonne cuisine de suivre gratuitement votre établissement.',
        },
        {
          title: 'Gestion des réservations en ligne',
          description: 'Recevez les demandes de réservations et validez-les ou refusez-les manuellement depuis votre tableau de bord.',
        },
        {
          title: 'Statistiques & Historique complet',
          description: 'Suivez la fréquentation de vos menus publiés, l’évolution de vos réservations et vos performances.',
        },
      ],
    },
    howItWorks: {
      tag: 'Fonctionnement',
      title: 'Comment fonctionne Menu du Jour ?',
      subtitle: 'Une expérience fluide pour les restaurateurs comme pour les clients.',
      restaurantTitle: 'Pour les Restaurateurs',
      restaurantSteps: [
        { step: '01', title: 'Créer un compte', desc: 'Inscrivez-vous en 1 minute et bénéficiez immédiatement de 7 jours d\'essai gratuit.' },
        { step: '02', title: 'Configurer le restaurant', desc: 'Renseignez le nom, la ville, l\'adresse, les horaires et les informations de votre établissement.' },
        { step: '03', title: 'Publier le menu', desc: 'Ajoutez les suggestions du jour avec accompagnements et photos en quelques secondes.' },
        { step: '04', title: 'Recevoir les réservations', desc: 'Consultez et validez manuellement les réservations reçues sur votre tableau de bord.' },
      ],
      clientTitle: 'Pour les Clients & Gourmets',
      clientSteps: [
        { step: '01', title: 'Créer un compte client', desc: 'Inscrivez-vous gratuitement pour débloquer toutes les fonctionnalités.' },
        { step: '02', title: 'Découvrir les restaurants', desc: 'Parcourez les établissements disponibles et recherchez par nom ou par ville.' },
        { step: '03', title: 'Suivre vos favoris', desc: 'Suivez gratuitement vos établissements préférés pour consulter facilement leurs menus.' },
        { step: '04', title: 'Réserver une table', desc: 'Choisissez votre créneau horaire et demandez une réservation directement en ligne.' },
      ],
    },
    whyUs: {
      tag: 'Pourquoi nous choisir ?',
      title: 'Pourquoi adopter Menu du Jour ?',
      subtitle: 'Conçu pour maximiser votre taux de remplissage et votre visibilité locale.',
      reasons: [
        { title: 'Visibilité accrue', desc: 'Rendez votre carte du jour accessible instantanément sur mobile et ordinateur.' },
        { title: 'Gain de temps précieux', desc: 'Publiez vos menus en moins de 60 secondes depuis votre smartphone.' },
        { title: 'Zéro commission', desc: 'Conservez 100% de votre chiffre d’affaires sur chaque réservation.' },
        { title: 'PWA Moderne', desc: 'Vos clients installent l’application directement sans passer par l’App Store ou Google Play.' },
      ],
    },
    visual: {
      tag: 'Aperçu du produit',
      title: 'Une interface pensée pour la simplicité',
      subtitle: 'Découvrez l’expérience visuelle proposée aux restaurateurs et à leurs clients.',
    },
    pricing: {
      tag: 'Tarification simple',
      title: 'Un tarif unique, transparent et sans engagement',
      subtitle: 'Commencez par un essai complet et gratuit de 7 jours.',
      planName: 'Abonnement Professionnel Restaurant',
      trialText: '7 jours offerts',
      trialDesc: 'Accès complet à toutes les fonctionnalités dès la création du compte.',
      price: '5 000 FCFA',
      period: '/ 30 jours',
      includesTitle: 'Ce qui est inclus :',
      features: [
        'Publication illimitée de menus du jour',
        'Gestion complète de la fiche et des horaires',
        'Galerie de photos sur les menus',
        'Module de réservation en ligne intégré',
        'Suivi gratuit par vos clients',
        'Historique complet des réservations et statistiques',
        'Support technique dédié par WhatsApp',
      ],
      cta: 'Commencer gratuitement',
    },
    faq: {
      tag: 'Faq',
      title: 'Questions fréquemment posées',
      subtitle: 'Retrouvez les réponses à vos interrogations sur la plateforme SaaS.',
      items: [
        {
          q: 'Comment fonctionne l’essai gratuit de 7 jours ?',
          a: 'Dès la création de votre compte restaurant, vous bénéficiez immédiatement et automatiquement de 7 jours d’accès complet à toutes les fonctionnalités sans carte bancaire.',
        },
        {
          q: 'Combien coûte l’abonnement après l’essai gratuit ?',
          a: 'L’abonnement professionnel est fixé au tarif unique de 5 000 FCFA par période de 30 jours pour chaque restaurant.',
        },
        {
          q: 'Les clients doivent-ils payer pour réserver ou suivre un restaurant ?',
          a: 'Non, l’utilisation de Menu du Jour par les clients est 100% gratuite (découverte, suivi et réservation).',
        },
        {
          q: 'Comment installer l’application PWA ?',
          a: 'Sur votre smartphone ou ordinateur, cliquez sur le bouton "Installer l’application" présent sur le site ou utilisez l’option d’installation de votre navigateur (Chrome, Safari, Edge).',
        },
        {
          q: 'Comment sont gérées les demandes de réservations ?',
          a: 'Les clients soumettent leur demande avec la date, l’heure et le nombre de convives. Vous recevez la demande sur votre tableau de bord où vous pouvez la confirmer ou la refuser avec motif.',
        },
      ],
    },
    finalCta: {
      title: 'Prêt à faire passer votre restaurant au digital ?',
      subtitle: 'Créez votre compte en 1 minute et commencez votre essai gratuit de 7 jours immédiatement.',
      cta: 'Commencer gratuitement',
    },
    aboutPage: {
      title: 'À propos de Menu du Jour',
      subtitle: 'Notre mission : rapprocher les restaurateurs et leurs convives grâce au digital.',
      missionTitle: 'Notre Mission',
      missionText: 'Proposer aux restaurateurs une solution SaaS simple, élégante et accessible pour valoriser leur savoir-faire culinaire quotidien et simplifier la réservation de tables.',
      visionTitle: 'Notre Vision',
      visionText: 'Faire du numérique un levier de croissance pour tous les restaurants locaux, en éliminant les intermédiaires coûteux et les commissions abusives.',
      valuesTitle: 'Nos Valeurs',
      values: [
        { title: 'Simplicité', desc: 'Des outils intuitifs utilisables depuis n\'importe quel smartphone en cuisine ou en salle.' },
        { title: 'Transparence', desc: 'Un tarif clair et abordable sans frais cachés ni commissions sur les réservations.' },
        { title: 'Proximité', desc: 'Un accompagnement réactif pour aider les établissements à réussir leur virage numérique.' },
      ],
    },
    engagePage: {
      title: 'Engagez-nous pour votre restaurant',
      subtitle: 'La solution digitale complète pour développer votre clientèle et optimiser votre taux de remplissage.',
      whyTitle: 'Pourquoi les restaurateurs choisissent Menu du Jour ?',
      benefits: [
        { title: 'Mise en avant de votre ardoise', desc: 'Vos clients savent exactement ce que vous cuisinez aujourd’hui.' },
        { title: 'Réservations sans commission', desc: 'Recevez et gérez vos réservations directement sur votre espace sans aucun frais supplémentaire.' },
        { title: 'Fidélisation active', desc: 'Vos clients suivent votre établissement pour ne manquer aucune nouveauté.' },
      ],
      stepsTitle: 'Comment rejoindre la plateforme ?',
      steps: [
        'Cliquez sur "Commencer gratuitement" et créez votre compte gestionnaire.',
        'Renseignez la fiche de votre restaurant, vos horaires et votre adresse.',
        'Publiez votre premier menu du jour avec vos plats et photos.',
        'Partagez votre lien ou votre QR code et recevez vos premières réservations !',
      ],
      ctaPrimary: 'Commencer gratuitement (7 jours offerts)',
      ctaSecondary: 'Nous contacter par WhatsApp',
    },
    contactPage: {
      title: 'Contactez l’équipe Menu du Jour',
      subtitle: 'Une question, un besoin d’accompagnement ou une demande spécifique ? Nous sommes à votre écoute.',
      formTitle: 'Envoyez-nous un message',
      nameLabel: 'Nom complet',
      emailLabel: 'Adresse email',
      subjectLabel: 'Sujet',
      messageLabel: 'Message',
      sendButton: 'Envoyer le message',
      whatsappTitle: 'Assistance WhatsApp directe',
      whatsappDesc: 'Discutez directement avec notre équipe support sur WhatsApp :',
      whatsappButton: 'Discuter sur WhatsApp (+237 658 35 21 29)',
      successMessage: 'Votre message a été envoyé avec succès. Notre équipe vous répondra dans les plus brefs délais.',
    },
    notFound: {
      title: 'Page non trouvée (404)',
      subtitle: 'Désolé, la page que vous recherchez n’existe pas ou a été déplacée.',
      backHome: 'Retourner à l’accueil',
    },
  },
  en: {
    meta: {
      home: {
        title: 'Menu du Jour — Restaurant SaaS Platform',
        description: 'Menu du Jour is the complete SaaS platform for restaurants to publish daily menus, manage online reservations, and build customer loyalty.',
      },
      about: {
        title: 'About Us — Menu du Jour SaaS',
        description: 'Discover the mission of Menu du Jour: digitizing the restaurant experience and making daily menus easily accessible.',
      },
      engage: {
        title: 'Join the Platform — Menu du Jour for Restaurateurs',
        description: 'Grow your restaurant’s visibility and foot traffic with Menu du Jour. Enjoy a 7-day free trial.',
      },
      pricing: {
        title: 'Professional Pricing — Menu du Jour SaaS',
        description: 'Transparent and affordable pricing for restaurants: 7 days free trial, then 5,000 FCFA / 30 days without commitment.',
      },
      contact: {
        title: 'Contact Us — Menu du Jour SaaS',
        description: 'Have a question or need help registering your restaurant? Contact the Menu du Jour team via form or WhatsApp.',
      },
    },
    nav: {
      home: 'Home',
      about: 'About',
      engage: 'Hire Us',
      pricing: 'Pricing',
      contact: 'Contact',
      signUp: 'Sign Up',
      signIn: 'Sign In',
      startFree: 'Start for Free',
      dashboard: 'My Dashboard',
      signOut: 'Sign Out',
      pwaInstall: 'Install App',
    },
    hero: {
      badge: 'SaaS Platform for Restaurants & Dining',
      title: 'Digital empowerment for your restaurant',
      subtitle: 'Effortlessly publish your daily menus, attract local foodies, and manage online table reservations.',
      ctaPrimary: 'Start for Free',
      ctaSecondary: 'See How It Works',
      trialBadge: '7-Day Free Trial • No Commitment',
    },
    presentation: {
      tag: 'Overview',
      title: 'What is Menu du Jour?',
      text1: 'Menu du Jour is a turnkey software solution designed to reinvent daily communication between restaurateurs and their guests.',
      text2: 'Say goodbye to illegible chalkboards and outdated websites. Menu du Jour enables you to publish daily specials in seconds, attach appetizing photos, and accept online table reservations.',
    },
    features: {
      tag: 'Key Features',
      title: 'Everything your restaurant needs',
      subtitle: 'Built by and for hospitality professionals.',
      items: [
        {
          title: 'Restaurant Management',
          description: 'Set up your restaurant profile, opening hours, and location details.',
        },
        {
          title: 'Instant Daily Menu Publishing',
          description: 'Publish your daily specials in a few clicks (starters, mains, desserts, combo deals, and prices).',
        },
        {
          title: 'High-Resolution Photo Gallery',
          description: 'Whet your customers’ appetite by showcasing photos of your culinary creations.',
        },
        {
          title: 'Customer Following',
          description: 'Allow food lovers to follow your restaurant for free.',
        },
        {
          title: 'Online Reservation Management',
          description: 'Receive table requests and manually confirm or decline them from your dashboard.',
        },
        {
          title: 'Analytics & Full History',
          description: 'Track menu views, reservation trends, and performance stats over time.',
        },
      ],
    },
    howItWorks: {
      tag: 'Workflow',
      title: 'How does Menu du Jour work?',
      subtitle: 'A seamless experience for both restaurateurs and guests.',
      restaurantTitle: 'For Restaurateurs',
      restaurantSteps: [
        { step: '01', title: 'Create an Account', desc: 'Register in 1 minute and enjoy a 7-day free trial right away.' },
        { step: '02', title: 'Configure Restaurant', desc: 'Add your restaurant name, city, address, operating hours, and details.' },
        { step: '03', title: 'Publish Daily Menu', desc: 'Upload daily specials with descriptions, accompaniments, and photos.' },
        { step: '04', title: 'Receive Reservations', desc: 'Review and confirm customer booking requests directly on your dashboard.' },
      ],
      clientTitle: 'For Guests & Foodies',
      clientSteps: [
        { step: '01', title: 'Create Guest Account', desc: 'Sign up for free to unlock all interactive features.' },
        { step: '02', title: 'Discover Restaurants', desc: 'Browse available local restaurants and search by name or city.' },
        { step: '03', title: 'Follow Favorites', desc: 'Follow your favorite dining spots for free to easily view their daily menus.' },
        { step: '04', title: 'Book a Table', desc: 'Select your preferred date and time slot to request a reservation online.' },
      ],
    },
    whyUs: {
      tag: 'Why Choose Us?',
      title: 'Why adopt Menu du Jour?',
      subtitle: 'Designed to boost your occupancy rate and local online visibility.',
      reasons: [
        { title: 'Increased Visibility', desc: 'Make your daily specials accessible instantly on mobile and desktop.' },
        { title: 'Save Valuable Time', desc: 'Publish your menu in under 60 seconds directly from your smartphone.' },
        { title: 'Zero Commissions', desc: 'Keep 100% of your revenue on every table reservation.' },
        { title: 'Modern PWA App', desc: 'Guests install the app directly without going through App Store or Google Play.' },
      ],
    },
    visual: {
      tag: 'Product Preview',
      title: 'An interface designed for simplicity',
      subtitle: 'Explore the intuitive user experience for restaurateurs and guests.',
    },
    pricing: {
      tag: 'Transparent Pricing',
      title: 'Simple, flat pricing with no commitment',
      subtitle: 'Get started with a full 7-day free trial.',
      planName: 'Professional Restaurant Plan',
      trialText: '7 Days Free',
      trialDesc: 'Full access to all platform features upon sign-up.',
      price: '5,000 FCFA',
      period: '/ 30 days',
      includesTitle: 'What\'s included:',
      features: [
        'Unlimited daily menu publishing',
        'Full profile and opening hours management',
        'Photo gallery attached to daily menus',
        'Integrated online reservation module',
        'Free customer following system',
        'Complete reservation history & analytics',
        'Dedicated WhatsApp customer support',
      ],
      cta: 'Start for Free',
    },
    faq: {
      tag: 'Faq',
      title: 'Frequently Asked Questions',
      subtitle: 'Find answers to common questions about our SaaS platform.',
      items: [
        {
          q: 'How does the 7-day free trial work?',
          a: 'Upon creating your restaurant manager account, you automatically receive 7 days of unrestricted access without requiring a credit card.',
        },
        {
          q: 'How much does the subscription cost after the trial?',
          a: 'The professional subscription is a flat rate of 5,000 FCFA per 30-day period for each restaurant.',
        },
        {
          q: 'Do guests pay to follow or book a table?',
          a: 'No, Menu du Jour is 100% free for guests (discovery, following, and reservations).',
        },
        {
          q: 'How do I install the PWA app?',
          a: 'On your mobile or desktop browser, click the "Install App" button or use your browser’s install option (Chrome, Safari, Edge).',
        },
        {
          q: 'How are table reservation requests managed?',
          a: 'Guests submit requests with date, time, and party size. You receive them on your dashboard where you can manually accept or decline them.',
        },
      ],
    },
    finalCta: {
      title: 'Ready to take your restaurant digital?',
      subtitle: 'Create your account in 1 minute and start your 7-day free trial immediately.',
      cta: 'Start for Free',
    },
    aboutPage: {
      title: 'About Menu du Jour',
      subtitle: 'Our mission: connecting restaurateurs with their guests through digital innovation.',
      missionTitle: 'Our Mission',
      missionText: 'Providing restaurateurs with a simple, elegant, and affordable SaaS solution to highlight their daily culinary creations and streamline table bookings.',
      visionTitle: 'Our Vision',
      visionText: 'Making digital technology a growth driver for local restaurants by eliminating expensive intermediaries and unfair commissions.',
      valuesTitle: 'Our Core Values',
      values: [
        { title: 'Simplicity', desc: 'Intuitive tools accessible from any smartphone in the kitchen or dining hall.' },
        { title: 'Transparency', desc: 'Clear, affordable pricing with no hidden fees or reservation commissions.' },
        { title: 'Proximity', desc: 'Responsive support to help local dining spots succeed in their digital transition.' },
      ],
    },
    engagePage: {
      title: 'Partner with Menu du Jour for Your Restaurant',
      subtitle: 'The complete digital solution to grow your clientele and optimize table bookings.',
      whyTitle: 'Why Restaurateurs Choose Menu du Jour',
      benefits: [
        { title: 'Highlight Your Daily Specials', desc: 'Your guests know exactly what you are cooking today.' },
        { title: 'Commission-Free Bookings', desc: 'Receive and manage reservations on your own space with zero booking fees.' },
        { title: 'Active Customer Retention', desc: 'Guests follow your venue so they never miss a new daily menu.' },
      ],
      stepsTitle: 'How to Join the Platform?',
      steps: [
        'Click "Start for Free" and create your manager account.',
        'Fill in your restaurant details, opening hours, and address.',
        'Publish your first daily menu with dishes and photos.',
        'Share your link or QR code and start receiving reservations!',
      ],
      ctaPrimary: 'Start for Free (7 Days Included)',
      ctaSecondary: 'Contact Us on WhatsApp',
    },
    contactPage: {
      title: 'Contact the Menu du Jour Team',
      subtitle: 'Have a question or need onboarding support? We are here to help.',
      formTitle: 'Send Us a Message',
      nameLabel: 'Full Name',
      emailLabel: 'Email Address',
      subjectLabel: 'Subject',
      messageLabel: 'Message',
      sendButton: 'Send Message',
      whatsappTitle: 'Direct WhatsApp Support',
      whatsappDesc: 'Chat directly with our support team on WhatsApp:',
      whatsappButton: 'Chat on WhatsApp (+237 658 35 21 29)',
      successMessage: 'Your message has been sent successfully. Our team will get back to you shortly.',
    },
    notFound: {
      title: 'Page Not Found (404)',
      subtitle: 'Sorry, the page you are looking for does not exist or has been moved.',
      backHome: 'Back to Home',
    },
  },
}

export type Translations = typeof translations.fr

