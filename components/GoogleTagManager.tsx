import { GTM_ID, gtmInitScript } from "@/lib/gtm";

/**
 * Google Tag Manager, split into the two halves the install guide asks for.
 *
 * A raw inline <script> rather than next/script: it is emitted exactly where
 * it is rendered and runs synchronously as the browser parses the HTML, so
 * placing it first inside <head> gets the container as high on the page as GTM
 * asks for. `beforeInteractive` would instead defer it into Next's bootstrap
 * payload near the end of <body>.
 *
 * The Consent Mode v2 defaults travel inside the same script, ahead of the
 * container loader — see lib/gtm.ts.
 */
export function GoogleTagManagerScript() {
  if (!GTM_ID) return null;
  return <script dangerouslySetInnerHTML={{ __html: gtmInitScript(GTM_ID) }} />;
}

/** The scriptless fallback. Belongs immediately after the opening <body> tag. */
export function GoogleTagManagerNoScript() {
  if (!GTM_ID) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
      />
    </noscript>
  );
}
