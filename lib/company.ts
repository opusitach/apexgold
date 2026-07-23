// Single source of truth for the data controller's identity, used by the
// legal pages, the footer identification block and the JSON-LD.

export const COMPANY = {
  /** Trading / brand name shown across the site. */
  name: "Apex Gold",
  /** OSVČ or s.r.o. — the exact legal form of the controller. */
  legalForm: "s.r.o.",
  /** Company registration number (IČO). */
  ico: "19753829",
  /** Registered seat (sídlo) / place of business. */
  address: "Sarajevská 1051/10, Vinohrady, 120 00 Praha 2",
  /** Public contact address shown in the footer contacts block. */
  contactAddress: "Sarajevská 1051/10, Vinohrady, 120 00 Praha 2",
  /** Address for data-subject requests. */
  email: "info@apexgold.cz",
  phone: "+420 775 052 281",
  /** Supervisory authority for GDPR complaints in the Czech Republic. */
  authority: "Úřad pro ochranu osobních údajů (ÚOOÚ), Pplk. Sochora 27, 170 00 Praha 7, uoou.gov.cz",
} as const;

/** Date the current version of the legal documents takes effect. */
export const LEGAL_EFFECTIVE_DATE = "2026-07-21";
