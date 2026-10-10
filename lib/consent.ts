"use client";

// Client-side cookie/consent state. Analytics and marketing identifiers
// (Google Analytics, Google Ads / GCLID, UTM attribution) may only be
// collected once the visitor has actively accepted. Default is "denied".

import { CONSENT_KEY as KEY } from "./gtm";

export type ConsentValue = "granted" | "denied";

const EVENT = "apexgold-consent-change";

/** Returns the stored choice, or null if the visitor has not decided yet. */
export function getConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null;
  try {
    const v = localStorage.getItem(KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

/** True only when the visitor has explicitly accepted. */
export function hasConsent(): boolean {
  return getConsent() === "granted";
}

/** Persist the choice and notify listeners (banner, analytics loader). */
export function setConsent(value: ConsentValue): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, value);
  } catch {
    // storage unavailable — the choice simply won't persist across reloads
  }
  try {
    window.dispatchEvent(new CustomEvent<ConsentValue>(EVENT, { detail: value }));
  } catch {
    // CustomEvent unsupported — nothing more to do
  }
}

/**
 * Subscribe to consent changes, including ones made in another tab. Returns an
 * unsubscribe function.
 */
export function onConsentChange(cb: (value: ConsentValue | null) => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = (e: Event) => cb((e as CustomEvent<ConsentValue>).detail);
  const storageHandler = (e: StorageEvent) => {
    if (e.key === KEY || e.key === null) cb(getConsent());
  };
  window.addEventListener(EVENT, handler);
  window.addEventListener("storage", storageHandler);
  return () => {
    window.removeEventListener(EVENT, handler);
    window.removeEventListener("storage", storageHandler);
  };
}

/** Re-open the cookie banner from anywhere (e.g. a footer "Cookie settings" link). */
export function openConsentSettings(): void {
  if (typeof window === "undefined") return;
  try {
    window.dispatchEvent(new CustomEvent("apexgold-consent-open"));
  } catch {
    // no-op
  }
}
