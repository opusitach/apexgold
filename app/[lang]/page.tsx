import { notFound } from "next/navigation";
import HomePage from "@/components/HomePage";
import { SERVICE_SLUGS, servicePageData } from "@/lib/servicePageData";
import { getServiceMeta } from "@/lib/serviceSeo";
import { isLang, pickTr3, type Lang } from "@/lib/locales";
import { SITE_URL } from "@/lib/siteMeta";
import { AREA_SERVED, BUSINESS_ID, jsonLdScript, localBusinessNode, webSiteNode } from "@/lib/schema";

/**
 * Server wrapper around the (client) homepage: it exists so the page can emit
 * structured data. Title/description/OG come from the locale layout.
 */
export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();

  const l: Lang = lang;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      localBusinessNode(),
      webSiteNode(l),
      // The service catalogue the homepage price blocks link to, so the entity
      // graph matches the internal linking a crawler actually follows.
      {
        "@type": "ItemList",
        "@id": `${SITE_URL}/${l}#services`,
        itemListElement: SERVICE_SLUGS.map((slug, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: pickTr3(servicePageData[slug].crumb, l),
          item: {
            "@type": "Service",
            name: getServiceMeta(slug, l).serviceName,
            url: `${SITE_URL}/${l}/${slug}`,
            provider: { "@id": BUSINESS_ID },
            areaServed: AREA_SERVED,
          },
        })),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }} />
      <HomePage />
    </>
  );
}
