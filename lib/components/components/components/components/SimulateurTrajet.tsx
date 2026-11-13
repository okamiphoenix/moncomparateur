"use client";

import { useState } from "react";
import { Calculator, Fuel, Zap } from "lucide-react";

interface Props {
  prixMinCarburant?: number;
  prixMaxCarburant?: number;
  tarifAcKwh?: number;
  tarifDcKwh?: number;
}

export default function SimulateurTrajet({
  prixMinCarburant = 1.69,
  prixMaxCarburant = 1.92,
  tarifAcKwh = 0.35,
  tarifDcKwh = 0.59,
}: Props) {
  const [distance, setDistance] = useState(100);
  const [consoL100, setConsoL100] = useState(6.2);
  const [consoKwh100, setConsoKwh100] = useState(16.5);

  const litres = (distance / 100) * consoL100;
  const kwh = (distance / 100) * consoKwh100;

  const coutMinCarbu = litres * prixMinCarburant;
  const coutMaxCarbu = litres * prixMaxCarburant;
  const coutBorneAc = kwh * tarifAcKwh;
  const coutBorneDc = kwh * tarifDcKwh;

  return (
    <section id="simulateur" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm">
      <div className="flex items-center gap-2.5 mb-4">
        <span className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400">
          <Calculator className="w-5 h-5" />
        </span>
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Simulateur de coût par trajet</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Station moins chère vs plus chère vs bornes publiques VE</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
            Distance du trajet : <span className="text-emerald-600 font-bold">{distance} km</span>
          </label>
          <input
            type="range"
            min={10}
            max={1000}
            step={10}
            value={distance}
            onChange={(e) => setDistance(Number(e.target.value))}
            className="w-full accent-emerald-600"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
            Conso. Thermique : <span className="font-bold">{consoL100} L/100km</span>
          </label>
          <input
            type="range"
            min={3.5}
            max={12}
            step={0.1}
            value={consoL100}
            onChange={(e) => setConsoL100(Number(e.target.value))}
            className="w-full accent-slate-600"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
            Conso. Électrique : <span className="font-bold">{consoKwh100} kWh/100km</span>
          </label>
          <input
            type="range"
            min={11}
            max={26}
            step={0.5}
            value={consoKwh100}
            onChange={(e) => setConsoKwh100(Number(e.target.value))}
            className="w-full accent-amber-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1">
            <Fuel className="w-3.5 h-3.5" /> Station - chère
          </div>
          <div className="text-xl font-extrabold text-slate-900 dark:text-white">{coutMinCarbu.toFixed(2)} €</div>
          <div className="text-[11px] text-slate-500">{prixMinCarburant.toFixed(3)} €/L</div>
        </div>

        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-700 dark:text-rose-400 mb-1">
            <Fuel className="w-3.5 h-3.5" /> Station + chère
          </div>
          <div className="text-xl font-extrabold text-slate-900 dark:text-white">{coutMaxCarbu.toFixed(2)} €</div>
          <div className="text-[11px] text-slate-500">{prixMaxCarburant.toFixed(3)} €/L</div>
        </div>

        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">
            <Zap className="w-3.5 h-3.5" /> Borne AC (22 kW)
          </div>
          <div className="text-xl font-extrabold text-slate-900 dark:text-white">{coutBorneAc.toFixed(2)} €</div>
          <div className="text-[11px] text-slate-500">{tarifAcKwh.toFixed(2)} €/kWh</div>
        </div>

        <div className="p-3.5 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-700 dark:text-sky-400 mb-1">
            <Zap className="w-3.5 h-3.5" /> Borne Rapide DC
          </div>
          <div className="text-xl font-extrabold text-slate-900 dark:text-white">{coutBorneDc.toFixed(2)} €</div>
          <div className="text-[11px] text-slate-500">{tarifDcKwh.toFixed(2)} €/kWh</div>
        </div>
      </div>
    </section>
  );
}
