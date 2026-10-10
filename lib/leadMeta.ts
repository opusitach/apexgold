"use client";

// Technical and marketing metadata attached to a lead when (and only when) the
// visitor has accepted cookies. Without consent getLeadMeta() returns {} so the
// hidden attribution fields go out empty — we never collect them "just in case".

import { hasConsent } from "./consent";

const ATTR_KEY = "apexgold-attr";

export interface LeadMeta {
  submittedAt: string;
  pageUrl: string;
  pageTitle: string;
  referrer: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  utmTerm: string;
  gclid: string;
  deviceType: "Desktop" | "Mobile" | "Tablet";
  browserLang: string;
}

interface Attribution {
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  utmTerm: string;
  gclid: string;
  referrer: string;
}

function deviceType(): LeadMeta["deviceType"] {
  const ua = navigator.userAgent;
  if (/iPad|Tablet|(Android(?!.*Mobile))/i.test(ua)) return "Tablet";
  if (/Mobi|iPhone|Android/i.test(ua)) return "Mobile";
  return "Desktop";
}

/**
 * Capture first-touch attribution from the current URL into sessionStorage.
 * Call this only after consent is granted (the cookie banner does so on accept).
 * First-touch: we don't overwrite values captured earlier in the session.
 */
export function captureAttribution(): void {
  if (typeof window === "undefined" || !hasConsent()) return;
  try {
    if (sessionStorage.getItem(ATTR_KEY)) return;
    const p = new URLSearchParams(window.location.search);
    const attr: Attribution = {
      utmSource: p.get("utm_source") ?? "",
      utmMedium: p.get("utm_medium") ?? "",
      utmCampaign: p.get("utm_campaign") ?? "",
      utmContent: p.get("utm_content") ?? "",
      utmTerm: p.get("utm_term") ?? "",
      gclid: p.get("gclid") ?? "",
      referrer: document.referrer ?? "",
    };
    sessionStorage.setItem(ATTR_KEY, JSON.stringify(attr));
  } catch {
    // storage unavailable — attribution just won't be captured
  }
}

/** Drop captured attribution — used when the visitor withdraws consent. */
export function clearAttribution(): void {
  try {
    sessionStorage.removeItem(ATTR_KEY);
  } catch {
    // storage unavailable — nothing was captured
  }
}

function readAttribution(): Attribution {
  const empty: Attribution = {
    utmSource: "",
    utmMedium: "",
    utmCampaign: "",
    utmContent: "",
    utmTerm: "",
    gclid: "",
    referrer: "",
  };
  try {
    const raw = sessionStorage.getItem(ATTR_KEY);
    if (raw) return { ...empty, ...(JSON.parse(raw) as Partial<Attribution>) };
  } catch {
    // ignore
  }
  return empty;
}

/**
 * Metadata to merge into a submitted lead. Returns an empty object when the
 * visitor has not accepted cookies, so no marketing/technical data is stored.
 */
export function getLeadMeta(): Partial<LeadMeta> {
  if (typeof window === "undefined" || !hasConsent()) return {};
  const attr = readAttribution();
  // Fall back to live URL params if the visitor accepted on this very page.
  const live = new URLSearchParams(window.location.search);
  return {
    submittedAt: new Date().toISOString(),
    pageUrl: window.location.href,
    pageTitle: document.title,
    referrer: attr.referrer || document.referrer || "",
    utmSource: attr.utmSource || live.get("utm_source") || "",
    utmMedium: attr.utmMedium || live.get("utm_medium") || "",
    utmCampaign: attr.utmCampaign || live.get("utm_campaign") || "",
    utmContent: attr.utmContent || live.get("utm_content") || "",
    utmTerm: attr.utmTerm || live.get("utm_term") || "",
    gclid: attr.gclid || live.get("gclid") || "",
    deviceType: deviceType(),
    browserLang: navigator.language || "",
  };
}
