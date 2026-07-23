import { servicePageData, type ServiceSlug } from "./servicePageData";
import { pickTr3, type Lang } from "./locales";

interface ServiceSeo {
  title: string;
  description: string;
  serviceName: string;
  serviceType: string;
}

/**
 * Curated, SEO-tuned Czech metadata (primary market: apexgold.cz, prices in Kč).
 * For other locales we derive the title/description from the already-translated
 * page copy in servicePageData (h1 + heroSub), keeping a single source of truth.
 */
const serviceSeoCs: Record<ServiceSlug, ServiceSeo> = {
  "generalni-uklid": {
    title: "Generální úklid Praha a Středočeský kraj | ApexGold",
    description:
      "Generální úklid kanceláří, provozoven a bytů po rekonstrukci v Praze a okolí. Smlouva, kontrolní seznam a fotoreport. Kalkulace zdarma do 24 hodin.",
    serviceName: "Generální úklid",
    serviceType: "Generální úklid komerčních objektů a bytů",
  },
  "uklid-po-stavbe": {
    title: "Úklid po stavbě Praha od 55 Kč/m² | ApexGold",
    description:
      "Profesionální úklid po stavbě a rekonstrukci v Praze a Středočeském kraji. Odstranění stavebního prachu, lepidel a fólií. Nástup do 48 hodin, kalkulace zdarma.",
    serviceName: "Úklid po stavbě",
    serviceType: "Úklid po stavbě a rekonstrukci",
  },
  "myti-oken": {
    title: "Mytí oken Praha od 18 Kč/m² | ApexGold",
    description:
      "Mytí oken, výloh a prosklených ploch v Praze a okolí. Klasicky i ve výškách bez lešení, teleskopické tyče s demineralizovanou vodou. Firmy, SVJ i domácnosti.",
    serviceName: "Mytí oken",
    serviceType: "Mytí oken a prosklených ploch",
  },
  "cisteni-koberce-calouneni": {
    title: "Mytí koberců a čištění čalounění Praha | ApexGold",
    description:
      "Extrakční čištění koberců od 18 Kč/m² a čalounění od 400 Kč/kus přímo u vás. Odstraníme skvrny, alergeny i zápach. Kanceláře, hotely, restaurace i domácnosti.",
    serviceName: "Mytí koberců a čištění čalounění",
    serviceType: "Extrakční čištění koberců a čalouněného nábytku",
  },
  "cisteni-a-voskovani-podlah": {
    title: "Strojové čištění a voskování podlah Praha | ApexGold",
    description:
      "Strojové mytí podlah od 35 Kč/m², stripování a voskování od 70 Kč/m². PVC, linoleum, dlažba i beton. Pracujeme v noci a o víkendu bez omezení provozu.",
    serviceName: "Strojové čištění a voskování podlah",
    serviceType: "Strojové čištění a voskování podlah",
  },
  "uklid-garazi-a-hal": {
    title: "Čištění garáží a úklid hal Praha | ApexGold",
    description:
      "Strojové čištění podzemních garáží od 9 Kč/m² a úklid hal a skladů od 55 Kč/m². Práce po sekcích bez přerušení provozu. Praha a Středočeský kraj.",
    serviceName: "Čištění garáží a úklid hal",
    serviceType: "Strojové čištění garáží, hal a skladů",
  },
  "myti-fasad": {
    title: "Mytí fasád Praha od 70 Kč/m² | ApexGold",
    description:
      "Šetrné mytí fasád bytových domů, kanceláří i rodinných domů. Odstranění řas a plísní, biocidní ošetření a impregnace. Práce z plošin i horolezeckou technikou.",
    serviceName: "Mytí fasád",
    serviceType: "Mytí a biocidní ošetření fasád",
  },
  "renovace-mramoru": {
    title: "Renovace a leštění mramoru Praha | ApexGold",
    description:
      "Broušení, leštění a impregnace mramorových podlah, schodišť a parapetů v Praze. Odstraníme škrábance a matná místa. Kalkulace zdarma do 24 hodin.",
    serviceName: "Renovace mramoru",
    serviceType: "Broušení a leštění mramorových povrchů",
  },
  "renovace-zuly": {
    title: "Renovace a leštění žuly Praha | ApexGold",
    description:
      "Broušení, leštění a impregnace žulových podlah, schodů a desek v Praze a okolí. Odolný lesk na roky. Kalkulace zdarma do 24 hodin.",
    serviceName: "Renovace žuly",
    serviceType: "Broušení a leštění žulových povrchů",
  },
  "renovace-terasy": {
    title: "Renovace kamenných teras Praha | ApexGold",
    description:
      "Mytí, broušení, impregnace a voskování venkovních kamenných teras a dlažeb v Praze a Středočeském kraji. Kalkulace zdarma do 24 hodin.",
    serviceName: "Renovace terasy",
    serviceType: "Renovace kamenných teras a venkovních dlažeb",
  },
};

/** Localized <title>/description + JSON-LD service naming for a service page. */
export function getServiceMeta(slug: ServiceSlug, lang: Lang): ServiceSeo {
  const cs = serviceSeoCs[slug];
  if (lang === "cs") return cs;

  const d = servicePageData[slug];
  return {
    title: `${pickTr3(d.h1, lang)} | ApexGold`,
    description: pickTr3(d.heroSub, lang),
    serviceName: pickTr3(d.crumb, lang),
    // serviceType stays as the curated Czech technical descriptor for schema.org typing.
    serviceType: cs.serviceType,
  };
}

const CRUMB_HOME: Record<Lang, string> = {
  cs: "Domů",
  en: "Home",
  sk: "Domov",
  uk: "Головна",
};

const CRUMB_SERVICES: Record<Lang, string> = {
  cs: "Úklidové služby",
  en: "Cleaning services",
  sk: "Upratovacie služby",
  uk: "Клінінгові послуги",
};

export function breadcrumbLabels(lang: Lang) {
  return { home: CRUMB_HOME[lang], services: CRUMB_SERVICES[lang] };
}
