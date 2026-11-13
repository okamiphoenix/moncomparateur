tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { DEPARTEMENTS } from "@/config/geo-data";
import { getDepartementSeo } from "@/config/seo-templates";
import { isValidSlug, slugify } from "@/lib/opendata";
import { siteConfig } from "@/config/site";
import AdSlot from "@/components/AdSlot";

interface CommuneDept {
  nom: string;
  code: string;
  codesPostaux: string[];
  population?: number;
}

async function getCommunesByDept(code: string): Promise<CommuneDept[]> {
  try {
    const res = await fetch(
      `https://api.gouv.fr{code.toUpperCase()}/communes?fields=nom,code,codesPostaux,population`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return [];
    const data: CommuneDept[] = await res.json();
    return data.sort((a, b) => (b.population || 0) - (a.population || 0));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const { code } = await params;
  if (!isValidSlug(code)) return {};
  const deptKey = code.toUpperCase();
  const nomDept = DEPARTEMENTS[deptKey];
  if (!nomDept) return {};
  const dateStr = new Date().toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
  const seo = getDepartementSeo(deptKey, nomDept, dateStr);
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: `${siteConfig.domain}/departement/${code}` },
  };
}

export default async function DepartementPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  if (!isValidSlug(code)) notFound();

  const deptKey = code.toUpperCase();
  const nomDept = DEPARTEMENTS[deptKey];
  if (!nomDept) notFound();

  const communes = await getCommunesByDept(deptKey);
  const dateStr = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  const seo = getDepartementSeo(deptKey, nomDept, dateStr);

  return (
    <div className="space-y-8">
      <nav className="text-xs text-slate-500 flex items-center gap-1.5">
        <Link href="/" className="hover:text-emerald-600">Accueil</Link>
        <span>/</span>
        <span className="font-semibold text-slate-800 dark:text-slate-200">{nomDept} ({deptKey})</span>
      </nav>

      <header className="space-y-2">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">{seo.h1}</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">{seo.description}</p>
      </header>

      <AdSlot slotKey="slotHeader" minHeight="90px" />

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Toutes les communes du département {nomDept} ({communes.length})
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {communes.map((c) => {
            const cp = c.codesPostaux?. || "";
            const slug = `${slugify(c.nom)}-${cp}`;
            return (
              <Link
                key={c.code}
                href={`/ville/${slug}`}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between gap-2 transition"
              >
                <span className="truncate">{c.nom}</span>
                <span className="text-[11px] font-mono text-slate-400 shrink-0">{cp}</span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
