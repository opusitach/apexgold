// Shared SEO primitives: the canonical origin, per-locale Open Graph wiring and
// the alternates block. Server-safe (no "use client"), so it can be imported
// from generateMetadata, JSON-LD builders, the sitemap and robots.

import { LOCALES, type Lang } from "./locales";

/** Canonical origin. Everything indexable lives under this host (no www). */
export const SITE_URL = "https://apexgold.cz";

export const SITE_NAME = "ApexGold";

/**
 * Ownership proofs for the search consoles. These are public tokens by design —
 * they ship as <meta> tags in every page — so they belong in the repo rather
 * than in the environment. The pages are prerendered, so a new value only goes
 * live after a redeploy.
 *
 * Google is already verified through the DNS TXT record on apexgold.cz; the
 * meta tag is a second, independent proof that survives a nameserver change.
 * Leave a value empty and the tag is omitted entirely.
 */
export const SITE_VERIFICATION = {
  /** Search Console → HTML tag method: the content= value only, not the tag. */
  google: "",
  /** Seznam Webmaster (search.seznam.cz/wmt) → renders as <meta name="seznam-wmt">. */
  seznam: "",
  /** Bing Webmaster Tools → renders as <meta name="msvalidate.01">. */
  bing: "",
} as const;

/**
 * The `verification` block for Next's Metadata, with the empty slots dropped so
 * an unconfigured engine never emits `content=""`.
 */
export function verificationMeta() {
  const other: Record<string, string> = {};
  if (SITE_VERIFICATION.seznam) other["seznam-wmt"] = SITE_VERIFICATION.seznam;
  if (SITE_VERIFICATION.bing) other["msvalidate.01"] = SITE_VERIFICATION.bing;

  const verification: { google?: string; other?: Record<string, string> } = {};
  if (SITE_VERIFICATION.google) verification.google = SITE_VERIFICATION.google;
  if (Object.keys(other).length) verification.other = other;

  return Object.keys(verification).length ? { verification } : {};
}

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
