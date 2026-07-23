"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { COMPANY } from "@/lib/company";
import { openConsentSettings } from "@/lib/consent";
import styles from "./Footer.module.css";

interface FooterProps {
  /** Pass "/" when rendering on a service sub-page so section links point back to the homepage. */
  base?: string;
  /** Pass true on pages without an on-page request form (legal, 404) so the CTA links to the homepage form. */
  noForm?: boolean;
}

export default function Footer({ base = "", noForm = false }: FooterProps) {
  const { t, lang } = useLang();
  // On a service sub-page (base="/") cross-page anchors must point back to the localized homepage.
  const anchorBase = base ? `/${lang}` : "";
  // Pages without an on-page form send the request link to the homepage form.
  const hrefRequest = noForm ? `/${lang}#request` : base ? "#poptavka" : "#request";

  const tagline = t(
    "Profesionální generální úklid komerčních prostor a renovace kamenných podlah pro firmy.",
    "Professional deep cleaning of commercial spaces and stone floor restoration for business.",
    "Profesionálne generálne upratovanie komerčných priestorov a renovácia kamenných podláh pre firmy.",
    "Професійне генеральне прибирання комерційних приміщень та реставрація кам’яних підлог для бізнесу."
  );
  // The two service columns mirror the site's own catalogue split (Úklid /
  // Renovace kamene), so every service page gets a site-wide link and each
  // anchor carries that page's own keyword instead of a generic category name.
  const colCleaning = t("Úklidové služby", "Cleaning services", "Upratovacie služby", "Клінінгові послуги");
  const colStone = t("Renovace kamene", "Stone restoration", "Renovácia kameňa", "Реставрація каменю");
  const colCompany = t("Společnost", "Company", "Spoločnosť", "Компанія");
  const colContacts = t("Kontakty", "Contacts", "Kontakty", "Контакти");
  const lGeneral = t("Generální úklid", "General cleaning", "Generálne upratovanie", "Генеральне прибирання");
  const lPostBuild = t("Úklid po stavbě", "Post-construction cleaning", "Upratovanie po stavbe", "Прибирання після будівництва");
  const lWindows = t("Mytí oken", "Window cleaning", "Umývanie okien", "Миття вікон");
  const lCarpet = t("Mytí koberců a čalounění", "Carpet and upholstery cleaning", "Čistenie kobercov a čalúnenia", "Чищення килимів та оббивки");
  const lFloors = t("Strojové čištění podlah", "Machine floor cleaning", "Strojové čistenie podláh", "Машинне чищення підлог");
  const lHalls = t("Čištění garáží a hal", "Garage and hall cleaning", "Čistenie garáží a hál", "Чищення гаражів і цехів");
  const lFacades = t("Mytí fasád", "Facade washing", "Umývanie fasád", "Миття фасадів");
  const lMarble = t("Renovace mramoru", "Marble renovation", "Renovácia mramoru", "Регенерація мармуру");
  const lGranite = t("Renovace žuly", "Granite renovation", "Renovácia žuly", "Регенерація граніту");
  const lTerrace = t("Renovace teras", "Terrace renovation", "Renovácia terás", "Регенерація терас");
  const lRequest = t("Poptat službu", "Request a quote", "Dopytovať službu", "Залишити заявку");
  const lAbout = t("O nás", "About", "O nás", "Про нас");
  const lReviews = t("Recenze", "Reviews", "Recenzie", "Відгуки");
  const lProcess = t("Postup", "Process", "Postup", "Процес");
  const address = COMPANY.contactAddress;
  const hours = t("Po–Ne, nonstop", "Mon–Sun, 24/7", "Po–Ne, nonstop", "Пн–Нд, цілодобово");
  const rights = t("Všechna práva vyhrazena.", "All rights reserved.", "Všetky práva vyhradené.", "Усі права захищені.");
  const privacy = t("Zásady ochrany osobních údajů", "Privacy policy", "Zásady ochrany osobných údajov", "Політика конфіденційності");
  const cookies = t("Zásady používání cookies", "Cookie policy", "Zásady používania cookies", "Політика cookie");
  const cookieSettings = t("Nastavení cookies", "Cookie settings", "Nastavenie cookies", "Налаштування cookie");
  const icoLabel = t("IČO", "Company ID", "IČO", "IČO");

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div>
            <Link href={`/${lang}`} className={styles.logo}>
              {/* eslint-disable-next-line @next/next/no-img-element -- SVG logo: nothing for the optimizer to do, width/height reserve the space */}
            <img src="/images/logo.svg" alt="" width={786} height={397} className={styles.logoImg} />
              <span className={styles.logoText}>ApexGold</span>
            </Link>
            <p className={styles.tagline}>{tagline}</p>
            {/*
              Only channels we actually run are linked. Placeholder href="#"
              buttons were removed — a dead link is worse than a missing one.
            */}
            <div className={styles.social}>
              <a
                href={`https://wa.me/${COMPANY.phone.replace(/\D/g, "")}`}
                aria-label="WhatsApp"
                className={styles.socialBtn}
                target="_blank"
                rel="noopener noreferrer"
              >
                WA
              </a>
            </div>
          </div>
          <div>
            <div className={styles.colTitle}>{colCleaning}</div>
            <div className={styles.colLinks}>
              <Link href={`/${lang}/generalni-uklid`}>{lGeneral}</Link>
              <Link href={`/${lang}/uklid-po-stavbe`}>{lPostBuild}</Link>
              <Link href={`/${lang}/myti-oken`}>{lWindows}</Link>
              <Link href={`/${lang}/cisteni-koberce-calouneni`}>{lCarpet}</Link>
              <Link href={`/${lang}/cisteni-a-voskovani-podlah`}>{lFloors}</Link>
              <Link href={`/${lang}/uklid-garazi-a-hal`}>{lHalls}</Link>
              <Link href={`/${lang}/myti-fasad`}>{lFacades}</Link>
            </div>
          </div>
          <div>
            <div className={styles.colTitle}>{colStone}</div>
            <div className={styles.colLinks}>
              <Link href={`/${lang}/renovace-mramoru`}>{lMarble}</Link>
              <Link href={`/${lang}/renovace-zuly`}>{lGranite}</Link>
              <Link href={`/${lang}/renovace-terasy`}>{lTerrace}</Link>
            </div>
          </div>
          <div>
            <div className={styles.colTitle}>{colCompany}</div>
            <div className={styles.colLinks}>
              <a href={`${anchorBase}#about`}>{lAbout}</a>
              <a href={`${anchorBase}#reviews`}>{lReviews}</a>
              <a href={`${anchorBase}#process`}>{lProcess}</a>
              <a href={hrefRequest}>{lRequest}</a>
            </div>
          </div>
          <div>
            <div className={styles.colTitle}>{colContacts}</div>
            <div className={styles.contact}>
              <a href="tel:+420775052281">{COMPANY.phone}</a>
              <a href="mailto:info@apexgold.cz">info@apexgold.cz</a>
              <span>{address}</span>
              <span>{hours}</span>
            </div>
          </div>
        </div>
        <div className={styles.identity}>
          <span className={styles.identityName}>{COMPANY.name}, {COMPANY.legalForm}</span>
          <span>{icoLabel}: {COMPANY.ico}</span>
          <span>{COMPANY.address}</span>
          <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
        </div>
        <div className={styles.bottom}>
          <span className={styles.copy}>© 2026 ApexGold. {rights}</span>
          <div className={styles.legal}>
            <Link href={`/${lang}/zasady-ochrany-osobnich-udaju`}>{privacy}</Link>
            <Link href={`/${lang}/zasady-cookies`}>{cookies}</Link>
            <button type="button" className={styles.legalBtn} onClick={openConsentSettings}>
              {cookieSettings}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
