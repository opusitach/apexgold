"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { getConsent, setConsent, hasConsent, onConsentChange } from "@/lib/consent";
import { ensureGtag, updateConsentMode } from "@/lib/gtm";
import { captureAttribution } from "@/lib/leadMeta";
import { LEGAL_DOCS } from "@/lib/legalContent";
import styles from "./CookieConsent.module.css";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;

/**
 * Load Google Analytics + Google Ads only after consent. No-op unless the
 * corresponding NEXT_PUBLIC_* id is configured, so nothing third-party runs
 * until both an id exists and the visitor has accepted.
 *
 * Google Tag Manager is separate: it is always on the page and hears about the
 * decision through updateConsentMode() instead — see lib/gtm.ts.
 */
function loadAnalytics() {
  if (typeof window === "undefined" || window.__apexAnalyticsLoaded) return;
  const id = GA_ID || ADS_ID;
  if (!id) return;
  window.__apexAnalyticsLoaded = true;

  const gtag = ensureGtag();
  gtag("js", new Date());
  if (GA_ID) gtag("config", GA_ID);
  if (ADS_ID) gtag("config", ADS_ID);

  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(s);
}

const subscribeConsent = (onStoreChange: () => void) => onConsentChange(onStoreChange);
const getConsentPendingSnapshot = () => getConsent() === null;
const getConsentPendingServerSnapshot = () => false;

export default function CookieConsent() {
  const { t, lang } = useLang();
  // First visit (no decision yet): derive from storage instead of setState-in-effect,
  // so hydration starts hidden and flips once the client can read localStorage.
  const consentPending = useSyncExternalStore(
    subscribeConsent,
    getConsentPendingSnapshot,
    getConsentPendingServerSnapshot
  );
  const [manualOpen, setManualOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [analyticsOn, setAnalyticsOn] = useState(true);
  const open = manualOpen || consentPending;

  useEffect(() => {
    // Load analytics on a fresh page view if the visitor previously accepted.
    if (hasConsent()) loadAnalytics();
    const reopen = () => {
      setShowSettings(false);
      setManualOpen(true);
    };
    window.addEventListener("apexgold-consent-open", reopen);
    return () => window.removeEventListener("apexgold-consent-open", reopen);
  }, []);

  const accept = useCallback(() => {
    setConsent("granted");
    captureAttribution();
    updateConsentMode("granted");
    loadAnalytics();
    setManualOpen(false);
  }, []);

  const reject = useCallback(() => {
    setConsent("denied");
    // Consent Mode already defaults to denied; the explicit update is what
    // releases tags waiting on wait_for_update instead of stalling them.
    updateConsentMode("denied");
    setManualOpen(false);
  }, []);

  const saveSettings = useCallback(() => {
    if (analyticsOn) accept();
    else reject();
  }, [analyticsOn, accept, reject]);

  if (!open) return null;

  const cookieHref = `/${lang}/${LEGAL_DOCS.cookies.slug}`;

  return (
    <div className={styles.wrap} role="dialog" aria-live="polite" aria-label={t("Cookies", "Cookies", "Cookies", "Файли cookie")}>
      <div className={styles.panel}>
        <div className={styles.body}>
          <h2 className={styles.title}>{t("Cookies na tomto webu", "Cookies on this site", "Cookies na tomto webe", "Файли cookie на цьому сайті")}</h2>
          <p className={styles.text}>
            {t(
              "Používáme cookies k měření návštěvnosti a vyhodnocení reklamy. Analytické a marketingové cookies zapneme jen s vaším souhlasem.",
              "We use cookies to measure traffic and evaluate advertising. We enable analytics and marketing cookies only with your consent.",
              "Používame cookies na meranie návštevnosti a vyhodnotenie reklamy. Analytické a marketingové cookies zapneme len s vaším súhlasom.",
              "Ми використовуємо cookie для вимірювання відвідуваності та оцінки реклами. Аналітичні й маркетингові cookie вмикаємо лише за вашою згодою."
            )}{" "}
            <Link href={cookieHref} className={styles.link}>
              {t("Zásady používání cookies", "Cookie policy", "Zásady používania cookies", "Політика використання файлів cookie")}
            </Link>
          </p>

          {showSettings && (
            <div className={styles.settings}>
              <label className={`${styles.row} ${styles.rowDisabled}`}>
                <input type="checkbox" checked disabled />
                <span>
                  <strong>{t("Nezbytné", "Necessary", "Nevyhnutné", "Необхідні")}</strong>
                  {t(
                    ": potřebné pro fungování webu, vždy aktivní.",
                    ": required for the site to work, always on.",
                    ": potrebné pre fungovanie webu, vždy aktívne.",
                    ": потрібні для роботи сайту, завжди активні."
                  )}
                </span>
              </label>
              <label className={styles.row}>
                <input type="checkbox" checked={analyticsOn} onChange={(e) => setAnalyticsOn(e.target.checked)} />
                <span>
                  <strong>{t("Analytické a marketingové", "Analytics and marketing", "Analytické a marketingové", "Аналітичні та маркетингові")}</strong>
                  {t(
                    ": Google Analytics a atribuce kampaní (Google Ads, UTM, GCLID).",
                    ": Google Analytics and campaign attribution (Google Ads, UTM, GCLID).",
                    ": Google Analytics a atribúcia kampaní (Google Ads, UTM, GCLID).",
                    ": Google Analytics і атрибуція кампаній (Google Ads, UTM, GCLID)."
                  )}
                </span>
              </label>
            </div>
          )}
        </div>

        <div className={styles.actions}>
          {showSettings ? (
            <button type="button" className={styles.primary} onClick={saveSettings}>
              {t("Uložit volbu", "Save choice", "Uložiť voľbu", "Зберегти вибір")}
            </button>
          ) : (
            <>
              <button type="button" className={styles.primary} onClick={accept}>
                {t("Přijmout", "Accept", "Prijať", "Прийняти")}
              </button>
              <button type="button" className={styles.primary} onClick={reject}>
                {t("Odmítnout", "Reject", "Odmietnuť", "Відхилити")}
              </button>
            </>
          )}
          <button type="button" className={styles.ghost} onClick={() => setShowSettings((s) => !s)}>
            {t("Nastavení", "Settings", "Nastavenie", "Налаштування")}
          </button>
        </div>
      </div>
    </div>
  );
}
