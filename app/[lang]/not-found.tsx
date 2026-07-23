"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLang } from "@/lib/i18n";
import styles from "./not-found.module.css";

// Faint decorative bubbles — position/size/delay tuned by hand, not random,
// so the layout is stable between renders.
const BUBBLES = [
  { top: "14%", left: "8%", size: 90, delay: "0s" },
  { top: "62%", left: "16%", size: 54, delay: "1.4s" },
  { top: "24%", left: "84%", size: 120, delay: "0.8s" },
  { top: "70%", left: "78%", size: 70, delay: "2.1s" },
  { top: "44%", left: "50%", size: 40, delay: "1.1s" },
];

export default function NotFound() {
  const { t, lang } = useLang();

  const eyebrow = t("Chyba 404", "Error 404", "Chyba 404", "Помилка 404");
  const heading = t(
    "Tato stránka se ztratila v úklidu",
    "This page got lost in the cleanup",
    "Táto stránka sa stratila pri upratovaní",
    "Ця сторінка загубилася під час прибирання"
  );
  const sub = t(
    "Stránku, kterou hledáte, se nám nepodařilo najít. Možná byla přesunuta nebo už neexistuje. Pojďme vás vrátit tam, kde je čisto.",
    "We couldn't find the page you're looking for. It may have moved or no longer exists. Let's get you back to a spotless start.",
    "Stránku, ktorú hľadáte, sa nám nepodarilo nájsť. Možno bola presunutá alebo už neexistuje. Vráťme vás tam, kde je čisto.",
    "Сторінку, яку ви шукаєте, не вдалося знайти. Можливо, її переміщено або вона більше не існує. Повернімо вас туди, де чисто."
  );
  const ctaHome = t("Zpět na hlavní stránku", "Back to homepage", "Späť na hlavnú stránku", "На головну сторінку");
  const ctaServices = t("Prohlédnout služby", "Browse services", "Prehliadnuť služby", "Переглянути послуги");
  const quickLabel = t("Oblíbené služby", "Popular services", "Obľúbené služby", "Популярні послуги");

  const quickLinks = [
    {
      slug: "generalni-uklid",
      label: t("Generální úklid", "General cleaning", "Generálne upratovanie", "Генеральне прибирання"),
    },
    {
      slug: "uklid-po-stavbe",
      label: t("Úklid po stavbě", "Post-construction cleaning", "Upratovanie po stavbe", "Прибирання після будівництва"),
    },
    {
      slug: "myti-oken",
      label: t("Mytí oken", "Window cleaning", "Umývanie okien", "Миття вікон"),
    },
    {
      slug: "renovace-mramoru",
      label: t("Renovace mramoru", "Marble restoration", "Renovácia mramoru", "Реставрація мармуру"),
    },
  ];

  return (
    <div className={styles.page}>
      <Header base="/" noForm />

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.bubbles} aria-hidden="true">
            {BUBBLES.map((b, i) => (
              <span
                key={i}
                className={styles.bubble}
                style={{ top: b.top, left: b.left, width: b.size, height: b.size, animationDelay: b.delay }}
              />
            ))}
          </div>

          <div className={styles.inner}>
            <span className={styles.eyebrow}>{eyebrow}</span>

            <div className={styles.code} aria-hidden="true">
              <span>4</span>
              <span className={styles.orb}>
                <span className={styles.orbRing} />
                <span className={styles.orbShine} />
              </span>
              <span>4</span>
            </div>

            <h1 className={styles.h1}>{heading}</h1>
            <p className={styles.sub}>{sub}</p>

            <div className={styles.btns}>
              <Link href={`/${lang}`} className={styles.primary}>
                {ctaHome}
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link href={`/${lang}#services`} className={styles.ghost}>
                {ctaServices}
              </Link>
            </div>

            <div className={styles.quick}>
              <div className={styles.quickLabel}>{quickLabel}</div>
              <div className={styles.quickLinks}>
                {quickLinks.map((q) => (
                  <Link key={q.slug} href={`/${lang}/${q.slug}`} className={styles.chip}>
                    {q.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer base="/" noForm />
    </div>
  );
}
