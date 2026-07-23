// Server-safe locale primitives (no "use client"), so they can be imported from
// both server components (metadata, JSON-LD, sitemap, proxy) and client components.

export type Lang = "cs" | "en" | "sk" | "uk";

export const LOCALES: Lang[] = ["cs", "en", "sk", "uk"];
export const DEFAULT_LOCALE: Lang = "cs";

export function isLang(value: string): value is Lang {
  return (LOCALES as string[]).includes(value);
}

export interface Tr3 {
  cs: string;
  en: string;
  sk: string;
  uk: string;
}

export function pickTr3(tr: Tr3, lang: Lang): string {
  if (lang === "en") return tr.en;
  if (lang === "sk") return tr.sk;
  if (lang === "uk") return tr.uk;
  return tr.cs;
}
