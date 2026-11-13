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
