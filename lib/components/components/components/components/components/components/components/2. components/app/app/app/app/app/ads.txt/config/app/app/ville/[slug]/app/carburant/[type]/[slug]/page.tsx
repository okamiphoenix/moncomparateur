tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getStationsByVille, isValidSlug } from "@/lib/opendata";
import { getCarburantVilleSeo, CARBURANTS_LABELS } from "@/config/seo-templates";
import { siteConfig } from "@/config/site";
import { StationCarburantCard } from "@/components/StationCard";
import AdSlot from "@/components/AdSlot";

function parseVille(slug: string) {
  const parts = slug.split("-");
  const maybeCp = parts[parts.length - 1];
  const hasCp = /^\d{5}$/.test(maybeCp);
  const cp = hasCp ? maybeCp : "";
  const rawName = hasCp ? parts.slice(0, -1).join(" ") : parts.join(" ");
  const villeNom = rawName.charAt(0).toUpperCase() + rawName.slice(1);
  return { villeNom, cp };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string; slug: string }>;
}): Promise<Metadata> {
  const { type, slug } = await params;
  if (!isValidSlug(type) || !isValidSlug(slug) || !CARBURANTS_LABELS[type]) return {};
  const { villeNom, cp } = parseVille(slug);
  const dateStr = new Date().toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
  const seo = getCarburantVilleSeo(type, villeNom, cp, dateStr);
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: `${siteConfig.domain}/carburant/${type}/${slug}` },
  };
}

export default async function CarburantVillePage({
  params,
}: {
  params: Promise<{ type: string; slug: string }>;
}) {
  const { type, slug } = await params;
  if (!isValidSlug(type) || !isValidSlug(slug) || !CARBURANTS_LABELS[type]) {
    notFound();
  }

  const { villeNom, cp } = parseVille(slug);
  const stations = await getStationsByVille(cp || villeNom);

  // Filtrer et trier du moins cher au plus cher pour ce carburant
  const fuelKey = type as keyof (typeof stations)[0]["prix"];
  const stationsTriees = stations
    .filter((s) => typeof s.prix[fuelKey] === "number")
    .sort((a, b) => (a.prix[fuelKey] || 99) - (b.prix[fuelKey] || 99));

  const dateStr = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  const seo = getCarburantVilleSeo(type, villeNom, cp, dateStr);

  return (
    <div className="space-y-8">
      <nav className="text-xs text-slate-500 flex flex-wrap items-center gap-1.5">
        <Link href="/" className="hover:text-emerald-600">Accueil</Link>
        <span>/</span>
        <Link href={`/ville/${slug}`} className="hover:text-emerald-600">{villeNom}</Link>
        <span>/</span>
        <span className="font-semibold text-slate-800 dark:text-slate-200">{CARBURANTS_LABELS[type]}</span>
      </nav>

      <header className="space-y-2">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">{seo.h1}</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">{seo.description}</p>
      </header>

      <AdSlot slotKey="slotHeader" minHeight="90px" />

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Classement des stations les moins chères ({stationsTriees.length})
        </h2>
        {stationsTriees.length === 0 ? (
          <p className="text-sm text-slate-500 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
            Aucune station proposant du {CARBURANTS_LABELS[type]} n&apos;a été trouvée sur cette commune.{" "}
            <Link href={`/ville/${slug}`} className="text-emerald-600 underline font-semibold">
              Voir toutes les stations et bornes à {villeNom}
            </Link>.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stationsTriees.map((s) => (
              <StationCarburantCard key={s.id} station={s} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
