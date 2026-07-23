// Shared SEO primitives: the canonical origin, per-locale Open Graph wiring and
// the alternates block. Server-safe (no "use client"), so it can be imported
// from generateMetadata, JSON-LD builders, the sitemap and robots.

import { LOCALES, type Lang } from "./locales";

/** Canonical origin. Everything indexable lives under this host (no www). */
export const SITE_URL = "https://apexgold.cz";

export const SITE_NAME = "ApexGold";

/** og:locale wants the full BCP-47-ish territory form, not the bare language. */
const OG_LOCALE: Record<Lang, string> = {
  cs: "cs_CZ",
  en: "en_GB",
  sk: "sk_SK",
  uk: "uk_UA",
};

/** Default share image — a real photo of the team, cropped to the 1.91:1 OG frame. */
export const OG_DEFAULT_IMAGE = {
  url: "/images/og-default.jpg",
  width: 1200,
  height: 630,
} as const;

interface OgImage {
  url: string;
  width: number;
  height: number;
}

/**
 * hreflang block for a path that exists in every locale. `path` is the part
 * after the locale segment, e.g. "" for the homepage or "/myti-oken".
 */
export function localeAlternates(lang: Lang, path: string) {
  return {
    canonical: `/${lang}${path}`,
    languages: {
      ...Object.fromEntries(LOCALES.map((l) => [l, `/${l}${path}`])),
      "x-default": `/cs${path}`,
    },
  };
}

/**
 * Open Graph + Twitter card for a page. Both blocks are driven by the same
 * title/description as the <title>/<meta name="description">, so a page can
 * never drift between what search engines and what messengers show.
 */
export function socialMeta({
  lang,
  path,
  title,
  description,
  image = OG_DEFAULT_IMAGE,
  imageAlt,
}: {
  lang: Lang;
  path: string;
  title: string;
  description: string;
  image?: OgImage;
  imageAlt?: string;
}) {
  const images = [{ ...image, alt: imageAlt ?? title }];
  return {
    openGraph: {
      type: "website" as const,
      siteName: SITE_NAME,
      title,
      description,
      url: `/${lang}${path}`,
      locale: OG_LOCALE[lang],
      alternateLocale: LOCALES.filter((l) => l !== lang).map((l) => OG_LOCALE[l]),
      images,
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
      images,
    },
  };
}
