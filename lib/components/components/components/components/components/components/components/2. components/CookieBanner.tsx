tsx
"use client";

import { useState, useEffect } from "react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("rgpd_consent");
    if (!consent) setVisible(true);
  }, []);

  const updateConsent = (granted: boolean) => {
    localStorage.setItem("rgpd_consent", granted ? "granted" : "denied");
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("consent", "update", {
        ad_storage: granted ? "granted" : "denied",
        ad_user_data: granted ? "granted" : "denied",
        ad_personalization: granted ? "granted" : "denied",
        analytics_storage: granted ? "granted" : "denied",
      });
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-2xl mx-auto p-4 sm:p-5 rounded-2xl bg-slate-900 text-white shadow-2xl border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
        Nous utilisons des cookies pour mesurer l&apos;audience et afficher des publicités pertinentes afin de maintenir ce comparateur 100 % gratuit.
      </p>
      <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
        <button
          onClick={() => updateConsent(false)}
          className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold transition"
        >
          Refuser
        </button>
        <button
          onClick={() => updateConsent(true)}
          className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold transition"
        >
          Accepter
        </button>
      </div>
    </div>
  );
}
