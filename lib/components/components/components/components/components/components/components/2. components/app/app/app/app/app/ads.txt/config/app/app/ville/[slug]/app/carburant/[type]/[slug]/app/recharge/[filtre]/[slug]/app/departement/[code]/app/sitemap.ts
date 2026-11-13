import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { TOP_30_VILLES, DEPARTEMENTS } from "@/config/geo-data";
import { CARBURANTS_LABELS, RECHARGE_FILTRES_LABELS } from "@/config/seo-templates";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.domain;
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "hourly", priority: 1.0 },
    { url: `${baseUrl}/mentions-legales`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/conditions-generales`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
  ];

  const deptPages: MetadataRoute.Sitemap = Object.keys(DEPARTEMENTS).map((code) => ({
    url: `${baseUrl}/departement/${code.toLowerCase()}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  const villePages: MetadataRoute.Sitemap = TOP_30_VILLES.map((v) => ({
    url: `${baseUrl}/ville/${v.slug}`,
    lastModified: now,
    changeFrequency: "hourly",
    priority: 0.9,
  }));

  const carburantPages: MetadataRoute.Sitemap = TOP_30_VILLES.flatMap((v) =>
    Object.keys(CARBURANTS_LABELS).map((type) => ({
      url: `${baseUrl}/carburant/${type}/${v.slug}`,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 0.7,
    }))
  );

  const rechargePages: MetadataRoute.Sitemap = TOP_30_VILLES.flatMap((v) =>
    Object.keys(RECHARGE_FILTRES_LABELS).map((filtre) => ({
      url: `${baseUrl}/recharge/${filtre}/${v.slug}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.7,
    }))
  );

  return [...staticPages, ...deptPages, ...villePages, ...carburantPages, ...rechargePages];
}
