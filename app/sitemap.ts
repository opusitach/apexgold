import type { MetadataRoute } from "next";
import { SERVICE_SLUGS, servicePageData, type ServiceSlug } from "@/lib/servicePageData";
import { LEGAL_DOCS } from "@/lib/legalContent";
import { LEGAL_EFFECTIVE_DATE } from "@/lib/company";
import { LOCALES } from "@/lib/locales";
import { SITE_URL } from "@/lib/siteMeta";

/**
 * Real content-revision dates. `new Date()` would stamp every URL as "changed
 * just now" on each build, which search engines learn to ignore — bump the
 * entry here when the copy for that page group actually changes.
 */
const CONTENT_REVISED = "2026-08-22";

function alternates(path: string) {
  return {
    languages: {
      ...Object.fromEntries(LOCALES.map((l) => [l, `${SITE_URL}/${l}${path}`])),
      "x-default": `${SITE_URL}/cs${path}`,
    },
  };
}

/** Sitemap images must be absolute; the page data stores /public-relative paths. */
function absolute(paths: string[]): string[] {
  return [...new Set(paths)].map((p) => `${SITE_URL}${p}`);
}

/**
 * The photos a service page actually renders: its hero and the before/after
 * gallery. Listing them lets Google Images crawl work that would otherwise only
 * be reachable through a client component.
 */
function serviceImages(slug: ServiceSlug): string[] {
  const d = servicePageData[slug];
  const gallery = (d.gallery ?? []).flatMap((item) =>
    item.type === "before-after" ? [item.before, item.after] : item.images
  );
  return absolute([d.img, ...gallery]);
}

const HOME_IMAGES = absolute([
  "/images/hero-team.jpg",
  "/images/case-before.jpg",
  "/images/case-after.jpg",
  "/images/services/generalni-uklid.jpg",
  "/images/stone-renovation-floor.jpg",
]);

export default function sitemap(): MetadataRoute.Sitemap {
  const contentModified = new Date(CONTENT_REVISED);
  const legalModified = new Date(LEGAL_EFFECTIVE_DATE);

  const home: MetadataRoute.Sitemap = LOCALES.map((l) => ({
    url: `${SITE_URL}/${l}`,
    lastModified: contentModified,
    changeFrequency: "weekly" as const,
    priority: 1,
    alternates: alternates(""),
    images: HOME_IMAGES,
  }));

  const services: MetadataRoute.Sitemap = LOCALES.flatMap((l) =>
    SERVICE_SLUGS.map((slug) => ({
      url: `${SITE_URL}/${l}/${slug}`,
      lastModified: contentModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
      alternates: alternates(`/${slug}`),
      images: serviceImages(slug),
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
