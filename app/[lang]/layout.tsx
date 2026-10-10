import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LanguageProvider } from "@/lib/i18n";
import CookieConsent from "@/components/CookieConsent";
import { GoogleTagManagerScript } from "@/components/GoogleTagManager";
import { LOCALES, isLang, type Lang } from "@/lib/locales";
import { SITE_URL, localeAlternates, socialMeta, verificationMeta } from "@/lib/siteMeta";
// Fonts ship from node_modules rather than next/font/google: Turbopack fails the
// build whenever Google Fonts answers with query-string font URLs, so the build
// must not depend on fonts.googleapis.com at all.
import "@fontsource-variable/hanken-grotesk/wght.css";
import "@fontsource-variable/inter/wght.css";
import "../globals.css";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

const SITE_META: Record<Lang, { title: string; description: string }> = {
  cs: {
    title: "ApexGold: generální úklid a regenerace kamenných podlah | Praha",
    description:
      "Profesionální generální úklid komerčních prostor a renovace kamenných podlah pro firmy v Praze a Středočeském kraji. Kalkulace zdarma do 24 hodin.",
  },
  en: {
    title: "ApexGold: deep cleaning and stone floor restoration | Prague",
    description:
      "Professional deep cleaning of commercial spaces and stone floor restoration for businesses in Prague and Central Bohemia. Free quote within 24 hours.",
  },
  sk: {
    title: "ApexGold: generálne upratovanie a renovácia kamenných podláh | Praha",
    description:
      "Profesionálne generálne upratovanie komerčných priestorov a renovácia kamenných podláh pre firmy v Prahe a Stredočeskom kraji. Kalkulácia zdarma do 24 hodín.",
  },
  uk: {
    title: "ApexGold: генеральне прибирання та реставрація кам’яних підлог | Прага",
    description:
      "Професійне генеральне прибирання комерційних приміщень та реставрація кам’яних підлог для бізнесу в Празі та Середньочеському краї. Безкоштовний кошторис протягом 24 годин.",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const l: Lang = isLang(lang) ? lang : "cs";
  const m = SITE_META[l];
  return {
    metadataBase: new URL(SITE_URL),
    title: m.title,
    description: m.description,
    alternates: localeAlternates(l, ""),
    ...verificationMeta(),
    ...socialMeta({ lang: l, path: "", title: m.title, description: m.description }),
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();

  return (
    <html lang={lang}>
      <head>
        <GoogleTagManagerScript />
      </head>
      <body>
        <LanguageProvider lang={lang}>
          {children}
          <CookieConsent />
        </LanguageProvider>
      </body>
    </html>
  );
}
