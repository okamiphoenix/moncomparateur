import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Conditions générales d'utilisation - ${siteConfig.name}`,
  robots: { index: false, follow: true },
};

export default function ConditionsGeneralesPage() {
  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
        Conditions Générales d&apos;Utilisation (CGU)
      </h1>

      <section className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Objet du service</h2>
        <p>
          <strong>{siteConfig.name}</strong> est un comparateur gratuit permettant de consulter les prix des carburants et les tarifs/emplacements des bornes de recharge électrique en France.
        </p>
      </section>

      <section className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. Exactitude des tarifs affichés</h2>
        <p>
          Les données sont fournies à titre purement indicatif à partir des bases publiques gouvernementales mises à jour automatiquement. Seul le prix affiché en station ou sur la borne au moment du paiement fait foi.
        </p>
      </section>

      <section className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. Propriété intellectuelle</h2>
        <p>
          L&apos;ensemble de la structure, du design et des outils de simulation de {siteConfig.name} est protégé par le droit d&apos;auteur. Contact : {siteConfig.legal.email}.
        </p>
      </section>
    </div>
  );
}
