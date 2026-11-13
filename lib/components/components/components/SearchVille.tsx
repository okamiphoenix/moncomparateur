tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, History, Loader2 } from "lucide-react";
import { slugify } from "@/lib/opendata";

interface CommuneSuggestion {
  nom: string;
  code: string;
  codesPostaux: string[];
  codeDepartement: string;
}

interface RecentCity {
  nom: string;
  slug: string;
  cp: string;
}

export default function SearchVille() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<CommuneSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [recent, setRecent] = useState<RecentCity[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("recent_cities");
      if (saved) setRecent(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const isPostal = /^\d+$/.test(query.trim());
        const url = isPostal
          ? `https://api.gouv.fr{query.trim()}&fields=nom,code,codesPostaux,codeDepartement&limit=8`
          : `https://api.gouv.fr{encodeURIComponent(query.trim())}&fields=nom,code,codesPostaux,codeDepartement&boost=population&limit=8`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data);
        }
      } catch {}
      setLoading(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const goToCity = (nom: string, cp: string) => {
    const slug = `${slugify(nom)}-${cp}`;
    try {
      const updated = [{ nom, slug, cp }, ...recent.filter((c) => c.slug !== slug)].slice(0, 4);
      localStorage.setItem("recent_cities", JSON.stringify(updated));
    } catch {}
    setSuggestions([]);
    router.push(`/ville/${slug}`);
  };

  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      alert("La géolocalisation n'est pas supportée par votre navigateur.");
      return;
    }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://api.gouv.fr{latitude}&lon=${longitude}&fields=nom,code,codesPostaux`
          );
          if (res.ok) {
            const data = await res.json();
            if (data && data[0]) {
              const cp = data[0].codesPostaux?.[0] || "75001";
              goToCity(data[0].nom, cp);
            }
          }
        } catch {
          alert("Impossible de trouver votre commune.");
        }
        setGeoLoading(false);
      },
      () => {
        alert("Veuillez autoriser la géolocalisation sur votre téléphone ou navigateur.");
        setGeoLoading(false);
      },
      { timeout: 8000 }
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto relative">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ville ou code postal (ex: Lyon, 33000...)"
            className="w-full pl-11 pr-10 py-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none text-base"
          />
          {loading && <Loader2 className="w-4 h-4 animate-spin text-emerald-600 absolute right-3.5 top-1/2 -translate-y-1/2" />}

          {suggestions.length > 0 && (
            <ul className="absolute z-30 left-0 right-0 mt-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
              {suggestions.map((c) => {
                const cp = c.codesPostaux?.[0] || "";
                return (
                  <li key={c.code}>
                    <button
                      type="button"
                      onClick={() => goToCity(c.nom, cp)}
                      className="w-full text-left px-4 py-3 hover:bg-emerald-50 dark:hover:bg-slate-800 flex items-center justify-between transition"
                    >
                      <span className="font-semibold text-slate-800 dark:text-slate-100">{c.nom}</span>
                      <span className="text-xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded">
                        {cp} ({c.codeDepartement})
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <button
          type="button"
          onClick={handleGeolocate}
          disabled={geoLoading}
          className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm transition active:scale-95 whitespace-nowrap"
        >
          {geoLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <MapPin className="w-5 h-5" />}
          <span>📍 Autour de moi</span>
        </button>
      </div>

      {recent.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1 font-medium">
            <History className="w-3.5 h-3.5" /> Récemment consulté :
          </span>
          {recent.map((item) => (
            <button
              key={item.slug}
              type="button"
              onClick={() => router.push(`/ville/${item.slug}`)}
              className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-slate-700 dark:text-slate-200 transition"
            >
              {item.nom} ({item.cp})
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
