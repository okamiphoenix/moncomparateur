import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Mentions légales - ${siteConfig.name}`,
  robots: { index: false, follow: true },
};

export default function MentionsLegalesPage() {
  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Mentions légales</h1>

      <section className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Éditeur du site</h2>
        <p>Le site <strong>{siteConfig.name}</strong> ({siteConfig.domain}) est édité par :</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Responsable :</strong> {siteConfig.legal.editeur}</li>
          <li><strong>Statut :</strong> {siteConfig.legal.statut}</li>
          <li><strong>Adresse :</strong> {siteConfig.legal.adresse}</li>
          <li><strong>Contact :</strong> {siteConfig.legal.email}</li>
        </ul>
      </section>

      <section className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. Hébergement</h2>
        <p>Le site est hébergé par : {siteConfig.legal.hebergeur}.</p>
      </section>

      <section className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. Sources des données publiques</h2>
        <p>
          Les tarifs des carburants et l&apos;emplacement des bornes de recharge (IRVE) proviennent des flux Open Data officiels de l&apos;État français (<em>data.economie.gouv.fr</em> et <em>data.gouv.fr</em>).
        </p>
      </section>
    </div>
  );
}
