import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LegalDoc from "@/components/LegalDoc";
import { LEGAL_DOCS } from "@/lib/legalContent";
import { LOCALES, isLang, pickTr3, type Lang } from "@/lib/locales";
import { localeAlternates, socialMeta } from "@/lib/siteMeta";

const SLUG = LEGAL_DOCS.privacy.slug;

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const title = pickTr3(LEGAL_DOCS.privacy.title, lang);
  return {
    title: `${title} | ApexGold`,
    description: pickTr3(LEGAL_DOCS.privacy.intro, lang),
    robots: { index: true, follow: true },
    alternates: localeAlternates(lang, `/${SLUG}`),
    ...socialMeta({ lang, path: `/${SLUG}`, title: `${title} | ApexGold`, description: pickTr3(LEGAL_DOCS.privacy.intro, lang) }),
  };
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const l: Lang = lang;
  return <LegalDoc docId="privacy" lang={l} />;
}
