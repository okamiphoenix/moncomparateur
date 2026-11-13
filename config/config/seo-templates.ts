typescript
export const CARBURANTS_LABELS: Record<string, string> = {
  gazole: "Gazole (Diesel)",
  sp95: "Sans Plomb 95 (SP95)",
  sp98: "Sans Plomb 98 (SP98)",
  e10: "Sans Plomb 95-E10",
  e85: "Superéthanol E85",
  gplc: "GPLc",
};

export const RECHARGE_FILTRES_LABELS: Record<string, string> = {
  rapide: "Recharge rapide et ultra-rapide (> 50 kW)",
  gratuite: "Bornes de recharge gratuites",
  toutes: "Toutes les bornes de recharge électrique (IRVE)",
};

export function getVilleSeo(villeNom: string, codePostal: string, departement: string, dateStr: string) {
  return {
    title: `Prix carburant et bornes de recharge à ${villeNom} (${codePostal}) - ${dateStr}`,
    description: `Comparez en temps réel les prix des carburants (Gazole, SP95, E10, E85) et trouvez les bornes de recharge électrique les moins chères à ${villeNom} (${departement}).`,
    h1: `Carburants et bornes électriques à ${villeNom} (${codePostal})`,
    faq: [
      {
        question: `Où trouver le carburant le moins cher à ${villeNom} aujourd'hui ?`,
        answer: `Notre comparateur classe automatiquement toutes les stations-service de ${villeNom} (${codePostal}) du prix au litre le plus bas au plus élevé grâce aux données officielles mises à jour toutes les 2 heures.`,
      },
      {
        question: `Combien coûtent les bornes de recharge électrique à ${villeNom} ?`,
        answer: `Les tarifs des bornes IRVE à ${villeNom} varient selon la puissance (AC 22 kW ou DC rapide) et l'opérateur. Comparez chaque point de charge ainsi que le coût équivalent d'une recharge à domicile au Tarif Bleu EDF.`,
      },
    ],
  };
}

export function getCarburantVilleSeo(type: string, villeNom: string, codePostal: string, dateStr: string) {
  const label = CARBURANTS_LABELS[type.toLowerCase()] || type.toUpperCase();
  return {
    title: `Prix ${label} à ${villeNom} (${codePostal}) aujourd'hui - ${dateStr}`,
    description: `Classement des stations-service vendant du ${label} au meilleur prix à ${villeNom} (${codePostal}). Horaires, adresse et itinéraire GPS en un clic.`,
    h1: `Prix du ${label} à ${villeNom} (${codePostal})`,
  };
}

export function getRechargeVilleSeo(filtre: string, villeNom: string, codePostal: string, dateStr: string) {
  const label = RECHARGE_FILTRES_LABELS[filtre.toLowerCase()] || "Bornes de recharge électrique";
  return {
    title: `${label} à ${villeNom} (${codePostal}) - Carte et tarifs ${dateStr}`,
    description: `Localisez les ${label.toLowerCase()} disponibles à ${villeNom} (${codePostal}). Puissance en kW, type de prise (Type 2, Combo CCS) et tarifs.`,
    h1: `${label} à ${villeNom} (${codePostal})`,
  };
}

export function getDepartementSeo(code: string, nomDept: string, dateStr: string) {
  return {
    title: `Prix carburant et bornes IRVE dans le département ${nomDept} (${code}) - ${dateStr}`,
    description: `Toutes les stations-service les moins chères et les bornes de recharge électrique dans le ${nomDept} (${code}). Accès direct par commune.`,
    h1: `Carburants & Recharge Électrique : ${nomDept} (${code})`,
  };
}
