tsx
import Link from "next/link";
import { Fuel, Zap, MapPin } from "lucide-react";
import { getPrixMoyensNationaux, getTarifsMoyensRechargeVE } from "@/lib/opendata";
import { TOP_30_VILLES, DEPARTEMENTS } from "@/config/geo-data";
import { siteConfig } from "@/config/site";
import SearchVille from "@/components/SearchVille";
import SimulateurTrajet from "@/components/SimulateurTrajet";
import RentabiliteVE from "@/components/RentabiliteVE";
import AdSlot from "@/components/AdSlot";

export default async function HomePage() {
  const [moyennesCarbu, tarifsVE] = await Promise.all([
    getPrixMoyensNationaux(),
    getTarifsMoyensRechargeVE(),
  ]);

  const dateDuJour = new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `Prix des carburants et bornes de recharge électrique en France (${dateDuJour})`,
    description: siteConfig.description,
    url: siteConfig.domain,
    creator: {
      "@type": "Organization",
      name: "Ministère de l'Économie & data.gouv.fr",
    },
  };

  return (
    <div className="space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero & Recherche GPS */}
      <section className="text-center space-y-5 pt-2 pb-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
          Mis à jour en temps réel • {dateDuJour}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight">
          Prix des carburants et bornes de recharge électrique au <span className="text-emerald-600">{dateDuJour}</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Trouvez instantanément la station-service la moins chère ou la borne IRVE disponible autour de vous partout en France.
        </p>

        <div className="pt-2">
          <SearchVille />
        </div>
      </section>

      <AdSlot slotKey="slotHeader" minHeight="90px" />

      {/* Prix Moyens Nationaux du jour */}
      <section id="comparateur" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Fuel className="w-5 h-5 text-emerald-600" /> Prix moyens nationaux du jour
          </h2>
          <span className="text-xs text-slate-500">Source : data.economie.gouv.fr</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: "Gazole", prix: moyennesCarbu.gazole },
            { label: "SP95-E10", prix: moyennesCarbu.e10 },
            { label: "SP95", prix: moyennesCarbu.sp95 },
            { label: "SP98", prix: moyennesCarbu.sp98 },
            { label: "E85", prix: moyennesCarbu.e85 },
          ].map((item) => (
            <div
              key={item.label}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-sm"
            >
              <div className="text-xs font-bold uppercase text-slate-500 mb-1">{item.label}</div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{item.prix} €</div>
              <div className="text-[11px] text-slate-400">par litre</div>
            </div>
          ))}
        </div>

        {/* Tarifs moyens bornes publiques VE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-amber-500 shrink-0" />
              <div>
                <div className="font-bold text-sm text-slate-900 dark:text-white">Borne publique normale (AC &lt; 50 kW)</div>
                <div className="text-xs text-slate-500">Tarif moyen constaté réseau IRVE</div>
              </div>
            </div>
            <div className="text-xl font-extrabold text-amber-600">{tarifsVE.borneNormaleAcKwh.toFixed(2)} €/kWh</div>
          </div>

          <div className="p-4 rounded-2xl bg-sky-50/70 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-800/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-sky-500 shrink-0" />
              <div>
                <div className="font-bold text-sm text-slate-900 dark:text-white">Borne rapide &amp; ultra-rapide (DC ≥ 50 kW)</div>
                <div className="text-xs text-slate-500">Autoroutes et stations haute puissance</div>
              </div>
            </div>
            <div className="text-xl font-extrabold text-sky-600">{tarifsVE.borneRapideDcKwh.toFixed(2)} €/kWh</div>
          </div>
        </div>
      </section>

      {/* Simulateurs */}
      <SimulateurTrajet
        prixMinCarburant={Number(moyennesCarbu.e10) - 0.08}
        prixMaxCarburant={Number(moyennesCarbu.sp98) + 0.09}
        tarifAcKwh={tarifsVE.borneNormaleAcKwh}
        tarifDcKwh={tarifsVE.borneRapideDcKwh}
      />

      <AdSlot slotKey="slotSimulator" minHeight="100px" />

      <RentabiliteVE />

      {/* Maillage SEO : Top 30 Villes */}
      <section id="villes" className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <MapPin className="w-5 h-5 text-emerald-600" /> Prix par grande ville
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {TOP_30_VILLES.map((v) => (
            <Link
              key={v.slug}
              href={`/ville/${v.slug}`}
              className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between transition"
            >
              <span className="truncate">{v.nom}</span>
              <span className="text-xs text-slate-400 font-mono">{v.dept}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Maillage SEO : 96 Départements */}
      <section id="departements" className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Comparer par département (France métropolitaine)
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {Object.entries(DEPARTEMENTS).map(([code, nom]) => (
            <Link
              key={code}
              href={`/departement/${code.toLowerCase()}`}
              className="px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 text-xs text-slate-700 dark:text-slate-300 truncate transition"
            >
              <span className="font-bold text-emerald-600 mr-1">{code}</span> {nom}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
