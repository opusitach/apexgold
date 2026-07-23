"use client";

import { useEffect, useRef, useState } from "react";
import { useLang, type Lang } from "@/lib/i18n";
import { flagDataUri, LANG_LABELS, LANG_ORDER } from "@/lib/flags";
import { COMPANY } from "@/lib/company";
import styles from "./Header.module.css";

interface HeaderProps {
  /** Pass "/" when rendering on a service sub-page so anchor links point back to the homepage sections. */
  base?: string;
  /** Pass true on pages without an on-page request form (legal, 404) so the CTA links to the homepage form. */
  noForm?: boolean;
}

export default function Header({ base = "", noForm = false }: HeaderProps) {
  const { lang, setLang, t } = useLang();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // On a service sub-page (base="/") cross-page anchors must point back to the localized homepage.
  const anchorBase = base ? `/${lang}` : "";
  const hrefHome = `/${lang}`;
  const hrefAbout = `${anchorBase}#about`;
  const hrefServices = `${anchorBase}#services`;
  const hrefProcess = `${anchorBase}#process`;
  const hrefReviews = `${anchorBase}#reviews`;
  // Pages without an on-page form send the CTA to the homepage request form.
  const hrefRequest = noForm ? `/${lang}#request` : base ? "#poptavka" : "#request";

  const navAbout = t("O nás", "About", "O nás", "Про нас");
  const navServices = t("Služby", "Services", "Služby", "Послуги");
  const navProcess = t("Postup", "Process", "Postup", "Процес");
  const navReviews = t("Recenze", "Reviews", "Recenzie", "Відгуки");
  const cta = t("Získat nabídku", "Get a quote", "Získať ponuku", "Отримати розрахунок");

  function chooseLang(l: Lang) {
    setLang(l);
    setLangOpen(false);
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.row}>
          <a href={hrefHome} className={styles.logo}>
            {/* eslint-disable-next-line @next/next/no-img-element -- SVG logo: nothing for the optimizer to do, width/height reserve the space */}
            <img src="/images/logo.svg" alt="" width={786} height={397} className={styles.logoImg} />
            <span className={styles.logoText}>ApexGold</span>
          </a>

          <nav className={`apex-desknav ${styles.nav}`}>
            <a href={hrefAbout} className={styles.navLink}>
              {navAbout}
            </a>
            <a href={hrefServices} className={styles.navLink}>
              {navServices}
            </a>
            <a href={hrefProcess} className={styles.navLink}>
              {navProcess}
            </a>
            <a href={hrefReviews} className={styles.navLink}>
              {navReviews}
            </a>
          </nav>

          <div className={`apex-deskright ${styles.right}`}>
            <div className={styles.langWrap} ref={langRef}>
              <button type="button" className={styles.langBtn} onClick={() => setLangOpen((v) => !v)}>
                {/* eslint-disable-next-line @next/next/no-img-element -- tiny inline SVG data URI, not a photo */}
                <img src={flagDataUri(lang)} width={18} height={18} alt="" className={styles.flagImg} />
                {LANG_LABELS[lang]}
                <svg width="11" height="11" viewBox="0 0 12 12" className={styles.chevron}>
                  <path d="M2 4 L6 8 L10 4" stroke="#15201B" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {langOpen && (
                <div className={styles.langMenu}>
                  <div className={styles.langMenuInner}>
                    {LANG_ORDER.map((l) => (
                      <button
                        key={l}
                        type="button"
                        onClick={() => chooseLang(l)}
                        className={`${styles.langOption} ${l === lang ? styles.active : ""}`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element -- tiny inline SVG data URI, not a photo */}
                        <img src={flagDataUri(l)} width={18} height={18} alt="" className={styles.flagImg} />
                        {LANG_LABELS[l]}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <a href="tel:+420775052281" className={`apex-phone ${styles.phone}`}>
              {COMPANY.phone}
            </a>
            <a href={hrefRequest} className={styles.cta}>
              {cta}
            </a>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
            className={`apex-burger ${styles.burger}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" stroke="#15201B" strokeWidth="1.8" strokeLinecap="round">
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </svg>
          </button>
        </div>

        {mobileOpen && (
          <div className={styles.mobilePanel}>
            <div className={styles.mobileLinks}>
              <a href={hrefAbout} onClick={() => setMobileOpen(false)} className={styles.mobileLink}>
                {navAbout}
              </a>
              <a href={hrefServices} onClick={() => setMobileOpen(false)} className={styles.mobileLink}>
                {navServices}
              </a>
              <a href={hrefProcess} onClick={() => setMobileOpen(false)} className={styles.mobileLink}>
                {navProcess}
              </a>
              <a href={hrefReviews} onClick={() => setMobileOpen(false)} className={styles.mobileLink}>
                {navReviews}
              </a>
            </div>
            <div className={styles.mobileRow}>
              <a href="tel:+420775052281" className={styles.mobilePhone}>
                {COMPANY.phone}
              </a>
              <div className={styles.mobileLangs}>
                {LANG_ORDER.map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => chooseLang(l)}
                    className={`${styles.mobileLangBtn} ${l === lang ? styles.active : ""}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- tiny inline SVG data URI, not a photo */}
                    <img src={flagDataUri(l)} width={16} height={16} alt="" className={styles.flagImg} />
                    {LANG_LABELS[l]}
                  </button>
                ))}
              </div>
            </div>
            <a href={hrefRequest} onClick={() => setMobileOpen(false)} className={styles.mobileCta}>
              {cta}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
