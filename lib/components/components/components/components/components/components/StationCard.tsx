"use client";

import { Navigation, Share2, Fuel, Zap } from "lucide-react";
import { StationCarburant, BorneIRVE } from "@/lib/opendata";

export function StationCarburantCard({ station }: { station: StationCarburant }) {
  const gpsUrl = `https://google.com{station.lat},${station.lon}`;
  const wazeUrl = `https://waze.com{station.lat},${station.lon}&navigate=yes`;

  const handleShare = async () => {
    const text = `Bon plan carburant à ${station.ville} : ${station.nom} (${station.adresse})`;
    if (navigator.share) {
      try {
        await navigator.share({ title: station.nom, text, url: window.location.href });
      } catch {}
    } else {
      navigator.clipboard.writeText(`${text} - ${window.location.href}`);
      alert("Lien copié !");
    }
  };

  return (
    <article className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between gap-4">
      <div>
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-600 mb-1">
              <Fuel className="w-3.5 h-3.5" /> Station-service
            </span>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">{station.nom}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{station.adresse}, {station.codePostal} {station.ville}</p>
          </div>
          <button
            type="button"
            onClick={handleShare}
            aria-label="Partager ce bon plan"
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-100 transition"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-4">
          {Object.entries(station.prix).map(([type, val]) =>
            val ? (
              <div key={type} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/70 text-center">
                <div className="text-[10px] font-bold uppercase text-slate-500">{type}</div>
                <div className="text-sm font-extrabold text-slate-900 dark:text-white">{val.toFixed(3)} €</div>
              </div>
            ) : null
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <a
          href={gpsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition"
        >
          <Navigation className="w-3.5 h-3.5" /> Y aller (Maps)
        </a>
        <a
          href={wazeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="py-2.5 px-3 rounded-xl bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 text-xs font-semibold hover:opacity-90 transition"
        >
          Waze
        </a>
      </div>
    </article>
  );
}

export function BorneIRVECard({ borne }: { borne: BorneIRVE }) {
  const gpsUrl = `https://google.com{borne.lat},${borne.lon}`;
  const wazeUrl = `https://waze.com{borne.lat},${borne.lon}&navigate=yes`;

  const handleShare = async () => {
    const text = `Borne électrique ${borne.puissanceMax} kW à ${borne.ville} : ${borne.nom}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: borne.nom, text, url: window.location.href });
      } catch {}
    } else {
      navigator.clipboard.writeText(`${text} - ${window.location.href}`);
      alert("Lien copié !");
    }
  };

  return (
    <article className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between gap-4">
      <div>
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-amber-500 mb-1">
              <Zap className="w-3.5 h-3.5" /> Borne IRVE • {borne.puissanceMax} kW
            </span>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">{borne.nom}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{borne.adresse}, {borne.codePostal} {borne.ville}</p>
          </div>
          <button
            type="button"
            onClick={handleShare}
            aria-label="Partager cette borne"
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-amber-100 transition"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${borne.gratuit ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300"}`}>
            {borne.tarifInfo}
          </span>
          {borne.prises.map((p) => (
            <span key={p} className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-300">
              {p}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <a
          href={gpsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold transition"
        >
          <Navigation className="w-3.5 h-3.5" /> Y aller (Maps)
        </a>
        <a
          href={wazeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="py-2.5 px-3 rounded-xl bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 text-xs font-semibold hover:opacity-90 transition"
        >
          Waze
        </a>
      </div>
    </article>
  );
}
