// Shared JSON-LD building blocks. The LocalBusiness node is emitted with a
// stable @id so every page's graph (Service, FAQPage, Breadcrumb…) can point at
// the same entity instead of redeclaring the company.

import { COMPANY } from "./company";
import { SITE_URL } from "./siteMeta";
import { type Lang } from "./locales";

export const BUSINESS_ID = `${SITE_URL}/#firma`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/**
 * Mirrors the two coverage tiers rendered in the "Kde působíme" section: the
 * home region first, then the countries we actually take jobs in.
 */
export const AREA_SERVED = [
  { "@type": "City", name: "Praha" },
  { "@type": "AdministrativeArea", name: "Středočeský kraj" },
  { "@type": "Country", name: "Česká republika" },
  { "@type": "Country", name: "Slovensko" },
  { "@type": "Country", name: "Německo" },
];

/** Digits-only E.164 form for schema.org / tel: consumers. */
const TELEPHONE = `+${COMPANY.phone.replace(/\D/g, "")}`;

export function localBusinessNode() {
  return {
    // The trades we sell (cleaning, floor restoration) are a HomeAndConstruction
    // business, but the generic LocalBusiness type is what consumers key off, so
    // both are declared rather than picking one.
    "@type": ["LocalBusiness", "HomeAndConstructionBusiness"],
    "@id": BUSINESS_ID,
    name: `${COMPANY.name} ${COMPANY.legalForm}`,
    url: `${SITE_URL}/`,
    telephone: TELEPHONE,
    email: COMPANY.email,
    image: `${SITE_URL}/images/og-default.jpg`,
    logo: `${SITE_URL}/images/logo.svg`,
    // IČO is a company registration number, not a VAT id — `vatID` would be the
    // DIČ (CZ + IČO) and only once the company is VAT-registered. Publishing it
    // as a named identifier is what lets Google tie the site to the entry in the
    // commercial register.
    identifier: {
      "@type": "PropertyValue",
      propertyID: "ICO",
      value: COMPANY.ico,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Sarajevská 1051/10",
      addressLocality: "Praha 2 - Vinohrady",
      postalCode: "120 00",
      addressCountry: "CZ",
    },
    areaServed: AREA_SERVED,
    openingHours: "Mo-Su 00:00-24:00",
    priceRange: "$$",
  };
}

export function webSiteNode(lang: Lang) {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: `${SITE_URL}/${lang}`,
    name: COMPANY.name,
    inLanguage: lang,
    publisher: { "@id": BUSINESS_ID },
  };
}

/**
 * Serialize a JSON-LD graph for `dangerouslySetInnerHTML`. Escaping `<` keeps a
 * stray tag inside any content string from breaking out of the script element.
 */
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
