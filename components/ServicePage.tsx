"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLang, pickTr3 } from "@/lib/i18n";
import { getLeadMeta } from "@/lib/leadMeta";
import { COMPANY } from "@/lib/company";
import { useReveal } from "@/lib/useReveal";
import { servicePageData, type ServiceSlug } from "@/lib/servicePageData";
import styles from "./ServicePage.module.css";

const ArrowIcon = ({ color = "#fff" }: { color?: string }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const SERVICE_OPTIONS = [
  "Úklid po stavbě",
  "Mytí oken",
  "Mytí koberců",
  "čištění čalounění",
  "Strojové čištění",
  "voskování podlah",
  "Čištění garáží",
  "úklid hal",
  "Mytí fasád",
  "Hrubé broušení + leštění",
  "Přebroušení + leštění",
  "Leštění",
  "Mytí + impregnace",
  "Mytí + impregnace",
  "Broušení + leštění",
  "Mytí + impregnace",
  "Broušení + voskování",
];

/** [cs, en, sk, uk] — the same order `t3` expects, so tuples can be spread into it. */
type Quad = readonly [string, string, string, string];

/** Gallery cells are two-up inside the page grid, full width on mobile. */
const GAL_SIZES = "(max-width: 1000px) 50vw, 25vw";

/**
 * Coverage is shown in two tiers: the home region (free survey, drives the local
 * "úklid <město>" queries) and the wider CZ/SK/DE reach, so the page does not read
 * as a Central-Bohemia-only provider.
 */
const HOME_ZONES = [
  "Praha",
  "Kladno",
  "Beroun",
  "Slaný",
  "Kralupy nad Vltavou",
  "Brandýs nad Labem",
  "Říčany",
  "Černošice",
  "Kolín",
  "Mělník",
  "Mladá Boleslav",
  "Benešov",
];

const WIDER_ZONES: readonly { country: Quad; cities: readonly Quad[] }[] = [
  {
    country: ["Celá ČR", "All of Czechia", "Celá ČR", "Уся Чехія"],
    cities: [
      ["Brno", "Brno", "Brno", "Брно"],
      ["Ostrava", "Ostrava", "Ostrava", "Острава"],
      ["Plzeň", "Pilsen", "Plzeň", "Пльзень"],
      ["Liberec", "Liberec", "Liberec", "Ліберець"],
      ["Hradec Králové", "Hradec Králové", "Hradec Králové", "Градець-Кралове"],
    ],
  },
  {
    country: ["Slovensko", "Slovakia", "Slovensko", "Словаччина"],
    cities: [
      ["Bratislava", "Bratislava", "Bratislava", "Братислава"],
      ["Košice", "Košice", "Košice", "Кошиці"],
      ["Žilina", "Žilina", "Žilina", "Жиліна"],
    ],
  },
  {
    country: ["Německo", "Germany", "Nemecko", "Німеччина"],
    cities: [
      ["Drážďany", "Dresden", "Drážďany", "Дрезден"],
      ["Berlín", "Berlin", "Berlín", "Берлін"],
      ["Lipsko", "Leipzig", "Lipsko", "Лейпциг"],
      ["Mnichov", "Munich", "Mníchov", "Мюнхен"],
    ],
  },
];

function PlaceholderPhoto({ label }: { label: string }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "flex-start",
        padding: 16,
        overflow: "hidden",
        background: "#E8EDE8",
        backgroundImage: "repeating-linear-gradient(135deg,rgba(74,124,89,.06) 0 1px,transparent 1px 18px)",
      }}
    >
      <span
        style={{
          fontFamily: "ui-monospace, monospace",
          fontSize: 11,
          lineHeight: 1.4,
          letterSpacing: ".06em",
          textTransform: "uppercase",
          color: "#6B8C75",
          background: "rgba(255,255,255,.75)",
          padding: "5px 10px",
          borderRadius: 999,
        }}
      >
        {label}
      </span>
    </div>
  );
}

type FormErrors = Partial<Record<
  "company" | "name" | "phone" | "email" | "city" | "objectType" | "address" | "consent",
  string
>>;

interface FormState {
  company: string;
  name: string;
  phone: string;
  email: string;
  service: string[];
  area: string;
  city: string;
  objectType: string;
  address: string;
  visitDate: string;
  comment: string;
  consent: boolean;
}

const emptyForm: FormState = {
  company: "",
  name: "",
  phone: "",
  email: "",
  service: [],
  area: "",
  city: "",
  objectType: "",
  address: "",
  visitDate: "",
  comment: "",
  consent: false,
};

export default function ServicePage({ slug }: { slug: ServiceSlug }) {
  const { lang, t3 } = useLang();
  const rootRef = useReveal<HTMLDivElement>();
  const d = servicePageData[slug];
  const tr = (v: { cs: string; en: string; sk: string; uk: string }) => pickTr3(v, lang);

  const [openFaq, setOpenFaq] = useState(0);
  const [cbPhone, setCbPhone] = useState("");
  const [cbStatus, setCbStatus] = useState<"form" | "done">("form");
  const [cbError, setCbError] = useState("");

  const [form, setForm] = useState<FormState>(emptyForm);
  const [status, setStatus] = useState<"form" | "loading" | "success">("form");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState("");

  const [serviceIdx, setServiceIdx] = useState<number[]>([]);
  const [serviceOpen, setServiceOpen] = useState(false);
  const serviceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (serviceRef.current && !serviceRef.current.contains(e.target as Node)) {
        setServiceOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function toggleService(i: number) {
    setServiceIdx((prev) => {
      const next = prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i];
      setForm((f) => ({ ...f, service: next.map((idx) => SERVICE_OPTIONS[idx]) }));
      return next;
    });
  }

  const set = useCallback(
    <K extends keyof FormState>(key: K) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
        setForm((f) => ({ ...f, [key]: value as FormState[K] }));
        setErrors((er) => {
          if (!(key in er)) return er;
          const next = { ...er };
          delete next[key as keyof FormErrors];
          return next;
        });
      },
    []
  );

  async function saveLead(rec: Record<string, unknown>): Promise<boolean> {
    // Send the application to the server (stored in SQLite, shown in /admin).
    // Marketing/technical metadata is attached only when cookies are accepted.
    // Returns true only when the server actually accepted the lead, so the UI
    // never shows a false "success" when nothing was saved.
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...rec, lang, meta: getLeadMeta() }),
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  function onSubmit() {
    const req = t3("Povinné pole", "Required field", "Povinné pole", "Обов’язкове поле");
    const er: FormErrors = {};
    if (!form.company.trim()) er.company = req;
    if (!form.name.trim()) er.name = req;
    if (!form.city.trim()) er.city = req;
    if (!form.objectType.trim()) er.objectType = req;
    if (!form.address.trim()) er.address = req;
    if (!form.phone.trim()) er.phone = t3("Zadejte telefon", "Enter phone number", "Zadajte telefón", "Введіть телефон");
    else if (form.phone.replace(/[^0-9]/g, "").length < 9) er.phone = t3("Zkontrolujte číslo", "Check the number", "Skontrolujte číslo", "Перевірте номер");
    if (!form.email.trim()) er.email = t3("Zadejte e-mail", "Enter e-mail", "Zadajte e-mail", "Введіть e-mail");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) er.email = t3("Neplatný e-mail", "Invalid e-mail", "Neplatný e-mail", "Некоректний e-mail");
    if (Object.keys(er).length) {
      setErrors(er);
      return;
    }
    setStatus("loading");
    setErrors({});
    setSubmitError("");
    // Keep the spinner up for a short minimum so the transition to the success
    // screen stays smooth even when the server responds almost instantly.
    const minLoading = new Promise((r) => setTimeout(r, 800));
    Promise.all([
      saveLead({ ...form, service: form.service.length ? form.service : [tr(d.crumb)] }),
      minLoading,
    ]).then(([ok]) => {
      if (ok) {
        setStatus("success");
      } else {
        // Keep the filled form so the visitor can simply retry.
        setStatus("form");
        setSubmitError(t3(
          "Nepodařilo se odeslat. Zkuste to prosím znovu nebo nám zavolejte.",
          "Could not send. Please try again or call us.",
          "Nepodarilo sa odoslať. Skúste to prosím znova alebo nám zavolajte.",
          "Не вдалося надіслати. Спробуйте ще раз або зателефонуйте нам."
        ));
      }
    });
  }

  async function onCbSubmit() {
    if (!cbPhone.trim() || cbPhone.replace(/[^0-9]/g, "").length < 9) {
      setCbError(t3("Zadejte platné telefonní číslo", "Enter a valid phone number", "Zadajte platné telefónne číslo", "Введіть дійсний номер телефону"));
      return;
    }
    setCbError("");
    const ok = await saveLead({ name: "(zpětné volání)", phone: cbPhone, email: "", service: tr(d.crumb), comment: "Žádost o zpětné volání" });
    if (ok) {
      setCbStatus("done");
    } else {
      setCbError(t3(
        "Nepodařilo se odeslat. Zkuste to prosím znovu.",
        "Could not send. Please try again.",
        "Nepodarilo sa odoslať. Skúste to prosím znova.",
        "Не вдалося надіслати. Спробуйте ще раз."
      ));
    }
  }

  // Gallery alts name the service and the stage, so each photo is described
  // rather than labelled "Foto PŘED" ten times over.
  const galleryAlt = (stage: "before" | "after" | "result") => {
    const service = tr(d.crumb).toLowerCase();
    if (stage === "before") return t3(`${service}, stav před realizací`, `${service}, before the work`, `${service}, stav pred realizáciou`, `${service}, стан до робіт`);
    if (stage === "after") return t3(`${service}, výsledek po realizaci`, `${service}, result after the work`, `${service}, výsledok po realizácii`, `${service}, результат після робіт`);
    return t3(`${service}, realizace ApexGold`, `${service}, an ApexGold project`, `${service}, realizácia ApexGold`, `${service}, виконана робота ApexGold`);
  };

  const odLabel = t3("od", "from", "od", "від");
  const related = d.related.map((s) => {
    const r = servicePageData[s as ServiceSlug];
    return {
      slug: s,
      title: tr(r.crumb),
      img: r.img,
      imgAlt: tr(r.heroImgAlt),
      price: `${odLabel} ${r.prices[0].price} ${r.prices[0].unit}`,
    };
  });

  const isSuccess = status === "success";
  const isLoading = status === "loading";
  const showError = Object.keys(errors).length > 0;

  return (
    <div ref={rootRef}>
      <Header base="/" />

      <main>

      {/* HERO */}
      <section className={styles.heroSection}>
        <div className={`${styles.hero} sp-hero`}>
          {/* The LCP element: loaded eagerly at high priority, never lazily. */}
          <Image
            src={d.img}
            alt={tr(d.heroImgAlt)}
            fill
            sizes="100vw"
            quality={80}
            loading="eager"
            fetchPriority="high"
          />
          <div className={`${styles.heroScrim} sp-hero-scrim`} />
          <div className={`${styles.heroPad} sp-hero-pad`}>
            <div className={styles.heroInner}>
              <nav className={styles.breadcrumb} aria-label={t3("Drobečková navigace", "Breadcrumb", "Navigácia", "Хлібні крихти")}>
                <Link href={`/${lang}`}>{t3("Domů", "Home", "Domov", "Головна")}</Link>
                <span style={{ opacity: 0.5 }}>›</span>
                <Link href={`/${lang}#services`}>{t3("Úklidové služby", "Cleaning services", "Upratovacie služby", "Клінінгові послуги")}</Link>
                <span style={{ opacity: 0.5 }}>›</span>
                <span className="current">{tr(d.crumb)}</span>
              </nav>
              <h1 className={styles.h1}>{tr(d.h1)}</h1>
              <p className={styles.heroSub}>{tr(d.heroSub)}</p>
              <div className={styles.heroBtns}>
                <a href="#poptavka" className="cta-primary">
                  {t3("Nezávazná poptávka", "Get a free quote", "Nezáväzný dopyt", "Безкоштовний запит")}
                  <ArrowIcon />
                </a>
                <a href="#cenik" className="cta-ghost">
                  {t3("Ceník", "Price list", "Cenník", "Прайс-лист")}
                </a>
              </div>
              <div className={styles.trustRow}>
                <span className={styles.dot} />
                <span className={styles.trustText}>
                  {t3("Kalkulace zdarma do 24 hodin · ", "Free quote within 24 hours · ", "Kalkulácia zdarma do 24 hodín · ", "Безкоштовний розрахунок протягом 24 годин · ")}
                  <strong style={{ color: "#fff", fontWeight: 700 }}>500+</strong>
                  {t3(" dokončených zakázek", " projects completed", " dokončených zákaziek", " виконаних об’єктів")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="sec-sm">
        <div className="W">
          <div className="sp-introgrid stagger">
            <div>
              <span className="eyebrow">{t3("O službě", "About the service", "O službe", "Про послугу")}</span>
              <h2 style={{ fontSize: "clamp(26px,2.6vw,36px)", fontWeight: 800, lineHeight: 1.12, marginTop: 14 }}>{tr(d.introTitle)}</h2>
            </div>
            <div>
              <p style={{ fontSize: 15.5, lineHeight: 1.75, color: "#3D4A42", margin: 0 }}>{tr(d.intro1)}</p>
              <p style={{ fontSize: 15.5, lineHeight: 1.75, color: "#3D4A42", margin: "16px 0 0" }}>{tr(d.intro2)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* SCOPE */}
      <section className="sec-sm" style={{ background: "#fff" }}>
        <div className="W">
          <div className={`stagger ${styles.sectionHead}`}>
            <span className="eyebrow">{t3("Rozsah prací", "Scope of work", "Rozsah prác", "Обсяг робіт")}</span>
            <h2>{t3("Co je součástí služby", "What’s included", "Čo je súčasťou služby", "Що входить до послуги")}</h2>
          </div>
          <div className="g2 stagger" style={{ gap: 14 }}>
            {d.included.map((inc, i) => (
              <div key={i} className={styles.includedCard}>
                <span className={styles.includedCheck}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0E5540" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </span>
                <span className={styles.includedText}>{tr(inc)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="sec" style={{ background: "#fff", borderTop: "1px solid rgba(14,85,64,.08)" }}>
        <div className="W">
          <div className={`stagger ${styles.sectionHead}`} style={{ marginBottom: 48 }}>
            <span className="eyebrow">{t3("Postup", "Process", "Postup", "Процес")}</span>
            <h2>{t3("Jak probíhá realizace", "How it works", "Ako prebieha realizácia", "Як відбувається виконання")}</h2>
          </div>
          <div className="sp-steps stagger">
            {d.steps.map((st) => (
              <div key={st.n}>
                <div className={styles.stepBadge}>{st.n}</div>
                <h3 className={styles.stepTitle}>{tr(st.title)}</h3>
                <p className={styles.stepText}>{tr(st.text)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICE LIST */}
      <section className="sec" id="cenik">
        <div className="W">
          <div className={`stagger ${styles.sectionHead}`}>
            <span className="eyebrow">{t3("Ceník", "Price list", "Cenník", "Прайс-лист")}</span>
            <h2>{tr(d.priceTitle)}</h2>
          </div>
          <div className="stagger">
            <div className={styles.priceCard}>
              <div className={styles.priceCardHead}>
                <span className={styles.name}>{tr(d.crumb)}</span>
                <span className={styles.from}>{t3("Ceny od", "Prices from", "Ceny od", "Ціни від")}</span>
              </div>
              <div className={styles.priceCardBody}>
                {d.prices.map((p, i) =>
                  p.href ? (
                    <a key={i} href={`/${lang}/${p.href}`} className="price-row">
                      <span style={{ fontSize: 14.5, fontWeight: 600, color: "#15201B", lineHeight: 1.35 }}>{tr(p.name)}</span>
                      <span className={styles.priceValueInline ?? ""} style={{ display: "inline-flex", alignItems: "baseline", gap: 4, whiteSpace: "nowrap", flexShrink: 0 }}>
                        <span style={{ fontSize: 11.5, color: "#8A968A", fontWeight: 500 }}>{odLabel}</span>
                        <strong style={{ fontSize: 16, fontWeight: 800, color: "#0E5540", letterSpacing: "-.01em" }}>{p.price}</strong>
                        <span style={{ fontSize: 11.5, color: "#8A968A" }}>{p.unit}</span>
                      </span>
                    </a>
                  ) : (
                    <div key={i} className="price-row">
                      <span style={{ fontSize: 14.5, fontWeight: 600, color: "#15201B", lineHeight: 1.35 }}>{tr(p.name)}</span>
                      <span style={{ display: "inline-flex", alignItems: "baseline", gap: 4, whiteSpace: "nowrap", flexShrink: 0 }}>
                        <span style={{ fontSize: 11.5, color: "#8A968A", fontWeight: 500 }}>{odLabel}</span>
                        <strong style={{ fontSize: 16, fontWeight: 800, color: "#0E5540", letterSpacing: "-.01em" }}>{p.price}</strong>
                        <span style={{ fontSize: 11.5, color: "#8A968A" }}>{p.unit}</span>
                      </span>
                    </div>
                  )
                )}
              </div>
              <p className={styles.priceCardNote}>
                {t3(
                  "Ceny jsou orientační, „od“. Přesnou kalkulaci připravíme zdarma po prohlídce objektu. Cena závisí na ploše, stavu povrchů a harmonogramu prací.",
                  "Prices are indicative, \"from\". We prepare an exact quote free of charge after an on-site survey. The cost depends on area, surface condition and schedule.",
                  "Ceny sú orientačné, „od“. Presnú kalkuláciu pripravíme zdarma po obhliadke objektu. Cena závisí od plochy, stavu povrchov a harmonogramu prác.",
                  "Ціни вказані орієнтовно, «від». Точний кошторис готуємо безкоштовно після огляду об’єкта. Вартість залежить від площі, стану поверхонь і графіка робіт."
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MID CTA + CALLBACK */}
      <section className={styles.ctaBanner}>
        <div className={`W ${styles.ctaBannerInner}`}>
          <div className={styles.ctaBand}>
            <div className={styles.ctaBannerCopy}>
              <h2>{t3("Nezávazná kalkulace do 24 hodin", "Free estimate within 24 hours", "Nezáväzná kalkulácia do 24 hodín", "Безкоштовний розрахунок протягом 24 годин")}</h2>
              <p>
                {t3(
                  "Nechte nám telefon. Manažer se ozve, domluví prohlídku a připraví přesnou nabídku. Nebo volejte přímo: ",
                  "Leave us your phone number. A manager will call, arrange a survey and prepare an exact offer. Or call us directly: ",
                  "Nechajte nám telefón. Manažér sa ozve, dohodne obhliadku a pripraví presnú ponuku. Alebo volajte priamo: ",
                  "Залиште нам телефон. Менеджер зателефонує, домовиться про огляд і підготує точну пропозицію. Або телефонуйте напряму: "
                )}
                <a href="tel:+420775391773">{COMPANY.phone}</a>
              </p>
            </div>
            {cbStatus === "form" ? (
              <div className={styles.cbForm}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <input
                    type="tel"
                    value={cbPhone}
                    onChange={(e) => {
                      setCbPhone(e.target.value);
                      setCbError("");
                    }}
                    placeholder="+420 ___ ___ ___"
                    className={`${styles.cbInput} ${cbError ? styles.hasError : ""}`}
                  />
                  <span className={styles.cbError}>{cbError}</span>
                </div>
                <button type="button" onClick={onCbSubmit} className={styles.cbButton}>
                  {t3("Zavolejte mi zpět", "Call me back", "Zavolajte mi späť", "Передзвоніть мені")}
                </button>
              </div>
            ) : (
              <div className={styles.cbDone}>
                <span className={styles.cbDoneIcon}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#08281E" strokeWidth="2.6" strokeLinecap="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </span>
                <span style={{ fontSize: 14.5, fontWeight: 700, color: "#fff" }}>
                  {t3("Děkujeme! Ozveme se vám co nejdříve.", "Thank you! We will get back to you shortly.", "Ďakujeme! Ozveme sa vám čo najskôr.", "Дякуємо! Ми зв’яжемося з вами найближчим часом.")}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* BEFORE / AFTER */}
      {slug !== "myti-fasad" && slug !== "generalni-uklid" && (
        <section className="sec">
          <div className="W">
            <div className={`stagger ${styles.sectionHead}`}>
              <span className="eyebrow">{t3("Výsledky", "Results", "Výsledky", "Результати")}</span>
              <h2>{t3("Před a po", "Before and after", "Pred a po", "До і після")}</h2>
            </div>
            <div className={`stagger ${(d.gallery ?? [null, null]).length === 1 ? styles.galGridSingle : "g2"}`}>
              {(d.gallery ?? [null, null]).map((item, i) => (
                <div key={i} className={styles.galCard}>
                  <div className={`sp-gal-pair ${styles.galPair}`}>
                    {item === null ? (
                      <>
                        <div className={styles.galImg}>
                          <PlaceholderPhoto label={t3("Foto PŘED", "BEFORE photo", "Foto PRED", "Фото ДО")} />
                          <span className={styles.galLabel}>{t3("Před", "Before", "Pred", "До")}</span>
                        </div>
                        <div className={styles.galImg}>
                          <PlaceholderPhoto label={t3("Foto PO", "AFTER photo", "Foto PO", "Фото ПІСЛЯ")} />
                          <span className={styles.galLabelAfter}>{t3("Po", "After", "Po", "Після")}</span>
                        </div>
                      </>
                    ) : item.type === "before-after" ? (
                      <>
                        <div className={styles.galImg}>
                          <Image src={item.before} alt={galleryAlt("before")} fill sizes={GAL_SIZES} />
                          <span className={styles.galLabel}>{t3("Před", "Before", "Pred", "До")}</span>
                        </div>
                        <div className={styles.galImg}>
                          <Image src={item.after} alt={galleryAlt("after")} fill sizes={GAL_SIZES} />
                          <span className={styles.galLabelAfter}>{t3("Po", "After", "Po", "Після")}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className={styles.galImg}>
                          <Image src={item.images[0]} alt={galleryAlt("result")} fill sizes={GAL_SIZES} />
                        </div>
                        <div className={styles.galImg}>
                          <Image src={item.images[1]} alt={galleryAlt("result")} fill sizes={GAL_SIZES} />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <p className={`stagger ${styles.galCaption}`}>
              {t3(
                "Fotografie z realizací průběžně doplňujeme. Fotoreport z vlastní zakázky obdrží každý klient.",
                "We continuously add photos from completed jobs. Every client receives a photo report from their own project.",
                "Fotografie z realizácií priebežne dopĺňame. Fotoreport z vlastnej zákazky dostane každý klient.",
                "Фотографії з виконаних робіт постійно доповнюємо. Фотозвіт з власного замовлення отримує кожен клієнт."
              )}
            </p>
          </div>
        </section>
      )}

      {/* WHO FOR */}
      <section className="sec" style={{ background: "#fff" }}>
        <div className="W">
          <div className={`stagger ${styles.sectionHead}`}>
            <span className="eyebrow">{t3("Využití", "Who it’s for", "Využitie", "Використання")}</span>
            <h2>{t3("Pro koho je služba vhodná", "Who this service suits", "Pre koho je služba vhodná", "Кому підходить ця послуга")}</h2>
          </div>
          <div className="g2 stagger" style={{ gap: 16 }}>
            {d.who.map((w, i) => (
              <div key={i} className={styles.whoCard}>
                <h3>{tr(w.title)}</h3>
                <p>{tr(w.text)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="sec">
        <div className="W">
          <div className={`stagger ${styles.sectionHead}`}>
            <span className="eyebrow">FAQ</span>
            <h2>{t3("Časté dotazy", "Frequently asked questions", "Časté otázky", "Часті запитання")}</h2>
          </div>
          <div className={`stagger ${styles.faqList}`}>
            {d.faqs.map((f, i) => {
              const open = openFaq === i;
              const answerId = `faq-answer-${i}`;
              return (
                <div key={i} className={styles.faqItem}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? -1 : i)}
                    className={styles.faqQ}
                    aria-expanded={open}
                    aria-controls={answerId}
                  >
                    <span>{tr(f.q)}</span>
                    <span className={`${styles.faqChev} ${open ? styles.open : ""}`}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0E5540" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </span>
                  </button>
                  <div id={answerId} className={`${styles.faqAWrap} ${open ? styles.open : ""}`}>
                    <div className={styles.faqAInner}>
                      <p className={styles.faqA}>{tr(f.a)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SERVICE ZONE */}
      <section className="sec-sm" style={{ background: "#fff" }}>
        <div className="W">
          <div className="sp-introgrid stagger">
            <div>
              <span className="eyebrow">{t3("Dojezd", "Coverage area", "Dojazd", "Зона обслуговування")}</span>
              <h2 style={{ fontSize: "clamp(26px,2.6vw,36px)", fontWeight: 800, lineHeight: 1.12, marginTop: 14 }}>
                {t3(
                  "Kde působíme: Česko, Slovensko a Německo",
                  "Where we operate: Czechia, Slovakia and Germany",
                  "Kde pôsobíme: Česko, Slovensko a Nemecko",
                  "Де ми працюємо: Чехія, Словаччина та Німеччина"
                )}
              </h2>
            </div>
            <div>
              <p className={styles.zoneText}>
                {t3(
                  "Sídlíme v Praze, ale nejsme jen regionální firma: zakázky realizujeme v celé České republice a po dohodě také na Slovensku a v Německu. Pro projekty mimo domovský region připravíme kalkulaci včetně dopravy a ubytování týmu. U větších objektů bývá cesta zahrnuta v ceně.",
                  "We are based in Prague, but we are not a regional company: we take on jobs across the whole Czech Republic and, by arrangement, in Slovakia and Germany as well. For projects outside our home region we prepare a quote that includes the team's travel and accommodation. On larger sites the trip is usually included in the price.",
                  "Sídlime v Prahe, ale nie sme len regionálna firma: zákazky realizujeme v celej Českej republike a po dohode aj na Slovensku a v Nemecku. Pri projektoch mimo domovského regiónu pripravíme kalkuláciu vrátane dopravy a ubytovania tímu. Pri väčších objektoch býva cesta zahrnutá v cene.",
                  "Ми базуємось у Празі, але не є суто регіональною компанією: виконуємо замовлення по всій Чехії, а за домовленістю також у Словаччині та Німеччині. Для проєктів поза домашнім регіоном готуємо кошторис із урахуванням дороги та проживання команди. На великих об’єктах виїзд зазвичай уже входить у ціну."
                )}
              </p>

              <div className={styles.zoneGroup}>
                <h3 className={styles.zoneGroupTitle}>
                  {t3(
                    "Praha a Středočeský kraj: prohlídka a kalkulace zdarma",
                    "Prague and Central Bohemia: free site survey and quote",
                    "Praha a Stredočeský kraj: obhliadka a kalkulácia zdarma",
                    "Прага та Середньочеський край: огляд і кошторис безкоштовно"
                  )}
                </h3>
                <div className={styles.zoneList}>
                  {HOME_ZONES.map((z) => (
                    <span key={z} className={styles.zoneTag}>
                      <span />
                      {z}
                    </span>
                  ))}
                </div>
              </div>

              <div className={styles.zoneGroup}>
                <h3 className={styles.zoneGroupTitle}>
                  {t3(
                    "Zbytek Česka, Slovensko a Německo: po dohodě, s dopravou v kalkulaci",
                    "The rest of Czechia, Slovakia and Germany: by arrangement, travel included in the quote",
                    "Zvyšok Česka, Slovensko a Nemecko: po dohode, s dopravou v kalkulácii",
                    "Решта Чехії, Словаччина та Німеччина: за домовленістю, дорога у кошторисі"
                  )}
                </h3>
                {WIDER_ZONES.map((g) => (
                  <div key={g.country[0]} className={styles.zoneList}>
                    <span className={`${styles.zoneTag} ${styles.zoneTagCountry}`}>{t3(...g.country)}</span>
                    {g.cities.map((c) => (
                      <span key={c[0]} className={styles.zoneTag}>
                        <span />
                        {t3(...c)}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REQUEST FORM */}
      <section className="sec" id="poptavka" style={{ background: "#0E5540" }}>
        <div className="W">
          <div className="sp-formgrid">
            <div className={`stagger ${styles.formIntro}`}>
              <span className={styles.formKicker}>
                {t3("Poptávka: ", "Request: ", "Dopyt: ", "Заявка: ")}
                {tr(d.crumb)}
              </span>
              <h2>{t3("Nechte starosti s úklidem na nás.", "Leave the cleaning worries to us.", "Starosti s upratovaním nechajte na nás.", "Залиште турботи про прибирання нам.")}</h2>
              <p>
                {t3(
                  "Vyplňte krátký formulář a my se postaráme o zbytek. Manažer si s vámi domluví termín návštěvy, zdarma přijede posoudit objekt a připraví přesnou kalkulaci podle skutečného rozsahu prací.",
                  "Fill in a short form and we will take care of the rest. A manager will arrange a visit with you, come to assess the property free of charge and prepare an exact quote based on the actual scope of work.",
                  "Vyplňte krátky formulár a my sa postaráme o zvyšok. Manažér si s vami dohodne termín návštevy, zdarma príde posúdiť objekt a pripraví presnú kalkuláciu podľa skutočného rozsahu prác.",
                  "Заповніть коротку форму, а решту ми візьмемо на себе. Менеджер узгодить із вами час візиту, безкоштовно приїде оцінити об’єкт і підготує точний розрахунок відповідно до реального обсягу робіт."
                )}
              </p>
              <div className={styles.contactList}>
                <div className={styles.contactItem}>
                  <span className={styles.contactIcon}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.7)" strokeWidth="1.8" strokeLinecap="round">
                      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.4 2.1L8.1 9.5a16 16 0 0 0 6 6l1.1-1.1a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2z" />
                    </svg>
                  </span>
                  <div>
                    <div className={styles.contactLabel}>{t3("Telefon", "Phone", "Telefón", "Телефон")}</div>
                    <a href="tel:+420775391773" className={styles.contactValue}>{COMPANY.phone}</a>
                  </div>
                </div>
                <div className={styles.contactItem}>
                  <span className={styles.contactIcon}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.7)" strokeWidth="1.8" strokeLinecap="round">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="M2 7l10 6 10-6" />
                    </svg>
                  </span>
                  <div>
                    <div className={styles.contactLabel}>E-mail</div>
                    <a href="mailto:poptavky@apexgold.cz" className={styles.contactValue} style={{ color: "#C5E8D6" }}>poptavky@apexgold.cz</a>
                  </div>
                </div>
                <div className={styles.contactItem}>
                  <span className={styles.contactIcon}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.7)" strokeWidth="1.8" strokeLinecap="round">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 7v5l3 2" />
                    </svg>
                  </span>
                  <div>
                    <div className={styles.contactLabel}>{t3("Pracovní doba", "Working hours", "Pracovný čas", "Години роботи")}</div>
                    <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{t3("Po–Ne, 24/7", "Mon–Sun, 24/7", "Po–Ne, 24/7", "Пн–Нд, 24/7")}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={`stagger ${styles.formPanel}`}>
              {isSuccess ? (
                <div className={`${styles.successBox} vis`}>
                  <span className={styles.successIcon}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0E5540" strokeWidth="2.2" strokeLinecap="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </span>
                  <h3>{t3("Poptávka přijata!", "Request received!", "Dopyt prijatý!", "Заявку прийнято!")}</h3>
                  <p>{t3("Manažer ApexGold vás brzy kontaktuje.", "An ApexGold manager will contact you shortly.", "Manažér ApexGold vás čoskoro kontaktuje.", "Менеджер ApexGold незабаром зв’яжеться з вами.")}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setStatus("form");
                      setErrors({});
                      setForm(emptyForm);
                      setServiceIdx([]);
                    }}
                    className={styles.resetBtn}
                  >
                    {t3("Odeslat další", "Send another", "Odoslať ďalší", "Надіслати ще одну")}
                  </button>
                </div>
              ) : (
                <div className={`${styles.formFields} vis`}>
                  <div className="form-row">
                    <div>
                      <label className={styles.fieldLabel}>{t3("Společnost *", "Company *", "Spoločnosť *", "Компанія *")}</label>
                      <input type="text" value={form.company} onChange={set("company")} placeholder={t3("Název společnosti", "Company name", "Názov spoločnosti", "Назва компанії")} className={`field-input ${errors.company ? "has-error" : ""}`} />
                      <span className="field-error">{errors.company || ""}</span>
                    </div>
                    <div>
                      <label className={styles.fieldLabel}>{t3("Jméno a příjmení *", "Full name *", "Meno a priezvisko *", "Ім’я та прізвище *")}</label>
                      <input type="text" value={form.name} onChange={set("name")} placeholder={t3("Jan Novák", "John Smith", "Ján Novák", "Іван Іванов")} className={`field-input ${errors.name ? "has-error" : ""}`} />
                      <span className="field-error">{errors.name || ""}</span>
                    </div>
                  </div>
                  <div className="form-row">
                    <div>
                      <label className={styles.fieldLabel}>{t3("Telefon *", "Phone *", "Telefón *", "Телефон *")}</label>
                      <input type="tel" value={form.phone} onChange={set("phone")} placeholder="+420 ___ ___ ___" className={`field-input ${errors.phone ? "has-error" : ""}`} />
                      <span className="field-error">{errors.phone || ""}</span>
                    </div>
                    <div>
                      <label className={styles.fieldLabel}>E-mail</label>
                      <input type="email" value={form.email} onChange={set("email")} placeholder={t3("jmeno@firma.cz", "name@company.com", "meno@firma.sk", "imya@firma.ua")} className={`field-input ${errors.email ? "has-error" : ""}`} />
                      <span className="field-error">{errors.email || ""}</span>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className={styles.multiSelect} ref={serviceRef}>
                      <label className={styles.fieldLabel}>{t3("Služba", "Service", "Služba", "Послуга")}</label>
                      <button
                        type="button"
                        className={styles.multiSelectTrigger}
                        onClick={() => setServiceOpen((o) => !o)}
                      >
                        <span className={styles.multiSelectTriggerText}>
                          {form.service.length
                            ? form.service.join(", ")
                            : t3("Vyberte služby", "Select services", "Vyberte služby", "Виберіть послуги")}
                        </span>
                        <ArrowIcon color="#1F4D37" />
                      </button>
                      {serviceOpen && (
                        <div className={styles.multiSelectPanel}>
                          {SERVICE_OPTIONS.map((opt, i) => (
                            <label key={i} className={styles.multiSelectOption}>
                              <input
                                type="checkbox"
                                checked={serviceIdx.includes(i)}
                                onChange={() => toggleService(i)}
                              />
                              <span>{opt}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className={styles.fieldLabel}>{t3("Plocha, m²", "Area, m²", "Plocha, m²", "Площа, м²")}</label>
                      <input type="number" min={1} value={form.area} onChange={set("area")} placeholder="350" className="field-input" />
                    </div>
                  </div>
                  <div className="form-row">
                    <div>
                      <label className={styles.fieldLabel}>{t3("Město *", "City *", "Mesto *", "Місто *")}</label>
                      <input type="text" value={form.city} onChange={set("city")} placeholder={t3("Praha", "Prague", "Praha", "Прага")} className={`field-input ${errors.city ? "has-error" : ""}`} />
                      <span className="field-error">{errors.city || ""}</span>
                    </div>
                    <div>
                      <label className={styles.fieldLabel}>{t3("Typ objektu *", "Property type *", "Typ objektu *", "Тип об’єкта *")}</label>
                      <input type="text" value={form.objectType} onChange={set("objectType")} placeholder={t3("kancelář", "office", "kancelária", "офіс")} className={`field-input ${errors.objectType ? "has-error" : ""}`} />
                      <span className="field-error">{errors.objectType || ""}</span>
                    </div>
                  </div>
                  <div className="form-row">
                    <div>
                      <label className={styles.fieldLabel}>{t3("Adresa *", "Address *", "Adresa *", "Адреса *")}</label>
                      <input type="text" value={form.address} onChange={set("address")} placeholder={t3("Vinohradská 12, Praha 2", "Vinohradská 12, Prague 2", "Vinohradská 12, Praha 2", "Виноградська 12, Прага 2")} className={`field-input ${errors.address ? "has-error" : ""}`} />
                      <span className="field-error">{errors.address || ""}</span>
                    </div>
                    <div>
                      <label className={styles.fieldLabel}>{t3("Preferovaný termín prohlídky", "Preferred inspection date", "Preferovaný termín obhliadky", "Бажана дата огляду")}</label>
                      <input type="date" value={form.visitDate} onChange={set("visitDate")} className="field-input" />
                    </div>
                  </div>
                  <div>
                    <label className={styles.fieldLabel}>{t3("Komentář", "Comment", "Komentár", "Коментар")}</label>
                    <textarea value={form.comment} onChange={set("comment")} rows={3} placeholder={t3("Popište objekt, termín nebo specifika zakázky", "Describe the site, timing or specifics of the job", "Opíšte objekt, termín alebo špecifiká zákazky", "Опишіть об’єкт, терміни або особливості завдання")} className="field-textarea" />
                  </div>
                  <p className={styles.consentNote}>
                    {t3(
                      "Odesláním formuláře souhlasíte se zpracováním osobních údajů pro vyřízení poptávky. Více v ",
                      "By submitting the form you agree to the processing of personal data to handle your request. More in the ",
                      "Odoslaním formulára súhlasíte so spracovaním osobných údajov na vybavenie dopytu. Viac v ",
                      "Надсиланням форми ви погоджуєтесь на обробку персональних даних для опрацювання запиту. Докладніше в "
                    )}
                    <Link href={`/${lang}/zasady-ochrany-osobnich-udaju`} className={styles.consentLink}>
                      {t3("Zásadách zpracování osobních údajů", "Personal data processing policy", "Zásadách spracovania osobných údajov", "Політиці обробки персональних даних")}
                    </Link>
                    .
                  </p>
                  {showError && <div className={styles.errorBanner}>{t3("Vyplňte zvýrazněná pole.", "Please fill in the highlighted fields.", "Vyplňte zvýraznené polia.", "Заповніть виділені поля.")}</div>}
                  {submitError && <div className={styles.errorBanner}>{submitError}</div>}
                  <button type="button" onClick={onSubmit} disabled={isLoading} className="submit-btn">
                    {isLoading && <span className={styles.spinner} />}
                    {isLoading ? t3("Odesíláme…", "Sending…", "Odosielame…", "Надсилаємо…") : t3("Odeslat poptávku", "Submit request", "Odoslať dopyt", "Надіслати заявку")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* RELATED */}
      <section className="sec">
        <div className="W">
          <div className={`stagger ${styles.sectionHead}`}>
            <span className="eyebrow">{t3("Další služby", "Related services", "Ďalšie služby", "Інші послуги")}</span>
            <h2>{t3("Mohlo by se vám hodit", "You might also need", "Mohlo by sa vám hodiť", "Може вам знадобиться")}</h2>
          </div>
          <div className="g3 stagger">
            {related.map((r) => (
              <a key={r.slug} href={`/${lang}/${r.slug}`} className="related-card">
                <div className={styles.relatedImgWrap}>
                  <Image src={r.img} alt={r.imgAlt} fill sizes="(max-width: 1000px) 100vw, 33vw" />
                  <div className={styles.relatedScrim} />
                  <h3 className={styles.relatedTitle}>{r.title}</h3>
                </div>
                <div className={styles.relatedFooter}>
                  <span className={styles.relatedPrice}>{r.price}</span>
                  <span className={styles.relatedMore}>
                    {t3("Zjistit více", "Learn more", "Zistiť viac", "Дізнатися більше")}
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#25B373" strokeWidth="2.4" strokeLinecap="round">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      </main>

      <Footer base="/" />
    </div>
  );
}
