import type { MetadataRoute } from "next";
import { SERVICE_SLUGS } from "@/lib/servicePageData";
import { LEGAL_DOCS } from "@/lib/legalContent";
import { LEGAL_EFFECTIVE_DATE } from "@/lib/company";
import { LOCALES } from "@/lib/locales";
import { SITE_URL } from "@/lib/siteMeta";

/**
 * Real content-revision dates. `new Date()` would stamp every URL as "changed
 * just now" on each build, which search engines learn to ignore — bump the
 * entry here when the copy for that page group actually changes.
 */
const CONTENT_REVISED = "2026-07-23";

function alternates(path: string) {
  return {
    languages: {
      ...Object.fromEntries(LOCALES.map((l) => [l, `${SITE_URL}/${l}${path}`])),
      "x-default": `${SITE_URL}/cs${path}`,
    },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const contentModified = new Date(CONTENT_REVISED);
  const legalModified = new Date(LEGAL_EFFECTIVE_DATE);

  const home: MetadataRoute.Sitemap = LOCALES.map((l) => ({
    url: `${SITE_URL}/${l}`,
    lastModified: contentModified,
    changeFrequency: "weekly" as const,
    priority: 1,
    alternates: alternates(""),
  }));

  const services: MetadataRoute.Sitemap = LOCALES.flatMap((l) =>
    SERVICE_SLUGS.map((slug) => ({
      url: `${SITE_URL}/${l}/${slug}`,
      lastModified: contentModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
      alternates: alternates(`/${slug}`),
    }))
  );

  const legal: MetadataRoute.Sitemap = LOCALES.flatMap((l) =>
    Object.values(LEGAL_DOCS).map((doc) => ({
      url: `${SITE_URL}/${l}/${doc.slug}`,
      lastModified: legalModified,
      changeFrequency: "yearly" as const,
      priority: 0.3,
      alternates: alternates(`/${doc.slug}`),
    }))
  );

  return [...home, ...services, ...legal];
}
