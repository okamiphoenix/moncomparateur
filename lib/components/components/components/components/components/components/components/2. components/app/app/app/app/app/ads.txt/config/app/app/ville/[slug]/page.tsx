tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getStationsByVille, getBornesByVille, isValidSlug } from "@/lib/opendata";
import { getVilleSeo, CARBURANTS_LABELS, RECHARGE_FILTRES_LABELS } from "@/config/seo-templates";
import { TOP_30_VILLES, DEPARTEMENTS } from "@/config/geo-data";
import { siteConfig } from "@/config/site";
import { StationCarburantCard, BorneIRVECard } from "@/components/StationCard";
import SimulateurTrajet from "@/components/SimulateurTrajet";
import AdSlot from "@/components/AdSlot";

function parseSlug(slug: string) {
  const parts = slug.split("-");
  const maybeCp = parts[parts.length - 1];
  const hasCp = /^\d{5}$/.test(maybeCp);
  const cp = hasCp ? maybeCp : "";
  const rawName = hasCp ? parts.slice(0, -1).join(" ") : parts.join(" ");
  const villeNom = rawName.charAt(0).toUpperCase() + rawName.slice(1);
  const deptCode = cp ? cp.slice(0, 2) : "75";
  const deptNom = DEPARTEMENTS[deptCode] || "France";
  return { villeNom, cp, deptCode, deptNom };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (!isValidSlug(slug)) return {};
  const { villeNom, cp, deptNom } = parseSlug(slug);
  const dateStr = new Date().toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
  const seo = getVilleSeo(villeNom, cp, deptNom, dateStr);
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: `${siteConfig.domain}/ville/${slug}` },
  };
}

export default async function VillePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!isValidSlug(slug)) notFound();

  const { villeNom, cp, deptCode, deptNom } = parseSlug(slug);
  const query = cp || villeNom;

  const [stations, bornes] = await Promise.all([
    getStationsByVille(query),
    getBornesByVille(query),
  ]);

  const dateStr = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  const seo = getVilleSeo(villeNom, cp, deptNom, dateStr);

  // 6 villes voisines (du même département en priorité)
  const voisines = TOP_30_VILLES.filter((v) => v.slug !== slug).slice(0, 6);

  // JSON-LD SEO (BreadcrumbList + FAQPage + Stations/Bornes)
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: siteConfig.domain },
        { "@type": "ListItem", position: 2, name: deptNom, item: `${siteConfig.domain}/departement/${deptCode.toLowerCase()}` },
        { "@type": "ListItem", position: 3, name: villeNom, item: `${siteConfig.domain}/ville/${slug}` },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: seo.faq.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    },
    ...stations.slice(0, 5).map((s) => ({
      "@context": "https://schema.org",
      "@type": "GasStation",
      name: s.nom,
      address: `${s.adresse}, ${s.codePostal} ${s.ville}`,
      geo: { "@type": "GeoCoordinates", latitude: s.lat, longitude: s.lon },
    })),
    ...bornes.slice(0, 5).map((b) => ({
      "@context": "https://schema.org",
      "@type": "ElectricVehicleChargingStation",
      name: b.nom,
      address: `${b.adresse}, ${b.codePostal} ${b.ville}`,
      geo: { "@type": "GeoCoordinates", latitude: b.lat, longitude: b.lon },
    })),
  ];

  return (
    <div className="space-y-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Fil d'Ariane */}
      <nav className="text-xs text-slate-500 flex flex-wrap items-center gap-1.5">
        <Link href="/" className="hover:text-emerald-600">Accueil</Link>
        <span>/</span>
        <Link href={`/departement/${deptCode.toLowerCase()}`} className="hover:text-emerald-600">{deptNom} ({deptCode})</Link>
        <span>/</span>
        <span className="font-semibold text-slate-800 dark:text-slate-200">{villeNom}</span>
      </nav>

      {/* En-tête SEO */}
      <header className="space-y-2">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">{seo.h1}</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">{seo.description}</p>

        {/* Liens rapides longue traîne */}
        <div className="flex flex-wrap gap-2 pt-3">
          {Object.keys(CARBURANTS_LABELS).map((type) => (
            <Link
              key={type}
              href={`/carburant/${type}/${slug}`}
              className="px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 transition"
            >
              Prix {type.toUpperCase()} à {villeNom}
            </Link>
          ))}
          {Object.keys(RECHARGE_FILTRES_LABELS).map((filtre) => (
            <Link
              key={filtre}
              href={`/recharge/${filtre}/${slug}`}
              className="px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs font-semibold text-amber-700 dark:text-amber-300 hover:bg-amber-100 transition"
            >
              Bornes {filtre} à {villeNom}
            </Link>
          ))}
        </div>
      </header>

      <AdSlot slotKey="slotHeader" minHeight="90px" />

      {/* Liste des stations carburant */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Stations-service à {villeNom} ({stations.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stations.map((s) => (
            <StationCarburantCard key={s.id} station={s} />
          ))}
        </div>
      </section>

      <AdSlot slotKey="slotInFeed" minHeight="100px" />

      {/* Liste des bornes électriques IRVE */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Bornes de recharge électrique (IRVE) à {villeNom} ({bornes.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bornes.map((b) => (
            <BorneIRVECard key={b.id} borne={b} />
          ))}
        </div>
      </section>

      <SimulateurTrajet />

      {/* FAQ SEO */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
        <h2 className="text-lg font-bold">Questions fréquentes sur {villeNom}</h2>
        {seo.faq.map((item, i) => (
          <div key={i} className="space-y-1">
            <h3 className="font-semibold text-sm text-slate-900 dark:text-white">{item.question}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{item.answer}</p>
          </div>
        ))}
      </section>

      {/* Maillage vers 6 villes voisines */}
      <section className="space-y-3">
        <h2 className="text-base font-bold">Comparer dans les villes à proximité</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {voisines.map((v) => (
            <Link
              key={v.slug}
              href={`/ville/${v.slug}`}
              className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 text-xs font-semibold text-center truncate transition"
            >
              {v.nom}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
