// Google Tag Manager container for apexgold.cz.
//
// Unlike the gtag.js snippet in components/CookieConsent.tsx, the container is
// loaded on every page view — it has to be, or GTM cannot react to the consent
// decision at all. What keeps that lawful is Consent Mode v2: the init script
// below denies every storage signal *before* gtm.js runs, so no analytics or
// advertising identifier is written until the visitor accepts in the banner.

import type { ConsentValue } from "./consent";

/**
 * Container id. Public by definition (it ships in the page source), so the
 * literal is a safe default for builds that do not pass NEXT_PUBLIC_GTM_ID.
 */
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "GTM-5366ZLNG";

/** localStorage key holding the visitor's cookie choice. */
export const CONSENT_KEY = "apexgold-consent";

/** The signals the cookie banner's "analytics and marketing" toggle controls. */
const CONSENT_SIGNALS = [
  "ad_storage",
  "ad_user_data",
  "ad_personalization",
  "analytics_storage",
] as const;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    __apexAnalyticsLoaded?: boolean;
  }
}

function consentState(value: ConsentValue): Record<string, ConsentValue> {
  return Object.fromEntries(CONSENT_SIGNALS.map((k) => [k, value]));
}

/**
 * The gtag command queue takes the raw `arguments` object — pushing a plain
 * array is not equivalent, Google's tags look for `[object Arguments]`. Hence
 * the old-style function declaration instead of rest parameters.
 */
export function ensureGtag(): NonNullable<Window["gtag"]> {
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== "function") {
    window.gtag = function gtagShim() {
      // Rest params would build a real Array; Google's tags only recognise an
      // `[object Arguments]` command.
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
  }
  return window.gtag;
}

/** Tell GTM (and any tag inside it) about the visitor's decision. */
export function updateConsentMode(value: ConsentValue): void {
  if (typeof window === "undefined") return;
  ensureGtag()("consent", "update", consentState(value));
}

/**
 * Inline head script: consent defaults first, then the container loader. Both
 * live in one <script> so their order cannot be reshuffled. The localStorage
 * read replays an earlier "accept" before gtm.js starts, which spares returning
 * visitors a page view measured under denied consent.
 */
export function gtmInitScript(gtmId: string): string {
  const denied = JSON.stringify({
    ...consentState("denied"),
    functionality_storage: "granted",
    security_storage: "granted",
    wait_for_update: 500,
  });
  const granted = JSON.stringify(consentState("granted"));

  return `window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments)}
window.gtag=gtag;
gtag('consent','default',${denied});
try{if(localStorage.getItem(${JSON.stringify(CONSENT_KEY)})==='granted'){gtag('consent','update',${granted})}}catch(e){}
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer',${JSON.stringify(gtmId)});`;
}
