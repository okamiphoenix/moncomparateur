"use client";

import { useState } from "react";
import { TrendingDown } from "lucide-react";

export default function RentabiliteVE() {
  const [kmAn, setKmAn] = useState(15000);

  // Coût annuel moyen : Thermique (6L/100 à 1.78€/L) vs Borne publique VE (16kWh/100 à 0.35€/kWh)
  const budgetCarburant = (kmAn / 100) * 6 * 1.78;
  const budgetBorneVE = (kmAn / 100) * 16 * 0.35;
  const economie = Math.max(0, budgetCarburant - budgetBorneVE);

  return (
    <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm">
      <div className="flex items-center gap-2.5 mb-4">
        <span className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400">
          <TrendingDown className="w-5 h-5" />
        </span>
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Rentabilité Électrique vs Thermique</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Estimez vos économies annuelles selon votre kilométrage</p>
        </div>
      </div>

      <div className="mb-5">
        <div className="flex justify-between text-sm font-semibold mb-1.5">
          <span className="text-slate-600 dark:text-slate-300">Kilométrage annuel :</span>
          <span className="text-emerald-600 font-extrabold">{kmAn.toLocaleString("fr-FR")} km / an</span>
        </div>
        <input
          type="range"
          min={3000}
          max={50000}
          step={1000}
          value={kmAn}
          onChange={(e) => setKmAn(Number(e.target.value))}
          className="w-full accent-emerald-600"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
          <div className="text-xs text-slate-500">Budget Carburant / an</div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">{Math.round(budgetCarburant)} €</div>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
          <div className="text-xs text-slate-500">Budget Bornes VE / an</div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">{Math.round(budgetBorneVE)} €</div>
        </div>
        <div className="p-3 rounded-xl bg-emerald-600 text-white">
          <div className="text-xs text-emerald-100">Économie estimée</div>
          <div className="text-xl font-extrabold">+{Math.round(economie)} € / an</div>
        </div>
      </div>
    </section>
  );
}
