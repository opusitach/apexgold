import { GTM_ID, gtmInitScript } from "@/lib/gtm";

/**
 * Google Tag Manager head script.
 *
 * A raw inline <script> rather than next/script: it is emitted exactly where
 * it is rendered and runs synchronously as the browser parses the HTML, so
 * placing it first inside <head> gets the container as high on the page as GTM
 * asks for. `beforeInteractive` would instead defer it into Next's bootstrap
 * payload near the end of <body>.
 *
 * The Consent Mode v2 defaults travel inside the same script, ahead of the
 * container loader, which only runs for a visitor who has already accepted —
 * see lib/gtm.ts.
 *
 * There is deliberately no <noscript> iframe: without JavaScript the cookie
 * banner cannot be answered, so the container must not load at all.
 */
export function GoogleTagManagerScript() {
  if (!GTM_ID) return null;
  return <script dangerouslySetInnerHTML={{ __html: gtmInitScript(GTM_ID) }} />;
}
