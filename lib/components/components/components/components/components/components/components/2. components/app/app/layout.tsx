import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import "./globals.css";
import { siteConfig } from "@/config/site";
import Header from "@/components/Header";
import TopImageBanner from "@/components/TopImageBanner";
import CookieBanner from "@/components/CookieBanner";

export const metadata: Metadata = {
  title: `${siteConfig.name} - Prix des carburants & Bornes électriques IRVE en temps réel`,
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.domain),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <Script id="consent-default" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'analytics_storage': 'denied'
            });
          `}
        </Script>
        {siteConfig.adsenseEnabled && (
          <Script
            async
            src={`https://googlesyndication.com{siteConfig.publisherId}`}
            crossOrigin="anonymous"
            strategy="lazyOnload"
          />
        )}
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased">
        <Header />
        <TopImageBanner />
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-6 sm:py-8">
          {children}
        </main>
        <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-8 px-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© {new Date().getFullYear()} {siteConfig.name} — Données officielles Open Data (data.economie.gouv.fr &amp; data.gouv.fr).</p>
            <div className="flex items-center gap-4">
              <Link href="/mentions-legales" className="hover:text-emerald-600 transition">Mentions légales</Link>
              <Link href="/conditions-generales" className="hover:text-emerald-600 transition">Conditions générales</Link>
            </div>
          </div>
        </footer>
        <CookieBanner />
      </body>
    </html>
  );
}
