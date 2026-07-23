"use client";

import { createContext, useCallback, useContext, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LOCALES, type Lang } from "./locales";

export type { Lang, Tr3 } from "./locales";
export { pickTr3 } from "./locales";

const COOKIE_KEY = "apexgold-lang";

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  /** 4-way translation, Czech is the base (matches Header/Footer/home copy). */
  t: (cs: string, en: string, sk: string, uk?: string) => string;
  /** 4-way translation, Czech is the base (matches service-page copy). */
  t3: (cs: string, en: string, sk: string, uk: string) => string;
}

const LanguageContext = createContext<LangContextValue | null>(null);

/** `lang` is derived from the `[lang]` route segment and passed in by the root layout. */
export function LanguageProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const setLang = useCallback(
    (l: Lang) => {
      try {
        document.cookie = `${COOKIE_KEY}=${l};path=/;max-age=31536000;samesite=lax`;
      } catch {
        // cookies unavailable
      }
      const segments = pathname.split("/");
      // pathname is like "/cs" or "/cs/uklid-po-stavbe" — segments[1] is the current locale.
      if (segments.length > 1 && LOCALES.includes(segments[1] as Lang)) {
        segments[1] = l;
      } else {
        segments.splice(1, 0, l);
      }
      router.push(segments.join("/") || `/${l}`);
    },
    [pathname, router]
  );

  const t = useCallback(
    (cs: string, en: string, sk: string, uk?: string) => {
      if (lang === "en") return en;
      if (lang === "sk") return sk;
      if (lang === "uk") return uk ?? cs;
      return cs;
    },
    [lang]
  );

  const t3 = useCallback(
    (cs: string, en: string, sk: string, uk: string) => {
      if (lang === "en") return en;
      if (lang === "sk") return sk;
      if (lang === "uk") return uk;
      return cs;
    },
    [lang]
  );

  return <LanguageContext.Provider value={{ lang, setLang, t, t3 }}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}
