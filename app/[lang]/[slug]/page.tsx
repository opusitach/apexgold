import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServicePage from "@/components/ServicePage";
import { SERVICE_SLUGS, servicePageData, type ServiceSlug } from "@/lib/servicePageData";
import { getServiceMeta, breadcrumbLabels } from "@/lib/serviceSeo";
import { isLang, pickTr3, type Lang } from "@/lib/locales";
import { SITE_URL, localeAlternates, socialMeta } from "@/lib/siteMeta";
import { AREA_SERVED, BUSINESS_ID, jsonLdScript, localBusinessNode } from "@/lib/schema";

export function generateStaticParams() {
  return SERVICE_SLUGS.map((slug) => ({ slug }));
}

function isServiceSlug(slug: string): slug is ServiceSlug {
  return (SERVICE_SLUGS as readonly string[]).includes(slug);
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLang(lang) || !isServiceSlug(slug)) return {};
  const meta = getServiceMeta(slug, lang);
  return {
    title: meta.title,
    description: meta.description,
    alternates: localeAlternates(lang, `/${slug}`),
    ...socialMeta({
      lang,
      path: `/${slug}`,
      title: meta.title,
      description: meta.description,
      // One share image per service, cropped from that page's own hero photo.
      image: { url: `/images/og/${slug}.jpg`, width: 1200, height: 630 },
      imageAlt: pickTr3(servicePageData[slug].h1, lang),
    }),
  };
}

export default async function Page({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  if (!isLang(lang) || !isServiceSlug(slug)) notFound();

  const l: Lang = lang;
  const meta = getServiceMeta(slug, l);
  const d = servicePageData[slug];
  const crumbs = breadcrumbLabels(l);
  const pageUrl = `${SITE_URL}/${l}/${slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      localBusinessNode(),
      {
        "@type": "Service",
        name: meta.serviceName,
        serviceType: meta.serviceType,
        description: meta.description,
        url: pageUrl,
        image: `${SITE_URL}/images/og/${slug}.jpg`,
        provider: { "@id": BUSINESS_ID },
        areaServed: AREA_SERVED,
        offers: d.prices.map((p) => ({
          "@type": "Offer",
          name: pickTr3(p.name, l),
          priceCurrency: "CZK",
          price: p.price.replace(/[^0-9]/g, ""),
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: p.price.replace(/[^0-9]/g, ""),
            priceCurrency: "CZK",
            unitText: p.unit.replace("/", ""),
          },
        })),
      },
      // The same Q&A the accordion renders. Every answer is in the DOM, so the
      // markup never describes content a visitor cannot reach.
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        mainEntity: d.faqs.map((f) => ({
          "@type": "Question",
          name: pickTr3(f.q, l),
          acceptedAnswer: { "@type": "Answer", text: pickTr3(f.a, l) },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: crumbs.home, item: `${SITE_URL}/${l}` },
          { "@type": "ListItem", position: 2, name: crumbs.services, item: `${SITE_URL}/${l}#services` },
          { "@type": "ListItem", position: 3, name: pickTr3(d.crumb, l) },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }} />
      <ServicePage slug={slug} />
    </>
  );
}
