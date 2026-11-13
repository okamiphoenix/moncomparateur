import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getBornesByVille, isValidSlug } from "@/lib/opendata";
import { getRechargeVilleSeo, RECHARGE_FILTRES_LABELS } from "@/config/seo-templates";
import { siteConfig } from "@/config/site";
import { BorneIRVECard } from "@/components/StationCard";
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
  params: Promise<{ filtre: string; slug: string }>;
}): Promise<Metadata> {
  const { filtre, slug } = await params;
  if (!isValidSlug(filtre) || !isValidSlug(slug) || !RECHARGE_FILTRES_LABELS[filtre]) return {};
  const { villeNom, cp } = parseVille(slug);
  const dateStr = new Date().toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
  const seo = getRechargeVilleSeo(filtre, villeNom, cp, dateStr);
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: `${siteConfig.domain}/recharge/${filtre}/${slug}` },
  };
}

export default async function RechargeVillePage({
  params,
}: {
  params: Promise<{ filtre: string; slug: string }>;
}) {
  const { filtre, slug } = await params;
  if (!isValidSlug(filtre) || !isValidSlug(slug) || !RECHARGE_FILTRES_LABELS[filtre]) {
    notFound();
  }

  const { villeNom, cp } = parseVille(slug);
  const bornes = await getBornesByVille(cp || villeNom);

  const bornesFiltrees = bornes.filter((b) => {
    if (filtre === "rapide") return b.puissanceMax >= 50;
    if (filtre === "gratuite") return b.gratuit;
    return true;
  });

  const dateStr = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  const seo = getRechargeVilleSeo(filtre, villeNom, cp, dateStr);

  return (
    <div className="space-y-8">
      <nav className="text-xs text-slate-500 flex flex-wrap items-center gap-1.5">
        <Link href="/" className="hover:text-emerald-600">Accueil</Link>
        <span>/</span>
        <Link href={`/ville/${slug}`} className="hover:text-emerald-600">{villeNom}</Link>
        <span>/</span>
        <span className="font-semibold text-slate-800 dark:text-slate-200">{RECHARGE_FILTRES_LABELS[filtre]}</span>
      </nav>

      <header className="space-y-2">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">{seo.h1}</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">{seo.description}</p>
      </header>

      <AdSlot slotKey="slotHeader" minHeight="90px" />

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Points de recharge disponibles ({bornesFiltrees.length})
        </h2>
        {bornesFiltrees.length === 0 ? (
          <p className="text-sm text-slate-500 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
            Aucune borne correspondant à ce filtre sur cette commune.{" "}
            <Link href={`/ville/${slug}`} className="text-amber-600 underline font-semibold">
              Voir toutes les bornes et stations à {villeNom}
            </Link>.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bornesFiltrees.map((b) => (
              <BorneIRVECard key={b.id} borne={b} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
