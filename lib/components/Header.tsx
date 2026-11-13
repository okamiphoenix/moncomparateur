tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Fuel, Zap, Sun, Moon } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function Header() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  const toggleTheme = () => {
    if (dark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDark(true);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
          {siteConfig.logoUrl ? (
            <img src={siteConfig.logoUrl} alt={siteConfig.logoAlt} className="h-9 w-auto object-contain" />
          ) : (
            <>
              <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-600 text-white shadow-sm">
                <Fuel className="w-5 h-5" />
              </span>
              <span>
                Prix<span className="text-emerald-600">Carbu</span>
                <span className="text-amber-500">&amp;VE</span>
              </span>
            </>
          )}
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <Link href="/#comparateur" className="hover:text-emerald-600 transition">Carburants</Link>
          <Link href="/#simulateur" className="hover:text-emerald-600 transition">Simulateur Trajet</Link>
          <Link href="/#villes" className="hover:text-emerald-600 transition">Grandes Villes</Link>
          <Link href="/#departements" className="hover:text-emerald-600 transition">Départements</Link>
        </nav>

        <button
          onClick={toggleTheme}
          aria-label="Changer le thème clair ou sombre"
          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          {dark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
}
