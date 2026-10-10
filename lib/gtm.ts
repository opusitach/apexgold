// Google Tag Manager container for apexgold.cz.
//
// The container is loaded only once the visitor has accepted (Consent Mode
// "basic"). Loading it up front and relying on denied Consent Mode signals is
// not enough: GA4 and Google Ads inside it still send cookieless page_view
// pings (with gclid and the page URL), and the Ads call-tracking tag writes the
// gclid into localStorage — all for visitors who have rejected cookies.
//
// The Consent Mode defaults are still declared first, so every tag that runs
// after an accept sees an explicit consent state.

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
    __apexGtmLoaded?: boolean;
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
 * Load the container after the visitor accepts on this page view — the same
 * steps as the loader in gtmInitScript(), which covers returning visitors.
 */
export function loadGtm(): void {
  if (typeof window === "undefined" || window.__apexGtmLoaded || !GTM_ID) return;
  window.__apexGtmLoaded = true;
  ensureGtag();
  window.dataLayer!.push({ "gtm.start": Date.now(), event: "gtm.js" });
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
  document.head.appendChild(s);
}

/**
 * Inline head script: consent defaults first, then — only for a visitor who
 * accepted earlier — the consent update and the container loader. All of it
 * lives in one <script> so the order cannot be reshuffled. Everyone else gets
 * the container from loadGtm() once they accept in the banner.
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
var ok=false;
try{ok=localStorage.getItem(${JSON.stringify(CONSENT_KEY)})==='granted'}catch(e){}
if(ok){gtag('consent','update',${granted});
window.__apexGtmLoaded=true;
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer',${JSON.stringify(gtmId)});}`;
}

/** Cookies Google's tags write: GA (_ga, _gid, _gat), Ads (_gcl_*, _gac_*), AdSense. */
const GOOGLE_COOKIE = /^(_ga|_gid|_gat|_gcl_|_gac_|__gads|__gpi|__eoi)/;
/** localStorage written by the Ads tags: _gcl_ls and call-tracking ("<label>,<number>"). */
const GOOGLE_STORAGE = /^(_gcl_|_ga)|^[\w-]+,\d+(_expiresAt)?$/;

/**
 * Remove the identifiers Google's tags stored while consent was granted.
 * Consent Mode only stops new writes; the existing _ga / _gcl_* cookies would
 * otherwise keep identifying the visitor after they withdraw consent.
 */
export function clearGoogleStorage(): void {
  if (typeof window === "undefined") return;
  // The tags set cookies on the widest domain they can (e.g. .apexgold.cz), so
  // expire each one on the host and on every parent domain.
  const parts = window.location.hostname.split(".");
  const domains = [""];
  for (let i = 0; i < parts.length - 1; i++) domains.push(`; domain=.${parts.slice(i).join(".")}`);
  for (const c of document.cookie.split(";")) {
    const name = c.split("=")[0].trim();
    if (!GOOGLE_COOKIE.test(name)) continue;
    for (const d of domains) document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${d}`;
  }
  try {
    for (const k of Object.keys(localStorage)) if (GOOGLE_STORAGE.test(k)) localStorage.removeItem(k);
  } catch {
    // storage unavailable — nothing was stored there either
  }
}
