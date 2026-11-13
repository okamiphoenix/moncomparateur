tsx
import { siteConfig } from "@/config/site";

export default function TopImageBanner() {
  const { topBanner } = siteConfig;

  if (!topBanner.enabled || !topBanner.imageUrl) {
    return null;
  }

  return (
    <div className="w-full bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-2 px-4">
      <div className="max-w-5xl mx-auto relative">
        <a
          href={topBanner.targetUrl}
          target="_blank"
          rel={topBanner.isSponsored ? "sponsored noopener noreferrer" : "noopener noreferrer"}
          className="block overflow-hidden rounded-xl shadow-sm hover:opacity-95 transition"
        >
          <img
            src={topBanner.imageUrl}
            alt={topBanner.altText}
            className="w-full max-h-28 object-cover mx-auto"
          />
        </a>
        {topBanner.isSponsored && (
          <span className="absolute top-1.5 right-2 bg-black/60 text-white text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded">
            Sponsorisé
          </span>
        )}
      </div>
    </div>
  );
}
