import type { Metadata } from "next";
import { Hanken_Grotesk, Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { LanguageProvider } from "@/lib/i18n";
import CookieConsent from "@/components/CookieConsent";
import { LOCALES, isLang, type Lang } from "@/lib/locales";
import { SITE_URL, localeAlternates, socialMeta } from "@/lib/siteMeta";
import "../globals.css";

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "500", "600"],
});

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
    <html lang={lang} className={`${hanken.variable} ${inter.variable}`}>
      <body>
        <LanguageProvider lang={lang}>
          {children}
          <CookieConsent />
        </LanguageProvider>
      </body>
    </html>
  );
}
