import type { Lang } from "./i18n";

function svgToDataUri(svg: string) {
  return "data:image/svg+xml," + encodeURIComponent(svg);
}

const FLAG_SVG: Record<Lang, string> = {
  sk: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="8" fill="#fff"/><rect y="8" width="24" height="8" fill="#0B4EA2"/><rect y="16" width="24" height="8" fill="#EE1620"/><path d="M4 5.5h7.5v8.2c0 2.6-1.9 4-3.75 4.9C5.9 17.7 4 16.3 4 13.7Z" fill="#EE1620" stroke="#fff" stroke-width="0.8"/><path d="M4.6 15.6c1-1.4 2.1-1.4 3.15-0.8c1.05-0.6 2.15-0.6 3.15 0.8v2.4c-1-1.2-2.1-1.2-3.15-0.6c-1.05-0.6-2.15-0.6-3.15 0.6Z" fill="#0B4EA2"/><path d="M7.15 7.4h1.2v1.9h1.7v1.2h-1.7v1.5h2.3v1.2h-2.3v1.8h-1.2v-1.8H4.85v-1.2h2.3v-1.5h-1.7v-1.2h1.7Z" fill="#fff"/></svg>',
  en: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#012169"/><path d="M0 0L24 24M24 0L0 24" stroke="#fff" stroke-width="3.5"/><path d="M0 0L24 24M24 0L0 24" stroke="#C8102E" stroke-width="2"/><path d="M12 0V24M0 12H24" stroke="#fff" stroke-width="5.5"/><path d="M12 0V24M0 12H24" stroke="#C8102E" stroke-width="3"/></svg>',
  cs: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="12" fill="#fff"/><rect y="12" width="24" height="12" fill="#D7141A"/><path d="M0 0L13 12L0 24Z" fill="#11457E"/></svg>',
  uk: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="12" fill="#0057B7"/><rect y="12" width="24" height="12" fill="#FFD700"/></svg>',
};

export function flagDataUri(lang: Lang): string {
  return svgToDataUri(FLAG_SVG[lang]);
}

export const LANG_LABELS: Record<Lang, string> = {
  cs: "CZ",
  en: "EN",
  sk: "SK",
  uk: "UA",
};

export const LANG_ORDER: Lang[] = ["cs", "en", "sk", "uk"];
