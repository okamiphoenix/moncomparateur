typescript
export const siteConfig = {
  name: "PrixCarbu & Bornes",
  domain: "https://ton-domaine.fr",
  description: "Comparateur en temps réel des prix des carburants et des bornes de recharge électrique (IRVE) partout en France.",
  
  // Identité visuelle & Logo
  logoUrl: "", // Mets l'URL de ton logo ici plus tard, sinon le logo texte moderne s'affiche
  logoAlt: "Logo Comparateur Carburant et Bornes Électriques",

  // Bannière image à la volée sous le Header
  topBanner: {
    enabled: false, // Passe à true pour afficher la bannière
    imageUrl: "",
    targetUrl: "https://ton-lien.fr",
    altText: "Offre partenaire mobilité",
    isSponsored: true,
  },

  // Monétisation Google AdSense
  adsenseEnabled: false, // Passe à true quand ton compte AdSense est validé
  publisherId: "ca-pub-0000000000000000", // Remplace par ton ID éditeur AdSense
  slots: {
    slotHeader: "1111111111",
    slotSimulator: "2222222222",
    slotInFeed: "3333333333",
    slotSidebar: "4444444444",
    slotFooter: "5555555555",
  },

  // Liens d'affiliation (badges télépéage, cartes recharge, assurance auto...)
  affiliation: {
    carteRechargeUrl: "https://ton-lien-affilie-recharge.fr",
    telepeageUrl: "https://ton-lien-affilie-telepeage.fr",
  },

  // Informations pour les Mentions Légales & CGU
  legal: {
    editeur: "Nom de ta société ou ton nom",
    statut: "Auto-entrepreneur / SAS",
    adresse: "1 rue de la République, 75001 Paris",
    email: "contact@ton-domaine.fr",
    hebergeur: "Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis",
  },
};
